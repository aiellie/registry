import { readFile } from "node:fs/promises"
import path from "node:path"

import type { IconManifest, IconsMeta } from "./hugeicons"

const MANIFEST = path.join(process.cwd(), "public", "hugeicons", "manifest.json")

/**
 * Server-only: the manifest's header, without the ~180KB name list. The counts and
 * version render with the page, while the browser fetches the full manifest as a
 * cacheable static asset rather than paying for it in every RSC payload.
 */
export async function getIconsMeta(): Promise<IconsMeta> {
  let raw: string
  try {
    raw = await readFile(MANIFEST, "utf8")
  } catch {
    throw new Error(
      "public/hugeicons/manifest.json is missing — run `pnpm icons:build` (it runs automatically before `pnpm dev` and `pnpm build`)."
    )
  }

  const { version, shardSize, shardCount, count } = JSON.parse(raw) as IconManifest
  return { version, shardSize, shardCount, count }
}
