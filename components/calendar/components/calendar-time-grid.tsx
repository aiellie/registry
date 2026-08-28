"use client"

import * as React from "react"
import { format, isToday } from "date-fns"
import { PlusSignIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import { hourHeight } from "../data/config"
import type { CalendarEvent, CalendarSettings } from "../data/schema"
import { eventEnd, eventStart, eventsOnDay, formatHour, weekDays } from "../lib"
import { CalendarEventChip } from "./calendar-event-chip"

interface CalendarTimeGridProps {
  focus: Date
  events: CalendarEvent[]
  settings: CalendarSettings
  /** A week shows seven columns; a day shows one. */
  days?: 1 | 7
  onSelectEvent?: (event: CalendarEvent) => void
  onCreateAt?: (day: Date, hour: number) => void
}

/** Side-by-side lanes for events that overlap in time. */
function lanesFor(events: CalendarEvent[]) {
  const lanes: CalendarEvent[][] = []
  for (const event of events) {
    const start = eventStart(event).getTime()
    const lane = lanes.find(
      (candidate) =>
        eventEnd(candidate[candidate.length - 1]).getTime() <= start
    )
    if (lane) lane.push(event)
    else lanes.push([event])
  }
  return lanes
}

export function CalendarTimeGrid({
  focus,
  events,
  settings,
  days = 7,
  onSelectEvent,
  onCreateAt,
}: CalendarTimeGridProps) {
  const rowHeight = hourHeight[settings.density]
  const startHour = Math.min(settings.dayStartHour, settings.dayEndHour - 1)
  const endHour = Math.max(settings.dayEndHour, startHour + 1)
  const hours = Array.from(
    { length: endHour - startHour },
    (_, index) => startHour + index
  )

  const columns =
    days === 1
      ? [focus]
      : weekDays(focus, settings.weekStartsOn).filter(
          (day) =>
            settings.showWeekends || (day.getDay() !== 0 && day.getDay() !== 6)
        )

  return (
    <TooltipProvider delay={300}>
      <div className="overflow-hidden rounded-lg border bg-background">
        <div
          className="grid border-b bg-muted/40"
          style={{
            gridTemplateColumns: `3.5rem repeat(${columns.length}, minmax(0, 1fr))`,
          }}
        >
          <div />
          {columns.map((day) => (
            <div
              key={day.toISOString()}
              className="flex items-center justify-center gap-1.5 px-2 py-1.5 text-[11px] font-medium text-muted-foreground"
            >
              {format(day, "EEE")}
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full tabular-nums",
                  isToday(day) && "bg-primary text-primary-foreground"
                )}
              >
                {format(day, "d")}
              </span>
            </div>
          ))}
        </div>

        {/* All-day events sit above the scale; they have no position on it. */}
        <div
          className="grid border-b"
          style={{
            gridTemplateColumns: `3.5rem repeat(${columns.length}, minmax(0, 1fr))`,
          }}
        >
          <div className="flex items-center justify-end pe-2 text-[10px] text-muted-foreground">
            All day
          </div>
          {columns.map((day) => (
            <div
              key={day.toISOString()}
              className="flex min-h-8 flex-col gap-1 border-s p-1"
            >
              {eventsOnDay(events, day)
                .filter((event) => event.allDay)
                .map((event) => (
                  <CalendarEventChip
                    key={event.id}
                    event={event}
                    hour12={settings.hour12}
                    onSelect={onSelectEvent}
                  />
                ))}
            </div>
          ))}
        </div>

        <div className="max-h-[30rem] overflow-y-auto pt-2">
          <div
            className="grid"
            style={{
              gridTemplateColumns: `3.5rem repeat(${columns.length}, minmax(0, 1fr))`,
            }}
          >
            <div>
              {hours.map((hour) => (
                <div
                  key={hour}
                  style={{ height: rowHeight }}
                  className="relative -top-2 pe-2 text-end text-[10px] text-muted-foreground tabular-nums"
                >
                  {formatHour(hour, settings.hour12)}
                </div>
              ))}
            </div>
            {columns.map((day) => {
              const timed = eventsOnDay(events, day).filter(
                (event) => !event.allDay
              )
              const lanes = lanesFor(timed)

              return (
                <div key={day.toISOString()} className="relative border-s">
                  {hours.map((hour) => (
                    <Tooltip key={hour}>
                      <TooltipTrigger
                        render={
                          <button
                            type="button"
                            aria-label={`Add an event at ${formatHour(hour, settings.hour12)} on ${format(day, "d MMMM")}`}
                            onClick={() => onCreateAt?.(day, hour)}
                            style={{ height: rowHeight }}
                            className={cn(
                              "group/slot flex w-full cursor-pointer items-center justify-center border-b border-border/60 transition-colors hover:bg-muted/50",
                              settings.highlightWorkHours &&
                                (hour < 9 || hour >= 17) &&
                                "bg-muted/30"
                            )}
                          >
                            <HugeiconsIcon
                              aria-hidden
                              icon={PlusSignIcon}
                              strokeWidth={2}
                              className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover/slot:opacity-100"
                            />
                          </button>
                        }
                      />
                      <TooltipContent>
                        Add at {formatHour(hour, settings.hour12)}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                  {lanes.map((lane, laneIndex) =>
                    lane.map((event) => {
                      const start = eventStart(event)
                      const end = eventEnd(event)
                      const fromTop =
                        (start.getHours() +
                          start.getMinutes() / 60 -
                          startHour) *
                        rowHeight
                      const height =
                        ((end.getTime() - start.getTime()) / 3_600_000) *
                        rowHeight
                      const width = 100 / lanes.length

                      const blockHeight = Math.max(height - 2, 18)

                      return (
                        <CalendarEventChip
                          key={event.id}
                          event={event}
                          hour12={settings.hour12}
                          // Below two lines' worth of height the time goes on
                          // the same row as the title instead of under it.
                          variant={blockHeight < 38 ? "inline" : "block"}
                          onSelect={onSelectEvent}
                          className="absolute"
                          style={{
                            // Clamped so an event starting before the visible
                            // scale still shows at its top edge.
                            top: Math.max(fromTop, 0),
                            height: blockHeight,
                            insetInlineStart: `${laneIndex * width}%`,
                            width: `calc(${width}% - 4px)`,
                          }}
                        />
                      )
                    })
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
