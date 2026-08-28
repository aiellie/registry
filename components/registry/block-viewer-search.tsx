"use client"

import {
  ArrowRight01Icon,
  ArrowTurnBackwardIcon,
  Exchange01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { motion } from "motion/react"
import * as React from "react"

import { getIconForLanguageExtension } from "@/components/icons/icons"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  buildMatcher,
  InvalidPatternError,
  replaceAll,
  searchContents,
  searchNames,
  type FileMatches,
  type SourceFile,
} from "@/lib/file-search"
import { cn } from "@/lib/utils"

export type SearchMode = "names" | "contents"

export type SourcesStatus = "idle" | "loading" | "ready" | "failed"

type BlockViewerSearchProps = {
  /** Which scopes are searched — either, or both at once. */
  modes: SearchMode[]
  /** Every file the item ships, by install target. */
  targets: string[]
  /** Raw contents, fetched lazily the first time contents search is used. */
  sources: SourceFile[] | null
  sourcesStatus: SourcesStatus
  activeFile: string | null
  onSelectFile: (target: string, line?: number) => void
  onReplaceAll: (edits: { target: string; content: string }[]) => void
  /** How many files the code pane is currently showing a replaced preview of. */
  replacedCount: number
  onRevertReplacements: () => void
  onClose: () => void
}

export function BlockViewerSearch({
  modes,
  targets,
  sources,
  sourcesStatus,
  activeFile,
  onSelectFile,
  onReplaceAll,
  replacedCount,
  onRevertReplacements,
  onClose,
}: BlockViewerSearchProps) {
  const [query, setQuery] = React.useState("")
  const [replacement, setReplacement] = React.useState("")
  const [replaceOpen, setReplaceOpen] = React.useState(false)
  const [matchCase, setMatchCase] = React.useState(false)
  const [wholeWord, setWholeWord] = React.useState(false)
  const [useRegex, setUseRegex] = React.useState(false)
  const [preserveCase, setPreserveCase] = React.useState(false)
  const [collapsed, setCollapsed] = React.useState<Record<string, true>>({})
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  // Scanning ~100 files runs on every keystroke; deferring it keeps the two
  // input fields responsive while the results catch up.
  const deferredQuery = React.useDeferredValue(query)
  const deferredReplacement = React.useDeferredValue(replacement)

  React.useEffect(() => {
    searchInputRef.current?.focus()
  }, [])

  const { matcher, patternError } = React.useMemo(() => {
    try {
      return {
        matcher: buildMatcher(deferredQuery, {
          matchCase,
          wholeWord,
          useRegex,
        }),
        patternError: null,
      }
    } catch (error) {
      return {
        matcher: null,
        patternError:
          error instanceof InvalidPatternError ? error.message : "Bad pattern",
      }
    }
  }, [deferredQuery, matchCase, wholeWord, useRegex])

  const searchesNames = modes.includes("names")
  const searchesContents = modes.includes("contents")

  const nameResults = React.useMemo(
    // An unparseable pattern has a null matcher, which would otherwise read as
    // "no query" and list every file while the box is showing an error.
    () => (searchesNames && !patternError ? searchNames(targets, matcher) : []),
    [searchesNames, targets, matcher, patternError]
  )

  const contentResults = React.useMemo(() => {
    if (!searchesContents || !matcher || !sources) {
      return { results: [] as FileMatches[], total: 0, truncated: false }
    }

    return searchContents(sources, matcher, {
      value: deferredReplacement,
      enabled: replaceOpen && deferredReplacement.length > 0,
      preserveCase,
    })
  }, [
    searchesContents,
    matcher,
    sources,
    deferredReplacement,
    replaceOpen,
    preserveCase,
  ])

  function handleReplaceAll() {
    if (!matcher || !sources) {
      return
    }

    const edits = contentResults.results.flatMap((result) => {
      const source = sources.find((file) => file.target === result.target)
      if (!source) {
        return []
      }

      const { content, count } = replaceAll(
        source.content,
        matcher,
        replacement,
        preserveCase
      )

      return count > 0 ? [{ target: result.target, content }] : []
    })

    if (edits.length > 0) {
      onReplaceAll(edits)
    }
  }

  const summary = describeResults({
    searchesNames,
    searchesContents,
    query: deferredQuery,
    patternError,
    sourcesStatus,
    nameCount: nameResults.length,
    total: contentResults.total,
    fileCount: contentResults.results.length,
    truncated: contentResults.truncated,
  })

  const bothScopes = searchesNames && searchesContents
  const nothingFound =
    !patternError &&
    Boolean(deferredQuery) &&
    nameResults.length === 0 &&
    contentResults.results.length === 0 &&
    (!searchesContents || sourcesStatus === "ready")

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b p-2">
        <div className="flex items-start gap-1">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setReplaceOpen((open) => !open)}
                  className="mt-px size-6 shrink-0 hover:bg-muted-foreground/15"
                />
              }
            >
              <motion.span
                animate={{ rotate: replaceOpen ? 90 : 0 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
                className="flex size-4 items-center justify-center rtl:-scale-x-100"
              >
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
              </motion.span>
              <span className="sr-only">
                {replaceOpen ? "Hide replace" : "Show replace"}
              </span>
            </TooltipTrigger>
            <TooltipContent side="inline-end">
              {replaceOpen ? "Hide replace" : "Toggle replace"}
            </TooltipContent>
          </Tooltip>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <InputGroup
              className={cn(
                "h-8 min-w-0",
                patternError && "border-destructive ring-3 ring-destructive/20"
              )}
            >
              <InputGroupAddon className="ps-2">
                <HugeiconsIcon
                  icon={Search01Icon}
                  strokeWidth={2}
                  className="size-3.5"
                />
              </InputGroupAddon>
              <InputGroupInput
                ref={searchInputRef}
                value={query}
                placeholder={
                  bothScopes
                    ? "Search files and text"
                    : searchesNames
                      ? "Search files"
                      : "Search text"
                }
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    event.preventDefault()
                    onClose()
                  }
                }}
                className="px-1 font-mono text-xs"
              />
              <InputGroupAddon align="inline-end" className="gap-0.5 pe-1">
                <GlyphToggle
                  glyph="Aa"
                  label="Match case"
                  pressed={matchCase}
                  onPressedChange={setMatchCase}
                />
                <GlyphToggle
                  glyph="ab"
                  label="Match whole word"
                  pressed={wholeWord}
                  onPressedChange={setWholeWord}
                  className="underline underline-offset-2"
                />
                <GlyphToggle
                  glyph=".*"
                  label="Use regular expression"
                  pressed={useRegex}
                  onPressedChange={setUseRegex}
                />
              </InputGroupAddon>
            </InputGroup>
            {replaceOpen && (
              <div className="flex min-w-0 items-center gap-1">
                <InputGroup className="h-8 min-w-0 flex-1">
                  <InputGroupAddon className="ps-2">
                    <HugeiconsIcon
                      icon={Exchange01Icon}
                      strokeWidth={2}
                      className="size-3.5"
                    />
                  </InputGroupAddon>
                  <InputGroupInput
                    value={replacement}
                    placeholder="Replace"
                    onChange={(event) => setReplacement(event.target.value)}
                    className="px-1 font-mono text-xs"
                  />
                  <InputGroupAddon align="inline-end" className="gap-0.5 pe-1">
                    <GlyphToggle
                      glyph="AB"
                      label="Preserve case"
                      pressed={preserveCase}
                      onPressedChange={setPreserveCase}
                    />
                  </InputGroupAddon>
                </InputGroup>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        disabled={
                          !searchesContents || contentResults.total === 0
                        }
                        onClick={handleReplaceAll}
                        className="size-8 shrink-0 hover:bg-muted-foreground/15"
                      />
                    }
                  >
                    <HugeiconsIcon
                      icon={Exchange01Icon}
                      strokeWidth={2}
                      className="size-3.5"
                    />
                    <span className="sr-only">Replace all in preview</span>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {searchesContents
                      ? "Replace all — preview only, your files aren’t touched"
                      : "Turn on Text to replace"}
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
        </div>
        <div className="mt-2 flex min-w-0 items-center gap-2 ps-7">
          <p
            className={cn(
              "min-w-0 flex-1 truncate text-xs text-muted-foreground",
              patternError && "text-destructive"
            )}
          >
            {summary}
          </p>
          {replacedCount > 0 && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRevertReplacements}
                    className="h-6 shrink-0 gap-1 px-1.5 text-xs hover:bg-muted-foreground/15"
                  />
                }
              >
                <HugeiconsIcon
                  icon={ArrowTurnBackwardIcon}
                  strokeWidth={2}
                  className="size-3.5"
                />
                Revert {replacedCount}
              </TooltipTrigger>
              <TooltipContent side="top">
                Restore the original source in the code pane
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto p-2">
        {searchesNames && nameResults.length > 0 && (
          <>
            {bothScopes && <ScopeLabel>Files</ScopeLabel>}
            <NameResults
              results={nameResults}
              activeFile={activeFile}
              onSelectFile={onSelectFile}
            />
          </>
        )}
        {searchesContents && contentResults.results.length > 0 && (
          <>
            {bothScopes && <ScopeLabel className="mt-3">Text</ScopeLabel>}
            <ContentResults
              results={contentResults.results}
              activeFile={activeFile}
              collapsed={collapsed}
              onToggleGroup={(target) =>
                setCollapsed((current) => {
                  const next = { ...current }
                  if (next[target]) {
                    delete next[target]
                  } else {
                    next[target] = true
                  }
                  return next
                })
              }
              onSelectFile={onSelectFile}
              replacing={replaceOpen && deferredReplacement.length > 0}
            />
          </>
        )}
        {nothingFound && (
          <p className="px-2 py-8 text-center text-xs text-muted-foreground">
            No results.
          </p>
        )}
      </div>
    </div>
  )
}

/**
 * One line covering whichever scopes are on, joined with a dot when both are.
 */
function describeResults({
  searchesNames,
  searchesContents,
  query,
  patternError,
  sourcesStatus,
  nameCount,
  total,
  fileCount,
  truncated,
}: {
  searchesNames: boolean
  searchesContents: boolean
  query: string
  patternError: string | null
  sourcesStatus: SourcesStatus
  nameCount: number
  total: number
  fileCount: number
  truncated: boolean
}) {
  if (patternError) {
    return patternError
  }

  const parts: string[] = []

  if (searchesNames) {
    parts.push(
      query && nameCount === 0
        ? "No matching files"
        : `${nameCount} ${plural(nameCount, "file")}`
    )
  }

  if (searchesContents) {
    if (sourcesStatus === "loading") {
      parts.push("Loading sources…")
    } else if (sourcesStatus === "failed") {
      parts.push("Couldn’t load file contents")
    } else if (!query) {
      parts.push("Type to search text")
    } else if (total === 0) {
      parts.push("No text matches")
    } else {
      parts.push(
        `${truncated ? "First " : ""}${total} ${plural(total, "result")} in ${fileCount} ${plural(fileCount, "file")}`
      )
    }
  }

  return parts.join(" · ")
}

function plural(count: number, word: string) {
  return count === 1 ? word : `${word}s`
}

function ScopeLabel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        "px-2 pt-1 pb-1.5 text-[0.6875rem] font-medium tracking-wide text-muted-foreground uppercase",
        className
      )}
    >
      {children}
    </p>
  )
}

function GlyphToggle({
  glyph,
  label,
  pressed,
  onPressedChange,
  className,
}: {
  glyph: string
  label: string
  pressed: boolean
  onPressedChange: (pressed: boolean) => void
  className?: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <InputGroupButton
            size="icon-xs"
            aria-pressed={pressed}
            onClick={() => onPressedChange(!pressed)}
            className="size-5 shrink-0 rounded-[calc(var(--radius)-4px)] hover:bg-muted-foreground/20 aria-pressed:bg-muted-foreground/25 aria-pressed:text-foreground"
          />
        }
      >
        <span
          aria-hidden
          className={cn(
            "font-mono text-[0.625rem] leading-none tracking-tight",
            className
          )}
        >
          {glyph}
        </span>
        <span className="sr-only">{label}</span>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  )
}

/** `path/to/file.tsx` -> `tsx`, matching the file-icon lookup's expectations. */
function extensionOf(name: string) {
  const withoutLeadingDot = name.startsWith(".") ? name.slice(1) : name
  const lastDot = withoutLeadingDot.lastIndexOf(".")

  return (
    lastDot === -1 ? withoutLeadingDot : withoutLeadingDot.slice(lastDot + 1)
  ).toLowerCase()
}

const ROW_CLASSES =
  "flex w-full min-w-0 items-center gap-2 rounded-md p-2 text-start text-sm outline-none hover:bg-muted-foreground/15 focus-visible:bg-muted-foreground/15 data-[active=true]:bg-muted-foreground/15"

function NameResults({
  results,
  activeFile,
  onSelectFile,
}: {
  results: ReturnType<typeof searchNames>
  activeFile: string | null
  onSelectFile: (target: string) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {results.map((result) => (
        <motion.button
          key={result.target}
          type="button"
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.1 }}
          data-active={result.target === activeFile}
          onClick={() => onSelectFile(result.target)}
          className={ROW_CLASSES}
        >
          <span className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4">
            {getIconForLanguageExtension(extensionOf(result.name))}
          </span>
          <span className="shrink-0 whitespace-nowrap">
            <Segments
              text={result.name}
              start={result.nameStart}
              end={result.nameEnd}
            />
          </span>
          {result.directory && (
            <span className="min-w-0 truncate text-xs text-muted-foreground">
              <Segments
                text={result.directory}
                start={result.dirStart}
                end={result.dirEnd}
              />
            </span>
          )}
        </motion.button>
      ))}
    </div>
  )
}

function ContentResults({
  results,
  activeFile,
  collapsed,
  onToggleGroup,
  onSelectFile,
  replacing,
}: {
  results: FileMatches[]
  activeFile: string | null
  collapsed: Record<string, true>
  onToggleGroup: (target: string) => void
  onSelectFile: (target: string, line?: number) => void
  replacing: boolean
}) {
  if (results.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-0.5">
      {results.map((file) => {
        const isOpen = !collapsed[file.target]

        return (
          <div key={file.target} className="min-w-0">
            <button
              type="button"
              onClick={() => onToggleGroup(file.target)}
              data-active={file.target === activeFile}
              className={cn(ROW_CLASSES, "gap-1.5 py-1.5")}
            >
              <motion.span
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
                className="flex size-3.5 shrink-0 items-center justify-center rtl:-scale-x-100 [&_svg]:size-3.5"
              >
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
              </motion.span>
              <span className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4">
                {getIconForLanguageExtension(extensionOf(file.name))}
              </span>
              <span className="shrink-0 text-xs whitespace-nowrap">
                {file.name}
              </span>
              {file.directory && (
                <span className="min-w-0 flex-1 truncate text-start text-[0.6875rem] text-muted-foreground">
                  {file.directory}
                </span>
              )}
              <span className="ms-auto flex size-4 shrink-0 items-center justify-center rounded-full bg-muted-foreground/20 text-[0.625rem] leading-none font-medium tabular-nums">
                {file.matches.length + file.hidden}
              </span>
            </button>
            {isOpen &&
              file.matches.map((match, index) => (
                <button
                  key={`${match.line}-${match.start}-${index}`}
                  type="button"
                  onClick={() => onSelectFile(file.target, match.line)}
                  className={cn(
                    ROW_CLASSES,
                    "gap-2 py-1 ps-7 font-mono text-xs"
                  )}
                >
                  <span className="w-8 shrink-0 text-end text-[0.6875rem] text-muted-foreground/70 tabular-nums">
                    {match.line}
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    {match.text.slice(0, match.start)}
                    <span
                      className={cn(
                        "rounded-[3px]",
                        replacing && match.replacement !== null
                          ? "bg-destructive/15 text-muted-foreground line-through"
                          : "bg-primary/20 dark:bg-primary/45"
                      )}
                    >
                      {match.text.slice(match.start, match.end)}
                    </span>
                    {replacing && match.replacement !== null && (
                      <span className="rounded-[3px] bg-success/20">
                        {match.replacement}
                      </span>
                    )}
                    {match.text.slice(match.end)}
                  </span>
                </button>
              ))}
            {isOpen && file.hidden > 0 && (
              <p className="py-1 ps-7 text-[0.6875rem] text-muted-foreground">
                +{file.hidden} more in this file
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

/** Renders `text` with the `[start, end)` slice highlighted, if there is one. */
function Segments({
  text,
  start,
  end,
}: {
  text: string
  start: number
  end: number
}) {
  if (start === -1) {
    return text
  }

  return (
    <>
      {text.slice(0, start)}
      <span className="rounded-[3px] bg-primary/20 text-code-foreground dark:bg-primary/45">
        {text.slice(start, end)}
      </span>
      {text.slice(end)}
    </>
  )
}
