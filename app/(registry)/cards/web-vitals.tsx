"use client"

import * as React from "react"
import {
  ComputerIcon,
  RefreshIcon,
  SmartPhone01Icon,
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
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Status,
  StatusIndicator,
  StatusLabel,
} from "@/components/aiellie/ui/status"
import { toast } from "@/components/ui/toast"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type Rating = "good" | "needs-work" | "poor"
type MetricKey = "LCP" | "INP" | "CLS"

const BANDS = [
  { rating: "good", width: 45, className: "bg-success/70" },
  { rating: "needs-work", width: 30, className: "bg-warning/70" },
  { rating: "poor", width: 25, className: "bg-destructive/60" },
] as const

const METRICS = [
  {
    key: "LCP",
    name: "Largest Contentful Paint",
    unit: "s",
    decimals: 2,
    good: 2.5,
    needs: 4,
    ceiling: 8,
    about: "Time until the largest element in the viewport finishes painting.",
  },
  {
    key: "INP",
    name: "Interaction to Next Paint",
    unit: "ms",
    decimals: 0,
    good: 200,
    needs: 500,
    ceiling: 1000,
    about: "Longest delay between an interaction and the next visual update.",
  },
  {
    key: "CLS",
    name: "Cumulative Layout Shift",
    unit: "",
    decimals: 2,
    good: 0.1,
    needs: 0.25,
    ceiling: 0.5,
    about: "How much visible content moves around while the page loads.",
  },
] as const

const RANGES = [
  { value: "24h", label: "24h", long: "last 24 hours" },
  { value: "7d", label: "7d", long: "last 7 days" },
  { value: "28d", label: "28d", long: "last 28 days" },
] as const

const DEVICES = [
  { value: "mobile", label: "Mobile", icon: SmartPhone01Icon },
  { value: "desktop", label: "Desktop", icon: ComputerIcon },
] as const

type Sample = Record<MetricKey, number> & { sessions: number }

const SAMPLES: Record<string, Record<string, Sample>> = {
  mobile: {
    "24h": { LCP: 2.18, INP: 186, CLS: 0.08, sessions: 12408 },
    "7d": { LCP: 2.64, INP: 232, CLS: 0.11, sessions: 84931 },
    "28d": { LCP: 3.42, INP: 268, CLS: 0.28, sessions: 341264 },
  },
  desktop: {
    "24h": { LCP: 0.94, INP: 108, CLS: 0.02, sessions: 8142 },
    "7d": { LCP: 1.12, INP: 126, CLS: 0.03, sessions: 56307 },
    "28d": { LCP: 1.24, INP: 148, CLS: 0.04, sessions: 224718 },
  },
}

/** Deterministic per-collection drift, so a re-run visibly moves the gauges. */
const DRIFT = [1, 1.08, 0.93]

const STAGES = [
  "Querying CrUX dataset…",
  "Aggregating p75 buckets…",
  "Updating gauges…",
]

const RATING_LABEL: Record<Rating, string> = {
  good: "Good",
  "needs-work": "Needs work",
  poor: "Poor",
}

const RATING_TEXT: Record<Rating, string> = {
  good: "text-success",
  "needs-work": "text-warning",
  poor: "text-destructive",
}

const RATING_DOT: Record<Rating, string> = {
  good: "bg-success",
  "needs-work": "bg-warning",
  poor: "bg-destructive",
}

function rate(value: number, good: number, needs: number): Rating {
  if (value <= good) return "good"
  if (value <= needs) return "needs-work"
  return "poor"
}

/** Maps a value onto the 45 / 30 / 25 good–needs–poor band layout. */
function markerPosition(
  value: number,
  good: number,
  needs: number,
  ceiling: number
) {
  if (value <= good) return (value / good) * 45
  if (value <= needs) return 45 + ((value - good) / (needs - good)) * 30
  return Math.min(98, 75 + ((value - needs) / (ceiling - needs)) * 25)
}

function withCommas(value: number) {
  const digits = String(value)
  let out = ""
  for (let index = 0; index < digits.length; index += 1) {
    if (index > 0 && (digits.length - index) % 3 === 0) out += ","
    out += digits[index]
  }
  return out
}

export function WebVitals() {
  const [range, setRange] = React.useState<string>("28d")
  const [device, setDevice] = React.useState<string>("mobile")
  const [pass, setPass] = React.useState(0)
  const [stage, setStage] = React.useState(-1)
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const isRunning = stage >= 0
  const activeRange = RANGES.find((item) => item.value === range) ?? RANGES[2]
  const sample = SAMPLES[device][range]

  const readings = METRICS.map((metric) => {
    const raw = sample[metric.key] * DRIFT[pass % DRIFT.length]
    const value = Number(raw.toFixed(metric.decimals))
    const rating = rate(value, metric.good, metric.needs)

    return {
      metric,
      value,
      rating,
      display: value.toFixed(metric.decimals),
      position: markerPosition(
        value,
        metric.good,
        metric.needs,
        metric.ceiling
      ),
    }
  })

  const overall: Rating = readings.some((item) => item.rating === "poor")
    ? "poor"
    : readings.some((item) => item.rating === "needs-work")
      ? "needs-work"
      : "good"

  const statusVariant =
    overall === "good" ? "success" : overall === "poor" ? "error" : "pending"

  function runCollection() {
    if (timerRef.current) return
    setStage(0)
    let step = 0
    timerRef.current = setInterval(() => {
      step += 1
      if (step < STAGES.length) {
        setStage(step)
        return
      }
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = null
      setStage(-1)
      setPass((previous) => previous + 1)
      toast.add({ title: "Field data refreshed", type: "success" })
    }, 520)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Core Web Vitals</CardTitle>
        <CardDescription className="truncate font-mono text-xs">
          registry.aiellie.dev/registry
        </CardDescription>
        <CardAction>
          <Status variant={statusVariant}>
            <StatusIndicator />
            <StatusLabel>{RATING_LABEL[overall]}</StatusLabel>
          </Status>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <ToggleGroup
            value={[range]}
            onValueChange={(value) => {
              if (value[0]) setRange(String(value[0]))
            }}
            variant="outline"
            size="sm"
            spacing={0}
            aria-label="Reporting range"
          >
            {RANGES.map((item) => (
              <ToggleGroupItem
                key={item.value}
                value={item.value}
                aria-label={`Show the ${item.long}`}
              >
                {item.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <ToggleGroup
            value={[device]}
            onValueChange={(value) => {
              if (value[0]) setDevice(String(value[0]))
            }}
            variant="outline"
            size="sm"
            spacing={0}
            aria-label="Device class"
          >
            {DEVICES.map((item) => (
              <Tooltip key={item.value}>
                <TooltipTrigger
                  render={
                    <ToggleGroupItem
                      value={item.value}
                      aria-label={`${item.label} field data`}
                    />
                  }
                >
                  <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>{item.label}</TooltipContent>
              </Tooltip>
            ))}
          </ToggleGroup>
        </div>
        {readings.map(({ metric, display, rating, position }) => (
          <Popover key={metric.key}>
            <PopoverTrigger
              render={
                <button
                  type="button"
                  className="-mx-1.5 flex flex-col gap-2 rounded-lg px-1.5 py-1 text-start transition-colors hover:bg-muted/60 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none data-open:bg-muted/60"
                  aria-label={`${metric.name} thresholds`}
                />
              }
            >
              <div className="flex w-full items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                    {metric.key}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {metric.name}
                  </div>
                </div>
                <div className="shrink-0 text-end">
                  <div className="leading-tight">
                    <span className="font-heading text-xl font-semibold tabular-nums">
                      {display}
                    </span>
                    {metric.unit ? (
                      <span className="ms-0.5 text-xs text-muted-foreground">
                        {metric.unit}
                      </span>
                    ) : null}
                  </div>
                  <div
                    className={cn(
                      "text-[11px] tabular-nums",
                      RATING_TEXT[rating]
                    )}
                  >
                    {RATING_LABEL[rating]} &middot; p75
                  </div>
                </div>
              </div>
              <div
                className="relative flex h-1.5 w-full gap-0.5"
                role="img"
                aria-label={`${metric.name} is ${display}${metric.unit}, rated ${RATING_LABEL[rating]}`}
              >
                {BANDS.map((band) => (
                  <div
                    key={band.rating}
                    className={cn("h-full rounded-full", band.className)}
                    style={{ width: `${band.width}%` }}
                  />
                ))}
                <span
                  aria-hidden
                  className="absolute top-1/2 h-3.5 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground ring-2 ring-card transition-[inset-inline-start] duration-300 rtl:translate-x-1/2"
                  style={{ insetInlineStart: `${position}%` }}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent align="center" className="w-64">
              <PopoverHeader>
                <PopoverTitle>
                  {metric.key} &middot; {metric.name}
                </PopoverTitle>
                <PopoverDescription className="text-xs">
                  {metric.about}
                </PopoverDescription>
              </PopoverHeader>
              <div className="flex items-baseline justify-between gap-2 rounded-lg bg-muted/60 px-2.5 py-2">
                <span className="text-xs text-muted-foreground">
                  p75 &middot; {activeRange.long}
                </span>
                <span className="font-heading text-sm font-semibold tabular-nums">
                  {display}
                  {metric.unit ? (
                    <span className="ms-0.5 text-[11px] font-normal text-muted-foreground">
                      {metric.unit}
                    </span>
                  ) : null}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                {(
                  [
                    {
                      key: "good" as const,
                      text: `≤ ${metric.good}${metric.unit ? ` ${metric.unit}` : ""}`,
                    },
                    {
                      key: "needs-work" as const,
                      text: `${metric.good} – ${metric.needs}${metric.unit ? ` ${metric.unit}` : ""}`,
                    },
                    {
                      key: "poor" as const,
                      text: `> ${metric.needs}${metric.unit ? ` ${metric.unit}` : ""}`,
                    },
                  ] satisfies { key: Rating; text: string }[]
                ).map((band) => (
                  <div
                    key={band.key}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-1.5 py-1 text-xs",
                      band.key === rating
                        ? "bg-accent font-medium text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "size-1.5 shrink-0 rounded-full",
                        RATING_DOT[band.key]
                      )}
                    />
                    <span className="min-w-0 flex-1 truncate">
                      {RATING_LABEL[band.key]}
                    </span>
                    <span className="shrink-0 tabular-nums">{band.text}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        ))}
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <span className="min-w-0 truncate text-xs text-muted-foreground">
          {isRunning
            ? STAGES[stage]
            : `${withCommas(sample.sessions)} sessions · ${activeRange.long}`}
        </span>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Re-run field data collection"
                disabled={isRunning}
                onClick={runCollection}
              />
            }
          >
            <HugeiconsIcon
              icon={RefreshIcon}
              strokeWidth={2}
              className={cn(isRunning && "animate-spin")}
            />
          </TooltipTrigger>
          <TooltipContent>
            {isRunning ? "Collecting…" : "Re-run field data collection"}
          </TooltipContent>
        </Tooltip>
      </CardFooter>
    </Card>
  )
}
