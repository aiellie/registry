"use client"

import { memo, useCallback, useDeferredValue, useMemo, useState } from "react"
import {
  Cancel01Icon,
  Layers01Icon,
  Search01Icon,
  Tag01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"

import { ItemWrapper } from "@/components/item-wrapper"
import { ItemDetailsDialog } from "@/components/registry/item-details-dialog"
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
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  type CategoryId,
  type Item,
  categories,
  categoryOrder,
  getItem,
} from "@/lib/aiellie-items"
import type { Component } from "@/lib/registry"
import { cn } from "@/lib/utils"

/**
 * Cards appended per "Show more" click. Each card is a live `/demo/<name>`
 * iframe, so the page size is what caps how many demo pages hydrate at once —
 * mounting all ~90 at load jams the main thread badly enough that the grid
 * itself never hydrates. `loading="lazy"` alone doesn't cap it: Chromium's
 * lazy-iframe distance threshold spans most of the grid.
 */
const PAGE_SIZE = 12

const TYPES: { id: Item["type"]; label: string }[] = [
  { id: "registry:block", label: "Blocks" },
  { id: "registry:component", label: "Components" },
  { id: "registry:ui", label: "UI Primitives" },
]

interface FacetOption {
  id: string
  label: string
  icon?: IconSvgElement
  count: number
}

/**
 * The same faceted filter the icon explorer uses (shadcn's `tasks` example,
 * ported to Base UI), generalized over its options so both the category and
 * type filters can share it.
 */
function FacetedFilter({
  label,
  icon,
  options,
  value,
  onValueChange,
}: {
  label: string
  icon: IconSvgElement
  options: FacetOption[]
  /** Selected option ids; an empty array means "no filter". */
  value: string[]
  onValueChange: (ids: string[]) => void
}) {
  const selected = new Set(value)
  const byId = new Map(options.map((option) => [option.id, option]))

  const toggle = (id: string) =>
    onValueChange(
      selected.has(id) ? value.filter((entry) => entry !== id) : [...value, id]
    )

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" size="sm" className="h-8 border-dashed" />
        }
      >
        <HugeiconsIcon icon={icon} strokeWidth={2} />
        {label}
        {selected.size > 0 && (
          <>
            {/* A button may only hold phrasing content, so both the rule and
                the chip row render as spans rather than the default divs. */}
            <Separator
              orientation="vertical"
              render={<span />}
              className="mx-0.5 h-full"
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
                value.map((id) => (
                  <Badge
                    key={id}
                    variant="secondary"
                    className="h-4 rounded-sm px-1 font-normal"
                  >
                    {byId.get(id)?.label ?? id}
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
          <CommandInput placeholder={label} />
          <CommandList>
            <CommandEmpty>Nothing found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selected.has(option.id)
                return (
                  <CommandItem
                    key={option.id}
                    value={option.label}
                    onSelect={() => toggle(option.id)}
                    // CommandItem appends its own trailing tick; here the state
                    // lives in the leading box, so that one is dropped.
                    className="[&>svg:last-child]:hidden"
                  >
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
                    {option.icon ? (
                      <HugeiconsIcon
                        icon={option.icon}
                        size={16}
                        strokeWidth={2}
                        className="shrink-0 text-muted-foreground"
                      />
                    ) : (
                      <span className="size-4 shrink-0" aria-hidden="true" />
                    )}
                    <span className="truncate">{option.label}</span>
                    <span className="ms-auto font-mono text-xs text-muted-foreground tabular-nums">
                      {option.count}
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

const ItemCard = memo(function ItemCard({
  item,
  meta,
  onSelect,
}: {
  item: Component
  meta: Item
  onSelect: (item: Component) => void
}) {
  const isBlock = meta.type === "registry:block"

  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className={cn(
        "style-lyra:rounded-none style-sera:rounded-none min-w-0 cursor-pointer rounded-2xl text-start focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
        isBlock && "sm:col-span-2"
      )}
    >
      <ItemWrapper
        containerClassName="h-full"
        title={
          <>
            <HugeiconsIcon
              icon={meta.icon}
              strokeWidth={2}
              className="size-3.5 shrink-0"
            />
            <span className="truncate text-foreground">{item.title}</span>
            {meta.isNew && (
              <Status
                variant="brand"
                className="ms-auto border-transparent bg-transparent px-0"
              >
                <StatusIndicator />
                <StatusLabel>New</StatusLabel>
              </Status>
            )}
          </>
        }
      >
        <div
          className={cn(
            "relative w-full overflow-hidden bg-background bg-[radial-gradient(color-mix(in_oklch,var(--border)_70%,transparent)_1px,transparent_1px)] bg-size-[16px_16px]",
            isBlock ? "aspect-[16/9]" : "aspect-[4/3]"
          )}
        >
          {/* Rendered at twice the card's size and scaled back down, so the
              demo lays out against a realistic viewport. Physical left/top-left
              origin is direction-safe: the 200% frame scales back to exactly
              cover the card either way. */}
          <iframe
            src={`/demo/${item.name}`}
            title={`${item.title} preview`}
            loading="lazy"
            tabIndex={-1}
            className="pointer-events-none absolute top-0 left-0 h-[200%] w-[200%] origin-top-left scale-50 border-0"
          />
        </div>
      </ItemWrapper>
    </button>
  )
})

export function ItemsGrid({ items }: { items: Component[] }) {
  const [query, setQuery] = useState("")
  const [categoryIds, setCategoryIds] = useState<string[]>([])
  const [typeIds, setTypeIds] = useState<string[]>([])
  const [limit, setLimit] = useState(PAGE_SIZE)
  /** The item whose details dialog is open, or `null` when closed. */
  const [selected, setSelected] = useState<Component | null>(null)

  // Stable so the memoized cards don't re-render on every grid state change.
  const handleSelect = useCallback((item: Component) => setSelected(item), [])

  // Only items curated in `lib/items.ts` — the same set the sidebar shows, and
  // every one of them has a `/demo/<name>` page to preview — minus the ones
  // opted out of the home grid via `displayHome`.
  const curated = useMemo(() => {
    const rank = new Map(categoryOrder.map((id, index) => [id, index]))
    return items
      .map((item) => ({ item, meta: getItem(item.name) }))
      .filter(
        (entry): entry is { item: Component; meta: Item } =>
          entry.meta !== undefined && entry.meta.displayHome
      )
      .sort(
        (a, b) =>
          rank.get(a.meta.category)! - rank.get(b.meta.category)! ||
          a.item.title.localeCompare(b.item.title)
      )
  }, [items])

  // Keeps typing responsive: filtering re-renders the whole grid, so it runs
  // at a lower priority than the keystroke that triggered it.
  const deferredQuery = useDeferredValue(query)
  const trimmed = deferredQuery.trim().toLowerCase()

  const filtered = useMemo(() => {
    const selectedCategories = new Set(categoryIds)
    const selectedTypes = new Set(typeIds)

    return curated.filter(({ item, meta }) => {
      if (selectedCategories.size > 0 && !selectedCategories.has(meta.category))
        return false
      if (selectedTypes.size > 0 && !selectedTypes.has(meta.type)) return false
      if (!trimmed) return true

      const haystack =
        `${item.name} ${item.title} ${item.description ?? ""} ${categories[meta.category].label}`.toLowerCase()
      return trimmed.split(/\s+/).every((word) => haystack.includes(word))
    })
  }, [curated, categoryIds, typeIds, trimmed])

  const categoryOptions = useMemo(() => {
    const counts = new Map<CategoryId, number>()
    for (const { meta } of curated)
      counts.set(meta.category, (counts.get(meta.category) ?? 0) + 1)

    return categoryOrder
      .filter((id) => counts.has(id))
      .map((id) => ({
        id,
        label: categories[id].label,
        icon: categories[id].icon,
        count: counts.get(id)!,
      }))
  }, [curated])

  const typeOptions = useMemo(
    () =>
      TYPES.map((type) => ({
        ...type,
        count: curated.filter(({ meta }) => meta.type === type.id).length,
      })).filter((type) => type.count > 0),
    [curated]
  )

  // A new query or filter means a new result set, so collapse back to one
  // page. Adjusting during render rather than in an effect avoids a pass that
  // paints the old limit against the new results.
  const resetKey = `${trimmed} ${categoryIds.join(",")} ${typeIds.join(",")}`
  const [limitedFor, setLimitedFor] = useState(resetKey)
  if (limitedFor !== resetKey) {
    setLimitedFor(resetKey)
    setLimit(PAGE_SIZE)
  }

  const visible = useMemo(() => filtered.slice(0, limit), [filtered, limit])
  const hasMore = limit < filtered.length

  const hasFilters =
    query.trim() !== "" || categoryIds.length > 0 || typeIds.length > 0
  const nothingFound = filtered.length === 0

  return (
    <TooltipProvider delay={300}>
      <div className="sticky top-14 z-20 -mx-5 border-b bg-background/80 px-5 py-2.5 backdrop-blur-md md:-mx-10 md:px-10">
        <div className="flex flex-wrap items-center gap-2">
          <InputGroup className="h-8.5 w-full sm:w-64">
            <InputGroupAddon>
              <HugeiconsIcon
                icon={Search01Icon}
                strokeWidth={2}
                className="size-4"
              />
            </InputGroupAddon>
            <InputGroupInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={
                filtered.length === curated.length
                  ? `Search ${curated.length} components…`
                  : `Search ${filtered.length} of ${curated.length} components…`
              }
              aria-label="Search components"
            />
            {query && (
              <InputGroupAddon align="inline-end">
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="text-muted-foreground hover:text-foreground"
                        aria-label="Clear search"
                      />
                    }
                  >
                    <HugeiconsIcon
                      icon={Cancel01Icon}
                      strokeWidth={2}
                      className="size-3.5"
                    />
                  </TooltipTrigger>
                  <TooltipContent>Clear search</TooltipContent>
                </Tooltip>
              </InputGroupAddon>
            )}
          </InputGroup>

          <FacetedFilter
            label="Category"
            icon={Tag01Icon}
            options={categoryOptions}
            value={categoryIds}
            onValueChange={setCategoryIds}
          />

          <FacetedFilter
            label="Type"
            icon={Layers01Icon}
            options={typeOptions}
            value={typeIds}
            onValueChange={setTypeIds}
          />
          <Button
            variant="destructive"
            size="sm"
            className="ms-auto h-8"
            disabled={!hasFilters}
            onClick={() => {
              setQuery("")
              setCategoryIds([])
              setTypeIds([])
            }}
          >
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
            Reset
          </Button>
        </div>
      </div>

      {nothingFound ? (
        <Empty className="rounded-xl border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
            </EmptyMedia>
            <EmptyTitle>
              {trimmed
                ? `No components match “${query}”`
                : "Nothing matches these filters"}
            </EmptyTitle>
            <EmptyDescription>
              Try a broader word — “input”, “menu”, “chart” — or clear the
              filters and search the whole registry.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map(({ item, meta }) => (
              <ItemCard
                key={item.name}
                item={item}
                meta={meta}
                onSelect={handleSelect}
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLimit((current) => current + PAGE_SIZE)}
              >
                Show more
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                  {filtered.length - limit} left
                </span>
              </Button>
            </div>
          )}
        </>
      )}

      <ItemDetailsDialog
        item={selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
      />
    </TooltipProvider>
  )
}
