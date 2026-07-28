"use client"

import {
  Cancel01Icon,
  Comment01Icon,
  GitCommitIcon,
  GitPullRequestIcon,
  RocketIcon,
  SidebarRightIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { useBrandPanels } from "@/components/brand-panels"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const RIGHT_PANEL_ID = "sidebar-right"
const RIGHT_PANEL_DEFAULT_SIZE = "20rem"
const RIGHT_PANEL_MIN_SIZE = "15rem"
const RIGHT_PANEL_MAX_SIZE = "30rem"

interface ActivityEntry {
  id: string
  author: string
  initials: string
  icon: IconSvgElement
  action: string
  target: string
  time: string
}

const activity: ActivityEntry[] = [
  {
    id: "deploy",
    author: "aiellie",
    initials: "AE",
    icon: RocketIcon,
    action: "deployed",
    target: "production",
    time: "2m ago",
  },
  {
    id: "review",
    author: "Noor",
    initials: "NO",
    icon: GitPullRequestIcon,
    action: "approved",
    target: "#428 · Sidebar panels",
    time: "18m ago",
  },
  {
    id: "commit",
    author: "Rania",
    initials: "RA",
    icon: GitCommitIcon,
    action: "pushed 3 commits to",
    target: "main",
    time: "1h ago",
  },
  {
    id: "comment",
    author: "Yusuf",
    initials: "YU",
    icon: Comment01Icon,
    action: "commented on",
    target: "Tokens: spacing scale",
    time: "3h ago",
  },
]

const details: { label: string; value: string }[] = [
  { label: "Owner", value: "aiellie" },
  { label: "Environment", value: "Production" },
  { label: "Region", value: "iad1" },
  { label: "Updated", value: "Today, 14:02" },
]

export function BrandSidebarRight({ className }: { className?: string }) {
  const { rightOpen, setRightOpen } = useBrandPanels()
  const { isMobile } = useSidebar()

  // The panel takes width from the content panel, which leaves nothing behind
  // on a phone — the header toggle is desktop-only for the same reason.
  if (!rightOpen || isMobile) {
    return null
  }

  return (
    <>
      {/* The grip only shows up once the handle is hovered, dragged or focused. */}
      <ResizableHandle
        withHandle
        className={cn(
          "[&>div]:opacity-0 [&>div]:transition-opacity",
          "hover:[&>div]:opacity-100",
          "active:[&>div]:opacity-100",
          "focus-visible:[&>div]:opacity-100"
        )}
      />
      <ResizablePanel
        id={RIGHT_PANEL_ID}
        defaultSize={RIGHT_PANEL_DEFAULT_SIZE}
        minSize={RIGHT_PANEL_MIN_SIZE}
        maxSize={RIGHT_PANEL_MAX_SIZE}
        groupResizeBehavior="preserve-pixel-size"
        style={{ overflow: "hidden" }}
      >
        <div
          data-slot="brand-sidebar-right"
          className={cn(
            "flex h-full w-full flex-col bg-sidebar text-sidebar-foreground",
            className
          )}
        >
          <div className="flex h-10 shrink-0 items-center gap-2 border-b border-sidebar-border px-2">
            <HugeiconsIcon
              icon={SidebarRightIcon}
              strokeWidth={2}
              className="size-4 text-muted-foreground"
            />
            <span className="flex-1 truncate text-sm font-medium">
              Activity
            </span>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setRightOpen(false)}
                  >
                    <HugeiconsIcon
                      icon={Cancel01Icon}
                      strokeWidth={2}
                      className="text-muted-foreground"
                    />
                    <span className="sr-only">Close activity panel</span>
                  </Button>
                }
              />
              <TooltipContent side="bottom">Close panel</TooltipContent>
            </Tooltip>
          </div>

          <ScrollArea className="min-h-0 flex-1">
            <div className="flex flex-col gap-1 p-2">
              <p className="px-2 py-1 text-xs font-medium text-muted-foreground">
                Today
              </p>
              {activity.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-2 rounded-md p-2 transition-colors hover:bg-sidebar-accent"
                >
                  <Avatar className="size-6 shrink-0">
                    <AvatarFallback className="text-[0.625rem]">
                      {entry.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug">
                      <span className="font-medium">{entry.author}</span>{" "}
                      <span className="text-muted-foreground">
                        {entry.action}
                      </span>{" "}
                      <span className="font-medium">{entry.target}</span>
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <HugeiconsIcon
                        icon={entry.icon}
                        strokeWidth={2}
                        className="size-3"
                      />
                      {entry.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="bg-sidebar-border" />

            <div className="flex flex-col gap-1 p-2">
              <p className="flex items-center justify-between px-2 py-1 text-xs font-medium text-muted-foreground">
                Details
                <Badge variant="secondary">Live</Badge>
              </p>
              {details.map((detail) => (
                <div
                  key={detail.label}
                  className="flex items-center justify-between gap-2 px-2 py-1.5 text-sm"
                >
                  <span className="text-muted-foreground">{detail.label}</span>
                  <span className="truncate font-medium">{detail.value}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </ResizablePanel>
    </>
  )
}
