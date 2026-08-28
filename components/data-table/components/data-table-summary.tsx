"use client"

import { type Table } from "@tanstack/react-table"

import {
  Status,
  StatusIndicator,
  StatusLabel,
} from "@/components/aiellie/ui/status"
import { cn } from "@/lib/utils"

import { statuses } from "../data/data"

interface DataTableSummaryProps<TData> {
  table: Table<TData>
  /** The column the tiles count and filter on. */
  columnId?: string
  className?: string
}

/**
 * One tile per status, counted across the whole dataset rather than the page.
 * Faceted counts honour every other active filter but not this column's own,
 * so the numbers stay usable while you toggle the tiles.
 */
export function DataTableSummary<TData>({
  table,
  columnId = "status",
  className,
}: DataTableSummaryProps<TData>) {
  const column = table.getColumn(columnId)
  if (!column) return null

  const facets = column.getFacetedUniqueValues()
  const selected = new Set((column.getFilterValue() as string[]) ?? [])
  const total = table.getCoreRowModel().rows.length

  const toggle = (value: string) => {
    const next = new Set(selected)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    column.setFilterValue(next.size ? Array.from(next) : undefined)
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-border sm:grid-cols-3 lg:grid-cols-5",
        className
      )}
    >
      {statuses.map((status) => {
        const count = facets.get(status.value) ?? 0
        const share = total ? Math.round((count / total) * 100) : 0
        const isOn = selected.has(status.value)

        return (
          <button
            key={status.value}
            type="button"
            aria-pressed={isOn}
            onClick={() => toggle(status.value)}
            className={cn(
              "flex cursor-pointer flex-col gap-2 bg-background p-3 text-start transition-colors hover:bg-muted/60",
              isOn && "bg-muted/70"
            )}
          >
            <Status variant={status.variant} pulse={status.pulse}>
              <StatusIndicator />
              <StatusLabel>{status.label}</StatusLabel>
            </Status>
            <span className="flex items-baseline gap-1.5">
              <span className="text-xl leading-none font-semibold tabular-nums">
                {count}
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {share}%
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
