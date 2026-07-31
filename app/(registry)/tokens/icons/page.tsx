import type { Metadata } from "next"

import { getIconSetsMeta } from "@/lib/icon-sets.server"

import { IconsView } from "./icons-view"

export const metadata: Metadata = {
  title: "Icons",
  description:
    "Search the full HugeIcons stroke-rounded and Lucide sets side by side and copy the import, JSX, or SVG for any icon in the ui.aiellie.dev design system.",
}

export default async function IconsPage() {
  const meta = await getIconSetsMeta()

  return <IconsView meta={meta} />
}
