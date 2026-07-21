"use client"

import * as React from "react"
import { RefreshIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export function RefreshPreviewButton({ onRefresh }: { onRefresh: () => void }) {
  const [spinning, setSpinning] = React.useState(false)

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              onRefresh()
              setSpinning(true)
            }}
          />
        }
      >
        <span
          className={cn(spinning && "animate-[spin_0.5s_ease-in-out]")}
          onAnimationEnd={() => setSpinning(false)}
        >
          <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} />
        </span>
        <span className="sr-only">Refresh Preview</span>
      </TooltipTrigger>
      <TooltipContent>Refresh Preview</TooltipContent>
    </Tooltip>
  )
}
