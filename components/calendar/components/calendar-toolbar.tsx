"use client"

import {
  Cancel01Icon,
  FilterRemoveIcon,
  PlusSignIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import { calendars } from "../data/calendars"
import type {
  CalendarEvent,
  CalendarSettings,
  CalendarView,
} from "../data/schema"
import { headingFor } from "../lib"
import { CalendarExport } from "./calendar-export"
import { CalendarSettingsMenu } from "./calendar-settings"
import { CalendarViewSwitcher } from "./calendar-view-switcher"

interface CalendarToolbarProps {
  view: CalendarView
  onViewChange: (view: CalendarView) => void
  focus: Date
  search: string
  onSearchChange: (value: string) => void
  visible: string[]
  onVisibleChange: (next: string[]) => void
  settings: CalendarSettings
  onSettingsChange: (patch: Partial<CalendarSettings>) => void
  /** Exactly what is on screen. */
  events: CalendarEvent[]
  onCreate: () => void
  /** Sits ahead of the heading — where the layout puts its sidebar trigger. */
  leading?: React.ReactNode
  className?: string
}

/**
 * The controls over the views. Navigation lives in the sidebar; the toolbar
 * only names the range on screen.
 */
export function CalendarToolbar({
  view,
  onViewChange,
  focus,
  search,
  onSearchChange,
  visible,
  onVisibleChange,
  settings,
  onSettingsChange,
  events,
  onCreate,
  leading,
  className,
}: CalendarToolbarProps) {
  const isFiltered = search.length > 0 || visible.length < calendars.length

  const reset = () => {
    onSearchChange("")
    onVisibleChange(calendars.map((calendar) => calendar.value))
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {leading}
      <h2 className="truncate text-sm font-medium">
        {headingFor(view, focus, settings.weekStartsOn)}
      </h2>
      <InputGroup className="h-8 w-[160px] lg:w-[220px]">
        <InputGroupAddon align="inline-start">
          <HugeiconsIcon
            aria-hidden
            icon={Search01Icon}
            strokeWidth={2}
            className="size-4 text-muted-foreground"
          />
        </InputGroupAddon>
        <InputGroupInput
          value={search}
          onChange={(changeEvent) => onSearchChange(changeEvent.target.value)}
          placeholder="Search events..."
          aria-label="Search events"
          spellCheck={false}
          autoComplete="off"
          className="h-8"
        />
        {search && (
          <InputGroupAddon align="inline-end">
            <TooltipProvider delay={300}>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <InputGroupButton
                      size="icon-xs"
                      aria-label="Clear search"
                      onClick={() => onSearchChange("")}
                      className="text-muted-foreground hover:text-foreground"
                    />
                  }
                >
                  <HugeiconsIcon
                    aria-hidden
                    icon={Cancel01Icon}
                    strokeWidth={2}
                    className="size-3.5"
                  />
                </TooltipTrigger>
                <TooltipContent>Clear</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </InputGroupAddon>
        )}
      </InputGroup>
      {/* Kept in place and disabled rather than hidden, so the row never
          reflows as filters come and go. */}
      <TooltipProvider delay={300}>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Reset filters"
                disabled={!isFiltered}
                onClick={reset}
              >
                <HugeiconsIcon
                  icon={FilterRemoveIcon}
                  strokeWidth={2}
                  className="size-3.5"
                />
              </Button>
            }
          />
          <TooltipContent>
            {isFiltered ? "Reset filters" : "No filters to reset"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="ms-auto flex items-center gap-2">
        <span className="hidden text-xs text-muted-foreground tabular-nums sm:inline">
          {events.length} in view
        </span>
        <CalendarViewSwitcher value={view} onValueChange={onViewChange} />
        <CalendarSettingsMenu
          settings={settings}
          onSettingsChange={onSettingsChange}
          view={view}
        />
        <CalendarExport events={events} />
        {/* The sidebar carries the labelled one; this stays reachable once
            the sidebar is collapsed away. */}
        <TooltipProvider delay={300}>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  size="icon-sm"
                  aria-label="New event"
                  onClick={onCreate}
                >
                  <HugeiconsIcon
                    icon={PlusSignIcon}
                    strokeWidth={2}
                    className="size-3.5"
                  />
                </Button>
              }
            />
            <TooltipContent>New event</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
