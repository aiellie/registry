"use client"

import { type ReactNode, memo, useMemo, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"

import { Accordion } from "@/components/ui/accordion"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { type IconCatalogEntry, getIconGroups } from "@/lib/icons"

import { IconSection } from "./icon-section"
import { OPEN_BUDGET } from "./open-budget"

/**
 * The curated source: the design system's own icon vocabulary, one accordion
 * section per category, rather than the 5.4k-icon library behind the other
 * option in the toolbar's set picker.
 *
 * These are the ~200 glyphs from [icons.ts](lib/icons.ts) — named by the job
 * they do (`close`, `chevronEnd`, `trendingUp`) instead of by what HugeIcons
 * called the drawing. Everything draws from the imported geometry, so the rows
 * paint on first render, before the manifest has been fetched.
 */

/**
 * Computed once at module scope — the catalog is static, and regrouping the
 * entries on every stroke-width change would be pure waste.
 */
const GROUPS = getIconGroups()

export const CURATED_COUNT = GROUPS.reduce(
  (sum, group) => sum + group.icons.length,
  0
)

/**
 * Same variable the full library's cells read, set by the filter bar on the
 * wrapper in `icons-view.tsx`. Going through a custom property rather than
 * inherited `color` is what lets these cells stay memoized while the color
 * wheel is being dragged — and each cell is a `<button>`, which the UA colors
 * itself rather than letting it inherit.
 */
const TINT = "text-[color:var(--icon-tint)]"

/** Role name, label, export name, keywords — every word the catalog carries. */
function matches(entry: IconCatalogEntry, terms: string[]) {
  if (terms.length === 0) return true
  const haystack = `${entry.name} ${entry.label} ${entry.source} ${
    entry.keywords?.join(" ") ?? ""
  }`.toLowerCase()
  return terms.every((term) => haystack.includes(term))
}

const CatalogCell = memo(function CatalogCell({
  entry,
  size,
  strokeWidth,
  onSelect,
}: {
  entry: IconCatalogEntry
  size: number
  strokeWidth: number
  onSelect: (entry: IconCatalogEntry) => void
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        onClick={() => onSelect(entry)}
        // `text-foreground` anchors the tint's `currentColor` fallback — on a
        // bare button it would resolve against the UA's form-control color.
        className="group flex aspect-square cursor-pointer flex-col items-center justify-center rounded-full border p-1 text-foreground transition-colors hover:border-border hover:bg-accent focus-visible:border-border focus-visible:bg-accent focus-visible:outline-none"
      >
        <span className="flex flex-1 items-center justify-center">
          <HugeiconsIcon
            icon={entry.icon}
            size={size}
            strokeWidth={strokeWidth}
            className={TINT}
          />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        {entry.label}
        <span className="ms-1 font-mono opacity-60">{entry.source}</span>
      </TooltipContent>
    </Tooltip>
  )
})

export function CatalogAccordion({
  query,
  categoryIds,
  size,
  strokeWidth,
  emptyState,
  onSelect,
}: {
  /** Trimmed search text; empty means the whole catalog. */
  query: string
  /** Selected category ids; empty means no category filter. */
  categoryIds: string[]
  /** The filter bar's size, in px — what every cell draws at. */
  size: number
  strokeWidth: number
  /** Shown when the filters match nothing; the copy lives in `icons-view`. */
  emptyState: ReactNode
  onSelect: (entry: IconCatalogEntry) => void
}) {
  const categoryKey = categoryIds.join(",")

  const sections = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
    const wanted = new Set(categoryKey ? categoryKey.split(",") : [])

    return GROUPS.filter(
      (group) => wanted.size === 0 || wanted.has(group.category.id)
    )
      .map((group) => ({
        category: group.category,
        icons: group.icons.filter((entry) => matches(entry, terms)),
      }))
      .filter((group) => group.icons.length > 0)
  }, [query, categoryKey])

  /**
   * Under a filter the matches are the point, so sections open themselves — but
   * only while the budget lasts, since a one-letter query matches most of the
   * catalog and every open panel is real cells.
   */
  const filterKey = `${query}|${categoryKey}`
  const autoOpen = useMemo(() => {
    if (filterKey === "|") return []
    const open: string[] = []
    let budget = OPEN_BUDGET
    for (const section of sections) {
      if (budget <= 0) break
      open.push(section.category.id)
      budget -= section.icons.length
    }
    return open
  }, [sections, filterKey])

  // Snap back to the auto-opened set whenever the filter changes, while leaving
  // the reader's own toggles alone in between. Adjusting during render rather
  // than in an effect avoids a pass that paints the old open set against new
  // matches.
  const [open, setOpen] = useState<string[]>(autoOpen)
  const [openFor, setOpenFor] = useState(filterKey)
  if (openFor !== filterKey) {
    setOpenFor(filterKey)
    setOpen(autoOpen)
  }

  if (sections.length === 0) return emptyState

  return (
    <TooltipProvider delay={300}>
      <Accordion
        multiple
        value={open}
        onValueChange={setOpen}
        className="gap-2"
      >
        {sections.map(({ category, icons }) => (
          <IconSection
            key={category.id}
            value={category.id}
            label={category.label}
            count={icons.length}
            glyph={
              <HugeiconsIcon
                icon={category.icon}
                size={16}
                strokeWidth={2}
                className="shrink-0 text-muted-foreground"
              />
            }
          >
            <div className="grid grid-cols-[repeat(auto-fill,minmax(48px,1fr))] gap-1">
              {icons.map((entry) => (
                <CatalogCell
                  key={entry.name}
                  entry={entry}
                  size={size}
                  strokeWidth={strokeWidth}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </IconSection>
        ))}
      </Accordion>
    </TooltipProvider>
  )
}
