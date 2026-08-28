"use client"

import { addDays, format, isToday } from "date-fns"
import { PinLocation01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"

import { calendarByValue } from "../data/calendars"
import type { CalendarEvent, CalendarSettings } from "../data/schema"
import {
  eventEnd,
  eventStart,
  eventsOnDay,
  formatTime,
  rangeFor,
  startOfDay,
} from "../lib"

interface CalendarAgendaProps {
  focus: Date
  events: CalendarEvent[]
  settings: CalendarSettings
  onSelectEvent?: (event: CalendarEvent) => void
}

/** A flat list of what is coming up — days with nothing on them are skipped. */
export function CalendarAgenda({
  focus,
  events,
  settings,
  onSelectEvent,
}: CalendarAgendaProps) {
  const { start, end } = rangeFor("agenda", focus, settings)
  const days: Date[] = []
  for (let day = start; day <= end; day = addDays(day, 1)) {
    if (eventsOnDay(events, day).length) days.push(day)
  }

  return (
    <div className="divide-y overflow-hidden rounded-lg border bg-background">
      {days.map((day) => (
        <div key={day.toISOString()} className="flex gap-4 p-3">
          <div className="w-14 shrink-0 text-center">
            <div className="text-[11px] text-muted-foreground uppercase">
              {format(day, "EEE")}
            </div>
            <div
              className={cn(
                "mx-auto flex size-7 items-center justify-center rounded-full text-sm font-medium tabular-nums",
                isToday(day) && "bg-primary text-primary-foreground"
              )}
            >
              {format(day, "d")}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase">
              {format(day, "MMM")}
            </div>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            {eventsOnDay(events, day).map((event) => {
              const source = calendarByValue(event.calendar)
              const spansDays =
                startOfDay(eventStart(event)).getTime() !==
                startOfDay(eventEnd(event)).getTime()

              return (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => onSelectEvent?.(event)}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 text-start transition-colors hover:bg-muted/60"
                >
                  <span
                    aria-hidden
                    className={cn("size-2 shrink-0 rounded-full", source?.dot)}
                  />
                  <span className="w-24 shrink-0 text-xs text-muted-foreground tabular-nums">
                    {event.allDay || spansDays
                      ? "All day"
                      : `${formatTime(eventStart(event), settings.hour12)} – ${formatTime(eventEnd(event), settings.hour12)}`}
                  </span>
                  <span className="truncate text-sm font-medium">
                    {event.title}
                  </span>
                  {event.location && (
                    <span className="ms-auto hidden shrink-0 items-center gap-1 text-xs text-muted-foreground sm:flex">
                      <HugeiconsIcon
                        aria-hidden
                        icon={PinLocation01Icon}
                        strokeWidth={2}
                        className="size-3.5"
                      />
                      {event.location}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
