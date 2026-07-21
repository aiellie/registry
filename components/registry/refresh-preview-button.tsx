"use client"

import { RefreshIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function RefreshPreviewButton({ onRefresh }: { onRefresh: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            size="icon-sm"
            variant="outline"
            onClick={onRefresh}
          />
        }
      >
        <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} />
        <span className="sr-only">Refresh Preview</span>
      </TooltipTrigger>
      <TooltipContent>Refresh Preview</TooltipContent>
    </Tooltip>
  )
}
