"use client"

import { TextFontIcon } from "@hugeicons/core-free-icons"

import { countTokens, type DesignToken } from "@/lib/design-tokens"
import { cn } from "@/lib/utils"

import { humanize } from "./color-values"
import { useMeasuredLengths, useResolvedFonts } from "./measure"
import {
  plural,
  TreeCard,
  TreeGroup,
  TREE_ROW,
  TreeRowLabel,
  useTreeState,
} from "./tree"

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

/** The same chip the contrast samples use, so previews line up across cards. */
const CHIP =
  "flex h-9 min-w-16 shrink-0 items-center justify-center rounded-lg border bg-card px-2"

function lengthMap(tokens: DesignToken[]) {
  return Object.fromEntries(
    tokens.map((token) => [token.name, token.light.resolved])
  )
}

/**
 * The two families, the weight ramp, and the size steps — everything that
 * decides how text reads, under one card.
 */
export function TypographyTree({
  families,
  weights,
  textSizes,
  /** Open by default when a search has already narrowed the tree. */
  expanded = false,
}: {
  families: string[]
  weights: DesignToken[]
  textSizes: DesignToken[]
  expanded?: boolean
}) {
  const tree = useTreeState(expanded)
  const shown = FAMILIES.filter((family) => families.includes(family.token))
  const stacks = useResolvedFonts(shown.map((family) => family.className))
  const sizes = useMeasuredLengths(lengthMap(textSizes))

  // Every weight above `normal` is authored at the same value, so the ramp is
  // deliberately flat — surfacing that is more useful than hiding it.
  const values = weights.map(
    (weight) => weight.light.resolved ?? weight.light.raw
  )
  const flat = new Set(values.slice(1)).size === 1 && values.length > 1

  const total = shown.length + weights.length + textSizes.length

  return (
    <TreeCard
      icon={TextFontIcon}
      title="Typography"
      subtitle={`${plural(total, "token")} — the families, the weight ramp, and the size scale`}
      open={tree.open}
      onOpenChange={tree.setOpen}
    >
      {shown.length > 0 && (
        <TreeGroup
          title="Families"
          count={shown.length}
          open={tree.isGroupOpen("families")}
          onOpenChange={(next) => tree.setGroupOpen("families", next)}
        >
          {shown.map((family) => (
            <div key={family.token} className={TREE_ROW}>
              <TreeRowLabel name={family.label} token={family.token} />

              {/* The pangram earns the middle of the row: it is the only thing
                  here that shows what the family actually looks like set. */}
              <span
                className={cn(
                  "hidden min-w-0 flex-1 truncate text-sm md:inline",
                  family.className
                )}
                title={family.usage}
              >
                {PANGRAM}
              </span>

              <div className="ms-auto flex min-w-0 items-center gap-3">
                <code className="hidden truncate font-mono text-[11px] text-muted-foreground/70 lg:inline">
                  {stacks[family.className] ?? " "}
                </code>
                <div className={cn(CHIP, family.className)}>
                  <span className="text-lg leading-none">Ag</span>
                </div>
              </div>
            </div>
          ))}
        </TreeGroup>
      )}

      {weights.length > 0 && (
        <TreeGroup
          title="Weights"
          {...countTokens(weights)}
          open={tree.isGroupOpen("weights")}
          onOpenChange={(next) => tree.setGroupOpen("weights", next)}
        >
          {weights.map((weight) => (
            <div key={weight.name} className={TREE_ROW}>
              <TreeRowLabel
                name={humanize(weight.name.replace("font-weight-", ""))}
                token={weight.name}
              />

              <div className="ms-auto flex items-center gap-3">
                <div
                  className={CHIP}
                  style={{ fontWeight: weight.light.resolved ?? undefined }}
                >
                  <span className="text-sm leading-none">Ag</span>
                </div>
                <span className="w-10 shrink-0 text-end font-mono text-xs tabular-nums">
                  {weight.light.resolved ?? weight.light.raw}
                </span>
              </div>
            </div>
          ))}

          {flat && (
            <p className="border-t bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
              Medium, semibold, and bold all resolve to the same weight — the
              system leans on colour and size for hierarchy instead.
            </p>
          )}
        </TreeGroup>
      )}

      {textSizes.length > 0 && (
        <TreeGroup
          title="Type scale"
          {...countTokens(textSizes)}
          open={tree.isGroupOpen("sizes")}
          onOpenChange={(next) => tree.setGroupOpen("sizes", next)}
        >
          {textSizes.map((token) => (
            <div key={token.name} className={TREE_ROW}>
              <TreeRowLabel
                name={humanize(token.name.replace("text-", ""))}
                token={token.name}
              />

              <div className="ms-auto flex items-center gap-3">
                {/* The authored value, not `var(--text-xs)` — `@theme inline`
                    folds its steps into the utilities instead of emitting them
                    as properties. `--text-scale` is a real `:root` token, so the
                    preview still follows it. */}
                <span
                  className="truncate leading-none font-medium"
                  style={{ fontSize: token.light.raw }}
                >
                  Ag
                </span>
                <span className="w-12 shrink-0 text-end font-mono text-xs text-muted-foreground tabular-nums">
                  {sizes[token.name] ? `${sizes[token.name]}px` : "—"}
                </span>
              </div>
            </div>
          ))}
        </TreeGroup>
      )}
    </TreeCard>
  )
}
