"use client"

import { Tag01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { type CompactElement, type IconCategory } from "@/lib/icon-sets"
import { cn } from "@/lib/utils"

import { IconGlyph } from "./icon-glyph"

/**
 * The faceted filter from shadcn's `tasks` example: a dashed trigger that grows
 * chips as you select, over a searchable list of checkboxes. Ported to Base UI —
 * the trigger composes with `render` rather than `asChild`. The rows are
 * HugeIcons' own 59 categories, straight out of the manifest.
 */
export function IconCategories({
  categories,
  value,
  onValueChange,
  repElements,
}: {
  categories: IconCategory[]
  /** Selected categories; an empty array means "no filter". */
  value: IconCategory[]
  onValueChange: (categories: IconCategory[]) => void
  /** Category id → thumbnail geometry, inlined in the manifest. */
  repElements: Record<string, CompactElement[]>
}) {
  const selected = new Set(value.map((category) => category.id))

  const toggle = (category: IconCategory) =>
    onValueChange(
      selected.has(category.id)
        ? value.filter((entry) => entry.id !== category.id)
        : [...value, category]
    )

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" size="sm" className="h-8 border-dashed" />
        }
      >
        <HugeiconsIcon icon={Tag01Icon} strokeWidth={2} />
        Category
        {selected.size > 0 && (
          <>
            {/* A button may only hold phrasing content, so both the rule and the
                chip row render as spans rather than the default divs. */}
            <Separator
              orientation="vertical"
              render={<span />}
              className="mx-0.5"
            />
            <Badge
              variant="secondary"
              className="h-4 rounded-sm px-1 font-normal lg:hidden"
            >
              {selected.size}
            </Badge>
            <span className="hidden gap-1 lg:flex">
              {selected.size > 2 ? (
                <Badge
                  variant="secondary"
                  className="h-4 rounded-sm px-1 font-normal"
                >
                  {selected.size} selected
                </Badge>
              ) : (
                value.map((category) => (
                  <Badge
                    key={category.id}
                    variant="secondary"
                    className="h-4 rounded-sm px-1 font-normal"
                  >
                    {category.label}
                  </Badge>
                ))
              )}
            </span>
          </>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-60 gap-0 overflow-hidden rounded-xl p-0"
      >
        <Command>
          <CommandInput placeholder="Category" />
          <CommandList>
            <CommandEmpty>No categories found.</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => {
                const isSelected = selected.has(category.id)
                const elements = repElements[category.id]
                return (
                  <CommandItem
                    key={category.id}
                    // The slug rides along so cmdk matches "date-time" as
                    // readily as the label it prints.
                    value={`${category.label} ${category.id}`}
                    onSelect={() => toggle(category)}
                    // CommandItem appends its own trailing tick; here the state
                    // lives in the leading box, so that one is dropped.
                    className="[&>svg:last-child]:hidden"
                  >
                    {/* Shaped like the system's Checkbox rather than the
                        example's `rounded-sm` box — at this radius scale that
                        would round into something that reads as a radio. */}
                    <span
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input dark:bg-input/30 [&_svg]:invisible"
                      )}
                    >
                      <HugeiconsIcon
                        icon={Tick02Icon}
                        strokeWidth={2}
                        className="size-3.5"
                      />
                    </span>
                    {elements ? (
                      <IconGlyph
                        elements={elements}
                        size={16}
                        strokeWidth={2}
                        className="shrink-0 text-muted-foreground"
                      />
                    ) : (
                      <span className="size-4 shrink-0" aria-hidden="true" />
                    )}
                    <span className="truncate">{category.label}</span>
                    <span className="ms-auto font-mono text-xs text-muted-foreground tabular-nums">
                      {category.count.toLocaleString()}
                    </span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selected.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => onValueChange([])}
                    className="justify-center text-center [&>svg:last-child]:hidden"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
