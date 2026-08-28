"use client"

import type { ResolvedColor } from "@/lib/color"

/** Which spelling of a value the pickers open in: as authored, or as hex. */
export type ValueFormat = "source" | "hex"

/** A token's colour in both themes, each flattened onto its own backdrop. */
export type ResolvedPair = {
  light: ResolvedColor | null
  dark: ResolvedColor | null
}

/** `sidebar-primary-foreground` → `Sidebar primary foreground`. */
export function humanize(name: string) {
  const [first, ...rest] = name.split("-")
  return [first.charAt(0).toUpperCase() + first.slice(1), ...rest].join(" ")
}
