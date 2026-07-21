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
import { mkdir, readFile, rm, writeFile } from "node:fs/promises"
import path from "node:path"

const require = createRequire(import.meta.url)

const OUT_DIR = path.join(process.cwd(), "public", "hugeicons")
const SHARD_SIZE = 128

/**
 * Exports whose only job is to alias the canonical name. `*FreeIcons` is a
 * packaging artefact; the bare `*Icon` name is what people actually import.
 */
function pickCanonical(names) {
  const real = names.filter((name) => !name.endsWith("FreeIcons"))
  const iconSuffixed = real.filter((name) => name.endsWith("Icon"))
  const pool = iconSuffixed.length > 0 ? iconSuffixed : real.length > 0 ? real : names
  // Shortest wins ties so `Home01Icon` beats a longer descriptive alias.
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
  if (existing && JSON.parse(existing).version === version) {
    console.log(`hugeicons: manifest already at ${version}, skipping`)
    return
  }

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
      const canonical = pickCanonical(names)
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

  const manifest = {
    version,
    shardSize: SHARD_SIZE,
    shardCount,
    count: icons.length,
    // [canonical, ...aliases] — positional, because this file is mostly names and
    // object keys would be a third of its weight.
    icons: icons.map((icon) => [icon.canonical, ...icon.aliases]),
  }
  await writeFile(path.join(OUT_DIR, "manifest.json"), JSON.stringify(manifest))

  const aliased = icons.filter((icon) => icon.aliases.length > 0).length
  console.log(
    `hugeicons: ${icons.length} icons (${aliased} aliased) → ${shardCount} shards @ v${version}`
  )
}

await main()
