"use client"

import { Code, Eye } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface CodePreviewToggleProps {
  view: "code" | "preview"
  onViewChange: (view: "code" | "preview") => void
}

export function CodePreviewToggle({
  view,
  onViewChange,
}: CodePreviewToggleProps) {
  const views = [
    ["preview", Eye, "Preview"] as const,
    ["code", Code, "Code"] as const,
  ]

  return (
    <TooltipProvider>
      <ToggleGroup
        variant="outline"
        spacing={0}
        size="sm"
        value={[view]}
        onValueChange={(value) => {
          const next = value[0] as "code" | "preview" | undefined
          if (next) onViewChange(next)
        }}
        data-view-toggle=""
      >
        {views.map(([key, Icon, tooltipText]) => (
          <Tooltip key={key}>
            <TooltipTrigger
              render={<ToggleGroupItem value={key} aria-label={tooltipText} />}
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
