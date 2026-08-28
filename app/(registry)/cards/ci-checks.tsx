"use client"

import * as React from "react"
import {
  CancelCircleIcon,
  CheckmarkCircle02Icon,
  MinusSignCircleIcon,
  PlayIcon,
  RefreshIcon,
  StopIcon,
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Spinner } from "@/components/ui/spinner"
import {
  Status,
  StatusIndicator,
  StatusLabel,
} from "@/components/aiellie/ui/status"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type SuiteStatus = "pending" | "running" | "passed" | "failed"

type Suite = {
  name: string
  /** Wall-clock the run would really take — only ever displayed. */
  seconds: number
  /** How long this suite takes to replay in the card. */
  simMs: number
  passed: number
  skipped: number
  /** Failures on the very first run; a re-run always green-lights the suite. */
  initialFailed: number
  output: string[]
}

const SUITES: Suite[] = [
  {
    name: "unit/components",
    seconds: 64,
    simMs: 1100,
    passed: 142,
    skipped: 0,
    initialFailed: 0,
    output: [],
  },
  {
    name: "unit/hooks",
    seconds: 22,
    simMs: 700,
    passed: 68,
    skipped: 0,
    initialFailed: 0,
    output: [],
  },
  {
    name: "e2e/registry",
    seconds: 192,
    simMs: 1600,
    passed: 34,
    skipped: 0,
    initialFailed: 3,
    output: [
      "FAIL  e2e/registry/install.spec.ts",
      "  ● installs a component from the registry URL",
      "",
      "    expect(received).toHaveText(expected)",
      "",
      '    Expected: "Added 1 file"',
      '    Received: "Added 0 files"',
      "",
      "      at install.spec.ts:42:38",
    ],
  },
  {
    name: "a11y/axe",
    seconds: 41,
    simMs: 800,
    passed: 21,
    skipped: 12,
    initialFailed: 0,
    output: [],
  },
]

const TICK_MS = 60

/** Seconds → the `1m 04s` / `41s` shape the rest of the card uses. */
function formatDuration(seconds: number) {
  const whole = Math.round(seconds)
  if (whole < 60) return `${whole}s`
  const minutes = Math.floor(whole / 60)
  return `${minutes}m ${String(whole % 60).padStart(2, "0")}s`
}

type RunState = Record<
  string,
  { status: SuiteStatus; failed: number; progress: number }
>

/** Every suite settled the way the first CI run found them. */
function initialRun(): RunState {
  return Object.fromEntries(
    SUITES.map((suite) => [
      suite.name,
      {
        status:
          suite.initialFailed > 0
            ? ("failed" as SuiteStatus)
            : ("passed" as SuiteStatus),
        failed: suite.initialFailed,
        progress: 1,
      },
    ])
  )
}

export function CiChecks() {
  // Suites and queue live in ONE state object: the tick both advances the
  // active suite and pops it off the queue, and those must land together or a
  // double-invoked updater would skip a suite.
  const [{ suites: run, queue }, setState] = React.useState<{
    suites: RunState
    queue: string[]
  }>(() => ({ suites: initialRun(), queue: [] }))
  const [expanded, setExpanded] = React.useState<string | null>(null)
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null)
  // Snapshotted when a run starts so Cancel can put the card back exactly.
  const restoreRef = React.useRef<RunState | null>(null)

  const isRunning = queue.length > 0

  const stopTimer = React.useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // The only timer in the card, and it exists solely while a run is in flight.
  React.useEffect(() => {
    if (!isRunning) {
      stopTimer()
      return
    }

    timerRef.current = setInterval(() => {
      setState((prev) => {
        const name = prev.queue[0]
        if (!name) return prev
        const suite = SUITES.find((item) => item.name === name)
        if (!suite) return prev

        const current = prev.suites[name]
        const next = Math.min(1, current.progress + TICK_MS / suite.simMs)

        if (next < 1) {
          return {
            queue: prev.queue,
            suites: { ...prev.suites, [name]: { ...current, progress: next } },
          }
        }

        // Settled: a deliberate re-run is what fixes the flaky e2e suite.
        return {
          queue: prev.queue.slice(1),
          suites: {
            ...prev.suites,
            [name]: { status: "passed", failed: 0, progress: 1 },
          },
        }
      })
    }, TICK_MS)

    return stopTimer
  }, [isRunning, stopTimer])

  const start = (names: string[]) => {
    if (names.length === 0) return
    setExpanded(null)
    setState((prev) => {
      restoreRef.current = prev.suites
      const suites = { ...prev.suites }
      for (const name of names) {
        suites[name] = { status: "running", failed: 0, progress: 0 }
      }
      return { suites, queue: names }
    })
  }

  const cancel = () => {
    stopTimer()
    setState((prev) => ({
      suites: restoreRef.current ?? prev.suites,
      queue: [],
    }))
  }

  const reset = () => {
    stopTimer()
    restoreRef.current = null
    setExpanded(null)
    setState({ suites: initialRun(), queue: [] })
  }

  const failing = SUITES.filter((suite) => run[suite.name].failed > 0)
  const totals = SUITES.reduce(
    (acc, suite) => {
      const state = run[suite.name]
      const settled = state.status === "passed" || state.status === "failed"
      return {
        passed: acc.passed + (settled ? suite.passed : 0),
        failed: acc.failed + state.failed,
        skipped: acc.skipped + (settled ? suite.skipped : 0),
      }
    },
    { passed: 0, failed: 0, skipped: 0 }
  )

  const elapsed = SUITES.reduce(
    (total, suite) => total + suite.seconds * run[suite.name].progress,
    0
  )
  const overall =
    SUITES.reduce((total, suite) => total + run[suite.name].progress, 0) /
    SUITES.length
  const isDirty = SUITES.some(
    (suite) => run[suite.name].failed !== suite.initialFailed
  )

  // Each tile carries its state as a tint behind the matching foreground,
  // so the result reads at a glance instead of relying on the number's colour.
  const tiles = [
    {
      label: "Passed",
      value: totals.passed,
      className: "text-success",
      tint: "bg-success/10 ring-success/15",
    },
    {
      label: "Failed",
      value: totals.failed,
      className: totals.failed ? "text-destructive" : "text-muted-foreground",
      tint: totals.failed
        ? "bg-destructive/10 ring-destructive/15"
        : "bg-muted/50 ring-transparent",
    },
    {
      label: "Skipped",
      value: totals.skipped,
      className: "text-warning",
      tint: "bg-warning/10 ring-warning/15",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Suites</CardTitle>
        <CardDescription className="truncate font-mono text-xs">
          vitest run &middot; node 22 &middot; #2841
        </CardDescription>
        <CardAction>
          {isRunning ? (
            <Status variant="loading" pulse>
              <StatusIndicator />
              <StatusLabel>Running</StatusLabel>
            </Status>
          ) : totals.failed > 0 ? (
            <Status variant="error">
              <StatusIndicator />
              <StatusLabel>{totals.failed} failed</StatusLabel>
            </Status>
          ) : (
            <Status variant="success">
              <StatusIndicator />
              <StatusLabel>Passing</StatusLabel>
            </Status>
          )}
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-2">
          {tiles.map((tile) => (
            <div
              key={tile.label}
              className={cn(
                "flex flex-col gap-0.5 rounded-lg px-2.5 py-2 ring-1 ring-inset",
                tile.tint
              )}
            >
              <span
                className={cn(
                  "font-heading text-lg leading-tight font-semibold tabular-nums",
                  tile.className
                )}
              >
                {tile.value}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {tile.label}
              </span>
            </div>
          ))}
        </div>

        {/* Only present mid-run, so the resting card keeps its original shape. */}
        {isRunning ? (
          <div
            className="h-1 w-full overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-label="Test run progress"
            aria-valuenow={Math.round(overall * 100)}
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-75"
              style={{ width: `${overall * 100}%` }}
            />
          </div>
        ) : null}

        <div className="flex flex-col gap-3">
          {SUITES.map((suite) => {
            const state = run[suite.name]
            const total = suite.passed + state.failed + suite.skipped
            const running = state.status === "running"
            const icon = state.failed
              ? CancelCircleIcon
              : suite.skipped
                ? MinusSignCircleIcon
                : CheckmarkCircle02Icon
            const iconClass = state.failed
              ? "text-destructive"
              : suite.skipped
                ? "text-muted-foreground"
                : "text-success"
            const hasOutput = suite.output.length > 0 && state.failed > 0

            const row = (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  {running ? (
                    <Spinner className="size-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <HugeiconsIcon
                      icon={icon}
                      strokeWidth={2}
                      className={cn("size-4 shrink-0", iconClass)}
                    />
                  )}
                  <span className="min-w-0 flex-1 truncate font-mono text-xs font-medium">
                    {suite.name}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                    {formatDuration(suite.seconds * state.progress)}
                  </span>
                </div>
                <div className="flex items-center gap-2 ps-6">
                  <div
                    className="flex h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted"
                    role="img"
                    aria-label={`${suite.passed} of ${total} tests passed`}
                  >
                    <div
                      className="h-full bg-success transition-[width] duration-75"
                      style={{
                        width: `${(suite.passed / total) * 100 * state.progress}%`,
                      }}
                    />
                    <div
                      className="h-full bg-destructive"
                      style={{
                        width: `${(state.failed / total) * 100 * state.progress}%`,
                      }}
                    />
                  </div>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
                    {Math.round(suite.passed * state.progress)}/{total}
                  </span>
                </div>
              </div>
            )

            if (!hasOutput) {
              return <div key={suite.name}>{row}</div>
            }

            return (
              <Collapsible
                key={suite.name}
                open={expanded === suite.name}
                onOpenChange={(open) => setExpanded(open ? suite.name : null)}
              >
                <CollapsibleTrigger
                  render={
                    <button
                      type="button"
                      className="w-full cursor-pointer rounded-lg text-start outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                      aria-label={`Toggle ${suite.name} failure output`}
                    />
                  }
                >
                  {row}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <pre className="mt-2 max-h-32 overflow-auto rounded-lg bg-muted/60 p-2.5 font-mono text-[0.7rem] leading-relaxed text-muted-foreground">
                    {suite.output.join("\n")}
                  </pre>
                </CollapsibleContent>
              </Collapsible>
            )
          })}
        </div>
      </CardContent>

      <CardFooter className="justify-between gap-2">
        <span className="truncate text-xs text-muted-foreground tabular-nums">
          {isRunning
            ? `Running · ${formatDuration(elapsed)}`
            : `Finished in ${formatDuration(elapsed)}`}
        </span>
        <div className="flex shrink-0 items-center gap-1.5">
          {isDirty && !isRunning ? (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Reset to the original run"
                    onClick={reset}
                  />
                }
              >
                <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>Reset run</TooltipContent>
            </Tooltip>
          ) : null}
          {isRunning ? (
            <Button variant="outline" size="sm" onClick={cancel}>
              <HugeiconsIcon icon={StopIcon} strokeWidth={2} />
              Cancel
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => start(SUITES.map((suite) => suite.name))}
              >
                <HugeiconsIcon icon={PlayIcon} strokeWidth={2} />
                Run all
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={failing.length === 0}
                onClick={() => start(failing.map((suite) => suite.name))}
              >
                <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} />
                Re-run failed
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
