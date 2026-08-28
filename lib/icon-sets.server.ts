import { readFile } from "node:fs/promises"
import path from "node:path"

import { type IconManifest, type IconSetMeta } from "./icon-sets"

/**
 * Server-only: the manifest's header, without the name lists. The count and
 * version render with the page, while the browser fetches the full manifest as
 * a cacheable static asset rather than paying for it in every RSC payload.
 */
export async function getIconSetMeta(): Promise<IconSetMeta> {
  const file = path.join(process.cwd(), "public", "hugeicons", "manifest.json")

  let raw: string
  try {
    raw = await readFile(file, "utf8")
  } catch {
    throw new Error(
      "public/hugeicons/manifest.json is missing — run `pnpm icons:build` (it runs automatically before `pnpm dev` and `pnpm build`)."
    )
  }

  const { version, schema, shardSize, shardCount, count } = JSON.parse(
    raw
  ) as IconManifest

  return { version, schema, shardSize, shardCount, count }
}
