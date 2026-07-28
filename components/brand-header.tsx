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

import { useBrandPanels } from "@/components/brand-panels"
import { LogoIcon, LogoWordmark } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function BrandHeader() {
  const { state, toggleSidebar } = useSidebar()
  const { rightOpen, bottomOpen, toggleRight, toggleBottom } = useBrandPanels()
  const isCollapsed = state === "collapsed"

  return (
    <header className="fixed z-50 w-full border-b border-border bg-background">
      <div className="flex h-12 items-center justify-between px-3">
        <div className="flex items-center gap-4">
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

          <Link href="/" className="group flex items-center gap-2">
            <LogoIcon className="size-6" />
            <LogoWordmark as="span" className="text-sm font-medium" />
          </Link>
        </div>
        <div className="flex items-center gap-1">
          <span className="mx-1 h-3 w-px bg-border" />
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="hidden md:flex"
                  onClick={toggleBottom}
                >
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
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="hidden md:flex"
                  onClick={toggleRight}
                >
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
