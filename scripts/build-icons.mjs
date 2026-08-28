/**
 * Generates the static payload behind /icons.
 *
 * The set is far too heavy to hand a browser in one go (~5.5k icons), but each
 * icon is small enough that it shards cleanly. This writes into
 * public/hugeicons/:
 *
 *   manifest.json  every icon name plus its aliases, so search works off a
 *                  single small fetch and never needs the geometry.
 *   shard-NNN.json the actual path data, in fixed alphabetical runs, fetched
 *                  only when a shard's icons are on screen.
 *
 * The payload is content-addressed by the package's version, so a dependency
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

const CATEGORIES_FILE = path.join(
  process.cwd(),
  "data",
  "hugeicons-categories.json"
)

/**
 * Copies an element verbatim minus `key`, which is just the array index and is
 * re-derived on read. Nothing else is inferable: most HugeIcons paths carry
 * `stroke: currentColor` at width 1.5, but ~70 are fill-only with no stroke —
 * re-adding a default would outline shapes meant to be solid.
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

/** Writes the manifest + shards. `icons` must be sorted by canonical. */
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

  const taxonomy = JSON.parse(await readFile(CATEGORIES_FILE, "utf8"))
  const { categories, categoryIcons, repElements, unresolved, covered } =
    resolveCategories(icons, taxonomy)

  const shardCount = await emitSet(outDir, {
    version,
    icons,
    // Positions into `icons`, not names — roughly a third the bytes.
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

await buildHugeicons()
