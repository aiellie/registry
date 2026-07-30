"use client"

import * as React from "react"
import {
  Archive02Icon,
  Clock01Icon,
  ComputerIcon,
  Copy01Icon,
  GitBranchIcon,
  GitForkIcon,
  LinkSquare02Icon,
  MoreHorizontalIcon,
  PencilEdit02Icon,
  PinOffIcon,
  PlusSignCircleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { cn } from "@/lib/utils"

export interface ChatDropdownItem {
  value: string
  label: string
  icon: IconSvgElement
  kbd?: string
  /** Renders as a submenu when present. */
  items?: ChatDropdownItem[]
}

/** Chat actions, grouped — groups render with separators between them. */
export const CHAT_DROPDOWN_GROUPS: ChatDropdownItem[][] = [
  [
    { value: "unpin", label: "Unpin chat", icon: PinOffIcon, kbd: "⌥⌘P" },
    {
      value: "rename",
      label: "Rename chat",
      icon: PencilEdit02Icon,
      kbd: "⌥⌘R",
    },
    {
      value: "archive",
      label: "Archive chat",
      icon: Archive02Icon,
      kbd: "⇧⌘A",
    },
  ],
  [
    {
      value: "side-chat",
      label: "Open side chat",
      icon: PlusSignCircleIcon,
      kbd: "⌥⌘S",
    },
    {
      value: "copy",
      label: "Copy",
      icon: Copy01Icon,
      items: [
        {
          value: "copy-working-directory",
          label: "Copy working directory",
          icon: Copy01Icon,
          kbd: "⇧⌘C",
        },
        {
          value: "copy-session-id",
          label: "Copy session ID",
          icon: Copy01Icon,
          kbd: "⌥⌘C",
        },
        {
          value: "copy-deeplink",
          label: "Copy deeplink",
          icon: Copy01Icon,
          kbd: "⌥⌘L",
        },
        {
          value: "copy-markdown",
          label: "Copy as Markdown",
          icon: Copy01Icon,
        },
      ],
    },
    {
      value: "continue-in",
      label: "Continue in...",
      icon: GitForkIcon,
      items: [
        {
          value: "continue-new-chat",
          label: "Continue in new chat",
          icon: ComputerIcon,
        },
        {
          value: "continue-new-worktree",
          label: "Continue in new worktree",
          icon: GitBranchIcon,
        },
      ],
    },
    {
      value: "scheduled-task",
      label: "Add scheduled task...",
      icon: Clock01Icon,
    },
  ],
  [
    {
      value: "new-window",
      label: "Open in new window",
      icon: LinkSquare02Icon,
    },
  ],
]

/** The "..." actions menu next to a chat title. */
export function ChatDropdown({
  onSelect,
  className,
}: {
  onSelect?: (value: string) => void
  className?: string
}) {
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className={cn("text-muted-foreground", className)}
                  aria-label="Chat actions"
                />
              }
            />
          }
        >
          <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
        </TooltipTrigger>
        <TooltipContent side="bottom">Chat actions</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="start" className="w-60 rounded-xl">
        {CHAT_DROPDOWN_GROUPS.map((group, groupIndex) => (
          <React.Fragment key={groupIndex}>
            {groupIndex > 0 && <DropdownMenuSeparator />}
            {group.map((item) =>
              item.items ? (
                <DropdownMenuSub key={item.value}>
                  <DropdownMenuSubTrigger>
                    <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                    <span>{item.label}</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-64 rounded-xl">
                    {item.items.map((subItem) => (
                      <ChatDropdownRow
                        key={subItem.value}
                        item={subItem}
                        onSelect={onSelect}
                      />
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              ) : (
                <ChatDropdownRow
                  key={item.value}
                  item={item}
                  onSelect={onSelect}
                />
              )
            )}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ChatDropdownRow({
  item,
  onSelect,
}: {
  item: ChatDropdownItem
  onSelect?: (value: string) => void
}) {
  return (
    <DropdownMenuItem
      className="cursor-pointer"
      onClick={() => onSelect?.(item.value)}
    >
      <HugeiconsIcon icon={item.icon} strokeWidth={2} />
      <span>{item.label}</span>
      {item.kbd && <Kbd className="ms-auto">{item.kbd}</Kbd>}
    </DropdownMenuItem>
  )
}
