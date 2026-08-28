"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

import { defaultSettings, densityClasses } from "../data/config"
import type { AddField, TableSettings } from "../data/schema"
import { DataTableBulkActions, type BulkField } from "./data-table-bulk-actions"
import { DataTableEmpty } from "./data-table-empty"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableSummary } from "./data-table-summary"
import { DataTableToolbar, type DataTableFacet } from "./data-table-toolbar"

interface DataTableProps<TData extends object, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  /** Faceted filter chips in the toolbar, in the order given. */
  facets?: DataTableFacet[]
  /** Fields the selection bar can rewrite in bulk. */
  bulkFields?: BulkField[]
  /** Describes the Add dialog's form; omit to drop the button. */
  addFields?: AddField[]
  /** Values the Add form does not ask for, resolved at submit time. */
  addDefaults?: () => Record<string, unknown>
  /** Stable row identity, so a selection survives a sort, drag or delete. */
  getRowId?: (row: TData, index: number) => string
  /** Overrides on top of the shipped defaults. */
  settings?: Partial<TableSettings>
  searchPlaceholder?: string
  className?: string
}

export function DataTable<TData extends object, TValue>({
  columns,
  data,
  facets,
  bulkFields,
  addFields,
  addDefaults,
  getRowId,
  settings: initialSettings,
  searchPlaceholder,
  className,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({ label: false })
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [settings, setSettings] = React.useState<TableSettings>({
    ...defaultSettings,
    ...initialSettings,
  })

  // Held locally so the row actions, the Add dialog and the drag handle
  // actually change something; a server-backed table would go upstream.
  const [rows, setRows] = React.useState(data)
  React.useEffect(() => setRows(data), [data])

  /* Reordering is only honest while the rows are in data order — a sort would
   * put the dragged row straight back where it came from. */
  const canReorder = sorting.length === 0
  const [armedId, setArmedId] = React.useState<string | null>(null)
  const [draggingId, setDraggingId] = React.useState<string | null>(null)
  const [overId, setOverId] = React.useState<string | null>(null)

  const identify = React.useCallback(
    (row: TData, index: number) => getRowId?.(row, index) ?? `${index}`,
    [getRowId]
  )

  const updateSettings = React.useCallback(
    (patch: Partial<TableSettings>) =>
      setSettings((prev) => ({ ...prev, ...patch })),
    []
  )

  const moveRow = React.useCallback(
    (fromId: string, toId: string) => {
      setRows((prev) => {
        const ids = prev.map(identify)
        const from = ids.indexOf(fromId)
        const to = ids.indexOf(toId)
        if (from < 0 || to < 0 || from === to) return prev
        const next = [...prev]
        const [moved] = next.splice(from, 1)
        next.splice(to, 0, moved)
        return next
      })
    },
    [identify]
  )

  const table = useReactTable({
    data: rows,
    columns,
    getRowId,
    state: {
      sorting,
      // These two are driven by settings rather than by the column menu, so
      // they are merged in rather than stored.
      columnVisibility: {
        ...columnVisibility,
        "row-number": settings.rowNumbers,
        drag: settings.dragHandle,
      },
      rowSelection,
      columnFilters,
      globalFilter,
    },
    initialState: { pagination: { pageSize: 10 } },
    enableRowSelection: true,
    globalFilterFn: "includesString",
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    meta: {
      truncate: settings.truncate,
      reorderEnabled: canReorder,
      armDrag: setArmedId,
      deleteRows: (rowIds) => {
        const ids = new Set(rowIds)
        setRows((prev) => prev.filter((row, i) => !ids.has(identify(row, i))))
        setRowSelection({})
      },
      updateRows: (rowIds, key, value) => {
        const ids = new Set(rowIds)
        setRows((prev) =>
          prev.map((row, i) =>
            ids.has(identify(row, i)) ? { ...row, [key]: value } : row
          )
        )
      },
    },
  })

  const isFiltered = columnFilters.length > 0 || globalFilter.length > 0
  const pageRows = table.getRowModel().rows
  const visibleColumnCount = table.getVisibleLeafColumns().length

  const resetFilters = () => {
    table.resetColumnFilters()
    setGlobalFilter("")
  }

  const addRow = (row: Record<string, unknown>) => {
    setRows((prev) => [row as TData, ...prev])
    // A new row at the top is only visible from the first page, and only if
    // the filters would let it through.
    table.setPageIndex(0)
    resetFilters()
  }

  const endDrag = () => {
    setDraggingId(null)
    setOverId(null)
    setArmedId(null)
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <DataTableToolbar
        table={table}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        facets={facets}
        settings={settings}
        onSettingsChange={updateSettings}
        addFields={addFields}
        addDefaults={addDefaults}
        onAdd={addFields ? addRow : undefined}
        searchPlaceholder={searchPlaceholder}
      />
      {settings.showSummary && <DataTableSummary table={table} />}
      <DataTableBulkActions
        table={table}
        fields={bulkFields}
        onDelete={(rowIds) => table.options.meta?.deleteRows?.(rowIds)}
        onFieldChange={(rowIds, key, value) =>
          table.options.meta?.updateRows?.(rowIds, key, value)
        }
      />
      <div
        data-density={settings.density}
        className={cn(
          "overflow-hidden rounded-md border bg-background",
          densityClasses[settings.density],
          settings.striped &&
            "[&_tbody_tr:nth-child(even)]:bg-muted/30 [&_tbody_tr:nth-child(even)]:data-[state=selected]:bg-muted",
          settings.gridLines &&
            "[&_td:not(:last-child)]:border-e [&_th:not(:last-child)]:border-e",
          // The header can only stick to a box that scrolls, so the height
          // cap and the sticky row are switched on together.
          settings.stickyHeader &&
            "[&>[data-slot=table-container]]:max-h-[26rem]"
        )}
      >
        <Table>
          <TableHeader
            className={cn(
              settings.stickyHeader && "sticky top-0 z-20 bg-background"
            )}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      header.column.columnDef.meta?.align === "end" &&
                        "text-end"
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {pageRows.length ? (
              pageRows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  // Only the row the grip armed is draggable, so selecting
                  // text in a cell never turns into a drag.
                  draggable={armedId === row.id}
                  onDragStart={(event) => {
                    setDraggingId(row.id)
                    event.dataTransfer.effectAllowed = "move"
                    // Firefox ignores a drag that carries no payload.
                    event.dataTransfer.setData("text/plain", row.id)
                  }}
                  onDragOver={(event) => {
                    if (!draggingId || draggingId === row.id) return
                    event.preventDefault()
                    event.dataTransfer.dropEffect = "move"
                    setOverId(row.id)
                  }}
                  onDrop={(event) => {
                    event.preventDefault()
                    if (draggingId) moveRow(draggingId, row.id)
                    endDrag()
                  }}
                  onDragEnd={endDrag}
                  className={cn(
                    draggingId === row.id && "opacity-40",
                    overId === row.id &&
                      draggingId !== row.id &&
                      "outline-2 -outline-offset-2 outline-primary"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={visibleColumnCount} className="p-0">
                  <DataTableEmpty
                    isFiltered={isFiltered}
                    onReset={resetFilters}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {settings.showPagination && <DataTablePagination table={table} />}
    </div>
  )
}
