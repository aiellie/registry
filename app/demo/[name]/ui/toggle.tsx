import { Example, ExampleWrapper } from "@/components/example"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
  BookmarkIcon,
} from "@hugeicons/core-free-icons"

export default function ToggleExample() {
  return (
    <ExampleWrapper>
      <ToggleBasic />
      <ToggleOutline />
      <ToggleSizes />
      <ToggleWithButtonText />
      <ToggleWithButtonIcon />
      <ToggleWithButtonIconText />
      <ToggleDisabled />
      <ToggleWithIcon />
    </ExampleWrapper>
  )
}

function ToggleBasic({ className }: { className?: string }) {
  return (
    <Example title="Basic" containerClassName={className}>
      <div className="flex flex-wrap items-center gap-2">
        <Toggle aria-label="Toggle bold" defaultPressed>
          <HugeiconsIcon icon={TextBoldIcon} strokeWidth={2} />
        </Toggle>
        <Toggle aria-label="Toggle italic">
          <HugeiconsIcon icon={TextItalicIcon} strokeWidth={2} />
        </Toggle>
        <Toggle aria-label="Toggle underline">
          <HugeiconsIcon icon={TextUnderlineIcon} strokeWidth={2} />
        </Toggle>
      </div>
    </Example>
  )
}

function ToggleOutline({ className }: { className?: string }) {
  return (
    <Example title="Outline" containerClassName={className}>
      <div className="flex flex-wrap items-center gap-2">
        <Toggle variant="outline" aria-label="Toggle italic">
          <HugeiconsIcon icon={TextItalicIcon} strokeWidth={2} />
          Italic
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle bold">
          <HugeiconsIcon icon={TextBoldIcon} strokeWidth={2} />
          Bold
        </Toggle>
      </div>
    </Example>
  )
}

function ToggleSizes({ className }: { className?: string }) {
  return (
    <Example title="Sizes" containerClassName={className}>
      <div className="flex flex-wrap items-center gap-2">
        <Toggle variant="outline" aria-label="Toggle small" size="sm">
          Small
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle default" size="default">
          Default
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle large" size="lg">
          Large
        </Toggle>
      </div>
    </Example>
  )
}

function ToggleWithButtonText({ className }: { className?: string }) {
  return (
    <Example title="With Button Text" containerClassName={className}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            Button
          </Button>
          <Toggle variant="outline" aria-label="Toggle sm" size="sm">
            Toggle
          </Toggle>
        </div>
        <div className="flex items-center gap-2">
          <Button size="default" variant="outline">
            Button
          </Button>
          <Toggle variant="outline" aria-label="Toggle default" size="default">
            Toggle
          </Toggle>
        </div>
        <div className="flex items-center gap-2">
          <Button size="lg" variant="outline">
            Button
          </Button>
          <Toggle variant="outline" aria-label="Toggle lg" size="lg">
            Toggle
          </Toggle>
        </div>
      </div>
    </Example>
  )
}

function ToggleWithButtonIcon({ className }: { className?: string }) {
  return (
    <Example title="With Button Icon" containerClassName={className}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-sm">
            <HugeiconsIcon icon={TextBoldIcon} strokeWidth={2} />
          </Button>
          <Toggle variant="outline" aria-label="Toggle sm icon" size="sm">
            <HugeiconsIcon icon={TextBoldIcon} strokeWidth={2} />
          </Toggle>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <HugeiconsIcon icon={TextItalicIcon} strokeWidth={2} />
          </Button>
          <Toggle
            variant="outline"
            aria-label="Toggle default icon"
            size="default"
          >
            <HugeiconsIcon icon={TextItalicIcon} strokeWidth={2} />
          </Toggle>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-lg">
            <HugeiconsIcon icon={TextUnderlineIcon} strokeWidth={2} />
          </Button>
          <Toggle variant="outline" aria-label="Toggle lg icon" size="lg">
            <HugeiconsIcon icon={TextUnderlineIcon} strokeWidth={2} />
          </Toggle>
        </div>
      </div>
    </Example>
  )
}

function ToggleWithButtonIconText({ className }: { className?: string }) {
  return (
    <Example title="With Button Icon + Text" containerClassName={className}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <HugeiconsIcon
              icon={TextBoldIcon}
              strokeWidth={2}
              data-icon="inline-start"
            />
            Button
          </Button>
          <Toggle variant="outline" aria-label="Toggle sm icon text" size="sm">
            <HugeiconsIcon icon={TextBoldIcon} strokeWidth={2} />
            Toggle
          </Toggle>
        </div>
        <div className="flex items-center gap-2">
          <Button size="default" variant="outline">
            <HugeiconsIcon
              icon={TextItalicIcon}
              strokeWidth={2}
              data-icon="inline-start"
            />
            Button
          </Button>
          <Toggle
            variant="outline"
            aria-label="Toggle default icon text"
            size="default"
          >
            <HugeiconsIcon icon={TextItalicIcon} strokeWidth={2} />
            Toggle
          </Toggle>
        </div>
        <div className="flex items-center gap-2">
          <Button size="lg" variant="outline">
            <HugeiconsIcon
              icon={TextUnderlineIcon}
              strokeWidth={2}
              data-icon="inline-start"
            />
            Button
          </Button>
          <Toggle variant="outline" aria-label="Toggle lg icon text" size="lg">
            <HugeiconsIcon icon={TextUnderlineIcon} strokeWidth={2} />
            Toggle
          </Toggle>
        </div>
      </div>
    </Example>
  )
}

function ToggleDisabled({ className }: { className?: string }) {
  return (
    <Example title="Disabled" containerClassName={className}>
      <div className="flex flex-wrap items-center gap-2">
        <Toggle aria-label="Toggle disabled" disabled>
          Disabled
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle disabled outline" disabled>
          Disabled
        </Toggle>
      </div>
    </Example>
  )
}

function ToggleWithIcon({ className }: { className?: string }) {
  return (
    <Example title="With Icon" containerClassName={className}>
      <div className="flex flex-wrap items-center gap-2">
        <Toggle aria-label="Toggle bookmark" defaultPressed>
          <HugeiconsIcon
            icon={BookmarkIcon}
            strokeWidth={2}
            className="group-data-[state=on]/toggle:fill-accent-foreground"
          />
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle bookmark outline">
          <HugeiconsIcon
            icon={BookmarkIcon}
            strokeWidth={2}
            className="group-data-[state=on]/toggle:fill-accent-foreground"
          />
          Bookmark
        </Toggle>
      </div>
    </Example>
  )
}
