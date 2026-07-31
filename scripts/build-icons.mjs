/**
 * Generates the static payloads behind /tokens/icons — one per icon library.
 *
 * Both sets are far too heavy to hand a browser in one go (~5.5k HugeIcons,
 * ~1.7k Lucide), but each icon is small enough that they shard cleanly. For
 * every library this writes into public/<brand>/:
 *
 *   manifest.json  every icon name plus its aliases, so search works off a
 *                  single small fetch and never needs the geometry.
 *   shard-NNN.json the actual path data, in fixed alphabetical runs, fetched
 *                  only when a shard's icons are on screen.
 *
 * Payloads are content-addressed by each package's version, so a dependency
 * bump busts the browser cache without any manual step.
 */
import { createRequire } from "node:module"
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { pathToFileURL } from "node:url"

const require = createRequire(import.meta.url)

const SHARD_SIZE = 128

/** Bump when the emitted shape changes, so stale payloads regenerate. */
const SCHEMA = 5

const HUGEICONS_CATEGORIES_FILE = path.join(
  process.cwd(),
  "data",
  "hugeicons-categories.json"
)
const LUCIDE_CATEGORIES_FILE = path.join(
  process.cwd(),
  "data",
  "lucide-categories.json"
)

/**
 * Copies an element verbatim minus `key`, which is just the array index and is
 * re-derived on read. Nothing else is inferable: most HugeIcons paths carry
 * `stroke: currentColor` at width 1.5, but ~70 are fill-only with no stroke —
 * re-adding a default would outline shapes meant to be solid. Lucide elements
 * carry no stroke attributes at all; their `<svg>` root supplies them.
 */
function compactElement([tag, attrs]) {
  const out = {}
  for (const [key, value] of Object.entries(attrs)) {
    if (key !== "key") out[key] = value
  }
  if (tag !== "path") out.t = tag
  return out
}

/** True when public/<dir>/manifest.json already matches the installed package. */
async function isCurrent(outDir, version) {
  const existing = await readFile(
    path.join(outDir, "manifest.json"),
    "utf8"
  ).catch(() => null)
  const previous = existing ? JSON.parse(existing) : null
  return previous?.version === version && previous?.schema === SCHEMA
}

/** Number words the two HugeIcons sources disagree on: `ThreeDMove` vs `3d-move`. */
const NUMBER_WORDS = {
  first: "1",
  "1st": "1",
  second: "2",
  "2nd": "2",
  third: "3",
  "3rd": "3",
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

/**
 * Reduces a package export (`ThreeDMoveIcon`) and a site slug (`3d-move`) to the
 * same key (`3dmove`), which is what lets the scraped taxonomy line up with the
 * package. Spelling, separators, and digit-vs-word all get normalised away.
 */
function matchKey(text) {
  return (
    text
      .replace(/Icon$/, "")
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
      .replace(/[-_]+/g, " ")
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => NUMBER_WORDS[word] ?? word)
      .join("")
      // Leading zeros are cosmetic in both sources: `add-01` and `Add1` are one icon.
      .replace(/0+(\d)/g, "$1")
  )
}

/**
 * Resolves the scraped category slugs onto icon positions.
 *
 * The site lists every stroke-rounded icon including pro-only ones, so a chunk of
 * slugs legitimately have no free-package counterpart; those are counted and
 * reported rather than treated as an error.
 */
function resolveCategories(icons, taxonomy) {
  const byKey = new Map()
  icons.forEach((icon, index) => {
    // Canonicals first, so an alias never shadows a real name on a key collision.
    for (const name of [icon.canonical, ...icon.aliases]) {
      const key = matchKey(name)
      if (!byKey.has(key)) byKey.set(key, index)
    }
  })

  const lookup = (value) => byKey.get(matchKey(value))

  let unresolved = 0
  const categoryIcons = {}
  for (const [slug, slugs] of Object.entries(taxonomy.icons)) {
    // A Set because the free package folds several site icons onto one object —
    // `git-branch` and its aliases all resolve to the same GitBranchIcon.
    const indexes = new Set()
    for (const iconSlug of slugs) {
      const index = lookup(iconSlug)
      if (index === undefined) unresolved += 1
      else indexes.add(index)
    }
    categoryIcons[slug] = [...indexes].sort((a, b) => a - b)
  }

  // Each category's thumbnail lives in a different shard, so drawing the picker
  // would otherwise drag in ~40 of them for 59 tiny icons. Inlining the geometry
  // costs about 12KB gzipped and makes the picker render instantly.
  const repElements = {}
  const categories = taxonomy.categories.map(({ slug, label, rep }) => {
    const repIndex = lookup(rep)
    if (repIndex !== undefined) {
      repElements[slug] = icons[repIndex].elements.map(compactElement)
    }
    return {
      id: slug,
      label,
      // The count the site publishes includes pro icons, so report what this
      // package can actually show instead — the filter must not promise more.
      count: categoryIcons[slug].length,
      rep: repIndex === undefined ? null : icons[repIndex].canonical,
    }
  })

  const covered = new Set(Object.values(categoryIcons).flat()).size
  return { categories, categoryIcons, repElements, unresolved, covered }
}

/** Writes manifest + shards for one library. `icons` must be sorted by canonical. */
async function emitSet(outDir, { version, icons, extra = {} }) {
  await rm(outDir, { recursive: true, force: true })
  await mkdir(outDir, { recursive: true })

  const shardCount = Math.ceil(icons.length / SHARD_SIZE)
  await Promise.all(
    Array.from({ length: shardCount }, (_, shard) => {
      const slice = icons.slice(shard * SHARD_SIZE, (shard + 1) * SHARD_SIZE)
      const payload = Object.fromEntries(
        slice.map((icon) => [icon.canonical, icon.elements.map(compactElement)])
      )
      return writeFile(
        path.join(outDir, `shard-${String(shard).padStart(3, "0")}.json`),
        JSON.stringify(payload)
      )
    })
  )

  const manifest = {
    version,
    schema: SCHEMA,
    shardSize: SHARD_SIZE,
    shardCount,
    count: icons.length,
    // [canonical, ...aliases] — positional, because this file is mostly names
    // and object keys would be a third of its weight.
    icons: icons.map((icon) => [icon.canonical, ...icon.aliases]),
    ...extra,
  }
  await writeFile(path.join(outDir, "manifest.json"), JSON.stringify(manifest))

  return shardCount
}

/**
 * The package's own name for a HugeIcons icon is the one with a matching module
 * file — `ArrowRight01Icon.js` exists, `ArrowRightIcon` is only an alias
 * re-exported from it. That file-backed name is what the docs and real import
 * statements use, so it is what the page must display.
 */
function pickCanonical(names, moduleNames) {
  const fileBacked = names.filter((name) => moduleNames.has(name))
  if (fileBacked.length > 0) {
    return fileBacked.sort(
      (a, b) => a.length - b.length || a.localeCompare(b)
    )[0]
  }

  const real = names.filter((name) => !name.endsWith("FreeIcons"))
  const iconSuffixed = real.filter((name) => name.endsWith("Icon"))
  const pool =
    iconSuffixed.length > 0 ? iconSuffixed : real.length > 0 ? real : names
  return [...pool].sort((a, b) => a.length - b.length || a.localeCompare(b))[0]
}

async function buildHugeicons() {
  const outDir = path.join(process.cwd(), "public", "hugeicons")
  const version = require("@hugeicons/core-free-icons/package.json").version
  if (await isCurrent(outDir, version)) {
    console.log(`hugeicons: already at ${version} (schema ${SCHEMA}), skipping`)
    return
  }

  const esmDir = path.join(
    path.dirname(require.resolve("@hugeicons/core-free-icons/package.json")),
    "dist",
    "esm"
  )
  const moduleNames = new Set(
    (await readdir(esmDir))
      .filter((file) => file.endsWith(".js"))
      .map((file) => file.slice(0, -3))
      .filter((name) => !/^(index|loader|types)/.test(name))
  )

  const mod = await import("@hugeicons/core-free-icons")

  // Aliases are re-exports of the same frozen array, so object identity — not
  // name parsing — is what actually tells us which exports are the same icon.
  const byIcon = new Map()
  for (const [name, value] of Object.entries(mod)) {
    if (!Array.isArray(value)) continue
    if (!byIcon.has(value)) byIcon.set(value, [])
    byIcon.get(value).push(name)
  }

  const icons = [...byIcon.entries()]
    .map(([elements, names]) => {
      const canonical = pickCanonical(names, moduleNames)
      const aliases = names
        .filter((name) => name !== canonical && !name.endsWith("FreeIcons"))
        .sort()
      return { canonical, aliases, elements }
    })
    .sort((a, b) => a.canonical.localeCompare(b.canonical))

  const taxonomy = JSON.parse(await readFile(HUGEICONS_CATEGORIES_FILE, "utf8"))
  const { categories, categoryIcons, repElements, unresolved, covered } =
    resolveCategories(icons, taxonomy)

  const shardCount = await emitSet(outDir, {
    version,
    icons,
    // Positions into `icons`, not names — roughly a third the bytes. Lucide has
    // no equivalent taxonomy, so only this manifest carries these fields.
    extra: { categories, categoryIcons, repElements },
  })
  const aliased = icons.filter((icon) => icon.aliases.length > 0).length
  console.log(
    `hugeicons: ${icons.length} icons (${aliased} aliased) → ${shardCount} shards @ v${version}`
  )
  console.log(
    `hugeicons: ${categories.length} categories, ${covered} icons categorised ` +
      `(${icons.length - covered} uncategorised, ${unresolved} pro-only slugs skipped)`
  )
}

async function buildLucide() {
  const outDir = path.join(process.cwd(), "public", "lucide")
  const pkgDir = path.dirname(require.resolve("lucide-react/package.json"))
  const version = require("lucide-react/package.json").version
  if (await isCurrent(outDir, version)) {
    console.log(`lucide: already at ${version} (schema ${SCHEMA}), skipping`)
    return
  }

  // The package has no `exports` map, so a bare import would land on the CJS
  // build; go straight to the ESM entry instead.
  const mod = await import(
    pathToFileURL(path.join(pkgDir, "dist", "esm", "lucide-react.mjs"))
  )

  // `icons` is the package's canonical name → component map. Everything else —
  // `ArrowDownIcon`, `LucideArrowDown`, real renames like `SortDesc` — is a
  // re-export of the same component, so identity recovers the grouping.
  const canonicalByComponent = new Map(
    Object.entries(mod.icons).map(([name, component]) => [component, name])
  )

  const aliases = new Map()
  for (const [name, value] of Object.entries(mod)) {
    const canonical = canonicalByComponent.get(value)
    if (canonical === undefined || name === canonical) continue
    // `ArrowDownIcon` / `LucideArrowDown` are mechanical variants of every
    // single icon; only keep genuine renames (`SortDesc`, `Verified`, …).
    if (/^Lucide/.test(name) || /Icon$/.test(name)) continue
    if (!aliases.has(canonical)) aliases.set(canonical, [])
    aliases.get(canonical).push(name)
  }

  // The geometry only exists inside each icon's own module (`__iconNode`); the
  // component itself closes over it. One import per icon, matched back to its
  // canonical name by component identity.
  const iconsDir = path.join(pkgDir, "dist", "esm", "icons")
  const files = (await readdir(iconsDir)).filter(
    (file) => file.endsWith(".mjs") && file !== "index.mjs"
  )
  const icons = (
    await Promise.all(
      files.map(async (file) => {
        const iconModule = await import(
          pathToFileURL(path.join(iconsDir, file))
        )
        const canonical = canonicalByComponent.get(iconModule.default)
        if (!canonical || !iconModule.__iconNode) return null
        return {
          canonical,
          // The kebab module name is also the icon's slug in the Lucide repo's
          // taxonomy and in lucide-static's tags.json.
          slug: file.replace(/\.mjs$/, ""),
          aliases: (aliases.get(canonical) ?? []).sort(),
          elements: iconModule.__iconNode,
        }
      })
    )
  )
    .filter(Boolean)
    .sort((a, b) => a.canonical.localeCompare(b.canonical))

  // Lucide's slugs map onto the package exactly — no fuzzy matching needed,
  // unlike the HugeIcons site taxonomy.
  const indexBySlug = new Map(icons.map((icon, index) => [icon.slug, index]))
  const taxonomy = JSON.parse(await readFile(LUCIDE_CATEGORIES_FILE, "utf8"))

  let unresolved = 0
  const categoryIcons = {}
  for (const [slug, slugs] of Object.entries(taxonomy.icons)) {
    const indexes = []
    for (const iconSlug of slugs) {
      const index = indexBySlug.get(iconSlug)
      if (index === undefined) unresolved += 1
      else indexes.push(index)
    }
    categoryIcons[slug] = indexes.sort((a, b) => a - b)
  }

  const repElements = {}
  const categories = taxonomy.categories.map(({ slug, label, rep }) => {
    const repIndex = indexBySlug.get(rep)
    if (repIndex !== undefined) {
      repElements[slug] = icons[repIndex].elements.map(compactElement)
    }
    return {
      id: slug,
      label,
      count: categoryIcons[slug].length,
      rep: repIndex === undefined ? null : icons[repIndex].canonical,
    }
  })

  // Search keywords from lucide-static — `house` carries "home", "residence"…
  // Positional against `icons` so the manifest never repeats the names.
  const tagsBySlug = require("lucide-static/tags.json")
  const tags = icons.map((icon) => tagsBySlug[icon.slug] ?? [])

  const shardCount = await emitSet(outDir, {
    version,
    icons,
    extra: { categories, categoryIcons, repElements, tags },
  })
  const aliased = icons.filter((icon) => icon.aliases.length > 0).length
  const tagged = tags.filter((list) => list.length > 0).length
  console.log(
    `lucide: ${icons.length} icons (${aliased} aliased, ${tagged} tagged) → ${shardCount} shards @ v${version}`
  )
  console.log(
    `lucide: ${categories.length} categories (${unresolved} unresolved slugs skipped)`
  )
}

await buildHugeicons()
await buildLucide()
