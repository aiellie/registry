"use client"

import {
  ArrowDown01Icon,
  ArrowUpRight01Icon,
  GitBranchIcon,
  GitCommitIcon,
  GithubIcon,
  Image01Icon,
  LaptopIcon,
  LeftToRightListBulletIcon,
  Link04Icon,
  PlusMinusSquare01Icon,
  PlusSignIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export interface SummaryEnvironmentItem {
  value: string
  label: string
  icon: IconSvgElement
  /** Right-aligned affordance for the row. */
  trailing?: "chevron" | "external" | "diff"
}

/** Session environment rows, the top section of the summary panel. */
export const SUMMARY_ENVIRONMENT_ITEMS: SummaryEnvironmentItem[] = [
  {
    value: "changes",
    label: "Changes",
    icon: PlusMinusSquare01Icon,
    trailing: "diff",
  },
  { value: "local", label: "Local", icon: LaptopIcon, trailing: "chevron" },
  { value: "branch", label: "main", icon: GitBranchIcon, trailing: "chevron" },
  { value: "commit", label: "Commit or push", icon: GitCommitIcon },
  {
    value: "compare",
    label: "Compare branch",
    icon: GithubIcon,
    trailing: "external",
  },
]

/** Attached sources, the bottom section of the summary panel. */
export const SUMMARY_SOURCES = [
  "Screenshot 2026-07-28 at 7.07.50 PM",
  "Screenshot 2026-07-28 at 7.07.57 PM",
  "Screenshot 2026-07-28 at 7.08.37 PM",
]

const subagentColors = [
  "text-amber-600 dark:text-amber-400",
  "text-sky-600 dark:text-sky-400",
  "text-violet-600 dark:text-violet-400",
]

/** The session summary panel next to a chat title. */
export function SummaryDropdown({
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
                  aria-label="Chat summary"
                />
              }
            />
          }
        >
          <HugeiconsIcon icon={LeftToRightListBulletIcon} strokeWidth={2} />
        </TooltipTrigger>
        <TooltipContent side="bottom">Chat summary</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-72 rounded-xl">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center justify-between">
            Environment
            <HugeiconsIcon
              icon={PlusSignIcon}
              strokeWidth={2}
              className="size-3.5"
            />
          </DropdownMenuLabel>
          {SUMMARY_ENVIRONMENT_ITEMS.map((item) => (
            <DropdownMenuItem
              key={item.value}
              onClick={() => onSelect?.(item.value)}
            >
              <HugeiconsIcon icon={item.icon} strokeWidth={2} />
              <span>{item.label}</span>
              {item.trailing === "diff" && (
                <span className="ms-auto text-xs tabular-nums">
                  <span className="text-emerald-600 dark:text-emerald-400">
                    +110
                  </span>{" "}
                  <span className="text-destructive">-13</span>
                </span>
              )}
              {item.trailing === "chevron" && (
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  strokeWidth={2}
                  className="ms-auto size-3.5 text-muted-foreground"
                />
              )}
              {item.trailing === "external" && (
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  strokeWidth={2}
                  className="ms-auto size-3.5 text-muted-foreground rtl:-scale-x-100"
                />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Subagents</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onSelect?.("subagents")}>
            <span className="flex items-center gap-0.5">
              {subagentColors.map((color) => (
                <HugeiconsIcon
                  key={color}
                  icon={SparklesIcon}
                  strokeWidth={2}
                  className={cn("size-3.5", color)}
                />
              ))}
            </span>
            <span>3 done</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center justify-between">
            Sources
            <HugeiconsIcon
              icon={PlusSignIcon}
              strokeWidth={2}
              className="size-3.5"
            />
          </DropdownMenuLabel>
          {SUMMARY_SOURCES.map((name) => (
            <DropdownMenuItem key={name} onClick={() => onSelect?.(name)}>
              <span className="flex size-5 shrink-0 items-center justify-center rounded-sm border border-border bg-background">
                <HugeiconsIcon
                  icon={Image01Icon}
                  strokeWidth={2}
                  className="size-3 text-muted-foreground"
                />
              </span>
              <span className="min-w-0 truncate">{name}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem
            className="text-muted-foreground"
            onClick={() => onSelect?.("view-all")}
          >
            <HugeiconsIcon icon={Link04Icon} strokeWidth={2} />
            <span>View all</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
