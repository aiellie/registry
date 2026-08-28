"use client"

import { type Table } from "@tanstack/react-table"
import {
  ArrowLeft01Icon,
  ArrowLeftDoubleIcon,
  ArrowRight01Icon,
  ArrowRightDoubleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import { formatPageSize, pageSizes } from "../data/config"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  className?: string
}

export function DataTablePagination<TData>({
  table,
  className,
}: DataTablePaginationProps<TData>) {
  const { pageIndex } = table.getState().pagination
  const pageCount = table.getPageCount()
  const selected = table.getFilteredSelectedRowModel().rows.length
  const filtered = table.getFilteredRowModel().rows.length

  const steps = [
    {
      label: "First page",
      icon: ArrowLeftDoubleIcon,
      onClick: () => table.setPageIndex(0),
      disabled: !table.getCanPreviousPage(),
      hideOnMobile: true,
    },
    {
      label: "Previous page",
      icon: ArrowLeft01Icon,
      onClick: () => table.previousPage(),
      disabled: !table.getCanPreviousPage(),
      hideOnMobile: false,
    },
    {
      label: "Next page",
      icon: ArrowRight01Icon,
      onClick: () => table.nextPage(),
      disabled: !table.getCanNextPage(),
      hideOnMobile: false,
    },
    {
      label: "Last page",
      icon: ArrowRightDoubleIcon,
      onClick: () => table.setPageIndex(pageCount - 1),
      disabled: !table.getCanNextPage(),
      hideOnMobile: true,
    },
  ]

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 px-2",
        className
      )}
    >
      <div className="flex-1 text-sm whitespace-nowrap text-muted-foreground tabular-nums">
        {selected > 0
          ? `${selected} of ${filtered} row(s) selected.`
          : `${filtered} row(s).`}
      </div>
      <div className="flex items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-2">
          <p className="hidden text-sm font-medium sm:block">Rows per page</p>
          <Select
            items={pageSizes.map((size) => ({
              value: `${size}`,
              label: formatPageSize(size),
            }))}
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger
              size="sm"
              aria-label="Rows per page"
              className="w-18"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end" alignItemWithTrigger={false}>
              <SelectGroup>
                {pageSizes.map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {formatPageSize(size)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm font-medium whitespace-nowrap tabular-nums">
          Page {Math.min(pageIndex + 1, Math.max(pageCount, 1))} of{" "}
          {Math.max(pageCount, 1)}
        </div>
        <TooltipProvider delay={300}>
          <div className="flex items-center gap-1">
            {steps.map((step) => (
              <Tooltip key={step.label}>
                <TooltipTrigger
                  render={
                    <Button
                      variant="outline"
                      size="icon-sm"
                      aria-label={step.label}
                      onClick={step.onClick}
                      disabled={step.disabled}
                      className={cn(step.hideOnMobile && "hidden lg:flex")}
                    >
                      {/* The double chevrons point along the reading
                          direction, so they flip with the document. */}
                      <HugeiconsIcon
                        icon={step.icon}
                        strokeWidth={2}
                        className="size-3.5 rtl:rotate-180"
                      />
                    </Button>
                  }
                />
                <TooltipContent>{step.label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </div>
    </div>
  )
}
