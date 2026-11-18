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

/** What the home page shows when the studio has no stored effect. */
export const DEFAULT_SITE_EFFECT: SiteEffect = "none"

export const SITE_EFFECT_OPTIONS: readonly PresetOption<SiteEffect>[] = [
  { value: "none", label: "None", css: null },
  { value: "bubble", label: "Bubble", css: null },
  { value: "liquid", label: "Liquid", css: null },
]

/** The option whose value is currently written, or `default` when none is. */
export function activePreset(
  options: readonly PresetOption[],
  current: string | undefined
) {
  if (current === undefined) return "default"
  return options.find((option) => option.css === current)?.value ?? "custom"
}

/* --------------------------------------------------------- theme presets */

/** The token buckets a theme preset writes; `prefs` is never touched. */
export type ThemePresetTokens = {
  root: Record<string, string>
  light: Record<string, string>
  dark: Record<string, string>
}

export type ThemePreset = {
  value: string
  label: string
  /** Null is the stylesheet as authored: every token override cleared. */
  tokens: ThemePresetTokens | null
}

/**
 * The site's previous indigo theme, kept as overrides on top of the AI Ellie
 * stylesheet: only the tokens where the two differ.
 */
const INDIGO_TOKENS: ThemePresetTokens = {
  root: {
    "warning-foreground": "oklch(0.77 0.16 70/5%)",
    radius: "0.875rem",
    "font-weight-medium": "450",
    "destructive-foreground": "oklch(0.577 0.245 27.325/5%)",
    warning: "oklch(0.77 0.16 70)",
  },
  light: {
    "chart-1": "oklch(0.785 0.115 274.713)",
    "chart-2": "oklch(0.585 0.233 277.117)",
    "chart-3": "oklch(0.511 0.262 276.966)",
    "chart-4": "oklch(0.457 0.24 277.023)",
    "chart-5": "oklch(0.398 0.195 277.366)",
    "sidebar-primary-foreground": "oklch(0.962 0.018 272.314)",
    foreground: "oklch(0.37 0.04 257)",
    "card-foreground": "oklch(0.37 0.04 257)",
    "popover-foreground": "oklch(0.37 0.04 257)",
    primary: "#6366f1",
    "primary-foreground": "#ffffff",
    secondary: "oklch(98.5% 0 none)",
    "secondary-foreground": "oklch(0.37 0.04 257)",
    muted: "oklch(96.7% 0.003 264.542)",
    "muted-foreground": "oklch(0.55 0.04 257)",
    accent: "oklch(0.978 0.01 277)",
    "accent-foreground": "oklch(0.457 0.24 277.023)",
    success: "oklch(0.7 0.15 162)",
    border: "oklch(0.93 0.01 256)",
    input: "oklch(0.93 0.01 256)",
    ring: "oklch(0.93 0.01 256)",
    sidebar: "oklch(1 0 0)",
    "sidebar-foreground": "oklch(0.37 0.04 257)",
    "sidebar-primary": "oklch(0.511 0.262 276.966)",
    "sidebar-accent": "oklch(0.457 0.24 277.023/4%)",
    "sidebar-accent-foreground": "oklch(0.457 0.24 277.023)",
    "sidebar-ring": "var(--sidebar-border)",
    selection: "oklch(0.978 0.01 277)",
    "selection-foreground": "oklch(0.457 0.24 277.023)",
  },
  dark: {
    "chart-1": "oklch(0.785 0.115 274.713)",
    "chart-2": "oklch(0.585 0.233 277.117)",
    "chart-3": "oklch(0.511 0.262 276.966)",
    "chart-4": "oklch(0.457 0.24 277.023)",
    "chart-5": "oklch(0.398 0.195 277.366)",
    "sidebar-primary-foreground": "oklch(0.962 0.018 272.314)",
    primary: "oklch(0.398 0.195 277.366)",
    "primary-foreground": "oklch(0.962 0.018 272.314)",
    ring: "var(--border)",
    "sidebar-primary": "oklch(0.585 0.233 277.117)",
    "sidebar-ring": "var(--sidebar-border)",
    selection: "oklch(0.398 0.195 277.366)",
    "selection-foreground": "oklch(0.962 0.018 272.314)",
  },
}

/** The first entry is the stylesheet as authored, so it is also the reset. */
export const THEME_PRESETS: readonly ThemePreset[] = [
  { value: "aiellie", label: "AI Ellie", tokens: null },
  { value: "indigo", label: "Indigo", tokens: INDIGO_TOKENS },
]

export const DEFAULT_THEME_PRESET = THEME_PRESETS[0].value

function sameValues(a: Record<string, string>, b: Record<string, string>) {
  const keys = Object.keys(a)
  return (
    keys.length === Object.keys(b).length &&
    keys.every((key) => a[key] === b[key])
  )
}

/** The preset the token buckets match exactly, or `custom` after any edit. */
export function activeThemePreset(state: ThemePresetTokens): string {
  const match = THEME_PRESETS.find((preset) => {
    const tokens = preset.tokens ?? { root: {}, light: {}, dark: {} }
    return (
      sameValues(state.root, tokens.root) &&
      sameValues(state.light, tokens.light) &&
      sameValues(state.dark, tokens.dark)
    )
  })
  return match?.value ?? "custom"
}
