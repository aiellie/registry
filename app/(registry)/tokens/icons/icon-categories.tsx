"use client"

import { useMemo } from "react"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  type CompactElement,
  type IconCategory,
  toSvgElement,
} from "@/lib/hugeicons"

/** Stands in for "no filter"; base-ui wants a real item, not null, in the list. */
export const ALL_CATEGORIES: IconCategory = {
  id: "",
  label: "All categories",
  count: 0,
  rep: null,
}

export function IconCategories({
  categories,
  value,
  onValueChange,
  repElements,
  total,
}: {
  categories: IconCategory[]
  value: IconCategory
  onValueChange: (category: IconCategory) => void
  /** Category id → thumbnail geometry, inlined in the manifest. */
  repElements: Record<string, CompactElement[]>
  total: number
}) {
  const items = useMemo(
    () => [{ ...ALL_CATEGORIES, count: total }, ...categories],
    [categories, total]
  )

  return (
    <Combobox
      items={items}
      value={value}
      onValueChange={(next: IconCategory | null) =>
        onValueChange(next ?? ALL_CATEGORIES)
      }
      itemToStringValue={(item: IconCategory) => item.label}
    >
      <ComboboxInput
        className="h-8 w-full sm:w-56"
        placeholder="All categories"
        aria-label="Filter by category"
      />
      <ComboboxContent>
        <ComboboxEmpty>No categories found.</ComboboxEmpty>
        <ComboboxList>
          {(item: IconCategory) => {
            const elements = repElements[item.id]
            return (
              <ComboboxItem key={item.id || "all"} value={item}>
                {elements ? (
                  <HugeiconsIcon
                    icon={toSvgElement(elements)}
                    size={16}
                    strokeWidth={2}
                    className="shrink-0 text-muted-foreground"
                  />
                ) : (
                  <span className="size-4 shrink-0" aria-hidden="true" />
                )}
                <span className="truncate">{item.label}</span>
                <span className="ms-auto font-mono text-xs text-muted-foreground tabular-nums">
                  {item.count.toLocaleString()}
                </span>
              </ComboboxItem>
            )
          }}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
