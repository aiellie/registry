"use client"

import * as React from "react"
import {
  ArrowShrink02Icon,
  ArrowReloadHorizontalIcon,
  InformationCircleIcon,
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
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const BUDGET = 200
const CONVERSATION_FULL = 51.7
const CONVERSATION_COMPACT = 12.3

const SEGMENTS = [
  { key: "system", label: "System prompt", tokens: 8.2, swatch: "bg-chart-4" },
  { key: "tools", label: "Tools", tokens: 21.6, swatch: "bg-chart-3" },
  {
    key: "files",
    label: "Retrieved files",
    tokens: 46.9,
    swatch: "bg-chart-2",
  },
  {
    key: "conversation",
    label: "Conversation",
    tokens: 0,
    swatch: "bg-chart-1",
  },
] as const

const FIXED = SEGMENTS.reduce((total, segment) => total + segment.tokens, 0)

export function ContextWindow() {
  const [conversation, setConversation] = React.useState(CONVERSATION_FULL)
  const [compacted, setCompacted] = React.useState(false)
  const [focused, setFocused] = React.useState<string | null>(null)
  const tweenRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  React.useEffect(() => {
    return () => {
      if (tweenRef.current) clearInterval(tweenRef.current)
    }
  }, [])

  function tween(from: number, to: number) {
    if (tweenRef.current) clearInterval(tweenRef.current)
    const steps = 16
    let step = 0
    tweenRef.current = setInterval(() => {
      step += 1
      const progress = 1 - Math.pow(1 - step / steps, 3)
      setConversation(from + (to - from) * progress)
      if (step >= steps) {
        if (tweenRef.current) clearInterval(tweenRef.current)
        tweenRef.current = null
        setConversation(to)
      }
    }, 30)
  }

  function toggleCompaction() {
    const next = !compacted
    setCompacted(next)
    tween(conversation, next ? CONVERSATION_COMPACT : CONVERSATION_FULL)
  }

  const segments = SEGMENTS.map((segment) =>
    segment.key === "conversation"
      ? { ...segment, tokens: conversation }
      : segment
  )
  const used = FIXED + conversation
  const free = BUDGET - used
  const percent = Math.round((used / BUDGET) * 100)
  const active = focused
    ? segments.find((segment) => segment.key === focused)
    : undefined

  return (
    <Card>
      <CardHeader>
        <CardTitle>Context Window</CardTitle>
        <CardDescription>claude-opus-4.5 · 200K budget</CardDescription>
        <CardAction>
          <Popover>
            <Tooltip>
              <TooltipTrigger
                render={
                  <PopoverTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="bg-muted"
                        aria-label="How the context budget is allocated"
                      />
                    }
                  />
                }
              >
                <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>How the budget is allocated</TooltipContent>
            </Tooltip>
            <PopoverContent align="end" className="w-72">
              <PopoverHeader>
                <PopoverTitle>Context budget</PopoverTitle>
                <PopoverDescription>
                  Every request re-sends the whole window. The 200K budget is
                  shared by the system prompt, tool schemas, retrieved files and
                  the running conversation.
                </PopoverDescription>
              </PopoverHeader>
              <div className="flex flex-col gap-1.5 rounded-lg bg-muted/60 p-2.5">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs text-muted-foreground">
                    Auto-compaction
                  </span>
                  <span className="font-mono text-xs tabular-nums">at 92%</span>
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs text-muted-foreground">
                    Headroom left
                  </span>
                  <span className="font-mono text-xs tabular-nums">
                    {(BUDGET * 0.92 - used).toFixed(1)}K
                  </span>
                </div>
              </div>
              <PopoverDescription className="text-xs">
                At 92% the oldest turns are summarised into a recap so the run
                can continue. Compact early to keep more room for retrieval.
              </PopoverDescription>
            </PopoverContent>
          </Popover>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-baseline gap-2">
          <span className="font-heading text-3xl font-semibold tabular-nums">
            {used.toFixed(1)}K
          </span>
          <span className="text-sm text-muted-foreground tabular-nums">
            / 200K used
          </span>
          <Badge variant="secondary" className="ms-auto tabular-nums">
            {percent}%
          </Badge>
        </div>
        <div
          className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted"
          role="img"
          aria-label={`${used.toFixed(1)}K of 200K tokens used, ${free.toFixed(
            1
          )}K free`}
        >
          {segments.map((segment) => (
            <div
              key={segment.key}
              className={cn(
                "h-full border-s-2 border-card transition-[width,opacity] duration-150 first:border-s-0",
                segment.swatch,
                focused && focused !== segment.key && "opacity-25"
              )}
              style={{ width: `${(segment.tokens / BUDGET) * 100}%` }}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-3">
          {segments.map((segment) => {
            const isFocused = focused === segment.key

            return (
              <button
                key={segment.key}
                type="button"
                aria-pressed={isFocused}
                onClick={() =>
                  setFocused((current) =>
                    current === segment.key ? null : segment.key
                  )
                }
                className={cn(
                  "flex min-w-0 flex-col gap-1 rounded-md text-start transition-opacity outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  focused && !isFocused && "opacity-45"
                )}
              >
                <span className="flex min-w-0 items-center gap-1.5">
                  <span
                    aria-hidden
                    className={cn(
                      "size-2 shrink-0 rounded-[3px]",
                      segment.swatch,
                      isFocused && "ring-2 ring-foreground/30"
                    )}
                  />
                  <span className="truncate text-xs text-muted-foreground">
                    {segment.label}
                  </span>
                </span>
                <span className="ps-3.5 text-sm font-medium tabular-nums">
                  {segment.tokens.toFixed(1)}K
                </span>
              </button>
            )
          })}
        </div>
        <p className="min-h-4 truncate text-xs text-muted-foreground">
          {active
            ? `${active.label} · ${((active.tokens / BUDGET) * 100).toFixed(
                1
              )}% of budget`
            : "Tap a legend entry to isolate its share"}
        </p>
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1.5">
          <span
            aria-hidden
            className="size-2 shrink-0 rounded-[3px] bg-muted"
          />
          <span className="truncate text-xs font-medium tabular-nums">
            {free.toFixed(1)}K free
          </span>
        </span>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={toggleCompaction}
        >
          <HugeiconsIcon
            icon={compacted ? ArrowReloadHorizontalIcon : ArrowShrink02Icon}
            strokeWidth={2}
            data-icon="inline-start"
          />
          {compacted ? "Restore" : "Compact now"}
        </Button>
      </CardFooter>
    </Card>
  )
}
