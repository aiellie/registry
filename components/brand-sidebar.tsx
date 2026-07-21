"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { IconSvgElement } from "@hugeicons/react"
import {
  Alert02Icon,
  Analytics01Icon,
  Clock01Icon,
  Database01Icon,
  GridViewIcon,
  Home01Icon,
  Message01Icon,
  MoreHorizontalIcon,
  PlusSignIcon,
  Table01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
  SidebarRail
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href: string
  icon: IconSvgElement
  badge?: {
    text: string
  }
}

const mainNavItems: NavItem[] = [
  {
    title: "Home",
    href: "#",
    icon: Home01Icon,
  },
  {
    title: "Projects",
    href: "#projects",
    icon: GridViewIcon,
  },
  {
    title: "Databases",
    href: "#databases",
    icon: Database01Icon,
  },
  {
    title: "Tables",
    href: "#tables",
    icon: Table01Icon,
    badge: {
      text: "Beta",
    },
  },
  {
    title: "AI",
    href: "#ai",
    icon: Message01Icon,
    badge: {
      text: "Alpha",
    },
  },
]

const toolsNavItems: NavItem[] = [
  {
    title: "Alerts",
    href: "#alerts",
    icon: Alert02Icon,
  },
  {
    title: "Analytics",
    href: "#analytics",
    icon: Analytics01Icon,
  },
  {
    title: "History",
    href: "#history",
    icon: Clock01Icon,
  },
  {
    title: "More",
    href: "#more",
    icon: MoreHorizontalIcon,
  },
]

export function BrandSidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className={cn("mt-16", className)}
    >
      <SidebarHeader>
        <div className={cn(isCollapsed ? "py-2" : "p-2")}>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  className={cn(isCollapsed ? "size-8 p-0" : "w-full")}
                >
                  <HugeiconsIcon
                    icon={PlusSignIcon}
                    strokeWidth={2}
                    className="size-4"
                  />
                  {!isCollapsed && (
                    <>
                      <span>New Chat</span>
                      <Kbd className="ml-auto">⌘K</Kbd>
                    </>
                  )}
                </Button>
              }
            />
            <TooltipContent
              side="right"
              align="center"
              hidden={!isCollapsed}
            >
              New Chat
              <Kbd>⌘K</Kbd>
            </TooltipContent>
          </Tooltip>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Nav Items */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={
                      pathname === item.href ||
                      (pathname === "" && item.href === "/")
                    }
                    tooltip={item.title}
                  >
                    <HugeiconsIcon
                      icon={item.icon}
                      strokeWidth={2}
                      className="size-4"
                    />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge>{item.badge.text}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Tools Nav Items */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <HugeiconsIcon
                      icon={item.icon}
                      strokeWidth={2}
                      className="size-4"
                    />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge>{item.badge.text}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
