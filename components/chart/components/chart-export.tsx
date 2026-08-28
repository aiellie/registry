"use client"

import * as React from "react"
import {
  Copy01Icon,
  CsvIcon,
  Download01Icon,
  Image01Icon,
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

import type { ChartPoint, ChartSeries } from "../data/schema"

interface ChartExportProps {
  /** The `ChartContainer` wrapper; the Recharts surface is found inside it. */
  chartRef: React.RefObject<HTMLDivElement | null>
  data: ChartPoint[]
  series: ChartSeries[]
  /** Base name for the downloaded files, without an extension. */
  filename?: string
  className?: string
}

/* Recharts styles its ticks and grid through CSS classes, which a detached
 * clone no longer matches — so every painted property is copied across from
 * the live node before the SVG leaves the page. */
const PAINTED = [
  "fill",
  "fill-opacity",
  "stroke",
  "stroke-width",
  "stroke-opacity",
  "stroke-dasharray",
  "stroke-linecap",
  "opacity",
  "font-family",
  "font-size",
  "font-weight",
  "text-anchor",
  "dominant-baseline",
] as const

function inlinePaint(source: Element, clone: Element) {
  const computed = window.getComputedStyle(source)
  const declarations = PAINTED.map(
    (property) => `${property}:${computed.getPropertyValue(property)}`
  ).join(";")
  clone.setAttribute("style", declarations)

  const sourceChildren = source.children
  const cloneChildren = clone.children
  for (let index = 0; index < sourceChildren.length; index++) {
    inlinePaint(sourceChildren[index], cloneChildren[index])
  }
}

function serializeChart(container: HTMLDivElement | null) {
  const source = container?.querySelector("svg.recharts-surface")
  if (!source) return null

  const clone = source.cloneNode(true) as SVGSVGElement
  inlinePaint(source, clone)
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg")

  const { width, height } = source.getBoundingClientRect()
  clone.setAttribute("width", String(Math.round(width)))
  clone.setAttribute("height", String(Math.round(height)))

  return {
    markup: new XMLSerializer().serializeToString(clone),
    width: Math.round(width),
    height: Math.round(height),
  }
}

function save(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function toCsv(data: ChartPoint[], series: ChartSeries[]) {
  const header = ["date", ...series.map((item) => item.label)].join(",")
  const rows = data.map((point) =>
    [point.date, ...series.map((item) => point[item.key] ?? "")].join(",")
  )
  return [header, ...rows].join("\n")
}

/** SVG, PNG and CSV of exactly what is on screen — visible series only. */
export function ChartExport({
  chartRef,
  data,
  series,
  filename = "chart",
  className,
}: ChartExportProps) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(timer)
  }, [copied])

  const downloadSvg = () => {
    const chart = serializeChart(chartRef.current)
    if (!chart) return
    save(
      new Blob([chart.markup], { type: "image/svg+xml;charset=utf-8" }),
      `${filename}.svg`
    )
  }

  const downloadPng = () => {
    const chart = serializeChart(chartRef.current)
    if (!chart) return

    const scale = Math.min(window.devicePixelRatio || 1, 2)
    const canvas = document.createElement("canvas")
    canvas.width = chart.width * scale
    canvas.height = chart.height * scale
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // The surface itself is transparent; PNG has no page behind it, so the
    // card's own background is painted in first.
    ctx.fillStyle = window.getComputedStyle(document.body).backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.scale(scale, scale)

    const url = URL.createObjectURL(
      new Blob([chart.markup], { type: "image/svg+xml;charset=utf-8" })
    )
    const image = new Image()
    image.onload = () => {
      ctx.drawImage(image, 0, 0, chart.width, chart.height)
      URL.revokeObjectURL(url)
      canvas.toBlob((blob) => {
        if (blob) save(blob, `${filename}.png`)
      })
    }
    image.onerror = () => URL.revokeObjectURL(url)
    image.src = url
  }

  const downloadCsv = () => {
    save(
      new Blob([toCsv(data, series)], { type: "text/csv;charset=utf-8" }),
      `${filename}.csv`
    )
  }

  const copyCsv = () => {
    // Only confirm once the write lands — a blocked clipboard should not
    // leave the menu claiming it copied.
    navigator.clipboard
      .writeText(toCsv(data, series))
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
                    aria-label="Export chart"
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
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Export</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={downloadPng}>
          <HugeiconsIcon icon={Image01Icon} strokeWidth={2} />
          PNG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={downloadSvg}>
          <HugeiconsIcon icon={Download01Icon} strokeWidth={2} />
          SVG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={downloadCsv}>
          <HugeiconsIcon icon={CsvIcon} strokeWidth={2} />
          CSV
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyCsv}>
          <HugeiconsIcon
            icon={copied ? Tick02Icon : Copy01Icon}
            strokeWidth={2}
          />
          {copied ? "Copied" : "Copy data"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
