import type { CSSProperties, ReactNode } from "react"

import { BrandFooter } from "@/components/brand-footer"
import { BrandHeader } from "@/components/brand-header"
import { BrandPanelsProvider } from "@/components/brand-panels"
import { BrandSidebar } from "@/components/brand-sidebar"
import { BrandSidebarBottom } from "@/components/brand-sidebar-bottom"
import { BrandSidebarRight } from "@/components/brand-sidebar-right"
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
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
      <BrandPanelsProvider>
        <BrandHeader />
        <ResizablePanelGroup
          orientation="horizontal"
          className="mt-[var(--header-height)] mb-[var(--footer-height)]"
          style={{
            height:
              "calc(100svh - var(--header-height) - var(--footer-height))",
          }}
        >
          <BrandSidebar />
          <ResizablePanel id="content">
            {/* The bottom panel splits the content area, so it stops short of
                the sidebar and the right panel. */}
            <ResizablePanelGroup orientation="vertical">
              <ResizablePanel id="content-main" style={{ overflow: "auto" }}>
                <main className="flex min-h-full w-full justify-center">
                  <div className="container">{children}</div>
                </main>
              </ResizablePanel>
              <BrandSidebarBottom />
            </ResizablePanelGroup>
          </ResizablePanel>
          <BrandSidebarRight />
        </ResizablePanelGroup>
        <BrandFooter />
      </BrandPanelsProvider>
      <Toaster />
    </SidebarProvider>
  )
}
