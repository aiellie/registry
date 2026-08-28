"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  Folder01Icon,
  Forward01Icon,
  MoreHorizontalIcon,
  Delete01Icon,
  PlusSignIcon,
  ArrowUp01Icon,
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
import {
  projects as defaultProjects,
  type SidebarProject,
} from "@/lib/sidebar-data"

export function NavProjects({
  projects = defaultProjects,
}: {
  projects?: SidebarProject[]
}) {
  const { isMobile } = useSidebar()

  return (
    <Collapsible defaultOpen className="group/nav">
      <SidebarGroup>
        <SidebarGroupLabel
          render={<CollapsibleTrigger />}
          className="group/collapsible cursor-pointer"
        >
          <span>Projects</span>
          <HugeiconsIcon
            icon={ArrowUp01Icon}
            strokeWidth={1.5}
            className="ms-1 size-3 shrink-0 rotate-90 opacity-0 transition-all duration-200 group-focus-within/nav:opacity-100 group-hover/nav:opacity-100 group-data-panel-open/collapsible:rotate-180 rtl:-rotate-90 group-data-panel-open/collapsible:rtl:rotate-180"
          />
        </SidebarGroupLabel>
        <Tooltip>
          <TooltipTrigger
            render={
              <SidebarGroupAction
                title="Add Project"
                className="text-muted-foreground opacity-0 transition-opacity group-focus-within/nav:opacity-100 group-hover/nav:opacity-100 hover:text-sidebar-primary"
              >
                <HugeiconsIcon
                  icon={PlusSignIcon}
                  strokeWidth={2}
                  className="size-3.5"
                />
                <span className="sr-only">Add Project</span>
              </SidebarGroupAction>
            }
          />
          <TooltipContent side="right" align="center">
            Add Project
          </TooltipContent>
        </Tooltip>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    render={<a href={item.url} />}
                    tooltip={item.name}
                  >
                    <HugeiconsIcon
                      icon={item.icon}
                      strokeWidth={2}
                      className="size-4"
                    />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
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
                      <DropdownMenuItem>
                        <HugeiconsIcon
                          icon={Folder01Icon}
                          strokeWidth={2}
                          className="size-4"
                        />
                        <span>View Project</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <HugeiconsIcon
                          icon={Forward01Icon}
                          strokeWidth={2}
                          className="size-4"
                        />
                        <span>Share Project</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">
                        <HugeiconsIcon
                          icon={Delete01Icon}
                          strokeWidth={2}
                          className="size-4"
                        />
                        <span>Delete Project</span>
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
