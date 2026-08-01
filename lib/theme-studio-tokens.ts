/**
 * Reshapes the parsed stylesheet into the flat, serializable payload the studio
 * panel needs. Pure, so the types travel to the client without dragging the
 * `node:fs` read along with them.
 */

import type { DesignTokenData, DesignToken } from "./design-tokens"

export type StudioColorToken = {
  name: string
  label: string
  /** Value as it resolves in light mode, with every `var()` substituted. */
  light: string
  /** Same for dark; equal to `light` when the token is inherited. */
  dark: string
  /** True when `.dark` never redeclares it, so a `:root` edit reaches both modes. */
  inherited: boolean
}

export type StudioColorGroup = {
  id: string
  title: string
  tokens: StudioColorToken[]
}

export type StudioNumberToken = {
  name: string
  label: string
  value: number
  /** Appended when the override is written back, e.g. `rem`. */
  unit: string
}

export type ThemeStudioData = {
  groups: StudioColorGroup[]
  radius: StudioNumberToken | null
  spacing: StudioNumberToken | null
  textScale: StudioNumberToken | null
  weights: StudioNumberToken[]
  shadow: {
    color: StudioColorToken | null
    strength: StudioNumberToken | null
  }
}

/**
 * Tokens the panel gives a row of their own, so they are not also dealt out
 * into the colour groups further down.
 */
const CLAIMED = new Set(["shadow-color"])

/**
 * `@theme inline` holds more than colors — breakpoints and animation shorthands
 * land in the same bucket — and a color wheel has nothing to offer them.
 */
const COLOR_VALUE = /^(#|oklch\(|oklab\(|rgba?\(|hsla?\(|lab\(|lch\(|color\()/i

const TITLES: Record<string, string> = {
  uncategorized: "Other",
}

function humanize(name: string) {
  const words = name.replace(/-/g, " ")
  return words.charAt(0).toUpperCase() + words.slice(1)
}

function valueOf(token: DesignToken, mode: "light" | "dark") {
  const value = token[mode]
  return (value.resolved ?? value.raw).trim()
}

function toColorToken(token: DesignToken): StudioColorToken | null {
  const light = valueOf(token, "light")
  if (!COLOR_VALUE.test(light)) return null

  return {
    name: token.name,
    label: humanize(token.name),
    light,
    dark: valueOf(token, "dark"),
    inherited: token.dark.inherited === true,
  }
}

/** The leading number of a value like `0.875rem`, plus whatever trails it. */
function toNumberToken(
  token: DesignToken | undefined,
  label: string
): StudioNumberToken | null {
  if (!token) return null
  const match = /^(-?[\d.]+)([a-z%]*)$/i.exec(valueOf(token, "light"))
  if (!match) return null

  const value = Number(match[1])
  if (!Number.isFinite(value)) return null

  return { name: token.name, label, value, unit: match[2] }
}

const WEIGHT_LABELS: [name: string, label: string][] = [
  ["font-weight-normal", "Normal"],
  ["font-weight-medium", "Medium"],
  ["font-weight-semibold", "Semibold"],
  ["font-weight-bold", "Bold"],
]

export function toThemeStudioData(tokens: DesignTokenData): ThemeStudioData {
  const groups = tokens.colorGroups
    .map((group) => ({
      id: group.id,
      title: TITLES[group.id] ?? group.title,
      tokens: group.tokens.flatMap((token) => {
        if (CLAIMED.has(token.name)) return []
        const color = toColorToken(token)
        return color ? [color] : []
      }),
    }))
    .filter((group) => group.tokens.length > 0)

  const shadowColor = tokens.index["shadow-color"]

  return {
    groups,
    radius: toNumberToken(tokens.index["radius"], "Radius"),
    spacing: toNumberToken(tokens.index["spacing"], "Spacing"),
    textScale: toNumberToken(tokens.index["text-scale"], "Text scale"),
    weights: WEIGHT_LABELS.flatMap(([name, label]) => {
      const weight = toNumberToken(tokens.index[name], label)
      return weight ? [weight] : []
    }),
    shadow: {
      color: shadowColor ? toColorToken(shadowColor) : null,
      strength: toNumberToken(tokens.index["shadow-strength"], "Strength"),
    },
  }
}
