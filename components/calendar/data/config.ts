import { calendars } from "./calendars"
import type { CalendarSettings, EventField } from "./schema"

export const defaultSettings: CalendarSettings = {
  weekStartsOn: 1,
  showWeekends: true,
  showWeekNumbers: false,
  hour12: false,
  dayStartHour: 7,
  dayEndHour: 21,
  highlightWorkHours: true,
  showSummary: false,
  density: "default",
}

export const weekStartOptions: { value: 0 | 1; label: string }[] = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
]

/** Row height per hour in the week and day grids. */
export const hourHeight = { compact: 40, default: 56 } as const

/** How many chips a month cell shows before it collapses to "+N more". */
export const monthCellLimit = { compact: 2, default: 3 } as const

/** The event dialog's form, built from the same calendar list the chips use. */
export const eventFields: EventField[] = [
  {
    key: "title",
    label: "Title",
    type: "text",
    placeholder: "What's happening?",
    required: true,
  },
  {
    key: "calendar",
    label: "Calendar",
    type: "select",
    options: calendars.map(({ value, label }) => ({ value, label })),
  },
  { key: "date", label: "Date", type: "date", required: true },
  { key: "allDay", label: "All day", type: "switch" },
  { key: "startTime", label: "Starts", type: "time" },
  { key: "endTime", label: "Ends", type: "time" },
  { key: "location", label: "Location", type: "text", placeholder: "Where?" },
  {
    key: "description",
    label: "Notes",
    type: "textarea",
    placeholder: "Anything worth remembering",
  },
]
