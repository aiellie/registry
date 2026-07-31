/**
 * Regenerates data/lucide-categories.json — the Lucide category taxonomy.
 *
 * No npm package publishes Lucide's categories (lucide-static stops at
 * tags.json), so this pulls the source tarball for the exact installed
 * lucide-react version and reads `categories/<slug>.json` plus each icon's
 * `categories` list. The output is committed; re-run after bumping
 * lucide-react:
 *
 *   pnpm icons:categories
 */
import { execFileSync } from "node:child_process"
import { createRequire } from "node:module"
import {
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

const require = createRequire(import.meta.url)

const OUT_FILE = path.join(process.cwd(), "data", "lucide-categories.json")

const version = require("lucide-react/package.json").version
const url = `https://codeload.github.com/lucide-icons/lucide/tar.gz/refs/tags/${version}`

console.log(`lucide: fetching source tarball for v${version}…`)
const workDir = await mkdtemp(path.join(tmpdir(), "lucide-scrape-"))
try {
  const tarball = path.join(workDir, "lucide.tar.gz")
  execFileSync("curl", ["-sfL", "-o", tarball, url])
  execFileSync("tar", [
    "-xzf",
    tarball,
    "-C",
    workDir,
    "--strip-components=1",
    "*/categories",
    "*/icons/*.json",
  ])

  const categoryFiles = (
    await readdir(path.join(workDir, "categories"))
  ).filter((file) => file.endsWith(".json") && !file.includes("schema"))
  const categories = []
  for (const file of categoryFiles.sort()) {
    const { title, icon } = JSON.parse(
      await readFile(path.join(workDir, "categories", file), "utf8")
    )
    categories.push({
      slug: file.replace(/\.json$/, ""),
      label: title,
      rep: icon,
    })
  }

  const iconFiles = (await readdir(path.join(workDir, "icons"))).filter(
    (file) => file.endsWith(".json") && !file.includes("schema")
  )
  const icons = Object.fromEntries(categories.map(({ slug }) => [slug, []]))
  let uncategorised = 0
  for (const file of iconFiles.sort()) {
    const slug = file.replace(/\.json$/, "")
    const meta = JSON.parse(
      await readFile(path.join(workDir, "icons", file), "utf8")
    )
    const filed = (meta.categories ?? []).filter((category) => icons[category])
    if (filed.length === 0) uncategorised += 1
    for (const category of filed) icons[category].push(slug)
  }

  // `count` is informational for humans diffing this file; the build script
  // recounts against what the installed package actually exports.
  for (const category of categories) {
    category.count = icons[category.slug].length
  }

  await mkdir(path.dirname(OUT_FILE), { recursive: true })
  await writeFile(
    OUT_FILE,
    JSON.stringify(
      {
        scrapedFrom: url,
        note: "Regenerate with `pnpm icons:categories` after bumping lucide-react.",
        categories,
        icons,
      },
      null,
      2
    ) + "\n"
  )

  console.log(
    `lucide: ${categories.length} categories over ${iconFiles.length} icons ` +
      `(${uncategorised} uncategorised) → data/lucide-categories.json`
  )
} finally {
  await rm(workDir, { recursive: true, force: true })
}
