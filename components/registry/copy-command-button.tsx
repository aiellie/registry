"use client"

import { TerminalIcon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
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
        toast.add({
          title: "Copied npx command to clipboard",
          type: "success",
        })
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
