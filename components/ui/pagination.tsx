"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  MoreHorizontalCircle01Icon,
} from "@hugeicons/core-free-icons"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex items-center gap-0.5", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
  disabled?: boolean
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  disabled,
  size = "icon",
  href,
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      variant={isActive ? "outline" : "ghost"}
      size={size}
      disabled={disabled}
      className={cn(
        "aria-disabled:pointer-events-none aria-disabled:opacity-50",
        className
      )}
      nativeButton={false}
      render={
        <a
          aria-current={isActive ? "page" : undefined}
          data-slot="pagination-link"
          data-active={isActive}
          data-disabled={disabled || undefined}
          href={disabled ? undefined : href}
          {...props}
        />
      }
    />
  )
}

function PaginationPrevious({
  className,
  text = "Previous",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger
        data-slot="pagination-link"
        render={
          <PaginationLink
            aria-label={text}
            className={cn(className)}
            {...props}
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              strokeWidth={2}
              className="rtl:rotate-180"
            />
          </PaginationLink>
        }
      />
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  )
}

function PaginationNext({
  className,
  text = "Next",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger
        data-slot="pagination-link"
        render={
          <PaginationLink
            aria-label={text}
            className={cn(className)}
            {...props}
          >
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              strokeWidth={2}
              className="rtl:rotate-180"
            />
          </PaginationLink>
        }
      />
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  )
}

type PaginationEllipsisProps = React.ComponentProps<"span"> & {
  /** Pages offered by the picker. Omit to render a static ellipsis. */
  pages?: number[]
  page?: number
  onPageChange?: (page: number) => void
  text?: string
}

function PaginationEllipsis({
  className,
  pages,
  page,
  onPageChange,
  text = "More pages",
  ...props
}: PaginationEllipsisProps) {
  if (!pages?.length) {
    return (
      <span
        aria-hidden
        data-slot="pagination-ellipsis"
        className={cn(
          "flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
          className
        )}
        {...props}
      >
        <HugeiconsIcon icon={MoreHorizontalCircle01Icon} strokeWidth={2} />
        <span className="sr-only">{text}</span>
      </span>
    )
  }

  return (
    <Select
      value={page ?? null}
      onValueChange={(value: number | null) => {
        if (value != null) onPageChange?.(value)
      }}
    >
      <Tooltip>
        <TooltipTrigger
          render={
            <SelectPrimitive.Trigger
              data-slot="pagination-ellipsis"
              aria-label={text}
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(className)}
                  {...(props as React.ComponentProps<typeof Button>)}
                />
              }
            >
              <HugeiconsIcon
                icon={MoreHorizontalCircle01Icon}
                strokeWidth={2}
              />
            </SelectPrimitive.Trigger>
          }
        />
        <TooltipContent>{text}</TooltipContent>
      </Tooltip>
      <SelectContent
        alignItemWithTrigger={false}
        className="w-auto min-w-20 tabular-nums"
      >
        <SelectGroup>
          {pages.map((value) => (
            <SelectItem key={value} value={value}>
              {value}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
