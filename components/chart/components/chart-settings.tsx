"use client"

import * as React from "react"
import { SlidersHorizontalIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import { curveTypes, supports } from "../data/config"
import type { ChartOptions, CurveType } from "../data/schema"

interface ChartSettingsProps {
  options: ChartOptions
  onOptionsChange: (patch: Partial<ChartOptions>) => void
  className?: string
}

function SettingRow({
  label,
  htmlFor,
  disabled,
  children,
}: {
  label: string
  htmlFor?: string
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex min-h-7 items-center justify-between gap-3",
        disabled && "pointer-events-none opacity-40"
      )}
    >
      <Label
        htmlFor={htmlFor}
        className="text-[13px] font-normal text-foreground"
      >
        {label}
      </Label>
      {children}
    </div>
  )
}

function SliderRow({
  label,
  value,
  min,
  max,
  step = 1,
  format,
  disabled,
  onValueChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  format: (value: number) => string
  disabled?: boolean
  onValueChange: (value: number) => void
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 py-1",
        disabled && "pointer-events-none opacity-40"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <Label className="text-[13px] font-normal text-foreground">
          {label}
        </Label>
        <span className="text-xs text-muted-foreground tabular-nums">
          {format(value)}
        </span>
      </div>
      <Slider
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={(next) =>
          onValueChange(Array.isArray(next) ? next[0] : next)
        }
      />
    </div>
  )
}

/**
 * Everything about how the chart is drawn rather than what it draws. Rows the
 * current type ignores are dimmed instead of removed, so the panel keeps its
 * shape as you move between types.
 */
export function ChartSettings({
  options,
  onOptionsChange,
  className,
}: ChartSettingsProps) {
  const id = React.useId()
  const can = supports(options.type)

  return (
    <Popover>
      <TooltipProvider delay={300}>
        <Tooltip>
          <TooltipTrigger
            render={
              <PopoverTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon-sm"
                    aria-label="Chart settings"
                    className={className}
                  >
                    <HugeiconsIcon
                      icon={SlidersHorizontalIcon}
                      strokeWidth={2}
                      className="size-3.5"
                    />
                  </Button>
                }
              />
            }
          />
          <TooltipContent>Settings</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent align="end" className="w-64 gap-0 p-0">
        <div className="flex flex-col gap-0.5 p-2.5">
          <span className="pb-1 text-xs font-medium text-muted-foreground">
            Display
          </span>
          <SettingRow label="Grid" htmlFor={`${id}-grid`} disabled={!can.grid}>
            <Switch
              id={`${id}-grid`}
              size="sm"
              checked={options.showGrid}
              onCheckedChange={(showGrid) => onOptionsChange({ showGrid })}
            />
          </SettingRow>
          <SettingRow label="Legend" htmlFor={`${id}-legend`}>
            <Switch
              id={`${id}-legend`}
              size="sm"
              checked={options.showLegend}
              onCheckedChange={(showLegend) => onOptionsChange({ showLegend })}
            />
          </SettingRow>
          <SettingRow label="Tooltip" htmlFor={`${id}-tooltip`}>
            <Switch
              id={`${id}-tooltip`}
              size="sm"
              checked={options.showTooltip}
              onCheckedChange={(showTooltip) =>
                onOptionsChange({ showTooltip })
              }
            />
          </SettingRow>
          <SettingRow
            label="X axis"
            htmlFor={`${id}-x-axis`}
            disabled={!can.axes}
          >
            <Switch
              id={`${id}-x-axis`}
              size="sm"
              checked={options.showXAxis}
              onCheckedChange={(showXAxis) => onOptionsChange({ showXAxis })}
            />
          </SettingRow>
          <SettingRow
            label="Y axis"
            htmlFor={`${id}-y-axis`}
            disabled={!can.axes}
          >
            <Switch
              id={`${id}-y-axis`}
              size="sm"
              checked={options.showYAxis}
              onCheckedChange={(showYAxis) => onOptionsChange({ showYAxis })}
            />
          </SettingRow>
        </div>
        <Separator />
        <div className="flex flex-col gap-0.5 p-2.5">
          <span className="pb-1 text-xs font-medium text-muted-foreground">
            Shape
          </span>
          <SettingRow label="Curve" disabled={!can.curve}>
            <Select
              items={curveTypes}
              value={options.curve}
              onValueChange={(curve) =>
                onOptionsChange({ curve: curve as CurveType })
              }
            >
              <SelectTrigger size="sm" aria-label="Curve" className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end" alignItemWithTrigger={false}>
                <SelectGroup>
                  {curveTypes.map((curve) => (
                    <SelectItem key={curve.value} value={curve.value}>
                      {curve.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </SettingRow>
          <SettingRow
            label="Stacked"
            htmlFor={`${id}-stacked`}
            disabled={!can.stacked}
          >
            <Switch
              id={`${id}-stacked`}
              size="sm"
              checked={options.stacked}
              onCheckedChange={(stacked) => onOptionsChange({ stacked })}
            />
          </SettingRow>
          <SettingRow label="Dots" htmlFor={`${id}-dots`} disabled={!can.dots}>
            <Switch
              id={`${id}-dots`}
              size="sm"
              checked={options.showDots}
              onCheckedChange={(showDots) => onOptionsChange({ showDots })}
            />
          </SettingRow>
          <SliderRow
            label="Fill opacity"
            value={options.fillOpacity}
            min={0}
            max={100}
            disabled={!can.fill}
            format={(value) => `${value}%`}
            onValueChange={(fillOpacity) => onOptionsChange({ fillOpacity })}
          />
          <SliderRow
            label="Stroke width"
            value={options.strokeWidth}
            min={1}
            max={6}
            disabled={!can.stroke}
            format={(value) => `${value}px`}
            onValueChange={(strokeWidth) => onOptionsChange({ strokeWidth })}
          />
          <SliderRow
            label="Bar radius"
            value={options.barRadius}
            min={0}
            max={16}
            disabled={!can.barRadius}
            format={(value) => `${value}px`}
            onValueChange={(barRadius) => onOptionsChange({ barRadius })}
          />
          <SliderRow
            label="Inner radius"
            value={options.innerRadius}
            min={0}
            max={80}
            disabled={!can.innerRadius}
            format={(value) => `${value}%`}
            onValueChange={(innerRadius) => onOptionsChange({ innerRadius })}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
