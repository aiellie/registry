"use client"

import * as React from "react"

import {
  GitBranchIcon,
  GitBranchPlusIcon,
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

export type PromptBranch = {
  name: string
  hint?: string
}

export function BranchPicker({
  branches,
  value,
  onValueChange,
  localChanges = false,
  onSelectLocalState,
  onCheckoutNew,
  open,
  onOpenChange,
  trigger,
}: {
  branches: PromptBranch[]
  value: string
  onValueChange: (value: string) => void
  localChanges?: boolean
  onSelectLocalState?: () => void
  onCheckoutNew?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger: React.ReactElement
}) {
  const close = () => onOpenChange?.(false)

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger render={trigger} />
      <PopoverContent side="top" align="start" className="w-72 gap-0 p-0">
        <Command className="p-0">
          <CommandInput placeholder="Search branches" />
          <CommandList>
            <CommandEmpty>No branches found.</CommandEmpty>
            {localChanges ? (
              <CommandGroup heading="Local file state">
                <CommandItem
                  value={`${value} with local code changes`}
                  onSelect={() => {
                    onSelectLocalState?.()
                    close()
                  }}
                >
                  <span className="relative flex shrink-0">
                    <HugeiconsIcon
                      icon={GitBranchIcon}
                      strokeWidth={1.5}
                      className="size-4"
                    />
                    <span className="absolute -top-0.5 -end-0.5 size-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate">{value}</span>
                    <span className="text-xs text-muted-foreground">
                      with local code changes
                    </span>
                  </span>
                </CommandItem>
              </CommandGroup>
            ) : null}
            <CommandGroup heading="Local branches">
              {branches.map((branch) => (
                <CommandItem
                  key={branch.name}
                  value={branch.name}
                  data-checked={branch.name === value}
                  onSelect={() => {
                    onValueChange(branch.name)
                    close()
                  }}
                >
                  <HugeiconsIcon icon={GitBranchIcon} strokeWidth={1.5} />
                  {branch.hint ? (
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate">{branch.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {branch.hint}
                      </span>
                    </span>
                  ) : (
                    branch.name
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                value="Find and checkout new branch"
                onSelect={() => {
                  onCheckoutNew?.()
                  close()
                }}
              >
                <HugeiconsIcon icon={GitBranchPlusIcon} strokeWidth={1.5} />
                Find and checkout new branch...
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
