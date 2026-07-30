"use client"

import * as React from "react"

import {
  AtIcon,
  Attachment01Icon,
  BrowserIcon,
  ChartRoseIcon,
  ComputerIcon,
  File01Icon,
  Folder01Icon,
  GithubIcon,
  GridTableIcon,
  GridViewIcon,
  Idea01Icon,
  Layers01Icon,
  MagicWand01Icon,
  Mic01Icon,
  Pdf01Icon,
  PlusSignIcon,
  Presentation01Icon,
  SparklesIcon,
  Target01Icon,
  WebDesign02Icon,
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
import { chatTypeIcons, teams } from "@/lib/sidebar-data"
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
  {
    value: "record",
    label: "Record a Skill",
    hint: "",
    icon: Mic01Icon,
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
  {
    value: "template-creator",
    label: "Template Creator",
    hint: "Create or update reusable templates from reference content",
    icon: MagicWand01Icon,
  },
  {
    value: "sites",
    label: "Sites",
    hint: "Build and deploy websites with Sites",
    icon: WebDesign02Icon,
  },
  {
    value: "browser",
    label: "Browser",
    hint: "Control the in-app browser with ChatGPT",
    icon: BrowserIcon,
  },
  {
    value: "computer",
    label: "Computer",
    hint: "Control Mac apps from ChatGPT",
    icon: ComputerIcon,
  },
  {
    value: "visualize",
    label: "Visualize",
    hint: "Turn ideas and data into interactive visuals",
    icon: ChartRoseIcon,
  },
  {
    value: "default-templates",
    label: "Default templates",
    hint: "Default templates for documents, spreadsheets, and presentations",
    icon: Layers01Icon,
  },
  {
    value: "github",
    label: "GitHub",
    hint: "Triage PRs, issues, CI, and publish flows",
    icon: GithubIcon,
  },
]

export const ADD_MENU_APPS: AddMenuItem[] = [
  {
    value: "plugin-management",
    label: "Plugin Management",
    hint: "Inspect and manage ChatGPT plugins, their permissions, and personal or workspace skills",
    icon: AtIcon,
  },
]

export const ADD_MENU_SITES: AddMenuItem[] = [
  {
    value: "site-personal-portfolio",
    label: "Personal Portfolio",
    hint: "personal-portfolio-0728.aiellie-dev.chatgpt.site",
    icon: GridViewIcon,
  },
  {
    value: "site-can-design-system",
    label: "CAN Design System",
    hint: "can-design-system-stashd.aiellie-dev.chatgpt.site",
    icon: GridViewIcon,
  },
]

const chatTeam = teams.find((team) => team.name === "Chat") ?? teams[0]

/** Attachable chats: the Chat team's pinned and recent lists from the sidebar. */
export const ADD_MENU_CHATS: AddMenuItem[] = [
  ...(chatTeam.pinned ?? []),
  ...(chatTeam.chats ?? []),
].map((chat) => ({
  value: `chat-${chat.id}`,
  label: chat.name,
  icon: chatTypeIcons[chat.type],
}))

/**
 * Matches the text typed after a leading `@`. An empty query lists every
 * group, which is what the composer shows the moment `@` is typed.
 */
export function filterAddMenuItems(query: string): AddMenuGroup[] {
  const needle = query.trim().toLowerCase()
  const groups: AddMenuGroup[] = [
    { label: "Add", items: ADD_MENU_ITEMS },
    { label: "Plugins", items: ADD_MENU_PLUGINS },
    { label: "Apps", items: ADD_MENU_APPS },
    { label: "Sites", items: ADD_MENU_SITES },
    { label: "Chats", items: ADD_MENU_CHATS },
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
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2.5">Apps</DropdownMenuLabel>
          {ADD_MENU_APPS.map((item) => (
            <AddMenuRow key={item.value} item={item} onSelect={onSelect} />
          ))}
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2.5">Sites</DropdownMenuLabel>
          {ADD_MENU_SITES.map((item) => (
            <AddMenuRow key={item.value} item={item} onSelect={onSelect} />
          ))}
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2.5">Chats</DropdownMenuLabel>
          {ADD_MENU_CHATS.map((item) => (
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
