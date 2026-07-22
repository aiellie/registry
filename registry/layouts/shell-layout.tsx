import { Geist, Geist_Mono } from "next/font/google"
import type { CSSProperties, ReactNode } from "react"

import { BrandHeader } from "@/components/brand-header"
import { BrandSidebar } from "@/components/brand-sidebar"
import { BrandFooter } from "@/components/brand-footer"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
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
              "--footer-height": "calc(var(--spacing) * 10)",
            } as CSSProperties
          }
        >
          <BrandHeader />
          <BrandSidebar />
          <main className="mt-[var(--header-height)] mb-[var(--footer-height)] flex w-full justify-center">
            <div className="container">{children}</div>
          </main>
          <BrandFooter />
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  )
}
