/**
 * Turns the theme block of a stylesheet into structured tokens.
 *
 * Kept free of any Node imports so client components can share the types and the
 * contrast pairings — reading the file lives in `design-tokens.server.ts`.
 */

export type TokenValue = {
  /** Value exactly as authored in globals.css. */
  raw: string
  /** `raw` with every `var()` reference substituted, or null when a reference is undefined. */
  resolved: string | null
  /** Token this value forwards to, when the value is a bare `var()` reference. */
  alias: string | null
  /** True when `.dark` does not redefine the token, so it inherits the light value. */
  inherited?: boolean
}

export type DesignToken = {
  name: string
  light: TokenValue
  dark: TokenValue
  /** Value from the `min-width: 48rem` override, when the token has one. */
  md?: string
}

export type TokenGroup = {
  id: string
  title: string
  description: string
  tokens: DesignToken[]
}

/**
 * Splits a token list into the two numbers a section reports: how many resolve,
 * and how many reference a `var()` globals.css never defines in one theme or
 * the other.
 */
export function countTokens(tokens: DesignToken[]) {
  const broken = tokens.filter(
    (token) => token.light.resolved === null || token.dark.resolved === null
  ).length
  return { count: tokens.length - broken, broken }
}

export type ContrastPair = {
  label: string
  background: string
  foreground: string
  /** Id of the colour group it files under, so Contrast reads in the same order. */
  group: string
}

/** Body of the first rule whose selector matches, plus the index of its closing brace. */
function ruleBody(css: string, selector: RegExp, from = 0) {
  const match = selector.exec(css.slice(from))
  if (!match) return null

  const open = css.indexOf("{", from + match.index)
  if (open === -1) return null

  let depth = 0
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth += 1
    else if (css[i] === "}") {
      depth -= 1
      if (depth === 0) return { body: css.slice(open + 1, i), end: i }
    }
  }
  return null
}

/** Custom property declarations in a rule body, skipping anything nested. */
function customProperties(body: string) {
  const declarations = new Map<string, string>()
  for (const match of body.matchAll(/(--[\w-]+)\s*:\s*([^;{}]+);/g)) {
    declarations.set(match[1].slice(2), match[2].trim())
  }
  return declarations
}

const VAR_REFERENCE = /var\(\s*(--[\w-]+)\s*(?:,\s*([^)]*))?\)/g

/** Substitutes `var()` references against `scope`. Null when a reference is undefined or cyclic. */
function resolveValue(
  value: string,
  scope: Map<string, string>,
  seen: ReadonlySet<string> = new Set()
): string | null {
  let failed = false

  const resolved = value.replace(
    VAR_REFERENCE,
    (_, reference: string, fallback?: string) => {
      const name = reference.slice(2)
      if (seen.has(name)) {
        failed = true
        return ""
      }

      const next = scope.get(name)
      if (next === undefined) {
        if (fallback !== undefined) return fallback.trim()
        failed = true
        return ""
      }

      const nested = resolveValue(next, scope, new Set([...seen, name]))
      if (nested === null) {
        failed = true
        return ""
      }
      return nested
    }
  )

  return failed ? null : resolved
}

/** The token a value forwards to, when the whole value is a single `var()` reference. */
function aliasOf(value: string) {
  const match = /^var\(\s*(--[\w-]+)\s*\)$/.exec(value)
  return match ? match[1].slice(2) : null
}

function toTokenValue(raw: string, scope: Map<string, string>): TokenValue {
  return { raw, resolved: resolveValue(raw, scope), alias: aliasOf(raw) }
}

/**
 * Groups are curated so the page reads in a deliberate order rather than source
 * order. Anything defined in globals.css but missing here lands in "Uncategorized",
 * so a new token shows up on the page the moment it is added.
 */
type GroupConfig = Omit<TokenGroup, "tokens"> & { names: string[] }

const COLOR_GROUPS: GroupConfig[] = [
  {
    id: "surfaces",
    title: "Surfaces",
    description: "The base canvas and the layers that sit on top of it.",
    names: [
      "background",
      "foreground",
      "card",
      "card-foreground",
      "popover",
      "popover-foreground",
    ],
  },
  {
    id: "brand",
    title: "Brand",
    description: "Primary, secondary, and accent — the identity of the system.",
    names: [
      "primary",
      "primary-foreground",
      "secondary",
      "secondary-foreground",
      "accent",
      "accent-foreground",
    ],
  },
  {
    id: "ui",
    title: "State & structure",
    description:
      "Muted content, destructive states, and the lines between things.",
    names: ["muted", "muted-foreground", "border", "input", "ring"],
  },
  {
    id: "selection",
    title: "Selection",
    description: "Applied by the base layer to `::selection`.",
    names: ["selection", "selection-foreground"],
  },
  {
    id: "code",
    title: "Code",
    description: "Code blocks, highlighted lines, and line numbers.",
    names: ["code", "code-foreground", "code-highlight", "code-number"],
  },
  {
    id: "charts",
    title: "Charts",
    description: "A five-step ramp of the brand hue for data visualisation.",
    names: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
  },
  {
    id: "status",
    title: "Status",
    description: "Status indicators for success, warning, and error.",
    names: [
      "destructive",
      "destructive-foreground",
      "warning",
      "warning-foreground",
      "success",
      "success-foreground",
      "info",
      "info-foreground",
    ],
  },
  {
    id: "shadow",
    title: "Shadow",
    description:
      "The tint every elevation is mixed from, plus the alpha ramp the shadow scale is built on.",
    names: ["shadow-color", "shadow-5", "shadow-10", "shadow-25"],
  },
  {
    id: "sidebar",
    title: "Sidebar",
    description:
      "The sidebar keeps its own surface so it can diverge from the page.",
    names: [
      "sidebar",
      "sidebar-foreground",
      "sidebar-primary",
      "sidebar-primary-foreground",
      "sidebar-accent",
      "sidebar-accent-foreground",
      "sidebar-border",
      "sidebar-ring",
    ],
  },
]

/** Tailwind's own steps, each already multiplied by `--text-scale`. */
const TEXT_SIZE_NAMES = [
  "text-xs",
  "text-sm",
  "text-base",
  "text-lg",
  "text-xl",
  "text-2xl",
  "text-3xl",
  "text-4xl",
  "text-5xl",
  "text-6xl",
  "text-7xl",
  "text-8xl",
  "text-9xl",
]

/** The elevation ramp built on top of the `--shadow-{n}` alpha steps. */
const SHADOW_NAMES = [
  "shadow-2xs",
  "shadow-xs",
  "shadow-sm",
  "shadow-md",
  "shadow-lg",
  "shadow-xl",
  "shadow-2xl",
]

const MOTION_NAMES = ["animate-shimmer-slide", "animate-spin-around"]

/** The two widths beyond Tailwind's defaults. */
const BREAKPOINT_NAMES = ["breakpoint-3xl", "breakpoint-4xl"]

/** Single-value knobs the rest of the system multiplies or filters through. */
const DIAL_NAMES = ["text-scale", "shadow-strength", "code-syntax-filter"]

const RADIUS_NAMES = [
  "radius",
  "radius-sm",
  "radius-md",
  "radius-lg",
  "radius-xl",
  "radius-2xl",
  "radius-3xl",
  "radius-4xl",
]

const SPACING_NAMES = [
  "spacing",
  "layout-gutter",
  "section-spacing",
  "hero-spacing",
  "grid-spacing",
  "density-card-spacing",
  "site-header-height",
]

const WEIGHT_NAMES = [
  "font-weight-normal",
  "font-weight-medium",
  "font-weight-semibold",
  "font-weight-bold",
]

const FONT_NAMES = ["font-sans", "font-mono", "font-heading"]

/**
 * Group ids and titles in page order, so a section that is not itself a list of
 * colour tokens can still file under the same headings.
 */
export const COLOR_GROUP_ORDER: readonly { id: string; title: string }[] =
  COLOR_GROUPS.map(({ id, title }) => ({ id, title }))

/**
 * The pairings worth measuring, filed under the colour group each belongs to.
 *
 * Status colours pair against `--background` rather than their own
 * `-foreground`: in this theme those are the 5% tints a badge sits on, not a
 * text colour, so pairing them with each other would measure a combination
 * nothing renders.
 */
export const CONTRAST_PAIRS: ContrastPair[] = [
  {
    label: "Page",
    background: "background",
    foreground: "foreground",
    group: "surfaces",
  },
  {
    label: "Card",
    background: "card",
    foreground: "card-foreground",
    group: "surfaces",
  },
  {
    label: "Popover",
    background: "popover",
    foreground: "popover-foreground",
    group: "surfaces",
  },
  {
    label: "Primary",
    background: "primary",
    foreground: "primary-foreground",
    group: "brand",
  },
  {
    label: "Secondary",
    background: "secondary",
    foreground: "secondary-foreground",
    group: "brand",
  },
  {
    label: "Accent",
    background: "accent",
    foreground: "accent-foreground",
    group: "brand",
  },
  {
    label: "Muted",
    background: "muted",
    foreground: "muted-foreground",
    group: "ui",
  },
  {
    label: "Selection",
    background: "selection",
    foreground: "selection-foreground",
    group: "selection",
  },
  {
    label: "Code",
    background: "code",
    foreground: "code-foreground",
    group: "code",
  },
  {
    label: "Destructive",
    background: "destructive",
    foreground: "background",
    group: "status",
  },
  {
    label: "Warning",
    background: "warning",
    foreground: "background",
    group: "status",
  },
  {
    label: "Success",
    background: "success",
    foreground: "background",
    group: "status",
  },
  {
    label: "Info",
    background: "info",
    foreground: "background",
    group: "status",
  },
  {
    label: "Sidebar",
    background: "sidebar",
    foreground: "sidebar-foreground",
    group: "sidebar",
  },
  {
    label: "Sidebar primary",
    background: "sidebar-primary",
    foreground: "sidebar-primary-foreground",
    group: "sidebar",
  },
  {
    label: "Sidebar accent",
    background: "sidebar-accent",
    foreground: "sidebar-accent-foreground",
    group: "sidebar",
  },
]

export type DesignTokenData = {
  colorGroups: TokenGroup[]
  radius: DesignToken[]
  spacing: DesignToken[]
  weights: DesignToken[]
  fonts: DesignToken[]
  textSizes: DesignToken[]
  shadows: DesignToken[]
  motion: DesignToken[]
  breakpoints: DesignToken[]
  /** Scalars and filters that tune the ramps above rather than being one. */
  dials: DesignToken[]
  /** The three controls typeset.css exposes on `.typeset`. */
  typeset: DesignToken[]
  /** Every token by name, so pairs and previews can look values up. */
  index: Record<string, DesignToken>
  /** The `:root` and `.dark` blocks verbatim, for the copy-theme action. */
  themeCss: string
  totals: { tokens: number; colors: number }
}

export function parseDesignTokens(
  css: string,
  typesetCss = ""
): DesignTokenData {
  const theme = ruleBody(css, /^@theme inline\s*\{/m)
  const root = ruleBody(css, /^:root\s*\{/m)
  const dark = ruleBody(css, /^\.dark\s*\{/m)
  const media = ruleBody(css, /^@media \(min-width: 48rem\)\s*\{/m)

  const themeDeclarations = theme ? customProperties(theme.body) : new Map()
  const rootDeclarations = root ? customProperties(root.body) : new Map()
  const darkDeclarations = dark ? customProperties(dark.body) : new Map()
  const mediaDeclarations = media
    ? customProperties(ruleBody(media.body, /:root\s*\{/)?.body ?? "")
    : new Map()

  // `:root` wins over `@theme inline` so `--radius-lg: var(--radius)` resolves
  // against the authored radius rather than looping back through the theme.
  const lightScope = new Map([...themeDeclarations, ...rootDeclarations])
  const darkScope = new Map([...lightScope, ...darkDeclarations])

  // `--color-*` are one-to-one Tailwind bridges for tokens already listed here.
  const names = [
    ...themeDeclarations.keys(),
    ...rootDeclarations.keys(),
  ].filter((name) => !name.startsWith("color-"))

  const index: Record<string, DesignToken> = {}
  for (const name of new Set(names)) {
    const lightRaw = lightScope.get(name)
    if (lightRaw === undefined) continue

    const darkRaw = darkDeclarations.get(name)
    const md = mediaDeclarations.get(name)

    index[name] = {
      name,
      light: toTokenValue(lightRaw, lightScope),
      dark: darkRaw
        ? toTokenValue(darkRaw, darkScope)
        : { ...toTokenValue(lightRaw, darkScope), inherited: true },
      ...(md ? { md } : {}),
    }
  }

  const pick = (list: string[]) =>
    list.flatMap((name) => (index[name] ? [index[name]] : []))

  const grouped = new Set(
    COLOR_GROUPS.flatMap((group) => group.names).concat(
      RADIUS_NAMES,
      SPACING_NAMES,
      WEIGHT_NAMES,
      FONT_NAMES,
      TEXT_SIZE_NAMES,
      SHADOW_NAMES,
      MOTION_NAMES,
      BREAKPOINT_NAMES,
      DIAL_NAMES
    )
  )

  const colorGroups: TokenGroup[] = COLOR_GROUPS.map(({ names, ...group }) => ({
    ...group,
    tokens: pick(names),
  })).filter((group) => group.tokens.length > 0)

  const leftovers = Object.keys(index).filter((name) => !grouped.has(name))
  if (leftovers.length > 0) {
    colorGroups.push({
      id: "uncategorized",
      title: "Uncategorized",
      description:
        "Defined in globals.css but not yet claimed by a group on this page.",
      tokens: pick(leftovers),
    })
  }

  // `.typeset` declares its own controls, so they are read from typeset.css rather
  // than the theme — the defaults there are the documented values.
  const typesetDeclarations = customProperties(
    ruleBody(typesetCss, /\.typeset\s*\{/)?.body ?? ""
  )
  const typeset: DesignToken[] = [...typesetDeclarations].map(
    ([name, raw]) => ({
      name,
      light: { raw, resolved: raw, alias: null },
      dark: { raw, resolved: raw, alias: null, inherited: true },
    })
  )

  return {
    colorGroups,
    radius: pick(RADIUS_NAMES),
    spacing: pick(SPACING_NAMES),
    weights: pick(WEIGHT_NAMES),
    fonts: pick(FONT_NAMES),
    textSizes: pick(TEXT_SIZE_NAMES),
    shadows: pick(SHADOW_NAMES),
    motion: pick(MOTION_NAMES),
    breakpoints: pick(BREAKPOINT_NAMES),
    dials: pick(DIAL_NAMES),
    typeset,
    index,
    themeCss: [
      root ? `:root {${root.body}}` : "",
      dark ? `.dark {${dark.body}}` : "",
    ]
      .filter(Boolean)
      .join("\n\n"),
    totals: {
      tokens: Object.keys(index).length,
      colors: colorGroups.reduce((sum, group) => sum + group.tokens.length, 0),
    },
  }
}
