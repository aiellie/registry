"use client"

import * as React from "react"

import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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
  // `null` is the project list, "new" is the create-project drill-down. cmdk
  // has no submenu primitive, so the list swaps in place and stays navigable.
  const [page, setPage] = React.useState<"new" | null>(null)
  const [search, setSearch] = React.useState("")

  const handleOpenChange = (next: boolean) => {
    onOpenChange?.(next)
    if (!next) {
      setPage(null)
      setSearch("")
    }
  }

  const close = () => handleOpenChange(false)

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger render={trigger} />
      <PopoverContent
        side="top"
        align="start"
        className="w-72 gap-0 p-0"
        onKeyDown={(event) => {
          if (page && event.key === "Backspace" && !search) {
            event.preventDefault()
            setPage(null)
          }
        }}
      >
        <Command>
          <CommandInput
            placeholder={page ? "New project" : "Search projects"}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No projects found.</CommandEmpty>
            {page === "new" ? (
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setPage(null)
                    setSearch("")
                  }}
                >
                  <HugeiconsIcon
                    icon={ArrowLeft01Icon}
                    strokeWidth={1.5}
                    className="rtl:rotate-180"
                  />
                  Back
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    onCreateProject?.("scratch")
                    close()
                  }}
                >
                  <HugeiconsIcon icon={PlusSignIcon} strokeWidth={1.5} />
                  Start from scratch
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    onCreateProject?.("existing")
                    close()
                  }}
                >
                  <HugeiconsIcon icon={Folder01Icon} strokeWidth={1.5} />
                  Use an existing folder
                </CommandItem>
              </CommandGroup>
            ) : (
              <>
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
                  <CommandItem
                    value="New project"
                    className="[&>svg:last-child]:hidden"
                    onSelect={() => {
                      setSearch("")
                      setPage("new")
                    }}
                  >
                    <HugeiconsIcon icon={PlusSignIcon} strokeWidth={1.5} />
                    New project
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      strokeWidth={1.5}
                      className="ms-auto rtl:rotate-180"
                    />
                  </CommandItem>
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
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
