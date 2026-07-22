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

export function StrokeDropdown({
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
          <Button variant="outline" size="sm" aria-label="Stroke width">
            <span className="text-muted-foreground">Stroke</span>
            <span className="font-mono tabular-nums">{value}</span>
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
          {options.map((width) => (
            <DropdownMenuRadioItem key={width} value={String(width)}>
              <span className="font-mono tabular-nums">{width}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
