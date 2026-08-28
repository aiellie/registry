"use client"

import { RulerIcon } from "@hugeicons/core-free-icons"

import { countTokens, type DesignToken } from "@/lib/design-tokens"

import { humanize } from "./color-values"
import { useMeasuredLengths } from "./measure"
import {
  plural,
  TreeCard,
  TreeGroup,
  TREE_ROW,
  TreeRowLabel,
  useTreeState,
} from "./tree"

function lengthMap(
  tokens: DesignToken[],
  pick: (token: DesignToken) => string | null
) {
  return Object.fromEntries(tokens.map((token) => [token.name, pick(token)]))
}

/**
 * The three ramps the layout is built from: corner radius, spacing, and
 * elevation. Each row previews its own step at the size it actually renders.
 */
export function ScaleTree({
  radius,
  spacing,
  shadows,
  /** Open by default when a search has already narrowed the tree. */
  expanded = false,
}: {
  radius: DesignToken[]
  spacing: DesignToken[]
  shadows: DesignToken[]
  expanded?: boolean
}) {
  const tree = useTreeState(expanded)

  const radiusPx = useMeasuredLengths(
    lengthMap(radius, (token) => token.light.resolved)
  )
  const spacingPx = useMeasuredLengths(
    lengthMap(spacing, (token) => token.light.resolved)
  )
  // Tokens without an `md` override keep their base value at every width.
  const spacingWidePx = useMeasuredLengths(
    lengthMap(spacing, (token) => token.md ?? token.light.resolved)
  )
  const widest = Math.max(1, ...Object.values(spacingWidePx))

  const total = radius.length + spacing.length + shadows.length

  return (
    <TreeCard
      icon={RulerIcon}
      title="Scales"
      subtitle={`${plural(total, "token")} across the radius, spacing, and elevation ramps`}
      open={tree.open}
      onOpenChange={tree.setOpen}
    >
      {radius.length > 0 && (
        <TreeGroup
          title="Radius"
          {...countTokens(radius)}
          open={tree.isGroupOpen("radius")}
          onOpenChange={(next) => tree.setGroupOpen("radius", next)}
        >
          {radius.map((token) => (
            <div key={token.name} className={TREE_ROW}>
              <TreeRowLabel
                name={humanize(token.name.replace(/^radius-?/, "") || "Base")}
                token={token.name}
              />

              <div className="ms-auto flex items-center gap-3">
                <code className="hidden truncate font-mono text-[11px] text-muted-foreground/70 sm:inline">
                  {token.light.raw}
                </code>
                {/* Only the top-left corner is drawn square-on, so even
                    --radius-4xl reads as a corner rather than a pill. */}
                <div
                  className="size-9 shrink-0 border-2 border-primary/30 bg-primary/8"
                  style={{ borderRadius: token.light.resolved ?? undefined }}
                />
                <span className="w-12 shrink-0 text-end font-mono text-xs text-muted-foreground tabular-nums">
                  {radiusPx[token.name] ? `${radiusPx[token.name]}px` : "—"}
                </span>
              </div>
            </div>
          ))}
        </TreeGroup>
      )}

      {spacing.length > 0 && (
        <TreeGroup
          title="Layout rhythm"
          {...countTokens(spacing)}
          open={tree.isGroupOpen("spacing")}
          onOpenChange={(next) => tree.setGroupOpen("spacing", next)}
        >
          {spacing.map((token) => {
            const from = spacingPx[token.name] ?? 0
            const to = spacingWidePx[token.name] ?? from
            const grows = to > from

            return (
              <div key={token.name} className={TREE_ROW}>
                <TreeRowLabel name={humanize(token.name)} token={token.name} />

                <div className="ms-auto flex w-1/2 max-w-64 items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div
                      className="flex h-2.5 overflow-hidden rounded-sm"
                      style={{ width: `${(to / widest) * 100}%` }}
                    >
                      <div
                        className="bg-primary/70"
                        style={{
                          width: `${to > 0 ? (from / to) * 100 : 100}%`,
                        }}
                      />
                      {grows && <div className="flex-1 bg-primary/25" />}
                    </div>
                  </div>

                  <span className="shrink-0 text-end font-mono text-xs text-muted-foreground tabular-nums">
                    {from ? `${from}px` : "—"}
                    {grows && <span> → {to}px @ md</span>}
                  </span>
                </div>
              </div>
            )
          })}
        </TreeGroup>
      )}

      {shadows.length > 0 && (
        <TreeGroup
          title="Elevation"
          {...countTokens(shadows)}
          open={tree.isGroupOpen("shadows")}
          onOpenChange={(next) => tree.setGroupOpen("shadows", next)}
        >
          {shadows.map((token) => (
            <div key={token.name} className={TREE_ROW}>
              <TreeRowLabel
                name={humanize(token.name.replace("shadow-", ""))}
                token={token.name}
              />

              <div className="ms-auto flex items-center gap-3">
                <code
                  className="hidden max-w-72 truncate font-mono text-[11px] text-muted-foreground/70 lg:inline"
                  title={token.light.raw}
                >
                  {token.light.raw}
                </code>
                {/* Same as the type scale: the step itself is inlined by
                    `@theme`, but the `--shadow-{n}` alphas it is built from are
                    real tokens, so the raw value keeps following the tint. */}
                <div
                  className="h-9 w-16 shrink-0 rounded-lg bg-card"
                  style={{ boxShadow: token.light.raw }}
                />
              </div>
            </div>
          ))}
        </TreeGroup>
      )}
    </TreeCard>
  )
}
