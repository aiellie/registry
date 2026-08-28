import { Geist, Geist_Mono } from "next/font/google"
import type { CSSProperties, ReactNode } from "react"

import { BrandHeader } from "@/components/brand/brand-header"
import { BrandPanelsProvider } from "@/components/brand/brand-panels"
import { BrandSidebar } from "@/components/brand-sidebar"
import { BrandSidebarBottom } from "@/components/brand-sidebar-bottom"
import { BrandSidebarRight } from "@/components/brand-sidebar-right"
import { BrandFooter } from "@/components/brand/brand-footer"
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

import "@/app/globals.css"

const GeistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const GeistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function ShellLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn(
        GeistSans.variable,
        GeistMono.variable,
        "bg-background font-sans text-foreground antialiased"
      )}
    >
      <body>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
              "--footer-height": "calc(var(--spacing) * 8)",
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
                {/* The bottom panel splits the content area, so it stops short
                    of the sidebar and the right panel. */}
                <ResizablePanelGroup orientation="vertical">
                  {/* h-full, not min-h-full: the page measures itself against
                      the space the panel actually has, so opening the bottom
                      panel squeezes the content instead of pushing it out of
                      sight. */}
                  <ResizablePanel
                    id="content-main"
                    style={{ overflow: "hidden" }}
                  >
                    <main className="flex h-full w-full justify-center overflow-auto">
                      <div className="container h-full">{children}</div>
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
      </body>
    </html>
  )
}
