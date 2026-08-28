"use client"

import * as React from "react"
import { RefreshIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import type {
  ChartOptions,
  ChartPoint,
  ChartRange,
  ChartSeries,
  ChartType,
} from "../data/schema"
import { ChartColors } from "./chart-colors"
import { ChartExport } from "./chart-export"
import { ChartRangeSelect } from "./chart-range"
import { ChartSeriesMenu } from "./chart-series"
import { ChartSettings } from "./chart-settings"
import { ChartTypeSelector } from "./chart-type"

interface ChartToolbarProps {
  options: ChartOptions
  onOptionsChange: (patch: Partial<ChartOptions>) => void
  series: ChartSeries[]
  onColorChange: (key: string, color: string) => void
  onPaletteChange: (colors: string[]) => void
  onVisibilityChange: (key: string, visible: boolean) => void
  /** Rows currently drawn — the export writes exactly what is on screen. */
  data: ChartPoint[]
  chartRef: React.RefObject<HTMLDivElement | null>
  /** Shown only once something has been changed away from the defaults. */
  onReset?: () => void
  isDirty?: boolean
  className?: string
}

export function ChartToolbar({
  options,
  onOptionsChange,
  series,
  onColorChange,
  onPaletteChange,
  onVisibilityChange,
  data,
  chartRef,
  onReset,
  isDirty = false,
  className,
}: ChartToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-2",
        className
      )}
    >
      <ChartTypeSelector
        value={options.type}
        onValueChange={(type: ChartType) => onOptionsChange({ type })}
      />
      <div className="flex flex-wrap items-center gap-2">
        {onReset && isDirty && (
          <TooltipProvider delay={300}>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Reset chart settings"
                    onClick={onReset}
                  >
                    <HugeiconsIcon
                      icon={RefreshIcon}
                      strokeWidth={2}
                      className="size-3.5"
                    />
                  </Button>
                }
              />
              <TooltipContent>Reset</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <ChartRangeSelect
          value={options.range}
          onValueChange={(range: ChartRange) => onOptionsChange({ range })}
        />
        <ChartSeriesMenu
          series={series}
          onVisibilityChange={onVisibilityChange}
        />
        <ChartColors
          series={series}
          onColorChange={onColorChange}
          onPaletteChange={onPaletteChange}
        />
        <ChartSettings options={options} onOptionsChange={onOptionsChange} />
        <ChartExport
          chartRef={chartRef}
          data={data}
          series={series.filter((item) => item.visible)}
        />
      </div>
    </div>
  )
}
