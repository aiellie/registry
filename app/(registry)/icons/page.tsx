import type { Metadata } from "next"

import { getIconSetMeta } from "@/lib/icon-sets.server"

import { IconsView } from "./components/icons-view"

export const metadata: Metadata = {
  title: "Icons",
  description:
    "Search the full HugeIcons stroke-rounded set and copy the import, JSX, or SVG for any icon in the registry.aiellie.dev design system.",
}

export default async function IconsPage() {
  const meta = await getIconSetMeta()

  return <IconsView meta={meta} />
}
