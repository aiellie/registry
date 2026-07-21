import type { CSSProperties, ReactNode } from "react"

import { RegistryHeader } from "@/components/registry/registry-header"
import { RegistrySidebar } from "@/components/registry/registry-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { getThemeSources } from "@/lib/design-tokens.server"
import { getRootUrl } from "@/lib/mcp-config"
import { getHighlightedMcpConfig } from "@/lib/mcp-config.server"

export default async function RegistryLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const [{ highlightedConfig, highlightedClients }, themeSources] =
    await Promise.all([getHighlightedMcpConfig(getRootUrl()), getThemeSources()])

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      <RegistrySidebar />
      <SidebarInset className="min-w-0">
        <RegistryHeader
          highlightedConfig={highlightedConfig}
          highlightedClients={highlightedClients}
          themeSources={themeSources}
        />
        <main className="flex w-full justify-center">{children}</main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}
