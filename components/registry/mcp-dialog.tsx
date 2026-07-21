"use client"

import { McpServerIcon } from "@hugeicons/core-free-icons"
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

export function MCPDialog({
  rootUrl,
  highlightedConfig,
  highlightedClients,
}: {
  rootUrl: string
  highlightedConfig?: string
  highlightedClients?: Record<string, string>
}) {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <HugeiconsIcon icon={McpServerIcon} strokeWidth={2} className="size-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>MCP</DialogTitle>
          <DialogDescription>
            Connect this registry to your AI IDE with the{" "}
            <Link
              href="https://ui.shadcn.com/docs/registry/mcp"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Model Context Protocol
            </Link>
            . Once configured, you can prompt your assistant to browse and
            install components straight from{" "}
            <Link href="/r/registry.json" className="underline">
              <code className="inline text-sm tabular-nums">registry.json</code>
            </Link>
            .
          </DialogDescription>
        </DialogHeader>
        <MCPTabs
          rootUrl={rootUrl}
          highlightedConfig={highlightedConfig}
          highlightedClients={highlightedClients}
        />
      </DialogContent>
    </Dialog>
  )
}
