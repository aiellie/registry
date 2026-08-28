"use client"

import * as React from "react"
import { format, getISOWeek, isSameMonth, isToday } from "date-fns"
import { PlusSignIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import { monthCellLimit } from "../data/config"
import type { CalendarEvent, CalendarSettings } from "../data/schema"
import { eventsOnDay, monthGrid, startOfDay, toLocalValue } from "../lib"
import { CalendarEventChip } from "./calendar-event-chip"

interface CalendarMonthProps {
  focus: Date
  events: CalendarEvent[]
  settings: CalendarSettings
  onSelectEvent?: (event: CalendarEvent) => void
  /** Clicking empty space in a cell opens a new event on that day. */
  onCreateAt?: (day: Date) => void
  /** Moves an event onto another day, keeping its time of day. */
  onMoveEvent?: (eventId: string, day: Date) => void
}

export function CalendarMonth({
  focus,
  events,
  settings,
  onSelectEvent,
  onCreateAt,
  onMoveEvent,
}: CalendarMonthProps) {
  const [draggingId, setDraggingId] = React.useState<string | null>(null)
  const [overKey, setOverKey] = React.useState<string | null>(null)

  const days = monthGrid(focus, settings.weekStartsOn)
  const visible = settings.showWeekends
    ? days
    : days.filter((day) => day.getDay() !== 0 && day.getDay() !== 6)

  const columns = settings.showWeekends ? 7 : 5
  const limit = monthCellLimit[settings.density]
  const headers = visible.slice(0, columns)

  const endDrag = () => {
    setDraggingId(null)
    setOverKey(null)
  }

  return (
    <TooltipProvider delay={300}>
      <div className="overflow-hidden rounded-none border-none bg-background">
        <div
          className="grid border-none bg-muted/30"
          style={{
            gridTemplateColumns: settings.showWeekNumbers
              ? `2.5rem repeat(${columns}, minmax(0, 1fr))`
              : `repeat(${columns}, minmax(0, 1fr))`,
          }}
        >
          {settings.showWeekNumbers && (
            <div className="px-2 py-1.5 text-center text-[11px] font-medium text-muted-foreground">
              Wk
            </div>
          )}
          {headers.map((day) => (
            <div
              key={day.toISOString()}
              className="px-2 py-1.5 text-center text-[11px] font-medium text-muted-foreground"
            >
              {format(day, "EEE")}
            </div>
          ))}
        </div>
        <div
          className="grid"
          style={{
            gridTemplateColumns: settings.showWeekNumbers
              ? `2.5rem repeat(${columns}, minmax(0, 1fr))`
              : `repeat(${columns}, minmax(0, 1fr))`,
          }}
        >
          {visible.map((day, index) => {
            const dayEvents = eventsOnDay(events, day)
            const shown = dayEvents.slice(0, limit)
            const overflow = dayEvents.length - shown.length
            const key = day.toISOString()
            const outside = !isSameMonth(day, focus)
            const startsRow = index % columns === 0

            return (
              <React.Fragment key={key}>
                {settings.showWeekNumbers && startsRow && (
                  <div className="flex items-start justify-center border-e border-t pt-1.5 text-[11px] text-muted-foreground tabular-nums">
                    {getISOWeek(day)}
                  </div>
                )}
                <div
                  onDragOver={(dragEvent) => {
                    if (!draggingId) return
                    dragEvent.preventDefault()
                    dragEvent.dataTransfer.dropEffect = "move"
                    setOverKey(key)
                  }}
                  onDrop={(dragEvent) => {
                    dragEvent.preventDefault()
                    if (draggingId) onMoveEvent?.(draggingId, day)
                    endDrag()
                  }}
                  className={cn(
                    "group/day flex flex-col gap-1 border-e border-t p-1 last:border-e-0",
                    settings.density === "compact"
                      ? "min-h-[5.5rem]"
                      : "min-h-[7rem]",
                    outside && "bg-muted/25",
                    overKey === key &&
                      "bg-primary/5 ring-1 ring-primary ring-inset"
                  )}
                >
                  <div className="flex items-center justify-between gap-1 px-1">
                    <span
                      className={cn(
                        "flex size-5 items-center justify-center rounded-full text-xs tabular-nums",
                        outside && "text-muted-foreground/60",
                        isToday(day) &&
                          "bg-primary font-medium text-primary-foreground"
                      )}
                    >
                      {format(day, "d")}
                    </span>
                    {/* Only shows on hover so the grid stays quiet, but stays
                      reachable by keyboard through focus-visible. */}
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            aria-label={`Add an event on ${format(day, "d MMMM")}`}
                            onClick={() => onCreateAt?.(day)}
                            className="text-muted-foreground opacity-0 transition-opacity group-hover/day:opacity-100 hover:text-foreground focus-visible:opacity-100"
                          >
                            <HugeiconsIcon
                              icon={PlusSignIcon}
                              strokeWidth={2}
                              className="size-3.5"
                            />
                          </Button>
                        }
                      />
                      <TooltipContent>
                        Add an event on {format(day, "d MMM")}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  {shown.map((event) => (
                    <CalendarEventChip
                      key={event.id}
                      event={event}
                      hour12={settings.hour12}
                      onSelect={onSelectEvent}
                      draggable
                      dragging={draggingId === event.id}
                      onDragStart={(dragEvent) => {
                        setDraggingId(event.id)
                        dragEvent.dataTransfer.effectAllowed = "move"
                        // Firefox ignores a drag that carries no payload.
                        dragEvent.dataTransfer.setData("text/plain", event.id)
                      }}
                      onDragEnd={endDrag}
                    />
                  ))}
                  {overflow > 0 && (
                    <Popover>
                      <PopoverTrigger
                        render={
                          <button
                            type="button"
                            className="cursor-pointer rounded px-1.5 py-0.5 text-start text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground"
                          />
                        }
                      >
                        +{overflow} more
                      </PopoverTrigger>
                      <PopoverContent
                        align="start"
                        className="w-56 gap-1.5 p-2"
                      >
                        <span className="px-0.5 text-xs font-medium text-muted-foreground">
                          {format(day, "EEEE d MMMM")}
                        </span>
                        <div className="flex flex-col gap-1">
                          {dayEvents.map((event) => (
                            <CalendarEventChip
                              key={event.id}
                              event={event}
                              hour12={settings.hour12}
                              onSelect={onSelectEvent}
                            />
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </React.Fragment>
            )
          })}
        </div>
      </div>
    </TooltipProvider>
  )
}

/** Exported so the dialog can seed a new event from a clicked day. */
export const dayToValue = (day: Date) => toLocalValue(startOfDay(day))
