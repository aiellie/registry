"use client"

import * as React from "react"
import {
  Copy01Icon,
  PauseIcon,
  PlayIcon,
  RefreshIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
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
import {
  Status,
  StatusIndicator,
  StatusLabel,
} from "@/components/aiellie/ui/status"
import { toast } from "@/components/ui/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const TRACE_ID = "trace_01jq8f4m"

const STEPS = [
  {
    tool: "glob",
    args: "src/**/auth/*.ts",
    seconds: 0.2,
    output: ["src/auth/session.ts", "src/auth/tokens.ts", "2 files matched"],
  },
  {
    tool: "read",
    args: "src/auth/session.ts",
    seconds: 0.4,
    output: ["read 214 lines (6.2 kB)", "language: typescript"],
  },
  {
    tool: "edit",
    args: "session.ts · +18 −6",
    seconds: 1.1,
    output: [
      "@@ -42,6 +42,18 @@",
      "+  if (!session.expiresAt) {",
      "+    return refresh(session)",
      "+  }",
    ],
  },
  {
    tool: "bash",
    args: "pnpm typecheck --pretty",
    seconds: 8.9,
    output: ["> tsc --noEmit", "No errors found.", "Done in 8.9s"],
  },
  {
    tool: "test",
    args: "auth.spec.ts · 24 cases",
    seconds: 1.8,
    output: ["✓ 24 passed (1.8s)", "auth.spec.ts — all green"],
  },
]

/** How long a step takes to replay, per second of its real duration. */
const REPLAY_MS_PER_SECOND = 90
const MIN_STEP_MS = 320
const TICK_MS = 60

function stepDurationMs(seconds: number) {
  return Math.max(MIN_STEP_MS, seconds * REPLAY_MS_PER_SECOND)
}

const DOT: Record<string, string> = {
  done: "bg-success",
  running: "bg-warning",
  queued: "bg-muted-foreground/30",
}

/** The run is paused three steps in, exactly where the static card sat. */
const INITIAL_STEP = 3

export function AgentTrace() {
  // `step` is how many steps have completed; `progress` is the active step's
  // fraction. Both live in one object so a tick can advance them together.
  const [{ step, progress }, setRun] = React.useState({
    step: INITIAL_STEP,
    progress: 0.62,
  })
  const [playing, setPlaying] = React.useState(false)
  const [expanded, setExpanded] = React.useState<string | null>(null)
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null)
  const { isCopied, copyToClipboard } = useCopyToClipboard()

  const finished = step >= STEPS.length

  // Runs only while the user has pressed play; cleared on pause, on reaching
  // the last step, and on unmount. `finished` is in the deps so the timer
  // tears itself down at the end instead of a setState-in-effect.
  React.useEffect(() => {
    if (!playing || finished) {
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = null
      return
    }

    timerRef.current = setInterval(() => {
      setRun((prev) => {
        if (prev.step >= STEPS.length) return prev
        const span = stepDurationMs(STEPS[prev.step].seconds)
        const next = prev.progress + TICK_MS / span
        if (next < 1) return { step: prev.step, progress: next }
        return { step: prev.step + 1, progress: 0 }
      })
    }, TICK_MS)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [playing, finished])

  const isRunning = playing && !finished

  const elapsed = STEPS.reduce((total, item, index) => {
    if (index < step) return total + item.seconds
    if (index === step) return total + item.seconds * progress
    return total
  }, 0)

  const reset = () => {
    setPlaying(false)
    setExpanded(null)
    setRun({ step: INITIAL_STEP, progress: 0.62 })
  }

  const isPristine = step === INITIAL_STEP && !playing

  const copyTrace = async () => {
    const ok = await copyToClipboard(TRACE_ID)
    toast.add({
      title: ok ? "Trace ID copied" : "Couldn't reach the clipboard",
      type: ok ? "success" : "error",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Run</CardTitle>
        <CardDescription className="tabular-nums">
          {STEPS.length} steps · {elapsed.toFixed(1)}s elapsed
        </CardDescription>
        <CardAction>
          {finished ? (
            <Status variant="success">
              <StatusIndicator />
              <StatusLabel>Done</StatusLabel>
            </Status>
          ) : isRunning ? (
            <Status variant="loading" pulse>
              <StatusIndicator />
              <StatusLabel>Running</StatusLabel>
            </Status>
          ) : (
            <Status variant="pending">
              <StatusIndicator />
              <StatusLabel>Paused</StatusLabel>
            </Status>
          )}
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Tool calls
          </span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {step} of {STEPS.length} done
          </span>
        </div>

        <div className="relative flex flex-col gap-3.5">
          <div
            aria-hidden
            className="absolute start-[5px] top-2 bottom-2 w-px bg-border"
          />
          {STEPS.map((item, index) => {
            const state =
              index < step ? "done" : index === step ? "running" : "queued"
            const duration =
              state === "done"
                ? `${item.seconds.toFixed(1)}s`
                : state === "running"
                  ? `${(item.seconds * progress).toFixed(1)}s`
                  : "—"
            const open = expanded === item.tool

            return (
              <Collapsible
                key={item.tool}
                open={open}
                onOpenChange={(next) => setExpanded(next ? item.tool : null)}
              >
                <div className="flex items-start gap-3">
                  <span className="relative mt-1 flex size-2.5 shrink-0 rounded-full ring-4 ring-card">
                    {state === "running" && isRunning ? (
                      <span className="absolute inset-0 animate-ping rounded-full bg-warning opacity-60" />
                    ) : null}
                    <span
                      className={cn(
                        "relative size-full rounded-full",
                        DOT[state]
                      )}
                    />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <CollapsibleTrigger
                      render={
                        <button
                          type="button"
                          className="flex w-full cursor-pointer flex-col gap-0.5 rounded-md text-start outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                          aria-label={`Toggle ${item.tool} output`}
                        />
                      }
                    >
                      <span className="flex items-baseline justify-between gap-2">
                        <span
                          className={cn(
                            "truncate font-mono text-xs font-medium",
                            state === "queued" && "text-muted-foreground"
                          )}
                        >
                          {item.tool}
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                          {duration}
                        </span>
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {item.args}
                      </span>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <pre className="mt-1.5 max-h-24 overflow-auto rounded-lg bg-muted/60 p-2 font-mono text-[0.7rem] leading-relaxed text-muted-foreground">
                        {item.output.join("\n")}
                      </pre>
                    </CollapsibleContent>
                  </div>
                </div>
              </Collapsible>
            )
          })}
        </div>
      </CardContent>

      <CardFooter className="justify-between gap-2">
        <span className="min-w-0 truncate font-mono text-xs text-muted-foreground">
          {TRACE_ID}
        </span>
        <div className="flex shrink-0 items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Reset the trace"
                  disabled={isPristine}
                  onClick={reset}
                />
              }
            >
              <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} />
            </TooltipTrigger>
            <TooltipContent>Reset trace</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={playing ? "Pause the run" : "Play the run"}
                  disabled={finished}
                  onClick={() => setPlaying((value) => !value)}
                />
              }
            >
              <HugeiconsIcon
                icon={playing ? PauseIcon : PlayIcon}
                strokeWidth={2}
              />
            </TooltipTrigger>
            <TooltipContent>{playing ? "Pause" : "Play run"}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Copy trace ID"
                  onClick={() => void copyTrace()}
                />
              }
            >
              <HugeiconsIcon
                icon={isCopied ? Tick02Icon : Copy01Icon}
                strokeWidth={2}
              />
            </TooltipTrigger>
            <TooltipContent>
              {isCopied ? "Copied" : "Copy trace ID"}
            </TooltipContent>
          </Tooltip>
        </div>
      </CardFooter>
    </Card>
  )
}
