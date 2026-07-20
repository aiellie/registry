import { HugeiconsIcon } from "@hugeicons/react"
import {
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from "@hugeicons/core-free-icons"

import { Toggle } from "@/components/ui/toggle"

export const toggle = {
  name: "toggle",
  components: {
    Default: (
      <div className="flex w-full items-center justify-center p-6">
        <Toggle aria-label="Toggle bold">
          <HugeiconsIcon icon={TextBoldIcon} strokeWidth={2} />
        </Toggle>
      </div>
    ),
    Outline: (
      <div className="flex w-full items-center justify-center gap-2 p-6">
        <Toggle variant="outline" aria-label="Toggle italic">
          <HugeiconsIcon icon={TextItalicIcon} strokeWidth={2} />
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle underline" defaultPressed>
          <HugeiconsIcon icon={TextUnderlineIcon} strokeWidth={2} />
          Underline
        </Toggle>
      </div>
    ),
    Sizes: (
      <div className="flex w-full items-center justify-center gap-2 p-6">
        <Toggle size="sm" variant="outline" aria-label="Toggle bold small">
          <HugeiconsIcon icon={TextBoldIcon} strokeWidth={2} />
          Small
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle bold default">
          <HugeiconsIcon icon={TextBoldIcon} strokeWidth={2} />
          Default
        </Toggle>
        <Toggle size="lg" variant="outline" aria-label="Toggle bold large">
          <HugeiconsIcon icon={TextBoldIcon} strokeWidth={2} />
          Large
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle disabled" disabled>
          Disabled
        </Toggle>
      </div>
    ),
  },
}
