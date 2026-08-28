"use client"

import { type Table } from "@tanstack/react-table"
import { LayoutTable01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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

export function DataTableViewOptions<TData>({
  table,
  className,
}: {
  table: Table<TData>
  className?: string
}) {
  // Only the columns that named themselves; `select`, `row-number` and
  // `actions` are plumbing, not something to toggle.
  const columns = table
    .getAllColumns()
    .filter((column) => column.getCanHide() && column.columnDef.meta?.label)

  const hiddenCount = columns.filter((column) => !column.getIsVisible()).length

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
                    size="sm"
                    aria-label="Toggle columns"
                    className={className}
                  >
                    <HugeiconsIcon
                      icon={LayoutTable01Icon}
                      strokeWidth={2}
                      className="size-3.5"
                    />
                    <span className="tabular-nums">
                      {columns.length - hiddenCount}/{columns.length}
                    </span>
                  </Button>
                }
              />
            }
          />
          <TooltipContent>Columns</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent align="end" className="w-[170px]">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={column.getIsVisible()}
            closeOnClick={false}
            onCheckedChange={(value) => column.toggleVisibility(!!value)}
          >
            {column.columnDef.meta?.label ?? column.id}
          </DropdownMenuCheckboxItem>
        ))}
        {hiddenCount > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                columns.forEach((column) => column.toggleVisibility(true))
              }
            >
              Show all
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
