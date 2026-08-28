"use client"

import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

import { defaultOptions, defaultSeries, ranges } from "../data/config"
import type { ChartOptions, ChartPoint, ChartSeries } from "../data/schema"
import { ChartRender } from "./chart-render"
import { ChartSummary } from "./chart-summary"
import { ChartToolbar } from "./chart-toolbar"

interface ChartBuilderProps {
  data: ChartPoint[]
  series?: ChartSeries[]
  /** Overrides on top of the shipped defaults; also what Reset returns to. */
  options?: Partial<ChartOptions>
  title?: string
  description?: string
  /** Hides the per-series totals above the chart. */
  hideSummary?: boolean
  className?: string
}

/**
 * The whole pattern: a chart plus the toolbar that drives it — type, range,
 * visible series, colors, and how it is drawn. State lives here so every
 * control stays a plain presentational component you can lift out on its own.
 */
export function ChartBuilder({
  data,
  series: initialSeries = defaultSeries,
  options: initialOptions,
  title = "Visitors",
  description = "Site traffic by device",
  hideSummary = false,
  className,
}: ChartBuilderProps) {
  const baseOptions = React.useMemo(
    () => ({ ...defaultOptions, ...initialOptions }),
    [initialOptions]
  )

  const [options, setOptions] = React.useState<ChartOptions>(baseOptions)
  const [series, setSeries] = React.useState<ChartSeries[]>(initialSeries)
  const chartRef = React.useRef<HTMLDivElement>(null)

  const updateOptions = React.useCallback((patch: Partial<ChartOptions>) => {
    setOptions((prev) => ({ ...prev, ...patch }))
  }, [])

  const updateColor = React.useCallback((key: string, color: string) => {
    setSeries((prev) =>
      prev.map((item) => (item.key === key ? { ...item, color } : item))
    )
  }, [])

  const applyPalette = React.useCallback((colors: string[]) => {
    setSeries((prev) =>
      prev.map((item, index) => ({
        ...item,
        color: colors[index % colors.length],
      }))
    )
  }, [])

  const updateVisibility = React.useCallback(
    (key: string, visible: boolean) => {
      setSeries((prev) => {
        const next = prev.map((item) =>
          item.key === key ? { ...item, visible } : item
        )
        // Never let the last series be switched off — the chart would have
        // nothing left to draw and the toggle back is easy to miss.
        return next.some((item) => item.visible) ? next : prev
      })
    },
    []
  )

  const reset = React.useCallback(() => {
    setOptions(baseOptions)
    setSeries(initialSeries)
  }, [baseOptions, initialSeries])

  const isDirty =
    JSON.stringify(options) !== JSON.stringify(baseOptions) ||
    JSON.stringify(series) !== JSON.stringify(initialSeries)

  /** Every range is a slice of the tail of the same dataset. */
  const visibleData = React.useMemo(() => {
    const days = ranges.find((range) => range.value === options.range)?.days
    return days ? data.slice(-days) : data
  }, [data, options.range])

  return (
    <Card className={cn("w-full gap-4", className)}>
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <ChartToolbar
          options={options}
          onOptionsChange={updateOptions}
          series={series}
          onColorChange={updateColor}
          onPaletteChange={applyPalette}
          onVisibilityChange={updateVisibility}
          data={visibleData}
          chartRef={chartRef}
          onReset={reset}
          isDirty={isDirty}
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {!hideSummary && (
          <ChartSummary
            data={visibleData}
            series={series}
            onVisibilityChange={updateVisibility}
          />
        )}
        <ChartRender
          ref={chartRef}
          data={visibleData}
          series={series}
          options={options}
        />
      </CardContent>
    </Card>
  )
}
