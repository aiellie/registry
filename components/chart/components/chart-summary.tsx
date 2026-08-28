"use client"

import * as React from "react"
import { ChartDownIcon, ChartUpIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"

import type { ChartPoint, ChartSeries } from "../data/schema"

interface ChartSummaryProps {
  data: ChartPoint[]
  series: ChartSeries[]
  /** Omit to render the tiles as plain figures rather than toggles. */
  onVisibilityChange?: (key: string, visible: boolean) => void
  className?: string
}

const readValue = (point: ChartPoint, key: string) => {
  const value = point[key]
  return typeof value === "number" ? value : 0
}

/** Second half of the range against the first, as a percentage. */
function trendOf(data: ChartPoint[], key: string) {
  if (data.length < 2) return 0
  const middle = Math.floor(data.length / 2)
  const sum = (rows: ChartPoint[]) =>
    rows.reduce((total, point) => total + readValue(point, key), 0)
  const first = sum(data.slice(0, middle))
  const second = sum(data.slice(middle))
  if (first === 0) return 0
  return ((second - first) / first) * 100
}

/**
 * One tile per series: its total over the range and which way it is moving.
 * The tiles double as the fastest way to drop a series from the chart.
 */
export function ChartSummary({
  data,
  series,
  onVisibilityChange,
  className,
}: ChartSummaryProps) {
  const stats = React.useMemo(
    () =>
      series.map((item) => ({
        ...item,
        total: data.reduce((sum, point) => sum + readValue(point, item.key), 0),
        trend: trendOf(data, item.key),
      })),
    [data, series]
  )

  const visibleCount = series.filter((item) => item.visible).length

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-border sm:grid-cols-3",
        className
      )}
    >
      {stats.map((stat) => {
        const interactive = Boolean(onVisibilityChange)
        // Dropping the last visible series would leave nothing to draw.
        const locked = stat.visible && visibleCount === 1

        const content = (
          <>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                aria-hidden
                className="size-2 shrink-0 rounded-[2px]"
                style={{ background: stat.color }}
              />
              {stat.label}
            </span>
            <span className="text-xl leading-none font-semibold tabular-nums">
              {stat.total.toLocaleString()}
            </span>
            <span
              className={cn(
                "flex items-center gap-1 text-xs tabular-nums",
                stat.trend < 0 ? "text-destructive" : "text-muted-foreground"
              )}
            >
              <HugeiconsIcon
                icon={stat.trend < 0 ? ChartDownIcon : ChartUpIcon}
                strokeWidth={2}
                className="size-3.5"
              />
              {stat.trend >= 0 ? "+" : ""}
              {stat.trend.toFixed(1)}%
            </span>
          </>
        )

        if (!interactive) {
          return (
            <div
              key={stat.key}
              className="flex flex-col gap-2 bg-card p-3 text-start"
            >
              {content}
            </div>
          )
        }

        return (
          <button
            key={stat.key}
            type="button"
            aria-pressed={stat.visible}
            disabled={locked}
            onClick={() => onVisibilityChange?.(stat.key, !stat.visible)}
            className={cn(
              "flex cursor-pointer flex-col gap-2 bg-card p-3 text-start transition-colors hover:bg-muted/60 disabled:cursor-default",
              !stat.visible && "opacity-45"
            )}
          >
            {content}
          </button>
        )
      })}
    </div>
  )
}
