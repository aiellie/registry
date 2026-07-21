/**
 * Generates the static payload behind /tokens/icons.
 *
 * The free HugeIcons set is ~5.5k icons and ~4.5MB of path data — far too much to
 * hand a browser in one go, but small enough per-icon that it shards cleanly. This
 * writes two things into public/hugeicons/:
 *
 *   manifest.json  every icon name plus its aliases, so search works off a single
 *                  ~50KB (gzipped) fetch and never needs the geometry.
 *   shard-NNN.json the actual path data, in fixed alphabetical runs, fetched only
 *                  when a shard's icons are on screen.
 *
 * Both are content-addressed by the package version, so a HugeIcons bump busts the
 * browser cache without any manual step.
 */
import { createRequire } from "node:module"
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises"
import path from "node:path"

const require = createRequire(import.meta.url)

const OUT_DIR = path.join(process.cwd(), "public", "hugeicons")
const CATEGORIES_FILE = path.join(process.cwd(), "data", "hugeicons-categories.json")
const FEATURED_FILE = path.join(process.cwd(), "data", "hugeicons-featured.json")
const SHARD_SIZE = 128

/** Bump when the emitted shape changes, so stale payloads regenerate. */
const SCHEMA = 2

/** Number words the two sources disagree on: `ThreeDMove` vs `3d-move`. */
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
  return text
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
}

/**
 * Resolves the scraped slugs onto icon positions.
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

/**
 * The package's own name for an icon is the one with a matching module file —
 * `ArrowRight01Icon.js` exists, `ArrowRightIcon` is only an alias re-exported from
 * it. That file-backed name is what the docs, the site slug, and real import
 * statements all use, so it is what this page must display.
 *
 * `moduleNames` is the set of basenames in dist/esm; a handful of icons have no
 * clean match, and those fall back to the shortest `*Icon` export.
 */
function pickCanonical(names, moduleNames) {
  const fileBacked = names.filter((name) => moduleNames.has(name))
  if (fileBacked.length > 0) {
    return fileBacked.sort((a, b) => a.length - b.length || a.localeCompare(b))[0]
  }

  const real = names.filter((name) => !name.endsWith("FreeIcons"))
  const iconSuffixed = real.filter((name) => name.endsWith("Icon"))
  const pool = iconSuffixed.length > 0 ? iconSuffixed : real.length > 0 ? real : names
  return [...pool].sort((a, b) => a.length - b.length || a.localeCompare(b))[0]
}

/**
 * Copies an element verbatim minus `key`, which is just the array index and is
 * re-derived on read. Nothing else is inferable: most paths carry
 * `stroke: currentColor` at width 1.5, but ~70 are fill-only with no stroke, and a
 * handful use other widths — re-adding a default would outline shapes meant to be
 * solid.
 */
function compactElement([tag, attrs]) {
  const out = {}
  for (const [key, value] of Object.entries(attrs)) {
    if (key !== "key") out[key] = value
  }
  if (tag !== "path") out.t = tag
  return out
}

async function main() {
  const pkg = require("@hugeicons/core-free-icons/package.json")
  const version = pkg.version

  // Skip the work when the payload already matches the installed package — this
  // script runs ahead of every `next dev`, and re-emitting 43 shards is not free.
  const existing = await readFile(path.join(OUT_DIR, "manifest.json"), "utf8").catch(
    () => null
  )
  const previous = existing ? JSON.parse(existing) : null
  if (previous?.version === version && previous?.schema === SCHEMA) {
    console.log(`hugeicons: manifest already at ${version} (schema ${SCHEMA}), skipping`)
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

  // Aliases are re-exports of the same frozen array, so object identity — not name
  // parsing — is what actually tells us which exports are the same icon.
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

  await rm(OUT_DIR, { recursive: true, force: true })
  await mkdir(OUT_DIR, { recursive: true })

  const shardCount = Math.ceil(icons.length / SHARD_SIZE)
  await Promise.all(
    Array.from({ length: shardCount }, (_, shard) => {
      const slice = icons.slice(shard * SHARD_SIZE, (shard + 1) * SHARD_SIZE)
      const payload = Object.fromEntries(
        slice.map((icon) => [icon.canonical, icon.elements.map(compactElement)])
      )
      return writeFile(
        path.join(OUT_DIR, `shard-${String(shard).padStart(3, "0")}.json`),
        JSON.stringify(payload)
      )
    })
  )

  const taxonomy = JSON.parse(await readFile(CATEGORIES_FILE, "utf8"))
  const { categories, categoryIcons, repElements, unresolved, covered } =
    resolveCategories(icons, taxonomy)

  // The featured set spans the whole alphabet, so resolving it through shards would
  // pull ~36 of 43 files (about 1MB) to paint the landing view. Inlining it costs
  // roughly 18KB gzipped and drops that to zero.
  const featured = JSON.parse(await readFile(FEATURED_FILE, "utf8"))
  const byName = new Map(icons.map((icon, index) => [icon.canonical, index]))
  const featuredElements = {}
  const badNames = []
  for (const name of featured.groups.flatMap((group) => group.icons)) {
    const index = byName.get(name)
    if (index === undefined) badNames.push(name)
    else featuredElements[name] = icons[index].elements.map(compactElement)
  }
  if (badNames.length > 0) {
    throw new Error(
      `data/hugeicons-featured.json lists ${badNames.length} name(s) that are not ` +
        `canonical exports of @hugeicons/core-free-icons: ${badNames.join(", ")}`
    )
  }

  const manifest = {
    version,
    schema: SCHEMA,
    shardSize: SHARD_SIZE,
    shardCount,
    count: icons.length,
    // [canonical, ...aliases] — positional, because this file is mostly names and
    // object keys would be a third of its weight.
    icons: icons.map((icon) => [icon.canonical, ...icon.aliases]),
    categories,
    // Positions into `icons`, not names — roughly a third the bytes.
    categoryIcons,
    repElements,
    featuredElements,
  }
  await writeFile(path.join(OUT_DIR, "manifest.json"), JSON.stringify(manifest))

  const aliased = icons.filter((icon) => icon.aliases.length > 0).length
  console.log(
    `hugeicons: ${icons.length} icons (${aliased} aliased) → ${shardCount} shards @ v${version}`
  )
  console.log(
    `hugeicons: ${categories.length} categories, ${covered} icons categorised ` +
      `(${icons.length - covered} uncategorised, ${unresolved} pro-only slugs skipped)`
  )
  console.log(
    `hugeicons: ${Object.keys(featuredElements).length} featured + ` +
      `${Object.keys(repElements).length} category thumbnails inlined`
  )
}

await main()
