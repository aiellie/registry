"use client"

import * as React from "react"
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  FlashIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Status,
  StatusIndicator,
  StatusLabel,
} from "@/components/aiellie/ui/status"

type EndpointKey = "registry" | "search" | "theme"

const ENDPOINTS: Record<
  EndpointKey,
  {
    path: string
    rate: string
    series: number[]
    p50: number
    p95: number
    p99: number
    trend: { p50: number; p95: number; p99: number }
  }
> = {
  registry: {
    path: "GET /v1/registry/:name",
    rate: "1,284/min",
    series: [
      128, 142, 136, 151, 149, 138, 162, 158, 147, 171, 165, 152, 144, 139, 148,
      156, 183, 174, 161, 155, 149, 143, 138, 134,
    ],
    p50: 62,
    p95: 148,
    p99: 312,
    trend: { p50: -4.1, p95: 6.3, p99: -2.8 },
  },
  search: {
    path: "GET /v1/search",
    rate: "612/min",
    series: [
      212, 196, 204, 231, 248, 226, 219, 241, 268, 259, 244, 236, 228, 251, 274,
      262, 249, 238, 232, 227, 219, 214, 208, 203,
    ],
    p50: 118,
    p95: 264,
    p99: 498,
    trend: { p50: 2.4, p95: 9.1, p99: 5.6 },
  },
  theme: {
    path: "GET /r/theme.json",
    rate: "3,942/min",
    series: [
      42, 38, 41, 39, 44, 40, 37, 36, 39, 43, 41, 38, 35, 34, 37, 39, 42, 40,
      36, 35, 33, 34, 32, 31,
    ],
    p50: 18,
    p95: 41,
    p99: 96,
    trend: { p50: -6.2, p95: -3.4, p99: -8.1 },
  },
}

const VIEW_W = 300
const VIEW_H = 88
const PAD_TOP = 10
const PAD_BOTTOM = 8
// Inset horizontally so the round line caps and the trailing dot are not
// clipped in half by the SVG viewport.
const PAD_X = 4

export function ApiLatency() {
  const [endpoint, setEndpoint] = React.useState<EndpointKey>("registry")
  // Index of the point the pointer (or keyboard) is inspecting.
  const [hover, setHover] = React.useState<number | null>(null)
  const svgRef = React.useRef<SVGSVGElement | null>(null)

  const active = ENDPOINTS[endpoint]
  const series = active.series

  const min = Math.min(...series)
  const max = Math.max(...series)
  const avg = series.reduce((total, value) => total + value, 0) / series.length

  const scaleY = (value: number) => {
    const span = VIEW_H - PAD_TOP - PAD_BOTTOM
    return VIEW_H - PAD_BOTTOM - ((value - min) / (max - min)) * span
  }

  const points = series.map((value, index) => ({
    x: PAD_X + (index / (series.length - 1)) * (VIEW_W - PAD_X * 2),
    y: scaleY(value),
  }))

  const line = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"}${point.x.toFixed(2)} ${point.y.toFixed(2)}`
    )
    .join(" ")
  const area = `${line} L${VIEW_W - PAD_X} ${VIEW_H} L${PAD_X} ${VIEW_H} Z`
  const avgY = scaleY(avg).toFixed(2)

  const marker = points[hover ?? points.length - 1]
  const markerValue = series[hover ?? series.length - 1]

  /** Map a pointer position to the nearest sample, in the SVG's own units. */
  const handlePointer = (event: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    if (rect.width === 0) return
    const ratio = (event.clientX - rect.left) / rect.width
    const index = Math.round(ratio * (series.length - 1))
    setHover(Math.min(series.length - 1, Math.max(0, index)))
  }

  const percentiles = [
    { label: "p50", value: active.p50, delta: active.trend.p50 },
    { label: "p95", value: active.p95, delta: active.trend.p95 },
    { label: "p99", value: active.p99, delta: active.trend.p99 },
  ]

  const withinSlo = active.p95 <= 200

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Latency</CardTitle>
        <CardDescription className="truncate font-mono text-xs">
          {active.path}
        </CardDescription>
        <CardAction>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <HugeiconsIcon
              icon={FlashIcon}
              strokeWidth={2}
              className="size-3.5"
            />
            <span className="tabular-nums">{active.rate}</span>
          </span>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="sm" className="w-full">
                <span className="min-w-0 truncate font-mono text-xs">
                  {active.path}
                </span>
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  strokeWidth={2}
                  data-icon="inline-end"
                />
              </Button>
            }
          />
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Endpoint</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={endpoint}
                onValueChange={(value) => {
                  setEndpoint(String(value) as EndpointKey)
                  setHover(null)
                }}
              >
                {(Object.keys(ENDPOINTS) as EndpointKey[]).map((key) => (
                  <DropdownMenuRadioItem key={key} value={key}>
                    <span className="min-w-0 truncate font-mono text-xs">
                      {ENDPOINTS[key].path}
                    </span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex flex-col gap-1.5">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            preserveAspectRatio="none"
            className="h-[88px] w-full touch-none text-chart-1 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            role="img"
            tabIndex={0}
            aria-label={`Latency over the last six hours for ${active.path}. Currently ${markerValue} milliseconds.`}
            onPointerMove={handlePointer}
            onPointerLeave={() => setHover(null)}
            onKeyDown={(event) => {
              if (event.key !== "ArrowLeft" && event.key !== "ArrowRight")
                return
              event.preventDefault()
              const current = hover ?? series.length - 1
              const next = event.key === "ArrowLeft" ? current - 1 : current + 1
              setHover(Math.min(series.length - 1, Math.max(0, next)))
            }}
          >
            <defs>
              <linearGradient
                id="api-latency-gradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={area} fill="url(#api-latency-gradient)" />
            <line
              x1="0"
              x2={VIEW_W}
              y1={avgY}
              y2={avgY}
              className="text-muted-foreground"
              stroke="currentColor"
              strokeOpacity="0.45"
              strokeDasharray="3 4"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={line}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            {hover !== null ? (
              <line
                x1={marker.x.toFixed(2)}
                x2={marker.x.toFixed(2)}
                y1="0"
                y2={VIEW_H}
                stroke="currentColor"
                strokeOpacity="0.35"
                vectorEffect="non-scaling-stroke"
              />
            ) : null}
            <circle
              cx={marker.x.toFixed(2)}
              cy={marker.y.toFixed(2)}
              r="3.5"
              fill="currentColor"
            />
          </svg>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>6h ago</span>
            <span className="font-medium text-foreground tabular-nums">
              {markerValue} ms
              {hover === null ? " (now)" : ""}
            </span>
            <span>Now</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {percentiles.map((percentile) => (
            <div
              key={percentile.label}
              className="flex flex-col gap-1 rounded-lg bg-muted/50 px-2.5 py-2"
            >
              <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                {percentile.label}
              </span>
              <span className="font-heading text-base font-semibold tabular-nums">
                {percentile.value}
                <span className="ms-0.5 text-[11px] font-normal text-muted-foreground">
                  ms
                </span>
              </span>
              <span
                className={cn(
                  "flex w-fit items-center gap-0.5 rounded-md px-1 py-0.5 text-[11px] tabular-nums",
                  percentile.delta > 0
                    ? "bg-destructive/10 text-destructive"
                    : "bg-success/10 text-success"
                )}
              >
                <HugeiconsIcon
                  icon={percentile.delta > 0 ? ArrowUp01Icon : ArrowDown01Icon}
                  strokeWidth={2}
                  className="size-3"
                />
                {Math.abs(percentile.delta).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="justify-between gap-2">
        <span className="min-w-0 truncate text-xs text-muted-foreground">
          SLO p95 ≤ 200 ms
        </span>
        <Status variant={withinSlo ? "success" : "error"}>
          <StatusIndicator />
          <StatusLabel>
            {withinSlo ? "Within SLO" : "Breaching SLO"}
          </StatusLabel>
        </Status>
      </CardFooter>
    </Card>
  )
}
