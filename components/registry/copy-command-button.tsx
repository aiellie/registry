"use client"

import { TerminalIcon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"

export function CopyCommandButton({
  name,
  registryUrl,
}: {
  name: string
  registryUrl: string
}) {
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  return (
    <Button
      variant="outline"
      onClick={() => {
        copyToClipboard(`npx shadcn@latest add ${registryUrl}`)
        toast.success("Copied npx command to clipboard")
      }}
    >
      {isCopied ? (
        <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
      ) : (
        <HugeiconsIcon icon={TerminalIcon} strokeWidth={2} />
      )}
      <span className="hidden xl:inline">npx shadcn add {name}</span>
      <span className="xl:hidden">npx</span>
    </Button>
  )
}
