"use client"

import {
  ComputerIcon,
  SmartPhone01Icon,
  Tablet01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function ViewportToggleGroup({
  onSelect,
}: {
  onSelect: (size: string) => void
}) {
  return (
    <ToggleGroup
      variant="outline"
      spacing={0}
      defaultValue={["100%"]}
      onValueChange={(value) => {
        const size = value[0]
        if (typeof size !== "string") {
          return
        }
        onSelect(size)
      }}
    >
      <ToggleGroupItem value="100%" aria-label="Desktop">
        <HugeiconsIcon icon={ComputerIcon} strokeWidth={2} />
      </ToggleGroupItem>
      <ToggleGroupItem value="60%" aria-label="Tablet">
        <HugeiconsIcon icon={Tablet01Icon} strokeWidth={2} />
      </ToggleGroupItem>
      <ToggleGroupItem value="30%" aria-label="Mobile">
        <HugeiconsIcon icon={SmartPhone01Icon} strokeWidth={2} />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
