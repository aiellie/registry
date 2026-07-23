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
import { useState } from "react"

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
import { ScrollArea } from "@/components/ui/scroll-area"
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
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
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

const gettingStartedItems = [
  { title: "Home", path: "/", icon: "home" },
  { title: "Design Tokens", path: "/tokens", icon: "tokens" },
  { title: "Icons", path: "/tokens/icons", icon: "icons" },
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
              <span className="ms-1.5 transition-all duration-200">{title}</span>
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
                      className="size-3.5 shrink-0"
                    />
                    <span>{item.title}</span>
                    {getItem(item.name)?.isNew && (
                      <span className="ms-auto rounded-full bg-primary/10 px-1.5 py-px text-[10px] font-medium text-primary">
                        New
                      </span>
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

export function RegistrySidebar() {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()
  const [sort, setSort] = useState<SortMode>("category")

  const groups = sort === "category" ? categoryGroups : typeGroups

  return (
    <Sidebar collapsible={pathname === "/" || pathname === "/cards" ? "offcanvas" : "icon"}>
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
        <ScrollArea className="h-full w-full pe-2 group-data-[collapsible=icon]:pe-0">
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
            email: "ellie@aiellie.dev",
            avatar: "/avatars/aiellie.png",
          }}
        />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
