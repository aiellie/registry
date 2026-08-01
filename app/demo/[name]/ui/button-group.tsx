"use client"

import {
  Example,
  ExampleWrapper,
} from "@/components/example"
import { Button } from "@/components/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Textarea } from "@/components/ui/textarea"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon, BotIcon, VolumeOffIcon, Tick02Icon, AlertCircleIcon, UserRemove01Icon, Share03Icon, Copy01Icon, Delete02Icon, ArrowRight01Icon, FlipHorizontalIcon, FlipVerticalIcon, Rotate01Icon, Search01Icon, MinusSignIcon, PlusSignIcon, Notification02Icon, AudioWave01Icon, ArrowLeft02Icon, ArrowRight02Icon, ArrowLeft01Icon } from "@hugeicons/core-free-icons"

export default function ButtonGroupExample() {
  return (
    <ExampleWrapper>
      <ButtonGroupBasic />
      <ButtonGroupWithInput />
      <ButtonGroupWithText />
      <ButtonGroupWithDropdown />
      <ButtonGroupWithSelect />
      <ButtonGroupWithIcons />
      <ButtonGroupWithInputGroup />
      <ButtonGroupWithFields />
      <ButtonGroupWithLike />
      <ButtonGroupWithSelectAndInput />
      <ButtonGroupNested />
      <ButtonGroupPagination />
      <ButtonGroupPaginationSplit />
      <ButtonGroupNavigation />
      <ButtonGroupTextAlignment />
      <ButtonGroupVertical />
      <ButtonGroupVerticalNested />
      <ButtonGroupWithPopover />
      <ButtonGroupWithSeparator />
      <ButtonGroupSize />
    </ExampleWrapper>
  )
}

function ButtonGroupBasic({ className }: { className?: string }) {
  return (
    <Example title="Basic" containerClassName={className}>
      <div className="flex flex-col gap-4">
        <ButtonGroup>
          <Button variant="outline">Button</Button>
          <Button variant="outline">Another Button</Button>
        </ButtonGroup>
      </div>
    </Example>
  )
}

function ButtonGroupWithInput({ className }: { className?: string }) {
  return (
    <Example title="With Input" containerClassName={className}>
      <div className="flex flex-col gap-4">
        <ButtonGroup>
          <Button variant="outline">Button</Button>
          <Input placeholder="Type something here..." />
        </ButtonGroup>
        <ButtonGroup>
          <Input placeholder="Type something here..." />
          <Button variant="outline">Button</Button>
        </ButtonGroup>
      </div>
    </Example>
  )
}

function ButtonGroupWithText({ className }: { className?: string }) {
  return (
    <Example title="With Text" containerClassName={className}>
      <div className="flex flex-col gap-4">
        <ButtonGroup>
          <ButtonGroupText>Text</ButtonGroupText>
          <Button variant="outline">Another Button</Button>
        </ButtonGroup>
        <ButtonGroup>
          <ButtonGroupText render={<Label htmlFor="input-text" />}>
            GPU Size
          </ButtonGroupText>
          <Input
            id="input-text"
            placeholder="Type something here..."
          />
        </ButtonGroup>
      </div>
    </Example>
  )
}

function ButtonGroupWithDropdown({ className }: { className?: string }) {
  return (
    <Example title="With Dropdown" containerClassName={className}>
      <div className="flex flex-col gap-4">
        <ButtonGroup>
          <Button variant="outline">Update</Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" size="icon" />}
            >
              <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Disable</DropdownMenuItem>
              <DropdownMenuItem variant="destructive">
                Uninstall
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="outline">Follow</Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" size="icon" />}
            >
              <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-50">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <HugeiconsIcon icon={VolumeOffIcon} strokeWidth={2} />
                  Mute Conversation
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
                  Mark as Read
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} />
                  Report Conversation
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HugeiconsIcon icon={UserRemove01Icon} strokeWidth={2} />
                  Block User
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HugeiconsIcon icon={Share03Icon} strokeWidth={2} />
                  Share Conversation
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} />
                  Copy Conversation
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem variant="destructive">
                  <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                  Delete Conversation
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </div>
    </Example>
  )
}

const currencyItems = [
  { label: "$", value: "$" },
  { label: "€", value: "€" },
  { label: "£", value: "£" },
]

function ButtonGroupWithSelect({ className }: { className?: string }) {
  return (
    <Example title="With Select" containerClassName={className}>
      <Field>
        <Label htmlFor="amount">Amount</Label>
        <ButtonGroup>
          <Select items={currencyItems} defaultValue={currencyItems[0]}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {currencyItems.map((item) => (
                  <SelectItem key={item.value} value={item}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input placeholder="Enter amount to send" />
          <Button variant="outline">
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
          </Button>
        </ButtonGroup>
      </Field>
    </Example>
  )
}

function ButtonGroupWithIcons({ className }: { className?: string }) {
  return (
    <Example title="With Icons" containerClassName={className}>
      <div className="flex flex-col gap-4">
        <ButtonGroup>
          <Button variant="outline">
            <HugeiconsIcon icon={FlipHorizontalIcon} strokeWidth={2} />
          </Button>
          <Button variant="outline">
            <HugeiconsIcon icon={FlipVerticalIcon} strokeWidth={2} />
          </Button>
          <Button variant="outline">
            <HugeiconsIcon icon={Rotate01Icon} strokeWidth={2} />
          </Button>
        </ButtonGroup>
      </div>
    </Example>
  )
}

function ButtonGroupWithInputGroup({ className }: { className?: string }) {
  return (
    <Example title="With Input Group" containerClassName={className}>
      <div className="flex flex-col gap-4">
        <InputGroup>
          <InputGroupInput placeholder="Type to search..." />
          <InputGroupAddon
            align="inline-start"
            className="text-muted-foreground"
          >
            <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
          </InputGroupAddon>
        </InputGroup>
      </div>
    </Example>
  )
}

function ButtonGroupWithFields({ className }: { className?: string }) {
  return (
    <Example title="With Fields" containerClassName={className}>
      <FieldGroup className="grid grid-cols-3 gap-4">
        <Field className="col-span-2">
          <Label htmlFor="width">Width</Label>
          <ButtonGroup>
            <InputGroup>
              <InputGroupInput id="width" />
              <InputGroupAddon className="text-muted-foreground">
                W
              </InputGroupAddon>
              <InputGroupAddon
                align="inline-end"
                className="text-muted-foreground"
              >
                px
              </InputGroupAddon>
            </InputGroup>
            <Button variant="outline" size="icon">
              <HugeiconsIcon icon={MinusSignIcon} strokeWidth={2} />
            </Button>
            <Button variant="outline" size="icon">
              <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
            </Button>
          </ButtonGroup>
        </Field>
      </FieldGroup>
    </Example>
  )
}

function ButtonGroupWithLike({ className }: { className?: string }) {
  return (
    <Example title="With Like" containerClassName={className}>
      <ButtonGroup>
        <Button variant="outline">
          <HugeiconsIcon icon={Notification02Icon} strokeWidth={2} data-icon="inline-start" />{" "}
          Like
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="w-12"
          render={<span />}
          nativeButton={false}
        >
          1.2K
        </Button>
      </ButtonGroup>
    </Example>
  )
}

const durationItems = [
  { label: "Hours", value: "hours" },
  { label: "Days", value: "days" },
  { label: "Weeks", value: "weeks" },
]

function ButtonGroupWithSelectAndInput({ className }: { className?: string }) {
  return (
    <Example title="With Select and Input" containerClassName={className}>
      <ButtonGroup>
        <Select items={durationItems} defaultValue={durationItems[0]}>
          <SelectTrigger id="duration">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              {durationItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input />
      </ButtonGroup>
    </Example>
  )
}

function ButtonGroupNested({ className }: { className?: string }) {
  return (
    <Example title="Nested" containerClassName={className}>
      <ButtonGroup>
        <ButtonGroup>
          <Button variant="outline" size="icon">
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <InputGroup>
            <InputGroupInput placeholder="Send a message..." />
            <Tooltip>
              <TooltipTrigger render={<InputGroupAddon align="inline-end" />}>
                <HugeiconsIcon icon={AudioWave01Icon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>Voice Mode</TooltipContent>
            </Tooltip>
          </InputGroup>
        </ButtonGroup>
      </ButtonGroup>
    </Example>
  )
}

function ButtonGroupPagination({ className }: { className?: string }) {
  return (
    <Example title="Pagination" containerClassName={className}>
      <ButtonGroup>
        <Button variant="outline" size="sm">
          <HugeiconsIcon icon={ArrowLeft02Icon} strokeWidth={2} data-icon="inline-start" />
          Previous
        </Button>
        <Button variant="outline" size="sm">
          1
        </Button>
        <Button variant="outline" size="sm">
          2
        </Button>
        <Button variant="outline" size="sm">
          3
        </Button>
        <Button variant="outline" size="sm">
          4
        </Button>
        <Button variant="outline" size="sm">
          5
        </Button>
        <Button variant="outline" size="sm">
          Next
          <HugeiconsIcon icon={ArrowRight02Icon} strokeWidth={2} data-icon="inline-end" />
        </Button>
      </ButtonGroup>
    </Example>
  )
}

function ButtonGroupPaginationSplit({ className }: { className?: string }) {
  return (
    <Example title="Pagination Split" containerClassName={className}>
      <ButtonGroup>
        <ButtonGroup>
          <Button variant="outline" size="sm">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            4
          </Button>
          <Button variant="outline" size="sm">
            5
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="outline" size="icon-xs">
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
          </Button>
          <Button variant="outline" size="icon-xs">
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
          </Button>
        </ButtonGroup>
      </ButtonGroup>
    </Example>
  )
}

function ButtonGroupNavigation({ className }: { className?: string }) {
  return (
    <Example title="Navigation" containerClassName={className}>
      <ButtonGroup>
        <ButtonGroup>
          <Button variant="outline">
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
          </Button>
          <Button variant="outline">
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
          </Button>
        </ButtonGroup>
        <ButtonGroup aria-label="Single navigation button">
          <Button variant="outline" size="icon">
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
          </Button>
        </ButtonGroup>
      </ButtonGroup>
    </Example>
  )
}

function ButtonGroupTextAlignment({ className }: { className?: string }) {
  return (
    <Example title="Text Alignment" containerClassName={className}>
      <Field>
        <Label id="alignment-label">Text Alignment</Label>
        <ButtonGroup aria-labelledby="alignment-label">
          <Button variant="outline" size="sm">
            Left
          </Button>
          <Button variant="outline" size="sm">
            Center
          </Button>
          <Button variant="outline" size="sm">
            Right
          </Button>
          <Button variant="outline" size="sm">
            Justify
          </Button>
        </ButtonGroup>
      </Field>
    </Example>
  )
}

function ButtonGroupVertical({ className }: { className?: string }) {
  return (
    <Example title="Vertical" containerClassName={className}>
      <div className="flex gap-6">
        <ButtonGroup
          orientation="vertical"
          aria-label="Media controls"
          className="h-fit"
        >
          <Button variant="outline" size="icon">
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
          </Button>
          <Button variant="outline" size="icon">
            <HugeiconsIcon icon={MinusSignIcon} strokeWidth={2} />
          </Button>
        </ButtonGroup>
      </div>
    </Example>
  )
}

function ButtonGroupVerticalNested({ className }: { className?: string }) {
  return (
    <Example title="Vertical Nested" containerClassName={className}>
      <ButtonGroup orientation="vertical" aria-label="Design tools palette">
        <ButtonGroup orientation="vertical">
          <Button variant="outline" size="icon">
            <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
          </Button>
          <Button variant="outline" size="icon">
            <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} />
          </Button>
          <Button variant="outline" size="icon">
            <HugeiconsIcon icon={Share03Icon} strokeWidth={2} />
          </Button>
        </ButtonGroup>
        <ButtonGroup orientation="vertical">
          <Button variant="outline" size="icon">
            <HugeiconsIcon icon={FlipHorizontalIcon} strokeWidth={2} />
          </Button>
          <Button variant="outline" size="icon">
            <HugeiconsIcon icon={FlipVerticalIcon} strokeWidth={2} />
          </Button>
          <Button variant="outline" size="icon">
            <HugeiconsIcon icon={Rotate01Icon} strokeWidth={2} />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="outline" size="icon">
            <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
          </Button>
        </ButtonGroup>
      </ButtonGroup>
    </Example>
  )
}

function ButtonGroupWithPopover({ className }: { className?: string }) {
  return (
    <Example title="With Popover" containerClassName={className}>
      <ButtonGroup>
        <Button variant="outline">
          <HugeiconsIcon icon={BotIcon} strokeWidth={2} data-icon="inline-start" />{" "}
          Copilot
        </Button>
        <Popover>
          <PopoverTrigger
            render={
              <Button variant="outline" size="icon" aria-label="Open Popover" />
            }
          >
            <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} />
          </PopoverTrigger>
          <PopoverContent align="end" className="rounded-xl text-sm">
            <PopoverHeader>
              <PopoverTitle>Start a new task with Copilot</PopoverTitle>
              <PopoverDescription>
                Describe your task in natural language.
              </PopoverDescription>
            </PopoverHeader>
            <Field>
              <FieldLabel htmlFor="task" className="sr-only">
                Task Description
              </FieldLabel>
              <Textarea
                id="task"
                placeholder="I need to..."
                className="resize-none"
              />
              <FieldDescription>
                Copilot will open a pull request for review.
              </FieldDescription>
            </Field>
          </PopoverContent>
        </Popover>
      </ButtonGroup>
    </Example>
  )
}

function ButtonGroupWithSeparator({ className }: { className?: string }) {
  return (
    <Example title="With Separator" containerClassName={className}>
      <ButtonGroup>
        <Button variant="secondary" size="sm">
          Copy
        </Button>
        <ButtonGroupSeparator />
        <Button variant="secondary" size="sm">
          Paste
        </Button>
      </ButtonGroup>
    </Example>
  )
}

function ButtonGroupSize({ className }: { className?: string }) {
  return (
    <Example title="Size" containerClassName={className}>
      <div className="flex flex-col items-start gap-8">
        <ButtonGroup>
          <Button variant="outline" size="sm">
            Small
          </Button>
          <Button variant="outline" size="sm">
            Button
          </Button>
          <Button variant="outline" size="sm">
            Group
          </Button>
          <Button variant="outline" size="icon-sm">
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="outline">Default</Button>
          <Button variant="outline">Button</Button>
          <Button variant="outline">Group</Button>
          <Button variant="outline" size="icon">
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="outline" size="lg">
            Large
          </Button>
          <Button variant="outline" size="lg">
            Button
          </Button>
          <Button variant="outline" size="lg">
            Group
          </Button>
          <Button variant="outline" size="icon-lg">
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
          </Button>
        </ButtonGroup>
      </div>
    </Example>
  )
}
