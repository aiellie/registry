import { Button } from "@/components/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group"
import { Input } from "@/components/ui/input"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"

export const buttonGroup = {
  name: "button-group",
  components: {
    Default: (
      <div className="flex w-full items-center justify-center p-6">
        <ButtonGroup>
          <Button variant="outline">Archive</Button>
          <Button variant="outline">Report</Button>
          <Button variant="outline">Snooze</Button>
        </ButtonGroup>
      </div>
    ),
    Split: (
      <div className="flex w-full items-center justify-center p-6">
        <ButtonGroup>
          <Button variant="secondary">Follow</Button>
          <ButtonGroupSeparator />
          <Button
            variant="secondary"
            size="icon"
            aria-label="More follow options"
          >
            <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} />
          </Button>
        </ButtonGroup>
      </div>
    ),
    "With Text & Input": (
      <div className="flex w-full items-center justify-center p-6">
        <ButtonGroup className="w-full max-w-sm">
          <ButtonGroupText>https://</ButtonGroupText>
          <Input placeholder="example.com" />
          <Button variant="outline">Visit</Button>
        </ButtonGroup>
      </div>
    ),
  },
}
