"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Item, ItemContent, ItemDescription } from "@/components/ui/item"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Status,
  StatusIndicator,
  StatusLabel,
} from "@/components/aiellie/ui/status"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type RangeKey = "30" | "60" | "90"

/** Incident days, expressed as an offset back from today so every range can
 * derive its own bars from the same history. */
const DEGRADED_AGO = [8, 22, 34, 51, 68]
const OUTAGE_AGO = [40, 77]

const RANGES: Record<
  RangeKey,
  { bars: number; uptime: string; lastIncident: string; downtime: string }
> = {
  "30": {
    bars: 30,
    uptime: "100%",
    lastIncident: "Jun 14",
    downtime: "no downtime",
  },
  "60": {
    bars: 45,
    uptime: "99.98%",
    lastIncident: "Jun 14",
    downtime: "4m 12s downtime",
  },
  "90": {
    bars: 45,
    uptime: "99.94%",
    lastIncident: "May 02",
    downtime: "21m 06s downtime",
  },
}

const LEGEND = [
  { label: "Operational", className: "bg-success/85" },
  { label: "Degraded", className: "bg-warning" },
  { label: "Outage", className: "bg-destructive" },
]

const INCIDENTS: Record<string, { title: string; detail: string }> = {
  degraded: {
    title: "Elevated latency",
    detail: "p99 crossed 900 ms for 18 minutes while a cache node rebuilt.",
  },
  outage: {
    title: "Partial outage",
    detail: "The iad1 region returned 503s until traffic was drained away.",
  },
}

export function UptimeMonitor() {
  const [range, setRange] = React.useState<RangeKey>("60")

  const active = RANGES[range]
  const days = Number(range)

  // Each bar covers `days / bars` days, so the same incidents land in the
  // right place no matter which range is showing.
  const perBar = days / active.bars
  const bars = Array.from({ length: active.bars }, (_, index) => {
    // index 0 is the oldest bar; convert to "days ago".
    const agoFrom = days - (index + 1) * perBar
    const agoTo = days - index * perBar
    const covers = (list: number[]) =>
      list.some((ago) => ago >= agoFrom && ago < agoTo)
    if (covers(OUTAGE_AGO)) return "outage" as const
    if (covers(DEGRADED_AGO)) return "degraded" as const
    return "ok" as const
  })

  const barClass = {
    ok: "bg-success/85",
    degraded: "bg-warning",
    outage: "bg-destructive",
  }

  const allGreen = bars.every((bar) => bar === "ok")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uptime Monitor</CardTitle>
        <CardDescription className="truncate font-mono text-xs">
          api.aiellie.dev
        </CardDescription>
        <CardAction>
          <Status variant={allGreen ? "success" : "pending"} pulse={allGreen}>
            <StatusIndicator />
            <StatusLabel>{allGreen ? "Operational" : "Degraded"}</StatusLabel>
          </Status>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex min-w-0 items-baseline gap-2">
            <span className="font-heading text-3xl font-semibold tabular-nums">
              {active.uptime}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              uptime · {days} days
            </span>
          </div>
          <ToggleGroup
            value={[range]}
            onValueChange={(value) => {
              const next = (value as string[])[0]
              if (next) setRange(next as RangeKey)
            }}
            className="shrink-0"
          >
            {(Object.keys(RANGES) as RangeKey[]).map((key) => (
              <ToggleGroupItem
                key={key}
                value={key}
                className="px-2 text-[11px]"
                aria-label={`Show ${key} days`}
              >
                {key}d
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex h-10 w-full items-stretch gap-px">
            {bars.map((bar, index) => {
              const daysAgo = Math.round(days - index * perBar)
              const label =
                bar === "ok"
                  ? "Operational"
                  : bar === "degraded"
                    ? "Degraded"
                    : "Outage"

              if (bar === "ok") {
                return (
                  <Tooltip key={index}>
                    <TooltipTrigger
                      render={
                        <div
                          tabIndex={-1}
                          aria-label={`${daysAgo} days ago: ${label}`}
                          className={cn("flex-1 rounded-xs", barClass[bar])}
                        />
                      }
                    />
                    <TooltipContent>
                      {daysAgo}d ago · {label}
                    </TooltipContent>
                  </Tooltip>
                )
              }

              return (
                <Popover key={index}>
                  <PopoverTrigger
                    render={
                      <button
                        type="button"
                        aria-label={`${daysAgo} days ago: ${label}. Open incident detail`}
                        className={cn(
                          "flex-1 cursor-pointer rounded-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                          barClass[bar]
                        )}
                      />
                    }
                  />
                  <PopoverContent className="w-56">
                    <PopoverTitle>{INCIDENTS[bar].title}</PopoverTitle>
                    <PopoverDescription>
                      {INCIDENTS[bar].detail}
                    </PopoverDescription>
                    <p className="mt-2 text-xs text-muted-foreground tabular-nums">
                      {daysAgo} days ago
                    </p>
                  </PopoverContent>
                </Popover>
              )
            })}
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{days} days ago</span>
            <span>Today</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Item variant="muted" className="flex-col items-stretch">
            <ItemContent className="gap-1">
              <ItemDescription className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Last incident
              </ItemDescription>
              <span className="font-heading text-base font-semibold">
                {active.lastIncident}
              </span>
              <span className="text-xs text-muted-foreground">
                {active.downtime}
              </span>
            </ItemContent>
          </Item>
          <Item variant="muted" className="flex-col items-stretch">
            <ItemContent className="gap-1">
              <ItemDescription className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Avg response
              </ItemDescription>
              <span className="font-heading text-base font-semibold tabular-nums">
                128 ms
              </span>
              <span className="text-xs text-muted-foreground">
                across 6 probes
              </span>
            </ItemContent>
          </Item>
        </div>
      </CardContent>

      <CardFooter className="gap-3">
        {LEGEND.map((entry) => (
          <span
            key={entry.label}
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
          >
            <span
              aria-hidden
              className={cn("size-1.5 rounded-full", entry.className)}
            />
            {entry.label}
          </span>
        ))}
      </CardFooter>
    </Card>
  )
}
