"use client"

import type { DesignToken } from "@/lib/design-tokens"
import { cn } from "@/lib/utils"

import { useMeasuredLengths } from "./measure"

function lengthMap(tokens: DesignToken[], pick: (token: DesignToken) => string | null) {
  return Object.fromEntries(tokens.map((token) => [token.name, pick(token)]))
}

export function RadiusBlock({ tokens }: { tokens: DesignToken[] }) {
  const lengths = useMeasuredLengths(lengthMap(tokens, (token) => token.light.resolved))

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {tokens.map((token) => (
        <div key={token.name} className="space-y-2">
          {/* Tall enough that even --radius-4xl reads as a corner rather than a pill. */}
          <div
            className="h-28 w-full border-2 border-primary/30 bg-primary/8"
            style={{ borderRadius: token.light.resolved ?? undefined }}
          />
          <div className="space-y-0.5">
            <div className="flex items-baseline justify-between gap-2">
              <code className="truncate font-mono text-xs">--{token.name}</code>
              <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
                {lengths[token.name] ? `${lengths[token.name]}px` : "—"}
              </span>
            </div>
            <code
              className="block truncate font-mono text-[11px] text-muted-foreground/60"
              title={token.light.raw}
            >
              {token.light.raw}
            </code>
          </div>
        </div>
      ))}
    </div>
  )
}

export function SpacingBlock({ tokens }: { tokens: DesignToken[] }) {
  const base = useMeasuredLengths(lengthMap(tokens, (token) => token.light.resolved))
  // Tokens without an `md` override keep their base value at every width.
  const wide = useMeasuredLengths(
    lengthMap(tokens, (token) => token.md ?? token.light.resolved)
  )
  const widest = Math.max(1, ...Object.values(wide))

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      {tokens.map((token, position) => {
        const from = base[token.name] ?? 0
        const to = wide[token.name] ?? from
        const grows = to > from

        return (
          <div
            key={token.name}
            className={cn(
              "flex items-center gap-4 px-4 py-2.5",
              position > 0 && "border-t"
            )}
          >
            <code className="w-48 shrink-0 truncate font-mono text-xs">
              --{token.name}
            </code>

            <div className="min-w-0 flex-1">
              <div
                className="flex h-2.5 overflow-hidden rounded-sm"
                style={{ width: `${(to / widest) * 100}%` }}
              >
                <div
                  className="bg-primary/70"
                  style={{ width: `${to > 0 ? (from / to) * 100 : 100}%` }}
                />
                {grows && <div className="flex-1 bg-primary/25" />}
              </div>
            </div>

            <span className="w-36 shrink-0 text-end font-mono text-xs tabular-nums">
              {from ? `${from}px` : "—"}
              {grows && (
                <span className="text-muted-foreground"> → {to}px @ md</span>
              )}
            </span>
          </div>
        )
      })}
    </div>
  )
}
