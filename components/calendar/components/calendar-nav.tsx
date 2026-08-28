"use client"

import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import type { CalendarView } from "../data/schema"
import { shiftFocus } from "../lib"

interface CalendarNavProps {
  view: CalendarView
  focus: Date
  onFocusChange: (date: Date) => void
  className?: string
}

/**
 * One step back or forward, sized for the sidebar. Jumping to today or an
 * arbitrary date is the presets' and mini month's job, right below.
 */
export function CalendarNav({
  view,
  focus,
  onFocusChange,
  className,
}: CalendarNavProps) {
  // What one step covers — the agenda pages through rolling 30-day windows.
  const unit = view === "agenda" ? "30 days" : view

  return (
    <div className={cn("flex items-center justify-end gap-1", className)}>
      <TooltipProvider delay={300}>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Previous"
                onClick={() => onFocusChange(shiftFocus(view, focus, -1))}
              >
                {/* Directional, so it flips with the document. */}
                <HugeiconsIcon
                  icon={ArrowLeft01Icon}
                  strokeWidth={2}
                  className="size-3.5 rtl:rotate-180"
                />
              </Button>
            }
          />
          <TooltipContent>Previous {unit}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Next"
                onClick={() => onFocusChange(shiftFocus(view, focus, 1))}
              >
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  strokeWidth={2}
                  className="size-3.5 rtl:rotate-180"
                />
              </Button>
            }
          />
          <TooltipContent>Next {unit}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
