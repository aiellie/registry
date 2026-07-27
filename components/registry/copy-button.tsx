"use client"

import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"

export function CopyButton({ content }: { content?: string }) {
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
            toast.add({ title: "Copied to clipboard", type: "success" })
          }}
        >
          {isCopied ? (
            <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
          ) : (
            <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} />
          )}
          <span className="sr-only">Copy</span>
        </TooltipTrigger>
        <TooltipContent>Copy</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
