import type { Metadata } from "next"

import "./globals.css"
import { fontVariables } from "./fonts"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeStudio } from "@/components/theme-studio/theme-studio"
import { ThemeStudioScript } from "@/components/theme-studio/theme-studio-script"
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toast"

export const metadata: Metadata = {
  title: "AI Ellie",
  description:
    "A shadcn/ui registry distributing the ui.aiellie.dev design system: theme tokens, UI primitives, components, and blocks.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", "font-sans", ...fontVariables)}
    >
      <body>
        <ThemeStudioScript />
        <ThemeProvider>
          {children}
          <ThemeStudio />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
