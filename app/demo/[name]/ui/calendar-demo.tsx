"use client"

import * as React from "react"
import { type DateRange } from "react-day-picker"

import { Calendar } from "@/components/ui/calendar"

export function CalendarSingleDemo() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2026, 6, 20)
  )

  return (
    <Calendar
      mode="single"
      defaultMonth={date}
      selected={date}
      onSelect={setDate}
      className="rounded-xl border shadow-sm"
    />
  )
}

export function CalendarRangeDemo() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2026, 6, 6),
    to: new Date(2026, 6, 14),
  })

  return (
    <Calendar
      mode="range"
      defaultMonth={range?.from}
      selected={range}
      onSelect={setRange}
      numberOfMonths={2}
      className="rounded-xl border shadow-sm"
    />
  )
}

export function CalendarDropdownDemo() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2026, 6, 20)
  )

  return (
    <Calendar
      mode="single"
      defaultMonth={date}
      selected={date}
      onSelect={setDate}
      captionLayout="dropdown"
      className="rounded-xl border shadow-sm"
    />
  )
}
