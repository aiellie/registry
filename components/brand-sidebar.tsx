"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { usePanelRef } from "react-resizable-panels"
import { TeamSwitcher } from "@/components/team-switcher"

import { Kbd } from "@/components/ui/kbd"
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable"
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
  SidebarFooter,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { teams, user } from "@/lib/sidebar-data"
import { NavChats } from "@/components/nav-chats"
import { NavUser } from "@/components/nav-user"
import { SearchCommand } from "@/components/search-command"

const SIDEBAR_PANEL_ID = "sidebar"
// Matches --sidebar-width from the shell layout: calc(var(--spacing) * 72).
const SIDEBAR_PANEL_DEFAULT_SIZE = "18rem"
const SIDEBAR_PANEL_MIN_SIZE = "12rem"
const SIDEBAR_PANEL_MAX_SIZE = "28rem"
// Dragging the handle in stops at the icon rail (--sidebar-width-icon), while
// the header trigger and ⌘B take the sidebar all the way off-canvas.
const SIDEBAR_PANEL_ICON_SIZE = "3rem"
const SIDEBAR_PANEL_OFFCANVAS_SIZE = "0px"

export function BrandSidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const { state, isMobile, setOpen } = useSidebar()
  const isCollapsed = state === "collapsed"
  const panelRef = usePanelRef()
  const panelElementRef = React.useRef<HTMLDivElement>(null)
  const [collapsible, setCollapsible] = React.useState<"offcanvas" | "icon">(
    "icon"
  )
  const [activeTeamName, setActiveTeamName] = React.useState(teams[0].name)
  const activeTeam =
    teams.find((team) => team.name === activeTeamName) ?? teams[0]

  // Last state both sides agree on, so neither direction echoes the other back.
  // It also keeps the panel API untouched on mount, before the group has
  // registered its constraints.
  const syncedRef = React.useRef(isCollapsed)

  // The header trigger and ⌘B toggle the sidebar: drive the panel from them.
  React.useEffect(() => {
    const panel = panelRef.current
    if (!panel || isMobile || syncedRef.current === isCollapsed) {
      return
    }

    // Swap the collapsed size first; the re-run below does the collapsing.
    if (isCollapsed && collapsible !== "offcanvas") {
      setCollapsible("offcanvas")
      return
    }

    syncedRef.current = isCollapsed
    if (isCollapsed) {
      panel.collapse()
    } else {
      // Always reopen at the sidebar width, whatever the last drag left behind.
      panel.resize(SIDEBAR_PANEL_DEFAULT_SIZE)
      setCollapsible("icon")
    }
  }, [collapsible, isCollapsed, isMobile, panelRef])

  // Dragging the handle past the collapse threshold toggles it the other way.
  // The panel `onResize` prop would fire before the group registers its
  // constraints, so watch the panel element itself instead.
  React.useEffect(() => {
    const panel = panelRef.current
    const element = panelElementRef.current
    if (!panel || !element || isMobile) {
      return
    }

    let measured = false
    const observer = new ResizeObserver(() => {
      // Skip the observer's initial call: nothing has changed yet.
      if (!measured) {
        measured = true
        return
      }

      const collapsed = panel.isCollapsed()
      if (collapsed !== syncedRef.current) {
        syncedRef.current = collapsed
        // Back at full size, so the next drag stops at the icon rail again.
        if (!collapsed) {
          setCollapsible("icon")
        }
        setOpen(!collapsed)
      }
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [isMobile, panelRef, setOpen])

  const sidebar = (
    <Sidebar
      variant="sidebar"
      collapsible={collapsible}
      className={cn(
        // The panel owns the width and position, the sidebar just fills it.
        "relative inset-y-auto h-full w-full transition-none",
        "group-data-[collapsible=icon]:w-full group-data-[side=left]:border-e-0",
        "data-[side=left]:group-data-[collapsible=offcanvas]:left-0",
        className
      )}
    >
      <SidebarHeader className="pb-0">
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
                      tooltip={
                        item.kbd
                          ? {
                              children: (
                                <>
                                  {item.title} <Kbd>{item.kbd}</Kbd>
                                </>
                              ),
                            }
                          : item.title
                      }
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
                    {item.kbd && (
                      <SidebarMenuBadge className="px-0 transition-opacity group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 md:opacity-0">
                        <Kbd>{item.kbd}</Kbd>
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
    </Sidebar>
  )

  // On mobile the sidebar is a sheet, so it stays out of the panel group.
  if (isMobile) {
    return sidebar
  }

  return (
    <>
      <ResizablePanel
        id={SIDEBAR_PANEL_ID}
        panelRef={panelRef}
        elementRef={panelElementRef}
        collapsible
        collapsedSize={
          collapsible === "offcanvas"
            ? SIDEBAR_PANEL_OFFCANVAS_SIZE
            : SIDEBAR_PANEL_ICON_SIZE
        }
        defaultSize={SIDEBAR_PANEL_DEFAULT_SIZE}
        minSize={SIDEBAR_PANEL_MIN_SIZE}
        maxSize={SIDEBAR_PANEL_MAX_SIZE}
        groupResizeBehavior="preserve-pixel-size"
        style={{ overflow: "hidden" }}
        className="[&>[data-slot=sidebar]]:h-full [&_[data-slot=sidebar-gap]]:hidden"
      >
        {sidebar}
      </ResizablePanel>
      <ResizableHandle
        withHandle
        className={cn(
          "[&>div]:opacity-0 [&>div]:transition-opacity",
          "data-[separator=hover]:[&>div]:opacity-100",
          "data-[separator=active]:[&>div]:opacity-100",
          "data-[separator=focus]:[&>div]:opacity-100"
        )}
      />
    </>
  )
}
