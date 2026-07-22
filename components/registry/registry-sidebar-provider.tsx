"use client"

import type { CSSProperties, ReactNode } from "react"
import * as React from "react"
import { usePathname } from "next/navigation"

import { SidebarProvider } from "@/components/ui/sidebar"

const HOME_SIDEBAR_STORAGE_KEY = "home-sidebar-open"

export function RegistrySidebarProvider({
  children,
  style,
}: {
  children: ReactNode
  style?: CSSProperties
}) {
  const pathname = usePathname()
  const isHome = pathname === "/"

  // On the home page the sidebar defaults to collapsed; everywhere else it
  // defaults to expanded.
  const [open, setOpen] = React.useState(!isHome)
  const prevIsHome = React.useRef<boolean | null>(null)

  // Keep the open state in sync as the user crosses the home page boundary.
  React.useEffect(() => {
    if (prevIsHome.current === isHome) return
    const wasHome = prevIsHome.current
    prevIsHome.current = isHome

    if (isHome) {
      // Restore the home page preference: only open if the user opened it before.
      const stored = window.localStorage.getItem(HOME_SIDEBAR_STORAGE_KEY)
      setOpen(stored === "true")
    } else if (wasHome !== null) {
      // Leaving the home page: expand back to the default.
      setOpen(true)
    }
  }, [isHome])

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      setOpen(next)
      if (isHome) {
        window.localStorage.setItem(HOME_SIDEBAR_STORAGE_KEY, String(next))
      }
    },
    [isHome]
  )

  return (
    <SidebarProvider open={open} onOpenChange={handleOpenChange} style={style}>
      {children}
    </SidebarProvider>
  )
}
