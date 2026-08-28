"use client"

import { type ReactNode, useMemo, useState } from "react"

import { Accordion } from "@/components/ui/accordion"
import {
  type CompactElement,
  type IconEntry,
  type IconManifest,
  type IconSetMeta,
  searchIcons,
} from "@/lib/icon-sets"

import { IconGlyph } from "./icon-glyph"
import { IconGrid } from "./icon-grid"
import { IconSection } from "./icon-section"
import { OPEN_BUDGET } from "./open-budget"
import { useIconShards } from "./use-icon-shards"

/**
 * The complete HugeIcons stroke-rounded set, in the same accordion the curated
 * source uses — sectioned by the site's own taxonomy, scraped into
 * `data/hugeicons-categories.json` and resolved onto the free package by
 * `scripts/build-icons.mjs`, which is how the categories arrive here inside the
 * manifest.
 *
 * Nothing imports a glyph: geometry streams in shard-by-shard, and a closed
 * panel is unmounted, so listing all 5.4k icons costs only the sections someone
 * actually opens.
 */

interface Section {
  id: string
  label: string
  /** Category thumbnail, inlined in the manifest so headers need no shard. */
  rep: CompactElement[] | undefined
  entries: IconEntry[]
}

export function AllIconsAccordion({
  entries,
  manifest,
  meta,
  query,
  categoryIds,
  size,
  strokeWidth,
  emptyState,
  onSelect,
}: {
  /** Every entry, index-aligned with this same manifest. */
  entries: IconEntry[]
  manifest: IconManifest
  meta: IconSetMeta
  /** Trimmed search text; empty means the whole library. */
  query: string
  /** Selected category ids; empty means no category filter. */
  categoryIds: string[]
  size: number
  strokeWidth: number
  /** Shown when the filters match nothing; the copy lives in `icons-view`. */
  emptyState: ReactNode
  onSelect: (entry: IconEntry, elements: CompactElement[]) => void
}) {
  const categoryKey = categoryIds.join(",")

  const sections = useMemo<Section[]>(() => {
    const byIndex = new Map(entries.map((entry) => [entry.index, entry]))
    const wanted = new Set(categoryKey ? categoryKey.split(",") : [])

    const listed: Section[] = (manifest.categories ?? [])
      .filter((category) => wanted.size === 0 || wanted.has(category.id))
      .map((category) => ({
        id: category.id,
        label: category.label,
        rep: manifest.repElements?.[category.id],
        entries: (manifest.categoryIcons?.[category.id] ?? [])
          .map((index) => byIndex.get(index))
          .filter((entry): entry is IconEntry => entry !== undefined),
      }))

    // The site taxonomy files most of the set but not all of it; the leftovers
    // still belong on a view that promises every icon. They have no category, so
    // a category filter excludes them.
    if (wanted.size === 0) {
      const unfiled = entries.filter((entry) => entry.categories.length === 0)
      if (unfiled.length > 0)
        listed.push({
          id: "uncategorised",
          label: "Uncategorised",
          rep: undefined,
          entries: unfiled,
        })
    }

    return listed
      .map((section) => ({
        ...section,
        // Ranked inside each section rather than globally: the section is the
        // grouping, so the best match belongs at the top of its own panel.
        entries: query ? searchIcons(section.entries, query) : section.entries,
      }))
      .filter((section) => section.entries.length > 0)
  }, [entries, manifest, query, categoryKey])

  /**
   * Under a filter the matches are the point, so sections open themselves — but
   * only while the budget lasts, since a one-letter query matches most of the
   * library and every open panel fetches shards.
   */
  const filterKey = `${query}|${categoryKey}`
  const autoOpen = useMemo(() => {
    if (filterKey === "|") return []
    const open: string[] = []
    let budget = OPEN_BUDGET
    for (const section of sections) {
      if (budget <= 0) break
      open.push(section.id)
      budget -= section.entries.length
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

  // Only what is on screen: a closed panel renders nothing, so its shards are
  // never requested.
  const openEntries = useMemo(() => {
    const isOpen = new Set(open)
    return sections
      .filter((section) => isOpen.has(section.id))
      .flatMap((section) => section.entries)
  }, [sections, open])
  const shards = useIconShards(openEntries, meta)

  if (sections.length === 0) return emptyState

  return (
    <Accordion multiple value={open} onValueChange={setOpen} className="gap-2">
      {sections.map((section) => (
        <IconSection
          key={section.id}
          value={section.id}
          label={section.label}
          count={section.entries.length}
          glyph={
            section.rep ? (
              <IconGlyph
                elements={section.rep}
                size={16}
                strokeWidth={2}
                className="shrink-0 text-muted-foreground"
              />
            ) : undefined
          }
        >
          <IconGrid
            entries={section.entries}
            shards={shards}
            size={size}
            strokeWidth={strokeWidth}
            onSelect={onSelect}
          />
        </IconSection>
      ))}
    </Accordion>
  )
}
