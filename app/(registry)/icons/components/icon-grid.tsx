"use client"

import { memo } from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { type CompactElement, type IconEntry } from "@/lib/icon-sets"

import { IconGlyph } from "./icon-glyph"

/**
 * The filter bar's tint, read straight by every icon — `--icon-tint` is set on
 * the wrapper in `icons-view.tsx`.
 *
 * A plain inherited `color` on a wrapper would not reach them: each cell is a
 * `<button>`, and the UA stylesheet colors form controls rather than letting
 * them inherit. Going through a variable also keeps the memoized cells out of
 * the re-render while the color wheel is being dragged.
 */
const TINT = "text-[color:var(--icon-tint)]"

export const IconCell = memo(function IconCell({
  entry,
  elements,
  size,
  strokeWidth,
  onSelect,
}: {
  entry: IconEntry
  elements: CompactElement[] | undefined
  size: number
  strokeWidth: number
  onSelect: (entry: IconEntry, elements: CompactElement[]) => void
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        // Nothing to open until the shard lands: the detail dialog is drawn from
        // this geometry, so a placeholder cell stays inert rather than opening an
        // empty preview.
        disabled={!elements}
        onClick={() => elements && onSelect(entry, elements)}
        // `text-foreground` anchors the tint's `currentColor` fallback — a bare
        // button would otherwise resolve it against the UA's form-control color.
        className="group flex aspect-square cursor-pointer flex-col items-center justify-center rounded-full border p-1 text-foreground transition-colors hover:border-border hover:bg-accent focus-visible:border-border focus-visible:bg-accent focus-visible:outline-none"
      >
        <span className="flex flex-1 items-center justify-center">
          {elements ? (
            <IconGlyph
              elements={elements}
              size={size}
              strokeWidth={strokeWidth}
              className={TINT}
            />
          ) : (
            <span
              className="animate-pulse rounded-sm bg-muted"
              style={{ width: size, height: size }}
            />
          )}
        </span>
      </TooltipTrigger>
      {/* The cell shows the glyph alone, so the tooltip carries the full export
          name — the thing you'd actually paste into an import. */}
      <TooltipContent className="font-mono">{entry.name}</TooltipContent>
    </Tooltip>
  )
})

export function IconGrid({
  entries,
  shards,
  size,
  strokeWidth,
  onSelect,
}: {
  entries: IconEntry[]
  shards: { get: (entry: IconEntry) => CompactElement[] | undefined }
  size: number
  strokeWidth: number
  onSelect: (entry: IconEntry, elements: CompactElement[]) => void
}) {
  return (
    // One provider per grid: the shared delay keeps a tooltip from firing on
    // every icon the pointer happens to cross on its way somewhere else.
    <TooltipProvider delay={100}>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(48px,1fr))] gap-1">
        {entries.map((entry) => (
          <IconCell
            key={entry.name}
            entry={entry}
            elements={shards.get(entry)}
            size={size}
            strokeWidth={strokeWidth}
            onSelect={onSelect}
          />
        ))}
      </div>
    </TooltipProvider>
  )
}
