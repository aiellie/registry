"use client"

import {
  type CSSProperties,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react"
import { Cancel01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { ColorPicker } from "@/components/design/color-picker"
import { Button } from "@/components/ui/button"
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
import { toast } from "@/components/ui/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  type CompactElement,
  type IconCategory,
  type IconEntry,
  type IconManifest,
  type IconSetMeta,
  HUGEICONS,
  buildEntries,
  fromSvgElement,
  manifestUrl,
  toWords,
} from "@/lib/icon-sets"
import type { IconCatalogEntry } from "@/lib/icons"

import { AllIconsAccordion } from "./all-icons-accordion"
import { CURATED_COUNT, CatalogAccordion } from "./catalog-accordion"
import { IconCategories } from "./icon-categories"
import { IconDetail } from "./icon-detail"
import { SizeDropdown } from "./size-dropdown"
import { type IconSource, SourceSelect } from "./source-select"
import { StrokeDropdown } from "./stroke-dropdown"

const STROKE_WIDTHS = [1.5, 2]
const SIZES = [16, 20, 24, 32]

/** Pulsing rows, shown while the manifest the full library needs is loading. */
function SectionsSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className="h-11 animate-pulse rounded-lg border" />
      ))}
    </div>
  )
}

export function IconsView({ meta }: { meta: IconSetMeta }) {
  const [manifest, setManifest] = useState<IconManifest | null>(null)
  const [source, setSource] = useState<IconSource>("curated")
  const [query, setQuery] = useState("")
  const [categories, setCategories] = useState<IconCategory[]>([])
  const [strokeWidth, setStrokeWidth] = useState(2)
  const [size, setSize] = useState(16)
  /** `null` is "whatever the theme says" — the picker calls that Auto. */
  const [tint, setTint] = useState<string | null>(null)
  const [selected, setSelected] = useState<IconEntry | null>(null)
  /**
   * The selection's geometry, handed over by whichever accordion was clicked:
   * curated icons carry their own drawing, library icons come from the shard
   * their cell already rendered from.
   */
  const [selectedElements, setSelectedElements] = useState<
    CompactElement[] | null
  >(null)

  useEffect(() => {
    let active = true
    fetch(manifestUrl(meta.version))
      .then((response) => response.json() as Promise<IconManifest>)
      .then((data) => {
        if (active) setManifest(data)
      })
      .catch(() => {
        if (active)
          toast.add({
            title: `Couldn’t load the ${HUGEICONS.label} manifest`,
            type: "error",
          })
      })
    return () => {
      active = false
    }
  }, [meta])

  const entries = useMemo(
    () => (manifest ? buildEntries(manifest) : []),
    [manifest]
  )

  // Keeps typing responsive: filtering thousands of entries runs at a lower
  // priority than the keystroke that triggered it.
  const deferredQuery = useDeferredValue(query)
  const trimmed = deferredQuery.trim()

  const categoryIds = useMemo(
    () => categories.map((category) => category.id),
    [categories]
  )

  const handleSelect = useCallback(
    (entry: IconEntry, elements: CompactElement[]) => {
      setSelected(entry)
      setSelectedElements(elements)
    },
    []
  )

  /** Entries by export name, for resolving a curated pick. */
  const byName = useMemo(
    () => new Map(entries.map((entry) => [entry.name, entry])),
    [entries]
  )

  /**
   * A curated pick opens the same detail dialog as the library. The manifest
   * entry is preferred when it has arrived — it carries the aliases and the
   * library's own categories — but the drawing always comes from the catalog,
   * which imports its geometry rather than fetching it.
   */
  const handleSelectCatalog = useCallback(
    (entry: IconCatalogEntry) => {
      setSelected(
        byName.get(entry.source) ?? {
          name: entry.source,
          aliases: [],
          index: -1,
          haystack: "",
          words: toWords(entry.source),
          categories: [],
        }
      )
      setSelectedElements(fromSvgElement(entry.icon))
    },
    [byName]
  )

  const isFiltered = trimmed !== "" || categoryIds.length > 0
  const sourceCount = source === "curated" ? CURATED_COUNT : meta.count

  /**
   * Passed down rather than rendered here: each source knows whether its own
   * filtered sections came back empty, and the copy belongs in one place.
   */
  const emptyState = (
    <Empty className="rounded-xl border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
        </EmptyMedia>
        <EmptyTitle>
          {trimmed
            ? `No icons match “${query}”`
            : categories.length > 1
              ? "Nothing in these categories"
              : "Nothing in this category"}
        </EmptyTitle>
        <EmptyDescription>
          {source === "curated"
            ? "The curated set is deliberately small — switch to All icons to reach the whole library."
            : categories.length > 0
              ? `Try clearing the ${categories
                  .map((category) => category.label)
                  .join(
                    ", "
                  )} filter${categories.length > 1 ? "s" : ""}, or search the whole set.`
              : "Try a single broader word — “chart”, “user”, “arrow” — or the thing the icon shows rather than its name."}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )

  return (
    <div className="container p-5 md:p-10">
      <header className="mb-2">
        <div className="text-xl font-medium tracking-tight">Icons</div>
        <div className="mt-2 text-sm text-muted-foreground">
          The complete{" "}
          <a
            href={HUGEICONS.site}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary"
          >
            HugeIcons stroke-rounded
          </a>{" "}
          set, in one search box. Search everything, filter by category, then
          copy the import, the JSX, or the raw SVG.
        </div>
      </header>

      {/* Pinned to the very top: this layout renders no site header, so any
          offset here would leave a transparent band for the sections to scroll
          through above the bar. */}
      <div className="sticky top-0 z-20 -mx-5 mb-8 bg-background/80 px-5 py-2.5 backdrop-blur-md md:-mx-10 md:px-10">
        <div className="flex flex-wrap items-center gap-2">
          <InputGroup className="h-8 w-full sm:w-64">
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
              placeholder={`Search ${sourceCount.toLocaleString()} icons…`}
              aria-label="Search icons"
            />
            {query && (
              <InputGroupAddon align="inline-end">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger
                      onClick={() => setQuery("")}
                      className="text-muted-foreground hover:text-foreground"
                      aria-label="Clear search"
                    >
                      <HugeiconsIcon
                        icon={Cancel01Icon}
                        strokeWidth={2}
                        className="size-3.5"
                      />
                    </TooltipTrigger>
                    <TooltipContent>Clear search</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </InputGroupAddon>
            )}
          </InputGroup>

          {/* The set the sections below are cut from — curated on arrival, the
              whole library one pick away. */}
          <SourceSelect
            value={source}
            curatedCount={CURATED_COUNT}
            totalCount={meta.count}
            onValueChange={setSource}
          />

          {manifest?.categories && manifest.categories.length > 0 && (
            <IconCategories
              categories={manifest.categories}
              value={categories}
              repElements={manifest.repElements ?? {}}
              onValueChange={setCategories}
            />
          )}

          <StrokeDropdown
            value={strokeWidth}
            options={STROKE_WIDTHS}
            onValueChange={setStrokeWidth}
          />

          <SizeDropdown value={size} options={SIZES} onValueChange={setSize} />

          <TooltipProvider>
            <Tooltip>
              {/* The picker renders a button plus its portalled popover, so the
                  tooltip hangs off a wrapper rather than the trigger itself. */}
              <TooltipTrigger render={<span className="inline-flex" />}>
                <ColorPicker
                  label="Icon"
                  // No hex while on Auto: the swatch inherits the page's
                  // foreground, which is what the icons are drawing in.
                  value={tint ?? "currentColor"}
                  displayValue={tint ? undefined : "Auto"}
                  onValueChange={setTint}
                  className="h-8 rounded-lg border border-border bg-background px-2.5 text-sm hover:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
                />
              </TooltipTrigger>
              <TooltipContent>Tint the previews</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            variant="destructive"
            size="default"
            className="ms-auto"
            disabled={!isFiltered && !tint && source === "curated"}
            onClick={() => {
              setQuery("")
              setCategories([])
              setTint(null)
              setSource("curated")
            }}
          >
            <HugeiconsIcon icon={Cancel01Icon} />
            Reset
          </Button>
        </div>
      </div>

      {/* `currentColor` is the Auto case: the icons fall back to whatever the
          theme is already painting them. Nothing else here reads the variable,
          so no label or chrome moves with it. */}
      <div style={{ "--icon-tint": tint ?? "currentColor" } as CSSProperties}>
        {source === "curated" ? (
          <CatalogAccordion
            query={trimmed}
            categoryIds={categoryIds}
            size={size}
            strokeWidth={strokeWidth}
            emptyState={emptyState}
            onSelect={handleSelectCatalog}
          />
        ) : manifest ? (
          <AllIconsAccordion
            entries={entries}
            manifest={manifest}
            meta={meta}
            query={trimmed}
            categoryIds={categoryIds}
            size={size}
            strokeWidth={strokeWidth}
            emptyState={emptyState}
            onSelect={handleSelect}
          />
        ) : (
          <SectionsSkeleton />
        )}
      </div>

      <IconDetail
        entry={selected}
        elements={selectedElements ?? undefined}
        categories={manifest?.categories ?? []}
        strokeWidth={strokeWidth}
        size={size}
        color={tint}
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null)
            setSelectedElements(null)
          }
        }}
      />

      <footer className="mt-14 border-t pt-5 text-xs text-muted-foreground">
        Curated is the set in <code className="font-mono">lib/icons.ts</code> —
        role names the system codes against, so swapping a glyph is one edit
        rather than a repo-wide rename. All icons is the complete HugeIcons
        stroke-rounded set, generated from{" "}
        <code className="font-mono">@hugeicons/core-free-icons</code> at build
        time and fetched in shards as sections open. Both are filed under the
        same categories, scraped into{" "}
        <code className="font-mono">data/hugeicons-categories.json</code>. Brand
        and code-language marks belong to no icon library; they live in{" "}
        <code className="font-mono">components/icons.tsx</code>.
      </footer>
    </div>
  )
}
