"use client"

import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function ScrollToComponentsButton() {
  function handleClick() {
    document
      .querySelector('[data-slot="components-demo"]')
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              aria-label="Explore Components"
              onClick={handleClick}
            >
              <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} />
            </Button>
          }
        />
        <TooltipContent>Explore</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
