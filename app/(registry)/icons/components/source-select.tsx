"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/** Which set the accordion lists. Curated is the landing choice. */
export type IconSource = "curated" | "all"

/**
 * Passed to `Select` as `items` so the trigger prints the label rather than the
 * raw value — Base UI reads the map instead of asking for a render function.
 */
const LABELS: Record<IconSource, string> = {
  curated: "Curated",
  all: "All icons",
}

export function SourceSelect({
  value,
  curatedCount,
  totalCount,
  onValueChange,
}: {
  value: IconSource
  curatedCount: number
  totalCount: number
  onValueChange: (value: IconSource) => void
}) {
  return (
    <Select
      items={LABELS}
      value={value}
      onValueChange={(next) => {
        if (next) onValueChange(next)
      }}
    >
      <SelectTrigger aria-label="Icon set" className="w-36">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="curated">
            {LABELS.curated}
            <span className="font-mono text-xs text-muted-foreground tabular-nums">
              {curatedCount}
            </span>
          </SelectItem>
          <SelectItem value="all">
            {LABELS.all}
            <span className="font-mono text-xs text-muted-foreground tabular-nums">
              {totalCount.toLocaleString()}
            </span>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
