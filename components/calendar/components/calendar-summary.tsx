"use client"

import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"

import { calendars } from "../data/calendars"
import type { CalendarEvent } from "../data/schema"
import { eventMinutes } from "../lib"

interface CalendarSummaryProps {
  /** Events in the range on screen, before the calendar filter is applied. */
  events: CalendarEvent[]
  visible: string[]
  onVisibleChange: (next: string[]) => void
  className?: string
}

/**
 * One tile per calendar, counting only what the current range covers. The
 * tiles double as the fastest way to look at one calendar on its own.
 */
export function CalendarSummary({
  events,
  visible,
  onVisibleChange,
  className,
}: CalendarSummaryProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-border sm:grid-cols-3 lg:grid-cols-5",
        className
      )}
    >
      {calendars.map((calendar) => {
        const mine = events.filter((event) => event.calendar === calendar.value)
        const hours = mine.reduce(
          (total, event) => total + eventMinutes(event) / 60,
          0
        )
        const isOn = visible.includes(calendar.value)

        return (
          <button
            key={calendar.value}
            type="button"
            aria-pressed={isOn}
            // Isolate on click, unless it is already the only one — then
            // clicking again puts everything back.
            onClick={() =>
              onVisibleChange(
                visible.length === 1 && isOn
                  ? calendars.map((item) => item.value)
                  : [calendar.value]
              )
            }
            className={cn(
              "flex cursor-pointer flex-col gap-2 bg-background p-3 text-start transition-colors hover:bg-muted/60",
              !isOn && "opacity-45"
            )}
          >
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <HugeiconsIcon
                aria-hidden
                icon={calendar.icon}
                strokeWidth={2}
                className="size-3.5 shrink-0"
              />
              {calendar.label}
            </span>
            <span className="flex items-baseline gap-1.5">
              <span className="text-xl leading-none font-semibold tabular-nums">
                {mine.length}
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {Math.round(hours)}h
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
