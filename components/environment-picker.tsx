"use client"

import * as React from "react"

import { LinkSquare02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export type PromptEnvironment = {
  id: string
  name: string
}

export function EnvironmentPicker({
  environments,
  value,
  onValueChange,
  onOpenSettings,
  open,
  onOpenChange,
  trigger,
}: {
  environments: PromptEnvironment[]
  value: string | null
  onValueChange: (value: string | null) => void
  onOpenSettings?: () => void
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
          <CommandList>
            <CommandGroup heading="Environment">
              <CommandItem
                value="Work without environment"
                data-checked={value === null}
                onSelect={() => {
                  onValueChange(null)
                  close()
                }}
              >
                Work without environment
              </CommandItem>
              {environments.map((environment) => (
                <CommandItem
                  key={environment.id}
                  value={environment.name}
                  data-checked={environment.id === value}
                  onSelect={() => {
                    onValueChange(environment.id)
                    close()
                  }}
                >
                  {environment.name}
                </CommandItem>
              ))}
              {environments.length === 0 ? (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  No environments found
                </div>
              ) : null}
            </CommandGroup>
            <CommandGroup>
              <CommandItem
                value="Environment settings"
                onSelect={() => {
                  onOpenSettings?.()
                  close()
                }}
              >
                <HugeiconsIcon icon={LinkSquare02Icon} strokeWidth={1.5} />
                Environment settings
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
