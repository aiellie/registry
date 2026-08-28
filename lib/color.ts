/**
 * Browser-only colour helpers.
 *
 * Tokens are authored in oklch, and `getComputedStyle` hands them back as `lab()`,
 * so there is no way to read an sRGB value straight off the DOM. Instead every
 * value is handed to a 1×1 canvas, which parses any CSS colour syntax the browser
 * understands — including `oklch(from …)` — and hands back real pixels.
 */

export type Rgb = { r: number; g: number; b: number }

let context: CanvasRenderingContext2D | null | undefined

function getContext() {
  if (context !== undefined) return context
  if (typeof document === "undefined") return (context = null)

  const canvas = document.createElement("canvas")
  canvas.width = 1
  canvas.height = 1
  context = canvas.getContext("2d", { willReadFrequently: true })
  return context
}

/** Paints `value` over `backdrop` and reads the pixel back. */
function paint(ctx: CanvasRenderingContext2D, value: string, backdrop: string) {
  ctx.fillStyle = backdrop
  ctx.fillRect(0, 0, 1, 1)
  ctx.fillStyle = value
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return { r, g, b }
}

export type ResolvedColor = {
  /** The colour flattened onto `backdrop`, which is what the eye actually sees. */
  rgb: Rgb
  hex: string
  /** 0–1, rounded to three places. */
  alpha: number
}

/**
 * Flattens a CSS colour onto `backdrop`. Returns null when the browser cannot
 * parse the value — an undefined `var()` reference, say.
 *
 * Alpha is recovered by painting the value over black and over white: the gap
 * between the two is exactly `255 × (1 − alpha)` per channel.
 */
export function resolveColor(
  value: string | null | undefined,
  backdrop: string
): ResolvedColor | null {
  const ctx = getContext()
  if (!ctx || !value) return null

  // An invalid assignment leaves fillStyle untouched, so two different sentinels
  // disagree only when the browser rejected the value.
  ctx.fillStyle = "#000000"
  ctx.fillStyle = value
  const first = ctx.fillStyle
  ctx.fillStyle = "#ffffff"
  ctx.fillStyle = value
  if (ctx.fillStyle !== first) return null

  const onBlack = paint(ctx, value, "#000000")
  const onWhite = paint(ctx, value, "#ffffff")
  const spread =
    (onWhite.r -
      onBlack.r +
      (onWhite.g - onBlack.g) +
      (onWhite.b - onBlack.b)) /
    3

  const rgb = paint(ctx, value, backdrop)
  return {
    rgb,
    hex: toHex(rgb),
    alpha: Math.round(Math.max(0, Math.min(1, 1 - spread / 255)) * 1000) / 1000,
  }
}

export function toHex({ r, g, b }: Rgb) {
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`
}

/** WCAG 2.1 relative luminance. */
function luminance({ r, g, b }: Rgb) {
  const [rl, gl, bl] = [r, g, b].map((channel) => {
    const c = channel / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl
}

/** WCAG 2.1 contrast ratio, 1–21. Both colours must already be opaque. */
export function contrastRatio(a: Rgb, b: Rgb) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (light + 0.05) / (dark + 0.05)
}

export type ContrastGrade = {
  label: string
  /** Passes AA for body text. */
  pass: boolean
}

export function gradeContrast(ratio: number): ContrastGrade {
  if (ratio >= 7) return { label: "AAA", pass: true }
  if (ratio >= 4.5) return { label: "AA", pass: true }
  if (ratio >= 3) return { label: "AA Large", pass: false }
  return { label: "Fail", pass: false }
}
