import type { IconSvgElement } from "@hugeicons/react"

/**
 * The two libraries /tokens/icons browses. Each has a build-time payload under
 * public/<id>/ — see scripts/build-icons.mjs — with the same manifest + shard
 * shape, so everything below is brand-parameterised rather than duplicated.
 */
export type IconBrand = "hugeicons" | "lucide"

export const BRANDS: Record<
  IconBrand,
  {
    label: string
    /** npm package the import snippets reference. */
    package: string
    /** Where the full set lives upstream. */
    site: string
    /** Icon style, shown as metadata next to the name. */
    style: string
  }
> = {
  hugeicons: {
    label: "HugeIcons",
    package: "@hugeicons/core-free-icons",
    site: "https://hugeicons.com/icons/stroke-rounded",
    style: "stroke rounded",
  },
  lucide: {
    label: "Lucide",
    package: "lucide-react",
    site: "https://lucide.dev/icons",
    style: "outline",
  },
}

export const BRAND_IDS = Object.keys(BRANDS) as IconBrand[]

/** One SVG element, verbatim from the package minus its array-index `key`. */
export type CompactElement = Record<string, string | number> & { t?: string }

/** `[canonical, ...aliases]` — the manifest's positional icon record. */
export type IconRecord = [string, ...string[]]

export interface IconCategory {
  id: string
  label: string
  /**
   * Members present in the free package. Deliberately not the count HugeIcons
   * publishes — theirs includes pro-only icons this page cannot render.
   */
  count: number
  /** Canonical name of the icon the site uses to represent the category. */
  rep: string | null
}

/** The manifest header — what the page can render before fetching anything. */
export interface IconSetMeta {
  version: string
  schema: number
  shardSize: number
  shardCount: number
  count: number
}

export type IconSetsMeta = Record<IconBrand, IconSetMeta>

export interface IconManifest extends IconSetMeta {
  icons: IconRecord[]
  /** Each library's own taxonomy — 59 HugeIcons categories, 42 Lucide ones. */
  categories?: IconCategory[]
  /** Category id → positions into `icons`. */
  categoryIcons?: Record<string, number[]>
  /** Category id → its thumbnail's geometry, inlined so the picker never waits. */
  repElements?: Record<string, CompactElement[]>
  /** Lucide only: search keywords per icon, positional against `icons`. */
  tags?: string[][]
}

/**
 * One row of the category filter: the two taxonomies folded into a single
 * list, with same-slug categories (Arrows, Buildings, …) combined into one
 * entry that spans both libraries.
 */
export interface MergedCategory {
  /** The shared slug — membership checks work directly against entry ids. */
  id: string
  label: string
  /** Combined member count across every library that files this slug. */
  count: number
  brands: IconBrand[]
  /** Which library's inlined geometry draws the thumbnail; null for none. */
  repBrand: IconBrand | null
}

/**
 * Folds the given manifests' taxonomies into one alphabetical list. Listed
 * brand order decides ties: HugeIcons comes first in `BRAND_IDS`, so its label
 * and thumbnail win when both libraries define the same slug.
 */
export function mergeCategories(
  manifests: Partial<
    Record<IconBrand, Pick<IconManifest, "categories" | "repElements">>
  >,
  brands: IconBrand[]
): MergedCategory[] {
  const merged = new Map<string, MergedCategory>()
  for (const brand of brands) {
    const manifest = manifests[brand]
    for (const category of manifest?.categories ?? []) {
      const hasRep = manifest?.repElements?.[category.id] !== undefined
      const existing = merged.get(category.id)
      if (existing) {
        existing.count += category.count
        existing.brands.push(brand)
        if (existing.repBrand === null && hasRep) existing.repBrand = brand
      } else {
        merged.set(category.id, {
          id: category.id,
          label: category.label,
          count: category.count,
          brands: [brand],
          repBrand: hasRep ? brand : null,
        })
      }
    }
  }
  return [...merged.values()].sort((a, b) => a.label.localeCompare(b.label))
}

export interface IconEntry {
  brand: IconBrand
  name: string
  aliases: string[]
  /** Position in its manifest, which is also its shard and its display order. */
  index: number
  /** Lowercased name, aliases, and word splits, joined for substring matching. */
  haystack: string
  /** `arrow down 01` — the name as a human would say it. */
  words: string
  /** Category ids from its library's taxonomy; empty for the unfiled few. */
  categories: string[]
}

export function manifestUrl(brand: IconBrand, version: string) {
  return `/${brand}/manifest.json?v=${version}`
}

export function shardUrl(brand: IconBrand, shard: number, version: string) {
  return `/${brand}/shard-${String(shard).padStart(3, "0")}.json?v=${version}`
}

/** The name as the grid labels it — HugeIcons drops its universal suffix. */
export function displayName(entry: IconEntry) {
  return entry.brand === "hugeicons"
    ? entry.name.replace(/Icon$/, "")
    : entry.name
}

/**
 * `ArrowDown01Icon` → `arrow down 01`. Splits camel humps, keeps acronyms whole
 * (`PDF`, `QR`), and separates trailing digits so `home 01` matches a bare "home".
 */
export function toWords(name: string) {
  return name
    .replace(/Icon$/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/([A-Za-z])(\d)/g, "$1 $2")
    .replace(/(\d)([A-Za-z])/g, "$1 $2")
    .toLowerCase()
    .trim()
}

/**
 * HugeIcons spells some concepts out. Searching "3d" should still reach
 * `ThreeDViewIcon`, and "2fa" should reach `TwoFactorAccessIcon`.
 */
const NUMERALS: Record<string, string> = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
  ten: "10",
}

function withNumerals(words: string) {
  const swapped = words.replace(
    /\b(one|two|three|four|five|six|seven|eight|nine|ten)\b/g,
    (word) => NUMERALS[word]
  )
  return swapped === words ? "" : ` ${swapped} ${swapped.replace(/\s+/g, "")}`
}

/** Expands one brand's manifest into the shape the grid searches against. */
export function buildEntries(
  manifest: IconManifest,
  brand: IconBrand
): IconEntry[] {
  // Invert category → icons once, rather than scanning 59 lists per icon.
  const categoriesByIcon = new Map<number, string[]>()
  for (const [id, indexes] of Object.entries(manifest.categoryIcons ?? {})) {
    for (const index of indexes) {
      const existing = categoriesByIcon.get(index)
      if (existing) existing.push(id)
      else categoriesByIcon.set(index, [id])
    }
  }

  return manifest.icons.map(([name, ...aliases], index) => {
    const words = toWords(name)
    const aliasWords = aliases.map(toWords)
    // Lucide ships per-icon keywords — "house" carries home, residence… — so a
    // concept search lands even when the name says otherwise.
    const tagWords = (manifest.tags?.[index] ?? []).map((tag) =>
      tag.toLowerCase()
    )
    const haystack = [
      words,
      // Collapsed, so "arrowdown" and "threed" match too.
      words.replace(/\s+/g, ""),
      withNumerals(words),
      ...aliasWords,
      ...aliasWords.map((alias) => alias.replace(/\s+/g, "")),
      ...tagWords,
    ]
      .filter(Boolean)
      .join(" ")

    return {
      brand,
      name,
      aliases,
      index,
      haystack,
      words,
      categories: categoriesByIcon.get(index) ?? [],
    }
  })
}

/**
 * Ranks one entry against one already-lowercased term. Returns 0 for no match, so
 * callers can treat every term as required.
 */
function scoreTerm(entry: IconEntry, term: string) {
  const { words, haystack } = entry

  if (words === term || words.replace(/\s+/g, "") === term) return 120
  if (words.startsWith(term)) return 90
  // A term landing on a word boundary beats one buried mid-word.
  if (haystack.includes(` ${term}`)) return 60
  if (haystack.includes(term)) return 30
  return 0
}

/**
 * All terms must match (AND), which is what makes multi-word queries like
 * "arrow left" usefully narrow. Ties break toward shorter names so `Home01Icon`
 * outranks `HomeWifiIcon` for "home" — and brands interleave purely on score.
 */
export function searchIcons(entries: IconEntry[], query: string): IconEntry[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (terms.length === 0) return entries

  const results: { entry: IconEntry; score: number }[] = []
  for (const entry of entries) {
    let total = 0
    for (const term of terms) {
      const score = scoreTerm(entry, term)
      if (score === 0) {
        total = 0
        break
      }
      total += score
    }
    if (total > 0) results.push({ entry, score: total })
  }

  results.sort(
    (a, b) =>
      b.score - a.score ||
      a.entry.name.length - b.entry.name.length ||
      a.entry.name.localeCompare(b.entry.name)
  )
  return results.map((result) => result.entry)
}

/**
 * Rebuilds the tuple form `HugeiconsIcon` expects. `key` is the array index, which
 * is exactly what the package shipped before the build script dropped it.
 */
export function toSvgElement(elements: CompactElement[]): IconSvgElement {
  return elements.map(({ t, ...attrs }, index) => [
    t ?? "path",
    { ...attrs, key: String(index) },
  ]) as IconSvgElement
}

const attrName = (key: string) =>
  key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)

/**
 * Standalone SVG markup, for pasting into a design tool or an `.svg` file.
 *
 * The brands differ at the root: HugeIcons carries stroke attributes on every
 * element (so a chosen width is rewritten per element), while Lucide inherits
 * everything from the `<svg>` itself.
 */
export function toSvgMarkup(
  elements: CompactElement[],
  brand: IconBrand,
  strokeWidth?: number
) {
  const body = elements
    .map(({ t, ...attrs }) => {
      const printed = Object.entries(attrs)
        .map(([key, value]) => {
          const applied =
            brand === "hugeicons" &&
            key === "strokeWidth" &&
            strokeWidth !== undefined
              ? strokeWidth
              : value
          return `${attrName(key)}="${applied}"`
        })
        .join(" ")
      return `  <${t ?? "path"} ${printed} />`
    })
    .join("\n")

  const rootAttrs =
    brand === "lucide"
      ? ` stroke="currentColor" stroke-width="${strokeWidth ?? 2}" stroke-linecap="round" stroke-linejoin="round"`
      : ""

  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"${rootAttrs}>\n${body}\n</svg>`
}

/** The exact import statement(s) a consumer pastes for this icon. */
export function importSnippet(entry: IconEntry) {
  return entry.brand === "hugeicons"
    ? `import { HugeiconsIcon } from "@hugeicons/react"\nimport { ${entry.name} } from "@hugeicons/core-free-icons"`
    : `import { ${entry.name} } from "lucide-react"`
}

/** The matching JSX, mirroring how each library is used in this repo. */
export function jsxSnippet(entry: IconEntry, strokeWidth: number) {
  return entry.brand === "hugeicons"
    ? `<HugeiconsIcon icon={${entry.name}} strokeWidth={${strokeWidth}} className="size-4" />`
    : `<${entry.name} strokeWidth={${strokeWidth}} className="size-4" />`
}
