"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { IconSvgElement } from "@hugeicons/react"
import {
  LibraryIcon,
  PlugIcon,
  PlusSignIcon,
  WebDesign02Icon,
  Calendar01Icon,
  Folder01Icon,
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
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { NavProjects } from "@/components/nav-projects"
import { NavChats } from "@/components/nav-chats"
import { NavUser } from "@/components/nav-user"
import { SearchCommand } from "@/components/search-command"



interface NavItem {
  title: string
  href: string
  icon: IconSvgElement
  badge?: {
    text: string
    className?: string
  }
}

const mainNavItems: NavItem[] = [
  {
    title: "Library",
    href: "#library",
    icon: LibraryIcon,
  },
  {
    title: "Scheduled",
    href: "#scheduled",
    icon: Calendar01Icon,
  },
  {
    title: "Plugins",
    href: "#plugins",
    icon: PlugIcon,
  },
  {
    title: "Sites",
    href: "#sites",
    icon: WebDesign02Icon,
    badge: {
      text: "New",
      className:
        "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    },
  },
]

const data = { 
  user: {
    name: "aiellie",
    email: "hello@aiellie.dev",
    avatar: "/avatars/aiellie.png",
  },
  projects: [
    {
      name: "Portfolio",
      url: "#",
      icon: Folder01Icon,
    },
    {
      name: "Design Registry",
      url: "#",
      icon: Folder01Icon,
    },
    {
      name: "MCP",
      url: "#",
      icon: Folder01Icon,
    },
  ],
  chats: [
    {
      name: "Onboarding flow ideas",
      url: "#",
    },
    {
      name: "Q3 roadmap draft",
      url: "#",
    },
    {
      name: "Bug triage notes",
      url: "#",
    },
  ],
}

export function BrandSidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className={cn(
        "inset-auto top-[var(--header-height,3rem)] bottom-[var(--footer-height,2.5rem)] h-auto",
        className
      )}
    >
      <SidebarHeader>
        <div className={cn(isCollapsed ? "py-2" : "px-0 pt-2")}>
          <div
            className={cn(
              "flex gap-2",
              isCollapsed ? "flex-col items-center" : "items-center"
            )}
          >
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="outline"
                    className={cn(isCollapsed ? "size-8 p-0" : "flex-1")}
                  >
                    <HugeiconsIcon
                      icon={PlusSignIcon}
                      strokeWidth={2}
                      className="size-4"
                    />
                    {!isCollapsed && (
                      <>
                        <span>New Chat</span>
                        <Kbd className="ml-auto text-xs">⌘ N</Kbd>
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
                <Kbd className="text-xs">⌘ N</Kbd>
              </TooltipContent>
            </Tooltip>

            <SearchCommand variant="icon" />
          </div>
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
                    <SidebarMenuBadge className={item.badge.className}>
                      {item.badge.text}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <NavProjects projects={data.projects} />
        <NavChats chats={data.chats} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
