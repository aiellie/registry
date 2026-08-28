"use client"

import { Calendar01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

import { ranges } from "../data/config"
import type { ChartRange } from "../data/schema"

interface ChartRangeProps {
  value: ChartRange
  onValueChange: (value: ChartRange) => void
  className?: string
}

/** How much of the tail of the dataset the chart draws. */
export function ChartRangeSelect({
  value,
  onValueChange,
  className,
}: ChartRangeProps) {
  return (
    <Select
      items={ranges}
      value={value}
      onValueChange={(next) => onValueChange(next as ChartRange)}
    >
      <SelectTrigger
        size="sm"
        aria-label="Date range"
        className={cn("w-[9.5rem]", className)}
      >
        <HugeiconsIcon
          icon={Calendar01Icon}
          strokeWidth={2}
          className="size-3.5 text-muted-foreground"
        />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end" alignItemWithTrigger={false}>
        <SelectGroup>
          {ranges.map((range) => (
            <SelectItem key={range.value} value={range.value}>
              {range.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
