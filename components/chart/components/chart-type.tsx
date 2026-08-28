"use client"

import { HugeiconsIcon } from "@hugeicons/react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import { chartTypes } from "../data/config"
import type { ChartType } from "../data/schema"

interface ChartTypeProps {
  value: ChartType
  onValueChange: (value: ChartType) => void
  /** Narrow the row to a subset, in the order given. */
  types?: ChartType[]
  className?: string
}

/**
 * The chart family picker: one icon per type, single-select. Base UI's
 * `ToggleGroup` always hands back an array, and pressing the active item
 * hands back an empty one — which we ignore, so a type is always chosen.
 */
export function ChartTypeSelector({
  value,
  onValueChange,
  types,
  className,
}: ChartTypeProps) {
  const options = types
    ? types.flatMap((type) => chartTypes.filter((item) => item.value === type))
    : chartTypes

  return (
    <TooltipProvider delay={300}>
      <ToggleGroup
        aria-label="Chart type"
        variant="outline"
        size="sm"
        spacing={0}
        value={[value]}
        onValueChange={([next]) => {
          if (next) onValueChange(next as ChartType)
        }}
        className={cn("shrink-0", className)}
      >
        {options.map((type) => (
          <Tooltip key={type.value}>
            <TooltipTrigger
              render={
                <ToggleGroupItem
                  value={type.value}
                  aria-label={`${type.label} chart`}
                  className="px-2"
                >
                  <HugeiconsIcon
                    icon={type.icon}
                    strokeWidth={2}
                    className="size-3.5"
                  />
                </ToggleGroupItem>
              }
            />
            <TooltipContent>{type.label}</TooltipContent>
          </Tooltip>
        ))}
      </ToggleGroup>
    </TooltipProvider>
  )
}
