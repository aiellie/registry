import Link from "next/link"
import type { CSSProperties } from "react"

import { RegistryHeader } from "@/components/registry/registry-header"
import { RegistrySidebar } from "@/components/registry/registry-sidebar"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { highlightCode } from "@/lib/highlight-code"
import { getMcpConfig, getRootUrl } from "@/lib/mcp-config"

export default async function NotFound() {
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
        <main className="flex w-full justify-center">
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
        </main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}
