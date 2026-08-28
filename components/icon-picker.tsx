"use client"

import * as React from "react"

import { Combobox as ComboboxPrimitive } from "@base-ui/react"
import {
  AiBrain01Icon,
  ArrowDown01Icon,
  FileEmptyIcon,
  SourceCodeIcon,
  StarIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { ModelSelectorLogo } from "@/components/ai-elements/model-selector"
import { ColorPicker } from "@/components/design/color-picker"
import { Icons } from "@/components/icons/icons"
import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  type CompactElement,
  type IconEntry,
  type IconManifest,
  searchIcons,
  toSvgElement,
  toWords,
} from "@/lib/icon-sets"
import { chefs } from "@/lib/models"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/*                                    Types                                    */
/* -------------------------------------------------------------------------- */

/**
 * One pickable icon. Extends `IconEntry` so the shared `searchIcons` ranking
 * applies to the curated tabs as well as the 5.4k HugeIcons.
 *
 * The two flavors are told apart by `node`: HugeIcons entries leave it unset
 * and draw from the sharded geometry under `public/hugeicons/`, while the four
 * curated tabs carry their own renderer and sit at `index: -1` — they are never
 * looked up in a shard.
 */
export interface IconPickerItem extends IconEntry {
  /** Unique across every tab, e.g. `hugeicons:Add01Icon` or `extensions:tsx`. */
  id: string
  /** What the tooltip and the trigger read out. */
  label: string
  /** The tab this belongs to — a curated id or a HugeIcons category slug. */
  tab: string
  /** Draws the glyph for the curated tabs. Absent for HugeIcons. */
  node?: (className: string) => React.ReactNode
}

interface IconTab {
  id: string
  label: string
  /** Icon-only tab button, sized by the caller. */
  icon: (className: string) => React.ReactNode
  count: number
}

/* -------------------------------------------------------------------------- */
/*                               Curated entries                               */
/* -------------------------------------------------------------------------- */

/** Builds the `IconEntry` search fields a curated entry needs. */
function curated(
  tab: string,
  slug: string,
  label: string,
  node: (className: string) => React.ReactNode,
  keywords: string[] = []
): IconPickerItem {
  const words = toWords(label)
  return {
    id: `${tab}:${slug}`,
    tab,
    label,
    node,
    name: slug,
    aliases: [],
    // Never resolved against a shard — `node` short-circuits the lookup.
    index: -1,
    words,
    haystack: [words, words.replace(/\s+/g, ""), slug, ...keywords]
      .join(" ")
      .toLowerCase(),
    categories: [tab],
  }
}

/**
 * The file-type marks `getIconForLanguageExtension` maps onto — same glyphs,
 * listed by the extensions that reach them so searching "zsh" finds the shell
 * icon the file tree would have drawn.
 */
const EXTENSION_ICONS: {
  slug: string
  label: string
  glyph: keyof typeof Icons | null
  extensions: string[]
}[] = [
  {
    slug: "ts",
    label: "TypeScript",
    glyph: "ts",
    extensions: ["ts", "mts", "cts"],
  },
  { slug: "tsx", label: "React", glyph: "tsx", extensions: ["tsx", "jsx"] },
  {
    slug: "js",
    label: "JavaScript",
    glyph: "js",
    extensions: ["js", "mjs", "cjs"],
  },
  { slug: "css", label: "CSS", glyph: "css", extensions: ["css"] },
  {
    slug: "json",
    label: "JSON",
    glyph: "json",
    extensions: ["json", "jsonc", "json5"],
  },
  {
    slug: "md",
    label: "Markdown",
    glyph: "md",
    extensions: ["md", "mdx", "markdown"],
  },
  {
    slug: "bash",
    label: "Shell",
    glyph: "bash",
    extensions: ["sh", "bash", "shell", "zsh"],
  },
  { slug: "svg", label: "SVG", glyph: "svg", extensions: ["svg"] },
  { slug: "ico", label: "Icon", glyph: "ico", extensions: ["ico"] },
  {
    slug: "gitignore",
    label: "Gitignore",
    glyph: "gitignore",
    extensions: ["gitignore", "git"],
  },
  // The switch's default arm — every extension without a mark of its own.
  {
    slug: "file",
    label: "File",
    glyph: null,
    extensions: ["file", "unknown", "empty"],
  },
]

const EXTENSION_ITEMS: IconPickerItem[] = EXTENSION_ICONS.map(
  ({ slug, label, glyph, extensions }) => {
    const Glyph = glyph ? Icons[glyph] : null
    return curated(
      "extensions",
      slug,
      label,
      (className) =>
        Glyph ? (
          <Glyph className={className} />
        ) : (
          <HugeiconsIcon
            icon={FileEmptyIcon}
            strokeWidth={2}
            className={className}
          />
        ),
      extensions
    )
  }
)

/**
 * Provider marks, drawn by the same `ModelSelectorLogo` the model menu uses.
 * The chefs in `lib/models.ts` lead — those are the providers this system
 * actually ships models for — followed by the rest of the logo set.
 */
const MODEL_PROVIDERS: { slug: string; label: string; color?: boolean }[] = [
  ...Object.values(chefs).map((chef) => ({
    slug: chef.slug,
    label: chef.name,
    color: true,
  })),
  { slug: "mistral", label: "Mistral", color: true },
  { slug: "meta", label: "Meta" },
  { slug: "llama", label: "Llama" },
  { slug: "moonshotai", label: "Moonshot AI" },
  { slug: "perplexity", label: "Perplexity" },
  { slug: "groq", label: "Groq" },
  { slug: "cerebras", label: "Cerebras" },
  { slug: "togetherai", label: "Together AI" },
  { slug: "fireworks-ai", label: "Fireworks AI" },
  { slug: "openrouter", label: "OpenRouter" },
  { slug: "huggingface", label: "Hugging Face" },
  { slug: "amazon-bedrock", label: "Amazon Bedrock" },
  { slug: "google-vertex", label: "Google Vertex" },
  { slug: "azure", label: "Azure" },
  { slug: "nvidia", label: "NVIDIA" },
  { slug: "cloudflare-workers-ai", label: "Cloudflare Workers AI" },
  { slug: "deepinfra", label: "DeepInfra" },
  { slug: "lmstudio", label: "LM Studio" },
  { slug: "zhipuai", label: "Zhipu AI" },
  { slug: "alibaba", label: "Alibaba" },
  { slug: "github-copilot", label: "GitHub Copilot" },
]

const MODEL_ITEMS: IconPickerItem[] = MODEL_PROVIDERS.map(
  ({ slug, label, color }) =>
    curated(
      "models",
      slug,
      label,
      (className) => (
        <ModelSelectorLogo
          provider={slug}
          variant={color ? "color" : "mono"}
          className={className}
        />
      ),
      ["model", "provider", "ai", slug.replace(/-/g, " ")]
    )
)

/** The brand marks in `components/icons/icons.tsx` — logos, not UI glyphs. */
const BRAND_ICONS: { slug: keyof typeof Icons; label: string }[] = [
  { slug: "logo", label: "Aiellie" },
  { slug: "elephant", label: "Elephant" },
  { slug: "v0", label: "v0" },
  { slug: "react", label: "React" },
  { slug: "tailwind", label: "Tailwind CSS" },
  { slug: "radix", label: "Radix" },
  { slug: "aria", label: "React Aria" },
  { slug: "npm", label: "npm" },
  { slug: "pnpm", label: "pnpm" },
  { slug: "yarn", label: "Yarn" },
  { slug: "gitHub", label: "GitHub" },
  { slug: "twitter", label: "X" },
  { slug: "google", label: "Google" },
  { slug: "apple", label: "Apple" },
  { slug: "paypal", label: "PayPal" },
  { slug: "spinner", label: "Spinner" },
]

const BRAND_ITEMS: IconPickerItem[] = BRAND_ICONS.map(({ slug, label }) => {
  const Glyph = Icons[slug]
  return curated(
    "brand",
    slug,
    label,
    (className) => <Glyph className={className} />,
    ["brand", "logo"]
  )
})

/**
 * The front door: the HugeIcons this system reaches for most, in the order a
 * picker wants them — navigation and actions first, then content, then chrome.
 * Names are export names from `@hugeicons/core-free-icons`.
 */
const FEATURED_NAMES = [
  "Search01Icon",
  "Home01Icon",
  "Settings01Icon",
  "UserIcon",
  "Add01Icon",
  "Cancel01Icon",
  "Tick02Icon",
  "MoreHorizontalIcon",
  "Menu01Icon",
  "ArrowLeft01Icon",
  "ArrowRight01Icon",
  "ArrowUp01Icon",
  "ArrowDown01Icon",
  "Edit02Icon",
  "Delete02Icon",
  "Copy01Icon",
  "Download01Icon",
  "Upload01Icon",
  "Share08Icon",
  "Link01Icon",
  "FilterIcon",
  "SortingAZ01Icon",
  "Refresh01Icon",
  "Loading03Icon",
  "Notification01Icon",
  "Mail01Icon",
  "BubbleChatIcon",
  "Sent02Icon",
  "Attachment01Icon",
  "Calendar01Icon",
  "Clock01Icon",
  "StarIcon",
  "FavouriteIcon",
  "Bookmark01Icon",
  "ThumbsUpIcon",
  "FlashIcon",
  "SparklesIcon",
  "MagicWand01Icon",
  "AiBrain01Icon",
  "Robot01Icon",
  "CodeIcon",
  "SourceCodeIcon",
  "TerminalIcon",
  "PuzzleIcon",
  "Folder01Icon",
  "File01Icon",
  "Image01Icon",
  "Video01Icon",
  "Mic01Icon",
  "Globe02Icon",
  "LockIcon",
  "Key01Icon",
  "ShieldKeyIcon",
  "EyeIcon",
  "ViewOffSlashIcon",
  "Login01Icon",
  "Logout01Icon",
  "InformationCircleIcon",
  "Alert01Icon",
  "HelpCircleIcon",
  "ShoppingCart01Icon",
  "CreditCardIcon",
  "Chart01Icon",
  "DashboardSquare01Icon",
  "Layers01Icon",
  "GridViewIcon",
  "ListViewIcon",
  "SidebarLeft01Icon",
  "PaintBoardIcon",
  "Moon02Icon",
  "Sun03Icon",
]

const CURATED_TABS = [
  {
    id: "featured",
    label: "Featured",
    icon: (className: string) => (
      <HugeiconsIcon icon={StarIcon} strokeWidth={2} className={className} />
    ),
  },
  {
    id: "brand",
    label: "Brand",
    icon: (className: string) => <Icons.logo className={className} />,
  },
  {
    id: "models",
    label: "Models",
    icon: (className: string) => (
      <HugeiconsIcon
        icon={AiBrain01Icon}
        strokeWidth={2}
        className={className}
      />
    ),
  },
  {
    id: "extensions",
    label: "Extensions",
    icon: (className: string) => (
      <HugeiconsIcon
        icon={SourceCodeIcon}
        strokeWidth={2}
        className={className}
      />
    ),
  },
] as const

/* -------------------------------------------------------------------------- */
/*                                Shard loading                                */
/* -------------------------------------------------------------------------- */

/**
 * Where the sharded HugeIcons payload lives — `manifest.json` plus
 * `shard-000.json`… as emitted by this repo's `pnpm icons:build` into
 * `public/hugeicons/`. Point `baseUrl` at a deployed copy
 * (`https://registry.aiellie.dev/hugeicons`) when installing elsewhere.
 */
export const ICONS_BASE_URL = "/hugeicons"

const shardName = (shard: number) => `shard-${String(shard).padStart(3, "0")}`

/**
 * Module-level so a closed-and-reopened popup never re-downloads geometry, and
 * so the trigger can read the selected icon back synchronously.
 */
const glyphs = new Map<string, CompactElement[]>()
const inFlight = new Map<string, Promise<void>>()

function loadShard(baseUrl: string, shard: number, version: string) {
  const url = `${baseUrl}/${shardName(shard)}.json?v=${version}`
  const existing = inFlight.get(url)
  if (existing) return existing

  const request = fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(`shard ${shard}: ${response.status}`)
      return response.json() as Promise<Record<string, CompactElement[]>>
    })
    .then((icons) => {
      for (const [name, elements] of Object.entries(icons))
        glyphs.set(name, elements)
    })
    .catch((error) => {
      // Drop the record so a later render can retry rather than cache the miss.
      inFlight.delete(url)
      throw error
    })

  inFlight.set(url, request)
  return request
}

/**
 * Fetches the shards covering `visible` and re-renders as each lands, so the
 * grid fills in progressively instead of blocking on the whole page.
 */
function useGlyphs(
  visible: IconPickerItem[],
  manifest: Pick<IconManifest, "shardSize" | "version"> | null,
  baseUrl: string
) {
  const [loaded, setLoaded] = React.useState<ReadonlySet<number>>(
    () => new Set()
  )

  const shardSize = manifest?.shardSize ?? null
  const version = manifest?.version ?? null

  const needed = React.useMemo(() => {
    if (!shardSize) return []
    const shards = new Set<number>()
    for (const item of visible)
      if (!item.node) shards.add(Math.floor(item.index / shardSize))
    return [...shards].sort((a, b) => a - b)
  }, [visible, shardSize])
  const neededKey = needed.join(",")

  React.useEffect(() => {
    if (!version) return
    const pending = needed.filter((shard) => !loaded.has(shard))
    if (pending.length === 0) return

    let active = true
    for (const shard of pending) {
      loadShard(baseUrl, shard, version)
        .then(() => {
          if (!active) return
          setLoaded((previous) => {
            if (previous.has(shard)) return previous
            return new Set(previous).add(shard)
          })
        })
        .catch(() => {
          // Leave it unloaded; those cells stay as placeholders.
        })
    }
    return () => {
      active = false
    }
    // `loaded` only grows — including it would re-run this per shard that lands.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [neededKey, version, baseUrl])

  // `loaded` is referenced so the lookup identity changes as shards arrive.
  return React.useMemo(
    () => ({ get: (name: string) => glyphs.get(name), version: loaded.size }),
    [loaded]
  )
}

/* -------------------------------------------------------------------------- */
/*                                  Component                                  */
/* -------------------------------------------------------------------------- */

/** Cells per row. The rows are built by hand because Base UI's grid mode
 *  navigates the DOM rows it is given rather than reflowing them itself. */
const COLUMNS = 7

/** Appended each time the list scrolls near its end. */
const PAGE_SIZE = 98

export const STROKE_WIDTHS = [1, 1.5, 2, 2.5]
export const SIZES = [16, 20, 24, 32]

/** How the picked icon should be drawn — carried alongside the icon itself. */
export interface IconPickerSettings {
  /** Stroke width handed to the HugeIcons renderer. */
  strokeWidth: number
  /** Preview size in px. */
  size: number
  /** Any CSS color, or `null` for Auto — inherit what the theme is painting. */
  color: string | null
}

export const DEFAULT_SETTINGS: IconPickerSettings = {
  strokeWidth: 2,
  size: 20,
  color: null,
}

/**
 * Whether one of the settings controls has a surface open — the stroke or size
 * menu, or the tint wheel.
 *
 * All three portal to the body, so every way they take over reads to Base UI as
 * the combobox popup losing the interaction, under a different reason each
 * time. Rather than enumerate those, the popup refuses to close while a surface
 * it owns is up.
 *
 * Asked of the triggers rather than the surfaces: the wheel fades out under
 * `AnimatePresence` and so outlives its own dismissal, while `aria-expanded`
 * flips with the state. Scoping to the settings row is what keeps this from
 * matching the combobox's own trigger.
 */
function isSettingsSurfaceOpen(scope: HTMLElement | null) {
  return scope?.querySelector('[aria-expanded="true"]') != null
}

/**
 * The stroke and size steppers, shaped for a 320px popup: the written label
 * collapses into a tooltip so only the value and its caret take up room. Same
 * `DropdownMenu` shape as the standalone dropdowns on /icons.
 */
function SettingMenu({
  label,
  value,
  options,
  format,
  onValueChange,
}: {
  label: string
  value: number
  options: number[]
  format: (value: number) => string
  onValueChange: (value: number) => void
}) {
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              aria-label={label}
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 px-2"
                />
              }
            >
              <span className="font-mono tabular-nums">{format(value)}</span>
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                strokeWidth={2}
                className="size-3 text-muted-foreground"
              />
            </DropdownMenuTrigger>
          }
        />
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="start" className="min-w-24">
        <DropdownMenuRadioGroup
          value={String(value)}
          onValueChange={(next) => onValueChange(Number(next))}
        >
          {options.map((option) => (
            <DropdownMenuRadioItem key={option} value={String(option)}>
              <span className="font-mono tabular-nums">{format(option)}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * Draws one icon at the chosen size.
 *
 * Stroke width only reaches HugeIcons — the curated marks are fixed artwork,
 * and the ones with a brand fill (the SVG and ICO file types, the provider
 * logos) keep their own color rather than taking the tint. Sizing is the one
 * setting that applies to everything, so the box is what carries it.
 */
function Glyph({
  item,
  elements,
  size,
  strokeWidth,
  color,
}: {
  item: IconPickerItem
  elements: CompactElement[] | undefined
  size: number
  strokeWidth: number
  color?: string | null
}) {
  return (
    // A div, not a span: the grid cell hides its own trailing `<span>` (the
    // selected-item tick, which only mounts when selected), and a span here
    // would match that rule and disappear.
    <div
      className="flex shrink-0 items-center justify-center"
      // The tint rides here rather than on the list: a highlighted or selected
      // cell paints its descendants `accent-foreground`, and an inline color on
      // the glyph's own box is what survives that.
      style={{ width: size, height: size, color: color ?? undefined }}
    >
      {item.node ? (
        item.node("size-full")
      ) : elements ? (
        <HugeiconsIcon
          icon={toSvgElement(elements)}
          size={size}
          strokeWidth={strokeWidth}
          className="size-full"
        />
      ) : (
        <span className="size-full animate-pulse rounded-sm bg-muted" />
      )}
    </div>
  )
}

export function IconPicker({
  value,
  onValueChange,
  defaultTab = "featured",
  placeholder = "Pick an icon",
  baseUrl = ICONS_BASE_URL,
  defaultSettings,
  onSettingsChange,
  className,
}: {
  /** Controlled selection. Leave unset for an uncontrolled picker. */
  value?: IconPickerItem | null
  onValueChange?: (item: IconPickerItem | null) => void
  defaultTab?: string
  placeholder?: string
  /** Where the HugeIcons manifest and shards are served from. */
  baseUrl?: string
  /** Opening stroke, size and tint. */
  defaultSettings?: Partial<IconPickerSettings>
  /** Fires whenever stroke, size or tint changes. */
  onSettingsChange?: (settings: IconPickerSettings) => void
  className?: string
}) {
  const [manifest, setManifest] = React.useState<IconManifest | null>(null)
  const [uncontrolled, setUncontrolled] = React.useState<IconPickerItem | null>(
    null
  )
  const [tab, setTab] = React.useState(defaultTab)
  const [query, setQuery] = React.useState("")
  const [limit, setLimit] = React.useState(PAGE_SIZE)
  const [open, setOpen] = React.useState(false)
  const settingsRef = React.useRef<HTMLDivElement | null>(null)
  const [settings, setSettings] = React.useState<IconPickerSettings>(() => ({
    ...DEFAULT_SETTINGS,
    ...defaultSettings,
  }))

  // Built outside the updater so the callback fires once per change rather than
  // once per render pass React chooses to replay.
  const updateSettings = (patch: Partial<IconPickerSettings>) => {
    const next = { ...settings, ...patch }
    setSettings(next)
    onSettingsChange?.(next)
  }

  const selected = value !== undefined ? value : uncontrolled

  React.useEffect(() => {
    let active = true
    // The version is unknown before the manifest lands, so this request goes
    // out unversioned and the shards key off the version it reports.
    fetch(`${baseUrl}/manifest.json`)
      .then((response) => response.json() as Promise<IconManifest>)
      .then((data) => {
        if (active) setManifest(data)
      })
      .catch(() => {
        // Without a manifest only the curated tabs render; they need no fetch.
      })
    return () => {
      active = false
    }
  }, [baseUrl])

  /** Every HugeIcon, expanded once, tagged with the category tabs it belongs to. */
  const hugeicons = React.useMemo<IconPickerItem[]>(() => {
    if (!manifest) return []

    // Invert category → icons once rather than scanning 59 lists per icon.
    const tabsByIcon = new Map<number, string[]>()
    for (const [id, indexes] of Object.entries(manifest.categoryIcons ?? {}))
      for (const index of indexes) {
        const existing = tabsByIcon.get(index)
        if (existing) existing.push(id)
        else tabsByIcon.set(index, [id])
      }

    return manifest.icons.map(([name, ...aliases], index) => {
      const words = toWords(name)
      const aliasWords = aliases.map(toWords)
      const categories = tabsByIcon.get(index) ?? []
      return {
        id: `hugeicons:${name}`,
        // A HugeIcon can be filed under several categories; the first is the
        // one the tab bar treats as its home.
        tab: categories[0] ?? "",
        label: name.replace(/Icon$/, ""),
        name,
        aliases,
        index,
        words,
        haystack: [
          words,
          words.replace(/\s+/g, ""),
          ...aliasWords,
          ...aliasWords.map((alias) => alias.replace(/\s+/g, "")),
        ]
          .filter(Boolean)
          .join(" "),
        categories,
      }
    })
  }, [manifest])

  const byName = React.useMemo(() => {
    const map = new Map<string, IconPickerItem>()
    for (const item of hugeicons) map.set(item.name, item)
    return map
  }, [hugeicons])

  const featured = React.useMemo(
    () =>
      FEATURED_NAMES.map((name) => byName.get(name)).filter(
        (item): item is IconPickerItem => item !== undefined
      ),
    [byName]
  )

  /** Everything searchable: the curated sets plus the whole HugeIcons library. */
  const pool = React.useMemo(
    () => [...BRAND_ITEMS, ...MODEL_ITEMS, ...EXTENSION_ITEMS, ...hugeicons],
    [hugeicons]
  )

  const tabs = React.useMemo<IconTab[]>(() => {
    const curatedTabs: IconTab[] = [
      { ...CURATED_TABS[0], count: featured.length },
      { ...CURATED_TABS[1], count: BRAND_ITEMS.length },
      { ...CURATED_TABS[2], count: MODEL_ITEMS.length },
      { ...CURATED_TABS[3], count: EXTENSION_ITEMS.length },
    ]

    // Category thumbnails ride along in the manifest, so the tab bar is drawn
    // before a single shard is fetched.
    const categoryTabs: IconTab[] = (manifest?.categories ?? []).map(
      (category) => {
        const elements = manifest?.repElements?.[category.id]
        return {
          id: category.id,
          label: category.label,
          count: category.count,
          icon: (className: string) =>
            elements ? (
              <HugeiconsIcon
                icon={toSvgElement(elements)}
                strokeWidth={2}
                className={className}
              />
            ) : (
              <HugeiconsIcon
                icon={FileEmptyIcon}
                strokeWidth={2}
                className={className}
              />
            ),
        }
      }
    )

    return [...curatedTabs, ...categoryTabs]
  }, [manifest, featured.length])

  const trimmed = query.trim()

  /**
   * A query searches the whole pool rather than the open tab — you type a name
   * because you know what you want, and scoping that to "Featured" would hide
   * it. The tab bar drops its highlight while searching to make that visible.
   */
  const results = React.useMemo<IconPickerItem[]>(() => {
    if (trimmed) return searchIcons(pool, trimmed) as IconPickerItem[]

    switch (tab) {
      case "featured":
        return featured
      case "brand":
        return BRAND_ITEMS
      case "models":
        return MODEL_ITEMS
      case "extensions":
        return EXTENSION_ITEMS
      default:
        return hugeicons.filter((item) => item.categories.includes(tab))
    }
  }, [trimmed, pool, tab, featured, hugeicons])

  // A new query or tab is a new result set, so collapse back to one page.
  // Adjusting during render avoids a pass that paints the old limit against
  // the new results.
  const resetKey = `${trimmed}|${tab}`
  const [limitedFor, setLimitedFor] = React.useState(resetKey)
  if (limitedFor !== resetKey) {
    setLimitedFor(resetKey)
    setLimit(PAGE_SIZE)
  }

  const visible = React.useMemo(() => results.slice(0, limit), [results, limit])

  // The trigger draws the selection too, so its shard has to be resident even
  // when it is nowhere in the current page.
  const wanted = React.useMemo(
    () => (selected ? [...visible, selected] : visible),
    [visible, selected]
  )
  const shards = useGlyphs(wanted, manifest, baseUrl)

  const rows = React.useMemo(() => {
    const chunks: IconPickerItem[][] = []
    for (let index = 0; index < visible.length; index += COLUMNS)
      chunks.push(visible.slice(index, index + COLUMNS))
    return chunks
  }, [visible])

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (limit >= results.length) return
    const list = event.currentTarget
    if (list.scrollHeight - list.scrollTop - list.clientHeight < 240)
      setLimit((current) => current + PAGE_SIZE)
  }

  const select = (item: IconPickerItem | null) => {
    if (value === undefined) setUncontrolled(item)
    onValueChange?.(item)
    // Picking is the end of the interaction. Base UI leaves a grid open on
    // click — right for a multi-select, wrong for a one-shot picker.
    setOpen(false)
  }

  return (
    <Combobox<IconPickerItem>
      items={rows}
      // Filtering and paging happen above; Base UI would otherwise re-filter
      // the rows themselves, which are arrays rather than items.
      filter={null}
      grid
      open={open}
      onOpenChange={(next) => {
        // Reaching for a stroke, a size or a swatch must not dismiss the
        // picker those settings are about to be applied to.
        if (!next && isSettingsSurfaceOpen(settingsRef.current)) return
        setOpen(next)
        // The query is ours to control, so it does not get reset with the rest
        // of the popup's transient state.
        if (!next) setQuery("")
      }}
      value={selected}
      onValueChange={select}
      inputValue={query}
      onInputValueChange={setQuery}
      itemToStringValue={(item) => item.label}
    >
      <Tooltip>
        <TooltipTrigger
          render={
            <ComboboxTrigger
              render={
                <Button
                  variant="outline"
                  className={cn(
                    "w-[200px] justify-start gap-2 font-normal",
                    className
                  )}
                />
              }
            >
              {selected ? (
                <>
                  {/* Pinned to 16px however big the previews are — the
                      trigger should not resize as you scrub the size. */}
                  <Glyph
                    item={selected}
                    elements={shards.get(selected.name)}
                    size={16}
                    strokeWidth={settings.strokeWidth}
                    color={settings.color}
                  />
                  <span className="flex-1 truncate text-start">
                    {selected.label}
                  </span>
                </>
              ) : (
                <span className="flex-1 truncate text-start text-muted-foreground">
                  {placeholder}
                </span>
              )}
            </ComboboxTrigger>
          }
        />
        <TooltipContent>
          {selected ? selected.label : placeholder}
        </TooltipContent>
      </Tooltip>

      <ComboboxContent
        align="start"
        sideOffset={6}
        className="w-80 min-w-80 p-0"
      >
        <ComboboxInput
          showTrigger={false}
          showSearchIcon
          placeholder="Search icons..."
          className="h-8! rounded-none! border-0 border-x-0 bg-background shadow-none! *:data-[slot=input-group-addon]:ps-2!"
        />
        <Separator />
        <ComboboxEmpty>No icons found.</ComboboxEmpty>

        {/* Stroke, size and tint — how the icon you pick will be drawn, applied
            live to the grid below.

            Nothing here cancels `pointerdown`: doing so to keep focus in the
            search input also suppresses the compatibility `mousedown` these
            triggers open on, so the menus never appear. The popup stays put
            regardless, because every one of these surfaces is its own child. */}
        <TooltipProvider delay={300}>
          <div
            ref={settingsRef}
            className="flex items-center gap-1 border-b px-1.5 py-1"
          >
            <SettingMenu
              label="Stroke width"
              value={settings.strokeWidth}
              options={STROKE_WIDTHS}
              format={(width) => String(width)}
              onValueChange={(strokeWidth) => updateSettings({ strokeWidth })}
            />
            <SettingMenu
              label="Preview size"
              value={settings.size}
              options={SIZES}
              format={(size) => `${size}px`}
              onValueChange={(size) => updateSettings({ size })}
            />
            <Tooltip>
              {/* The picker renders a button plus its portalled popover, so the
                tooltip hangs off a wrapper rather than the trigger itself. */}
              <TooltipTrigger render={<span className="ms-auto inline-flex" />}>
                <ColorPicker
                  label="Icon"
                  // No hex while on Auto: the swatch inherits the popup's
                  // foreground, which is what the previews are drawing in.
                  value={settings.color ?? "currentColor"}
                  hideValue
                  onValueChange={(color) => updateSettings({ color })}
                  className="size-7 justify-center rounded-md border border-border bg-background hover:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
                />
              </TooltipTrigger>
              <TooltipContent>
                {settings.color ? `Tint · ${settings.color}` : "Tint · Auto"}
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>

        <TooltipProvider delay={300}>
          <ComboboxList
            onScroll={handleScroll}
            className="max-h-56 min-h-56 scroll-py-1 p-1"
          >
            {(row: IconPickerItem[], index: number) => (
              <ComboboxPrimitive.Row
                key={index}
                className="grid grid-cols-7 gap-0.5"
              >
                {row.map((item) => (
                  <Tooltip key={item.id}>
                    <TooltipTrigger
                      render={
                        <ComboboxItem
                          value={item}
                          // The grid cell is square and holds no label, so the
                          // list item's text padding goes away and its tick
                          // slot — the only direct `<span>` it renders, and
                          // only once selected — is hidden outright.
                          className="flex aspect-square items-center justify-center rounded-md p-0 ps-0 pe-0 data-selected:bg-accent data-selected:text-accent-foreground [&>span]:hidden"
                        >
                          <Glyph
                            item={item}
                            elements={shards.get(item.name)}
                            size={settings.size}
                            strokeWidth={settings.strokeWidth}
                            color={settings.color}
                          />
                        </ComboboxItem>
                      }
                    />
                    <TooltipContent className="font-mono">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </ComboboxPrimitive.Row>
            )}
          </ComboboxList>
        </TooltipProvider>

        {/* Category tabs. `Tabs` drives the value; the panels live above as the
            grid itself, which is why no `TabsContent` is rendered. */}
        <Tabs
          value={trimmed ? "" : tab}
          onValueChange={(next) => {
            setTab(String(next))
            // Browsing and searching are the two modes; picking a tab leaves
            // search, otherwise the tab bar would highlight a filter that is
            // not the one producing the results.
            setQuery("")
          }}
          className="gap-0 border-t"
        >
          <TooltipProvider delay={300}>
            <TabsList
              variant="line"
              // A button row this long has to scroll; `w-fit` from the variant
              // would otherwise let it push the popup wide.
              className="no-scrollbar h-9! w-full justify-start gap-0.5 overflow-x-auto rounded-none p-1"
            >
              {tabs.map((entry) => (
                <Tooltip key={entry.id}>
                  <TooltipTrigger
                    render={
                      <TabsTrigger
                        value={entry.id}
                        aria-label={entry.label}
                        // A filled pill rather than the variant's underline:
                        // the scroller clips anything below the trigger, and a
                        // pill matches how a picked cell marks itself above.
                        className="size-7 flex-none shrink-0 rounded-md p-0 after:hidden data-active:bg-accent! data-active:text-accent-foreground!"
                      >
                        {entry.icon("size-4")}
                      </TabsTrigger>
                    }
                  />
                  <TooltipContent>
                    {entry.label}
                    <span className="opacity-60"> · {entry.count}</span>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TabsList>
          </TooltipProvider>
        </Tabs>
      </ComboboxContent>
    </Combobox>
  )
}
