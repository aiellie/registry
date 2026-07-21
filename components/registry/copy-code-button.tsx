"use client"

import { ClipboardIcon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"

export function CopyCodeButton({ content }: { content?: string }) {
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  if (!content) {
    return null
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-7"
      onClick={() => copyToClipboard(content)}
    >
      {isCopied ? (
        <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
      ) : (
        <HugeiconsIcon icon={ClipboardIcon} strokeWidth={2} />
      )}
      <span className="sr-only">Copy code</span>
    </Button>
  )
}
