"use client"

import { Calendar02Icon, SearchRemoveIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

interface CalendarEmptyProps {
  /** True when events exist but the search or filters hid them all. */
  isFiltered: boolean
  onReset?: () => void
}

/**
 * Only the agenda needs this — a month or week grid still says something
 * useful when it is empty, but a list of nothing does not.
 */
export function CalendarEmpty({ isFiltered, onReset }: CalendarEmptyProps) {
  return (
    <Empty className="rounded-lg border border-dashed py-12">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon
            icon={isFiltered ? SearchRemoveIcon : Calendar02Icon}
            strokeWidth={2}
            className="size-6"
          />
        </EmptyMedia>
        <EmptyTitle>
          {isFiltered ? "No matching events" : "Nothing scheduled"}
        </EmptyTitle>
        <EmptyDescription>
          {isFiltered
            ? "No event in this range matches the current search and calendars."
            : "There is nothing on the calendar for this range."}
        </EmptyDescription>
      </EmptyHeader>
      {isFiltered && onReset && (
        <EmptyContent>
          <Button variant="outline" size="sm" onClick={onReset}>
            Clear filters
          </Button>
        </EmptyContent>
      )}
    </Empty>
  )
}
