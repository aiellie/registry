import type { Metadata } from "next"

import { getIconsMeta } from "@/lib/hugeicons.server"

import { IconsView } from "./icons-view"

export const metadata: Metadata = {
  title: "Icons",
  description:
    "Search the full HugeIcons stroke-rounded set and copy the import, JSX, or SVG for any icon in the ui.aiellie.dev design system.",
}

export default async function IconsPage() {
  const meta = await getIconsMeta()

  return <IconsView meta={meta} />
}
