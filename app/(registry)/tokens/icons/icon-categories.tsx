"use client"

import { Fragment, useMemo } from "react"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import {
  type CompactElement,
  type IconCategory,
  toSvgElement,
} from "@/lib/hugeicons"

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
  const anchor = useComboboxAnchor()
  const items = useMemo(() => categories, [categories])

  return (
    <Combobox
      multiple
      autoHighlight
      items={items}
      value={value}
      onValueChange={(next: IconCategory[]) => onValueChange(next)}
      itemToStringValue={(item: IconCategory) => item.label}
    >
      <ComboboxChips ref={anchor} className="w-full sm:w-56">
        <ComboboxValue>
          {(selected: IconCategory[]) => (
            <Fragment>
              {selected.map((category) => (
                <ComboboxChip key={category.id}>{category.label}</ComboboxChip>
              ))}
              <ComboboxChipsInput
                placeholder={selected.length === 0 ? "All categories" : ""}
                aria-label="Filter by category"
              />
            </Fragment>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No categories found.</ComboboxEmpty>
        <ComboboxList>
          {(item: IconCategory) => {
            const elements = repElements[item.id]
            return (
              <ComboboxItem key={item.id} value={item}>
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
