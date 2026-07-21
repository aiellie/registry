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
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import {
  type CompactElement,
  type IconEntry,
  type IconManifest,
  type IconsMeta,
  buildEntries,
  MANIFEST_URL,
  searchIcons,
  toSvgElement,
} from "@/lib/hugeicons"
import { cn } from "@/lib/utils"

import { IconDetail } from "./icon-detail"
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
    <button
      type="button"
      onClick={() => onSelect(entry)}
      title={entry.name}
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
    </button>
  )
})

export function IconsView({ meta }: { meta: IconsMeta }) {
  const [manifest, setManifest] = useState<IconManifest | null>(null)
  const [query, setQuery] = useState("")
  const [strokeWidth, setStrokeWidth] = useState(2)
  const [size, setSize] = useState(24)
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
        if (active) toast.error("Couldn’t load the icon manifest")
      })
    return () => {
      active = false
    }
  }, [meta.version])

  const entries = useMemo(() => (manifest ? buildEntries(manifest) : []), [manifest])

  // Keeps typing responsive: the 5.5k-entry scan runs at a lower priority than the
  // keystroke that triggered it.
  const deferredQuery = useDeferredValue(query)
  const results = useMemo(
    () => searchIcons(entries, deferredQuery.trim()),
    [entries, deferredQuery]
  )

  // A new query means a new result set, so collapse back to one page. Adjusting
  // during render rather than in an effect avoids a pass that paints the old limit
  // against the new results.
  const [limitedFor, setLimitedFor] = useState(deferredQuery)
  if (limitedFor !== deferredQuery) {
    setLimitedFor(deferredQuery)
    setLimit(PAGE_SIZE)
  }

  const visible = useMemo(() => results.slice(0, limit), [results, limit])
  const shards = useIconShards(visible, meta)

  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const hasMore = limit < results.length

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
  const nothingFound = !isLoading && results.length === 0

  return (
    <div className="container p-5 md:p-10">
      <header className="mb-8">
        <h1 className="text-3xl font-medium tracking-tight md:text-4xl">Icons</h1>
        <p className="mt-2 max-w-prose text-muted-foreground">
          The complete{" "}
          <a
            href="https://hugeicons.com/icons/stroke-rounded"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4"
          >
            HugeIcons stroke-rounded
          </a>{" "}
          set — the same icons every component in this registry draws from. Search by
          name or by what the icon depicts, then copy the import, the JSX, or the raw
          SVG.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="font-mono">
            {meta.count.toLocaleString()} icons
          </Badge>
          <Badge variant="secondary" className="font-mono">
            stroke rounded
          </Badge>
          <Badge variant="secondary" className="font-mono">
            24×24 grid
          </Badge>
          <Badge variant="secondary" className="font-mono">
            v{meta.version}
          </Badge>
        </div>
      </header>

      <div className="sticky top-14 z-20 -mx-5 mb-8 border-y bg-background/80 px-5 py-2.5 backdrop-blur-md md:-mx-10 md:px-10">
        <div className="flex flex-wrap items-center gap-2">
          <InputGroup className="h-8 w-full sm:w-72">
            <InputGroupAddon>
              <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${meta.count.toLocaleString()} icons — try “calendar”, “handshake”…`}
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

          <ToggleGroup
            value={[String(strokeWidth)]}
            onValueChange={([next]) => {
              if (next) setStrokeWidth(Number(next))
            }}
            variant="outline"
            size="sm"
            spacing={0}
          >
            {STROKE_WIDTHS.map((width) => (
              <ToggleGroupItem
                key={width}
                value={String(width)}
                aria-label={`Stroke width ${width}`}
              >
                {width}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <ToggleGroup
            value={[String(size)]}
            onValueChange={([next]) => {
              if (next) setSize(Number(next))
            }}
            variant="outline"
            size="sm"
            spacing={0}
            className="hidden sm:flex"
          >
            {SIZES.map((option) => (
              <ToggleGroupItem
                key={option}
                value={String(option)}
                aria-label={`Preview at ${option} pixels`}
              >
                {option}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <span
            className={cn(
              "font-mono text-xs text-muted-foreground tabular-nums",
              !query && "hidden sm:inline"
            )}
            aria-live="polite"
          >
            {isLoading
              ? "loading…"
              : query
                ? `${results.length.toLocaleString()} matching`
                : `${results.length.toLocaleString()} icons`}
          </span>

          <Button
            variant="outline"
            size="sm"
            className="ms-auto"
            disabled={visible.length === 0}
            onClick={async () => {
              const names = visible.map((entry) => entry.name).join(", ")
              const copied = await copyToClipboard(
                `import { ${names} } from "@hugeicons/core-free-icons"`
              )
              if (copied) toast.success(`Copied ${visible.length} imports`)
              else toast.error("Couldn’t reach the clipboard")
            }}
          >
            <HugeiconsIcon icon={isCopied ? Tick02Icon : Copy01Icon} strokeWidth={2} />
            Copy imports
          </Button>
        </div>
      </div>

      {nothingFound ? (
        <Empty className="rounded-xl border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
            </EmptyMedia>
            <EmptyTitle>No icons match “{query}”</EmptyTitle>
            <EmptyDescription>
              Try a single broader word — “chart”, “user”, “arrow” — or the thing the
              icon shows rather than its name.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(76px,1fr))] gap-1">
            {isLoading
              ? Array.from({ length: PAGE_SIZE }, (_, index) => (
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
                ))
              : visible.map((entry) => (
                  <IconCell
                    key={entry.name}
                    entry={entry}
                    elements={shards.get(entry.name)}
                    size={size}
                    strokeWidth={strokeWidth}
                    onSelect={handleSelect}
                  />
                ))}
          </div>

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
        strokeWidth={strokeWidth}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
      />

      <footer className="mt-14 border-t pt-5 text-xs text-muted-foreground">
        Generated from{" "}
        <code className="font-mono">@hugeicons/core-free-icons</code> at build time.
        Path data is fetched in shards as you scroll, so search stays instant without
        shipping 4.5MB of geometry up front.
      </footer>
    </div>
  )
}
