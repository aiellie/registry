import featured from "@/data/hugeicons-featured.json"

/**
 * The brand's working icon set — what /tokens/icons shows before you search.
 *
 * Edit `data/hugeicons-featured.json` to change it. That file is shared with
 * `scripts/build-hugeicons.mjs`, which inlines the geometry for these icons into
 * the manifest: they are scattered across the alphabet, so fetching them by shard
 * would drag in most of the library to draw one screen.
 */
export interface FeaturedGroup {
  title: string
  description: string
  icons: string[]
}

export const FEATURED_GROUPS: FeaturedGroup[] = featured.groups

/** Flat list of every featured name, in display order. */
export const FEATURED_NAMES: string[] = FEATURED_GROUPS.flatMap(
  (group) => group.icons
)
