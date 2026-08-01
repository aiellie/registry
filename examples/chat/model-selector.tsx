"use client"

import * as React from "react"

import { FlashIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

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
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { type Model, getChef, models } from "@/lib/models"
import { cn } from "@/lib/utils"

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

export function ModelSelectorDemo({
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
  const chef = getChef(selected?.chefSlug)
  const effortIndex = Math.max(
    0,
    EFFORT_LEVELS.findIndex((item) => item.value === effort)
  )
  const activeEffort = EFFORT_LEVELS[effortIndex]

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
        showIcon={false}
        render={
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "gap-1.5 rounded-full bg-background px-2 font-normal",
              className
            )}
          />
        }
      >
        {fast ? (
          <HugeiconsIcon
            icon={FlashIcon}
            strokeWidth={2}
            className={cn(
              "size-3.5",
              chef?.fastClass ?? "fill-muted-foreground text-muted-foreground"
            )}
          />
        ) : null}
        <ComboboxValue>
          {(value: Model | null) =>
            value ? (
              <>
                <ModelSelectorLogo
                  provider={value.chefSlug}
                  variant="color"
                  className="size-4"
                />
              </>
            ) : (
              <ModelSelectorName className="text-muted-foreground">
                Model
              </ModelSelectorName>
            )
          }
        </ComboboxValue>
        <span
          className="flex h-3 items-center gap-1"
          aria-label={`Effort: ${activeEffort?.label}`}
        >
          {EFFORT_LEVELS.map((level, index) => (
            <span
              key={level.value}
              className={cn(
                "h-full w-0.5 rounded-full",
                index <= effortIndex
                  ? (chef?.colorClass ?? "bg-foreground")
                  : (chef?.colorMutedClass ?? "bg-muted")
              )}
            />
          ))}
        </span>
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
          className="h-8! rounded-none! border-0 border-x-0 bg-background shadow-none! *:data-[slot=input-group-addon]:ps-2!"
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
          <div className="flex items-center justify-between gap-2 px-1.5 py-1">
            <span className="text-xs text-muted-foreground">Effort</span>
            <span className="text-xs text-muted-foreground">
              {activeEffort?.label}
            </span>
          </div>
          <div className="px-1.5 pb-1">
            <Slider
              value={[effortIndex]}
              min={0}
              max={EFFORT_LEVELS.length - 1}
              step={1}
              onValueChange={(value) => {
                const index = Array.isArray(value) ? (value[0] ?? 0) : value
                const next = EFFORT_LEVELS[index]
                if (next) onEffortChange(next.value)
              }}
            />
          </div>
          <Label
            htmlFor={fastId}
            className="mt-1 flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1.5 font-normal hover:bg-accent"
          >
            <HugeiconsIcon
              icon={FlashIcon}
              strokeWidth={2}
              className={cn(
                "size-3.5 transition-colors",
                fast
                  ? (chef?.fastClass ??
                      "fill-muted-foreground text-muted-foreground")
                  : "text-muted-foreground"
              )}
            />
            Fast mode
            <Switch
              id={fastId}
              size="sm"
              checked={fast}
              onCheckedChange={onFastChange}
              className="ms-auto"
            />
          </Label>
        </div>
      </ComboboxContent>
    </Combobox>
  )
}
