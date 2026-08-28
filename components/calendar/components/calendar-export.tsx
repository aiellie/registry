"use client"

import * as React from "react"
import { format } from "date-fns"
import {
  Calendar03Icon,
  Copy01Icon,
  Download01Icon,
  SourceCodeIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import type { CalendarEvent } from "../data/schema"
import { eventEnd, eventStart } from "../lib"

interface CalendarExportProps {
  /** Exactly what is on screen — range and calendar filters already applied. */
  events: CalendarEvent[]
  filename?: string
  className?: string
}

function save(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

/** RFC 5545 escapes commas, semicolons and newlines inside text values. */
const icsText = (value: string) =>
  value.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n")

const icsStamp = (date: Date) => format(date, "yyyyMMdd'T'HHmmss")

function toIcs(events: CalendarEvent[]) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//aiellie//calendar//EN",
    "CALSCALE:GREGORIAN",
  ]

  for (const event of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${event.id}@aiellie`,
      // Floating local times, matching how the events are stored — no zone
      // conversion happens anywhere in this component.
      `DTSTART:${icsStamp(eventStart(event))}`,
      `DTEND:${icsStamp(eventEnd(event))}`,
      `SUMMARY:${icsText(event.title)}`,
      `CATEGORIES:${icsText(event.calendar)}`
    )
    if (event.location) lines.push(`LOCATION:${icsText(event.location)}`)
    if (event.description)
      lines.push(`DESCRIPTION:${icsText(event.description)}`)
    lines.push("END:VEVENT")
  }

  lines.push("END:VCALENDAR")
  return lines.join("\r\n")
}

export function CalendarExport({
  events,
  filename = "calendar",
  className,
}: CalendarExportProps) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(timer)
  }, [copied])

  const copyIcs = () => {
    // Only confirm once the write lands — a blocked clipboard should not
    // leave the menu claiming it copied.
    navigator.clipboard
      .writeText(toIcs(events))
      .then(() => setCopied(true))
      .catch(() => setCopied(false))
  }

  return (
    <DropdownMenu>
      <TooltipProvider delay={300}>
        <Tooltip>
          <TooltipTrigger
            render={
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon-sm"
                    aria-label="Export events"
                    className={className}
                  >
                    <HugeiconsIcon
                      icon={Download01Icon}
                      strokeWidth={2}
                      className="size-3.5"
                    />
                  </Button>
                }
              />
            }
          />
          <TooltipContent>Export</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Export {events.length} events</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={events.length === 0}
          onClick={() =>
            save(
              new Blob([toIcs(events)], {
                type: "text/calendar;charset=utf-8",
              }),
              `${filename}.ics`
            )
          }
        >
          <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} />
          iCalendar (.ics)
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={events.length === 0}
          onClick={() =>
            save(
              new Blob([JSON.stringify(events, null, 2)], {
                type: "application/json;charset=utf-8",
              }),
              `${filename}.json`
            )
          }
        >
          <HugeiconsIcon icon={SourceCodeIcon} strokeWidth={2} />
          JSON
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={events.length === 0} onClick={copyIcs}>
          <HugeiconsIcon
            icon={copied ? Tick02Icon : Copy01Icon}
            strokeWidth={2}
          />
          {copied ? "Copied" : "Copy as .ics"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
