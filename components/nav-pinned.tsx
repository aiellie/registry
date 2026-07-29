"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowUp01Icon,
  Delete01Icon,
  MoreHorizontalIcon,
  PencilEdit02Icon,
  PinOffIcon,
  Share08Icon,
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
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ChatStatusIndicator } from "@/components/nav-chats"
import { chatTypeIcons, type SidebarChat } from "@/lib/sidebar-data"

export function NavPinned({ chats }: { chats: SidebarChat[] }) {
  const { isMobile } = useSidebar()

  return (
    <Collapsible defaultOpen className="group/nav">
      <SidebarGroup>
        <SidebarGroupLabel
          render={<CollapsibleTrigger />}
          className="group/collapsible cursor-pointer"
        >
          <span>Pinned</span>
          <HugeiconsIcon
            icon={ArrowUp01Icon}
            strokeWidth={1.5}
            className="ms-1 size-3 shrink-0 rotate-90 opacity-0 transition-all duration-200 group-focus-within/nav:opacity-100 group-hover/nav:opacity-100 group-data-panel-open/collapsible:rotate-180 rtl:-rotate-90 group-data-panel-open/collapsible:rtl:rotate-180"
          />
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    render={<a href={item.url} />}
                    tooltip={item.name}
                  >
                    <HugeiconsIcon
                      icon={chatTypeIcons[item.type]}
                      strokeWidth={2}
                      className="size-4"
                    />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                  <ChatStatusIndicator chat={item} />
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <SidebarMenuAction showOnHover>
                          <HugeiconsIcon
                            icon={MoreHorizontalIcon}
                            strokeWidth={2}
                            className="size-4"
                          />
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
                        <HugeiconsIcon
                          icon={PinOffIcon}
                          strokeWidth={2}
                          className="size-4"
                        />
                        <span>Unpin</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <HugeiconsIcon
                          icon={PencilEdit02Icon}
                          strokeWidth={2}
                          className="size-4"
                        />
                        <span>Rename</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <HugeiconsIcon
                          icon={Share08Icon}
                          strokeWidth={2}
                          className="size-4"
                        />
                        <span>Share</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        className="cursor-pointer"
                      >
                        <HugeiconsIcon
                          icon={Delete01Icon}
                          strokeWidth={2}
                          className="size-4"
                        />
                        <span>Delete Chat</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  )
}
