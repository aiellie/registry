"use client"

import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SizeDropdown({
  value,
  options,
  onValueChange,
}: {
  value: number
  options: number[]
  onValueChange: (value: number) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" aria-label="Preview size">
            <span className="text-muted-foreground">Size</span>
            <span className="font-mono tabular-nums">{value}px</span>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              strokeWidth={2}
              className="text-muted-foreground"
            />
          </Button>
        }
      />
      <DropdownMenuContent align="start" className="min-w-28">
        <DropdownMenuRadioGroup
          value={String(value)}
          onValueChange={(next) => onValueChange(Number(next))}
        >
          {options.map((option) => (
            <DropdownMenuRadioItem key={option} value={String(option)}>
              <span className="font-mono tabular-nums">{option}px</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
