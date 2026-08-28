"use client"

import { type ColumnDef, type RowData } from "@tanstack/react-table"
import { DragDropVerticalIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Status,
  StatusIndicator,
  StatusLabel,
} from "@/components/aiellie/ui/status"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import { assignees, labels, priorities, statuses } from "../data/data"
import { type Task } from "../data/schema"
import { DataTableAvatar } from "./data-table-avatar"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

/* The type parameters have to match TanStack's own declarations to merge with
   them, even though neither interface below uses one. */
/* eslint-disable @typescript-eslint/no-unused-vars */
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Human name for the view-options and export lists. */
    label?: string
    /** Numbers read better flushed to the end of their column. */
    align?: "start" | "end"
  }

  /** Cells reach the table's own settings and mutations through here rather
   * than through props threaded down every column def. */
  interface TableMeta<TData extends RowData> {
    truncate?: boolean
    deleteRows?: (rowIds: string[]) => void
    updateRows?: (rowIds: string[], key: string, value: string) => void
    /** False while a sort is active — the visual order is not the data order. */
    reorderEnabled?: boolean
    /** Arms the row for dragging; only the grip may start one. */
    armDrag?: (rowId: string | null) => void
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */

/** Facet columns all filter the same way: keep the row if its value is picked. */
const includesValue: ColumnDef<Task>["filterFn"] = (row, id, value) =>
  (value as string[]).includes(row.getValue(id))

const shortDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number)
  return new Date(year, (month ?? 1) - 1, day ?? 1).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    }
  )
}

export const columns: ColumnDef<Task>[] = [
  {
    id: "drag",
    header: () => <span className="sr-only">Reorder</span>,
    cell: ({ row, table }) => {
      const enabled = table.options.meta?.reorderEnabled ?? false
      return (
        <TooltipProvider delay={300}>
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  aria-label={`Reorder ${row.id}`}
                  disabled={!enabled}
                  // Arming on pointerdown keeps the row un-draggable the rest
                  // of the time, so selecting cell text never starts a drag.
                  onPointerDown={() => table.options.meta?.armDrag?.(row.id)}
                  onPointerUp={() => table.options.meta?.armDrag?.(null)}
                  className={cn(
                    "flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors",
                    enabled
                      ? "cursor-grab hover:bg-muted hover:text-foreground active:cursor-grabbing"
                      : "cursor-not-allowed opacity-40"
                  )}
                />
              }
            >
              <HugeiconsIcon
                aria-hidden
                icon={DragDropVerticalIcon}
                strokeWidth={2}
                className="size-4"
              />
            </TooltipTrigger>
            <TooltipContent>
              {enabled ? "Drag to reorder" : "Clear the sort to reorder"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    enableSorting: false,
    enableHiding: false,
    size: 36,
  },
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    // Position on screen, not `row.index` — that one counts into the
    // unfiltered data and would skip numbers as soon as anything is filtered.
    id: "row-number",
    header: () => <span className="ps-1 text-muted-foreground">#</span>,
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination
      const position = table
        .getRowModel()
        .rows.findIndex((pageRow) => pageRow.id === row.id)
      return (
        <span className="ps-1 text-xs text-muted-foreground tabular-nums">
          {pageIndex * pageSize + position + 1}
        </span>
      )
    },
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    accessorKey: "id",
    meta: { label: "Task" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Task" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px] font-mono text-xs">{row.getValue("id")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    meta: { label: "Title" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row, table }) => {
      const label = labels.find((label) => label.value === row.original.label)
      // Read off the wrapper rather than a prop so the setting reaches every
      // cell without threading it through the column defs.
      const truncate = table.options.meta?.truncate ?? true

      return (
        <div className="flex items-center gap-2">
          {label && (
            <Badge variant="outline" className="shrink-0">
              {label.label}
            </Badge>
          )}
          <span
            className={cn(
              "max-w-[300px] font-medium",
              truncate ? "truncate" : "whitespace-normal"
            )}
          >
            {row.getValue("title")}
          </span>
        </div>
      )
    },
    enableSorting: false,
  },
  {
    // Hidden by default — the badge in the Title cell already shows it. It
    // exists so the toolbar has something to filter on.
    accessorKey: "label",
    meta: { label: "Label" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Label" />
    ),
    cell: ({ row }) => {
      const label = labels.find(
        (label) => label.value === row.getValue("label")
      )
      return <span>{label?.label}</span>
    },
    filterFn: includesValue,
  },
  {
    accessorKey: "status",
    meta: { label: "Status" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      )
      if (!status) return null

      return (
        <Status variant={status.variant} pulse={status.pulse}>
          <StatusIndicator />
          <StatusLabel>{status.label}</StatusLabel>
        </Status>
      )
    },
    filterFn: includesValue,
  },
  {
    accessorKey: "priority",
    meta: { label: "Priority" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = priorities.find(
        (priority) => priority.value === row.getValue("priority")
      )
      if (!priority) return null

      return (
        <div className={cn("flex items-center gap-1.5", priority.className)}>
          {priority.icon && (
            <HugeiconsIcon
              icon={priority.icon}
              strokeWidth={2}
              className="size-4 shrink-0"
            />
          )}
          <span className="font-medium">{priority.label}</span>
        </div>
      )
    },
    filterFn: includesValue,
  },
  {
    accessorKey: "assignee",
    meta: { label: "Assignee" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assignee" />
    ),
    cell: ({ row }) => {
      const assignee = assignees.find(
        (person) => person.value === row.getValue("assignee")
      )
      if (!assignee) return null

      return (
        <div className="flex items-center gap-2">
          <DataTableAvatar option={assignee} />
          <span>{assignee.label}</span>
        </div>
      )
    },
    filterFn: includesValue,
  },
  {
    accessorKey: "estimate",
    meta: { label: "Estimate", align: "end" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estimate" align="end" />
    ),
    cell: ({ row }) => (
      <div className="text-end tabular-nums">{row.getValue("estimate")}h</div>
    ),
  },
  {
    accessorKey: "createdAt",
    meta: { label: "Created" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground tabular-nums">
        {shortDate(row.getValue("createdAt"))}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row, table }) => (
      <DataTableRowActions
        row={row}
        onDelete={() => table.options.meta?.deleteRows?.([row.id])}
        onFieldChange={(key, value) =>
          table.options.meta?.updateRows?.([row.id], key, value)
        }
      />
    ),
    enableHiding: false,
  },
]
