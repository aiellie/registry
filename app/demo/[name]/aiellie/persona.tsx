"use client"

import type { PersonaState } from "@/components/ai-elements/persona"
import { Persona } from "@/components/ai-elements/persona"
import { Example, ExampleWrapper } from "@/components/example"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  AiBrain01Icon,
  CircleIcon,
  EyeClosedIcon,
  Megaphone01Icon,
  Mic01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { memo, useCallback, useState } from "react"

type PersonaVariant = React.ComponentProps<typeof Persona>["variant"]

const states: {
  state: PersonaState
  icon: IconSvgElement
  label: string
}[] = [
  {
    icon: CircleIcon,
    label: "Idle",
    state: "idle",
  },
  {
    icon: Mic01Icon,
    label: "Listening",
    state: "listening",
  },
  {
    icon: AiBrain01Icon,
    label: "Thinking",
    state: "thinking",
  },
  {
    icon: Megaphone01Icon,
    label: "Speaking",
    state: "speaking",
  },
  {
    icon: EyeClosedIcon,
    label: "Asleep",
    state: "asleep",
  },
]

const variants: { variant: PersonaVariant; title: string }[] = [
  { title: "Obsidian", variant: "obsidian" },
  { title: "Command", variant: "command" },
  { title: "Glint", variant: "glint" },
  { title: "Halo", variant: "halo" },
  { title: "Mana", variant: "mana" },
  { title: "Opal", variant: "opal" },
]

interface StateButtonProps {
  state: (typeof states)[0]
  currentState: PersonaState
  onStateChange: (state: PersonaState) => void
}

const StateButton = memo(
  ({ state, currentState, onStateChange }: StateButtonProps) => {
    const handleClick = useCallback(
      () => onStateChange(state.state),
      [onStateChange, state.state]
    )
    return (
      <Tooltip key={state.state}>
        <TooltipTrigger
          render={
            <Button
              onClick={handleClick}
              size="icon-sm"
              variant={currentState === state.state ? "default" : "outline"}
            />
          }
        >
          <HugeiconsIcon icon={state.icon} strokeWidth={2} className="size-4" />
        </TooltipTrigger>
        <TooltipContent>{state.label}</TooltipContent>
      </Tooltip>
    )
  }
)

StateButton.displayName = "StateButton"

function PersonaVariantExample({
  title,
  variant,
  className,
}: {
  title: string
  variant: PersonaVariant
  className?: string
}) {
  const [currentState, setCurrentState] = useState<PersonaState>("idle")

  const handleStateChange = useCallback((state: PersonaState) => {
    setCurrentState(state)
  }, [])

  return (
    <Example title={title} containerClassName={className}>
      <div className="flex size-full flex-col items-center justify-center gap-4">
        <Persona className="size-32" state={currentState} variant={variant} />

        <ButtonGroup orientation="horizontal">
          {states.map((state) => (
            <StateButton
              currentState={currentState}
              key={state.state}
              onStateChange={handleStateChange}
              state={state}
            />
          ))}
        </ButtonGroup>
      </div>
    </Example>
  )
}

export default function PersonaExample() {
  return (
    <ExampleWrapper className="w-full lg:grid-cols-2 2xl:grid-cols-3">
      {variants.map((variant) => (
        <PersonaVariantExample
          key={variant.variant}
          title={variant.title}
          variant={variant.variant}
        />
      ))}
    </ExampleWrapper>
  )
}
