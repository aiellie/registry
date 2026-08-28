"use client"

import { InboxIcon, SearchRemoveIcon } from "@hugeicons/core-free-icons"
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

interface DataTableEmptyProps {
  /** True when rows exist but nothing survived the filters. */
  isFiltered: boolean
  onReset?: () => void
}

/**
 * Two different dead ends: an empty dataset, and filters that matched nothing.
 * Only the second one is worth offering a way out of.
 */
export function DataTableEmpty({ isFiltered, onReset }: DataTableEmptyProps) {
  return (
    <Empty className="py-10">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon
            icon={isFiltered ? SearchRemoveIcon : InboxIcon}
            strokeWidth={2}
            className="size-6"
          />
        </EmptyMedia>
        <EmptyTitle>
          {isFiltered ? "No matching tasks" : "No tasks yet"}
        </EmptyTitle>
        <EmptyDescription>
          {isFiltered
            ? "No row matches the current search and filters."
            : "Tasks you create will show up here."}
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
