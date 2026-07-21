"use client"

import {
  ComputerIcon,
  SmartPhone01Icon,
  Tablet01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function ViewportToggleGroup({
  onSelect,
}: {
  onSelect: (size: string) => void
}) {
  const viewports = [
    ["100%", ComputerIcon, "Desktop"] as const,
    ["60%", Tablet01Icon, "Tablet"] as const,
    ["30%", SmartPhone01Icon, "Mobile"] as const,
  ]

  return (
    <TooltipProvider>
      <ToggleGroup
        variant="outline"
        spacing={0}
        defaultValue={["100%"]}
        onValueChange={(value) => {
          const size = value[0]
          if (typeof size !== "string") {
            return
          }
          onSelect(size)
        }}
      >
        {viewports.map(([value, Icon, tooltipText]) => (
          <Tooltip key={value}>
            <TooltipTrigger
              render={
                <ToggleGroupItem value={value} aria-label={tooltipText} />
              }
            >
              <HugeiconsIcon icon={Icon} strokeWidth={2} />
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltipText}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </ToggleGroup>
    </TooltipProvider>
  )
}
