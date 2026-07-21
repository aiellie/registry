"use client"

import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"

export function CopyCodeButton({ content }: { content?: string }) {
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  if (!content) {
    return null
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={<Button variant="ghost" size="icon-sm" />}
          onClick={() => {
            copyToClipboard(content)
            toast.success("Copied code to clipboard")
          }}
        >
          {isCopied ? (
            <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
          ) : (
            <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} />
          )}
          <span className="sr-only">Copy code</span>
        </TooltipTrigger>
        <TooltipContent>Copy code</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
