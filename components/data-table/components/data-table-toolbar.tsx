"use client"

import { type Table } from "@tanstack/react-table"
import { FilterRemoveIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import type { FacetOption } from "../data/data"
import type { AddField, TableSettings } from "../data/schema"
import { DataTableAddDialog } from "./data-table-add-dialog"
import { DataTableExport } from "./data-table-export"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { DataTableGlobalFilter } from "./data-table-global-filter"
import { DataTableSettings } from "./data-table-settings"
import { DataTableViewOptions } from "./data-table-view-options"

export interface DataTableFacet {
  columnId: string
  title: string
  /** Its own trigger icon, so no two chips look alike. */
  icon?: IconSvgElement
  options: FacetOption[]
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  facets?: DataTableFacet[]
  settings: TableSettings
  onSettingsChange: (patch: Partial<TableSettings>) => void
  /** Omit to drop the Add button entirely. */
  addFields?: AddField[]
  addDefaults?: () => Record<string, unknown>
  onAdd?: (row: Record<string, unknown>) => void
  searchPlaceholder?: string
  className?: string
}

export function DataTableToolbar<TData>({
  table,
  globalFilter,
  onGlobalFilterChange,
  facets = [],
  settings,
  onSettingsChange,
  addFields,
  addDefaults,
  onAdd,
  searchPlaceholder,
  className,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getState().columnFilters.length > 0 || globalFilter.length > 0

  const reset = () => {
    table.resetColumnFilters()
    onGlobalFilterChange("")
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-2",
        className
      )}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <DataTableGlobalFilter
          value={globalFilter}
          onValueChange={onGlobalFilterChange}
          placeholder={searchPlaceholder}
        />
        {facets.map((facet) =>
          table.getColumn(facet.columnId) ? (
            <DataTableFacetedFilter
              key={facet.columnId}
              column={table.getColumn(facet.columnId)}
              title={facet.title}
              icon={facet.icon}
              options={facet.options}
            />
          ) : null
        )}
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
      </div>
      <div className="flex items-center gap-2">
        <DataTableViewOptions table={table} />
        <DataTableSettings
          settings={settings}
          onSettingsChange={onSettingsChange}
        />
        <DataTableExport table={table} />
        {addFields && onAdd && (
          <DataTableAddDialog
            fields={addFields}
            defaults={addDefaults}
            onAdd={onAdd}
          />
        )}
      </div>
    </div>
  )
}
