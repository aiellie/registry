"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
} from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import {
  ChartAreaIcon,
  ChartBarBigIcon,
  ChartBubble01Icon,
  ChartLineIcon,
  ChartRadarIcon,
  ChartRingIcon,
  PieChartIcon,
} from "@hugeicons/core-free-icons"

type ChartKind =
  | "area"
  | "bar"
  | "line"
  | "pie"
  | "radar"
  | "radial"
  | "tooltips"

const options: {
  value: ChartKind
  label: string
  icon: IconSvgElement
}[] = [
  { value: "area", label: "Area", icon: ChartAreaIcon },
  { value: "bar", label: "Bar", icon: ChartBarBigIcon },
  { value: "line", label: "Line", icon: ChartLineIcon },
  { value: "pie", label: "Pie", icon: PieChartIcon },
  { value: "radar", label: "Radar", icon: ChartRadarIcon },
  { value: "radial", label: "Radial", icon: ChartRingIcon },
  { value: "tooltips", label: "Tooltips", icon: ChartBubble01Icon },
]

const monthlyData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const monthlyConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
} satisfies ChartConfig

const browserData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

const browserConfig = {
  visitors: { label: "Visitors" },
  chrome: { label: "Chrome", color: "var(--chart-1)" },
  safari: { label: "Safari", color: "var(--chart-2)" },
  firefox: { label: "Firefox", color: "var(--chart-3)" },
  edge: { label: "Edge", color: "var(--chart-4)" },
  other: { label: "Other", color: "var(--chart-5)" },
} satisfies ChartConfig

const radarData = [
  { subject: "Speed", desktop: 120, mobile: 110 },
  { subject: "Quality", desktop: 98, mobile: 130 },
  { subject: "Reach", desktop: 86, mobile: 130 },
  { subject: "Cost", desktop: 99, mobile: 100 },
  { subject: "Support", desktop: 85, mobile: 90 },
  { subject: "Design", desktop: 65, mobile: 85 },
]

const descriptions: Record<ChartKind, string> = {
  area: "Cumulative visitors by device over the last 6 months.",
  bar: "Visitors by device over the last 6 months.",
  line: "Visitor trend by device over the last 6 months.",
  pie: "Visitor share by browser.",
  radar: "Performance comparison across key dimensions.",
  radial: "Visitor share by browser as radial segments.",
  tooltips: "Hover the chart to preview the styled tooltip.",
}

function ChartByKind({ kind }: { kind: ChartKind }) {
  switch (kind) {
    case "area":
      return (
        <ChartContainer config={monthlyConfig} className="max-h-72 w-full">
          <AreaChart
            accessibilityLayer
            data={monthlyData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              dataKey="mobile"
              type="natural"
              fill="var(--color-mobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      )
    case "bar":
      return (
        <ChartContainer config={monthlyConfig} className="max-h-72 w-full">
          <BarChart accessibilityLayer data={monthlyData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      )
    case "line":
      return (
        <ChartContainer config={monthlyConfig} className="max-h-72 w-full">
          <LineChart
            accessibilityLayer
            data={monthlyData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              dataKey="desktop"
              type="monotone"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="mobile"
              type="monotone"
              stroke="var(--color-mobile)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      )
    case "pie":
      return (
        <ChartContainer
          config={browserConfig}
          className="mx-auto aspect-square max-h-72"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="browser" />}
            />
            <Pie
              data={browserData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={48}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="browser" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      )
    case "radar":
      return (
        <ChartContainer
          config={monthlyConfig}
          className="mx-auto aspect-square max-h-72"
        >
          <RadarChart data={radarData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <Radar
              dataKey="desktop"
              fill="var(--color-desktop)"
              fillOpacity={0.5}
              stroke="var(--color-desktop)"
            />
            <Radar
              dataKey="mobile"
              fill="var(--color-mobile)"
              fillOpacity={0.3}
              stroke="var(--color-mobile)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </RadarChart>
        </ChartContainer>
      )
    case "radial":
      return (
        <ChartContainer
          config={browserConfig}
          className="mx-auto aspect-square max-h-72"
        >
          <RadialBarChart
            data={browserData}
            innerRadius={30}
            outerRadius={110}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="browser" />}
            />
            <RadialBar dataKey="visitors" background cornerRadius={6}>
              {browserData.map((entry) => (
                <Cell key={entry.browser} fill={entry.fill} />
              ))}
            </RadialBar>
            <ChartLegend
              content={<ChartLegendContent nameKey="browser" />}
              className="flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </RadialBarChart>
        </ChartContainer>
      )
    case "tooltips":
      return (
        <ChartContainer config={monthlyConfig} className="max-h-72 w-full">
          <BarChart accessibilityLayer data={monthlyData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <ChartTooltip
              defaultIndex={2}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(value) => `Month: ${value}`}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="desktop"
              stackId="a"
              fill="var(--color-desktop)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="mobile"
              stackId="a"
              fill="var(--color-mobile)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      )
  }
}

export default function ChartSwitcher() {
  const [kind, setKind] = React.useState<ChartKind>("area")
  const active = options.find((option) => option.value === kind)

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>{active?.label} chart</CardTitle>
        <CardDescription>{descriptions[kind]}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ToggleGroup
          variant="outline"
          size="sm"
          className="flex-wrap"
          value={[kind]}
          onValueChange={(value) => {
            const [next] = value
            if (next) setKind(next as ChartKind)
          }}
        >
          {options.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              aria-label={option.label}
            >
              <HugeiconsIcon icon={option.icon} strokeWidth={2} />
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <ChartByKind kind={kind} />
      </CardContent>
    </Card>
  )
}
