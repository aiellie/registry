"use client"

import * as React from "react"
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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { models } from "@/lib/models"
import { cn } from "@/lib/utils"

const CHEFS = [...new Set(models.map((model) => model.chef))]

function modelsByChef(chef: string) {
  return models.filter((model) => model.chef === chef)
}

export const EFFORT_LEVELS = [
  { value: "light", label: "Light" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "extra", label: "Extra" },
  { value: "max", label: "Max" },
  { value: "ultra", label: "Ultra" },
]

export function PromptModelMenu({
  model,
  onModelChange,
  effort,
  onEffortChange,
  fast,
  onFastChange,
  className,
}: {
  model: string
  onModelChange: (value: string) => void
  effort: string
  onEffortChange: (value: string) => void
  fast: boolean
  onFastChange: (value: boolean) => void
  className?: string
}) {
  const fastId = React.useId()
  const activeModel = models.find((item) => item.id === model)
  const activeEffort = EFFORT_LEVELS.find((item) => item.value === effort)

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
        {activeModel?.name}
        <span className="text-muted-foreground">{activeEffort?.label}</span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          strokeWidth={1.5}
          className="text-muted-foreground"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="end" sideOffset={8} className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span className="grow">Model</span>
              <span className="text-muted-foreground">{activeModel?.name}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="max-h-80 w-64 overflow-y-auto">
              <DropdownMenuRadioGroup
                value={model}
                onValueChange={(next) => onModelChange(next as string)}
              >
                {CHEFS.map((chef) => (
                  <DropdownMenuGroup key={chef}>
                    <DropdownMenuLabel>{chef}</DropdownMenuLabel>
                    {modelsByChef(chef).map((item) => (
                      <DropdownMenuRadioItem key={item.id} value={item.id}>
                        {item.name}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuGroup>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span className="grow">Effort</span>
              <span className="text-muted-foreground">
                {activeEffort?.label}
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={effort}
                onValueChange={(next) => onEffortChange(next as string)}
              >
                {EFFORT_LEVELS.map((item) => (
                  <DropdownMenuRadioItem key={item.value} value={item.value}>
                    {item.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Speed</DropdownMenuLabel>
          <div className="flex items-center justify-between gap-2 rounded-md px-1.5 py-1.5">
            <Label htmlFor={fastId} className="cursor-pointer font-normal">
              Fast mode
            </Label>
            <Switch
              id={fastId}
              size="sm"
              checked={fast}
              onCheckedChange={onFastChange}
            />
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
