"use client"

import * as React from "react"

import { Mic02Icon, StopIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { LiveWaveform } from "@/components/ai/live-waveform"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function LiveWaveformDemo() {
  const [active, setActive] = React.useState(false)

  return (
    <div className="flex w-full max-w-sm flex-col gap-4 py-6">
      <div className="flex w-full items-center gap-3">
        <LiveWaveform
          active={active}
          mode="scrolling"
          height={48}
          barWidth={2}
          barGap={2}
          historySize={200}
          className="min-w-0 flex-1"
        />
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                size="icon-sm"
                variant={active ? "secondary" : "outline"}
                className="rounded-full"
                onClick={() => setActive((current) => !current)}
                aria-label={active ? "Stop microphone" : "Start microphone"}
              >
                {active ? (
                  <HugeiconsIcon
                    icon={StopIcon}
                    strokeWidth={2}
                    className="size-3 fill-current"
                  />
                ) : (
                  <HugeiconsIcon icon={Mic02Icon} strokeWidth={1.5} />
                )}
              </Button>
            }
          />
          <TooltipContent>
            {active ? "Stop microphone" : "Start microphone"}
          </TooltipContent>
        </Tooltip>
      </div>
      <p className="text-sm text-muted-foreground">
        Start the microphone to see the scrolling waveform react to your voice.
      </p>
    </div>
  )
}
