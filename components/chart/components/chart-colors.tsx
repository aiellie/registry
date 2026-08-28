"use client"

import * as React from "react"
import { ColorsIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { ColorPicker } from "@/components/design/color-picker"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import { palettes } from "../data/config"
import type { ChartSeries } from "../data/schema"

interface ChartColorsProps {
  series: ChartSeries[]
  onColorChange: (key: string, color: string) => void
  /** Recolors every series from a ramp, in series order. */
  onPaletteChange: (colors: string[]) => void
  className?: string
}

/**
 * Per-series colors, plus the named ramps that set them all at once.
 *
 * The wheel that `ColorPicker` opens is portalled to `document.body`, so a
 * press inside it reads to this popover as a press outside; the `outside-press`
 * close is cancelled while that dialog is what was pressed.
 */
export function ChartColors({
  series,
  onColorChange,
  onPaletteChange,
  className,
}: ChartColorsProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover
      open={open}
      onOpenChange={(next, details) => {
        const target = details.event?.target
        if (
          !next &&
          details.reason === "outside-press" &&
          target instanceof Element &&
          target.closest("[role='dialog'][aria-label='Color picker']")
        ) {
          details.cancel()
          return
        }
        setOpen(next)
      }}
    >
      <TooltipProvider delay={300}>
        <Tooltip>
          <TooltipTrigger
            render={
              <PopoverTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon-sm"
                    aria-label="Series colors"
                    className={className}
                  >
                    <HugeiconsIcon
                      icon={ColorsIcon}
                      strokeWidth={2}
                      className="size-3.5"
                    />
                  </Button>
                }
              />
            }
          />
          <TooltipContent>Colors</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent align="end" className="w-60 gap-0 p-0">
        <div className="flex flex-col gap-1.5 p-2.5">
          <span className="text-xs font-medium text-muted-foreground">
            Palette
          </span>
          <TooltipProvider delay={300}>
            <div className="flex flex-col gap-1">
              {palettes.map((palette) => (
                <Tooltip key={palette.name}>
                  <TooltipTrigger
                    render={
                      <button
                        type="button"
                        onClick={() => onPaletteChange(palette.colors)}
                        className="flex cursor-pointer items-center justify-between gap-2 rounded-md px-1.5 py-1 text-start transition-colors hover:bg-foreground/5"
                      >
                        <span className="text-[13px]">{palette.name}</span>
                        <span className="flex items-center gap-0.5">
                          {palette.colors.map((color) => (
                            <span
                              key={color}
                              className="size-3 rounded-full border border-foreground/10"
                              style={{ background: color }}
                            />
                          ))}
                        </span>
                      </button>
                    }
                  />
                  <TooltipContent>Apply {palette.name}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </div>
        <Separator />
        <div className="flex flex-col gap-1.5 p-2.5">
          <span className="text-xs font-medium text-muted-foreground">
            Series
          </span>
          <div className="flex flex-col gap-0.5">
            {series.map((item) => (
              <div
                key={item.key}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-md px-1.5 py-1",
                  !item.visible && "opacity-50"
                )}
              >
                <span className="truncate text-[13px]">{item.label}</span>
                <ColorPicker
                  label={item.label}
                  value={item.color}
                  hideValue
                  onValueChange={(color) => onColorChange(item.key, color)}
                />
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
