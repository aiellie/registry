"use client"

import { Cancel01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface DataTableGlobalFilterProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  className?: string
}

/** One search box across every visible column, rather than one per column. */
export function DataTableGlobalFilter({
  value,
  onValueChange,
  placeholder = "Search tasks...",
  className,
}: DataTableGlobalFilterProps) {
  return (
    <InputGroup className={cn("h-8 w-[180px] lg:w-[260px]", className)}>
      <InputGroupAddon align="inline-start">
        <HugeiconsIcon
          aria-hidden
          icon={Search01Icon}
          strokeWidth={2}
          className="size-4 text-muted-foreground"
        />
      </InputGroupAddon>
      <InputGroupInput
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search"
        spellCheck={false}
        autoComplete="off"
        className="h-8"
      />
      {value && (
        <InputGroupAddon align="inline-end">
          <TooltipProvider delay={300}>
            <Tooltip>
              <TooltipTrigger
                render={
                  <InputGroupButton
                    size="icon-xs"
                    aria-label="Clear search"
                    onClick={() => onValueChange("")}
                    className="text-muted-foreground hover:text-foreground"
                  />
                }
              >
                <HugeiconsIcon
                  aria-hidden
                  icon={Cancel01Icon}
                  strokeWidth={2}
                  className="size-3.5"
                />
              </TooltipTrigger>
              <TooltipContent>Clear</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}
