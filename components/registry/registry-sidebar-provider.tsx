"use client"

import type { CSSProperties, ReactNode } from "react"
import * as React from "react"
import { usePathname } from "next/navigation"

import { SidebarProvider } from "@/components/ui/sidebar"

// Pages where the sidebar defaults to collapsed and remembers the user's
// open/closed preference. Everywhere else the sidebar defaults to expanded.
const COLLAPSED_BY_DEFAULT_PATHS = new Set(["/", "/cards"])
const SIDEBAR_STORAGE_KEY_PREFIX = "sidebar-open:"

export function RegistrySidebarProvider({
  children,
  style,
}: {
  children: ReactNode
  style?: CSSProperties
}) {
  const pathname = usePathname()
  const isCollapsedByDefault = COLLAPSED_BY_DEFAULT_PATHS.has(pathname)

  const [open, setOpen] = React.useState(!isCollapsedByDefault)
  const prevPathname = React.useRef<string | null>(null)

  // Sync the open state whenever the pathname changes.
  React.useEffect(() => {
    if (prevPathname.current === pathname) return
    prevPathname.current = pathname

    if (isCollapsedByDefault) {
      // Restore this page's preference: only open if the user opened it before.
      const stored = window.localStorage.getItem(
        SIDEBAR_STORAGE_KEY_PREFIX + pathname
      )
      setOpen(stored === "true")
    } else {
      // Default to expanded on all other pages.
      setOpen(true)
    }
  }, [pathname, isCollapsedByDefault])

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      setOpen(next)
      if (isCollapsedByDefault) {
        window.localStorage.setItem(
          SIDEBAR_STORAGE_KEY_PREFIX + pathname,
          String(next)
        )
      }
    },
    [isCollapsedByDefault, pathname]
  )

  return (
    <SidebarProvider open={open} onOpenChange={handleOpenChange} style={style}>
      {children}
    </SidebarProvider>
  )
}
