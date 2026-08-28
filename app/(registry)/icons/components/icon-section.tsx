"use client"

import type { ReactNode } from "react"

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

/**
 * One collapsible category row, shared by both sources so the curated set and
 * the full library read as the same list — only the glyph in the header and the
 * cells in the panel differ.
 */
export function IconSection({
  value,
  glyph,
  label,
  count,
  children,
}: {
  /** Category id; the accordion's open state is a list of these. */
  value: string
  /** Header thumbnail. Untinted on purpose — the tint previews the icons. */
  glyph?: ReactNode
  label: string
  /** Matches in this section, which under a filter is not the full membership. */
  count: number
  children: ReactNode
}) {
  return (
    <AccordionItem value={value} className="rounded-lg border">
      <AccordionTrigger className="px-2.5 text-sm font-medium">
        <span className="flex min-w-0 flex-1 items-center gap-2">
          {glyph}
          <span className="truncate">{label}</span>
          <Badge
            variant="secondary"
            className="ms-auto me-2 font-mono tabular-nums"
          >
            {count}
          </Badge>
        </span>
      </AccordionTrigger>
      <AccordionContent className="px-2.5">{children}</AccordionContent>
    </AccordionItem>
  )
}
