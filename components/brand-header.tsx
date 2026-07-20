"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Cancel01Icon,
  HelpCircleIcon,
  Menu01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Logo } from "@/components/logo"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSidebar } from "@/components/ui/sidebar"

export function BrandHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { state, toggleSidebar } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <header className="fixed z-50 w-full border-b border-border bg-background">
      <div className="flex h-16 items-center justify-between px-2">
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

        <div className="hidden items-center gap-1 md:flex">
          {isSearchOpen ? (
            <div className="relative">
              <Input
                type="text"
                placeholder="Search"
                className="h-9 w-64 ps-9"
                autoFocus
                onBlur={() => setIsSearchOpen(false)}
              />
              <HugeiconsIcon
                icon={Search01Icon}
                strokeWidth={2}
                className="absolute start-3 top-2.5 size-4 text-foreground"
              />
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-foreground"
              onClick={() => setIsSearchOpen(true)}
            >
              <HugeiconsIcon
                icon={Search01Icon}
                strokeWidth={2}
                className="size-4"
              />
              Search
            </Button>
          )}

          <Button variant="ghost" size="sm" className="text-foreground">
            <HugeiconsIcon
              icon={HelpCircleIcon}
              strokeWidth={2}
              className="size-4"
            />
            Support
          </Button>

          <Button variant="ghost" size="sm" className="text-foreground">
            Upgrade Trial
          </Button>

          <Avatar className="size-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <span className="text-xs">ME</span>
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex gap-2 md:hidden">
          <Button variant="ghost" size="sm" className="text-foreground">
            <HugeiconsIcon
              icon={Search01Icon}
              strokeWidth={2}
              className="size-5"
            />
          </Button>
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <span className="text-xs">ME</span>
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
