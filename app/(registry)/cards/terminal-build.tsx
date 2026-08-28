"use client"

import * as React from "react"
import {
  CheckmarkCircle02Icon,
  GitCommitIcon,
  PlayIcon,
  StopIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Terminal,
  TerminalActions,
  TerminalContent,
  TerminalCopyButton,
  TerminalHeader,
  TerminalTitle,
} from "@/components/ai-elements/terminal"
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
  Status,
  StatusIndicator,
  StatusLabel,
} from "@/components/aiellie/ui/status"

const LINES = [
  "$ pnpm registry:build",
  "> shadcn build",
  "✔ registry.json → 150 items",
  "✔ theme.json        4.2 kB",
  "✔ style.json        1.1 kB",
  "✔ block-viewer.json 6.4 kB",
  "✔ terminal.json     3.8 kB",
  "Built 150 items in 1.42s",
]

const STATS = [
  { label: "Items", value: "150" },
  { label: "Time", value: "1.42s" },
  { label: "Payload", value: "612 kB" },
]

const LINE_MS = 220

export function TerminalBuild() {
  // `lines` is how many of LINES have streamed in. It starts complete so the
  // resting card shows a finished build; a run rewinds it to zero.
  const [lines, setLines] = React.useState(LINES.length)
  const [running, setRunning] = React.useState(false)
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  const done = !running && lines === LINES.length

  // Started only by the Run button, and torn down the moment the last line
  // lands or the card unmounts.
  React.useEffect(() => {
    if (!running) {
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = null
      return
    }

    timerRef.current = setInterval(() => {
      setLines((count) => {
        if (count >= LINES.length) return count
        return count + 1
      })
    }, LINE_MS)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [running])

  // Reaching the end ends the run without a setState-in-effect: `running` is
  // only ever cleared from a handler or from this guard's dependency change.
  React.useEffect(() => {
    if (!running || lines < LINES.length) return
    const id = setTimeout(() => setRunning(false), LINE_MS)
    return () => clearTimeout(id)
  }, [running, lines])

  const run = () => {
    setLines(0)
    setRunning(true)
  }

  const cancel = () => {
    setRunning(false)
    setLines(LINES.length)
  }

  const output = LINES.slice(0, lines).join("\n")

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Registry build</CardTitle>
        <CardDescription>Emitted to public/r</CardDescription>
        <CardAction>
          {running ? (
            <Status variant="loading" pulse>
              <StatusIndicator />
              <StatusLabel>Running</StatusLabel>
            </Status>
          ) : (
            <Status variant="success">
              <StatusIndicator />
              <StatusLabel>Passed</StatusLabel>
            </Status>
          )}
        </CardAction>
      </CardHeader>

      <CardContent>
        <Terminal
          // Follows the tail while lines are arriving, then stops fighting the
          // reader once the build has settled.
          autoScroll={running}
          className="rounded-xl bg-muted/40"
          output={output}
        >
          <TerminalHeader className="px-3 py-1.5">
            <TerminalTitle className="min-w-0 text-xs">
              <span className="truncate">registry:build</span>
            </TerminalTitle>
            <TerminalActions>
              <TerminalCopyButton
                aria-label="Copy build output"
                className="size-6"
                tooltip="Copy build output"
              />
            </TerminalActions>
          </TerminalHeader>
          <TerminalContent className="h-44" />
        </Terminal>
      </CardContent>

      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {STATS.map((stat) => (
            <div
              className="rounded-lg bg-muted/60 px-2.5 py-2"
              key={stat.label}
            >
              <div className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                {stat.label}
              </div>
              <div className="mt-0.5 truncate font-heading text-sm font-semibold tabular-nums">
                {done ? stat.value : "—"}
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardContent>
        {running ? (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={cancel}
          >
            <HugeiconsIcon icon={StopIcon} strokeWidth={2} />
            Cancel build
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="w-full" onClick={run}>
            <HugeiconsIcon icon={PlayIcon} strokeWidth={2} />
            Run build
          </Button>
        )}
      </CardContent>

      <CardFooter className="gap-2 text-xs text-muted-foreground">
        <HugeiconsIcon
          className="size-3.5 shrink-0"
          icon={GitCommitIcon}
          strokeWidth={2}
        />
        <span className="min-w-0 flex-1 truncate font-mono">
          c0ac0c5 · main
        </span>
        <HugeiconsIcon
          className="size-3.5 shrink-0 text-success"
          icon={CheckmarkCircle02Icon}
          strokeWidth={2}
        />
        <span className="shrink-0 tabular-nums">
          {done ? "exit 0" : running ? "…" : "exit 0"}
        </span>
      </CardFooter>
    </Card>
  )
}
