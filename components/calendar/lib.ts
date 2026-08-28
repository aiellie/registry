import {
  addDays,
  addMonths,
  addWeeks,
  differenceInMinutes,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns"

import type {
  CalendarEvent,
  CalendarSettings,
  CalendarView,
} from "./data/schema"

/**
 * `new Date("2026-08-12T09:30")` is already parsed as local time, but
 * `new Date("2026-08-12")` is not — it lands on UTC midnight, which reads a day
 * early west of Greenwich. Splitting the parts by hand sidesteps both rules.
 */
export function parseLocal(value: string): Date {
  const [datePart, timePart = "00:00"] = value.split("T")
  const [year, month, day] = datePart.split("-").map(Number)
  const [hour, minute] = timePart.split(":").map(Number)
  return new Date(year, (month ?? 1) - 1, day ?? 1, hour ?? 0, minute ?? 0)
}

/** The inverse of {@link parseLocal}, for writing values back. */
export const toLocalValue = (date: Date) => format(date, "yyyy-MM-dd'T'HH:mm")

export const eventStart = (event: CalendarEvent) => parseLocal(event.start)
export const eventEnd = (event: CalendarEvent) => parseLocal(event.end)

export const eventMinutes = (event: CalendarEvent) =>
  Math.max(differenceInMinutes(eventEnd(event), eventStart(event)), 15)

export function formatTime(date: Date, hour12: boolean) {
  return hour12
    ? format(date, "h:mm a").replace(":00", "")
    : format(date, "HH:mm")
}

export function formatHour(hour: number, hour12: boolean) {
  if (!hour12) return `${String(hour).padStart(2, "0")}:00`
  const suffix = hour < 12 ? "AM" : "PM"
  const twelve = hour % 12 === 0 ? 12 : hour % 12
  return `${twelve} ${suffix}`
}

/** Multi-day events show up on every day they touch, not just their first. */
export function eventsOnDay(events: CalendarEvent[], day: Date) {
  const dayStart = startOfDay(day)
  return events
    .filter((event) => {
      const start = startOfDay(eventStart(event))
      const end = startOfDay(eventEnd(event))
      return dayStart >= start && dayStart <= end
    })
    .sort((a, b) => {
      if (Boolean(a.allDay) !== Boolean(b.allDay)) return a.allDay ? -1 : 1
      return eventStart(a).getTime() - eventStart(b).getTime()
    })
}

/** The window a view covers, plus the heading that names it. */
export function rangeFor(
  view: CalendarView,
  focus: Date,
  settings: Pick<CalendarSettings, "weekStartsOn">
) {
  const weekStartsOn = settings.weekStartsOn

  if (view === "day") {
    return { start: startOfDay(focus), end: startOfDay(focus), days: 1 }
  }
  if (view === "week") {
    return {
      start: startOfWeek(focus, { weekStartsOn }),
      end: endOfWeek(focus, { weekStartsOn }),
      days: 7,
    }
  }
  if (view === "agenda") {
    // A rolling month rather than a calendar one — an agenda is about what is
    // coming up, not about where the month boundary falls.
    return {
      start: startOfDay(focus),
      end: addDays(startOfDay(focus), 30),
      days: 31,
    }
  }
  return { start: startOfMonth(focus), end: endOfMonth(focus), days: 0 }
}

/** The six-week block a month view paints, including its leading/trailing days. */
export function monthGrid(focus: Date, weekStartsOn: 0 | 1) {
  const first = startOfWeek(startOfMonth(focus), { weekStartsOn })
  const last = endOfWeek(endOfMonth(focus), { weekStartsOn })
  const days: Date[] = []
  for (let day = first; day <= last; day = addDays(day, 1)) days.push(day)
  return days
}

export function weekDays(focus: Date, weekStartsOn: 0 | 1) {
  const first = startOfWeek(focus, { weekStartsOn })
  return Array.from({ length: 7 }, (_, index) => addDays(first, index))
}

export function shiftFocus(view: CalendarView, focus: Date, delta: number) {
  if (view === "month") return addMonths(focus, delta)
  if (view === "week") return addWeeks(focus, delta)
  return addDays(focus, view === "agenda" ? delta * 30 : delta)
}

export function headingFor(
  view: CalendarView,
  focus: Date,
  weekStartsOn: 0 | 1
) {
  if (view === "day") return format(focus, "EEEE d MMMM yyyy")
  if (view === "agenda") {
    const { start, end } = rangeFor("agenda", focus, { weekStartsOn })
    return `${format(start, "d MMM")} – ${format(end, "d MMM yyyy")}`
  }
  if (view === "week") {
    const days = weekDays(focus, weekStartsOn)
    const [first] = days
    const last = days[6]
    const sameMonth = first.getMonth() === last.getMonth()
    return sameMonth
      ? `${format(first, "d")} – ${format(last, "d MMMM yyyy")}`
      : `${format(first, "d MMM")} – ${format(last, "d MMM yyyy")}`
  }
  return format(focus, "MMMM yyyy")
}

export { isSameDay, startOfDay }
