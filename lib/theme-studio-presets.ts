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
 * The aiellie design system's theme, mapped onto this site's token names.
 *
 * Tokens that theme declares in `:root` only land in `root`, so they reach both
 * modes the way they would in its stylesheet; tokens it redeclares under
 * `.dark` are split into `light` and `dark`. Its `--destructive-subtle` and
 * `--pending` are this site's `--destructive-foreground` and `--warning`, and
 * its `::selection` (foreground on background) becomes the selection pair.
 */
const AIELLIE_TOKENS: ThemePresetTokens = {
  root: {
    "warning-foreground": "oklch(0.555 0.163 48.998 / 5%)",
    "chart-1": "oklch(0.871 0.006 286.286)",
    "chart-2": "oklch(0.552 0.016 285.938)",
    "chart-3": "oklch(0.442 0.017 285.786)",
    "chart-4": "oklch(0.37 0.013 285.805)",
    "chart-5": "oklch(0.274 0.006 286.033)",
    "sidebar-primary-foreground": "oklch(0.985 0 0)",
    radius: "1rem",
    "font-weight-normal": "350",
    "font-weight-medium": "430",
    "font-weight-semibold": "450",
    "font-weight-bold": "450",
  },
  light: {
    background: "oklch(1 0 0)",
    foreground: "oklch(0.141 0.005 285.823)",
    card: "oklch(1 0 0)",
    "card-foreground": "oklch(0.141 0.005 285.823)",
    popover: "oklch(1 0 0)",
    "popover-foreground": "oklch(0.141 0.005 285.823)",
    primary: "oklch(0.21 0.006 285.885)",
    "primary-foreground": "oklch(0.985 0 0)",
    secondary: "oklch(0.967 0.001 286.375)",
    "secondary-foreground": "oklch(0.21 0.006 285.885)",
    muted: "oklch(0.967 0.001 286.375)",
    "muted-foreground": "oklch(0.552 0.016 285.938)",
    accent: "oklch(0.967 0.001 286.375)",
    "accent-foreground": "oklch(0.21 0.006 285.885)",
    destructive: "oklch(0.577 0.245 27.325)",
    "destructive-foreground": "oklch(0.577 0.245 27.325 / 4%)",
    success: "oklch(0.527 0.154 150.069)",
    warning: "oklch(0.555 0.163 48.998)",
    border: "oklch(0.92 0.004 286.32)",
    input: "oklch(0.92 0.004 286.32)",
    ring: "oklch(0.83 0.009 286.2)",
    sidebar: "oklch(0.985 0 0)",
    "sidebar-foreground": "oklch(0.141 0.005 285.823)",
    "sidebar-primary": "oklch(0.21 0.006 285.885)",
    "sidebar-accent": "oklch(0.967 0.001 286.375)",
    "sidebar-accent-foreground": "oklch(0.21 0.006 285.885)",
    "sidebar-border": "oklch(0.92 0.004 286.32)",
    "sidebar-ring": "oklch(0.83 0.009 286.2)",
    selection: "oklch(0.141 0.005 285.823)",
    "selection-foreground": "oklch(1 0 0)",
  },
  dark: {
    background: "oklch(0.141 0.005 285.823)",
    foreground: "oklch(0.985 0 0)",
    card: "oklch(0.21 0.006 285.885)",
    "card-foreground": "oklch(0.985 0 0)",
    popover: "oklch(0.21 0.006 285.885)",
    "popover-foreground": "oklch(0.985 0 0)",
    primary: "oklch(0.92 0.004 286.32)",
    "primary-foreground": "oklch(0.21 0.006 285.885)",
    secondary: "oklch(0.274 0.006 286.033)",
    "secondary-foreground": "oklch(0.985 0 0)",
    muted: "oklch(0.274 0.006 286.033)",
    "muted-foreground": "oklch(0.705 0.015 286.067)",
    accent: "oklch(0.274 0.006 286.033)",
    "accent-foreground": "oklch(0.985 0 0)",
    destructive: "oklch(0.704 0.191 22.216)",
    "destructive-foreground": "oklch(0.704 0.191 22.216 / 10%)",
    success: "oklch(0.792 0.209 151.711)",
    warning: "oklch(0.828 0.189 84.429)",
    border: "oklch(1 0 0 / 10%)",
    input: "oklch(1 0 0 / 15%)",
    ring: "oklch(0.552 0.016 285.938)",
    sidebar: "oklch(0.21 0.006 285.885)",
    "sidebar-foreground": "oklch(0.985 0 0)",
    "sidebar-primary": "oklch(0.488 0.243 264.376)",
    "sidebar-accent": "oklch(0.274 0.006 286.033)",
    "sidebar-accent-foreground": "oklch(0.985 0 0)",
    "sidebar-border": "oklch(1 0 0 / 10%)",
    "sidebar-ring": "oklch(0.552 0.016 285.938)",
    selection: "oklch(0.985 0 0)",
    "selection-foreground": "oklch(0.141 0.005 285.823)",
  },
}

export const THEME_PRESETS: readonly ThemePreset[] = [
  { value: "default", label: "Default", tokens: null },
  { value: "aiellie", label: "AI Ellie", tokens: AIELLIE_TOKENS },
]

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
