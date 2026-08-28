import type { CSSProperties, ReactNode } from "react"

import { RegistryShell } from "@/components/registry/registry-shell"
import { RegistrySidebarProvider } from "@/components/registry/registry-sidebar-provider"
import { getThemeSources } from "@/lib/design-tokens.server"
import { getRootUrl } from "@/lib/mcp-config"
import { getHighlightedMcpConfig } from "@/lib/mcp-config.server"

export default async function RegistryLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const [{ highlightedConfig, highlightedClients }, themeSources] =
    await Promise.all([
      getHighlightedMcpConfig(getRootUrl()),
      getThemeSources(),
    ])

  return (
    <RegistrySidebarProvider
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
        header={null}
      >
        {children}
      </RegistryShell>
    </RegistrySidebarProvider>
  )
}
