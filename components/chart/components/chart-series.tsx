"use client"

import { Layers01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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

import type { ChartSeries } from "../data/schema"

interface ChartSeriesMenuProps {
  series: ChartSeries[]
  onVisibilityChange: (key: string, visible: boolean) => void
  className?: string
}

/**
 * Which series are drawn. The last visible one cannot be unchecked — an empty
 * chart is never what the toggle was reaching for.
 */
export function ChartSeriesMenu({
  series,
  onVisibilityChange,
  className,
}: ChartSeriesMenuProps) {
  const visibleCount = series.filter((item) => item.visible).length

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
                    size="sm"
                    aria-label="Visible series"
                    className={className}
                  >
                    <HugeiconsIcon
                      icon={Layers01Icon}
                      strokeWidth={2}
                      className="size-3.5"
                    />
                    <span className="tabular-nums">
                      {visibleCount}/{series.length}
                    </span>
                  </Button>
                }
              />
            }
          />
          <TooltipContent>Series</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Toggle series</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {series.map((item) => (
          <DropdownMenuCheckboxItem
            key={item.key}
            checked={item.visible}
            closeOnClick={false}
            disabled={item.visible && visibleCount === 1}
            onCheckedChange={(checked) => onVisibilityChange(item.key, checked)}
          >
            <span
              aria-hidden
              className="size-2.5 shrink-0 rounded-[2px]"
              style={{ background: item.color }}
            />
            {item.label}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            series.forEach((item) => onVisibilityChange(item.key, true))
          }
        >
          Show all
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
