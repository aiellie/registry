"use client"

import {
  ArrowDown01Icon,
  ComponentIcon,
  BlocksIcon,
  Lightbulb,
  PuzzleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { usePanelRef } from "react-resizable-panels"

import {
  getItem,
  getItemIcon,
  groupByCategory,
  type SortMode,
} from "@/lib/items"
import { NavUser } from "@/components/registry/nav-user"
import { RegistryLogo } from "@/components/registry/registry-logo"
import { SearchCommand } from "@/components/registry/search-command"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Status, StatusIndicator } from "@/components/aiellie/ui/status"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import type { Component } from "@/lib/registry"
import { getBlocks, getComponents, getUIPrimitives } from "@/lib/registry"

const uiItems = getUIPrimitives()
const componentItems = getComponents()
const blockItems = getBlocks()
const allItems = [...blockItems, ...componentItems, ...uiItems]

const typeGroups = [
  { key: "blocks", title: "Blocks", icon: BlocksIcon, items: blockItems },
  {
    key: "components",
    title: "Components",
    icon: ComponentIcon,
    items: componentItems,
  },
  { key: "ui", title: "UI Primitives", icon: PuzzleIcon, items: uiItems },
]

const categoryGroups = groupByCategory(allItems).map((group) => ({
  key: group.category.id,
  title: group.category.label,
  icon: group.category.icon,
  items: group.items,
}))

/** Frames to keep re-checking for a laid-out scroll area before giving up. */
const MAX_ALIGN_FRAMES = 30

const SIDEBAR_PANEL_ID = "registry-sidebar"
// Matches --sidebar-width from the registry layout: calc(var(--spacing) * 72).
const SIDEBAR_PANEL_DEFAULT_SIZE = "18rem"
const SIDEBAR_PANEL_MIN_SIZE = "13rem"
const SIDEBAR_PANEL_MAX_SIZE = "32rem"
// Where dragging the handle inwards stops: the icon rail (--sidebar-width-icon)
// on pages that keep one, off-canvas on the pages that hide the sidebar. The
// rail floats, so the panel also has to carry the gutter around it — 3rem of
// buttons plus the 0.5rem inset on either side.
const SIDEBAR_PANEL_ICON_SIZE = "4rem"
const SIDEBAR_PANEL_OFFCANVAS_SIZE = "0px"

/** Pages that hide the sidebar completely instead of leaving an icon rail. */
const OFFCANVAS_PATHS = new Set(["/", "/cards"])

const gettingStartedItems = [
  { title: "Home", path: "/", icon: "home" },
  { title: "Design Tokens", path: "/tokens", icon: "tokens" },
  { title: "Icons", path: "/icons", icon: "icons" },
]

function RegistryItemGroup({
  title,
  groupIcon,
  items,
}: {
  title: string
  groupIcon: React.ComponentProps<typeof HugeiconsIcon>["icon"]
  items: Component[]
}) {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  return (
    <Collapsible defaultOpen={true}>
      <SidebarGroup>
        <CollapsibleTrigger className="group/collapsible w-full">
          <SidebarGroupLabel className="flex cursor-pointer items-center justify-between">
            <div className="flex min-w-0 items-center">
              <HugeiconsIcon
                icon={groupIcon}
                strokeWidth={2}
                className="size-3.5 shrink-0"
              />
              <span className="ms-1.5 transition-all duration-200">
                {title}
              </span>
            </div>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              strokeWidth={2}
              className="size-3.5 shrink-0 -rotate-90 transition-all duration-200 group-data-panel-open/collapsible:rotate-0"
            />
          </SidebarGroupLabel>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    isActive={pathname === `/registry/${item.name}`}
                    tooltip={item.title}
                    render={
                      <Link
                        onClick={() => setOpenMobile(false)}
                        href={`/registry/${item.name}`}
                      />
                    }
                  >
                    <HugeiconsIcon
                      icon={getItemIcon(item.name)}
                      strokeWidth={2}
                      className="shrink-0s size-3.5"
                    />
                    <span>{item.title}</span>
                    {getItem(item.name)?.isNew && (
                      <Status
                        variant="brand"
                        className="ms-auto border-transparent bg-transparent px-0"
                      >
                        <StatusIndicator />
                      </Status>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  )
}

export function RegistrySidebar({
  highlightedConfig,
  highlightedClients,
}: {
  highlightedConfig?: string
  highlightedClients?: Record<string, string>
} = {}) {
  const pathname = usePathname()
  const { setOpen, setOpenMobile, state, isMobile } = useSidebar()
  const [sort, setSort] = useState<SortMode>("category")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const hasScrolledRef = useRef(false)

  const groups = sort === "category" ? categoryGroups : typeGroups

  const isCollapsed = state === "collapsed"
  const collapsible = OFFCANVAS_PATHS.has(pathname) ? "offcanvas" : "icon"
  const collapsedSize =
    collapsible === "offcanvas"
      ? SIDEBAR_PANEL_OFFCANVAS_SIZE
      : SIDEBAR_PANEL_ICON_SIZE

  const panelRef = usePanelRef()
  const panelElementRef = useRef<HTMLDivElement>(null)
  // The width to hold the sidebar at: the default until a drag settles on
  // something else, so collapsing and reopening brings back the user's width.
  const desiredSizeRef = useRef<string>(SIDEBAR_PANEL_DEFAULT_SIZE)
  // Last state both sides agree on, so neither direction echoes the other back.
  // `null` until the observer below has taken its first measurement.
  const syncedRef = useRef<boolean | null>(null)
  // Read from inside the observer, which has to outlive both of them: it holds
  // the measurements that tell a drag apart from a window resize, and
  // `setOpen`'s identity changes on every single toggle.
  const isCollapsedRef = useRef(isCollapsed)
  const setOpenRef = useRef(setOpen)

  useEffect(() => {
    isCollapsedRef.current = isCollapsed
    setOpenRef.current = setOpen
  }, [isCollapsed, setOpen])

  // Everything the panel does off its own bat is handled here, because all of
  // it needs a laid-out group and the panel's `onResize` fires before the group
  // has registered its constraints. The group is observed too, so a group that
  // is measurable but a panel that has not moved still wakes this up.
  useEffect(() => {
    const panel = panelRef.current
    const element = panelElementRef.current
    const group = element?.parentElement
    if (!panel || !element || !group || isMobile) {
      return
    }

    let measured = false

    const observer = new ResizeObserver(() => {
      // Nothing can be sized against a group that has not been laid out: sizes
      // are stored as a share of the group, so a zero width turns every
      // constraint into a clamp against `maxSize`.
      if (group.offsetWidth === 0) {
        return
      }

      // First real measurement: apply whatever open state this page started in.
      // `defaultSize` alone cannot — it is resolved before the first paint,
      // against a group that has no width to divide yet.
      if (!measured) {
        measured = true
        syncedRef.current = isCollapsedRef.current
        if (isCollapsedRef.current) {
          panel.collapse()
        } else {
          panel.resize(desiredSizeRef.current)
        }
        return
      }

      const collapsed = panel.isCollapsed()
      if (!collapsed) {
        desiredSizeRef.current = `${element.offsetWidth}px`
      }

      // Dragging the handle past the collapse threshold toggles the sidebar the
      // other way, so the trigger and ⌘B stay in step with it.
      if (collapsed !== syncedRef.current) {
        syncedRef.current = collapsed
        setOpenRef.current(!collapsed)
      }
    })

    observer.observe(group)
    observer.observe(element)
    return () => observer.disconnect()
  }, [isMobile, panelRef])

  // The header trigger and ⌘B toggle the sidebar: drive the panel from them.
  useEffect(() => {
    const panel = panelRef.current
    if (
      !panel ||
      isMobile ||
      syncedRef.current === null ||
      syncedRef.current === isCollapsed
    ) {
      return
    }

    syncedRef.current = isCollapsed
    if (isCollapsed) {
      panel.collapse()
    } else {
      panel.resize(desiredSizeRef.current)
    }
  }, [isCollapsed, isMobile, panelRef])

  // The list is ~3000px tall, so deep-linking to an item (or re-sorting the
  // groups) usually leaves the active entry far outside the viewport. Bring it
  // back into view, but leave the scroll position alone when it is already
  // visible so clicking a neighbouring item never yanks the list around.
  useLayoutEffect(() => {
    /**
     * Nothing here may be hoisted out of the retry: Base UI swaps the viewport
     * element after mount, so a node captured earlier ends up detached (and
     * permanently 0px tall). Re-read it every attempt.
     */
    const align = () => {
      const viewport = scrollAreaRef.current?.querySelector<HTMLElement>(
        '[data-slot="scroll-area-viewport"]'
      )
      const active = viewport?.querySelector<HTMLElement>("[data-active]")

      if (!viewport || !active || viewport.clientHeight === 0) {
        return false
      }

      const itemRect = active.getBoundingClientRect()
      const viewportRect = viewport.getBoundingClientRect()
      const isVisible =
        itemRect.top >= viewportRect.top &&
        itemRect.bottom <= viewportRect.bottom

      if (!isVisible) {
        viewport.scrollTo({
          top:
            viewport.scrollTop +
            itemRect.top -
            viewportRect.top -
            (viewportRect.height - itemRect.height) / 2,
          // Jump on the first pass (it reads as the page's initial state),
          // animate afterwards, once the user is already looking at the list.
          behavior: hasScrolledRef.current ? "smooth" : "instant",
        })
      }

      hasScrolledRef.current = true
      return true
    }

    // A client-side navigation lands on the first try, before the browser
    // paints, so the list is never seen at the wrong offset. A fresh page load
    // needs the scroll area to be laid out first, which takes a frame or two.
    if (align()) {
      return
    }

    let frame = 0
    let attempts = 0

    const retry = () => {
      if (align() || (attempts += 1) > MAX_ALIGN_FRAMES) {
        return
      }
      frame = requestAnimationFrame(retry)
    }

    frame = requestAnimationFrame(retry)

    return () => cancelAnimationFrame(frame)
  }, [pathname, sort])

  const sidebar = (
    <Sidebar
      variant="sidebar"
      collapsible={collapsible}
      className={cn(
        // The panel owns the width, so the rail sticks to the top of the
        // viewport instead of being fixed. That leaves the document as the
        // scrollport, which every `sticky` header on the site depends on.
        "sticky inset-y-auto top-0 h-svh w-full overflow-hidden transition-none",
        // Floating: the container is only the gutter, the inner card is the
        // sidebar. No border either — the card's own ring draws its edge.
        "p-2 group-data-[collapsible=icon]:w-full group-data-[side=left]:border-e-0",
        // Glass. The descendant selector outranks the inner's own `bg-sidebar`,
        // so the tint wins wherever it lands in the sheet.
        "[&_[data-slot=sidebar-inner]]:rounded-2xl",
        "[&_[data-slot=sidebar-inner]]:bg-sidebar/25 [&_[data-slot=sidebar-inner]]:backdrop-blur-2xl [&_[data-slot=sidebar-inner]]:backdrop-saturate-200",
        "[&_[data-slot=sidebar-inner]]:ring-1 [&_[data-slot=sidebar-inner]]:ring-sidebar-border/50",
        "[&_[data-slot=sidebar-inner]]:shadow-lg [&_[data-slot=sidebar-inner]]:shadow-black/5",
        "dark:[&_[data-slot=sidebar-inner]]:bg-sidebar/20 dark:[&_[data-slot=sidebar-inner]]:shadow-black/40"
      )}
    >
      <SidebarHeader className="">
        <div className="flex items-center px-2 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <RegistryLogo />
          </Link>
        </div>
        <div className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <SearchCommand sort={sort} onSortChange={setSort} />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea
          ref={scrollAreaRef}
          className="h-full w-full pe-2 group-data-[collapsible=icon]:pe-0"
        >
          <Collapsible defaultOpen={true}>
            <SidebarGroup>
              <CollapsibleTrigger className="group/collapsible w-full">
                <SidebarGroupLabel className="flex cursor-pointer items-center justify-between">
                  <div className="flex min-w-0 items-center">
                    <HugeiconsIcon
                      icon={Lightbulb}
                      strokeWidth={2}
                      className="size-3.5 shrink-0"
                    />
                    <span className="ms-1.5 transition-all duration-200">
                      Getting Started
                    </span>
                  </div>
                  <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    strokeWidth={2}
                    className="size-3.5 shrink-0 -rotate-90 transition-all duration-200 group-data-panel-open/collapsible:rotate-0"
                  />
                </SidebarGroupLabel>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {gettingStartedItems.map((item) => (
                      <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton
                          isActive={pathname === item.path}
                          tooltip={item.title}
                          render={
                            <Link
                              onClick={() => setOpenMobile(false)}
                              href={item.path}
                            />
                          }
                        >
                          <HugeiconsIcon
                            icon={getItemIcon(item.icon)}
                            strokeWidth={2}
                          />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>

          {groups.map((group) => (
            <RegistryItemGroup
              key={group.key}
              title={group.title}
              groupIcon={group.icon}
              items={group.items}
            />
          ))}
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="">
        <NavUser
          user={{
            name: "Ellie",
            email: "hello@aiellie.dev",
            avatar: "/avatars/aiellie.png",
          }}
          highlightedConfig={highlightedConfig}
          highlightedClients={highlightedClients}
        />
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
        collapsedSize={collapsedSize}
        // Only read on mount, so it has to agree with that first render:
        // otherwise the pages that start collapsed paint open once.
        defaultSize={isCollapsed ? collapsedSize : SIDEBAR_PANEL_DEFAULT_SIZE}
        minSize={SIDEBAR_PANEL_MIN_SIZE}
        maxSize={SIDEBAR_PANEL_MAX_SIZE}
        groupResizeBehavior="preserve-pixel-size"
        // The panel is the sidebar's in-flow footprint now, so the sidebar's
        // own spacer would double it up.
        className="[&_[data-slot=sidebar-gap]]:hidden [&>[data-slot=sidebar]]:h-full"
        style={{ overflow: "visible", maxHeight: "none" }}
      >
        {sidebar}
      </ResizablePanel>
      <ResizableHandle
        withHandle
        className={cn(
          // The group is as tall as the page, so pin the handle to the
          // viewport — otherwise its grip centres far down a long page.
          "sticky top-0 h-svh self-start",
          // A floating sidebar has no edge to grab, so the grip is the whole
          // affordance: it stays visible, and the bar itself is the hit area
          // rather than the 1px divider the default draws.
          "w-2.5 bg-transparent"
        )}
      />
    </>
  )
}
