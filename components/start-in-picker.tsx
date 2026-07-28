"use client"

import * as React from "react"

import {
  ArrowMoveUpRightIcon,
  ArrowRight01Icon,
  CloudOffIcon,
  GlobeIcon,
  LaptopIcon,
  SourceCodeSquareIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export type StartIn = "local" | "worktree" | "codex-web" | "cloud"

export const START_IN_OPTIONS = [
  {
    value: "local",
    label: "Work locally",
    triggerLabel: "Local",
    icon: LaptopIcon,
  },
  {
    value: "worktree",
    label: "New worktree",
    triggerLabel: "New worktree",
    icon: ArrowMoveUpRightIcon,
  },
  {
    value: "codex-web",
    label: "Connect Codex web",
    triggerLabel: "Codex web",
    icon: SourceCodeSquareIcon,
    web: true,
  },
  {
    value: "cloud",
    label: "Send to cloud",
    triggerLabel: "Cloud",
    icon: CloudOffIcon,
    disabled: true,
  },
] satisfies {
  value: StartIn
  label: string
  triggerLabel: string
  icon: IconSvgElement
  web?: boolean
  disabled?: boolean
}[]

export function StartInPicker({
  value,
  onValueChange,
  onWorktreeSetting,
  open,
  onOpenChange,
  trigger,
}: {
  value: StartIn
  onValueChange: (value: StartIn) => void
  onWorktreeSetting?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger: React.ReactElement
}) {
  const close = () => onOpenChange?.(false)

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger render={trigger} />
      <PopoverContent side="top" align="start" className="w-64 gap-0 p-0">
        <Command className="p-0">
          <CommandList>
            <CommandGroup heading="Start in">
              {START_IN_OPTIONS.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  disabled={"disabled" in option && option.disabled}
                  data-checked={option.value === value}
                  onSelect={() => {
                    onValueChange(option.value)
                    close()
                  }}
                >
                  <HugeiconsIcon icon={option.icon} strokeWidth={1.5} />
                  {option.label}
                  {"web" in option && option.web ? (
                    <span data-slot="command-shortcut" className="ms-auto">
                      <HugeiconsIcon icon={GlobeIcon} strokeWidth={1.5} />
                    </span>
                  ) : null}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                value="Worktree setting"
                onSelect={() => {
                  onWorktreeSetting?.()
                  close()
                }}
              >
                Worktree setting
                <span data-slot="command-shortcut" className="ms-auto">
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    strokeWidth={1.5}
                    className="rtl:rotate-180"
                  />
                </span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
