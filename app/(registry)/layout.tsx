import type { CSSProperties, ReactNode } from "react"

import { RegistryHeader } from "@/components/registry/registry-header"
import { RegistrySidebar } from "@/components/registry/registry-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { highlightCode } from "@/lib/highlight-code"
import { getMcpConfig, getRootUrl } from "@/lib/mcp-config"

export default async function RegistryLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const { mcpServer } = getMcpConfig(getRootUrl())
  const highlightedMcp = await highlightCode(mcpServer, "json")

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
        <RegistryHeader highlightedMcp={highlightedMcp} />
        <main className="flex w-full justify-center">{children}</main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}
