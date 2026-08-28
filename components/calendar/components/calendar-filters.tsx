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
import { cn } from "@/lib/utils"

import { calendars } from "../data/calendars"

interface CalendarFiltersProps {
  /** The calendars currently drawn. */
  visible: string[]
  onVisibleChange: (next: string[]) => void
  className?: string
}

/** Which calendars are drawn. The last one cannot be unchecked. */
export function CalendarFilters({
  visible,
  onVisibleChange,
  className,
}: CalendarFiltersProps) {
  const toggle = (value: string, checked: boolean) => {
    const next = checked
      ? [...visible, value]
      : visible.filter((item) => item !== value)
    if (next.length) onVisibleChange(next)
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
                    size="sm"
                    aria-label="Visible calendars"
                    className={className}
                  >
                    <HugeiconsIcon
                      icon={Layers01Icon}
                      strokeWidth={2}
                      className="size-3.5"
                    />
                    <span className="tabular-nums">
                      {visible.length}/{calendars.length}
                    </span>
                  </Button>
                }
              />
            }
          />
          <TooltipContent>Calendars</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Calendars</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {calendars.map((calendar) => {
          const checked = visible.includes(calendar.value)
          return (
            <DropdownMenuCheckboxItem
              key={calendar.value}
              checked={checked}
              closeOnClick={false}
              disabled={checked && visible.length === 1}
              onCheckedChange={(next) => toggle(calendar.value, next)}
            >
              <span
                aria-hidden
                className={cn("size-2.5 shrink-0 rounded-full", calendar.dot)}
              />
              {calendar.label}
            </DropdownMenuCheckboxItem>
          )
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            onVisibleChange(calendars.map((calendar) => calendar.value))
          }
        >
          Show all
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
