"use client"

import * as React from "react"

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

export type AddMenuItem = {
  value: string
  label: string
  hint?: string
  icon: IconSvgElement
}

export type AddMenuGroup = {
  label: string
  items: AddMenuItem[]
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

/**
 * Matches the text typed after a leading `@`. An empty query lists every
 * group, which is what the composer shows the moment `@` is typed.
 */
export function filterAddMenuItems(query: string): AddMenuGroup[] {
  const needle = query.trim().toLowerCase()
  const groups: AddMenuGroup[] = [
    { label: "Add", items: ADD_MENU_ITEMS },
    { label: "Plugins", items: ADD_MENU_PLUGINS },
  ]
  if (!needle) return groups
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.label.toLowerCase().includes(needle)
      ),
    }))
    .filter((group) => group.items.length > 0)
}

/**
 * Presentational listbox counterpart to the dropdown below — the composer
 * keeps focus in the textarea and owns the active index, mirroring
 * PromptCommandMenu. `activeIndex` is flat across all groups.
 */
export function PromptAddMenuPanel({
  groups,
  activeIndex,
  onActiveIndexChange,
  onSelect,
  id,
  className,
  style,
}: {
  groups: AddMenuGroup[]
  activeIndex: number
  onActiveIndexChange?: (index: number) => void
  onSelect: (item: AddMenuItem) => void
  id?: string
  className?: string
  style?: React.CSSProperties
}) {
  if (groups.length === 0) return null

  const groupOffsets: number[] = []
  let start = 0
  for (const group of groups) {
    groupOffsets.push(start)
    start += group.items.length
  }

  return (
    <div
      id={id}
      role="listbox"
      aria-label="Add files and more"
      style={style}
      className={cn(
        "max-h-72 overflow-y-auto rounded-2xl bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10",
        className
      )}
    >
      {groups.map((group, groupIndex) => (
        <div key={group.label} role="group">
          <div className="px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {group.label}
          </div>
          {group.items.map((item, itemIndex) => {
            const index = groupOffsets[groupIndex] + itemIndex
            return (
              <div
                key={item.value}
                id={id ? `${id}-item-${index}` : undefined}
                role="option"
                aria-selected={index === activeIndex}
                onPointerMove={() => onActiveIndexChange?.(index)}
                onPointerDown={(event) => event.preventDefault()}
                onClick={() => onSelect(item)}
                className={cn(
                  "flex cursor-default items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-xs select-none",
                  index === activeIndex && "bg-muted"
                )}
              >
                <HugeiconsIcon
                  icon={item.icon}
                  strokeWidth={1.5}
                  className="size-3.5 shrink-0"
                />
                <span className="font-medium">{item.label}</span>
                {item.hint ? (
                  <span className="truncate text-muted-foreground">
                    {item.hint}
                  </span>
                ) : null}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export function PromptAddMenu({
  onSelect,
  anchor,
  className,
}: {
  onSelect?: (value: string) => void
  /**
   * Element the menu panel is positioned against. Pass the composer box so
   * the panel spans its full width above the input; without it the panel is
   * a regular dropdown hanging off the trigger button.
   */
  anchor?: React.ComponentProps<typeof DropdownMenuContent>["anchor"]
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
        anchor={anchor}
        className={cn(
          "rounded-2xl",
          !anchor && "w-[min(26rem,calc(100vw-2rem))]"
        )}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2.5">Add</DropdownMenuLabel>
          {ADD_MENU_ITEMS.map((item) => (
            <AddMenuRow key={item.value} item={item} onSelect={onSelect} />
          ))}
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2.5">Plugins</DropdownMenuLabel>
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
      className="gap-2.5 rounded-xl px-2.5 py-1.5"
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
