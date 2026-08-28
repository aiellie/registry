"use client"

import * as React from "react"
import { differenceInCalendarDays, format } from "date-fns"

import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

import { calendars } from "../data/calendars"
import { defaultSettings, eventFields } from "../data/config"
import { defaultFocusDate } from "../data/events"
import type {
  CalendarEvent,
  CalendarSettings,
  CalendarView as CalendarViewMode,
} from "../data/schema"
import {
  eventEnd,
  eventStart,
  parseLocal,
  rangeFor,
  startOfDay,
  toLocalValue,
} from "../lib"
import { CalendarAgenda } from "./calendar-agenda"
import { CalendarDeleteDialog } from "./calendar-delete-dialog"
import { CalendarEmpty } from "./calendar-empty"
import {
  CalendarEventDialog,
  draftFrom,
  emptyDraft,
  type EventDraft,
} from "./calendar-event-dialog"
import { CalendarMonth } from "./calendar-month"
import { CalendarSidebar } from "./calendar-sidebar"
import { CalendarSummary } from "./calendar-summary"
import { CalendarTimeGrid } from "./calendar-time-grid"
import { CalendarToolbar } from "./calendar-toolbar"

interface CalendarViewProps {
  events?: CalendarEvent[]
  /** Where the calendar opens; defaults to the fixture's own month. */
  defaultFocus?: Date
  defaultView?: CalendarViewMode
  settings?: Partial<CalendarSettings>
  title?: string
  description?: string
  /** Whether the sidebar starts open. */
  defaultSidebarOpen?: boolean
  className?: string
}

const allCalendars = calendars.map((calendar) => calendar.value)

/**
 * The whole pattern: a sidebar of calendars and a mini month beside four views
 * over one event list. State lives here so every control below stays a plain
 * presentational component you can lift out on its own.
 *
 * It is a shell rather than a card — it fills whatever box it is given, and
 * `className` is where that box gets its height.
 */
export function CalendarView({
  events: initialEvents = [],
  defaultFocus = defaultFocusDate,
  defaultView = "month",
  settings: initialSettings,
  title = "Schedule",
  description = "Everything on the calendar",
  defaultSidebarOpen = true,
  className,
}: CalendarViewProps) {
  // Held locally so the dialogs and the drag actually change something; a
  // server-backed calendar would go upstream instead. Adopting a new `events`
  // prop happens during render rather than in an effect, so there is no
  // cascading second pass.
  const [events, setEvents] = React.useState(initialEvents)
  const [seeded, setSeeded] = React.useState(initialEvents)
  if (seeded !== initialEvents) {
    setSeeded(initialEvents)
    setEvents(initialEvents)
  }

  const [view, setView] = React.useState<CalendarViewMode>(defaultView)
  const [focus, setFocus] = React.useState(defaultFocus)
  const [search, setSearch] = React.useState("")
  const [visible, setVisible] = React.useState<string[]>(allCalendars)
  const [settings, setSettings] = React.useState<CalendarSettings>({
    ...defaultSettings,
    ...initialSettings,
  })

  const [draft, setDraft] = React.useState<EventDraft | null>(null)
  const [confirming, setConfirming] = React.useState<CalendarEvent | null>(null)

  const updateSettings = React.useCallback(
    (patch: Partial<CalendarSettings>) =>
      setSettings((prev) => ({ ...prev, ...patch })),
    []
  )

  /** Everything the current range touches, before the calendar filter. */
  const inRange = React.useMemo(() => {
    const { start, end } = rangeFor(view, focus, settings)
    // Month grids spill into the neighbouring months, so the window is widened
    // rather than clipped to the month itself.
    const from =
      view === "month"
        ? startOfDay(new Date(start.getFullYear(), start.getMonth(), -6))
        : start
    const to =
      view === "month"
        ? new Date(end.getFullYear(), end.getMonth() + 1, 6)
        : end
    return events.filter((event) => {
      const eventDay = startOfDay(eventStart(event))
      return eventDay >= startOfDay(from) && eventDay <= startOfDay(to)
    })
  }, [events, focus, settings, view])

  const query = search.trim().toLowerCase()
  const shown = React.useMemo(
    () =>
      inRange.filter((event) => {
        if (!visible.includes(event.calendar)) return false
        if (!query) return true
        return (
          event.title.toLowerCase().includes(query) ||
          (event.location ?? "").toLowerCase().includes(query)
        )
      }),
    [inRange, query, visible]
  )

  const isFiltered = query.length > 0 || visible.length < calendars.length

  const saveEvent = (next: CalendarEvent) => {
    setEvents((prev) => {
      const index = prev.findIndex((event) => event.id === next.id)
      if (index < 0) return [...prev, next]
      const copy = [...prev]
      copy[index] = next
      return copy
    })
  }

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id))
  }

  /** Dragging onto another day keeps the time of day and the duration. */
  const moveEvent = (id: string, day: Date) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id !== id) return event
        const start = eventStart(event)
        const shift = differenceInCalendarDays(day, startOfDay(start))
        if (shift === 0) return event
        const move = (value: string) => {
          const date = parseLocal(value)
          date.setDate(date.getDate() + shift)
          return toLocalValue(date)
        }
        return { ...event, start: move(event.start), end: move(event.end) }
      })
    )
  }

  const resetFilters = () => {
    setSearch("")
    setVisible(allCalendars)
  }

  const body = () => {
    if (view === "agenda") {
      return shown.length ? (
        <CalendarAgenda
          focus={focus}
          events={shown}
          settings={settings}
          onSelectEvent={(event) => setDraft(draftFrom(event))}
        />
      ) : (
        <CalendarEmpty isFiltered={isFiltered} onReset={resetFilters} />
      )
    }

    if (view === "week" || view === "day") {
      return (
        <CalendarTimeGrid
          focus={focus}
          events={shown}
          settings={settings}
          days={view === "day" ? 1 : 7}
          onSelectEvent={(event) => setDraft(draftFrom(event))}
          onCreateAt={(day, hour) => setDraft(emptyDraft(day, hour))}
        />
      )
    }

    return (
      <CalendarMonth
        focus={focus}
        events={shown}
        settings={settings}
        onSelectEvent={(event) => setDraft(draftFrom(event))}
        onCreateAt={(day) => setDraft(emptyDraft(day))}
        onMoveEvent={moveEvent}
      />
    )
  }

  return (
    <SidebarProvider
      defaultOpen={defaultSidebarOpen}
      className={cn("h-svh", className)}
    >
      <CalendarSidebar
        title={title}
        description={description}
        view={view}
        focus={focus}
        onFocusChange={setFocus}
        visible={visible}
        onVisibleChange={setVisible}
        settings={settings}
        events={inRange}
        onCreate={() => setDraft(emptyDraft(focus))}
      />
      <SidebarInset className="min-w-0 overflow-hidden">
        <header className="flex shrink-0 flex-col gap-2 border-b p-4">
          <CalendarToolbar
            leading={
              <>
                <SidebarTrigger />
              </>
            }
            view={view}
            onViewChange={setView}
            focus={focus}
            search={search}
            onSearchChange={setSearch}
            visible={visible}
            onVisibleChange={setVisible}
            settings={settings}
            onSettingsChange={updateSettings}
            events={shown}
            onCreate={() => setDraft(emptyDraft(focus))}
          />
        </header>
        {/* The shell holds its height, so the views scroll rather than the
            page — and nothing in here is allowed to squash to fit. */}
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-0 *:shrink-0">
          {settings.showSummary && (
            <CalendarSummary
              events={inRange}
              visible={visible}
              onVisibleChange={setVisible}
            />
          )}
          {body()}
        </div>
      </SidebarInset>

      <CalendarEventDialog
        fields={eventFields}
        hour12={settings.hour12}
        draft={draft}
        onDraftChange={setDraft}
        onSave={saveEvent}
        onDelete={(id) => {
          const target = events.find((event) => event.id === id)
          setDraft(null)
          if (target) setConfirming(target)
        }}
      />
      <CalendarDeleteDialog
        open={Boolean(confirming)}
        onOpenChange={(open) => {
          if (!open) setConfirming(null)
        }}
        subject={confirming?.title}
        onConfirm={() => {
          if (confirming) deleteEvent(confirming.id)
        }}
      />
    </SidebarProvider>
  )
}

/** Re-exported so a consumer can label a range the same way the nav does. */
export const formatRange = (start: Date, end: Date) =>
  `${format(start, "d MMM")} – ${format(end, "d MMM yyyy")}`

export { eventEnd }
