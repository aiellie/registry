/**
 * Deterministic gradient image generator.
 *
 * Turns any string seed into a stable, colorful gradient encoded as an SVG
 * data URI — the same seed always yields the same image. Useful as a
 * placeholder/cover in place of a real photo (similar to avatar.vercel.sh).
 */

// FNV-1a hash — fast, deterministic, decent distribution for short strings.
function hash(seed: string) {
  let h = 0x811c9dc5
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

// A small seeded PRNG (mulberry32) so we can pull several stable values per seed.
function mulberry32(state: number) {
  return () => {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type GradientOptions = {
  /** Output width in pixels. */
  width?: number
  /** Output height in pixels. */
  height?: number
  /** Saturation of the generated colors (0-100). */
  saturation?: number
  /** Lightness of the generated colors (0-100). */
  lightness?: number
  /**
   * How far the hue travels across the gradient, in degrees. Small values
   * (~40-70) keep the three stops analogous — the smooth indigo → purple →
   * fuchsia look.
   */
  hueSpread?: number
}

/**
 * Build a gradient SVG string from a seed.
 *
 * Produces a smooth three-stop diagonal gradient using analogous hues, in the
 * spirit of a `from-indigo-500 via-purple-500 to-fuchsia-500` Tailwind ramp.
 */
export function gradientSvg(seed: string, options: GradientOptions = {}) {
  const {
    width = 600,
    height = 600,
    saturation = 78,
    lightness = 58,
    hueSpread = 60,
  } = options

  const rand = mulberry32(hash(seed))

  // A single base hue with two neighbours — analogous stops read as one
  // cohesive gradient rather than a muddy rainbow.
  const baseHue = rand() * 360
  const direction = rand() < 0.5 ? -1 : 1
  const hueA = baseHue
  const hueB = baseHue + (direction * hueSpread) / 2
  const hueC = baseHue + direction * hueSpread

  // Mostly diagonal, with a little seeded wobble so seeds feel distinct.
  const angle = Math.round(115 + rand() * 40)

  const color = (h: number, l = lightness) =>
    `hsl(${Math.round(((h % 360) + 360) % 360)}, ${saturation}%, ${l}%)`

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="g" gradientTransform="rotate(${angle} 0.5 0.5)">
        <stop offset="0%" stop-color="${color(hueA, lightness + 4)}"/>
        <stop offset="50%" stop-color="${color(hueB)}"/>
        <stop offset="100%" stop-color="${color(hueC, lightness - 4)}"/>
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#g)"/>
  </svg>`

  return svg
}

/**
 * Build a gradient as a data URI, ready to drop into an `img`/`Image` `src`.
 */
export function gradientImage(seed: string, options: GradientOptions = {}) {
  const svg = gradientSvg(seed, options)
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
