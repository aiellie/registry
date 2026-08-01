import type { ReactNode } from "react"

import { RegistryHeader } from "@/components/registry/registry-header"
import { SiteEffect } from "@/components/theme-studio/site-effect"
import { getRootUrl } from "@/lib/mcp-config"
import { getHighlightedMcpConfig } from "@/lib/mcp-config.server"

export default async function HomeLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const { highlightedConfig, highlightedClients } =
    await getHighlightedMcpConfig(getRootUrl())

  return (
    // The effect owns the full viewport so it covers site chrome + page.
    // Explicit height is required in the html-in-canvas path, where children
    // render inside an absolutely-positioned canvas; content scrolls inside.
    <SiteEffect className="h-dvh min-w-0 w-full">
      <div className="flex min-h-full w-full flex-col">
        <RegistryHeader
          highlightedConfig={highlightedConfig}
          highlightedClients={highlightedClients}
          showSidebarTrigger={false}
          blurOnScroll
        />
        <main className="flex min-w-0 w-full flex-1 flex-col justify-center">
          {children}
        </main>
      </div>
    </SiteEffect>
  )
}
