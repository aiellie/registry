"use client"

import * as React from "react"

import {
  ModelSelectorLogo,
  ModelSelectorName,
} from "@/components/ai-elements/model-selector"
import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { type Model, models } from "@/lib/models"
import { cn } from "@/lib/utils"
import { Separator } from "./ui/separator"

const CHEFS = [...new Set(models.map((model) => model.chef))]

type ModelGroup = { value: string; items: Model[] }

const MODEL_GROUPS: ModelGroup[] = CHEFS.map((chef) => ({
  value: chef,
  items: models.filter((model) => model.chef === chef),
}))

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
  const selected = models.find((item) => item.id === model) ?? null
  const activeEffort = EFFORT_LEVELS.find((item) => item.value === effort)

  return (
    <Combobox
      items={MODEL_GROUPS}
      value={selected}
      onValueChange={(next) => {
        if (next) onModelChange(next.id)
      }}
      itemToStringValue={(item: Model) => `${item.name} ${item.chef}`}
    >
      <ComboboxTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className={cn("gap-1.5 rounded-full px-2 font-normal", className)}
          />
        }
      >
        <ComboboxValue>
          {(value: Model | null) =>
            value ? (
              <>
                <ModelSelectorLogo
                  provider={value.chefSlug}
                  variant="color"
                  className="size-3.5"
                />
                <ModelSelectorName>{value.name}</ModelSelectorName>
              </>
            ) : (
              <ModelSelectorName className="text-muted-foreground">
                Model
              </ModelSelectorName>
            )
          }
        </ComboboxValue>
        <span className="text-muted-foreground">{activeEffort?.label}</span>
      </ComboboxTrigger>
      <ComboboxContent
        side="top"
        align="end"
        sideOffset={8}
        className="w-72 min-w-72"
      >
        <ComboboxInput
          showTrigger={false}
          showSearchIcon
          placeholder="Search models..."
          className="h-8! rounded-none! border-x-0 border-0 bg-background shadow-none! *:data-[slot=input-group-addon]:ps-2!"
        />
        <Separator />
        <ComboboxEmpty>No models found.</ComboboxEmpty>
        <ComboboxList className="max-h-64">
          {(group: ModelGroup) => (
            <ComboboxGroup key={group.value} items={group.items}>
              <ComboboxLabel>{group.value}</ComboboxLabel>
              <ComboboxCollection>
                {(item: Model) => (
                  <ComboboxItem key={item.id} value={item}>
                    <ModelSelectorLogo
                      provider={item.chefSlug}
                      variant="color"
                    />
                    <ModelSelectorName>{item.name}</ModelSelectorName>
                  </ComboboxItem>
                )}
              </ComboboxCollection>
            </ComboboxGroup>
          )}
        </ComboboxList>
        <div
          className="border-t p-1.5"
          onPointerDown={(event) => event.preventDefault()}
        >
          <div className="px-1.5 py-1 text-xs text-muted-foreground">Effort</div>
          <div className="flex flex-wrap gap-0.5">
            {EFFORT_LEVELS.map((item) => (
              <Button
                key={item.value}
                type="button"
                variant={effort === item.value ? "secondary" : "ghost"}
                size="sm"
                className="h-7 rounded-md px-2 font-normal"
                onClick={() => onEffortChange(item.value)}
              >
                {item.label}
              </Button>
            ))}
          </div>
          <div className="mt-1 flex items-center justify-between gap-2 rounded-md px-1.5 py-1.5">
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
        </div>
      </ComboboxContent>
    </Combobox>
  )
}
