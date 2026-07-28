"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDown01Icon,
  MoreHorizontalIcon,
  Tick02Icon,
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// Brand logos keep their official colors; they are not theme tokens.
function GmailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 193" aria-hidden="true" className={className}>
      <path
        fill="#4285F4"
        d="M58.182 192.05V93.14L27.507 65.077 0 49.504v125.091c0 9.658 7.825 17.455 17.455 17.455h40.727Z"
      />
      <path
        fill="#34A853"
        d="M197.818 192.05h40.727c9.659 0 17.455-7.826 17.455-17.455V49.505l-31.156 17.837-27.026 25.798v98.91Z"
      />
      <path
        fill="#EA4335"
        d="m58.182 93.14-4.174-38.647 4.174-36.989L128 69.868l69.818-52.364 4.669 34.992-4.669 40.644L128 145.504z"
      />
      <path
        fill="#FBBC04"
        d="M197.818 17.504V93.14L256 49.504V26.231c0-21.585-24.64-33.89-41.89-20.945l-16.292 12.218Z"
      />
      <path
        fill="#C5221F"
        d="M0 26.231v23.273l58.182 43.636V17.504L41.89 5.286C24.61-7.66 0 4.646 0 26.231Z"
      />
    </svg>
  )
}

function SlackIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 122.8 122.8" aria-hidden="true" className={className}>
      <path
        fill="#E01E5A"
        d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z"
      />
      <path
        fill="#36C5F0"
        d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z"
      />
      <path
        fill="#2EB67D"
        d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z"
      />
      <path
        fill="#ECB22E"
        d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z"
      />
    </svg>
  )
}

function GoogleDriveIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 87.3 78" aria-hidden="true" className={className}>
      <path
        fill="#0066DA"
        d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z"
      />
      <path
        fill="#00AC47"
        d="M43.65 25 29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44A9.06 9.06 0 0 0 0 53h27.5z"
      />
      <path
        fill="#EA4335"
        d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75L86.1 57.5c.8-1.4 1.2-2.95 1.2-4.5H59.798l5.852 11.5z"
      />
      <path
        fill="#00832D"
        d="M43.65 25 57.4 1.2c-1.35-.8-2.9-1.2-4.5-1.2H34.4c-1.6 0-3.15.45-4.5 1.2z"
      />
      <path
        fill="#2684FC"
        d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"
      />
      <path
        fill="#FFBA00"
        d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"
      />
    </svg>
  )
}

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#57A8F0"
        d="M2 6.5A2.5 2.5 0 0 1 4.5 4h4.2c.66 0 1.3.26 1.77.73L11.7 6h7.8A2.5 2.5 0 0 1 22 8.5v9a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 17.5v-11Z"
      />
      <path
        fill="#8CC5F6"
        d="M2 9h20v8.5a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 17.5V9Z"
      />
    </svg>
  )
}

type SetupTask = {
  id: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  done: boolean
}

const initialTasks: SetupTask[] = [
  { id: "notifications", label: "Enable notifications", done: false },
  { id: "daily-update", label: "Set up a daily update", done: false },
  { id: "inbox", label: "Summarize my inbox", icon: GmailIcon, done: false },
  {
    id: "catch-up",
    label: "Catch me up on updates",
    icon: SlackIcon,
    done: false,
  },
  {
    id: "plans",
    label: "Review the latest plans",
    icon: GoogleDriveIcon,
    done: false,
  },
  {
    id: "note",
    label: "Leave a note on my Desktop",
    icon: FolderIcon,
    done: true,
  },
  { id: "import", label: "Import agent setup", done: true },
]

function ProgressRing({
  value,
  className,
}: {
  value: number
  className?: string
}) {
  const radius = 7
  const circumference = 2 * Math.PI * radius
  return (
    <svg
      viewBox="0 0 18 18"
      aria-hidden="true"
      className={cn("size-4.5 shrink-0 -rotate-90", className)}
    >
      <circle
        cx="9"
        cy="9"
        r={radius}
        fill="none"
        strokeWidth="2.5"
        className="stroke-muted"
      />
      <circle
        cx="9"
        cy="9"
        r={radius}
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - value)}
        className="stroke-primary transition-all"
      />
    </svg>
  )
}

export function SidebarSetupForm() {
  const [tasks, setTasks] = React.useState(initialTasks)
  const [open, setOpen] = React.useState(false)
  const [hidden, setHidden] = React.useState(false)

  const doneCount = tasks.filter((task) => task.done).length

  if (hidden) {
    return null
  }

  const toggleTask = (id: string) =>
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    )

  if (!open) {
    return (
      <Card className="rounded-2xl py-0 shadow-none group-data-[collapsible=icon]:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center gap-2.5 px-3 py-2.5 text-start"
        >
          <ProgressRing value={doneCount / tasks.length} />
          <span className="text-sm font-semibold">Getting started</span>
          <span className="ms-auto rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {doneCount} of {tasks.length}
          </span>
        </button>
      </Card>
    )
  }

  return (
    <Card className="gap-2.5 rounded-2xl p-3 shadow-none group-data-[collapsible=icon]:hidden">
      <div className="flex items-center gap-0.5 ps-1">
        <span className="text-sm font-semibold">Getting started</span>
        <div className="ms-auto flex items-center">
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger
                render={
                  <DropdownMenuTrigger
                    render={
                      <Button
                        aria-label="More options"
                        variant="ghost"
                        size="icon-xs"
                        className="rounded-full text-muted-foreground"
                      />
                    }
                  />
                }
              >
                <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>More options</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setHidden(true)}>
                <HugeiconsIcon
                  icon={ViewOffSlashIcon}
                  strokeWidth={2}
                  className="size-4"
                />
                <span>Hide setup</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  aria-label="Collapse"
                  variant="ghost"
                  size="icon-xs"
                  className="rounded-full text-muted-foreground"
                  onClick={() => setOpen(false)}
                />
              }
            >
              <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} />
            </TooltipTrigger>
            <TooltipContent>Collapse</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <Progress
        value={doneCount}
        max={tasks.length}
        aria-label="Setup progress"
        className="px-1 [&_[data-slot=progress-track]]:h-1.5"
      />
      <div className="flex flex-col">
        {tasks.map((task) => {
          const TaskIcon = task.icon
          return (
            <button
              key={task.id}
              type="button"
              onClick={() => toggleTask(task.id)}
              className="flex w-full items-center gap-2.5 rounded-lg px-1 py-2 text-start text-sm hover:bg-muted/50"
            >
              <span
                className={cn(
                  "flex size-4.5 shrink-0 items-center justify-center rounded-full border border-muted-foreground/40 transition-colors",
                  task.done && "border-primary bg-primary text-primary-foreground"
                )}
              >
                {task.done && (
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    strokeWidth={3}
                    className="size-2.5"
                  />
                )}
              </span>
              <span
                className={cn(
                  "flex-1",
                  task.done && "text-muted-foreground line-through"
                )}
              >
                {task.label}
              </span>
              {TaskIcon && (
                <TaskIcon
                  className={cn("size-4 shrink-0", task.done && "opacity-50")}
                />
              )}
            </button>
          )
        })}
      </div>
    </Card>
  )
}
