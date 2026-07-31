"use client"

import {
  type CSSProperties,
  memo,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { Cancel01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { ColorPicker } from "@/components/canvasui/color-picker"
import { Badge } from "@/components/ui/badge"
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
  type IconBrand,
  type IconEntry,
  type IconManifest,
  type IconSetsMeta,
  type MergedCategory,
  BRAND_IDS,
  BRANDS,
  buildEntries,
  displayName,
  manifestUrl,
  mergeCategories,
  searchIcons,
} from "@/lib/icon-sets"

import { BrandCards } from "./brand-cards"
import { BrandFilter } from "./brand-filter"
import { IconCategories } from "./icon-categories"
import { IconDetail } from "./icon-detail"
import { IconGlyph } from "./icon-glyph"
import { SizeDropdown } from "./size-dropdown"
import { StrokeDropdown } from "./stroke-dropdown"
import { useIconShards } from "./use-icon-shards"

/** Appended per scroll. Large enough that a shard is rarely fetched for one row. */
const PAGE_SIZE = 96

const STROKE_WIDTHS = [1.5, 2]
const SIZES = [16, 20, 24, 32]

/**
 * The filter bar's tint, read straight by every icon — see `--icon-tint` below.
 *
 * A plain inherited `color` on a wrapper would not reach them: each cell is a
 * `<button>`, and the UA stylesheet colors form controls rather than letting
 * them inherit. Going through a variable also keeps the memoized cells out of
 * the re-render while the color wheel is being dragged.
 */
const TINT = "text-[color:var(--icon-tint)]"

const IconCell = memo(function IconCell({
  entry,
  elements,
  size,
  strokeWidth,
  onSelect,
}: {
  entry: IconEntry
  elements: CompactElement[] | undefined
  size: number
  strokeWidth: number
  onSelect: (entry: IconEntry) => void
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        onClick={() => onSelect(entry)}
        // `text-foreground` anchors the tint's `currentColor` fallback — a bare
        // button would otherwise resolve it against the UA's form-control color.
        className="group flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-full border p-1.5 text-foreground transition-colors hover:border-border hover:bg-accent focus-visible:border-border focus-visible:bg-accent focus-visible:outline-none"
      >
        <span className="flex flex-1 items-center justify-center">
          {elements ? (
            <IconGlyph
              brand={entry.brand}
              elements={elements}
              size={size}
              strokeWidth={strokeWidth}
              className={TINT}
            />
          ) : (
            <span
              className="animate-pulse rounded-sm bg-muted"
              style={{ width: size, height: size }}
            />
          )}
        </span>
      </TooltipTrigger>
      {/* The label under the icon is truncated, so the tooltip carries the full
          export name — the thing you'd actually paste into an import — plus
          which library it comes from, since the grid mixes both. */}
      <TooltipContent className="font-mono">
        {entry.name}
        <span className="opacity-60"> · {BRANDS[entry.brand].label}</span>
      </TooltipContent>
    </Tooltip>
  )
})

function IconGrid({
  entries,
  shards,
  size,
  strokeWidth,
  onSelect,
}: {
  entries: IconEntry[]
  shards: { get: (entry: IconEntry) => CompactElement[] | undefined }
  size: number
  strokeWidth: number
  onSelect: (entry: IconEntry) => void
}) {
  return (
    // One provider per grid: the shared delay keeps a tooltip from firing on
    // every icon the pointer happens to cross on its way somewhere else.
    <TooltipProvider delay={300}>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(76px,1fr))] gap-1">
        {entries.map((entry) => (
          <IconCell
            key={`${entry.brand}:${entry.name}`}
            entry={entry}
            elements={shards.get(entry)}
            size={size}
            strokeWidth={strokeWidth}
            onSelect={onSelect}
          />
        ))}
      </div>
    </TooltipProvider>
  )
}

export function IconsView({ meta }: { meta: IconSetsMeta }) {
  const [manifests, setManifests] = useState<
    Partial<Record<IconBrand, IconManifest>>
  >({})
  const [query, setQuery] = useState("")
  /** Selected brands; empty means "no filter" — both libraries. */
  const [brands, setBrands] = useState<IconBrand[]>([])
  const [categories, setCategories] = useState<MergedCategory[]>([])
  const [strokeWidth, setStrokeWidth] = useState(2)
  const [size, setSize] = useState(16)
  /** `null` is "whatever the theme says" — the picker calls that Auto. */
  const [tint, setTint] = useState<string | null>(null)
  const [limit, setLimit] = useState(PAGE_SIZE)
  const [selected, setSelected] = useState<IconEntry | null>(null)

  useEffect(() => {
    let active = true
    for (const brand of BRAND_IDS) {
      fetch(manifestUrl(brand, meta[brand].version))
        .then((response) => response.json() as Promise<IconManifest>)
        .then((data) => {
          if (active)
            setManifests((previous) => ({ ...previous, [brand]: data }))
        })
        .catch(() => {
          if (active)
            toast.add({
              title: `Couldn’t load the ${BRANDS[brand].label} manifest`,
              type: "error",
            })
        })
    }
    return () => {
      active = false
    }
  }, [meta])

  const entries = useMemo(
    () =>
      BRAND_IDS.flatMap((brand) => {
        const manifest = manifests[brand]
        return manifest ? buildEntries(manifest, brand) : []
      }),
    [manifests]
  )

  // Keeps typing responsive: the 7k-entry scan runs at a lower priority than the
  // keystroke that triggered it.
  const deferredQuery = useDeferredValue(query)
  const trimmed = deferredQuery.trim()

  const brandKey = brands.join(",")
  /** The brands the grid can currently draw from — all of them when unfiltered. */
  const poolBrands = brands.length === 0 ? BRAND_IDS : brands

  /**
   * Both taxonomies folded into one list — same-slug categories become a single
   * row spanning the two libraries. Only the pool's manifests contribute, so
   * filtering down to one brand trims the list to what it can actually match.
   */
  const mergedCategories = useMemo(
    () => mergeCategories(manifests, poolBrands),
    // poolBrands is derived from brands, which brandKey already encodes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [manifests, brandKey]
  )

  /**
   * A selection only applies while its category is still in the merged list.
   * Filtering its libraries away parks it instead of applying it as an
   * always-empty constraint.
   */
  const mergedIds = useMemo(
    () => new Set(mergedCategories.map((category) => category.id)),
    [mergedCategories]
  )
  const activeCategories = categories.filter((category) =>
    mergedIds.has(category.id)
  )
  // Stable string form, used to filter and as a key for the reset logic below.
  const activeCategoryKey = activeCategories
    .map((category) => category.id)
    .join(",")

  /**
   * The landing state: no query, no filters. Search, the brand filter, and the
   * category filter all escape it — the two cards are a front door, not a
   * restriction.
   */
  const isDefaultView =
    trimmed === "" && brands.length === 0 && activeCategoryKey === ""

  const results = useMemo(() => {
    if (isDefaultView) return []

    const inBrand =
      brandKey === ""
        ? entries
        : entries.filter((entry) =>
            (brandKey.split(",") as IconBrand[]).includes(entry.brand)
          )

    // An icon matches when it belongs to *any* selected category (union), so
    // stacking categories widens the set rather than narrowing it to nothing.
    // Merged slugs make this brand-blind: "arrows" matches whichever library
    // filed an icon under that slug, and single-library slugs simply never
    // match the other side.
    const selectedIds = new Set(
      activeCategoryKey ? activeCategoryKey.split(",") : []
    )
    const inCategory =
      selectedIds.size === 0
        ? inBrand
        : inBrand.filter((entry) =>
            entry.categories.some((id) => selectedIds.has(id))
          )

    return trimmed ? searchIcons(inCategory, trimmed) : inCategory
  }, [entries, brandKey, activeCategoryKey, trimmed, isDefaultView])

  // A new query or filter means a new result set, so collapse back to one page.
  // Adjusting during render rather than in an effect avoids a pass that paints the
  // old limit against the new results.
  const resetKey = `${trimmed}|${brandKey}|${activeCategoryKey}`
  const [limitedFor, setLimitedFor] = useState(resetKey)
  if (limitedFor !== resetKey) {
    setLimitedFor(resetKey)
    setLimit(PAGE_SIZE)
  }

  const visible = useMemo(() => results.slice(0, limit), [results, limit])
  const shards = useIconShards(visible, meta)

  const isLoading = BRAND_IDS.some((brand) => !manifests[brand])

  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const hasMore = !isDefaultView && !isLoading && limit < results.length

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setLimit((current) => current + PAGE_SIZE)
      },
      { rootMargin: "600px" }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, results.length])

  const handleSelect = useCallback((entry: IconEntry) => setSelected(entry), [])
  const handleBrowse = useCallback((brand: IconBrand) => setBrands([brand]), [])

  const nothingFound = !isLoading && !isDefaultView && results.length === 0
  const totalCount = meta.hugeicons.count + meta.lucide.count

  const countLabel = isDefaultView
    ? `${totalCount.toLocaleString()} icons`
    : isLoading
      ? "loading…"
      : `${results.length.toLocaleString()} ${trimmed ? "matching" : "icons"}`

  return (
    <div className="container p-5 md:p-10">
      <header className="mb-8">
        <h1 className="text-3xl font-medium tracking-tight md:text-4xl">
          Icons
        </h1>
        <p className="mt-2 max-w-prose text-muted-foreground">
          Two libraries, one search box: the complete{" "}
          <a
            href={BRANDS.hugeicons.site}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary"
          >
            HugeIcons stroke-rounded
          </a>{" "}
          set and all of{" "}
          <a
            href={BRANDS.lucide.site}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary"
          >
            Lucide
          </a>
          . Search everything, filter by brand or category, then copy the
          import, the JSX, or the raw SVG.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="font-mono">
            {totalCount.toLocaleString()} icons
          </Badge>
          <Badge variant="secondary" className="font-mono">
            {meta.hugeicons.count.toLocaleString()} hugeicons
          </Badge>
          <Badge variant="secondary" className="font-mono">
            {meta.lucide.count.toLocaleString()} lucide
          </Badge>
        </div>
      </header>

      <div className="sticky top-14 z-20 -mx-5 mb-8 border-y bg-background/80 px-5 py-2.5 backdrop-blur-md md:-mx-10 md:px-10">
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
              placeholder={`Search all ${totalCount.toLocaleString()} icons…`}
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

          <BrandFilter value={brands} meta={meta} onValueChange={setBrands} />

          {mergedCategories.length > 0 && (
            <IconCategories
              categories={mergedCategories}
              value={activeCategories}
              repElements={{
                hugeicons: manifests.hugeicons?.repElements,
                lucide: manifests.lucide?.repElements,
              }}
              // Selections currently outside the merged list stay parked in
              // state, so widening the brand filter brings them straight back.
              onValueChange={(next) =>
                setCategories([
                  ...categories.filter(
                    (category) => !mergedIds.has(category.id)
                  ),
                  ...next,
                ])
              }
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

          <span
            className="font-mono text-xs text-muted-foreground tabular-nums"
            aria-live="polite"
          >
            {countLabel}
          </span>

          <Button
            variant="destructive"
            size="sm"
            className="ms-auto"
            disabled={isDefaultView && !tint}
            onClick={() => {
              setQuery("")
              setBrands([])
              setCategories([])
              setTint(null)
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
        {isDefaultView ? (
          <BrandCards meta={meta} onBrowse={handleBrowse} />
        ) : isLoading ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(76px,1fr))] gap-1">
            {Array.from({ length: PAGE_SIZE }, (_, index) => (
              <div
                key={index}
                className="flex aspect-square animate-pulse flex-col items-center justify-center gap-2 p-1.5"
              >
                <span className="flex flex-1 items-center justify-center">
                  <span
                    className="rounded-sm bg-muted"
                    style={{ width: size, height: size }}
                  />
                </span>
                <span className="h-2 w-10 rounded-sm bg-muted" />
              </div>
            ))}
          </div>
        ) : nothingFound ? (
          <Empty className="rounded-xl border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
              </EmptyMedia>
              <EmptyTitle>
                {trimmed
                  ? `No icons match “${query}”`
                  : activeCategories.length > 1
                    ? "Nothing in these categories"
                    : "Nothing in this category"}
              </EmptyTitle>
              <EmptyDescription>
                {activeCategories.length > 0
                  ? `Try clearing the ${activeCategories
                      .map((category) => category.label)
                      .join(
                        ", "
                      )} filter${activeCategories.length > 1 ? "s" : ""}, or search the whole set.`
                  : brands.length > 0
                    ? "Try a broader word, or clear the brand filter — the other library may draw this one."
                    : "Try a single broader word — “chart”, “user”, “arrow” — or the thing the icon shows rather than its name."}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <>
            <IconGrid
              entries={visible}
              shards={shards}
              size={size}
              strokeWidth={strokeWidth}
              onSelect={handleSelect}
            />

            {hasMore && (
              <div ref={sentinelRef} className="mt-6 flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLimit((current) => current + PAGE_SIZE)}
                >
                  Show more
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {(results.length - limit).toLocaleString()} left
                  </span>
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <IconDetail
        entry={selected}
        elements={selected ? shards.get(selected) : undefined}
        // The taxonomy of the selected icon's own library labels its badges.
        categories={
          selected ? (manifests[selected.brand]?.categories ?? []) : []
        }
        strokeWidth={strokeWidth}
        size={size}
        color={tint}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
      />

      <footer className="mt-14 border-t pt-5 text-xs text-muted-foreground">
        Both sets are generated from their npm packages at build time —{" "}
        <code className="font-mono">@hugeicons/core-free-icons</code> and{" "}
        <code className="font-mono">lucide-react</code> — and fetched in shards
        as you scroll. Categories mirror each library&rsquo;s own taxonomy, and
        Lucide search also matches its upstream tags. Brand and code-language
        marks belong to neither library; they live in{" "}
        <code className="font-mono">components/icons.tsx</code>.
      </footer>
    </div>
  )
}
