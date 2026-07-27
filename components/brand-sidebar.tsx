"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { TeamSwitcher } from "@/components/team-switcher"

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
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { teams, user } from "@/lib/sidebar-data"
import { NavChats } from "@/components/nav-chats"
import { NavUser } from "@/components/nav-user"
import { SearchCommand } from "@/components/search-command"

export function BrandSidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const [activeTeamName, setActiveTeamName] = React.useState(teams[0].name)
  const activeTeam =
    teams.find((team) => team.name === activeTeamName) ?? teams[0]

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
        <TeamSwitcher
          teams={teams}
          activeTeam={activeTeam.name}
          onTeamChange={setActiveTeamName}
        />
        <div className={cn(isCollapsed ? "py-0" : "px-0 pt-0")}>
          <div
            className={cn(
              "flex gap-2",
              isCollapsed ? "flex-col items-center" : "items-center"
            )}
          >
            <SearchCommand variant="sidebar" />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {activeTeam.groups.map((group, index) => (
          <SidebarGroup key={group.label ?? `group-${index}`}>
            {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
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
                      <SidebarMenuBadge className={item.badge.className}>
                        {item.badge.text}
                      </SidebarMenuBadge>
                    )}
                    {item.action && (
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <SidebarMenuAction
                              title={item.action.title}
                              showOnHover
                            >
                              <HugeiconsIcon
                                icon={item.action.icon}
                                strokeWidth={2}
                                className="size-4"
                              />
                              <span className="sr-only">
                                {item.action.title}
                              </span>
                            </SidebarMenuAction>
                          }
                        />
                        <TooltipContent side="right" align="center">
                          {item.action.title}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        {activeTeam.chats && <NavChats chats={activeTeam.chats} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
