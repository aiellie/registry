"use client"

import { createElement } from "react"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  type CompactElement,
  type IconBrand,
  toSvgElement,
} from "@/lib/icon-sets"

/**
 * Draws one icon from its sharded geometry, whichever library it came from.
 *
 * HugeIcons goes through the package's own renderer, which rewrites the stroke
 * width per element (each element carries its own stroke attributes). Lucide
 * elements carry none — the `<svg>` root supplies stroke, caps, and joins, so
 * a plain inline svg with Lucide's default root attributes is the faithful
 * rendering.
 */
export function IconGlyph({
  brand,
  elements,
  size,
  strokeWidth,
  className,
}: {
  brand: IconBrand
  elements: CompactElement[]
  size: number
  strokeWidth: number
  className?: string
}) {
  if (brand === "hugeicons") {
    return (
      <HugeiconsIcon
        icon={toSvgElement(elements)}
        size={size}
        strokeWidth={strokeWidth}
        className={className}
      />
    )
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {elements.map(({ t, ...attrs }, index) =>
        createElement(t ?? "path", { ...attrs, key: index })
      )}
    </svg>
  )
}
