"use client"

import * as React from "react"

import {
  DashboardSpeed02Icon,
  Logout01Icon,
  MessageQuestionIcon,
  MoreVerticalCircle01Icon,
  SettingsIcon,
  SmileIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { SettingsDialog } from "@/components/settings-dialog"
import { FeedbackForm } from "@/components/feedback-form"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile, state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const [feedbackOpen, setFeedbackOpen] = React.useState(false)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="aria-expanded:bg-sidebar-accent aria-expanded:text-sidebar-accent-foreground"
              />
            }
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
            <HugeiconsIcon
              icon={MoreVerticalCircle01Icon}
              strokeWidth={1.5}
              className="ml-auto size-4"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-64 rounded-2xl"
            side={isMobile ? "bottom" : isCollapsed ? "right" : "top"}
            align="start"
            sideOffset={8}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2.5 px-1.5 py-1.5 text-sm">
                  <Avatar className="size-6 rounded-full">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-full">AE</AvatarFallback>
                  </Avatar>
                  <span className="truncate font-medium">{user.name}</span>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <HugeiconsIcon
                    icon={DashboardSpeed02Icon}
                    strokeWidth={1.5}
                    className="size-4"
                  />
                  Usage remaining
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="min-w-56">
                  <div className="flex flex-col gap-2 p-1.5 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <span>Session</span>
                      <span className="text-muted-foreground tabular-nums">
                        72%
                      </span>
                    </div>
                    <Progress value={72} max={100} aria-label="Session usage" />
                    <span className="text-xs text-muted-foreground">
                      Resets at 5:00 PM
                    </span>
                  </div>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem>
                <HugeiconsIcon
                  icon={SmileIcon}
                  strokeWidth={1.5}
                  className="size-4"
                />
                Show pet
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                <HugeiconsIcon
                  icon={SettingsIcon}
                  strokeWidth={1.5}
                  className="size-4"
                />
                Settings
                <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFeedbackOpen(true)}>
                <HugeiconsIcon
                  icon={MessageQuestionIcon}
                  strokeWidth={1.5}
                  className="size-4"
                />
                Share feedback
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive">
                <HugeiconsIcon
                  icon={Logout01Icon}
                  strokeWidth={1.5}
                  className="size-4"
                />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      <FeedbackForm open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </SidebarMenu>
  )
}
