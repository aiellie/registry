"use client"

import Link from "next/link"
import {
  Cancel01Icon,
  Menu01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/theme-toggle"
import { Latency } from "@/components/latency"
import { NyClock } from "@/components/ny-clock"

export function BrandHeader() {
  const { state, toggleSidebar } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <header className="fixed z-50 w-full border-b border-border bg-background">
      <div className="flex h-12 items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="hidden size-8 md:flex"
            onClick={toggleSidebar}
          >
            <HugeiconsIcon
              icon={isCollapsed ? Menu01Icon : Cancel01Icon}
              strokeWidth={2}
              className="size-4"
            />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="size-8 md:hidden"
            onClick={toggleSidebar}
          >
            <HugeiconsIcon
              icon={Menu01Icon}
              strokeWidth={2}
              className="size-4"
            />
          </Button>

          <Link href="/" className="flex items-center">
            <Logo />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <NyClock />
          <span className="h-3 w-px bg-border" />
          <Latency />
          <span className="h-3 w-px bg-border" />
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
