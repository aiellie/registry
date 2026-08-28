"use client"

import * as React from "react"
import { FireIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/** 17 weeks of activity, each column running Sunday through Saturday. */
const RECENT = [
  [0, 1, 2, 1, 3, 0, 0],
  [1, 2, 3, 2, 1, 0, 1],
  [0, 0, 1, 2, 2, 1, 0],
  [2, 3, 4, 3, 2, 1, 0],
  [1, 1, 2, 4, 3, 2, 1],
  [0, 2, 3, 3, 4, 2, 0],
  [1, 3, 2, 1, 2, 0, 1],
  [0, 1, 1, 2, 3, 1, 0],
  [2, 4, 4, 3, 2, 1, 1],
  [1, 2, 3, 4, 4, 2, 0],
  [0, 1, 2, 2, 3, 1, 0],
  [3, 4, 3, 4, 2, 1, 2],
  [1, 2, 4, 3, 3, 2, 1],
  [2, 3, 3, 2, 4, 1, 0],
  [0, 1, 2, 3, 2, 2, 1],
  [1, 3, 4, 4, 3, 2, 1],
  [2, 2, 3, 1, 0, 0, 0],
]

/** The same window a quarter earlier — quieter, with a different peak. */
const EARLIER = [
  [1, 0, 0, 1, 1, 0, 0],
  [0, 1, 1, 2, 0, 0, 1],
  [2, 2, 1, 0, 1, 1, 0],
  [0, 1, 2, 1, 2, 0, 0],
  [1, 0, 1, 3, 2, 1, 0],
  [0, 1, 1, 2, 1, 0, 1],
  [2, 3, 2, 1, 1, 1, 0],
  [0, 0, 1, 1, 2, 0, 0],
  [1, 2, 3, 2, 1, 0, 1],
  [0, 1, 1, 3, 2, 1, 0],
  [1, 0, 2, 1, 1, 0, 0],
  [2, 3, 4, 2, 1, 1, 1],
  [0, 1, 2, 2, 2, 0, 0],
  [1, 2, 1, 1, 3, 1, 0],
  [0, 0, 1, 2, 1, 1, 0],
  [1, 2, 2, 3, 2, 0, 1],
  [0, 1, 1, 0, 0, 0, 0],
]

const RANGES = {
  recent: {
    label: "Last 17w",
    weeks: RECENT,
    streak: 17,
    longest: 41,
    busiest: "Wednesday",
    months: [
      { label: "Feb", span: "col-span-4" },
      { label: "Mar", span: "col-span-4" },
      { label: "Apr", span: "col-span-5" },
      { label: "May", span: "col-span-4" },
    ],
  },
  earlier: {
    label: "Prev 17w",
    weeks: EARLIER,
    streak: 6,
    longest: 19,
    busiest: "Thursday",
    months: [
      { label: "Oct", span: "col-span-4" },
      { label: "Nov", span: "col-span-4" },
      { label: "Dec", span: "col-span-5" },
      { label: "Jan", span: "col-span-4" },
    ],
  },
} as const

type RangeKey = keyof typeof RANGES

const LEVELS = [
  "bg-muted",
  "bg-chart-2/25",
  "bg-chart-2/50",
  "bg-chart-2/75",
  "bg-chart-2",
]

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

/** Commits a level stands for — deterministic, so no clock or RNG involved. */
const COMMITS_PER_LEVEL = [0, 2, 5, 9, 14]

export function CommitHeatmap() {
  const [range, setRange] = React.useState<RangeKey>("recent")
  const [selected, setSelected] = React.useState<number | null>(null)

  const active = RANGES[range]
  const cells = active.weeks.flat()
  const total = cells.reduce((sum, level) => sum + COMMITS_PER_LEVEL[level], 0)

  const detail =
    selected === null
      ? null
      : {
          week: Math.floor(selected / 7) + 1,
          day: DAYS[selected % 7],
          commits: COMMITS_PER_LEVEL[cells[selected]],
        }

  return (
    <Card>
      <CardHeader>
        <CardDescription>Commits &middot; {active.label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">
          {total.toLocaleString("en-US")}
        </CardTitle>
        <CardAction>
          <Badge variant="secondary" className="gap-1">
            <HugeiconsIcon icon={FireIcon} strokeWidth={2} />
            {active.streak} day streak
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <ToggleGroup
          value={[range]}
          onValueChange={(value) => {
            const next = (value as string[])[0]
            if (next) {
              setRange(next as RangeKey)
              setSelected(null)
            }
          }}
          className="w-full"
        >
          {(Object.keys(RANGES) as RangeKey[]).map((key) => (
            <ToggleGroupItem key={key} value={key} className="flex-1 text-xs">
              {RANGES[key].label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <div className="grid grid-cols-[repeat(17,minmax(0,1fr))] gap-[3px] text-[10px] leading-none text-muted-foreground">
          {active.months.map((month) => (
            <span key={month.label} className={month.span}>
              {month.label}
            </span>
          ))}
        </div>

        <div className="grid grid-flow-col grid-cols-[repeat(17,minmax(0,1fr))] grid-rows-7 gap-[3px]">
          {cells.map((level, index) => {
            const day = DAYS[index % 7]
            const commits = COMMITS_PER_LEVEL[level]
            return (
              <Tooltip key={index}>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      // Only the selected cell (or the first, before any
                      // selection) is a tab stop — 119 cells would otherwise
                      // swallow keyboard navigation of the whole page.
                      tabIndex={
                        selected === index || (selected === null && index === 0)
                          ? 0
                          : -1
                      }
                      aria-label={`Week ${Math.floor(index / 7) + 1}, ${day}: ${commits} commits`}
                      aria-pressed={selected === index}
                      onClick={() =>
                        setSelected(selected === index ? null : index)
                      }
                      className={cn(
                        "aspect-square w-full cursor-pointer rounded-[3px] outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                        LEVELS[level],
                        selected === index &&
                          "ring-2 ring-primary ring-offset-1 ring-offset-card"
                      )}
                    />
                  }
                />
                <TooltipContent>
                  {commits} commits · {day}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>

        <div className="flex items-center justify-end gap-1.5 pt-0.5">
          <span className="text-xs text-muted-foreground">Less</span>
          <div className="flex items-center gap-[3px]">
            {LEVELS.map((level) => (
              <span
                key={level}
                className={cn("size-2.5 rounded-[3px]", level)}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">More</span>
        </div>
      </CardContent>

      <CardFooter className="justify-between gap-3">
        {detail ? (
          <>
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Week {detail.week} · {detail.day}
              </span>
              <span className="truncate text-sm font-medium tabular-nums">
                {detail.commits} commits
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="shrink-0 cursor-pointer rounded-md text-xs text-muted-foreground underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Clear
            </button>
          </>
        ) : (
          <>
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Longest streak
              </span>
              <span className="truncate text-sm font-medium tabular-nums">
                {active.longest} days
              </span>
            </div>
            <div className="flex min-w-0 flex-col gap-0.5 text-end">
              <span className="truncate text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Busiest day
              </span>
              <span className="truncate text-sm font-medium">
                {active.busiest}
              </span>
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
