import type { CSSProperties, ReactNode } from "react"

import { BrandFooter } from "@/components/brand-footer"
import { BrandHeader } from "@/components/brand-header"
import { BrandSidebar } from "@/components/brand-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"

export default function ShellLayout({
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
          "--footer-height": "calc(var(--spacing) * 10)",
        } as CSSProperties
      }
    >
      <BrandHeader />
      <BrandSidebar />
      <main className="mt-16 mb-[var(--footer-height)] flex w-full justify-center">
        <div className="container">{children}</div>
      </main>
      <BrandFooter />
      <Toaster />
    </SidebarProvider>
  )
}
