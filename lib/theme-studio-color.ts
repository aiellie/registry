/**
 * Browser-only: turns a token's CSS value into something a color wheel can hold.
 *
 * Tokens are authored in oklch and several carry alpha (`oklch(1 0 0 / 10%)`),
 * but the picker speaks opaque `#rrggbb`. Painting the value over black gives
 * the premultiplied color, so dividing it back out recovers the base the wheel
 * should open on — and the alpha is kept aside to be re-applied on the way out.
 */

import { resolveColor, toHex } from "./color"

export type TokenColor = {
  /** The opaque base, `#rrggbb`. */
  hex: string
  /** 0–1. */
  alpha: number
}

/**
 * Every row resolves on every render and values repeat across renders, so the
 * canvas round-trip is done once per distinct value.
 */
const resolved = new Map<string, TokenColor | null>()

const byte = (channel: number) =>
  Math.max(0, Math.min(255, Math.round(channel)))

export function resolveTokenColor(value: string): TokenColor | null {
  const cached = resolved.get(value)
  if (cached !== undefined) return cached

  const painted = resolveColor(value, "#000000")
  let result: TokenColor | null = null

  if (painted) {
    const { alpha, rgb } = painted
    result =
      alpha <= 0
        ? { hex: "#000000", alpha: 0 }
        : {
            hex: toHex({
              r: byte(rgb.r / alpha),
              g: byte(rgb.g / alpha),
              b: byte(rgb.b / alpha),
            }),
            alpha,
          }
  }

  resolved.set(value, result)
  return result
}
