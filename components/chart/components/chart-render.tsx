"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

import { isCircular } from "../data/config"
import type { ChartOptions, ChartPoint, ChartSeries } from "../data/schema"

interface ChartRenderProps {
  data: ChartPoint[]
  /** All series; the hidden ones keep their color slot but are not drawn. */
  series: ChartSeries[]
  options: ChartOptions
  className?: string
  ref?: React.Ref<HTMLDivElement>
}

/** How many spokes a radar gets, however long the range is. */
const RADAR_BUCKETS = 6

/** `new Date("2024-04-01")` is parsed as UTC, which reads a day early west of
 * Greenwich; the parts are split by hand so every label is the stored day. */
function parseDay(value: string) {
  const [year, month, day] = value.split("-").map(Number)
  return new Date(year, (month ?? 1) - 1, day ?? 1)
}

const shortDate = (value: string) =>
  parseDay(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })

const longDate = (value: string) =>
  parseDay(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

const readValue = (point: ChartPoint, key: string) => {
  const value = point[key]
  return typeof value === "number" ? value : 0
}

export function ChartRender({
  data,
  series,
  options,
  className,
  ref,
}: ChartRenderProps) {
  const visible = React.useMemo(
    () => series.filter((item) => item.visible),
    [series]
  )

  const config = React.useMemo(
    () =>
      series.reduce<ChartConfig>((acc, item) => {
        acc[item.key] = { label: item.label, color: item.color }
        return acc
      }, {}),
    [series]
  )

  /** Circular charts collapse the range into one number per series. */
  const totals = React.useMemo(
    () =>
      visible.map((item) => ({
        key: item.key,
        value: data.reduce((sum, point) => sum + readValue(point, item.key), 0),
        fill: `var(--color-${item.key})`,
      })),
    [data, visible]
  )

  /** Radar averages the range into a fixed number of spokes. */
  const buckets = React.useMemo(() => {
    if (data.length === 0) return []
    const size = Math.ceil(data.length / RADAR_BUCKETS)
    const groups: ChartPoint[][] = []
    for (let index = 0; index < data.length; index += size) {
      groups.push(data.slice(index, index + size))
    }
    return groups.map((group) => {
      const row: Record<string, number | string> = {
        bucket: shortDate(group[0].date),
      }
      for (const item of visible) {
        row[item.key] = Math.round(
          group.reduce((sum, point) => sum + readValue(point, item.key), 0) /
            group.length
        )
      }
      return row
    })
  }, [data, visible])

  const grandTotal = totals.reduce((sum, item) => sum + item.value, 0)
  const stackId = options.stacked ? "stack" : undefined
  const fillOpacity = options.fillOpacity / 100

  const tooltip = options.showTooltip ? (
    <ChartTooltip
      cursor={options.type !== "bar"}
      content={
        <ChartTooltipContent
          indicator={options.type === "bar" ? "dashed" : "dot"}
          labelFormatter={(value) => longDate(String(value))}
        />
      }
    />
  ) : null

  const legend = options.showLegend ? (
    <ChartLegend content={<ChartLegendContent />} />
  ) : null

  /* Both axes are always mounted so the scales — and the tooltip label that
   * reads off them — stay put; the switches only hide them. */
  const axes = (
    <>
      {options.showGrid && <CartesianGrid vertical={false} />}
      <XAxis
        dataKey="date"
        hide={!options.showXAxis}
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        minTickGap={24}
        tickFormatter={(value) => shortDate(String(value))}
      />
      <YAxis
        hide={!options.showYAxis}
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        width={44}
      />
      {tooltip}
      {legend}
    </>
  )

  const circularTooltip = options.showTooltip ? (
    <ChartTooltip
      cursor={false}
      content={<ChartTooltipContent nameKey="key" hideLabel />}
    />
  ) : null

  const circularLegend = options.showLegend ? (
    <ChartLegend content={<ChartLegendContent nameKey="key" />} />
  ) : null

  const chart = (() => {
    switch (options.type) {
      case "bar":
        return (
          <BarChart accessibilityLayer data={data}>
            {axes}
            {visible.map((item) => (
              <Bar
                key={item.key}
                dataKey={item.key}
                stackId={stackId}
                fill={`var(--color-${item.key})`}
                fillOpacity={fillOpacity}
                radius={options.barRadius}
              />
            ))}
          </BarChart>
        )

      case "line":
        return (
          <LineChart
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12 }}
          >
            {axes}
            {visible.map((item) => (
              <Line
                key={item.key}
                dataKey={item.key}
                type={options.curve}
                stroke={`var(--color-${item.key})`}
                strokeWidth={options.strokeWidth}
                dot={options.showDots}
              />
            ))}
          </LineChart>
        )

      case "pie":
      case "donut":
        return (
          <PieChart>
            {circularTooltip}
            <Pie
              data={totals}
              dataKey="value"
              nameKey="key"
              strokeWidth={2}
              fillOpacity={fillOpacity}
              innerRadius={
                options.type === "donut" ? `${options.innerRadius}%` : 0
              }
            >
              {options.type === "donut" && (
                <Label
                  content={({ viewBox }) => {
                    if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
                      return null
                    }
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {grandTotal.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 22}
                          className="fill-muted-foreground text-xs"
                        >
                          Total
                        </tspan>
                      </text>
                    )
                  }}
                />
              )}
            </Pie>
            {circularLegend}
          </PieChart>
        )

      case "radial":
        return (
          <RadialBarChart
            data={totals}
            innerRadius={`${Math.max(options.innerRadius, 20)}%`}
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
          >
            {circularTooltip}
            <RadialBar
              dataKey="value"
              background
              cornerRadius={options.barRadius}
              fillOpacity={fillOpacity}
            />
            {circularLegend}
          </RadialBarChart>
        )

      case "radar":
        return (
          /* Pulled in from the default 80% so the spoke labels clear the
             legend at the bottom of the square. */
          <RadarChart data={buckets} outerRadius="70%">
            {options.showTooltip && (
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
            )}
            <PolarAngleAxis dataKey="bucket" />
            {options.showGrid && <PolarGrid />}
            {visible.map((item) => (
              <Radar
                key={item.key}
                dataKey={item.key}
                fill={`var(--color-${item.key})`}
                fillOpacity={fillOpacity}
                stroke={`var(--color-${item.key})`}
                strokeWidth={options.strokeWidth}
              />
            ))}
            {legend}
          </RadarChart>
        )

      case "area":
      default:
        return (
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12 }}
          >
            {axes}
            {visible.map((item) => (
              <Area
                key={item.key}
                dataKey={item.key}
                type={options.curve}
                stackId={stackId}
                fill={`var(--color-${item.key})`}
                fillOpacity={fillOpacity}
                stroke={`var(--color-${item.key})`}
                strokeWidth={options.strokeWidth}
                dot={options.showDots}
              />
            ))}
          </AreaChart>
        )
    }
  })()

  return (
    <ChartContainer
      ref={ref}
      config={config}
      className={cn(
        // A square chart is width-led: capping the height alone would leave
        // it with no width to be square against inside a column.
        isCircular(options.type) || options.type === "radar"
          ? "mx-auto aspect-square w-full max-w-[280px]"
          : "aspect-auto h-[280px] w-full",
        className
      )}
    >
      {chart}
    </ChartContainer>
  )
}
