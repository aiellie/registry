"use client"

import { FullScreenIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function OpenInNewTabButton({ name }: { name: string }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            size="icon-sm"
            variant="outline"
            nativeButton={false}
            render={<Link href={`/demo/${name}`} target="_blank" />}
          />
        }
      >
        <span className="sr-only">Open in New Tab</span>
        <HugeiconsIcon icon={FullScreenIcon} strokeWidth={2} />
      </TooltipTrigger>
      <TooltipContent>Open in New Tab</TooltipContent>
    </Tooltip>
  )
}
