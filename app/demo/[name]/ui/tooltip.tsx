"use client"

import { Example, ExampleWrapper } from "@/components/example"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { HugeiconsIcon } from "@hugeicons/react"
import { AlertCircleIcon, FloppyDiskIcon } from "@hugeicons/core-free-icons"

export default function TooltipExample() {
  return (
    <ExampleWrapper>
      <TooltipBasic />
      <TooltipSides />
      <TooltipWithIcon />
      <TooltipLongContent />
      <TooltipDisabled />
      <TooltipWithKeyboard />
      <TooltipOnLink />
      <TooltipFormatted />
    </ExampleWrapper>
  )
}

function TooltipBasic({ className }: { className?: string }) {
  return (
    <Example title="Basic" containerClassName={className}>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" className="w-fit" />}>
          Show Tooltip
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </Example>
  )
}

function TooltipSides({ className }: { className?: string }) {
  return (
    <Example title="Sides" containerClassName={className}>
      <div className="flex flex-wrap gap-2">
        {(
          [
            "inline-start",
            "left",
            "top",
            "bottom",
            "right",
            "inline-end",
          ] as const
        ).map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger
              render={<Button variant="outline" className="w-fit capitalize" />}
            >
              {side.replace("-", " ")}
            </TooltipTrigger>
            <TooltipContent side={side}>
              <p>Add to library</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </Example>
  )
}

function TooltipWithIcon({ className }: { className?: string }) {
  return (
    <Example title="With Icon" containerClassName={className}>
      <Tooltip>
        <TooltipTrigger render={<Button variant="ghost" size="icon" />}>
          <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} />
          <span className="sr-only">Info</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Additional information</p>
        </TooltipContent>
      </Tooltip>
    </Example>
  )
}

function TooltipLongContent({ className }: { className?: string }) {
  return (
    <Example title="Long Content" containerClassName={className}>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" className="w-fit" />}>
          Show Tooltip
        </TooltipTrigger>
        <TooltipContent>
          To learn more about how this works, check out the docs. If you have
          any questions, please reach out to us.
        </TooltipContent>
      </Tooltip>
    </Example>
  )
}

function TooltipDisabled({ className }: { className?: string }) {
  return (
    <Example title="Disabled" containerClassName={className}>
      <Tooltip>
        <TooltipTrigger render={<span className="inline-block w-fit" />}>
          <Button variant="outline" disabled>
            Disabled
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>This feature is currently unavailable</p>
        </TooltipContent>
      </Tooltip>
    </Example>
  )
}

function TooltipWithKeyboard({ className }: { className?: string }) {
  return (
    <Example title="With Keyboard Shortcut" containerClassName={className}>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" size="icon-sm" />}>
          <HugeiconsIcon icon={FloppyDiskIcon} strokeWidth={2} />
        </TooltipTrigger>
        <TooltipContent>
          Save Changes <Kbd>S</Kbd>
        </TooltipContent>
      </Tooltip>
    </Example>
  )
}

function TooltipOnLink({ className }: { className?: string }) {
  return (
    <Example title="On Link" containerClassName={className}>
      <Tooltip>
        <TooltipTrigger
          render={
            <a
              href="#"
              className="w-fit text-sm text-primary underline-offset-4 hover:underline"
              onClick={(e) => e.preventDefault()}
            />
          }
        >
          Learn more
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to read the documentation</p>
        </TooltipContent>
      </Tooltip>
    </Example>
  )
}

function TooltipFormatted({ className }: { className?: string }) {
  return (
    <Example title="Formatted Content" containerClassName={className}>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" className="w-fit" />}>
          Status
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex flex-col gap-1">
            <p className="font-semibold">Active</p>
            <p className="text-xs opacity-80">Last updated 2 hours ago</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </Example>
  )
}
