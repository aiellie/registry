"use client"

import { HugeiconsIcon } from "@hugeicons/react"

import { type CompactElement, toSvgElement } from "@/lib/icon-sets"

/**
 * Draws one icon from its sharded geometry.
 *
 * Everything goes through the package's own renderer, which rewrites the stroke
 * width per element — HugeIcons carries stroke attributes on each element
 * rather than on the `<svg>` root, so nothing else would apply the setting.
 */
export function IconGlyph({
  elements,
  size,
  strokeWidth,
  className,
}: {
  elements: CompactElement[]
  size: number
  strokeWidth: number
  className?: string
}) {
  return (
    <HugeiconsIcon
      icon={toSvgElement(elements)}
      size={size}
      strokeWidth={strokeWidth}
      className={className}
    />
  )
}
