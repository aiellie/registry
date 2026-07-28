"use client"

import Link from "next/link"
import {
  LayoutAlignLeftIcon,
  LayoutAlignRightIcon,
  LayoutAlignBottomIcon,
  SidebarLeftIcon,
  SidebarRightIcon,
  SidebarBottomIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { BrandNavMenubar } from "@/components/brand-nav-menubar"
import { useBrandPanels } from "@/components/brand-panels"
import { LogoIcon } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { SearchCommand } from "@/components/search-command"


export function BrandHeader() {
  const { state, toggleSidebar } = useSidebar()
  const { rightOpen, bottomOpen, toggleRight, toggleBottom } = useBrandPanels()
  const isCollapsed = state === "collapsed"

  return (
    <header className="fixed z-50 w-full border-b border-border bg-background">
      <div className="flex h-10 items-center gap-2 px-2 sm:px-4">
        <div className="flex min-w-fit flex-1 items-center gap-2 sm:gap-4">
          <Link href="/" className="group flex shrink-0 items-center gap-2">
            <LogoIcon className="size-6 shrink-0" strokeWidth={1.5} fill="none" />
          </Link>
          <span className="hidden h-3 w-px bg-border lg:block" />
          <div className="hidden lg:block">
            <BrandNavMenubar />
          </div>
        </div>
        <div className="flex items-center">
          <SearchCommand variant="header" />
        </div>
        <div className="flex flex-1 shrink-0 items-center justify-end gap-1">
          <span className="mx-1 h-3 w-px bg-border" />
          <Tooltip>
            <TooltipTrigger
              render={
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
                  <span className="sr-only">Toggle sidebar</span>
                </Button>
              }
            />
            <TooltipContent side="bottom">
              {isCollapsed ? "Open sidebar" : "Close sidebar"}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
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
                  <span className="sr-only">Toggle sidebar</span>
                </Button>
              }
            />
            <TooltipContent side="bottom">Toggle sidebar</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button variant="ghost" size="icon-sm" onClick={toggleBottom}>
                  <HugeiconsIcon
                    icon={
                      bottomOpen ? SidebarBottomIcon : LayoutAlignBottomIcon
                    }
                    strokeWidth={2}
                    className="size-4 text-muted-foreground"
                  />
                  <span className="sr-only">Toggle bottom panel</span>
                </Button>
              }
            />
            <TooltipContent side="bottom">
              {bottomOpen ? "Close bottom panel" : "Open bottom panel"}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button variant="ghost" size="icon-sm" onClick={toggleRight}>
                  <HugeiconsIcon
                    icon={rightOpen ? SidebarRightIcon : LayoutAlignRightIcon}
                    strokeWidth={2}
                    className="size-4 text-muted-foreground"
                  />
                  <span className="sr-only">Toggle right panel</span>
                </Button>
              }
            />
            <TooltipContent side="bottom">
              {rightOpen ? "Close right panel" : "Open right panel"}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
  )
}
