/**
 * One-time scrape of the HugeIcons category taxonomy.
 *
 * The npm package ships geometry only — no categories — so the grouping shown on
 * hugeicons.com has to come from the site itself. This writes the result to
 * data/hugeicons-categories.json, which is COMMITTED: the regular build reads that
 * file and never touches the network. Re-run this by hand (`pnpm icons:categories`)
 * only when HugeIcons ships new icons.
 *
 * Category grid tiles are served from ico.hugeicons.com as `<slug>-stroke-rounded`
 * images, while the sidebar's category thumbnails use `-solid-standard` — so
 * matching on the stroke-rounded suffix yields exactly the category's members.
 *
 * Each category's published count is used as a checksum: a mismatch is reported
 * rather than silently written, because a short page would look like a real
 * category that simply has fewer icons.
 */
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"

const OUT = path.join(process.cwd(), "data", "hugeicons-categories.json")
const BASE = "https://hugeicons.com/icons/stroke-rounded"
const CONCURRENCY = 4
const MAX_PAGES = 12

/** slug, label, published count, and the icon the site uses to represent it. */
const CATEGORIES = [
  ["add-remove", "Add + Remove", 42, "Add 01"],
  ["ai", "AI", 137, "Ai Book"],
  ["alert", "Alert", 45, "Alert 01"],
  ["animation", "Animation", 35, "Bounce Left"],
  ["arrows", "Arrows", 242, "Arrow All Direction"],
  ["award", "Award", 39, "Award 01"],
  ["bookmark", "Bookmark", 46, "All Bookmark"],
  ["buildings", "Buildings", 83, "Barns"],
  ["business", "Business", 419, "Address Book"],
  ["check", "Check", 46, "Checkmark Badge 01"],
  ["clothing", "Clothing", 65, "Baby 01"],
  ["communications", "Communications", 282, "Bubble Chat"],
  ["crypto", "Crypto", 75, "Anonymous"],
  ["dashboard", "Dashboard", 26, "Dashboard Browsing"],
  ["date-time", "Date + Time", 115, "Alarm Clock"],
  ["devices", "Devices", 229, "Airdrop"],
  ["download-upload", "Download + Upload", 24, "Cloud Download"],
  ["e-commerce", "E-Commerce", 163, "Affiliate"],
  ["editing", "Editing", 599, "Align Bottom"],
  ["education", "Education", 126, "Audio Book 01"],
  ["emojis", "Emojis", 65, "Angel"],
  ["energy", "Energy", 115, "Atomic Power"],
  ["files-folders", "Files Folders", 215, "Archive 01"],
  ["filter-sorting", "Filter + Sorting", 50, "Filter"],
  ["foods", "Foods", 145, "Apple 01"],
  ["furnitures", "Furnitures", 88, "Baby Bed 01"],
  ["games", "Games", 175, "Adventure"],
  ["git", "Git", 20, "Git Branch"],
  ["gym", "Gym", 54, "Body Part Leg"],
  ["hands", "Hands", 172, "Clapping 01"],
  ["hierarchy", "Hierarchy", 61, "Flow"],
  ["home", "Home", 24, "Door 01"],
  ["image-camera", "Image + Camera", 86, "Album 01"],
  ["islamic", "Islamic", 46, "Adzan"],
  ["kitchen", "Kitchen", 48, "Apron"],
  ["layout", "Layout", 78, "Border All 01"],
  ["legal", "Legal", 37, "Agreement 01"],
  ["link-unlink", "Link + Unlink", 30, "Link 01"],
  ["login-logout", "Login + Logout", 18, "Login 01"],
  ["logistics", "Logistics", 110, "Accident"],
  ["logos", "Logos", 193, "Adobe After Effect"],
  ["maps", "Maps", 123, "Compass"],
  ["mathematics", "Mathematics", 167, "1st Bracket"],
  ["media", "Media", 105, "Backward 01"],
  ["medical", "Medical", 94, "Aids"],
  ["menu", "Menu", 31, "Menu 01"],
  ["mouse", "Mouse", 98, "Cursor 01"],
  ["notes-tasks", "Notes + Tasks", 36, "Note 01"],
  ["presentation", "Presentation", 15, "Co Present"],
  ["programming", "Programming", 86, "Api"],
  ["science-technology", "Science + Technology", 28, "Acceleration"],
  ["search", "Search", 22, "Search 01"],
  ["security", "Security", 112, "Access"],
  ["settings", "Settings", 48, "Account Setting 01"],
  ["shapes", "Shapes", 38, "Circle"],
  ["space", "Space", 28, "Alien 01"],
  ["users", "Users", 90, "Add Team"],
  ["weather", "Weather", 123, "Avalanche"],
  ["wifi", "Wifi", 81, "Cellular Network"],
]

async function fetchPage(slug, page) {
  const url = page === 1 ? `${BASE}/${slug}` : `${BASE}/${slug}?page=${page}`
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { "user-agent": "Mozilla/5.0 (compatible; ui.aiellie.dev icon-docs)" },
      })
      if (!response.ok) throw new Error(`${response.status}`)
      return await response.text()
    } catch (error) {
      if (attempt === 2) throw error
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)))
    }
  }
}

function slugsIn(html) {
  return [
    ...html.matchAll(/ico\.hugeicons\.com\/([a-z0-9-]+)-stroke-rounded@/g),
  ].map((match) => match[1])
}

async function scrapeCategory([slug, label, expected]) {
  const found = new Set()

  for (let page = 1; page <= MAX_PAGES; page++) {
    const html = await fetchPage(slug, page)
    const before = found.size
    for (const iconSlug of slugsIn(html)) found.add(iconSlug)

    // Stop when the page added nothing new (past the end) or we have them all.
    if (found.size === before || found.size >= expected) break
  }

  const icons = [...found].sort()
  const status = icons.length === expected ? "ok" : `EXPECTED ${expected}`
  console.log(`  ${label.padEnd(22)} ${String(icons.length).padStart(4)}  ${status}`)
  return { slug, label, expected, icons }
}

/** Runs `worker` over `items` with a fixed number of concurrent slots. */
async function pool(items, limit, worker) {
  const results = new Array(items.length)
  let cursor = 0
  await Promise.all(
    Array.from({ length: limit }, async () => {
      while (cursor < items.length) {
        const index = cursor++
        results[index] = await worker(items[index])
      }
    })
  )
  return results
}

console.log(`Scraping ${CATEGORIES.length} categories from hugeicons.com…`)
const scraped = await pool(CATEGORIES, CONCURRENCY, scrapeCategory)

const mismatched = scraped.filter((entry) => entry.icons.length !== entry.expected)
const total = new Set(scraped.flatMap((entry) => entry.icons)).size

await mkdir(path.dirname(OUT), { recursive: true })
await writeFile(
  OUT,
  JSON.stringify(
    {
      scrapedFrom: BASE,
      note: "Committed artefact — regenerate with `pnpm icons:categories`. Values are hugeicons.com slugs, mapped to package export names at build time.",
      categories: CATEGORIES.map(([slug, label, count, rep]) => ({
        slug,
        label,
        count,
        rep,
      })),
      icons: Object.fromEntries(scraped.map((entry) => [entry.slug, entry.icons])),
    },
    null,
    2
  )
)

console.log(`\n${total} distinct icons across ${scraped.length} categories → ${OUT}`)
if (mismatched.length > 0) {
  console.log(`\n⚠ ${mismatched.length} categories differ from the published count:`)
  for (const entry of mismatched) {
    console.log(`  ${entry.label}: got ${entry.icons.length}, expected ${entry.expected}`)
  }
}
