"use client"

import {
  memo,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  Cancel01Icon,
  Copy01Icon,
  Search01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { toast } from "@/components/ui/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import {
  type CompactElement,
  type IconCategory,
  type IconEntry,
  type IconManifest,
  type IconsMeta,
  buildEntries,
  MANIFEST_URL,
  searchIcons,
  toSvgElement,
} from "@/lib/hugeicons"
import { FEATURED_GROUPS } from "@/lib/hugeicons-featured"

import { IconCategories } from "./icon-categories"
import { IconDetail } from "./icon-detail"
import { SizeDropdown } from "./size-dropdown"
import { StrokeDropdown } from "./stroke-dropdown"
import { useIconShards } from "./use-icon-shards"

/** Appended per scroll. Large enough that a shard is rarely fetched for one row. */
const PAGE_SIZE = 96

const STROKE_WIDTHS = [1.5, 2]
const SIZES = [16, 20, 24, 32]

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
        className="group flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-transparent p-1.5 transition-colors hover:border-border hover:bg-accent focus-visible:border-border focus-visible:bg-accent focus-visible:outline-none"
      >
        <span className="flex flex-1 items-center justify-center">
          {elements ? (
            <HugeiconsIcon
              icon={toSvgElement(elements)}
              size={size}
              strokeWidth={strokeWidth}
            />
          ) : (
            <span
              className="animate-pulse rounded-sm bg-muted"
              style={{ width: size, height: size }}
            />
          )}
        </span>
        <span className="w-full truncate text-center text-[10px] leading-none text-muted-foreground group-hover:text-foreground">
          {entry.name.replace(/Icon$/, "")}
        </span>
      </TooltipTrigger>
      {/* The label under the icon is truncated, so the tooltip carries the full
          export name — the thing you'd actually paste into an import. */}
      <TooltipContent className="font-mono">{entry.name}</TooltipContent>
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
  shards: { get: (name: string) => CompactElement[] | undefined }
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
            key={entry.name}
            entry={entry}
            elements={shards.get(entry.name)}
            size={size}
            strokeWidth={strokeWidth}
            onSelect={onSelect}
          />
        ))}
      </div>
    </TooltipProvider>
  )
}

export function IconsView({ meta }: { meta: IconsMeta }) {
  const [manifest, setManifest] = useState<IconManifest | null>(null)
  const [query, setQuery] = useState("")
  const [categories, setCategories] = useState<IconCategory[]>([])
  const [strokeWidth, setStrokeWidth] = useState(2)
  const [size, setSize] = useState(16)
  const [limit, setLimit] = useState(PAGE_SIZE)
  const [selected, setSelected] = useState<IconEntry | null>(null)
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  useEffect(() => {
    let active = true
    fetch(`${MANIFEST_URL}?v=${meta.version}`)
      .then((response) => response.json() as Promise<IconManifest>)
      .then((data) => {
        if (active) setManifest(data)
      })
      .catch(() => {
        if (active)
          toast.add({
            title: "Couldn’t load the icon manifest",
            type: "error",
          })
      })
    return () => {
      active = false
    }
  }, [meta.version])

  const entries = useMemo(() => (manifest ? buildEntries(manifest) : []), [manifest])
  const byName = useMemo(
    () => new Map(entries.map((entry) => [entry.name, entry])),
    [entries]
  )

  // Keeps typing responsive: the 5.5k-entry scan runs at a lower priority than the
  // keystroke that triggered it.
  const deferredQuery = useDeferredValue(query)
  const trimmed = deferredQuery.trim()

  // The manifest's canonical order for the selected categories, used both to
  // filter and as a stable key for the reset-on-change logic below.
  const categoryKey = categories.map((category) => category.id).join(",")

  /**
   * The landing state: no query, no category. Search and category filtering both
   * escape it and reach the whole set, which is the point — featured is a starting
   * point, not a restriction.
   */
  const isFeaturedView = trimmed === "" && categories.length === 0

  const featuredGroups = useMemo(
    () =>
      FEATURED_GROUPS.map((group) => ({
        ...group,
        entries: group.icons
          .map((name) => byName.get(name))
          .filter((entry): entry is IconEntry => entry !== undefined),
      })).filter((group) => group.entries.length > 0),
    [byName]
  )

  const results = useMemo(() => {
    if (isFeaturedView) return []

    // An icon matches when it belongs to *any* selected category (union), so
    // stacking categories widens the set rather than narrowing it to nothing.
    const selectedIds = new Set(categoryKey ? categoryKey.split(",") : [])
    const inCategory =
      selectedIds.size === 0
        ? entries
        : entries.filter((entry) =>
            entry.categories.some((id) => selectedIds.has(id))
          )

    return trimmed ? searchIcons(inCategory, trimmed) : inCategory
  }, [entries, categoryKey, trimmed, isFeaturedView])

  // A new query or category means a new result set, so collapse back to one page.
  // Adjusting during render rather than in an effect avoids a pass that paints the
  // old limit against the new results.
  const resetKey = `${trimmed} ${categoryKey}`
  const [limitedFor, setLimitedFor] = useState(resetKey)
  if (limitedFor !== resetKey) {
    setLimitedFor(resetKey)
    setLimit(PAGE_SIZE)
  }

  const visible = useMemo(() => results.slice(0, limit), [results, limit])

  // The featured view renders every group at once, so its icons need shards too.
  const needsShards = useMemo(
    () =>
      isFeaturedView ? featuredGroups.flatMap((group) => group.entries) : visible,
    [isFeaturedView, featuredGroups, visible]
  )
  const shards = useIconShards(needsShards, meta, manifest?.featuredElements)

  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const hasMore = !isFeaturedView && limit < results.length

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

  const isLoading = manifest === null
  const nothingFound = !isLoading && !isFeaturedView && results.length === 0
  const featuredCount = featuredGroups.reduce(
    (sum, group) => sum + group.entries.length,
    0
  )

  const countLabel = isLoading
    ? "loading…"
    : isFeaturedView
      ? `${featuredCount} featured`
      : `${results.length.toLocaleString()} ${trimmed ? "matching" : "icons"}`

  return (
    <div className="container p-5 md:p-10">
      <header className="mb-8">
        <h1 className="text-3xl font-medium tracking-tight md:text-4xl">Icons</h1>
        <p className="mt-2 max-w-prose text-muted-foreground">
          The icons this system actually uses, up front — then the complete{" "}
          <a
            href="https://hugeicons.com/icons/stroke-rounded"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4"
          >
            HugeIcons stroke-rounded
          </a>{" "}
          set behind the search box. Filter by category, then copy the import, the
          JSX, or the raw SVG.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="font-mono">
            {meta.count.toLocaleString()} icons
          </Badge>
          <Badge variant="secondary" className="font-mono">
            {meta.categoryCount} categories
          </Badge>
          <Badge variant="secondary" className="font-mono">
            stroke rounded
          </Badge>
          <Badge variant="secondary" className="font-mono">
            v{meta.version}
          </Badge>
        </div>
      </header>

      <div className="sticky top-14 z-20 -mx-5 mb-8 border-y bg-background/80 px-5 py-2.5 backdrop-blur-md md:-mx-10 md:px-10">
        <div className="flex flex-wrap items-center gap-2">
          <InputGroup className="h-8 w-full sm:w-64">
            <InputGroupAddon>
              <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search all ${meta.count.toLocaleString()} icons…`}
              aria-label="Search icons"
            />
            {query && (
              <InputGroupAddon align="inline-end">
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    strokeWidth={2}
                    className="size-3.5"
                  />
                </button>
              </InputGroupAddon>
            )}
          </InputGroup>

          {manifest && (
            <IconCategories
              categories={manifest.categories}
              value={categories}
              onValueChange={setCategories}
              repElements={manifest.repElements}
            />
          )}

          <StrokeDropdown
            value={strokeWidth}
            options={STROKE_WIDTHS}
            onValueChange={setStrokeWidth}
          />

          <SizeDropdown value={size} options={SIZES} onValueChange={setSize} />

          <span
            className="font-mono text-xs text-muted-foreground tabular-nums"
            aria-live="polite"
          >
            {countLabel}
          </span>

          {!isFeaturedView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery("")
                setCategories([])
              }}
            >
              <HugeiconsIcon icon={Cancel01Icon} />
              Reset
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            className="ms-auto"
            disabled={isLoading}
            onClick={async () => {
              const names = (isFeaturedView ? needsShards : visible)
                .map((entry) => entry.name)
                .join(", ")
              const copied = await copyToClipboard(
                `import { ${names} } from "@hugeicons/core-free-icons"`
              )
              if (copied) toast.add({ title: "Copied imports", type: "success" })
              else
                toast.add({
                  title: "Couldn’t reach the clipboard",
                  type: "error",
                })
            }}
          >
            <HugeiconsIcon icon={isCopied ? Tick02Icon : Copy01Icon} strokeWidth={2} />
            Copy imports
          </Button>
        </div>
      </div>

      {isLoading ? (
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
                : categories.length > 1
                  ? "Nothing in these categories"
                  : "Nothing in this category"}
            </EmptyTitle>
            <EmptyDescription>
              {categories.length > 0
                ? `Try clearing the ${categories
                    .map((category) => category.label)
                    .join(", ")} filter${categories.length > 1 ? "s" : ""}, or search the whole set.`
                : "Try a single broader word — “chart”, “user”, “arrow” — or the thing the icon shows rather than its name."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : isFeaturedView ? (
        <div className="space-y-4">
          {featuredGroups.map((group) => (
            <Card key={group.title}>
              <CardHeader>
                <CardTitle>{group.title}</CardTitle>
                <CardDescription className="max-w-prose">
                  {group.description}
                </CardDescription>
                <CardAction>
                  <Badge variant="secondary" className="font-mono tabular-nums">
                    {group.entries.length}
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardContent>
                <IconGrid
                  entries={group.entries}
                  shards={shards}
                  size={size}
                  strokeWidth={strokeWidth}
                  onSelect={handleSelect}
                />
              </CardContent>
            </Card>
          ))}
        </div>
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

      <IconDetail
        entry={selected}
        elements={selected ? shards.get(selected.name) : undefined}
        categories={manifest?.categories ?? []}
        strokeWidth={strokeWidth}
        size={size}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
      />

      <footer className="mt-14 border-t pt-5 text-xs text-muted-foreground">
        Featured icons are the set this registry imports today — edit{" "}
        <code className="font-mono">lib/hugeicons-featured.ts</code> to change them.
        Categories mirror the HugeIcons taxonomy; the {meta.count.toLocaleString()}{" "}
        icons and their geometry are generated from{" "}
        <code className="font-mono">@hugeicons/core-free-icons</code> at build time
        and fetched in shards as you scroll.
      </footer>
    </div>
  )
}
