"use client"

import * as React from "react"

import {
  BrandAvatar,
  type BrandAvatarState,
} from "@/components/brand/brand-avatar"
import { Example, ExampleWrapper } from "@/components/example"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import {
  AiBrain01Icon,
  Alert01Icon,
  AngryIcon,
  ConfusedIcon,
  EyeClosedIcon,
  EyeIcon,
  HappyIcon,
  InLoveIcon,
  Megaphone01Icon,
  Mic01Icon,
  SmileDizzyIcon,
  SmileIcon,
  StarsIcon,
  Target02Icon,
  Tired01Icon,
  WinkIcon,
} from "@hugeicons/core-free-icons"

/** Icons match `Orb`'s state row where the two components share a state, so a
 * conversation reads the same whichever face is driving it. */
const STATES: {
  state: BrandAvatarState
  icon: IconSvgElement
  label: string
}[] = [
  { state: "awake", icon: EyeIcon, label: "Awake" },
  { state: "happy", icon: HappyIcon, label: "Happy" },
  { state: "winking", icon: WinkIcon, label: "Winking" },
  { state: "blushing", icon: SmileIcon, label: "Blushing" },
  { state: "loving", icon: InLoveIcon, label: "Loving" },
  { state: "excited", icon: StarsIcon, label: "Excited" },
  { state: "thinking", icon: AiBrain01Icon, label: "Thinking" },
  { state: "responding", icon: Megaphone01Icon, label: "Responding" },
  { state: "listening", icon: Mic01Icon, label: "Listening" },
  { state: "focused", icon: Target02Icon, label: "Focused" },
  { state: "confused", icon: ConfusedIcon, label: "Confused" },
  { state: "grumpy", icon: AngryIcon, label: "Grumpy" },
  { state: "sleeping", icon: EyeClosedIcon, label: "Sleeping" },
  { state: "yawning", icon: Tired01Icon, label: "Yawning" },
  { state: "startled", icon: Alert01Icon, label: "Startled" },
  { state: "dizzy", icon: SmileDizzyIcon, label: "Dizzy" },
]

export default function BrandAvatarExample() {
  const [state, setState] = React.useState<BrandAvatarState>("awake")

  return (
    <ExampleWrapper className="md:grid-cols-1">
      <Example title="States" className="items-center justify-center">
        {/* The toggles keep their own gap so a tooltip never lands on the
         * caption. */}
        <div className="flex flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-3">
            <BrandAvatar state={state} className="size-40" />
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
              [ {state} ]
            </span>
          </div>
          <ToggleGroup
            variant="outline"
            spacing={0}
            value={[state]}
            // Single-select hands back an array, and clicking the pressed item
            // empties it — fall back to the state already showing.
            onValueChange={(value) =>
              setState((value[0] as BrandAvatarState) ?? state)
            }
            className="max-w-full flex-wrap justify-center"
          >
            {STATES.map((entry) => (
              <Tooltip key={entry.state}>
                <TooltipTrigger
                  render={
                    <ToggleGroupItem
                      value={entry.state}
                      aria-label={entry.label}
                    />
                  }
                >
                  <HugeiconsIcon
                    icon={entry.icon}
                    strokeWidth={2}
                    className="size-4"
                  />
                </TooltipTrigger>
                <TooltipContent>{entry.label}</TooltipContent>
              </Tooltip>
            ))}
          </ToggleGroup>
        </div>
      </Example>
    </ExampleWrapper>
  )
}
