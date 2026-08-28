import { z } from "zod"

// We're keeping a simple flat shape here: one row per day, one numeric column
// per series. IRL, you will have a schema for your data models.
export const chartPointSchema = z
  .object({ date: z.string() })
  .catchall(z.union([z.number(), z.string()]))

export type ChartPoint = { date: string } & Record<string, number | string>

export const chartTypeSchema = z.enum([
  "area",
  "bar",
  "line",
  "pie",
  "donut",
  "radar",
  "radial",
])

export type ChartType = z.infer<typeof chartTypeSchema>

export const curveTypeSchema = z.enum(["natural", "monotone", "linear", "step"])

export type CurveType = z.infer<typeof curveTypeSchema>

export const chartRangeSchema = z.enum(["7d", "30d", "90d"])

export type ChartRange = z.infer<typeof chartRangeSchema>

export const chartSeriesSchema = z.object({
  /** The column this series reads out of each `ChartPoint`. */
  key: z.string(),
  label: z.string(),
  /** Any CSS color; a `var(--token)` reference follows light/dark. */
  color: z.string(),
  visible: z.boolean(),
})

export type ChartSeries = z.infer<typeof chartSeriesSchema>

export const chartOptionsSchema = z.object({
  type: chartTypeSchema,
  range: chartRangeSchema,
  curve: curveTypeSchema,
  stacked: z.boolean(),
  showGrid: z.boolean(),
  showLegend: z.boolean(),
  showTooltip: z.boolean(),
  showXAxis: z.boolean(),
  showYAxis: z.boolean(),
  showDots: z.boolean(),
  /** Percent, so the slider works in whole numbers. */
  fillOpacity: z.number().min(0).max(100),
  strokeWidth: z.number().min(1).max(6),
  /** Corner radius on bars, in pixels. */
  barRadius: z.number().min(0).max(16),
  /** Donut hole as a percent of the outer radius. */
  innerRadius: z.number().min(0).max(80),
})

export type ChartOptions = z.infer<typeof chartOptionsSchema>
