import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const calendarEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  /** Which calendar it belongs to; drives its color. */
  calendar: z.string(),
  /** Local `YYYY-MM-DDTHH:mm` — no zone, so it reads the same everywhere. */
  start: z.string(),
  end: z.string(),
  allDay: z.boolean().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
})

export type CalendarEvent = z.infer<typeof calendarEventSchema>

export const calendarViewSchema = z.enum(["month", "week", "day", "agenda"])

export type CalendarView = z.infer<typeof calendarViewSchema>

export const calendarDensitySchema = z.enum(["compact", "default"])

export type CalendarDensity = z.infer<typeof calendarDensitySchema>

export const calendarSettingsSchema = z.object({
  /** 0 = Sunday, 1 = Monday. */
  weekStartsOn: z.union([z.literal(0), z.literal(1)]),
  showWeekends: z.boolean(),
  showWeekNumbers: z.boolean(),
  /** Off, times read as 14:00 rather than 2 PM. */
  hour12: z.boolean(),
  /** First and last hour drawn in the week and day grids. */
  dayStartHour: z.number().min(0).max(23),
  dayEndHour: z.number().min(1).max(24),
  /** Tints the hours outside the working day. */
  highlightWorkHours: z.boolean(),
  /** The per-calendar tiles above the grid. */
  showSummary: z.boolean(),
  density: calendarDensitySchema,
})

export type CalendarSettings = z.infer<typeof calendarSettingsSchema>

/** One control in the event dialog, described rather than hand-written. */
export interface EventField {
  key: string
  label: string
  type: "text" | "textarea" | "date" | "time" | "select" | "switch"
  options?: { value: string; label: string }[]
  placeholder?: string
  required?: boolean
}
