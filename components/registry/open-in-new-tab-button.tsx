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
            size="icon"
            variant="outline"
            nativeButton={false}
            className="group/open-tab"
            render={<Link href={`/demo/${name}`} target="_blank" />}
          />
        }
      >
        <span className="sr-only">Open in New Tab</span>
        <HugeiconsIcon
          icon={FullScreenIcon}
          strokeWidth={2}
          className="transition-transform duration-200 ease-out group-hover/open-tab:-translate-y-0.5 group-hover/open-tab:translate-x-0.5"
        />
      </TooltipTrigger>
      <TooltipContent>Open in New Tab</TooltipContent>
    </Tooltip>
  )
}
