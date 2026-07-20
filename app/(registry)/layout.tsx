import type { CSSProperties, ReactNode } from "react"

import { RegistryHeader } from "@/components/registry/registry-header"
import { RegistrySidebar } from "@/components/registry/registry-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"

export default function RegistryLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
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
        <RegistryHeader />
        <main className="flex w-full justify-center">{children}</main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}
