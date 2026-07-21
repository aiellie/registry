import {
  Example,
  ExampleWrapper,
} from "@/components/example"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { HugeiconsIcon } from "@hugeicons/react"
import { Mail01Icon, PlusSignIcon } from "@hugeicons/core-free-icons"

export default function ButtonExample() {
  return (
    <ExampleWrapper>
      <ButtonVariants />
      <ButtonSizes />
      <ButtonWithIconAndLoading />
    </ExampleWrapper>
  )
}

function ButtonVariants() {
  return (
    <Example title="Variants">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </div>
    </Example>
  )
}

function ButtonSizes() {
  return (
    <Example title="Sizes">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button variant="outline" size="xs">
          Extra Small
        </Button>
        <Button variant="outline" size="sm">
          Small
        </Button>
        <Button variant="outline">Default</Button>
        <Button variant="outline" size="lg">
          Large
        </Button>
        <Button variant="outline" size="icon" aria-label="Add new item">
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
        </Button>
      </div>
    </Example>
  )
}

function ButtonWithIconAndLoading() {
  return (
    <Example title="With Icon & Loading">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button variant="outline">
          <HugeiconsIcon
            icon={Mail01Icon}
            strokeWidth={2}
            data-icon="inline-start"
          />
          Login with Email
        </Button>
        <Button disabled>
          <Spinner data-icon="inline-start" />
          Please wait
        </Button>
      </div>
    </Example>
  )
}
