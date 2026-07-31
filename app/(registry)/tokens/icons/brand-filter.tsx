"use client"

import type { ReactNode } from "react"
import {
  Home01Icon,
  Tick02Icon,
  SmileIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { House } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandGroup,
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
import {
  type IconBrand,
  type IconSetsMeta,
  BRAND_IDS,
  BRANDS,
} from "@/lib/icon-sets"
import { cn } from "@/lib/utils"

/** Each brand's face in the list — drawn by its own library, naturally. */
const BRAND_MARKS: Record<IconBrand, ReactNode> = {
  hugeicons: (
    <HugeiconsIcon
      icon={Home01Icon}
      size={16}
      strokeWidth={2}
      className="shrink-0 text-muted-foreground"
    />
  ),
  lucide: <House className="size-4 shrink-0 text-muted-foreground" />,
}

/**
 * The same faceted filter as `IconCategories`, pointed at the two libraries.
 * An empty selection means "no filter" — both brands — so the landing cards
 * stay reachable by clearing it.
 */
export function BrandFilter({
  value,
  meta,
  onValueChange,
}: {
  /** Selected brands; an empty array means "no filter". */
  value: IconBrand[]
  meta: IconSetsMeta
  onValueChange: (brands: IconBrand[]) => void
}) {
  const selected = new Set(value)

  const toggle = (brand: IconBrand) =>
    onValueChange(
      selected.has(brand)
        ? value.filter((entry) => entry !== brand)
        : [...value, brand]
    )

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" size="sm" className="h-8 border-dashed" />
        }
      >
        <HugeiconsIcon icon={SmileIcon} strokeWidth={2} />
        Brand
        {selected.size > 0 && (
          <>
            {/* A button may only hold phrasing content, so the rule and the
                chip row render as spans rather than the default divs. */}
            <Separator
              orientation="vertical"
              render={<span />}
              className="mx-0.5"
            />
            <span className="flex gap-1">
              {value.map((brand) => (
                <Badge
                  key={brand}
                  variant="secondary"
                  className="h-4 rounded-sm px-1 font-normal"
                >
                  {BRANDS[brand].label}
                </Badge>
              ))}
            </span>
          </>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-52 gap-0 overflow-hidden rounded-xl p-0"
      >
        <Command>
          <CommandList>
            <CommandGroup>
              {BRAND_IDS.map((brand) => {
                const isSelected = selected.has(brand)
                return (
                  <CommandItem
                    key={brand}
                    value={BRANDS[brand].label}
                    onSelect={() => toggle(brand)}
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
                    {BRAND_MARKS[brand]}
                    <span className="truncate">{BRANDS[brand].label}</span>
                    <span className="ms-auto font-mono text-xs text-muted-foreground tabular-nums">
                      {meta[brand].count.toLocaleString()}
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
