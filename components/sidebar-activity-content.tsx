"use client"

import {
  Comment01Icon,
  GitCommitIcon,
  GitPullRequestIcon,
  RocketIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

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

export function SidebarActivityContent() {
  return (
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
                <span className="text-muted-foreground">{entry.action}</span>{" "}
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
  )
}
