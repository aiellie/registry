"use client"

import {
  AiBrain01Icon,
  BubbleChatIcon,
  Comment01Icon,
  CubeIcon,
  FlashIcon,
  GaugeIcon,
  Idea01Icon,
  Note01Icon,
  PlugSocketIcon,
  Target01Icon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { cn } from "@/lib/utils"

export type PromptCommand = {
  name: string
  description: string
  icon: IconSvgElement
}

export const PROMPT_COMMANDS: PromptCommand[] = [
  { name: "chat", description: "Don't work in a project", icon: BubbleChatIcon },
  { name: "fast", description: "Turn off Fast and return to standard speed", icon: FlashIcon },
  { name: "feedback", description: "Send feedback about this chat", icon: Comment01Icon },
  { name: "goal", description: "Set a goal to keep pursuing", icon: Target01Icon },
  { name: "init", description: "Create an AGENTS.md file with project instructions", icon: Note01Icon },
  { name: "mcp", description: "Show MCP server status", icon: PlugSocketIcon },
  { name: "model", description: "Opus 4.8", icon: CubeIcon },
  { name: "pet", description: "Wake or tuck away the desktop pet", icon: UserCircleIcon },
  { name: "plan mode", description: "Turn plan mode on", icon: Idea01Icon },
  { name: "reasoning", description: "Light", icon: AiBrain01Icon },
  { name: "status", description: "Show chat ID, context usage, and rate limits", icon: GaugeIcon },
]

/**
 * Matches the text typed after a leading `/`. An empty query lists everything,
 * which is what the composer shows the moment `/` is typed.
 */
export function filterPromptCommands(
  query: string,
  commands: PromptCommand[] = PROMPT_COMMANDS
) {
  const needle = query.trim().toLowerCase()
  if (!needle) return commands
  return commands.filter((command) => command.name.toLowerCase().includes(needle))
}

/**
 * Presentational listbox — the composer keeps focus in the textarea and owns
 * the active index, so this never steals focus the way a menu would.
 */
export function PromptCommandMenu({
  commands,
  activeIndex,
  onActiveIndexChange,
  onSelect,
  id,
  className,
}: {
  commands: PromptCommand[]
  activeIndex: number
  onActiveIndexChange?: (index: number) => void
  onSelect: (command: PromptCommand) => void
  id?: string
  className?: string
}) {
  if (commands.length === 0) return null

  return (
    <div
      id={id}
      role="listbox"
      aria-label="Commands"
      className={cn(
        "max-h-72 overflow-y-auto rounded-2xl bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10",
        className
      )}
    >
      {commands.map((command, index) => (
        <div
          key={command.name}
          id={id ? `${id}-item-${index}` : undefined}
          role="option"
          aria-selected={index === activeIndex}
          onPointerMove={() => onActiveIndexChange?.(index)}
          onPointerDown={(event) => event.preventDefault()}
          onClick={() => onSelect(command)}
          className={cn(
            "flex cursor-default items-center gap-2 rounded-xl px-2.5 py-1.5 text-sm select-none",
            index === activeIndex && "bg-muted"
          )}
        >
          <HugeiconsIcon
            icon={command.icon}
            strokeWidth={1.5}
            className="size-4 shrink-0"
          />
          <span className="font-medium">{command.name}</span>
          <span className="ms-auto ps-4 truncate text-muted-foreground">
            {command.description}
          </span>
        </div>
      ))}
    </div>
  )
}
