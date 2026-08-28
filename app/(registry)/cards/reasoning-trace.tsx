"use client"

import * as React from "react"
import {
  CodeIcon,
  PlayIcon,
  RefreshIcon,
  Search01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtSearchResult,
  ChainOfThoughtSearchResults,
  ChainOfThoughtStep,
} from "@/components/chat/chain-of-thought"
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const STEPS = [
  {
    icon: Search01Icon,
    label: "Searching the registry for card primitives",
    sources: ["https://registry.aiellie.dev", "https://ui.shadcn.com"],
  },
  {
    icon: CodeIcon,
    label: "Reading components/ui/card.tsx and its variants",
  },
  {
    icon: undefined,
    label:
      "The Card primitive exposes header, content and footer slots, and drives spacing from a single --card-spacing custom property.",
  },
  {
    icon: Tick02Icon,
    label: "Drafting a card that composes those slots",
  },
]

/** ms each step spends "thinking" during a replay. */
const STEP_MS = 900

export function ReasoningTrace() {
  // How many steps have finished. Starts complete so the resting card is
  // a settled trace; pressing play rewinds and replays it.
  const [done, setDone] = React.useState(STEPS.length)
  const [playing, setPlaying] = React.useState(false)
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  React.useEffect(() => {
    if (!playing) {
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = null
      return
    }

    timerRef.current = setInterval(() => {
      setDone((count) => Math.min(STEPS.length, count + 1))
    }, STEP_MS)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [playing])

  // Ends the replay once the last step lands, without setting state inside
  // the ticking effect itself.
  React.useEffect(() => {
    if (!playing || done < STEPS.length) return
    const id = setTimeout(() => setPlaying(false), STEP_MS)
    return () => clearTimeout(id)
  }, [playing, done])

  const replay = () => {
    setDone(0)
    setPlaying(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reasoning</CardTitle>
        <CardDescription className="tabular-nums">
          {done} of {STEPS.length} steps
        </CardDescription>
        <CardAction>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="bg-muted"
                  aria-label={playing ? "Replaying" : "Replay reasoning"}
                  disabled={playing}
                  onClick={replay}
                />
              }
            >
              <HugeiconsIcon
                icon={playing ? RefreshIcon : PlayIcon}
                strokeWidth={2}
              />
            </TooltipTrigger>
            <TooltipContent>
              {playing ? "Replaying…" : "Replay reasoning"}
            </TooltipContent>
          </Tooltip>
        </CardAction>
      </CardHeader>

      <CardContent>
        <ChainOfThought defaultOpen>
          <ChainOfThoughtHeader />
          <ChainOfThoughtContent>
            {STEPS.map((step, index) => (
              <ChainOfThoughtStep
                key={step.label}
                icon={step.icon}
                label={step.label}
                status={
                  index < done
                    ? "complete"
                    : index === done
                      ? "active"
                      : "pending"
                }
              >
                {step.sources && index < done ? (
                  <ChainOfThoughtSearchResults>
                    {step.sources.map((source) => (
                      <ChainOfThoughtSearchResult key={source}>
                        {new URL(source).hostname}
                      </ChainOfThoughtSearchResult>
                    ))}
                  </ChainOfThoughtSearchResults>
                ) : null}
              </ChainOfThoughtStep>
            ))}
          </ChainOfThoughtContent>
        </ChainOfThought>
      </CardContent>

      <CardFooter>
        <span className="truncate text-xs text-muted-foreground tabular-nums">
          claude-opus-4.5 · 2,431 thinking tokens
        </span>
      </CardFooter>
    </Card>
  )
}
