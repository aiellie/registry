import type { CSSProperties, ReactNode } from "react"

import { BrandFooter } from "@/components/brand-footer"
import { BrandHeader } from "@/components/brand-header"
import { BrandSidebar } from "@/components/brand-sidebar"
import {
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toast"

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
      <ResizablePanelGroup
        orientation="horizontal"
        className="mt-[var(--header-height)] mb-[var(--footer-height)]"
        style={{
          height: "calc(100svh - var(--header-height) - var(--footer-height))",
        }}
      >
        <BrandSidebar />
        <ResizablePanel id="content">
          <main className="flex min-h-full w-full justify-center">
            <div className="container">{children}</div>
          </main>
        </ResizablePanel>
      </ResizablePanelGroup>
      <BrandFooter />
      <Toaster />
    </SidebarProvider>
  )
}
