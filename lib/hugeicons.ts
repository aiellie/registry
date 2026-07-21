import type { IconSvgElement } from "@hugeicons/react"

/** One SVG element, verbatim from the package minus its array-index `key`. */
export type CompactElement = Record<string, string | number> & { t?: string }

/** `[canonical, ...aliases]` — the manifest's positional icon record. */
export type IconRecord = [string, ...string[]]

export interface IconCategory {
  id: string
  label: string
  /**
   * Members present in the free package. Deliberately not the count HugeIcons
   * publishes — theirs includes pro-only icons this page cannot render.
   */
  count: number
  /** Canonical name of the icon the site uses to represent the category. */
  rep: string | null
}

/** The manifest header — the counts the page can render before fetching anything. */
export interface IconsMeta {
  version: string
  schema: number
  shardSize: number
  shardCount: number
  count: number
  categoryCount: number
}

export interface IconManifest extends Omit<IconsMeta, "categoryCount"> {
  icons: IconRecord[]
  categories: IconCategory[]
  /** Category id → positions into `icons`. */
  categoryIcons: Record<string, number[]>
  /** Category id → its thumbnail's geometry, inlined so the picker never waits. */
  repElements: Record<string, CompactElement[]>
  /** Featured name → geometry, inlined so the landing view fetches no shards. */
  featuredElements: Record<string, CompactElement[]>
}

export interface IconEntry {
  name: string
  aliases: string[]
  /** Position in the manifest, which is also its shard and its display order. */
  index: number
  /** Lowercased name, aliases, and word splits, joined for substring matching. */
  haystack: string
  /** `arrow down 01` — the name as a human would say it. */
  words: string
  /** Category ids this icon belongs to; empty for the ~5% the site never filed. */
  categories: string[]
}

export const MANIFEST_URL = "/hugeicons/manifest.json"

export function shardUrl(shard: number, version: string) {
  return `/hugeicons/shard-${String(shard).padStart(3, "0")}.json?v=${version}`
}

/**
 * `ArrowDown01Icon` → `arrow down 01`. Splits camel humps, keeps acronyms whole
 * (`PDF`, `QR`), and separates trailing digits so `home 01` matches a bare "home".
 */
export function toWords(name: string) {
  return name
    .replace(/Icon$/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/([A-Za-z])(\d)/g, "$1 $2")
    .replace(/(\d)([A-Za-z])/g, "$1 $2")
    .toLowerCase()
    .trim()
}

/**
 * HugeIcons spells some concepts out. Searching "3d" should still reach
 * `ThreeDViewIcon`, and "2fa" should reach `TwoFactorAccessIcon`.
 */
const NUMERALS: Record<string, string> = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
  ten: "10",
}

function withNumerals(words: string) {
  const swapped = words.replace(
    /\b(one|two|three|four|five|six|seven|eight|nine|ten)\b/g,
    (word) => NUMERALS[word]
  )
  return swapped === words ? "" : ` ${swapped} ${swapped.replace(/\s+/g, "")}`
}

/** Expands the manifest into the shape the grid searches against. */
export function buildEntries(manifest: IconManifest): IconEntry[] {
  // Invert category → icons once, rather than scanning 59 lists per icon.
  const categoriesByIcon = new Map<number, string[]>()
  for (const [id, indexes] of Object.entries(manifest.categoryIcons)) {
    for (const index of indexes) {
      const existing = categoriesByIcon.get(index)
      if (existing) existing.push(id)
      else categoriesByIcon.set(index, [id])
    }
  }

  return manifest.icons.map(([name, ...aliases], index) => {
    const words = toWords(name)
    const aliasWords = aliases.map(toWords)
    const haystack = [
      words,
      // Collapsed, so "arrowdown" and "threed" match too.
      words.replace(/\s+/g, ""),
      withNumerals(words),
      ...aliasWords,
      ...aliasWords.map((alias) => alias.replace(/\s+/g, "")),
    ]
      .filter(Boolean)
      .join(" ")

    return {
      name,
      aliases,
      index,
      haystack,
      words,
      categories: categoriesByIcon.get(index) ?? [],
    }
  })
}

/**
 * Ranks one entry against one already-lowercased term. Returns 0 for no match, so
 * callers can treat every term as required.
 */
function scoreTerm(entry: IconEntry, term: string) {
  const { words, haystack } = entry

  if (words === term || words.replace(/\s+/g, "") === term) return 120
  if (words.startsWith(term)) return 90
  // A term landing on a word boundary beats one buried mid-word.
  if (haystack.includes(` ${term}`)) return 60
  if (haystack.includes(term)) return 30
  return 0
}

export interface SearchResult {
  entry: IconEntry
  score: number
}

/**
 * All terms must match (AND), which is what makes multi-word queries like
 * "arrow left" usefully narrow. Ties break toward shorter names so `Home01Icon`
 * outranks `HomeWifiIcon` for "home".
 */
export function searchIcons(entries: IconEntry[], query: string): IconEntry[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (terms.length === 0) return entries

  const results: SearchResult[] = []
  for (const entry of entries) {
    let total = 0
    for (const term of terms) {
      const score = scoreTerm(entry, term)
      if (score === 0) {
        total = 0
        break
      }
      total += score
    }
    if (total > 0) results.push({ entry, score: total })
  }

  results.sort(
    (a, b) =>
      b.score - a.score ||
      a.entry.name.length - b.entry.name.length ||
      a.entry.name.localeCompare(b.entry.name)
  )
  return results.map((result) => result.entry)
}

/**
 * Rebuilds the tuple form `HugeiconsIcon` expects. `key` is the array index, which
 * is exactly what the package shipped before the build script dropped it.
 */
export function toSvgElement(elements: CompactElement[]): IconSvgElement {
  return elements.map(({ t, ...attrs }, index) => [
    t ?? "path",
    { ...attrs, key: String(index) },
  ]) as IconSvgElement
}

/** Standalone SVG markup, for pasting into a design tool or an `.svg` file. */
export function toSvgMarkup(elements: CompactElement[], strokeWidth?: number) {
  const attrName = (key: string) =>
    key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)

  const body = elements
    .map(({ t, ...attrs }) => {
      const printed = Object.entries(attrs)
        .map(([key, value]) => {
          const applied =
            key === "strokeWidth" && strokeWidth !== undefined ? strokeWidth : value
          return `${attrName(key)}="${applied}"`
        })
        .join(" ")
      return `  <${t ?? "path"} ${printed} />`
    })
    .join("\n")

  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">\n${body}\n</svg>`
}
