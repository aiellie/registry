"use client"

import { useEffect, useState } from "react"
import { PaintBoardIcon } from "@hugeicons/core-free-icons"

import { ColorPicker } from "@/components/design/color-picker"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { countTokens, type TokenGroup } from "@/lib/design-tokens"

import { humanize, type ResolvedPair, type ValueFormat } from "./color-values"
import {
  plural,
  TreeCard,
  TreeGroup,
  TREE_ROW,
  useThemeMode,
  useTreeState,
} from "./tree"

/**
 * Every colour in the system as one card: groups collapse into rows, and each
 * row opens onto its tokens with a picker on the end.
 *
 * Picking a colour writes the token straight onto `<html>`, so the whole page —
 * and the rest of the app behind it — repaints. Nothing is persisted: the edits
 * are a preview of a theme change, and Reset (or a reload) puts them back.
 */
export function ColorTree({
  groups,
  resolved,
  format,
  /** Open by default when a search has already narrowed the tree. */
  expanded = false,
}: {
  groups: TokenGroup[]
  resolved: Record<string, ResolvedPair>
  /** Notation the pickers read in, driven by the page's oklch/hex toggle. */
  format: ValueFormat
  expanded?: boolean
}) {
  const mode = useThemeMode()
  const tree = useTreeState(expanded)

  // Kept per mode: an override typed against the dark theme has no business
  // following you back into the light one.
  const [edits, setEdits] = useState<{
    light: Record<string, string>
    dark: Record<string, string>
  }>({ light: {}, dark: {} })

  const active = edits[mode]

  useEffect(() => {
    const root = document.documentElement
    for (const [name, hex] of Object.entries(active)) {
      root.style.setProperty(`--${name}`, hex)
    }
    return () => {
      for (const name of Object.keys(active)) {
        root.style.removeProperty(`--${name}`)
      }
    }
  }, [active])

  const total = groups.reduce((sum, group) => sum + group.tokens.length, 0)
  const edited = Object.keys(active).length

  return (
    <TreeCard
      icon={PaintBoardIcon}
      title="Colors"
      subtitle={
        <>
          {plural(total, "token")} across {plural(groups.length, "group")}
          {edited > 0 && ` · ${edited} edited`}
        </>
      }
      action={
        edited > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEdits((prev) => ({ ...prev, [mode]: {} }))}
          >
            Reset
          </Button>
        )
      }
      open={tree.open}
      onOpenChange={tree.setOpen}
    >
      {groups.map((group) => (
        <TreeGroup
          key={group.id}
          title={group.title}
          {...countTokens(group.tokens)}
          open={tree.isGroupOpen(group.id)}
          onOpenChange={(next) => tree.setGroupOpen(group.id, next)}
        >
          {group.tokens.map((token) => {
            const hex = resolved[token.name]?.[mode]?.hex
            const value = active[token.name] ?? hex

            return (
              <div key={token.name} className={TREE_ROW}>
                <span className="truncate text-sm">{humanize(token.name)}</span>
                <code className="truncate font-mono text-xs text-muted-foreground/70">
                  --{token.name}
                </code>

                {value ? (
                  <ColorPicker
                    // The picker holds its own notation once mounted, so
                    // flipping the page toggle has to remount it.
                    key={format}
                    defaultFormat={format === "hex" ? "hex" : "oklch"}
                    label={humanize(token.name)}
                    value={value}
                    onValueChange={(next) =>
                      setEdits((prev) => ({
                        ...prev,
                        [mode]: { ...prev[mode], [token.name]: next },
                      }))
                    }
                    className="ms-auto"
                  />
                ) : (
                  <Badge className="ms-auto bg-(--destructive-foreground) text-destructive">
                    undefined
                  </Badge>
                )}
              </div>
            )
          })}
        </TreeGroup>
      ))}
    </TreeCard>
  )
}
