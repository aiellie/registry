"use client"

import { ContrastIcon } from "@hugeicons/core-free-icons"

import { Badge } from "@/components/ui/badge"
import {
  COLOR_GROUP_ORDER,
  type ContrastPair,
  type DesignToken,
} from "@/lib/design-tokens"
import { cn } from "@/lib/utils"

import type { ResolvedPair } from "./color-values"
import { ContrastSample, measurePair, type Scheme } from "./contrast-sample"
import {
  plural,
  TreeCard,
  TreeGroup,
  TREE_ROW,
  useThemeMode,
  useTreeState,
} from "./tree"

/**
 * Every foreground/background pairing in the system, filed under the same groups
 * as the colours themselves.
 *
 * Only the theme in force is measured — the other one is a mode toggle away, and
 * showing both halved the room each sample had. Every pairing is drawn twice:
 * as authored, and inverted. The ratio is the same either way (WCAG's formula
 * sorts the two luminances), so it is reported once for the pair.
 */
export function ContrastTree({
  pairs,
  index,
  resolved,
  /** Open by default when a search has already narrowed the tree. */
  expanded = false,
}: {
  pairs: ContrastPair[]
  index: Record<string, DesignToken>
  resolved: Record<string, ResolvedPair>
  expanded?: boolean
}) {
  const mode: Scheme = useThemeMode()
  const tree = useTreeState(expanded)

  const groups = COLOR_GROUP_ORDER.map((group) => ({
    ...group,
    pairs: pairs.filter((pair) => pair.group === group.id),
  })).filter((group) => group.pairs.length > 0)

  return (
    <TreeCard
      icon={ContrastIcon}
      title="Contrast"
      subtitle={`${plural(pairs.length, "pairing")} measured against WCAG 2.1, in ${mode} mode`}
      open={tree.open}
      onOpenChange={tree.setOpen}
    >
      {groups.map((group) => {
        const measured = group.pairs.map((pair) => ({
          pair,
          ...measurePair(pair, index, resolved, mode),
        }))
        // A pairing that cannot resolve counts as failing too — nothing renders,
        // so it certainly is not passing — which is why the badge says "failing"
        // rather than "below AA".
        const failing = measured.filter((entry) => !entry.grade?.pass).length

        return (
          <TreeGroup
            key={group.id}
            title={group.title}
            count={measured.length - failing}
            broken={failing}
            brokenLabel="failing"
            open={tree.isGroupOpen(group.id)}
            onOpenChange={(next) => tree.setGroupOpen(group.id, next)}
          >
            {measured.map(({ pair, ratio, grade, background, foreground }) => (
              <div key={pair.label} className={TREE_ROW}>
                <span className="truncate text-sm">{pair.label}</span>
                <code className="truncate font-mono text-xs text-muted-foreground/70">
                  --{pair.foreground} on --{pair.background}
                </code>

                <div className="ms-auto flex items-center gap-2">
                  <ContrastSample
                    background={background}
                    foreground={foreground}
                    label={`--${pair.foreground} on --${pair.background}`}
                  />
                  <ContrastSample
                    background={foreground}
                    foreground={background}
                    label={`--${pair.background} on --${pair.foreground}`}
                  />

                  <span className="w-16 shrink-0 text-end font-mono text-xs text-muted-foreground tabular-nums">
                    {ratio === null ? "—" : `${ratio.toFixed(2)}:1`}
                  </span>

                  {grade ? (
                    <Badge
                      className={cn(
                        "w-20 justify-center font-mono",
                        grade.pass
                          ? "bg-(--success-foreground) text-success"
                          : "bg-(--destructive-foreground) text-destructive"
                      )}
                    >
                      {grade.label}
                    </Badge>
                  ) : (
                    <Badge className="w-20 justify-center bg-(--destructive-foreground) text-destructive">
                      undefined
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </TreeGroup>
        )
      })}
    </TreeCard>
  )
}
