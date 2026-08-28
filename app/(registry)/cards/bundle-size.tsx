"use client"

import * as React from "react"
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  Download01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
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
import { toast } from "@/components/ui/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type BaseKey = "main" | "production" | "previous"

const BASES: Record<BaseKey, { label: string; total: number }> = {
  main: { label: "main", total: 214.2 },
  production: { label: "production", total: 222.9 },
  previous: { label: "previous deploy", total: 218.4 },
}

const TOTAL = 218.4
const BUDGET = 250

const CHUNKS = [
  {
    file: "framework-4a1c9f.js",
    size: 84.2,
    share: 38.6,
    className: "bg-chart-1",
    // Size on each baseline, so every delta below is a real subtraction.
    baseline: { main: 84.2, production: 84.2, previous: 84.2 },
    modules: ["react-dom", "react", "scheduler"],
  },
  {
    file: "main-app-7d3e02.js",
    size: 61.8,
    share: 28.3,
    className: "bg-chart-2",
    baseline: { main: 58.4, production: 63.9, previous: 61.8 },
    modules: ["app/(registry)/cards", "recharts", "motion"],
  },
  {
    file: "app/layout-9b12c4.js",
    size: 39.5,
    share: 18.1,
    className: "bg-chart-3",
    baseline: { main: 38.3, production: 40.6, previous: 39.5 },
    modules: ["@base-ui/react", "next-themes", "app/globals.css"],
  },
  {
    file: "polyfills-42d6ab.js",
    size: 22.6,
    share: 10.3,
    className: "bg-chart-4",
    baseline: { main: 23.0, production: 22.6, previous: 22.6 },
    modules: ["core-js/stable", "regenerator-runtime"],
  },
  {
    file: "other",
    size: 10.3,
    share: 4.7,
    className: "bg-chart-5",
    baseline: { main: 10.3, production: 11.6, previous: 10.3 },
    modules: ["webpack runtime", "css chunks"],
  },
]

function formatDelta(value: number) {
  if (Math.abs(value) < 0.05) return "±0"
  return `${value > 0 ? "+" : "−"}${Math.abs(value).toFixed(1)} kB`
}

export function BundleSize() {
  const [base, setBase] = React.useState<BaseKey>("main")
  const [selected, setSelected] = React.useState<string | null>(null)
  const { copyToClipboard } = useCopyToClipboard()

  const totalDelta = TOTAL - BASES[base].total
  const overBudget = TOTAL > BUDGET
  const headroom = ((BUDGET - TOTAL) / BUDGET) * 100

  const detail = CHUNKS.find((chunk) => chunk.file === selected)

  const download = async () => {
    const ok = await copyToClipboard(
      JSON.stringify(
        {
          total: TOTAL,
          comparedTo: BASES[base].label,
          chunks: CHUNKS.map((c) => ({ file: c.file, size: c.size })),
        },
        null,
        2
      )
    )
    toast.add({
      title: ok ? "stats.json copied" : "Couldn't reach the clipboard",
      type: ok ? "success" : "error",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bundle Size</CardTitle>
        <CardDescription className="truncate font-mono text-xs">
          app/(registry) · production
        </CardDescription>
        <CardAction>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Copy stats.json"
                  onClick={() => void download()}
                />
              }
            >
              <HugeiconsIcon icon={Download01Icon} strokeWidth={2} />
            </TooltipTrigger>
            <TooltipContent>Copy stats.json</TooltipContent>
          </Tooltip>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="font-heading text-3xl font-semibold tabular-nums">
            {TOTAL}
          </span>
          <span className="text-sm text-muted-foreground">kB gzipped</span>
          <Badge
            variant={totalDelta > 0 ? "destructive" : "secondary"}
            className="ms-auto tabular-nums"
          >
            <HugeiconsIcon
              icon={totalDelta > 0 ? ArrowUp01Icon : ArrowDown01Icon}
              strokeWidth={2}
              data-icon="inline-start"
            />
            {formatDelta(totalDelta)}
          </Badge>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="sm" className="w-full">
                Compared to {BASES[base].label}
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  strokeWidth={2}
                  data-icon="inline-end"
                />
              </Button>
            }
          />
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Compare against</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={base}
                onValueChange={(value) => setBase(String(value) as BaseKey)}
              >
                {(Object.keys(BASES) as BaseKey[]).map((key) => (
                  <DropdownMenuRadioItem key={key} value={key}>
                    {BASES[key].label}
                    <span className="ms-auto text-xs text-muted-foreground tabular-nums">
                      {BASES[key].total} kB
                    </span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div
          className="flex h-2.5 w-full gap-0.5"
          role="img"
          aria-label="Share of bundle size by chunk"
        >
          {CHUNKS.map((chunk) => (
            <div
              key={chunk.file}
              className={cn(
                "h-full rounded-full transition-opacity",
                chunk.className,
                selected && selected !== chunk.file && "opacity-30"
              )}
              style={{ width: `${chunk.share}%` }}
            />
          ))}
        </div>

        <div className="flex flex-col gap-2.5">
          {CHUNKS.map((chunk) => {
            const delta = chunk.size - chunk.baseline[base]
            const isSelected = selected === chunk.file
            return (
              <button
                key={chunk.file}
                type="button"
                onClick={() => setSelected(isSelected ? null : chunk.file)}
                aria-pressed={isSelected}
                className={cn(
                  "-mx-1 flex cursor-pointer items-center gap-2 rounded-md px-1 py-0.5 text-start outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  isSelected && "bg-muted"
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "size-2 shrink-0 rounded-full",
                    chunk.className
                  )}
                />
                <span className="min-w-0 flex-1 truncate font-mono text-xs">
                  {chunk.file}
                </span>
                <span className="shrink-0 text-xs font-medium tabular-nums">
                  {chunk.size} kB
                </span>
                <span
                  className={cn(
                    "w-14 shrink-0 text-end text-[11px] tabular-nums",
                    delta > 0.05
                      ? "text-destructive"
                      : delta < -0.05
                        ? "text-success"
                        : "text-muted-foreground"
                  )}
                >
                  {formatDelta(delta)}
                </span>
              </button>
            )
          })}
        </div>

        {detail ? (
          <div className="flex flex-col gap-1 rounded-lg bg-muted/50 p-2.5">
            <span className="text-[10px] tracking-wider text-muted-foreground uppercase">
              Top modules
            </span>
            {detail.modules.map((module) => (
              <span key={module} className="truncate font-mono text-[11px]">
                {module}
              </span>
            ))}
          </div>
        ) : null}
      </CardContent>

      <CardFooter className="justify-between gap-2">
        <span className="min-w-0 truncate text-xs text-muted-foreground">
          Budget {BUDGET} kB
        </span>
        <span
          className={cn(
            "shrink-0 rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums",
            overBudget
              ? "bg-destructive/10 text-destructive"
              : "bg-success/10 text-success"
          )}
        >
          {overBudget
            ? `${Math.abs(headroom).toFixed(0)}% over`
            : `${headroom.toFixed(0)}% headroom`}
        </span>
      </CardFooter>
    </Card>
  )
}
