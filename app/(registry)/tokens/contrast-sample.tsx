"use client"

import { StarIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { contrastRatio, gradeContrast } from "@/lib/color"
import type { ContrastPair, DesignToken } from "@/lib/design-tokens"

import type { ResolvedPair } from "./color-values"

export type Scheme = "light" | "dark"

/**
 * What a pairing actually measures in one theme.
 *
 * Painted from the authored value so a translucent token shows through the way
 * it really does, but measured from the flattened colour — a ratio against a
 * half-transparent value would be meaningless. Null when either side does not
 * resolve.
 */
export function measurePair(
  pair: ContrastPair,
  index: Record<string, DesignToken>,
  resolved: Record<string, ResolvedPair>,
  scheme: Scheme
) {
  const background = index[pair.background]
  const foreground = index[pair.foreground]

  const backgroundColor = background && resolved[background.name]?.[scheme]
  const foregroundColor = foreground && resolved[foreground.name]?.[scheme]

  const ratio =
    backgroundColor && foregroundColor
      ? contrastRatio(foregroundColor.rgb, backgroundColor.rgb)
      : null

  return {
    ratio,
    grade: ratio === null ? null : gradeContrast(ratio),
    background: background?.[scheme].resolved ?? null,
    foreground: foreground?.[scheme].resolved ?? null,
  }
}

/**
 * One direction of a pairing, as the two things a token pair has to carry:
 * a word and an icon. Swapping `background` and `foreground` at the call site
 * is what makes the inverse card.
 */
export function ContrastSample({
  background,
  foreground,
  label,
}: {
  background: string | null
  foreground: string | null
  label: string
}) {
  return (
    <div
      title={label}
      aria-label={label}
      className="flex h-9 w-16 shrink-0 items-center justify-center gap-1 rounded-lg border"
      style={{
        background: background ?? undefined,
        color: foreground ?? undefined,
      }}
    >
      <span className="text-sm leading-none font-medium">Aa</span>
      <HugeiconsIcon icon={StarIcon} strokeWidth={2} className="size-3.5" />
    </div>
  )
}
