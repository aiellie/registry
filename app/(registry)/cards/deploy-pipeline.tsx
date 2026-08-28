"use client"

import * as React from "react"
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  CloudUploadIcon,
  CodeIcon,
  GitBranchIcon,
  Loading03Icon,
  RefreshIcon,
  Rocket01Icon,
  Tick02Icon,
  Timer01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const COMMIT = "a3f19c2"

/** Wall-clock seconds each stage takes; the run replays them 4x faster. */
const stages = [
  {
    name: "Build",
    icon: CodeIcon,
    seconds: 42,
    summary: "next build, 148 modules",
    logs: [
      "$ next build",
      "▲ Next.js 16.0.1 (turbopack)",
      "✓ Compiled 148 modules",
      "✓ Static pages 42/42",
    ],
  },
  {
    name: "Test",
    icon: CheckmarkCircle02Icon,
    seconds: 78,
    summary: "vitest run, 265 passed",
    logs: [
      "$ vitest run",
      "✓ unit/components 142",
      "✓ unit/hooks 68",
      "✓ a11y/axe 21",
    ],
  },
  {
    name: "Preview",
    icon: CloudUploadIcon,
    seconds: 24,
    summary: "Uploaded to the edge network",
    logs: [
      "$ vercel deploy",
      "Uploading 8.4 MB",
      "✓ nova-8f2c1.aiellie.dev",
      "Build cache HIT",
    ],
  },
  {
    name: "Production",
    icon: Rocket01Icon,
    seconds: 38,
    summary: "Aliased and promoted",
    logs: [
      "$ vercel promote",
      "Aliasing registry.aiellie.dev",
      "✓ iad1 ready",
      "✓ ewr1 ready",
    ],
  },
]

const offsets = stages.reduce<number[]>((accumulator, stage, index) => {
  accumulator.push(
    index === 0 ? 0 : accumulator[index - 1] + stages[index - 1].seconds
  )
  return accumulator
}, [])

const TOTAL_SECONDS = stages.reduce((total, stage) => total + stage.seconds, 0)
const TICK_MS = 110
const SECONDS_PER_TICK = 4

type StageState = "pending" | "active" | "done"

const nodeStyles: Record<StageState, string> = {
  done: "bg-success/12 text-success ring-1 ring-success/25",
  active: "bg-primary text-primary-foreground ring-4 ring-primary/15",
  pending: "bg-muted text-muted-foreground ring-1 ring-border",
}

const segmentStyles: Record<StageState, string> = {
  done: "bg-success/50",
  active: "bg-border",
  pending: "bg-border",
}

function formatDuration(seconds: number) {
  if (seconds < 60) {
    return `${seconds}s`
  }
  const minutes = Math.floor(seconds / 60)
  return `${minutes}m ${String(seconds % 60).padStart(2, "0")}s`
}

export function DeployPipeline() {
  const [elapsed, setElapsed] = React.useState(TOTAL_SECONDS)
  const [running, setRunning] = React.useState(false)
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null)
  const { isCopied, copyToClipboard } = useCopyToClipboard()

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  function clear() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  function stageState(index: number): StageState {
    if (!running) {
      return "done"
    }
    const start = offsets[index]
    if (elapsed >= start + stages[index].seconds) {
      return "done"
    }
    return elapsed >= start ? "active" : "pending"
  }

  function handleDeploy() {
    if (running) {
      clear()
      setRunning(false)
      setElapsed(TOTAL_SECONDS)
      toast.add({
        title: "Deploy cancelled",
        description: `Kept the last production build of ${COMMIT}.`,
        type: "info",
      })
      return
    }

    clear()
    setElapsed(0)
    setRunning(true)

    let value = 0
    intervalRef.current = setInterval(() => {
      value += SECONDS_PER_TICK
      if (value >= TOTAL_SECONDS) {
        clear()
        setElapsed(TOTAL_SECONDS)
        setRunning(false)
        toast.add({
          title: "Promoted to production",
          description: `${COMMIT} is live in iad1 and ewr1.`,
          type: "success",
        })
        return
      }
      setElapsed(value)
    }, TICK_MS)
  }

  async function handleCopyCommit() {
    const copied = await copyToClipboard(COMMIT)

    toast.add(
      copied
        ? {
            title: "Commit copied",
            description: COMMIT,
            type: "success",
          }
        : {
            title: "Copy failed",
            description: "The clipboard is not available here.",
            type: "error",
          }
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deploy Pipeline</CardTitle>
        <CardDescription className="flex min-w-0 items-center gap-1.5 text-xs">
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  onClick={handleCopyCommit}
                  className="shrink-0 rounded-sm font-mono text-foreground underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              }
            >
              {COMMIT}
            </TooltipTrigger>
            <TooltipContent>
              {isCopied ? "Copied" : "Copy commit SHA"}
            </TooltipContent>
          </Tooltip>
          <span aria-hidden className="shrink-0">
            &middot;
          </span>
          <HugeiconsIcon
            icon={GitBranchIcon}
            strokeWidth={2}
            className="size-3.5 shrink-0"
          />
          <span className="truncate font-mono">feat/registry-cards</span>
        </CardDescription>
        <CardAction>
          <Badge variant="secondary" className="font-mono tabular-nums">
            #248
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-start">
          {stages.map((stage, index) => {
            const state = stageState(index)
            const stageElapsed = Math.min(
              Math.max(elapsed - offsets[index], 0),
              stage.seconds
            )
            const duration =
              state === "done"
                ? formatDuration(stage.seconds)
                : state === "active"
                  ? formatDuration(stageElapsed)
                  : "Queued"

            return (
              <Popover key={stage.name}>
                <PopoverTrigger
                  render={
                    <button
                      type="button"
                      disabled={state !== "done"}
                      aria-label={`${stage.name} stage, ${state}, ${duration}`}
                      className="flex min-w-0 flex-1 flex-col gap-2 rounded-md text-start outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-default"
                    />
                  }
                >
                  <span className="flex items-center">
                    <span
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-full transition-colors",
                        nodeStyles[state]
                      )}
                    >
                      <HugeiconsIcon
                        icon={
                          state === "done"
                            ? Tick02Icon
                            : state === "active"
                              ? Loading03Icon
                              : stage.icon
                        }
                        strokeWidth={2}
                        className={cn(
                          "size-3.5",
                          state === "active" && "animate-spin"
                        )}
                      />
                    </span>
                    {index < stages.length - 1 ? (
                      <span
                        className={cn(
                          "h-0.5 flex-1 rounded-full transition-colors",
                          segmentStyles[state]
                        )}
                      />
                    ) : null}
                  </span>
                  <span className="flex min-w-0 flex-col gap-0.5 pe-2">
                    <span className="truncate text-xs font-medium">
                      {stage.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground tabular-nums">
                      {duration}
                    </span>
                  </span>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-60">
                  <PopoverHeader>
                    <PopoverTitle className="text-xs">
                      {stage.name} &middot; {formatDuration(stage.seconds)}
                    </PopoverTitle>
                    <PopoverDescription className="text-xs">
                      {stage.summary}
                    </PopoverDescription>
                  </PopoverHeader>
                  <div className="flex flex-col gap-1 rounded-lg bg-muted/60 p-2">
                    {stage.logs.map((line) => (
                      <span
                        key={line}
                        className="truncate font-mono text-xs text-muted-foreground"
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )
          })}
        </div>
        <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/50 p-3">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Preview
            </span>
            <span className="truncate font-mono text-xs">
              nova-8f2c1.aiellie.dev
            </span>
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Region
            </span>
            <span className="truncate font-mono text-xs">
              iad1 &middot; ewr1
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <Status variant={running ? "loading" : "success"} pulse={running}>
          <StatusIndicator />
          <StatusLabel>{running ? "Deploying" : "Ready"}</StatusLabel>
        </Status>
        <div className="flex shrink-0 items-center gap-2">
          <span
            data-slot="deploy-total"
            className="flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums"
          >
            <HugeiconsIcon
              icon={Timer01Icon}
              strokeWidth={2}
              className="size-3.5"
            />
            {formatDuration(elapsed)}
          </span>
          <Button
            variant={running ? "destructive" : "outline"}
            size="sm"
            onClick={handleDeploy}
          >
            <HugeiconsIcon
              icon={running ? Cancel01Icon : RefreshIcon}
              strokeWidth={2}
            />
            {running ? "Cancel" : "Redeploy"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
