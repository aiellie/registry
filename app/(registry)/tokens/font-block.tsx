"use client"

import type { DesignToken } from "@/lib/design-tokens"
import { cn } from "@/lib/utils"

import { useResolvedFonts } from "./measure"

const PANGRAM = "The quick brown fox jumps over the lazy dog"

const FAMILIES = [
  {
    token: "font-sans",
    label: "Sans",
    className: "font-sans",
    usage: "Body copy, headings, and every UI control.",
  },
  {
    token: "font-mono",
    label: "Mono",
    className: "font-mono",
    usage: "Code blocks, token values, and keyboard hints.",
  },
]

export const FONT_FAMILY_TOKENS = FAMILIES.map((family) => family.token)

export function FontBlock({ names }: { names: string[] }) {
  const shown = FAMILIES.filter((family) => names.includes(family.token))
  const fonts = useResolvedFonts(shown.map((family) => family.className))

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {shown.map((family) => (
        <div key={family.token} className="rounded-xl border bg-card p-4">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-sm font-medium">{family.label}</span>
            <code className="font-mono text-xs text-muted-foreground">
              --{family.token}
            </code>
          </div>

          <div
            className={cn(
              "mt-3 truncate text-5xl leading-tight tracking-tight",
              family.className
            )}
          >
            Ag
          </div>

          <p className={cn("mt-2 truncate text-sm", family.className)}>{PANGRAM}</p>
          <p className={cn("truncate text-sm text-muted-foreground", family.className)}>
            0123456789 &amp;@#$%
          </p>

          <p className="mt-3 truncate font-mono text-[11px] text-muted-foreground">
            {fonts[family.className] ?? " "}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{family.usage}</p>
        </div>
      ))}
    </div>
  )
}

export function WeightBlock({ weights }: { weights: DesignToken[] }) {
  // Every weight above `normal` is authored at 450, so the ramp is deliberately
  // flat — surfacing that is more useful than hiding it.
  const values = weights.map((weight) => weight.light.resolved ?? weight.light.raw)
  const flat = new Set(values.slice(1)).size === 1 && values.length > 1

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      {weights.map((weight, position) => (
        <div
          key={weight.name}
          className={cn(
            "flex items-center gap-3 px-4 py-2.5",
            position > 0 && "border-t"
          )}
        >
          <code className="w-44 shrink-0 truncate font-mono text-xs text-muted-foreground">
            --{weight.name}
          </code>
          <span
            className="min-w-0 flex-1 truncate text-sm"
            style={{ fontWeight: weight.light.resolved ?? undefined }}
          >
            {PANGRAM}
          </span>
          <span className="shrink-0 font-mono text-xs tabular-nums">
            {weight.light.resolved ?? weight.light.raw}
          </span>
        </div>
      ))}

      {flat && (
        <p className="border-t bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
          Medium, semibold, and bold all resolve to the same weight — the system
          leans on colour and size for hierarchy instead.
        </p>
      )}
    </div>
  )
}
