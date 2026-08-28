"use client"

import * as React from "react"
import { type Row } from "@tanstack/react-table"
import {
  Copy01Icon,
  Delete02Icon,
  Edit02Icon,
  Flag02Icon,
  MoreHorizontalIcon,
  RecordIcon,
  StarIcon,
  Tag01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { labels, priorities, statuses } from "../data/data"
import { taskSchema } from "../data/schema"
import { DataTableDeleteDialog } from "./data-table-delete-dialog"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  onDelete?: () => void
  onFieldChange?: (key: string, value: string) => void
}

const submenus = [
  { key: "status", label: "Status", icon: RecordIcon, options: statuses },
  { key: "priority", label: "Priority", icon: Flag02Icon, options: priorities },
  { key: "label", label: "Label", icon: Tag01Icon, options: labels },
]

export function DataTableRowActions<TData>({
  row,
  onDelete,
  onFieldChange,
}: DataTableRowActionsProps<TData>) {
  const task = taskSchema.parse(row.original)
  // Held outside the menu: the menu unmounts on select, and an alert dialog
  // nested inside it would go with it before it ever painted.
  const [confirming, setConfirming] = React.useState(false)

  const current: Record<string, string> = {
    status: task.status,
    priority: task.priority,
    label: task.label,
  }

  return (
    <>
      <DropdownMenu>
        <TooltipProvider delay={300}>
          <Tooltip>
            <TooltipTrigger
              render={
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Actions for ${task.id}`}
                      className="aria-expanded:bg-muted"
                    >
                      <HugeiconsIcon
                        icon={MoreHorizontalIcon}
                        strokeWidth={2}
                        className="size-4"
                      />
                    </Button>
                  }
                />
              }
            />
            <TooltipContent>Actions</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuItem>
            <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} />
            Make a copy
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HugeiconsIcon icon={StarIcon} strokeWidth={2} />
            Favorite
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {submenus.map((menu) => (
            <DropdownMenuSub key={menu.key}>
              <DropdownMenuSubTrigger>
                <HugeiconsIcon icon={menu.icon} strokeWidth={2} />
                {menu.label}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={current[menu.key]}
                  onValueChange={(value) => onFieldChange?.(menu.key, value)}
                >
                  {menu.options.map((option) => (
                    <DropdownMenuRadioItem
                      key={option.value}
                      value={option.value}
                    >
                      {option.icon && (
                        <HugeiconsIcon
                          icon={option.icon}
                          strokeWidth={2}
                          className="size-4 text-muted-foreground"
                        />
                      )}
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setConfirming(true)}
          >
            <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DataTableDeleteDialog
        open={confirming}
        onOpenChange={setConfirming}
        count={1}
        subject={task.id}
        onConfirm={() => onDelete?.()}
      />
    </>
  )
}
