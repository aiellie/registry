"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  Cancel01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

/* -------------------------------------------------------------------------- */
/*                                   Context                                   */
/* -------------------------------------------------------------------------- */

export interface FindInPageContextValue {
  query: string
  setQuery: (query: string) => void
  /** Number of matches for the current query. */
  total: number
  /** 1-based position of the active match; `0` when there are none. */
  active: number
  step: (delta: number) => void
  close: () => void
}

const FindInPageContext = React.createContext<FindInPageContextValue | null>(
  null
)

export const useFindInPageContext = () => {
  const context = React.useContext(FindInPageContext)
  if (!context) {
    throw new Error("FindInPage components must be used within a FindInPage")
  }
  return context
}

/* -------------------------------------------------------------------------- */
/*                                    Root                                     */
/* -------------------------------------------------------------------------- */

export type FindInPageProps = Omit<React.ComponentProps<"div">, "onChange"> & {
  query?: string
  defaultQuery?: string
  onQueryChange?: (query: string) => void
  total?: number
  /** 1-based position of the active match. */
  active?: number
  onStep?: (delta: number) => void
  onClose?: () => void
}

export const FindInPage = ({
  className,
  children,
  query: controlledQuery,
  defaultQuery = "",
  onQueryChange,
  total = 0,
  active = 0,
  onStep,
  onClose,
  onKeyDown,
  ...props
}: FindInPageProps) => {
  const [uncontrolledQuery, setUncontrolledQuery] = React.useState(defaultQuery)

  const isControlled = controlledQuery !== undefined
  const query = isControlled ? controlledQuery : uncontrolledQuery

  const setQuery = React.useCallback(
    (next: string) => {
      if (!isControlled) setUncontrolledQuery(next)
      onQueryChange?.(next)
    },
    [isControlled, onQueryChange]
  )

  const step = React.useCallback((delta: number) => onStep?.(delta), [onStep])

  const close = React.useCallback(() => onClose?.(), [onClose])

  const value = React.useMemo<FindInPageContextValue>(
    () => ({ active, close, query, setQuery, step, total }),
    [active, close, query, setQuery, step, total]
  )

  return (
    <FindInPageContext.Provider value={value}>
      <div
        className={cn(
          "flex w-full max-w-[21.25rem] flex-col overflow-hidden rounded-[1.25rem] bg-muted/95 text-popover-foreground shadow-[0_8px_24px_rgb(0_0_0_/_0.1)] ring-1 ring-foreground/10 dark:bg-popover",
          className
        )}
        data-slot="find-in-page"
        // Enter / Shift+Enter step through matches, Escape dismisses — the
        // shortcuts people already expect from a browser's find bar.
        onKeyDown={(event) => {
          onKeyDown?.(event)
          if (event.defaultPrevented) return
          if (event.key === "Enter") {
            event.preventDefault()
            step(event.shiftKey ? -1 : 1)
          }
          if (event.key === "Escape") {
            event.preventDefault()
            close()
          }
        }}
        {...props}
      >
        {children}
      </div>
    </FindInPageContext.Provider>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    Parts                                    */
/* -------------------------------------------------------------------------- */

export type FindInPageBarProps = React.ComponentProps<"div">

export const FindInPageBar = ({
  className,
  children,
  ...props
}: FindInPageBarProps) => (
  <div
    className={cn("flex min-h-11 items-center gap-3 px-4 py-1.5", className)}
    data-slot="find-in-page-bar"
    {...props}
  >
    {children}
  </div>
)

export type FindInPageInputProps = Omit<
  React.ComponentProps<"input">,
  "value" | "onChange"
> & {
  /** Renders the leading magnifier. */
  icon?: boolean
}

export const FindInPageInput = ({
  className,
  icon = true,
  placeholder = "Find in page…",
  ...props
}: FindInPageInputProps) => {
  const { query, setQuery } = useFindInPageContext()

  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      {icon && (
        <HugeiconsIcon
          className="size-5 shrink-0 text-foreground"
          icon={Search01Icon}
          strokeWidth={2}
        />
      )}
      <input
        aria-label="Find in page"
        autoComplete="off"
        className={cn(
          "min-w-0 flex-1 bg-transparent text-base font-normal outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden",
          className
        )}
        data-slot="find-in-page-input"
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        type="search"
        value={query}
        {...props}
      />
    </div>
  )
}

export type FindInPageActionsProps = React.ComponentProps<"div">

export const FindInPageActions = ({
  className,
  children,
  ...props
}: FindInPageActionsProps) => (
  <div
    className={cn("flex shrink-0 items-center gap-1", className)}
    data-slot="find-in-page-actions"
    {...props}
  >
    {children}
  </div>
)

export type FindInPageActionProps = React.ComponentProps<typeof Button>

export const FindInPageAction = ({
  className,
  ...props
}: FindInPageActionProps) => (
  <Button
    className={cn(
      "size-8 rounded-xl p-0 text-foreground [&_svg]:size-5",
      className
    )}
    data-slot="find-in-page-action"
    size="icon"
    variant="ghost"
    {...props}
  />
)

export type FindInPageCloseProps = React.ComponentProps<typeof Button>

export const FindInPageClose = ({
  className,
  onClick,
  ...props
}: FindInPageCloseProps) => {
  const { close } = useFindInPageContext()

  return (
    <Button
      aria-label="Close find bar"
      className={cn(
        "size-8 rounded-xl p-0 text-foreground [&_svg]:size-5",
        className
      )}
      data-slot="find-in-page-close"
      onClick={(event) => {
        onClick?.(event)
        close()
      }}
      size="icon"
      variant="ghost"
      {...props}
    >
      <HugeiconsIcon className="size-4" icon={Cancel01Icon} strokeWidth={2} />
    </Button>
  )
}

export type FindInPageResultsProps = React.ComponentProps<"div"> & {
  /** Copy for the counter; receives the 1-based active index and the total. */
  format?: (active: number, total: number) => string
}

const defaultFormat = (active: number, total: number) =>
  total === 0 ? "No results" : `${active} / ${total} results`

export const FindInPageResults = ({
  className,
  format = defaultFormat,
  ...props
}: FindInPageResultsProps) => {
  const { active, query, step, total } = useFindInPageContext()
  const empty = total === 0

  return (
    <div
      className={cn(
        "flex min-h-9 items-center gap-1 border-t px-3 py-1 text-sm text-muted-foreground",
        className
      )}
      data-slot="find-in-page-results"
      {...props}
    >
      <Button
        aria-label="Previous match"
        className="size-7 rounded-lg p-0 text-muted-foreground"
        disabled={empty}
        onClick={() => step(-1)}
        size="icon-sm"
        variant="ghost"
      >
        <HugeiconsIcon
          className="size-[1.125rem]"
          icon={ArrowUp01Icon}
          strokeWidth={2}
        />
      </Button>
      <Button
        aria-label="Next match"
        className="size-7 rounded-lg p-0 text-muted-foreground"
        disabled={empty}
        onClick={() => step(1)}
        size="icon-sm"
        variant="ghost"
      >
        <HugeiconsIcon
          className="size-[1.125rem]"
          icon={ArrowDown01Icon}
          strokeWidth={2}
        />
      </Button>
      <span aria-live="polite" className="ms-auto tabular-nums">
        {query ? format(active, total) : null}
      </span>
    </div>
  )
}

export type FindInPageSeparatorProps = React.ComponentProps<typeof Separator>

export const FindInPageSeparator = ({
  className,
  ...props
}: FindInPageSeparatorProps) => (
  <Separator
    className={cn("mx-1 !h-6", className)}
    orientation="vertical"
    {...props}
  />
)

/* -------------------------------------------------------------------------- */
/*                              Standalone engine                              */
/* -------------------------------------------------------------------------- */

/**
 * Minimal shape of the CSS Custom Highlight API. Typed locally because
 * `Highlight` / `CSS.highlights` are not in every TS lib target yet.
 */
type HighlightRegistry = Map<string, unknown> & {
  set: (name: string, highlight: unknown) => HighlightRegistry
  delete: (name: string) => boolean
}

type HighlightConstructor = new (...ranges: Range[]) => unknown

const highlightRegistry = () =>
  (globalThis.CSS as unknown as { highlights?: HighlightRegistry })?.highlights

const highlightConstructor = () =>
  (globalThis as unknown as { Highlight?: HighlightConstructor }).Highlight

/** Collects every text node under `root`, skipping script/style content. */
function textNodesUnder(root: Node) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement
      if (!parent) return NodeFilter.FILTER_REJECT
      if (parent.closest("script, style, noscript")) {
        return NodeFilter.FILTER_REJECT
      }
      return node.nodeValue?.trim()
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT
    },
  })

  const nodes: Text[] = []
  let node = walker.nextNode()
  while (node) {
    nodes.push(node as Text)
    node = walker.nextNode()
  }
  return nodes
}

export type UseFindInPageOptions = {
  /** Case-sensitive matching. Defaults to `false`. */
  matchCase?: boolean
}

/**
 * Drives find-in-page over a DOM subtree using the CSS Custom Highlight API,
 * so matches are painted without mutating the tree being searched.
 *
 * Returns props ready to spread onto `<FindInPage>`.
 */
export function useFindInPage(
  targetRef: React.RefObject<HTMLElement | null>,
  { matchCase = false }: UseFindInPageOptions = {}
) {
  const [query, setQuery] = React.useState("")
  const [active, setActive] = React.useState(0)
  const rangesRef = React.useRef<Range[]>([])
  const [total, setTotal] = React.useState(0)

  // Register the highlight styles once; `::highlight()` needs a real
  // stylesheet, it cannot be expressed inline.
  React.useEffect(() => {
    if (!highlightRegistry()) return

    const style = document.createElement("style")
    style.dataset.slot = "find-in-page-highlights"
    style.textContent = `
      ::highlight(find-in-page) {
        background-color: rgb(255 140 26 / 38%);
        color: #000;
      }
      ::highlight(find-in-page-active) {
        background-color: #ff8c1a;
        color: #000;
      }
    `
    document.head.append(style)
    return () => style.remove()
  }, [])

  // Recompute matches whenever the query changes.
  React.useEffect(() => {
    const highlights = highlightRegistry()
    const Highlight = highlightConstructor()
    const root = targetRef.current

    if (!highlights || !Highlight || !root || !query) {
      highlights?.delete("find-in-page")
      highlights?.delete("find-in-page-active")
      rangesRef.current = []
      setTotal(0)
      setActive(0)
      return
    }

    const needle = matchCase ? query : query.toLowerCase()
    const ranges: Range[] = []

    for (const node of textNodesUnder(root)) {
      const haystack = matchCase
        ? (node.nodeValue ?? "")
        : (node.nodeValue ?? "").toLowerCase()

      let from = haystack.indexOf(needle)
      while (from !== -1) {
        const range = document.createRange()
        range.setStart(node, from)
        range.setEnd(node, from + needle.length)
        ranges.push(range)
        from = haystack.indexOf(needle, from + needle.length)
      }
    }

    rangesRef.current = ranges
    setTotal(ranges.length)
    setActive(ranges.length ? 1 : 0)
  }, [query, matchCase, targetRef])

  // Repaint whenever the active match moves.
  React.useEffect(() => {
    const highlights = highlightRegistry()
    const Highlight = highlightConstructor()
    if (!highlights || !Highlight) return

    const ranges = rangesRef.current
    if (!ranges.length) {
      highlights.delete("find-in-page")
      highlights.delete("find-in-page-active")
      return
    }

    const activeRange = ranges[active - 1]
    highlights.set(
      "find-in-page",
      new Highlight(...ranges.filter((range) => range !== activeRange))
    )
    if (activeRange) {
      highlights.set("find-in-page-active", new Highlight(activeRange))
      activeRange.startContainer.parentElement?.scrollIntoView({
        block: "center",
        behavior: "smooth",
      })
    }
  }, [active, total])

  const step = React.useCallback((delta: number) => {
    setActive((current) => {
      const count = rangesRef.current.length
      if (!count) return 0
      return ((current - 1 + delta + count) % count) + 1
    })
  }, [])

  const close = React.useCallback(() => setQuery(""), [])

  return {
    active,
    onClose: close,
    onQueryChange: setQuery,
    onStep: step,
    query,
    total,
  }
}
