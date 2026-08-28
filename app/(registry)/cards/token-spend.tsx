"use client"

import * as React from "react"
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  Calendar03Icon,
  ChartBarLineIcon,
  ChartLineData01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type Row = {
  key: string
  label: string
  cost: number
  bar: string
  input: string
  output: string
  note: string
}

type Period = {
  value: string
  label: string
  note: string
  total: number
  delta: string
  up: boolean
  used: string
  input: string
  inputNote: string
  output: string
  outputNote: string
  models: Row[]
  days: Row[]
}

const BARS = ["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4"]

const PERIODS: Period[] = [
  {
    value: "august",
    label: "August",
    note: "resets in 12 days",
    total: 1284.6,
    delta: "18.2%",
    up: true,
    used: "64% used",
    input: "42.8M",
    inputNote: "cached 61%",
    output: "6.1M",
    outputNote: "avg 812 tok",
    models: [
      {
        key: "opus",
        label: "claude-opus-4.5",
        cost: 612.4,
        bar: BARS[0],
        input: "24.1M",
        output: "3.2M",
        note: "cached 63%",
      },
      {
        key: "sonnet",
        label: "claude-sonnet-4.5",
        cost: 398.2,
        bar: BARS[1],
        input: "12.4M",
        output: "1.9M",
        note: "cached 58%",
      },
      {
        key: "haiku",
        label: "claude-haiku-4.5",
        cost: 174.3,
        bar: BARS[2],
        input: "4.9M",
        output: "0.8M",
        note: "cached 71%",
      },
      {
        key: "voyage",
        label: "voyage-3-embed",
        cost: 99.7,
        bar: BARS[3],
        input: "1.4M",
        output: "0.2M",
        note: "embeddings",
      },
    ],
    days: [
      {
        key: "aug-26",
        label: "Aug 26",
        cost: 74.2,
        bar: BARS[0],
        input: "2.4M",
        output: "0.4M",
        note: "Monday",
      },
      {
        key: "aug-27",
        label: "Aug 27",
        cost: 96.8,
        bar: BARS[1],
        input: "3.1M",
        output: "0.5M",
        note: "Tuesday",
      },
      {
        key: "aug-28",
        label: "Aug 28",
        cost: 51.4,
        bar: BARS[2],
        input: "1.7M",
        output: "0.3M",
        note: "Wednesday",
      },
      {
        key: "aug-29",
        label: "Aug 29",
        cost: 118.3,
        bar: BARS[3],
        input: "3.9M",
        output: "0.6M",
        note: "Thursday",
      },
      {
        key: "aug-30",
        label: "Aug 30",
        cost: 88.6,
        bar: BARS[0],
        input: "2.9M",
        output: "0.4M",
        note: "Friday",
      },
    ],
  },
  {
    value: "july",
    label: "July",
    note: "closed 1 Aug",
    total: 1086.3,
    delta: "9.4%",
    up: true,
    used: "54% used",
    input: "36.2M",
    inputNote: "cached 57%",
    output: "5.2M",
    outputNote: "avg 774 tok",
    models: [
      {
        key: "opus",
        label: "claude-opus-4.5",
        cost: 498.1,
        bar: BARS[0],
        input: "20.4M",
        output: "2.7M",
        note: "cached 59%",
      },
      {
        key: "sonnet",
        label: "claude-sonnet-4.5",
        cost: 356.4,
        bar: BARS[1],
        input: "10.6M",
        output: "1.6M",
        note: "cached 55%",
      },
      {
        key: "haiku",
        label: "claude-haiku-4.5",
        cost: 148.9,
        bar: BARS[2],
        input: "3.9M",
        output: "0.7M",
        note: "cached 66%",
      },
      {
        key: "voyage",
        label: "voyage-3-embed",
        cost: 82.9,
        bar: BARS[3],
        input: "1.3M",
        output: "0.2M",
        note: "embeddings",
      },
    ],
    days: [
      {
        key: "jul-27",
        label: "Jul 27",
        cost: 61.3,
        bar: BARS[0],
        input: "2.0M",
        output: "0.3M",
        note: "Sunday",
      },
      {
        key: "jul-28",
        label: "Jul 28",
        cost: 88.1,
        bar: BARS[1],
        input: "2.8M",
        output: "0.4M",
        note: "Monday",
      },
      {
        key: "jul-29",
        label: "Jul 29",
        cost: 44.7,
        bar: BARS[2],
        input: "1.5M",
        output: "0.2M",
        note: "Tuesday",
      },
      {
        key: "jul-30",
        label: "Jul 30",
        cost: 102.5,
        bar: BARS[3],
        input: "3.4M",
        output: "0.5M",
        note: "Wednesday",
      },
      {
        key: "jul-31",
        label: "Jul 31",
        cost: 70.9,
        bar: BARS[0],
        input: "2.3M",
        output: "0.3M",
        note: "Thursday",
      },
    ],
  },
  {
    value: "june",
    label: "June",
    note: "closed 1 Jul",
    total: 992.7,
    delta: "4.1%",
    up: false,
    used: "50% used",
    input: "33.1M",
    inputNote: "cached 52%",
    output: "4.8M",
    outputNote: "avg 731 tok",
    models: [
      {
        key: "opus",
        label: "claude-opus-4.5",
        cost: 421.8,
        bar: BARS[0],
        input: "18.2M",
        output: "2.4M",
        note: "cached 54%",
      },
      {
        key: "sonnet",
        label: "claude-sonnet-4.5",
        cost: 330.6,
        bar: BARS[1],
        input: "9.8M",
        output: "1.5M",
        note: "cached 51%",
      },
      {
        key: "haiku",
        label: "claude-haiku-4.5",
        cost: 152.4,
        bar: BARS[2],
        input: "3.9M",
        output: "0.7M",
        note: "cached 60%",
      },
      {
        key: "voyage",
        label: "voyage-3-embed",
        cost: 87.9,
        bar: BARS[3],
        input: "1.2M",
        output: "0.2M",
        note: "embeddings",
      },
    ],
    days: [
      {
        key: "jun-26",
        label: "Jun 26",
        cost: 52.4,
        bar: BARS[0],
        input: "1.7M",
        output: "0.2M",
        note: "Thursday",
      },
      {
        key: "jun-27",
        label: "Jun 27",
        cost: 71.6,
        bar: BARS[1],
        input: "2.3M",
        output: "0.3M",
        note: "Friday",
      },
      {
        key: "jun-28",
        label: "Jun 28",
        cost: 38.9,
        bar: BARS[2],
        input: "1.3M",
        output: "0.2M",
        note: "Saturday",
      },
      {
        key: "jun-29",
        label: "Jun 29",
        cost: 84.2,
        bar: BARS[3],
        input: "2.7M",
        output: "0.4M",
        note: "Sunday",
      },
      {
        key: "jun-30",
        label: "Jun 30",
        cost: 63.1,
        bar: BARS[0],
        input: "2.1M",
        output: "0.3M",
        note: "Monday",
      },
    ],
  },
]

/** Locale-independent so server and client render byte-identical markup. */
function money(value: number) {
  const [whole, cents] = value.toFixed(2).split(".")
  return `$${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${cents}`
}

export function TokenSpend() {
  const [periodValue, setPeriodValue] = React.useState("august")
  const [breakdown, setBreakdown] = React.useState<"models" | "days">("models")
  const [selected, setSelected] = React.useState<string | null>(null)

  const period =
    PERIODS.find((item) => item.value === periodValue) ?? PERIODS[0]
  const rows = breakdown === "models" ? period.models : period.days
  const max = rows.reduce((peak, row) => Math.max(peak, row.cost), 0)
  const active = rows.find((row) => row.key === selected)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Spend</CardTitle>
        <CardDescription>
          {period.label} · {period.note}
        </CardDescription>
        <CardAction className="flex items-center gap-1">
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger
                render={
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="bg-muted"
                        aria-label="Change billing period"
                      />
                    }
                  />
                }
              >
                <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>Change period</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Billing period</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={periodValue}
                  onValueChange={(value) => {
                    setPeriodValue(String(value))
                    setSelected(null)
                  }}
                >
                  {PERIODS.map((item) => (
                    <DropdownMenuRadioItem key={item.value} value={item.value}>
                      {item.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="bg-muted"
                  aria-label={
                    breakdown === "models"
                      ? "Break down by day"
                      : "Break down by model"
                  }
                  onClick={() => {
                    setBreakdown((current) =>
                      current === "models" ? "days" : "models"
                    )
                    setSelected(null)
                  }}
                />
              }
            >
              <HugeiconsIcon
                icon={
                  breakdown === "models"
                    ? ChartLineData01Icon
                    : ChartBarLineIcon
                }
                strokeWidth={2}
              />
            </TooltipTrigger>
            <TooltipContent>
              {breakdown === "models"
                ? "Break down by day"
                : "Break down by model"}
            </TooltipContent>
          </Tooltip>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-baseline gap-2">
          <span className="font-heading text-3xl font-semibold tabular-nums">
            {money(period.total)}
          </span>
          <Badge variant="secondary" className="ms-auto tabular-nums">
            <HugeiconsIcon
              icon={period.up ? ArrowUp01Icon : ArrowDown01Icon}
              strokeWidth={2}
              data-icon="inline-start"
            />
            {period.delta}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex min-w-0 flex-col gap-0.5 rounded-lg bg-muted/50 px-3 py-2.5">
            <span className="truncate text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Input
            </span>
            <span className="text-base font-semibold tabular-nums">
              {active ? active.input : period.input}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {active ? active.note : period.inputNote}
            </span>
          </div>
          <div className="flex min-w-0 flex-col gap-0.5 rounded-lg bg-muted/50 px-3 py-2.5">
            <span className="truncate text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Output
            </span>
            <span className="text-base font-semibold tabular-nums">
              {active ? active.output : period.output}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {active ? active.label : period.outputNote}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-2">
            <span className="truncate text-xs font-medium tracking-wider text-muted-foreground uppercase">
              {breakdown === "models" ? "By model" : "By day"}
            </span>
            {active ? (
              <button
                type="button"
                className="shrink-0 text-xs text-muted-foreground underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:text-foreground focus-visible:underline"
                onClick={() => setSelected(null)}
              >
                Clear selection
              </button>
            ) : (
              <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                {rows.length} rows
              </span>
            )}
          </div>
          {rows.map((row) => {
            const isSelected = row.key === selected

            return (
              <button
                key={row.key}
                type="button"
                aria-pressed={isSelected}
                onClick={() =>
                  setSelected((current) =>
                    current === row.key ? null : row.key
                  )
                }
                className={cn(
                  "flex flex-col gap-2 rounded-lg bg-muted/50 px-3 py-2.5 text-start transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
                  isSelected && "bg-accent ring-1 ring-foreground/15"
                )}
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className="min-w-0 truncate font-mono text-xs">
                    {row.label}
                  </span>
                  <span className="shrink-0 text-xs font-medium tabular-nums">
                    {money(row.cost)}
                  </span>
                </span>
                <span
                  className="block h-1 w-full overflow-hidden rounded-full bg-foreground/10"
                  role="img"
                  aria-label={`${row.label} spend ${money(row.cost)}`}
                >
                  <span
                    className={cn(
                      "block h-full rounded-full transition-[width] duration-300",
                      row.bar
                    )}
                    style={{ width: `${(row.cost / max) * 100}%` }}
                  />
                </span>
              </button>
            )
          })}
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <span className="min-w-0 truncate text-xs text-muted-foreground">
          Monthly budget $2,000
        </span>
        <span className="shrink-0 text-xs font-medium tabular-nums">
          {period.used}
        </span>
      </CardFooter>
    </Card>
  )
}
