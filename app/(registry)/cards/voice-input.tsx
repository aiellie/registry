"use client"

import * as React from "react"

import {
  AiBrain01Icon,
  Mic02Icon,
  StopIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { LiveWaveform } from "@/components/ai/live-waveform"
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type CaptureState = "idle" | "recording" | "processing"

const STATUS = {
  idle: { variant: "cancelled", label: "Ready" },
  recording: { variant: "recording", label: "Recording" },
  processing: { variant: "loading", label: "Transcribing" },
} as const

const formatDuration = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`

export function VoiceInput() {
  const [state, setState] = React.useState<CaptureState>("idle")
  const [seconds, setSeconds] = React.useState(0)

  // A plain counter rather than a wall clock, so the first client render
  // always matches what the server sent.
  React.useEffect(() => {
    if (state !== "recording") return
    const timer = setInterval(() => setSeconds((prev) => prev + 1), 1000)
    return () => clearInterval(timer)
  }, [state])

  React.useEffect(() => {
    if (state !== "processing") return
    const timer = setTimeout(() => setState("idle"), 1600)
    return () => clearTimeout(timer)
  }, [state])

  const isRecording = state === "recording"
  const status = STATUS[state]

  const toggle = () => {
    if (isRecording) {
      setState("processing")
      return
    }
    setSeconds(0)
    setState("recording")
  }

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="truncate">Voice capture</CardTitle>
        <CardDescription className="truncate">
          whisper-large-v3 · en-US
        </CardDescription>
        <CardAction>
          <Status pulse={state !== "idle"} variant={status.variant}>
            <StatusIndicator />
            <StatusLabel>{status.label}</StatusLabel>
          </Status>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  aria-label={
                    isRecording ? "Stop recording" : "Start recording"
                  }
                  className="shrink-0 rounded-full"
                  onClick={toggle}
                  size="icon-lg"
                  variant={isRecording ? "destructive" : "default"}
                >
                  <HugeiconsIcon
                    className={isRecording ? "size-3 fill-current" : undefined}
                    icon={isRecording ? StopIcon : Mic02Icon}
                    strokeWidth={2}
                  />
                </Button>
              }
            />
            <TooltipContent>
              {isRecording ? "Stop recording" : "Start recording"}
            </TooltipContent>
          </Tooltip>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            {/* `active` would open the microphone; a showcase card animates
                synthetically instead, so nothing prompts for permission. */}
            <LiveWaveform
              barGap={2}
              barWidth={3}
              className="min-w-0 text-primary"
              height={36}
              mode="static"
              processing={state !== "idle"}
            />
            <div className="flex items-center justify-between text-[11px] text-muted-foreground tabular-nums">
              <span>{formatDuration(seconds)}</span>
              <span>16 kHz · mono</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardContent className="flex flex-col gap-2">
        <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
          Last transcript
        </span>
        <p className="text-sm leading-relaxed text-foreground/90">
          “Ship the registry build, then tag the release v2.4.0.”
        </p>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <HugeiconsIcon
            className="size-3.5 shrink-0"
            icon={AiBrain01Icon}
            strokeWidth={2}
          />
          <span className="min-w-0 truncate">
            0:42 · 98% confidence · 12 words
          </span>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button className="flex-1" size="sm" variant="outline">
          Discard
        </Button>
        <Button className="flex-1" size="sm">
          <HugeiconsIcon
            data-icon="inline-start"
            icon={Tick02Icon}
            strokeWidth={2}
          />
          Insert
        </Button>
      </CardFooter>
    </Card>
  )
}
