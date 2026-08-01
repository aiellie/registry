/**
 * The studio's non-token choices: which family `--font-sans` points at, how the
 * finished syntax highlighting is recoloured, and which effect the home page
 * wraps itself in. Every entry maps to a value the panel writes verbatim, so a
 * preset is only ever a shorthand for a token the stylesheet already has.
 */

export type PresetOption<V extends string = string> = {
  value: V
  label: string
  /** The token value this option writes; null clears the override. */
  css: string | null
}

/**
 * `--font-sans` is what every `font-sans` utility resolves through. The webfont
 * entries point at variables `app/fonts.ts` declares, so switching to one is
 * what triggers its download.
 */
export const FONT_OPTIONS: readonly PresetOption[] = [
  { value: "default", label: "Geist", css: null },
  { value: "inter", label: "Inter", css: "var(--font-inter)" },
  { value: "fraunces", label: "Fraunces", css: "var(--font-fraunces)" },
  { value: "jetbrains", label: "JetBrains Mono", css: "var(--font-jetbrains)" },
  { value: "geist-mono", label: "Geist Mono", css: "var(--font-mono)" },
  {
    value: "system",
    label: "System",
    css: "ui-sans-serif, system-ui, sans-serif",
  },
  { value: "serif", label: "Serif", css: "ui-serif, Georgia, Cambria, serif" },
  {
    value: "rounded",
    label: "Rounded",
    css: "ui-rounded, ui-sans-serif, system-ui, sans-serif",
  },
]

/**
 * Shiki resolves its palette when the page is rendered and writes the colors
 * into the markup, so no amount of CSS can repaint one token differently from
 * another. A filter over the finished block is the honest version of a code
 * theme: it shifts the whole palette at once, and costs nothing per span.
 */
export const CODE_THEME_OPTIONS: readonly PresetOption[] = [
  { value: "default", label: "GitHub", css: null },
  { value: "muted", label: "Muted", css: "saturate(0.5)" },
  { value: "vivid", label: "Vivid", css: "saturate(1.4) contrast(1.05)" },
  { value: "mono", label: "Mono", css: "grayscale(1)" },
  {
    value: "warm",
    label: "Warm",
    css: "sepia(0.35) saturate(1.4) hue-rotate(-14deg)",
  },
  { value: "cool", label: "Cool", css: "hue-rotate(32deg) saturate(0.95)" },
  { value: "dusk", label: "Dusk", css: "hue-rotate(-32deg) saturate(1.15)" },
]

export type SiteEffect = "bubble" | "liquid" | "none"

export const SITE_EFFECT_OPTIONS: readonly PresetOption<SiteEffect>[] = [
  { value: "bubble", label: "Bubble", css: null },
  { value: "liquid", label: "Liquid", css: null },
  { value: "none", label: "None", css: null },
]

/** The option whose value is currently written, or `default` when none is. */
export function activePreset(
  options: readonly PresetOption[],
  current: string | undefined
) {
  if (current === undefined) return "default"
  return options.find((option) => option.css === current)?.value ?? "custom"
}
