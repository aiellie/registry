/**
 * Matching for the block viewer's file search. Kept free of React so the
 * regex rules stay readable on their own, and deliberately client-side: the
 * pattern comes from a text box, and catastrophic backtracking should cost the
 * tab that typed it rather than the server.
 */

export type SearchOptions = {
  matchCase: boolean
  wholeWord: boolean
  useRegex: boolean
}

export type SourceFile = {
  target: string
  path: string
  content: string
}

/** One hit inside one line, with the offsets needed to highlight it. */
export type LineMatch = {
  /** 1-based, matching what the code pane's gutter shows. */
  line: number
  /** The line, leading indentation trimmed for display. */
  text: string
  start: number
  end: number
  /** What this hit becomes under the current replace field. */
  replacement: string | null
}

export type FileMatches = {
  target: string
  name: string
  directory: string
  matches: LineMatch[]
  /** Hits beyond `MAX_MATCHES_PER_FILE` that were counted but not listed. */
  hidden: number
}

/** Enough to be useful without rendering thousands of rows into the panel. */
const MAX_MATCHES_PER_FILE = 50
const MAX_TOTAL_MATCHES = 2000
/** Long minified lines make the results unreadable, so they get windowed. */
const MAX_LINE_LENGTH = 240

export class InvalidPatternError extends Error {}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * Compiles the query into a global regex. Whole-word wraps the pattern in
 * `\b`, which — as in VS Code — only bites when the pattern's own edges are
 * word characters. Throws `InvalidPatternError` for an unparseable regex so
 * the panel can show the message inline instead of blanking the results.
 */
export function buildMatcher(
  query: string,
  { matchCase, wholeWord, useRegex }: SearchOptions
): RegExp | null {
  if (!query) {
    return null
  }

  const source = useRegex ? query : escapeRegExp(query)
  const pattern = wholeWord ? `\\b(?:${source})\\b` : source

  try {
    return new RegExp(pattern, matchCase ? "g" : "gi")
  } catch (error) {
    throw new InvalidPatternError(
      error instanceof Error ? error.message : "Invalid regular expression"
    )
  }
}

/**
 * Every match of `matcher` in `text`. `exec` with a global regex can return a
 * zero-length match (`a*`, `^`), which leaves `lastIndex` where it was — so
 * empty hits are stepped over by hand rather than looping forever.
 */
function* eachMatch(matcher: RegExp, text: string) {
  matcher.lastIndex = 0

  let match: RegExpExecArray | null
  while ((match = matcher.exec(text)) !== null) {
    if (match[0].length === 0) {
      matcher.lastIndex += 1
      continue
    }

    yield match
  }
}

/** Splits a path into its file name and the directory leading to it. */
export function splitTarget(target: string) {
  const slash = target.lastIndexOf("/")

  return {
    name: slash === -1 ? target : target.slice(slash + 1),
    directory: slash === -1 ? "" : target.slice(0, slash),
  }
}

/**
 * Trims indentation and windows very long lines around the hit, keeping the
 * match offsets pointing at the right characters afterwards.
 */
function windowLine(text: string, start: number, end: number) {
  const indent = text.length - text.trimStart().length
  let trimmed = text.slice(indent)
  let offset = indent

  if (trimmed.length > MAX_LINE_LENGTH) {
    // Keep the match in frame, with a little context ahead of it.
    const from = Math.max(0, start - offset - 40)
    trimmed = trimmed.slice(from, from + MAX_LINE_LENGTH)
    offset += from
  }

  return {
    text: trimmed,
    start: Math.max(0, start - offset),
    end: Math.max(0, end - offset),
  }
}

/**
 * Search across file contents. `replacement` is resolved per hit so the
 * results can show the before/after pair the way VS Code does.
 */
export function searchContents(
  files: SourceFile[],
  matcher: RegExp,
  replace: { value: string; enabled: boolean; preserveCase: boolean } | null
): { results: FileMatches[]; total: number; truncated: boolean } {
  const results: FileMatches[] = []
  let total = 0
  let truncated = false

  for (const file of files) {
    if (total >= MAX_TOTAL_MATCHES) {
      truncated = true
      break
    }

    const matches: LineMatch[] = []
    let hidden = 0
    const lines = file.content.split("\n")

    for (const [index, line] of lines.entries()) {
      for (const match of eachMatch(matcher, line)) {
        total += 1

        if (matches.length >= MAX_MATCHES_PER_FILE) {
          hidden += 1
          continue
        }

        const start = match.index
        const end = match.index + match[0].length
        const windowed = windowLine(line, start, end)

        matches.push({
          line: index + 1,
          ...windowed,
          replacement: replace?.enabled
            ? expandReplacement(match, replace.value, replace.preserveCase)
            : null,
        })
      }
    }

    if (matches.length > 0) {
      results.push({
        target: file.target,
        ...splitTarget(file.target),
        matches,
        hidden,
      })
    }
  }

  return { results, total, truncated }
}

/** Search file names and paths — the flat filter, not the content search. */
export function searchNames(targets: string[], matcher: RegExp | null) {
  return targets.flatMap((target) => {
    const { name, directory } = splitTarget(target)
    const blank = {
      target,
      name,
      directory,
      nameStart: -1,
      nameEnd: -1,
      dirStart: -1,
      dirEnd: -1,
    }

    if (!matcher) {
      return [blank]
    }

    // Match against the whole path, so a pattern like
    // `^components/ui/.*\.tsx$` works, then fold the hit back onto whichever
    // of the two displayed segments it actually covers.
    const [hit] = [...eachMatch(matcher, target)]

    if (!hit) {
      return []
    }

    const start = hit.index
    const end = start + hit[0].length
    const nameOffset = directory ? directory.length + 1 : 0

    const dirEnd = Math.min(end, directory.length)
    const inDirectory = Boolean(directory) && dirEnd > start
    const nameStart = Math.max(start, nameOffset) - nameOffset
    const nameEnd = end - nameOffset
    const inName = nameEnd > nameStart && nameEnd > 0

    return [
      {
        ...blank,
        nameStart: inName ? nameStart : -1,
        nameEnd: inName ? nameEnd : -1,
        dirStart: inDirectory ? start : -1,
        dirEnd: inDirectory ? dirEnd : -1,
      },
    ]
  })
}

/**
 * Mirrors the casing of the text being replaced — VS Code's "Preserve Case".
 * Only all-caps and leading-capital are worth detecting; anything else is left
 * as the user typed it.
 */
function matchCasing(source: string, replacement: string) {
  if (!replacement) {
    return replacement
  }

  if (source.toUpperCase() === source && source.toLowerCase() !== source) {
    return replacement.toUpperCase()
  }

  if (source[0] === source[0]?.toUpperCase()) {
    return replacement[0].toUpperCase() + replacement.slice(1)
  }

  return replacement
}

/** Resolves `$1`-style group references against one match. */
function expandReplacement(
  match: RegExpExecArray,
  replacement: string,
  preserveCase: boolean
) {
  const expanded = replacement.replace(/\$(\d{1,2}|[$&])/g, (token, key) => {
    if (key === "$") return "$"
    if (key === "&") return match[0]

    const group = match[Number(key)]
    return group ?? ""
  })

  return preserveCase ? matchCasing(match[0], expanded) : expanded
}

/**
 * The file's content with every hit replaced — what "Replace all" hands to the
 * code pane. Nothing is written to disk; the result only ever feeds the
 * preview and the copy/download buttons.
 */
export function replaceAll(
  content: string,
  matcher: RegExp,
  replacement: string,
  preserveCase: boolean
) {
  let out = ""
  let cursor = 0
  let count = 0

  for (const match of eachMatch(matcher, content)) {
    out += content.slice(cursor, match.index)
    out += expandReplacement(match, replacement, preserveCase)
    cursor = match.index + match[0].length
    count += 1
  }

  return { content: out + content.slice(cursor), count }
}
