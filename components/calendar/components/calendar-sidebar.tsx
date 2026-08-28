"use client"

import * as React from "react"
import { addDays } from "date-fns"
import {
  ArrowDown01Icon,
  Calendar03Icon,
  PlusSignIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

import { calendars } from "../data/calendars"
import type {
  CalendarEvent,
  CalendarSettings,
  CalendarView as CalendarViewMode,
} from "../data/schema"
import { rangeFor } from "../lib"

/** Quick jumps below the mini month, all relative to today. */
const presets = [
  { label: "Today", days: 0 },
  { label: "Tomorrow", days: 1 },
  { label: "In 3 days", days: 3 },
  { label: "In a week", days: 7 },
]

interface CalendarSidebarProps extends Omit<
  React.ComponentProps<typeof Sidebar>,
  "title"
> {
  view: CalendarViewMode
  focus: Date
  onFocusChange: (date: Date) => void
  /** The calendars currently drawn. The last one cannot be unchecked. */
  visible: string[]
  onVisibleChange: (next: string[]) => void
  settings: CalendarSettings
  /** Everything the range touches, before the calendar filter — the counts. */
  events: CalendarEvent[]
  onCreate: () => void
  title?: string
  description?: string
}

/**
 * The rail beside the calendar: a mini month (with month/year dropdowns and
 * prev/next on the caption) that mirrors the active view's range, quick
 * presets, and one row per calendar to draw or hide it.
 */
export function CalendarSidebar({
  view,
  focus,
  onFocusChange,
  visible,
  onVisibleChange,
  settings,
  events,
  onCreate,
  title = "Schedule",
  description = "Everything on the calendar",
  ...props
}: CalendarSidebarProps) {
  const toggle = (value: string) => {
    const next = visible.includes(value)
      ? visible.filter((item) => item !== value)
      : [...visible, value]
    // Emptying the list would draw nothing at all, so the last one holds.
    if (next.length) onVisibleChange(next)
  }

  // The day view marks a single date; every other view spans one, so the mini
  // month paints it as a range.
  const range = view === "day" ? null : rangeFor(view, focus, settings)

  /** Everything mode-independent about the mini month. */
  const calendarProps = {
    month: focus,
    onMonthChange: onFocusChange,
    weekStartsOn: settings.weekStartsOn,
    captionLayout: "dropdown" as const,
    className: "mx-auto w-full bg-transparent [--cell-size:--spacing(8)]",
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-16 justify-center border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <HugeiconsIcon
              aria-hidden
              icon={Calendar03Icon}
              strokeWidth={2}
              className="size-4"
            />
          </div>
          <div className="grid min-w-0 flex-1 text-sm leading-tight">
            <span className="truncate font-medium">{title}</span>
            <span className="truncate text-xs text-muted-foreground">
              {description}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            {/* The same focus the views run on, so moving here moves them. */}
            {range ? (
              <Calendar
                {...calendarProps}
                mode="range"
                selected={{ from: range.start, to: range.end }}
                // The range is derived from the focus, never picked directly —
                // clicking any day refocuses and the range follows. Without an
                // `onSelect` DayPicker would treat `selected` as initial-only
                // and stop tracking the view.
                onSelect={(_next, day) => onFocusChange(day)}
              />
            ) : (
              <Calendar
                {...calendarProps}
                mode="single"
                selected={focus}
                onSelect={(date) => {
                  if (date) onFocusChange(date)
                }}
              />
            )}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="pt-0">
          <SidebarGroupContent className="flex flex-wrap gap-1.5">
            {presets.map((preset) => (
              <Button
                key={preset.days}
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onFocusChange(addDays(new Date(), preset.days))}
              >
                {preset.label}
              </Button>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="mx-0" />

        <Collapsible defaultOpen>
          <SidebarGroup>
            <CollapsibleTrigger className="group/collapsible w-full">
              <SidebarGroupLabel className="flex cursor-pointer items-center justify-between">
                Calendars
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  strokeWidth={2}
                  className="size-3.5 shrink-0 -rotate-90 transition-transform duration-200 group-data-panel-open/collapsible:rotate-0 rtl:rotate-90 group-data-panel-open/collapsible:rtl:rotate-0"
                />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {calendars.map((calendar) => {
                    const checked = visible.includes(calendar.value)
                    const count = events.filter(
                      (event) => event.calendar === calendar.value
                    ).length

                    return (
                      <SidebarMenuItem key={calendar.value}>
                        <SidebarMenuButton
                          aria-pressed={checked}
                          onClick={() => toggle(calendar.value)}
                        >
                          <span
                            aria-hidden
                            className={cn(
                              "flex aspect-square size-4 shrink-0 items-center justify-center rounded-sm border",
                              checked
                                ? cn("border-transparent", calendar.dot)
                                : "border-sidebar-border"
                            )}
                          >
                            {checked && (
                              // The box carries the calendar's own colour, so
                              // the tick is spelled out against it.
                              <HugeiconsIcon
                                icon={Tick02Icon}
                                strokeWidth={3}
                                className="size-3 text-white!"
                              />
                            )}
                          </span>
                          <span className={cn(!checked && "opacity-60")}>
                            {calendar.label}
                          </span>
                        </SidebarMenuButton>
                        <SidebarMenuBadge>{count}</SidebarMenuBadge>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onCreate}>
              <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
              <span>New event</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
