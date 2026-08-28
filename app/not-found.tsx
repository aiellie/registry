import Link from "next/link"
import type { CSSProperties } from "react"

import { RegistryHeader } from "@/components/registry/registry-header"
import { RegistryShell } from "@/components/registry/registry-shell"
import { Button } from "@/components/ui/button"
import { SidebarProvider } from "@/components/ui/sidebar"
import { getRootUrl } from "@/lib/mcp-config"
import { getHighlightedMcpConfig } from "@/lib/mcp-config.server"

export default async function NotFound() {
  const { highlightedConfig, highlightedClients } =
    await getHighlightedMcpConfig(getRootUrl())

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      <RegistryShell
        highlightedConfig={highlightedConfig}
        highlightedClients={highlightedClients}
        header={
          <RegistryHeader
            highlightedConfig={highlightedConfig}
            highlightedClients={highlightedClients}
          />
        }
      >
        <div className="flex min-h-screen w-full flex-col items-center justify-center text-center">
          <h1 className="text-6xl font-medium tracking-tight text-muted-foreground md:text-8xl">
            404
          </h1>
          <h2 className="mt-8 text-2xl font-semibold tracking-tight md:text-3xl">
            Page Not Found
          </h2>
          <div className="mt-8 flex gap-3">
            <Button nativeButton={false} render={<Link href="/" />}>
              Go Home
            </Button>
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/r/registry.json" />}
            >
              View Registry
            </Button>
          </div>
        </div>
      </RegistryShell>
    </SidebarProvider>
  )
}
