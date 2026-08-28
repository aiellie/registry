import { Example, ExampleWrapper } from "@/components/example"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  DashedLineCircleIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  FloppyDiskIcon,
} from "@hugeicons/core-free-icons"

export default function KbdExample() {
  return (
    <ExampleWrapper>
      <KbdBasic />
      <KbdModifierKeys />
      <KbdGroupExample />
      <KbdArrowKeys />
      <KbdWithIcons />
      <KbdWithIconsAndText />
      <KbdInInputGroup />
      <KbdInTooltip />
      <KbdInButton />
      <KbdWithSamp />
    </ExampleWrapper>
  )
}

function KbdBasic({ className }: { className?: string }) {
  return (
    <Example title="Basic" containerClassName={className}>
      <div className="flex items-center gap-2">
        <Kbd>Ctrl</Kbd>
        <Kbd>⌘K</Kbd>
        <Kbd>Ctrl + B</Kbd>
      </div>
    </Example>
  )
}

function KbdModifierKeys({ className }: { className?: string }) {
  return (
    <Example title="Modifier Keys" containerClassName={className}>
      <div className="flex items-center gap-2">
        <Kbd>⌘</Kbd>
        <Kbd>C</Kbd>
      </div>
    </Example>
  )
}

function KbdGroupExample({ className }: { className?: string }) {
  return (
    <Example title="KbdGroup" containerClassName={className}>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>Shift</Kbd>
        <Kbd>P</Kbd>
      </KbdGroup>
    </Example>
  )
}

function KbdArrowKeys({ className }: { className?: string }) {
  return (
    <Example title="Arrow Keys" containerClassName={className}>
      <div className="flex items-center gap-2">
        <Kbd>↑</Kbd>
        <Kbd>↓</Kbd>
        <Kbd>←</Kbd>
        <Kbd>→</Kbd>
      </div>
    </Example>
  )
}

function KbdWithIcons({ className }: { className?: string }) {
  return (
    <Example title="With Icons" containerClassName={className}>
      <KbdGroup>
        <Kbd>
          <HugeiconsIcon icon={DashedLineCircleIcon} strokeWidth={2} />
        </Kbd>
        <Kbd>
          <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
        </Kbd>
        <Kbd>
          <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
        </Kbd>
      </KbdGroup>
    </Example>
  )
}

function KbdWithIconsAndText({ className }: { className?: string }) {
  return (
    <Example title="With Icons and Text" containerClassName={className}>
      <KbdGroup>
        <Kbd>
          <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
          Left
        </Kbd>
        <Kbd>
          <HugeiconsIcon icon={DashedLineCircleIcon} strokeWidth={2} />
          Voice Enabled
        </Kbd>
      </KbdGroup>
    </Example>
  )
}

function KbdInInputGroup({ className }: { className?: string }) {
  return (
    <Example title="InputGroup" containerClassName={className}>
      <InputGroup>
        <InputGroupInput />
        <InputGroupAddon>
          <Kbd>Space</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </Example>
  )
}

function KbdInTooltip({ className }: { className?: string }) {
  return (
    <Example title="Tooltip" containerClassName={className}>
      <Tooltip>
        <TooltipTrigger render={<Button size="icon-sm" variant="outline" />}>
          <HugeiconsIcon icon={FloppyDiskIcon} strokeWidth={2} />
        </TooltipTrigger>
        <TooltipContent className="pe-1.5">
          <div className="flex items-center gap-2">
            Save Changes <Kbd>S</Kbd>
          </div>
        </TooltipContent>
      </Tooltip>
    </Example>
  )
}

function KbdInButton({ className }: { className?: string }) {
  return (
    <Example title="Button" containerClassName={className}>
      <Button variant="outline">
        Accept{" "}
        <Kbd data-icon="inline-end" className="translate-x-0.5">
          ⏎
        </Kbd>
      </Button>
    </Example>
  )
}

function KbdWithSamp({ className }: { className?: string }) {
  return (
    <Example title="With samp" containerClassName={className}>
      <Kbd>
        <samp>File</samp>
      </Kbd>
    </Example>
  )
}
