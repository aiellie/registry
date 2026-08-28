"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import { LogoIcon } from "@/components/brand/logo"
import { AiellieProfile } from "@/components/registry/aiellie-profile"
import { MCPDialog } from "@/components/registry/mcp-dialog"
import { ModeToggle } from "@/components/registry/theme-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { getRootUrl } from "@/lib/mcp-config"
import { cn } from "@/lib/utils"

export function RegistryHeader({
  highlightedConfig,
  highlightedClients,
  showSidebarTrigger = true,
  className,
  /** Transparent at rest; frosted glass once the nearest scrollport moves. */
  blurOnScroll = false,
  // Error and not-found render this header without reading from disk, so the
  // theme dialog simply drops out there.
}: {
  highlightedConfig?: string
  highlightedClients?: Record<string, string>
  showSidebarTrigger?: boolean
  className?: string
  blurOnScroll?: boolean
}) {
  const headerRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!blurOnScroll) return

    const update = () => {
      const header = headerRef.current
      let top = window.scrollY
      let node = header?.parentElement ?? null
      while (node) {
        const { overflowY } = getComputedStyle(node)
        if (/(auto|scroll|overlay)/.test(overflowY)) {
          top = Math.max(top, node.scrollTop)
        }
        node = node.parentElement
      }
      setScrolled(top > 8)
    }

    // Capture so Bubble's internal overflow:auto scrollport is seen too.
    document.addEventListener("scroll", update, {
      capture: true,
      passive: true,
    })
    update()
    return () =>
      document.removeEventListener("scroll", update, {
        capture: true,
      })
  }, [blurOnScroll])

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-none px-4 transition-[background-color,backdrop-filter] duration-200",
        blurOnScroll
          ? scrolled
            ? "bg-background/30 backdrop-blur-md"
            : "bg-transparent backdrop-blur-none"
          : "bg-background/30 backdrop-blur-md",
        className
      )}
    >
      {showSidebarTrigger ? (
        <SidebarTrigger className="-ms-1.5" />
      ) : (
        <Link href="/" className="group flex min-w-0 items-center gap-2">
          <LogoIcon className="size-6" />
        </Link>
      )}
      <div className="ms-auto flex items-center gap-1">
        <MCPDialog
          rootUrl={getRootUrl()}
          highlightedConfig={highlightedConfig}
          highlightedClients={highlightedClients}
        />
        <ModeToggle />
        <AiellieProfile />
      </div>
    </header>
  )
}
