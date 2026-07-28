"use client"

import * as React from "react"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import {
  Share08Icon,
  MoreHorizontalIcon,
  PencilEdit02Icon,
  Delete01Icon,
  Comment02Icon,
  PlusSignIcon,
  ArrowUp01Icon,
  Pin02Icon,
  Archive02Icon,
  Calendar01Icon,
  Calendar03Icon,
  Cancel01Icon,
  CheckListIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Clock02Icon,
  DashboardCircleIcon,
  Infinity01Icon,
  Layers01Icon,
  Notification01Icon,
  Sorting05Icon,
  Tag01Icon,
} from "@hugeicons/core-free-icons"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Kbd } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

type ChatFilterId = "type" | "status" | "activity" | "groupBy"

interface ChatFilter {
  id: ChatFilterId
  label: string
  icon: IconSvgElement
  /** Divider above the submenu trigger. */
  separatorBefore?: boolean
  options: {
    value: string
    label: string
    icon: IconSvgElement
    disabled?: boolean
    /** Divider above the option. */
    separatorBefore?: boolean
  }[]
}

const chatFilters: ChatFilter[] = [
  {
    id: "type",
    label: "Type",
    icon: Tag01Icon,
    options: [
      { value: "all", label: "All", icon: Layers01Icon },
      { value: "chat", label: "Chat", icon: Comment02Icon },
      { value: "task", label: "Task", icon: CheckListIcon },
    ],
  },
  {
    id: "status",
    label: "Status",
    icon: CheckmarkCircle02Icon,
    options: [
      { value: "active", label: "Active", icon: CheckmarkCircle02Icon },
      { value: "archived", label: "Archived", icon: Archive02Icon },
      { value: "all", label: "All", icon: Layers01Icon },
    ],
  },
  {
    id: "activity",
    label: "Last activity",
    icon: Clock01Icon,
    options: [
      { value: "1d", label: "1d", icon: Clock01Icon },
      { value: "3d", label: "3d", icon: Clock02Icon },
      { value: "7d", label: "7d", icon: Calendar01Icon },
      { value: "30d", label: "30d", icon: Calendar03Icon },
      { value: "all", label: "All", icon: Infinity01Icon },
    ],
  },
  {
    id: "groupBy",
    label: "Group by",
    icon: Sorting05Icon,
    separatorBefore: true,
    options: [
      { value: "date", label: "Date", icon: Calendar01Icon },
      { value: "type", label: "Type", icon: Tag01Icon },
      {
        value: "project",
        label: "Project",
        icon: DashboardCircleIcon,
        disabled: true,
      },
      { value: "unread", label: "Unread", icon: Notification01Icon },
      { value: "status", label: "Status", icon: CheckmarkCircle02Icon },
      {
        value: "none",
        label: "None",
        icon: Cancel01Icon,
        separatorBefore: true,
      },
    ],
  },
]

const defaultChatFilters: Record<ChatFilterId, string> = {
  type: "all",
  status: "active",
  activity: "all",
  groupBy: "none",
}

export function NavChats({
  chats,
}: {
  chats: {
    name: string
    url: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const [filters, setFilters] =
    React.useState<Record<ChatFilterId, string>>(defaultChatFilters)

  return (
    <Collapsible defaultOpen className="group/nav">
      <SidebarGroup>
        <SidebarGroupLabel
          render={<CollapsibleTrigger />}
          className="group/collapsible cursor-pointer"
        >
          <span>Recents</span>
          <HugeiconsIcon
            icon={ArrowUp01Icon}
            strokeWidth={1.5}
            className="ms-1 size-3 shrink-0 rotate-90 opacity-0 transition-all duration-200 group-focus-within/nav:opacity-100 group-hover/nav:opacity-100 group-data-panel-open/collapsible:rotate-180 rtl:-rotate-90 group-data-panel-open/collapsible:rtl:rotate-180"
          />
        </SidebarGroupLabel>
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger
              render={
                <DropdownMenuTrigger
                  render={
                    <SidebarGroupAction
                      title="Filter Chats"
                      className="end-9 opacity-0 transition-opacity group-focus-within/nav:opacity-100 group-hover/nav:opacity-100 data-popup-open:opacity-100 text-muted-foreground hover:text-sidebar-primary"
                    >
                      <HugeiconsIcon
                        icon={MoreHorizontalIcon}
                        strokeWidth={2}
                        className="size-3.5"
                      />
                      <span className="sr-only">Filter Chats</span>
                    </SidebarGroupAction>
                  }
                />
              }
            />
            <TooltipContent side="right" align="center">
              Filter Chats
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent
            className="w-52 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="start"
          >
            {chatFilters.map((filter) => (
              <React.Fragment key={filter.id}>
                {filter.separatorBefore && <DropdownMenuSeparator />}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <HugeiconsIcon icon={filter.icon} strokeWidth={2} />
                    {/* Absorbs the free space so the value sits next to the chevron. */}
                    <span className="grow">{filter.label}</span>
                    <span className="text-muted-foreground">
                      {
                        filter.options.find(
                          (option) => option.value === filters[filter.id]
                        )?.label
                      }
                    </span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={filters[filter.id]}
                      onValueChange={(next) =>
                        setFilters((current) => ({
                          ...current,
                          [filter.id]: next as string,
                        }))
                      }
                    >
                      {filter.options.map((option) => (
                        <React.Fragment key={option.value}>
                          {option.separatorBefore && <DropdownMenuSeparator />}
                          <DropdownMenuRadioItem
                            value={option.value}
                            disabled={option.disabled}
                          >
                            <HugeiconsIcon icon={option.icon} strokeWidth={2} />
                            {option.label}
                          </DropdownMenuRadioItem>
                        </React.Fragment>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Tooltip>
          <TooltipTrigger
            render={
              <SidebarGroupAction
                title="New Chat"
                className="opacity-0 transition-opacity group-focus-within/nav:opacity-100 group-hover/nav:opacity-100 text-muted-foreground hover:text-sidebar-primary"
              >
                <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="size-3.5" />
                <span className="sr-only">New Chat</span>
              </SidebarGroupAction>
            }
          />
          <TooltipContent side="right" align="center">
            New Chat <Kbd>⌘N</Kbd>
          </TooltipContent>
        </Tooltip>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton render={<a href={item.url} />} tooltip={item.name}>
                    <HugeiconsIcon icon={Comment02Icon} strokeWidth={2} className="size-4" />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <SidebarMenuAction showOnHover>
                          <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} className="size-4 text-muted-foreground hover:text-sidebar-primary" />
                          <span className="sr-only">More</span>
                        </SidebarMenuAction>
                      }
                    />
                    <DropdownMenuContent
                      className="w-48 rounded-lg"
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                    >
                      <DropdownMenuItem className="cursor-pointer">
                        <HugeiconsIcon icon={Pin02Icon} strokeWidth={2} className="size-4" />
                        <span>Pin</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <HugeiconsIcon icon={PencilEdit02Icon} strokeWidth={2} className="size-4" />
                        <span>Rename</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <HugeiconsIcon icon={Share08Icon} strokeWidth={2} className="size-4" />
                        <span>Share</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" className="cursor-pointer">
                        <HugeiconsIcon icon={Delete01Icon} strokeWidth={2} className="size-4" />
                        <span>Delete Chat</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton className="text-sidebar-foreground/70" tooltip="More">
                  <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} className="size-4" />
                  <span>More</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  )
}
