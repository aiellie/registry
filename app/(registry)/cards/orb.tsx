"use client"

import * as React from "react"
import Link from "next/link"
import {
  AiBrain01Icon,
  ArrowDown01Icon,
  ArrowRight02Icon,
  CircleIcon,
  ColorsIcon,
  Copy01Icon,
  Megaphone01Icon,
  Mic01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { Orb, type OrbState } from "@/components/ai/orb"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

const ORB_SIZE = 176

type StateEntry = {
  state: OrbState
  icon: IconSvgElement
  label: string
  status: "cancelled" | "recording" | "loading" | "brand"
  statusLabel: string
  caption: string
}

/**
 * The orb is driven through its controlled `state` prop, which bypasses the
 * component's own handler — so "Listening" animates the shader and never
 * touches `getUserMedia`. A showcase card should not ask for a microphone.
 */
const STATES: StateEntry[] = [
  {
    state: "idle",
    icon: CircleIcon,
    label: "Idle",
    status: "cancelled",
    statusLabel: "Ready",
    caption: "Waiting for the wake word",
  },
  {
    state: "listening",
    icon: Mic01Icon,
    label: "Listening",
    status: "recording",
    statusLabel: "Listening",
    caption: "“Summarise today's deploys”",
  },
  {
    state: "thinking",
    icon: AiBrain01Icon,
    label: "Thinking",
    status: "loading",
    statusLabel: "Thinking",
    caption: "Reading 4 sources",
  },
  {
    state: "speaking",
    icon: Megaphone01Icon,
    label: "Speaking",
    status: "brand",
    statusLabel: "Speaking",
    caption: "Three deploys shipped, all green",
  },
]

/** Seed names the orb already knows — each one is a whole palette. */
const PRESETS = ["aiellie", "anthropic", "openai", "google", "deepseek"]

const formatElapsed = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`

export function OrbCard() {
  const [state, setState] = React.useState<OrbState>("idle")
  const [preset, setPreset] = React.useState(PRESETS[0])
  const [elapsed, setElapsed] = React.useState(0)
  const { isCopied, copyToClipboard } = useCopyToClipboard()
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  // A counter rather than a wall clock, so the first client render matches
  // what the server sent — and it only ever runs once a state button is
  // pressed, never on mount.
  React.useEffect(() => {
    if (state === "idle") return

    timerRef.current = setInterval(() => {
      setElapsed((seconds) => seconds + 1)
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [state])

  const current = STATES.find((entry) => entry.state === state) ?? STATES[0]

  const snippet = `<Orb seed="${preset}" state="${state}" size={${ORB_SIZE}} controls={false} states={false} />`

  const selectState = (next: OrbState) => {
    setState(next)
    setElapsed(0)
  }

  const handleCopy = async () => {
    const copied = await copyToClipboard(snippet)

    toast.add(
      copied
        ? {
            title: "Snippet copied",
            description: `The ${preset} orb, ready to paste.`,
            type: "success",
          }
        : { title: "Couldn't reach the clipboard", type: "error" }
    )
  }

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="truncate">Orb</CardTitle>
        <CardDescription className="truncate">
          Realtime voice assistant
        </CardDescription>
        <CardAction>
          <Status pulse={state !== "idle"} variant={current.status}>
            <StatusIndicator />
            <StatusLabel>{current.statusLabel}</StatusLabel>
          </Status>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center overflow-hidden rounded-xl border bg-muted/40 p-3">
          <Orb
            className="shrink-0"
            controls={false}
            seed={preset}
            size={ORB_SIZE}
            state={state}
            states={false}
          />
        </div>
      </CardContent>
      <CardContent className="flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5">
          <HugeiconsIcon
            className="size-3.5 shrink-0 text-muted-foreground"
            icon={current.icon}
            strokeWidth={2}
          />
          <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
            {current.caption}
          </span>
          <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
            {formatElapsed(elapsed)}
          </span>
        </div>
        <ButtonGroup className="w-full">
          {STATES.map((entry) => (
            <Tooltip key={entry.state}>
              <TooltipTrigger
                render={
                  <Button
                    aria-label={entry.label}
                    aria-pressed={state === entry.state}
                    className="flex-1"
                    onClick={() => selectState(entry.state)}
                    size="icon-sm"
                    variant={state === entry.state ? "default" : "outline"}
                  />
                }
              >
                <HugeiconsIcon
                  className="size-4"
                  icon={entry.icon}
                  strokeWidth={2}
                />
              </TooltipTrigger>
              <TooltipContent>{entry.label}</TooltipContent>
            </Tooltip>
          ))}
        </ButtonGroup>
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button className="min-w-0" size="sm" variant="outline" />}
          >
            <HugeiconsIcon
              data-icon="inline-start"
              icon={ColorsIcon}
              strokeWidth={2}
            />
            <span className="truncate">{preset}</span>
            <HugeiconsIcon
              data-icon="inline-end"
              icon={ArrowDown01Icon}
              strokeWidth={2}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Palette</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                onValueChange={(value) => setPreset(String(value))}
                value={preset}
              >
                {PRESETS.map((name) => (
                  <DropdownMenuRadioItem key={name} value={name}>
                    {name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleCopy}>
                <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} />
                Copy JSX
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex shrink-0 items-center gap-1">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  aria-label="Copy orb snippet"
                  onClick={handleCopy}
                  size="icon-sm"
                  variant="ghost"
                />
              }
            >
              <HugeiconsIcon
                icon={isCopied ? Tick02Icon : Copy01Icon}
                strokeWidth={2}
              />
            </TooltipTrigger>
            <TooltipContent>
              {isCopied ? "Copied" : "Copy orb snippet"}
            </TooltipContent>
          </Tooltip>
          <Button
            nativeButton={false}
            render={<Link href="/registry/orb" />}
            size="sm"
            variant="ghost"
          >
            Playground
            <HugeiconsIcon
              className="rtl:rotate-180"
              data-icon="inline-end"
              icon={ArrowRight02Icon}
              strokeWidth={2}
            />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
