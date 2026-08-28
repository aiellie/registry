"use client"

import { HugeiconsIcon } from "@hugeicons/react"

import { Kbd } from "@/components/ui/kbd"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import { calendarViews } from "../data/calendars"
import type { CalendarView } from "../data/schema"

interface CalendarViewSwitcherProps {
  value: CalendarView
  onValueChange: (value: CalendarView) => void
  className?: string
}

/**
 * Month, week, day, agenda. Base UI's `ToggleGroup` always hands back an
 * array, and pressing the active item hands back an empty one — which we
 * ignore, so a view is always chosen.
 */
export function CalendarViewSwitcher({
  value,
  onValueChange,
  className,
}: CalendarViewSwitcherProps) {
  return (
    <TooltipProvider delay={300}>
      <ToggleGroup
        aria-label="Calendar view"
        variant="outline"
        size="sm"
        spacing={0}
        value={[value]}
        onValueChange={([next]) => {
          if (next) onValueChange(next as CalendarView)
        }}
        className={cn("shrink-0", className)}
      >
        {calendarViews.map((view) => (
          <Tooltip key={view.value}>
            <TooltipTrigger
              render={
                <ToggleGroupItem
                  value={view.value}
                  aria-label={`${view.label} view`}
                  className="px-2"
                >
                  <HugeiconsIcon
                    icon={view.icon}
                    strokeWidth={2}
                    className="size-3.5"
                  />
                </ToggleGroupItem>
              }
            />
            <TooltipContent>
              {view.label}
              <Kbd>{view.shortcut}</Kbd>
            </TooltipContent>
          </Tooltip>
        ))}
      </ToggleGroup>
    </TooltipProvider>
  )
}
