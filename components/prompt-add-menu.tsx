"use client"

import {
  Attachment01Icon,
  File01Icon,
  Folder01Icon,
  GridTableIcon,
  Idea01Icon,
  Pdf01Icon,
  PlusSignIcon,
  Presentation01Icon,
  SparklesIcon,
  Target01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Kbd } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type AddMenuItem = {
  value: string
  label: string
  hint?: string
  icon: IconSvgElement
}

export const ADD_MENU_ITEMS: AddMenuItem[] = [
  { value: "files", label: "Files and folders", icon: Attachment01Icon },
  { value: "agent", label: "Attach agent", icon: SparklesIcon },
  {
    value: "project",
    label: "Work in a project",
    hint: "Choose project for new chats",
    icon: Folder01Icon,
  },
  {
    value: "goal",
    label: "Goal",
    hint: "Set a goal to keep pursuing",
    icon: Target01Icon,
  },
  {
    value: "plan",
    label: "Plan mode",
    hint: "Turn plan mode on",
    icon: Idea01Icon,
  },
]

export const ADD_MENU_PLUGINS: AddMenuItem[] = [
  {
    value: "documents",
    label: "Documents",
    hint: "Create and edit document artifacts",
    icon: File01Icon,
  },
  {
    value: "pdf",
    label: "PDF",
    hint: "Read, create, and verify PDF files",
    icon: Pdf01Icon,
  },
  {
    value: "spreadsheets",
    label: "Spreadsheets",
    hint: "Create and edit spreadsheet files",
    icon: GridTableIcon,
  },
  {
    value: "presentations",
    label: "Presentations",
    hint: "Create and edit presentations",
    icon: Presentation01Icon,
  },
]

export function PromptAddMenu({
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
                  className={cn("rounded-full", className)}
                  aria-label="Add files and more"
                />
              }
            />
          }
        >
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={1.5} />
        </TooltipTrigger>
        <TooltipContent side="top">
          Add files and more
          <Kbd>@</Kbd>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent
        side="top"
        align="start"
        sideOffset={8}
        className="w-[min(26rem,calc(100vw-2rem))]"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Add</DropdownMenuLabel>
          {ADD_MENU_ITEMS.map((item) => (
            <AddMenuRow key={item.value} item={item} onSelect={onSelect} />
          ))}
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Plugins</DropdownMenuLabel>
          {ADD_MENU_PLUGINS.map((item) => (
            <AddMenuRow key={item.value} item={item} onSelect={onSelect} />
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function AddMenuRow({
  item,
  onSelect,
}: {
  item: AddMenuItem
  onSelect?: (value: string) => void
}) {
  return (
    <DropdownMenuItem
      className="gap-2.5 py-1.5"
      onClick={() => onSelect?.(item.value)}
    >
      <HugeiconsIcon icon={item.icon} strokeWidth={1.5} className="size-4.5" />
      <span className="font-medium">{item.label}</span>
      {item.hint ? (
        <span className="truncate text-muted-foreground">{item.hint}</span>
      ) : null}
    </DropdownMenuItem>
  )
}
