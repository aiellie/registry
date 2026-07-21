"use client"

import { McpServerIcon, PlugSocketIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"

import { MCPTabs } from "@/components/registry/mcp-tabs"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function MCPDialog({ rootUrl }: { rootUrl: string }) {
  return (
    <Dialog>
      <DialogTrigger
        render={<Button variant="ghost" size="icon-sm" />}
      >   
<HugeiconsIcon icon={McpServerIcon} strokeWidth={2} className="size-4" />         
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>MCP</DialogTitle>
          <DialogDescription>
            Integrate this registry with AI IDEs using Model Context Protocol
            (MCP). This utilizes this registry&apos;s theme tokens and CSS
            variables with the shadcn CLI. Double check that{" "}
            <Link href="/r/registry.json" className="underline">
              <code className="inline text-sm tabular-nums">registry.json</code>
            </Link>{" "}
            contains the same colors as your{" "}
            <code className="inline text-sm tabular-nums">globals.css</code>.
          </DialogDescription>
        </DialogHeader>
        <MCPTabs rootUrl={rootUrl} />
      </DialogContent>
    </Dialog>
  )
}
