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
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import { weekStartOptions } from "../data/config"
import type { CalendarSettings, CalendarView } from "../data/schema"
import { formatHour } from "../lib"

interface CalendarSettingsProps {
  settings: CalendarSettings
  onSettingsChange: (patch: Partial<CalendarSettings>) => void
  /** Rows the current view ignores are dimmed rather than removed. */
  view: CalendarView
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

export function CalendarSettingsMenu({
  settings,
  onSettingsChange,
  view,
  className,
}: CalendarSettingsProps) {
  const id = React.useId()
  const isTimeGrid = view === "week" || view === "day"
  const isGrid = view === "month" || isTimeGrid

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
                    aria-label="Calendar settings"
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
        <div className="flex flex-col gap-2 p-2.5">
          <span className="text-xs font-medium text-muted-foreground">
            Week starts on
          </span>
          <ToggleGroup
            aria-label="Week starts on"
            variant="outline"
            size="sm"
            spacing={0}
            value={[String(settings.weekStartsOn)]}
            onValueChange={([next]) => {
              if (next) {
                onSettingsChange({ weekStartsOn: Number(next) as 0 | 1 })
              }
            }}
            className="w-full"
          >
            {weekStartOptions.map((option) => (
              <ToggleGroupItem
                key={option.value}
                value={String(option.value)}
                className="flex-1 text-xs"
              >
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <Separator />
        <div className="flex flex-col gap-0.5 p-2.5">
          <span className="pb-1 text-xs font-medium text-muted-foreground">
            Display
          </span>
          <SettingRow
            label="Weekends"
            htmlFor={`${id}-weekends`}
            disabled={!isGrid}
          >
            <Switch
              id={`${id}-weekends`}
              size="sm"
              checked={settings.showWeekends}
              onCheckedChange={(showWeekends) =>
                onSettingsChange({ showWeekends })
              }
            />
          </SettingRow>
          <SettingRow
            label="Week numbers"
            htmlFor={`${id}-week-numbers`}
            disabled={view !== "month"}
          >
            <Switch
              id={`${id}-week-numbers`}
              size="sm"
              checked={settings.showWeekNumbers}
              onCheckedChange={(showWeekNumbers) =>
                onSettingsChange({ showWeekNumbers })
              }
            />
          </SettingRow>
          <SettingRow label="12-hour clock" htmlFor={`${id}-hour12`}>
            <Switch
              id={`${id}-hour12`}
              size="sm"
              checked={settings.hour12}
              onCheckedChange={(hour12) => onSettingsChange({ hour12 })}
            />
          </SettingRow>
          <SettingRow label="Calendar summary" htmlFor={`${id}-summary`}>
            <Switch
              id={`${id}-summary`}
              size="sm"
              checked={settings.showSummary}
              onCheckedChange={(showSummary) =>
                onSettingsChange({ showSummary })
              }
            />
          </SettingRow>
          <SettingRow label="Compact" htmlFor={`${id}-compact`}>
            <Switch
              id={`${id}-compact`}
              size="sm"
              checked={settings.density === "compact"}
              onCheckedChange={(compact) =>
                onSettingsChange({ density: compact ? "compact" : "default" })
              }
            />
          </SettingRow>
        </div>
        <Separator />
        <div
          className={cn(
            "flex flex-col gap-2 p-2.5",
            !isTimeGrid && "pointer-events-none opacity-40"
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <Label className="text-[13px] font-normal text-foreground">
              Hours shown
            </Label>
            <span className="text-xs text-muted-foreground tabular-nums">
              {formatHour(settings.dayStartHour, settings.hour12)} –{" "}
              {formatHour(settings.dayEndHour, settings.hour12)}
            </span>
          </div>
          <Slider
            aria-label="Hours shown"
            min={0}
            max={24}
            step={1}
            value={[settings.dayStartHour, settings.dayEndHour]}
            onValueChange={(next) => {
              const [dayStartHour, dayEndHour] = next as number[]
              // Keep at least one hour on the scale, whichever thumb moved.
              if (dayEndHour - dayStartHour < 1) return
              onSettingsChange({ dayStartHour, dayEndHour })
            }}
          />
          <SettingRow label="Dim off-hours" htmlFor={`${id}-work-hours`}>
            <Switch
              id={`${id}-work-hours`}
              size="sm"
              checked={settings.highlightWorkHours}
              onCheckedChange={(highlightWorkHours) =>
                onSettingsChange({ highlightWorkHours })
              }
            />
          </SettingRow>
        </div>
      </PopoverContent>
    </Popover>
  )
}
