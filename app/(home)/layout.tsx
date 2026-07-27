import type { ReactNode } from "react"

import { RegistryHeader } from "@/components/registry/registry-header"
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
    <>
      <RegistryHeader
        highlightedConfig={highlightedConfig}
        highlightedClients={highlightedClients}
        showSidebarTrigger={false}
      />
      <main className="flex w-full justify-center">{children}</main>
    </>
  )
}
