import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"
import { HugeiconsIcon } from "@hugeicons/react"
import { Copy01Icon, Search01Icon, SentIcon } from "@hugeicons/core-free-icons"

export const inputGroup = {
  name: "input-group",
  components: {
    Search: (
      <div className="flex w-full justify-center p-6">
        <InputGroup className="max-w-sm">
          <InputGroupAddon>
            <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon align="inline-end">
            <Kbd>⌘K</Kbd>
          </InputGroupAddon>
        </InputGroup>
      </div>
    ),
    Url: (
      <div className="flex w-full justify-center p-6">
        <InputGroup className="max-w-sm">
          <InputGroupAddon>
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            placeholder="example.com"
            defaultValue="ui.aiellie.dev"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-xs" aria-label="Copy URL">
              <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    ),
    Textarea: (
      <div className="flex w-full justify-center p-6">
        <InputGroup className="max-w-sm">
          <InputGroupTextarea placeholder="Ask, search or chat..." />
          <InputGroupAddon align="block-end" className="border-t">
            <InputGroupText>120 characters left</InputGroupText>
            <InputGroupButton
              variant="default"
              size="icon-xs"
              className="ms-auto"
              aria-label="Send"
            >
              <HugeiconsIcon icon={SentIcon} strokeWidth={2} />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    ),
  },
}
