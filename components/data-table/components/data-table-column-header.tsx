"use client"

import { type Column } from "@tanstack/react-table"
import {
  ArrowDown01Icon,
  ArrowUpDownIcon,
  ArrowUp01Icon,
  Cancel01Icon,
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>
  title: string
  /** Flush the trigger to the end of the cell, for numeric columns. */
  align?: "start" | "end"
  className?: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  align = "start",
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  const sorted = column.getIsSorted()
  // Only worth showing once more than one column is in play; on its own the
  // arrow already says everything.
  const sortIndex = column.getSortIndex()
  const showRank = sorted && sortIndex > -1 && column.getCanMultiSort()

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        align === "end" && "justify-end",
        className
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 aria-expanded:bg-accent",
                align === "end" ? "-me-2.5" : "-ms-2.5"
              )}
            >
              <span>{title}</span>
              {showRank && sortIndex > 0 && (
                <span className="rounded-sm bg-muted px-1 text-[10px] font-medium tabular-nums">
                  {sortIndex + 1}
                </span>
              )}
              <HugeiconsIcon
                strokeWidth={2}
                icon={
                  sorted === "desc"
                    ? ArrowDown01Icon
                    : sorted === "asc"
                      ? ArrowUp01Icon
                      : ArrowUpDownIcon
                }
              />
            </Button>
          }
        />
        <DropdownMenuContent align={align === "end" ? "end" : "start"}>
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <HugeiconsIcon icon={ArrowUp01Icon} strokeWidth={2} />
            Ascending
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} />
            Descending
          </DropdownMenuItem>
          {sorted && (
            <DropdownMenuItem onClick={() => column.clearSorting()}>
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              Clear sort
            </DropdownMenuItem>
          )}
          {column.getCanHide() && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <HugeiconsIcon icon={ViewOffSlashIcon} strokeWidth={2} />
                Hide column
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
