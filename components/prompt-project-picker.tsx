"use client"

import * as React from "react"

import {
  ArrowRight01Icon,
  Cancel01Icon,
  CancelCircleIcon,
  Folder01Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Kbd } from "@/components/ui/kbd"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type PromptProject = {
  id: string
  name: string
}

export function PromptProjectPicker({
  projects,
  value,
  onValueChange,
  onCreateProject,
  open,
  onOpenChange,
  trigger,
}: {
  projects: PromptProject[]
  value: string | null
  onValueChange: (value: string | null) => void
  onCreateProject?: (kind: "scratch" | "existing") => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger: React.ReactElement
}) {
  // The create-project options live in a nested sub-popover anchored to the
  // "New project" row, rather than swapping the list in place.
  const [newOpen, setNewOpen] = React.useState(false)

  const handleOpenChange = (next: boolean) => {
    onOpenChange?.(next)
    if (!next) setNewOpen(false)
  }

  const close = () => handleOpenChange(false)

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <span className="group/project relative inline-flex items-center">
        <Tooltip>
          <TooltipTrigger render={<PopoverTrigger render={trigger} />} />
          <TooltipContent>
            Change the project for this chat
            <Kbd>⌥⇧⌘O</Kbd>
          </TooltipContent>
        </Tooltip>
        {value != null ? (
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  data-slot="prompt-project-clear"
                  aria-label="Remove project"
                  onClick={() => onValueChange(null)}
                  // Sits over the trigger's leading icon; the trigger hides
                  // that icon on group hover so this reads as a swap.
                  className="pointer-events-none absolute inset-y-0 start-0 z-10 flex items-center rounded-sm opacity-0 transition-opacity outline-none group-hover/project:pointer-events-auto group-hover/project:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <HugeiconsIcon
                    icon={CancelCircleIcon}
                    strokeWidth={1.5}
                    className="size-3.5 text-muted-foreground"
                  />
                </button>
              }
            />
            <TooltipContent>Remove project</TooltipContent>
          </Tooltip>
        ) : null}
      </span>
      <PopoverContent side="top" align="start" className="w-72 gap-0 p-0">
        <Command className="p-0">
          <CommandInput placeholder="Search projects" />
          <CommandList>
            <CommandEmpty>No projects found.</CommandEmpty>
            <CommandGroup>
              {projects.map((project) => (
                <CommandItem
                  key={project.id}
                  value={project.name}
                  data-checked={project.id === value}
                  onSelect={() => {
                    onValueChange(project.id)
                    close()
                  }}
                >
                  <HugeiconsIcon icon={Folder01Icon} strokeWidth={1.5} />
                  {project.name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <Popover open={newOpen} onOpenChange={setNewOpen}>
                <PopoverTrigger
                  nativeButton={false}
                  render={
                    <CommandItem
                      value="New project"
                      // cmdk selects on click; keep the row open as a submenu
                      // trigger instead of running a select handler.
                      onSelect={() => setNewOpen(true)}
                    >
                      <HugeiconsIcon icon={PlusSignIcon} strokeWidth={1.5} />
                      New project
                      <span data-slot="command-shortcut" className="ms-auto">
                        <HugeiconsIcon
                          icon={ArrowRight01Icon}
                          strokeWidth={1.5}
                          className="rtl:rotate-180"
                        />
                      </span>
                    </CommandItem>
                  }
                />
                <PopoverContent
                  side="right"
                  align="start"
                  sideOffset={4}
                  className="w-56 p-0"
                >
                  <Command className="p-0">
                    <CommandList>
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => {
                            onCreateProject?.("scratch")
                            close()
                          }}
                        >
                          <HugeiconsIcon
                            icon={PlusSignIcon}
                            strokeWidth={1.5}
                          />
                          Start from scratch
                        </CommandItem>
                        <CommandItem
                          onSelect={() => {
                            onCreateProject?.("existing")
                            close()
                          }}
                        >
                          <HugeiconsIcon
                            icon={Folder01Icon}
                            strokeWidth={1.5}
                          />
                          Use existing folder
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <CommandItem
                value="Don't work in a project"
                onSelect={() => {
                  onValueChange(null)
                  close()
                }}
              >
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={1.5} />
                Don&apos;t work in a project
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
