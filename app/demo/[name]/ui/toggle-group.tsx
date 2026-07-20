import { HugeiconsIcon } from "@hugeicons/react"
import {
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from "@hugeicons/core-free-icons"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export const toggleGroup = {
  name: "toggle-group",
  components: {
    Multiple: (
      <div className="flex w-full items-center justify-center p-6">
        <ToggleGroup multiple defaultValue={["bold"]}>
          <ToggleGroupItem value="bold" aria-label="Toggle bold">
            <HugeiconsIcon icon={TextBoldIcon} strokeWidth={2} />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic">
            <HugeiconsIcon icon={TextItalicIcon} strokeWidth={2} />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Toggle underline">
            <HugeiconsIcon icon={TextUnderlineIcon} strokeWidth={2} />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    ),
    Single: (
      <div className="flex w-full items-center justify-center p-6">
        <ToggleGroup variant="outline" spacing={0} defaultValue={["center"]}>
          <ToggleGroupItem value="left" aria-label="Align left">
            <HugeiconsIcon icon={TextAlignLeftIcon} strokeWidth={2} />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align center">
            <HugeiconsIcon icon={TextAlignCenterIcon} strokeWidth={2} />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align right">
            <HugeiconsIcon icon={TextAlignRightIcon} strokeWidth={2} />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    ),
    Vertical: (
      <div className="flex w-full items-center justify-center p-6">
        <ToggleGroup
          orientation="vertical"
          variant="outline"
          size="sm"
          defaultValue={["billing"]}
        >
          <ToggleGroupItem value="general">General</ToggleGroupItem>
          <ToggleGroupItem value="billing">Billing</ToggleGroupItem>
          <ToggleGroupItem value="team">Team</ToggleGroupItem>
        </ToggleGroup>
      </div>
    ),
  },
}
