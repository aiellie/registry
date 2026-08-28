"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

import { calendarByValue } from "../data/calendars"
import type { CalendarEvent } from "../data/schema"
import { eventStart, formatTime } from "../lib"

interface CalendarEventChipProps {
  event: CalendarEvent
  hour12: boolean
  /** `block` fills its slot in a time grid; `inline` is a month-cell line. */
  variant?: "inline" | "block"
  onSelect?: (event: CalendarEvent) => void
  /** Arms the chip for dragging; only set in views that can move events. */
  draggable?: boolean
  onDragStart?: (event: React.DragEvent) => void
  onDragEnd?: () => void
  dragging?: boolean
  className?: string
  style?: React.CSSProperties
}

export function CalendarEventChip({
  event,
  hour12,
  variant = "inline",
  onSelect,
  draggable = false,
  onDragStart,
  onDragEnd,
  dragging = false,
  className,
  style,
}: CalendarEventChipProps) {
  const source = calendarByValue(event.calendar)
  const time = event.allDay ? "All day" : formatTime(eventStart(event), hour12)

  return (
    <button
      type="button"
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={() => onSelect?.(event)}
      aria-label={`${event.title}, ${time}`}
      className={cn(
        "w-full cursor-pointer overflow-hidden rounded-md border text-start transition-colors",
        source?.chip,
        draggable && "active:cursor-grabbing",
        dragging && "opacity-40",
        variant === "inline"
          ? "flex items-center gap-1.5 px-1.5 py-0.5 text-[11px] leading-tight"
          : "flex flex-col gap-0.5 px-1.5 py-1 text-[11px] leading-tight",
        className
      )}
      style={style}
    >
      {variant === "inline" && !event.allDay && (
        <span className="shrink-0 tabular-nums opacity-70">{time}</span>
      )}
      <span className="truncate font-medium">{event.title}</span>
      {variant === "block" && (
        <span className="truncate tabular-nums opacity-70">{time}</span>
      )}
    </button>
  )
}
