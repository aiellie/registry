"use client"

import * as React from "react"
import { Globe02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const REGIONS = [
  {
    code: "iad1",
    city: "Washington, D.C.",
    share: 34.2,
    latency: 18,
    requests: "1.65M",
    cacheHit: "94.2%",
    className: "bg-chart-1",
  },
  {
    code: "fra1",
    city: "Frankfurt",
    share: 24.6,
    latency: 24,
    requests: "1.19M",
    cacheHit: "91.8%",
    className: "bg-chart-2",
  },
  {
    code: "hnd1",
    city: "Tokyo",
    share: 18.1,
    latency: 31,
    requests: "872K",
    cacheHit: "89.4%",
    className: "bg-chart-3",
  },
  {
    code: "syd1",
    city: "Sydney",
    share: 13.5,
    latency: 46,
    requests: "651K",
    cacheHit: "87.1%",
    className: "bg-chart-4",
  },
  {
    code: "gru1",
    city: "São Paulo",
    share: 9.6,
    latency: 58,
    requests: "463K",
    cacheHit: "84.6%",
    className: "bg-chart-5",
  },
]

type SortKey = "traffic" | "latency"

export function EdgeRegions() {
  const [sort, setSort] = React.useState<SortKey>("traffic")
  const [selected, setSelected] = React.useState<string | null>(null)

  // Sorted copy — the leading row is always the "best" by the active key, and
  // the bars re-scale against whatever that leader is.
  const sorted = [...REGIONS].sort((a, b) =>
    sort === "traffic" ? b.share - a.share : a.latency - b.latency
  )
  const scaleMax =
    sort === "traffic"
      ? Math.max(...sorted.map((r) => r.share))
      : Math.max(...sorted.map((r) => r.latency))

  const detail = REGIONS.find((region) => region.code === selected)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edge Regions</CardTitle>
        <CardDescription className="truncate">
          4.82M requests · last 24h
        </CardDescription>
        <CardAction>
          <span
            aria-hidden
            className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground"
          >
            <HugeiconsIcon
              icon={Globe02Icon}
              strokeWidth={2}
              className="size-4"
            />
          </span>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <ToggleGroup
          value={[sort]}
          onValueChange={(value) => {
            const next = (value as string[])[0]
            if (next) setSort(next as SortKey)
          }}
          className="w-full"
        >
          <ToggleGroupItem value="traffic" className="flex-1 text-xs">
            By traffic
          </ToggleGroupItem>
          <ToggleGroupItem value="latency" className="flex-1 text-xs">
            By latency
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="flex flex-col gap-1">
          {sorted.map((region, index) => {
            const isLeader = index === 0
            const isSelected = selected === region.code
            const fill =
              sort === "traffic"
                ? (region.share / scaleMax) * 100
                : (region.latency / scaleMax) * 100

            return (
              <button
                key={region.code}
                type="button"
                onClick={() => setSelected(isSelected ? null : region.code)}
                aria-pressed={isSelected}
                className={cn(
                  "flex cursor-pointer flex-col gap-1.5 rounded-lg px-2.5 py-2 text-start outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  isSelected
                    ? "bg-primary/10 ring-1 ring-primary/25"
                    : isLeader
                      ? "bg-muted/60 ring-1 ring-foreground/10"
                      : "hover:bg-muted/40"
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "shrink-0 font-mono text-xs",
                      isLeader ? "font-semibold" : "font-medium"
                    )}
                  >
                    {region.code}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                    {region.city}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 text-xs font-medium tabular-nums",
                      isLeader ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {region.share}%
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <span
                    className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-foreground/10"
                    role="img"
                    aria-label={`${region.city} handled ${region.share} percent of traffic at ${region.latency} milliseconds`}
                  >
                    <span
                      className={cn(
                        "block h-full rounded-full transition-[width] duration-300",
                        region.className
                      )}
                      style={{ width: `${fill}%` }}
                    />
                  </span>
                  <span className="w-12 shrink-0 text-end text-[11px] text-muted-foreground tabular-nums">
                    {region.latency} ms
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        {detail ? (
          <dl className="grid grid-cols-3 gap-2 rounded-lg bg-muted/50 p-2.5">
            <div className="flex min-w-0 flex-col gap-0.5">
              <dt className="truncate text-[10px] tracking-wider text-muted-foreground uppercase">
                Requests
              </dt>
              <dd className="truncate text-xs font-medium tabular-nums">
                {detail.requests}
              </dd>
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              <dt className="truncate text-[10px] tracking-wider text-muted-foreground uppercase">
                p99
              </dt>
              <dd className="truncate text-xs font-medium tabular-nums">
                {detail.latency * 3} ms
              </dd>
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              <dt className="truncate text-[10px] tracking-wider text-muted-foreground uppercase">
                Cache hit
              </dt>
              <dd className="truncate text-xs font-medium tabular-nums">
                {detail.cacheHit}
              </dd>
            </div>
          </dl>
        ) : null}
      </CardContent>

      <CardFooter className="justify-between gap-2">
        <span className="min-w-0 truncate text-xs text-muted-foreground">
          {detail ? `${detail.city} selected` : "Routed by geo-DNS"}
        </span>
        <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
          18 regions active
        </span>
      </CardFooter>
    </Card>
  )
}
