"use client"

import Link from "next/link"
import {
  LayoutAlignLeftIcon,
  LayoutAlignRightIcon,
  LayoutAlignBottomIcon,
  SidebarLeftIcon,
  SidebarRightIcon,
  SidebarBottomIcon
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { LogoIcon, LogoWordmark } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/theme-toggle"

export function BrandHeader() {
  const { state, toggleSidebar } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <header className="fixed z-50 w-full border-b border-border bg-background">
      <div className="flex h-12 items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon-sm"
            className="hidden md:flex"
            onClick={toggleSidebar}
          >
            <HugeiconsIcon
              icon={isCollapsed ? SidebarLeftIcon : LayoutAlignLeftIcon}
              strokeWidth={2}
              className="text-muted-foreground"
            />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={toggleSidebar}
          >
            <HugeiconsIcon
              icon={SidebarLeftIcon}
              strokeWidth={2}
              className="size-4 text-muted-foreground"
            />
          </Button>


          <Link href="/" className="group flex items-center gap-2">
            <LogoIcon className="size-6" />
            <LogoWordmark as="span" className="text-sm font-medium" />
          </Link>
        </div>

        <div className="flex items-center gap-1">
          <ModeToggle />
          <span className="mx-1 h-3 w-px bg-border" />
          <Button variant="ghost" size="icon-sm">
            <HugeiconsIcon
              icon={LayoutAlignBottomIcon}
              strokeWidth={2}
              className="size-4 text-muted-foreground"
            />
          </Button>
          <Button variant="ghost" size="icon-sm">
            <HugeiconsIcon
              icon={LayoutAlignRightIcon}
              strokeWidth={2}
              className="size-4 text-muted-foreground"
            />
          </Button>
        </div>
      </div>
    </header>
  )
}
