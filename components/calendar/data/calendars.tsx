import {
  Airplane01Icon,
  Briefcase01Icon,
  Calendar03Icon,
  GridViewIcon,
  HeartCheckIcon,
  Home01Icon,
  ListViewIcon,
  Target01Icon,
  Time04Icon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

import type { CalendarView } from "./schema"

export interface CalendarSource {
  value: string
  label: string
  icon: IconSvgElement
  /** Full recipe per calendar — Tailwind needs complete class names in source. */
  chip: string
  /** The solid dot in legends, filters and the summary tiles. */
  dot: string
}

/**
 * One entry per calendar. Colors are spelled out rather than composed, because
 * Tailwind only ships classes it can see written down.
 */
export const calendars: CalendarSource[] = [
  {
    value: "work",
    label: "Work",
    icon: Briefcase01Icon,
    chip: "border-sky-500/25 bg-sky-500/5 text-sky-700 hover:bg-sky-500/10 dark:border-sky-400/25 dark:bg-sky-400/5 dark:text-sky-300",
    dot: "bg-sky-500",
  },
  {
    value: "personal",
    label: "Personal",
    icon: Home01Icon,
    chip: "border-violet-500/25 bg-violet-500/5 text-violet-700 hover:bg-violet-500/10 dark:border-violet-400/25 dark:bg-violet-400/5 dark:text-violet-300",
    dot: "bg-violet-500",
  },
  {
    value: "focus",
    label: "Focus",
    icon: Target01Icon,
    chip: "border-emerald-500/25 bg-emerald-500/5 text-emerald-700 hover:bg-emerald-500/10 dark:border-emerald-400/25 dark:bg-emerald-400/5 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  {
    value: "travel",
    label: "Travel",
    icon: Airplane01Icon,
    chip: "border-amber-500/25 bg-amber-500/5 text-amber-700 hover:bg-amber-500/10 dark:border-amber-400/25 dark:bg-amber-400/5 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  {
    value: "health",
    label: "Health",
    icon: HeartCheckIcon,
    chip: "border-rose-500/25 bg-rose-500/5 text-rose-700 hover:bg-rose-500/10 dark:border-rose-400/25 dark:bg-rose-400/5 dark:text-rose-300",
    dot: "bg-rose-500",
  },
]

export const calendarByValue = (value: string) =>
  calendars.find((calendar) => calendar.value === value)

/** The view switcher, each with its own icon. */
export const calendarViews: {
  value: CalendarView
  label: string
  icon: IconSvgElement
  /** Shown in the tooltip beside the label. */
  shortcut: string
}[] = [
  { value: "month", label: "Month", icon: GridViewIcon, shortcut: "M" },
  { value: "week", label: "Week", icon: Calendar03Icon, shortcut: "W" },
  { value: "day", label: "Day", icon: Time04Icon, shortcut: "D" },
  { value: "agenda", label: "Agenda", icon: ListViewIcon, shortcut: "A" },
]
