"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  BarsLoader,
  CircularLoader,
  ClassicLoader,
  DotsLoader,
  PulseDotLoader,
  PulseLoader,
  TerminalLoader,
  TextShimmerLoader,
  TypingLoader,
  VercelLoader,
  WaveLoader,
} from "@/components/aiellie/loader"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

const LOADERS = [
  { name: "Vercel", Component: VercelLoader },
  { name: "Circular", Component: CircularLoader },
  { name: "Classic", Component: ClassicLoader },
  { name: "Pulse", Component: PulseLoader },
  { name: "PulseDot", Component: PulseDotLoader },
  { name: "Dots", Component: DotsLoader },
  { name: "Typing", Component: TypingLoader },
  { name: "Wave", Component: WaveLoader },
  { name: "Bars", Component: BarsLoader },
]

export function LoaderGallery() {
  const [running, setRunning] = React.useState(true)
  const [selected, setSelected] = React.useState<string | null>(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loaders</CardTitle>
        <CardDescription>{LOADERS.length} spinners, one import</CardDescription>
        <CardAction>
          <Switch
            checked={running}
            onCheckedChange={setRunning}
            aria-label="Animate the loaders"
          />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <div
          className={cn(
            "grid grid-cols-3 gap-2",
            // Freezing is a visual state only — the components keep mounting,
            // so toggling back resumes without a remount.
            !running && "[&_*]:[animation-play-state:paused]"
          )}
        >
          {LOADERS.map(({ name, Component }) => (
            <button
              key={name}
              type="button"
              onClick={() => setSelected(selected === name ? null : name)}
              aria-pressed={selected === name}
              className={cn(
                "flex h-16 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg ring-1 transition-colors outline-none ring-inset focus-visible:ring-3 focus-visible:ring-ring/50",
                selected === name
                  ? "bg-primary/10 ring-primary/25"
                  : "bg-muted/50 ring-transparent hover:bg-muted"
              )}
            >
              <span className="flex h-5 items-center justify-center text-foreground">
                <Component />
              </span>
              <span className="truncate text-[10px] text-muted-foreground">
                {name}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-2.5 py-2">
          <TerminalLoader />
          <TextShimmerLoader text="Streaming response" />
        </div>
      </CardContent>

      <CardFooter>
        <span className="truncate font-mono text-xs text-muted-foreground">
          {selected ? `<${selected}Loader />` : "@aiellie/loader"}
        </span>
      </CardFooter>
    </Card>
  )
}
