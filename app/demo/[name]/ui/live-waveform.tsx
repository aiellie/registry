"use client"

import * as React from "react"

import { Mic02Icon, StopIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { LiveWaveform } from "@/components/ai/live-waveform"
import { Example, ExampleWrapper } from "@/components/example"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function LiveWaveformExample() {
  return (
    <ExampleWrapper>
      <Static />
      <Scrolling />
      <Processing />
    </ExampleWrapper>
  )
}

function MicToggle({
  active,
  onActiveChange,
}: {
  active: boolean
  onActiveChange: (active: boolean) => void
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            size="icon-sm"
            variant={active ? "secondary" : "outline"}
            className="rounded-full"
            onClick={() => onActiveChange(!active)}
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
  )
}

function Static({ className }: { className?: string }) {
  const [active, setActive] = React.useState(false)

  return (
    <Example title="Static" containerClassName={className}>
      <div className="flex w-full max-w-md items-center gap-3">
        <LiveWaveform active={active} height={48} className="min-w-0 flex-1" />
        <MicToggle active={active} onActiveChange={setActive} />
      </div>
    </Example>
  )
}

function Scrolling({ className }: { className?: string }) {
  const [active, setActive] = React.useState(false)

  return (
    <Example title="Scrolling" containerClassName={className}>
      <div className="flex w-full max-w-md items-center gap-3">
        <LiveWaveform
          active={active}
          mode="scrolling"
          height={48}
          barWidth={2}
          barGap={2}
          historySize={200}
          className="min-w-0 flex-1"
        />
        <MicToggle active={active} onActiveChange={setActive} />
      </div>
    </Example>
  )
}

function Processing({ className }: { className?: string }) {
  return (
    <Example title="Processing" containerClassName={className}>
      <div className="w-full max-w-md">
        <LiveWaveform processing height={48} />
      </div>
    </Example>
  )
}
