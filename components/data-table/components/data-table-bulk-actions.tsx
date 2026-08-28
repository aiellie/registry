"use client"

import * as React from "react"
import { type Table } from "@tanstack/react-table"
import { Cancel01Icon, Delete02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import type { FacetOption } from "../data/data"
import { DataTableAvatar } from "./data-table-avatar"
import { DataTableDeleteDialog } from "./data-table-delete-dialog"

export interface BulkField {
  /** The row key this menu writes, e.g. `status`. */
  key: string
  label: string
  icon: IconSvgElement
  options: FacetOption[]
}

interface DataTableBulkActionsProps<TData> {
  table: Table<TData>
  fields?: BulkField[]
  onDelete?: (rowIds: string[]) => void
  onFieldChange?: (rowIds: string[], key: string, value: string) => void
  className?: string
}

/**
 * The bar that takes over the toolbar's row once anything is selected. It acts
 * on the whole selection, including rows on other pages.
 */
export function DataTableBulkActions<TData>({
  table,
  fields = [],
  onDelete,
  onFieldChange,
  className,
}: DataTableBulkActionsProps<TData>) {
  const [confirming, setConfirming] = React.useState(false)
  const rows = table.getFilteredSelectedRowModel().rows
  const rowIds = rows.map((row) => row.id)

  if (rows.length === 0) return null

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-lg border border-dashed bg-muted/40 px-2.5 py-1.5",
        className
      )}
    >
      <span className="text-sm font-medium tabular-nums">
        {rows.length} selected
      </span>
      <Separator orientation="vertical" className="mx-1 h-4" />
      {fields.map((field) => (
        <DropdownMenu key={field.key}>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="sm">
                <HugeiconsIcon icon={field.icon} strokeWidth={2} />
                Set {field.label.toLowerCase()}
              </Button>
            }
          />
          <DropdownMenuContent align="start" className="w-40">
            {field.options.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onFieldChange?.(rowIds, field.key, option.value)}
              >
                {option.initials ? (
                  <DataTableAvatar option={option} className="size-5" />
                ) : (
                  option.icon && (
                    <HugeiconsIcon
                      icon={option.icon}
                      strokeWidth={2}
                      className={cn("text-muted-foreground", option.className)}
                    />
                  )
                )}
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
      {onDelete && (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setConfirming(true)}
        >
          <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
          Delete
        </Button>
      )}
      <TooltipProvider delay={300}>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Clear selection"
                className="ms-auto"
                onClick={() => table.resetRowSelection()}
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  strokeWidth={2}
                  className="size-3.5"
                />
              </Button>
            }
          />
          <TooltipContent>Clear selection</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DataTableDeleteDialog
        open={confirming}
        onOpenChange={setConfirming}
        count={rows.length}
        onConfirm={() => onDelete?.(rowIds)}
      />
    </div>
  )
}
