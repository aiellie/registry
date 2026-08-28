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
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { densities } from "../data/config"
import type { Density, TableSettings } from "../data/schema"

interface DataTableSettingsProps {
  settings: TableSettings
  onSettingsChange: (patch: Partial<TableSettings>) => void
  className?: string
}

function SettingRow({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-7 items-center justify-between gap-3">
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

/** How the table is drawn, as opposed to which rows and columns it draws. */
export function DataTableSettings({
  settings,
  onSettingsChange,
  className,
}: DataTableSettingsProps) {
  const id = React.useId()

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
                    aria-label="Table settings"
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
            Density
          </span>
          <TooltipProvider delay={300}>
            <ToggleGroup
              aria-label="Row density"
              variant="outline"
              size="sm"
              spacing={0}
              value={[settings.density]}
              onValueChange={([next]) => {
                if (next) onSettingsChange({ density: next as Density })
              }}
              className="w-full"
            >
              {densities.map((density) => (
                <Tooltip key={density.value}>
                  <TooltipTrigger
                    render={
                      <ToggleGroupItem
                        value={density.value}
                        className="flex-1 text-xs"
                      >
                        {density.label}
                      </ToggleGroupItem>
                    }
                  />
                  <TooltipContent>{density.hint}</TooltipContent>
                </Tooltip>
              ))}
            </ToggleGroup>
          </TooltipProvider>
        </div>
        <Separator />
        <div className="flex flex-col gap-0.5 p-2.5">
          <span className="pb-1 text-xs font-medium text-muted-foreground">
            Rows
          </span>
          <SettingRow label="Striped" htmlFor={`${id}-striped`}>
            <Switch
              id={`${id}-striped`}
              size="sm"
              checked={settings.striped}
              onCheckedChange={(striped) => onSettingsChange({ striped })}
            />
          </SettingRow>
          <SettingRow label="Grid lines" htmlFor={`${id}-grid`}>
            <Switch
              id={`${id}-grid`}
              size="sm"
              checked={settings.gridLines}
              onCheckedChange={(gridLines) => onSettingsChange({ gridLines })}
            />
          </SettingRow>
          <SettingRow label="Row numbers" htmlFor={`${id}-numbers`}>
            <Switch
              id={`${id}-numbers`}
              size="sm"
              checked={settings.rowNumbers}
              onCheckedChange={(rowNumbers) => onSettingsChange({ rowNumbers })}
            />
          </SettingRow>
          <SettingRow label="Truncate titles" htmlFor={`${id}-truncate`}>
            <Switch
              id={`${id}-truncate`}
              size="sm"
              checked={settings.truncate}
              onCheckedChange={(truncate) => onSettingsChange({ truncate })}
            />
          </SettingRow>
          <SettingRow label="Drag handle" htmlFor={`${id}-drag`}>
            <Switch
              id={`${id}-drag`}
              size="sm"
              checked={settings.dragHandle}
              onCheckedChange={(dragHandle) => onSettingsChange({ dragHandle })}
            />
          </SettingRow>
        </div>
        <Separator />
        <div className="flex flex-col gap-0.5 p-2.5">
          <span className="pb-1 text-xs font-medium text-muted-foreground">
            Layout
          </span>
          <SettingRow label="Sticky header" htmlFor={`${id}-sticky`}>
            <Switch
              id={`${id}-sticky`}
              size="sm"
              checked={settings.stickyHeader}
              onCheckedChange={(stickyHeader) =>
                onSettingsChange({ stickyHeader })
              }
            />
          </SettingRow>
          <SettingRow label="Status summary" htmlFor={`${id}-summary`}>
            <Switch
              id={`${id}-summary`}
              size="sm"
              checked={settings.showSummary}
              onCheckedChange={(showSummary) =>
                onSettingsChange({ showSummary })
              }
            />
          </SettingRow>
          <SettingRow label="Pagination" htmlFor={`${id}-pagination`}>
            <Switch
              id={`${id}-pagination`}
              size="sm"
              checked={settings.showPagination}
              onCheckedChange={(showPagination) =>
                onSettingsChange({ showPagination })
              }
            />
          </SettingRow>
        </div>
      </PopoverContent>
    </Popover>
  )
}
