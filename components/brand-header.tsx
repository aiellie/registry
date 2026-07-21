"use client"

import Link from "next/link"
import { useState } from "react"
import type { IconSvgElement } from "@hugeicons/react"
import {
  BotIcon,
  Cancel01Icon,
  Leaf01Icon,
  Menu01Icon,
  SourceCodeSquareIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Logo } from "@/components/logo"
import { SearchCommand } from "@/components/search-command"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const viewTabs: { value: string; label: string; icon: IconSvgElement }[] = [
  { value: "chat", label: "Chat", icon: SparklesIcon },
  { value: "agent", label: "Agent", icon: BotIcon },
  { value: "code", label: "Code", icon: SourceCodeSquareIcon },
  { value: "design", label: "Design", icon: Leaf01Icon },
]

export function BrandHeader() {
  const { state, toggleSidebar } = useSidebar()
  const isCollapsed = state === "collapsed"
  const [view, setView] = useState("chat")

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

        <div className="flex items-center gap-1">
          <ToggleGroup
            value={[view]}
            onValueChange={(next) => {
              if (next[0]) setView(next[0])
            }}
            spacing={1}
            className="me-1 hidden md:flex"
            aria-label="View"
          >
            {viewTabs.map((tab) => (
              <ToggleGroupItem
                key={tab.value}
                value={tab.value}
                className="gap-1.5 px-2.5 text-muted-foreground aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-xs aria-pressed:ring-1 aria-pressed:ring-border data-pressed:bg-background data-pressed:text-foreground data-pressed:shadow-xs data-pressed:ring-1 data-pressed:ring-border"
              >
                <HugeiconsIcon
                  icon={tab.icon}
                  strokeWidth={2}
                  className="size-4"
                />
                {tab.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <SearchCommand variant="header" />
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
