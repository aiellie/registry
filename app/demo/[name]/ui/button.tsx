import {
  Example,
  ExampleWrapper,
} from "@/components/example"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Copy01Icon,
  Mail01Icon,
  PencilEdit02Icon,
  PlusSignIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons"

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
        <Button variant="inverse">Inverse</Button>
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
      <div className="flex flex-col items-center gap-2">
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
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button variant="outline" size="icon-xs" aria-label="Add" />
              }
            >
              <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
            </TooltipTrigger>
            <TooltipContent>icon-xs</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button variant="outline" size="icon-sm" aria-label="Search" />
              }
            >
              <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
            </TooltipTrigger>
            <TooltipContent>icon-sm</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button variant="outline" size="icon" aria-label="Edit" />
              }
            >
              <HugeiconsIcon icon={PencilEdit02Icon} strokeWidth={2} />
            </TooltipTrigger>
            <TooltipContent>icon</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button variant="outline" size="icon-lg" aria-label="Copy" />
              }
            >
              <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} />
            </TooltipTrigger>
            <TooltipContent>icon-lg</TooltipContent>
          </Tooltip>
        </div>
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
