import { Geist, Geist_Mono } from "next/font/google"
import type { ReactNode } from "react"

import { PanelShell } from "@/components/panel-shell"
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

export default function PanelLayout({
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
        <PanelShell>{children}</PanelShell>
      </body>
    </html>
  )
}
