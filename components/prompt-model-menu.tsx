"use client"

import { ArrowDown01Icon, FlashIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export const PROMPT_MODELS = [
  { value: "opus-4-8", label: "Opus 4.8", description: "Most capable" },
  { value: "sonnet-5", label: "Sonnet 5", description: "Balanced" },
  { value: "haiku-4-5", label: "Haiku 4.5", description: "Fastest" },
]

export const REASONING_LEVELS = [
  { value: "light", label: "Light" },
  { value: "standard", label: "Standard" },
  { value: "deep", label: "Deep" },
]

export function PromptModelMenu({
  model,
  onModelChange,
  reasoning,
  onReasoningChange,
  className,
}: {
  model: string
  onModelChange: (value: string) => void
  reasoning: string
  onReasoningChange: (value: string) => void
  className?: string
}) {
  const activeModel = PROMPT_MODELS.find((item) => item.value === model)
  const activeReasoning = REASONING_LEVELS.find((item) => item.value === reasoning)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className={cn("gap-1.5 rounded-full px-2 font-normal", className)}
          />
        }
      >
        <HugeiconsIcon icon={FlashIcon} strokeWidth={1.5} />
        {activeModel?.label}
        <span className="text-muted-foreground">{activeReasoning?.label}</span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          strokeWidth={1.5}
          className="text-muted-foreground"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="end" sideOffset={8} className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Model</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={model}
            onValueChange={(next) => onModelChange(next as string)}
          >
            {PROMPT_MODELS.map((item) => (
              <DropdownMenuRadioItem key={item.value} value={item.value}>
                {item.label}
                <span className="text-xs text-muted-foreground">
                  {item.description}
                </span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Reasoning</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={reasoning}
            onValueChange={(next) => onReasoningChange(next as string)}
          >
            {REASONING_LEVELS.map((item) => (
              <DropdownMenuRadioItem key={item.value} value={item.value}>
                {item.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
