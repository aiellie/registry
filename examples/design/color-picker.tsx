"use client"

import * as React from "react"

import { ColorPicker, type ColorFormat } from "@/components/design/color-picker"

type TokenId = "surface" | "text" | "accent" | "wash"

/** Each field opens in a different notation so the popover's select has something to switch between. */
const TOKENS: {
  id: TokenId
  label: string
  format: ColorFormat
  opacity?: boolean
}[] = [
  { id: "surface", label: "Surface", format: "hex" },
  { id: "text", label: "Text", format: "oklch" },
  { id: "accent", label: "Accent", format: "hsl" },
  // The one token that has to be see-through, so the one that gets the arc.
  { id: "wash", label: "Wash", format: "rgb", opacity: true },
]

const INITIAL: Record<TokenId, string> = {
  surface: "#eef2ff",
  text: "#1e1b4b",
  accent: "#4f46e5",
  wash: "#4f46e526",
}

/**
 * The picker's real job is editing design tokens, so the four fields drive
 * the card sitting under them — including the button's label, which reuses the
 * surface color rather than picking a fifth value out of the air.
 */
export function ColorPickerDemo() {
  const [tokens, setTokens] = React.useState(INITIAL)

  return (
    <div className="flex w-full max-w-sm flex-col gap-4 py-6">
      <div className="flex flex-col gap-0.5 rounded-xl border p-1.5">
        {TOKENS.map((token) => (
          <div
            className="flex h-9 items-center justify-between gap-3 rounded-lg px-2.5 transition-colors hover:bg-muted/60"
            key={token.id}
          >
            <span className="text-sm font-medium">{token.label}</span>
            <ColorPicker
              defaultFormat={token.format}
              label={token.label}
              onValueChange={(value) =>
                setTokens((prev) => ({ ...prev, [token.id]: value }))
              }
              opacity={token.opacity}
              value={tokens[token.id]}
            />
          </div>
        ))}
      </div>

      <div
        className="flex flex-col items-start gap-3 rounded-xl p-5"
        style={{ backgroundColor: tokens.surface, color: tokens.text }}
      >
        <p className="text-sm leading-relaxed">
          A color token is a promise that every surface using it changes
          together the next time the brand does.
        </p>
        <button
          className="rounded-lg px-3 py-1.5 text-sm font-medium"
          style={{ backgroundColor: tokens.accent, color: tokens.surface }}
          type="button"
        >
          Ship it
        </button>
        {/* A translucent wash only means anything over something, so it takes
         * its cue from the surface it is laid on rather than replacing it. */}
        <span
          className="rounded-md px-2 py-1 text-xs font-medium"
          style={{ backgroundColor: tokens.wash }}
        >
          Wash over surface
        </span>
      </div>

      <p className="text-sm text-muted-foreground">
        Hue and saturation live on the disc, brightness on the arc below it and
        opacity on the arc outside that — or type a value in any of the four
        notations.
      </p>
    </div>
  )
}
