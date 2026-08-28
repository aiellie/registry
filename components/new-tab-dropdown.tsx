"use client"

import {
  AlertCircleIcon,
  ArrowDataTransferVerticalIcon,
  ConsoleIcon,
  PlusSignIcon,
  TerminalIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export type NewTabType = "terminal" | "console" | "problems" | "network"

export const NEW_TAB_OPTIONS: {
  type: NewTabType
  label: string
  icon: IconSvgElement
}[] = [
  { icon: TerminalIcon, label: "Terminal", type: "terminal" },
  { icon: ConsoleIcon, label: "Console", type: "console" },
  { icon: AlertCircleIcon, label: "Problems", type: "problems" },
  { icon: ArrowDataTransferVerticalIcon, label: "Network", type: "network" },
]

export function NewTabDropdown({
  onSelect,
  tooltip = "New tab",
  className,
}: {
  onSelect?: (type: NewTabType) => void
  tooltip?: string
  className?: string
}) {
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={
                <Button
                  aria-label={tooltip}
                  className={cn("shrink-0", className)}
                  size="icon-xs"
                  variant="ghost"
                />
              }
            />
          }
        >
          <HugeiconsIcon
            className="text-muted-foreground"
            icon={PlusSignIcon}
            strokeWidth={2}
          />
        </TooltipTrigger>
        <TooltipContent side="top">{tooltip}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="start" className="w-44">
        {NEW_TAB_OPTIONS.map((option) => (
          <DropdownMenuItem
            className="gap-2.5"
            key={option.type}
            onClick={() => onSelect?.(option.type)}
          >
            <HugeiconsIcon
              className="size-4 shrink-0 text-muted-foreground"
              icon={option.icon}
              strokeWidth={2}
            />
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
