"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  Share08Icon,
  MoreHorizontalIcon,
  PencilEdit02Icon,
  Delete01Icon,
  BubbleChatIcon,
  PlusSignIcon,
  ArrowDown01Icon,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

export function NavChats({
  chats,
}: {
  chats: {
    name: string
    url: string
  }[]
}) {
  const { isMobile } = useSidebar()

  return (
    <Collapsible defaultOpen className="group/nav">
      <SidebarGroup>
        <SidebarGroupLabel
          render={<CollapsibleTrigger />}
          className="group/collapsible cursor-pointer"
        >
          <span>Chats</span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            strokeWidth={2}
            className="ms-1 size-3.5 shrink-0 opacity-0 transition-all duration-200 group-focus-within/nav:opacity-100 group-hover/nav:opacity-100 group-data-panel-open/collapsible:rotate-180"
          />
        </SidebarGroupLabel>
        <Tooltip>
          <TooltipTrigger
            render={
              <SidebarGroupAction
                title="New Chat"
                className="opacity-0 transition-opacity group-focus-within/nav:opacity-100 group-hover/nav:opacity-100"
              >
                <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="size-4" />
                <span className="sr-only">New Chat</span>
              </SidebarGroupAction>
            }
          />
          <TooltipContent side="right" align="center">
            New Chat
          </TooltipContent>
        </Tooltip>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton render={<a href={item.url} />} tooltip={item.name}>
                    <HugeiconsIcon icon={BubbleChatIcon} strokeWidth={2} className="size-4" />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <SidebarMenuAction showOnHover>
                          <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} className="size-4" />
                          <span className="sr-only">More</span>
                        </SidebarMenuAction>
                      }
                    />
                    <DropdownMenuContent
                      className="w-48 rounded-lg"
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                    >
                      <DropdownMenuItem>
                        <HugeiconsIcon icon={PencilEdit02Icon} strokeWidth={2} className="size-4" />
                        <span>Rename Chat</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <HugeiconsIcon icon={Share08Icon} strokeWidth={2} className="size-4" />
                        <span>Share Chat</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">
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
