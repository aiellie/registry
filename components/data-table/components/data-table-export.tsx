"use client"

import * as React from "react"
import { type Table } from "@tanstack/react-table"
import {
  Copy01Icon,
  CsvIcon,
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

interface DataTableExportProps<TData> {
  table: Table<TData>
  /** Base name for the downloaded files, without an extension. */
  filename?: string
  className?: string
}

/** A comma or a quote in a value would otherwise split or truncate the cell. */
function csvCell(value: unknown) {
  const text = value == null ? "" : String(value)
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

function save(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function DataTableExport<TData>({
  table,
  filename = "tasks",
  className,
}: DataTableExportProps<TData>) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(timer)
  }, [copied])

  /* Selection first, filtered rows otherwise — and only the columns that are
   * on screen, so the file matches what you were looking at. */
  const selected = table.getFilteredSelectedRowModel().rows
  const rows = selected.length ? selected : table.getFilteredRowModel().rows
  const columns = table
    .getVisibleLeafColumns()
    .filter((column) => column.accessorFn !== undefined)

  const scope = selected.length
    ? `${selected.length} selected`
    : `${rows.length} rows`

  const toRecords = () =>
    rows.map((row) =>
      Object.fromEntries(
        columns.map((column) => [column.id, row.getValue(column.id)])
      )
    )

  const toCsv = () => {
    const header = columns
      .map((column) => csvCell(column.columnDef.meta?.label ?? column.id))
      .join(",")
    const body = rows.map((row) =>
      columns.map((column) => csvCell(row.getValue(column.id))).join(",")
    )
    return [header, ...body].join("\n")
  }

  const copyCsv = () => {
    // Only confirm once the write lands — a blocked clipboard should not
    // leave the menu claiming it copied.
    navigator.clipboard
      .writeText(toCsv())
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
                    aria-label="Export rows"
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
          <DropdownMenuLabel>Export {scope}</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={rows.length === 0}
          onClick={() =>
            save(
              new Blob([toCsv()], { type: "text/csv;charset=utf-8" }),
              `${filename}.csv`
            )
          }
        >
          <HugeiconsIcon icon={CsvIcon} strokeWidth={2} />
          CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={rows.length === 0}
          onClick={() =>
            save(
              new Blob([JSON.stringify(toRecords(), null, 2)], {
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
        <DropdownMenuItem disabled={rows.length === 0} onClick={copyCsv}>
          <HugeiconsIcon
            icon={copied ? Tick02Icon : Copy01Icon}
            strokeWidth={2}
          />
          {copied ? "Copied" : "Copy as CSV"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
