"use client"

import {
  Archive02Icon,
  Cancel01Icon,
  FolderAddIcon,
  MoreHorizontalIcon,
  PencilEdit02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export interface ProjectDropdownItem {
  value: string
  label: string
  icon: IconSvgElement
}

/** Actions in the "..." menu on a project row. */
export const PROJECT_DROPDOWN_ITEMS: ProjectDropdownItem[] = [
  { value: "edit", label: "Edit project", icon: PencilEdit02Icon },
  { value: "add-source", label: "Add source", icon: FolderAddIcon },
  { value: "archive-chats", label: "Archive chats", icon: Archive02Icon },
  { value: "remove", label: "Remove", icon: Cancel01Icon },
]

/** The "..." actions menu on a project row. */
export function ProjectDropdown({
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
                  aria-label="Project actions"
                />
              }
            />
          }
        >
          <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
        </TooltipTrigger>
        <TooltipContent side="bottom">Project actions</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="start" className="w-52 rounded-xl">
        {PROJECT_DROPDOWN_ITEMS.map((item) => (
          <DropdownMenuItem
            key={item.value}
            className="cursor-pointer"
            variant={item.value === "remove" ? "destructive" : "default"}
            onClick={() => onSelect?.(item.value)}
          >
            <HugeiconsIcon icon={item.icon} strokeWidth={2} />
            <span>{item.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
