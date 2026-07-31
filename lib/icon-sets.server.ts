import { readFile } from "node:fs/promises"
import path from "node:path"

import {
  type IconBrand,
  type IconManifest,
  type IconSetMeta,
  type IconSetsMeta,
  BRAND_IDS,
} from "./icon-sets"

/**
 * Server-only: each manifest's header, without the name lists. The counts and
 * versions render with the page, while the browser fetches the full manifests as
 * cacheable static assets rather than paying for them in every RSC payload.
 */
async function getSetMeta(brand: IconBrand): Promise<IconSetMeta> {
  const file = path.join(process.cwd(), "public", brand, "manifest.json")

  let raw: string
  try {
    raw = await readFile(file, "utf8")
  } catch {
    throw new Error(
      `public/${brand}/manifest.json is missing — run \`pnpm icons:build\` (it runs automatically before \`pnpm dev\` and \`pnpm build\`).`
    )
  }

  const { version, schema, shardSize, shardCount, count } = JSON.parse(
    raw
  ) as IconManifest

  return { version, schema, shardSize, shardCount, count }
}

export async function getIconSetsMeta(): Promise<IconSetsMeta> {
  const [hugeicons, lucide] = await Promise.all(BRAND_IDS.map(getSetMeta))
  return { hugeicons, lucide }
}
