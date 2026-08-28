"use client"

import * as React from "react"
import { RefreshIcon } from "@hugeicons/core-free-icons"
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
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type Benchmark = {
  name: string
  bar: string
  tasks: number
  /** Score per run, indexed by the run's position in `RUNS`. */
  scores: number[]
}

/** Newest last — a run's delta is always measured against the one before it. */
const RUNS = [417, 418, 419]

const BENCHMARKS: Benchmark[] = [
  {
    name: "HumanEval",
    bar: "bg-chart-1",
    tasks: 164,
    scores: [90.3, 92.1, 93.4],
  },
  {
    name: "MATH-500",
    bar: "bg-chart-2",
    tasks: 500,
    scores: [93.3, 94.2, 94.0],
  },
  {
    name: "MMLU-Pro",
    bar: "bg-chart-3",
    tasks: 1187,
    scores: [88.3, 88.7, 90.2],
  },
  {
    name: "SWE-bench Verified",
    bar: "bg-chart-4",
    tasks: 500,
    scores: [67.1, 71.3, 74.8],
  },
  {
    name: "GPQA Diamond",
    bar: "bg-chart-5",
    tasks: 198,
    scores: [69.5, 68.4, 71.6],
  },
]

const DURATIONS = ["39m 48s", "41m 12s", "43m 05s"]

function mean(values: number[]) {
  return values.reduce((total, value) => total + value, 0) / values.length
}

function signed(value: number) {
  // U+2212 minus, to match the typographic minus the rest of the cards use.
  return `${value >= 0 ? "+" : "−"}${Math.abs(value).toFixed(1)}`
}

export function EvalScores() {
  // Index into RUNS. Starts at #418 so the resting card matches the design.
  const [runIndex, setRunIndex] = React.useState(1)
  const [running, setRunning] = React.useState(false)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // Only ever clears a re-run that was interrupted by unmounting.
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const rerun = () => {
    if (running) return
    setRunning(true)
    timerRef.current = setTimeout(() => {
      setRunIndex((index) => (index + 1) % RUNS.length)
      setRunning(false)
    }, 1400)
  }

  const previousIndex = (runIndex - 1 + RUNS.length) % RUNS.length
  const overall = mean(BENCHMARKS.map((item) => item.scores[runIndex]))
  const overallPrevious = mean(
    BENCHMARKS.map((item) => item.scores[previousIndex])
  )
  const overallDelta = overall - overallPrevious
  const totalTasks = BENCHMARKS.reduce((total, item) => total + item.tasks, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Eval Suite</CardTitle>
        <CardDescription>
          run #{RUNS[runIndex]} · claude-opus-4.5
        </CardDescription>
        <CardAction>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="bg-muted"
                  aria-label="Re-run benchmark suite"
                  disabled={running}
                  onClick={rerun}
                />
              }
            >
              {running ? (
                <Spinner />
              ) : (
                <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} />
              )}
            </TooltipTrigger>
            <TooltipContent>
              {running ? "Running…" : "Re-run suite"}
            </TooltipContent>
          </Tooltip>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <svg
              viewBox="0 0 36 36"
              className="size-16 -rotate-90 text-chart-2"
              role="img"
              aria-label={`Overall score ${overall.toFixed(1)} out of 100`}
            >
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                fill="none"
                strokeWidth="3"
                className="stroke-muted"
              />
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${overall.toFixed(1)} 100`}
                className="transition-[stroke-dasharray] duration-500"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold tabular-nums">
              {overall.toFixed(1)}
            </span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Overall
            </span>
            <div className="flex min-w-0 items-center gap-2">
              <Badge variant="secondary" className="tabular-nums">
                {signed(overallDelta)}
              </Badge>
              <span className="truncate text-xs text-muted-foreground">
                vs run #{RUNS[previousIndex]}
              </span>
            </div>
            <span className="truncate text-xs text-muted-foreground tabular-nums">
              {totalTasks.toLocaleString("en-US")} tasks · {DURATIONS[runIndex]}
            </span>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-3">
          {BENCHMARKS.map((benchmark) => {
            const score = benchmark.scores[runIndex]
            const previous = benchmark.scores[previousIndex]
            const delta = score - previous

            return (
              <Popover key={benchmark.name}>
                <PopoverTrigger
                  render={
                    <button
                      type="button"
                      className="flex w-full cursor-pointer flex-col gap-1.5 rounded-lg text-start outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                      aria-label={`${benchmark.name} details`}
                    />
                  }
                >
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="min-w-0 truncate text-xs font-medium">
                      {benchmark.name}
                    </span>
                    <span className="flex shrink-0 items-baseline gap-1.5">
                      <span className="text-xs font-medium tabular-nums">
                        {score.toFixed(1)}
                      </span>
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums",
                          delta >= 0
                            ? "bg-success/10 text-success"
                            : "bg-destructive/10 text-destructive"
                        )}
                      >
                        {signed(delta)}
                      </span>
                    </span>
                  </span>
                  <span
                    className="block h-1.5 w-full overflow-hidden rounded-full bg-muted"
                    role="img"
                    aria-label={`${benchmark.name} scored ${score.toFixed(1)} out of 100`}
                  >
                    <span
                      className={cn(
                        "block h-full rounded-full transition-[width] duration-500",
                        benchmark.bar
                      )}
                      style={{ width: `${score}%` }}
                    />
                  </span>
                </PopoverTrigger>
                <PopoverContent className="w-56">
                  <PopoverTitle>{benchmark.name}</PopoverTitle>
                  <PopoverDescription>
                    {benchmark.tasks.toLocaleString("en-US")} tasks in this
                    benchmark.
                  </PopoverDescription>
                  <dl className="mt-3 flex flex-col gap-1.5 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-muted-foreground">
                        Run #{RUNS[runIndex]}
                      </dt>
                      <dd className="font-medium tabular-nums">
                        {score.toFixed(1)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-muted-foreground">
                        Run #{RUNS[previousIndex]}
                      </dt>
                      <dd className="tabular-nums">{previous.toFixed(1)}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-muted-foreground">Change</dt>
                      <dd
                        className={cn(
                          "font-medium tabular-nums",
                          delta >= 0 ? "text-success" : "text-destructive"
                        )}
                      >
                        {signed(delta)}
                      </dd>
                    </div>
                  </dl>
                </PopoverContent>
              </Popover>
            )
          })}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setRunIndex(previousIndex)}
        >
          Compare with run #{RUNS[previousIndex]}
        </Button>
      </CardFooter>
    </Card>
  )
}
