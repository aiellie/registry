import {
  ChartAreaIcon,
  ChartColumnIcon,
  ChartLineIcon,
  ChartRadarIcon,
  DonutIcon,
  PieChartIcon,
  RadialIcon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

import type {
  ChartOptions,
  ChartRange,
  ChartSeries,
  ChartType,
  CurveType,
} from "./schema"

export const chartTypes: {
  value: ChartType
  label: string
  icon: IconSvgElement
}[] = [
  { value: "area", label: "Area", icon: ChartAreaIcon },
  { value: "bar", label: "Bar", icon: ChartColumnIcon },
  { value: "line", label: "Line", icon: ChartLineIcon },
  { value: "pie", label: "Pie", icon: PieChartIcon },
  { value: "donut", label: "Donut", icon: DonutIcon },
  { value: "radar", label: "Radar", icon: ChartRadarIcon },
  { value: "radial", label: "Radial", icon: RadialIcon },
]

export const curveTypes: { value: CurveType; label: string }[] = [
  { value: "natural", label: "Natural" },
  { value: "monotone", label: "Monotone" },
  { value: "linear", label: "Linear" },
  { value: "step", label: "Step" },
]

export const ranges: { value: ChartRange; label: string; days: number }[] = [
  { value: "7d", label: "Last 7 days", days: 7 },
  { value: "30d", label: "Last 30 days", days: 30 },
  { value: "90d", label: "Last 3 months", days: 90 },
]

/**
 * Named ramps for the colors dropdown. `theme` is held as `var()` references
 * rather than literals so it follows light/dark — and a consumer's retheme —
 * with no second list to keep in sync; the rest are fixed ramps you would
 * reach for when a chart needs to sit outside the theme.
 */
export const palettes: { name: string; colors: string[] }[] = [
  {
    name: "Theme",
    colors: [
      "var(--chart-1)",
      "var(--chart-2)",
      "var(--chart-3)",
      "var(--chart-4)",
      "var(--chart-5)",
    ],
  },
  {
    name: "Ocean",
    colors: ["#0ea5e9", "#2563eb", "#7c3aed", "#0891b2", "#4f46e5"],
  },
  {
    name: "Ember",
    colors: ["#f97316", "#e11d48", "#f59e0b", "#dc2626", "#c026d3"],
  },
  {
    name: "Forest",
    colors: ["#059669", "#65a30d", "#0d9488", "#16a34a", "#4d7c0f"],
  },
  {
    name: "Mono",
    colors: ["#171717", "#525252", "#a3a3a3", "#737373", "#d4d4d4"],
  },
]

export const defaultSeries: ChartSeries[] = [
  {
    key: "desktop",
    label: "Desktop",
    color: "var(--chart-1)",
    visible: true,
  },
  { key: "mobile", label: "Mobile", color: "var(--chart-2)", visible: true },
  { key: "tablet", label: "Tablet", color: "var(--chart-3)", visible: true },
]

export const defaultOptions: ChartOptions = {
  type: "area",
  range: "30d",
  curve: "natural",
  stacked: true,
  showGrid: true,
  showLegend: true,
  showTooltip: true,
  showXAxis: true,
  showYAxis: false,
  showDots: false,
  fillOpacity: 40,
  strokeWidth: 2,
  barRadius: 4,
  innerRadius: 55,
}

/** Chart families, since most settings only make sense for one of them. */
const cartesian: ChartType[] = ["area", "bar", "line"]
const circular: ChartType[] = ["pie", "donut", "radial"]

export const isCartesian = (type: ChartType) => cartesian.includes(type)
export const isCircular = (type: ChartType) => circular.includes(type)

/** Which of the settings the chart actually reads, given its type. */
export function supports(type: ChartType) {
  return {
    axes: isCartesian(type),
    grid: isCartesian(type) || type === "radar",
    curve: type === "area" || type === "line",
    dots: type === "area" || type === "line",
    stacked: type === "area" || type === "bar",
    fill: type !== "line",
    stroke: type === "area" || type === "line" || type === "radar",
    /** Bars and radial rings both round their ends by this. */
    barRadius: type === "bar" || type === "radial",
    innerRadius: type === "donut" || type === "radial",
    /** Circular charts collapse every series into a single total. */
    aggregated: isCircular(type),
  }
}
