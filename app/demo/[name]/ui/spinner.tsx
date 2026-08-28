import { Example, ExampleWrapper } from "@/components/example"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight02Icon, Loading03Icon } from "@hugeicons/core-free-icons"

export default function SpinnerExample() {
  return (
    <ExampleWrapper>
      <SpinnerBasic />
      <SpinnerSize />
      <SpinnerCustom />
      <SpinnerInButtons />
      <SpinnerInBadges />
      <SpinnerInInputGroup />
      <SpinnerInEmpty />
    </ExampleWrapper>
  )
}

function SpinnerBasic({ className }: { className?: string }) {
  return (
    <Example title="Basic" containerClassName={className}>
      <div className="flex items-center gap-6">
        <Spinner />
        <Spinner className="size-6" />
      </div>
    </Example>
  )
}

function SpinnerSize({ className }: { className?: string }) {
  return (
    <Example title="Sizes" containerClassName={className}>
      <div className="flex items-center gap-6">
        <Spinner className="size-3" />
        <Spinner className="size-4" />
        <Spinner className="size-6" />
        <Spinner className="size-8" />
      </div>
    </Example>
  )
}

function SpinnerCustom({ className }: { className?: string }) {
  return (
    <Example title="Custom" containerClassName={className}>
      <div className="flex items-center gap-4">
        <HugeiconsIcon
          icon={Loading03Icon}
          strokeWidth={2}
          role="status"
          aria-label="Loading"
          className="size-4 animate-spin"
        />
      </div>
    </Example>
  )
}

function SpinnerInButtons({ className }: { className?: string }) {
  return (
    <Example title="In Buttons" containerClassName={className}>
      <div className="flex flex-wrap items-center gap-4">
        <Button>
          <Spinner data-icon="inline-start" /> Submit
        </Button>
        <Button disabled>
          <Spinner data-icon="inline-start" /> Disabled
        </Button>
        <Button variant="outline" disabled>
          <Spinner data-icon="inline-start" /> Outline
        </Button>
        <Button variant="outline" size="icon" disabled>
          <Spinner data-icon="inline-start" />
          <span className="sr-only">Loading...</span>
        </Button>
      </div>
    </Example>
  )
}

function SpinnerInBadges({ className }: { className?: string }) {
  return (
    <Example
      title="In Badges"
      className="items-center justify-center"
      containerClassName={className}
    >
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Badge>
          <Spinner data-icon="inline-start" />
          Badge
        </Badge>
        <Badge variant="secondary">
          <Spinner data-icon="inline-start" />
          Badge
        </Badge>
        <Badge variant="destructive">
          <Spinner data-icon="inline-start" />
          Badge
        </Badge>
        <Badge variant="outline">
          <Spinner data-icon="inline-start" />
          Badge
        </Badge>
      </div>
    </Example>
  )
}

function SpinnerInInputGroup({ className }: { className?: string }) {
  return (
    <Example title="In Input Group" containerClassName={className}>
      <Field>
        <FieldLabel htmlFor="input-group-spinner">Input Group</FieldLabel>
        <InputGroup>
          <InputGroupInput id="input-group-spinner" />
          <InputGroupAddon>
            <Spinner />
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </Example>
  )
}

function SpinnerInEmpty({ className }: { className?: string }) {
  return (
    <Example
      title="In Empty State"
      containerClassName={cn("lg:col-span-full", className)}
    >
      <Empty className="min-h-[300px]">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Spinner />
          </EmptyMedia>
          <EmptyTitle>No projects yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t created any projects yet. Get started by creating
            your first project.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button render={<a href="#" />} nativeButton={false}>
              Create project
            </Button>
            <Button variant="outline">Import project</Button>
          </div>
          <Button
            variant="link"
            render={<a href="#" />}
            nativeButton={false}
            className="text-muted-foreground"
          >
            Learn more <HugeiconsIcon icon={ArrowRight02Icon} strokeWidth={2} />
          </Button>
        </EmptyContent>
      </Empty>
    </Example>
  )
}
