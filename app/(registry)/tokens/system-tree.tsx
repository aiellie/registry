"use client"

import { SlidersHorizontalIcon } from "@hugeicons/core-free-icons"

import { countTokens, type DesignToken } from "@/lib/design-tokens"

import { humanize } from "./color-values"
import {
  plural,
  TreeCard,
  TreeGroup,
  TREE_ROW,
  TreeRowLabel,
  useTreeState,
} from "./tree"

function ValueRow({ token }: { token: DesignToken }) {
  return (
    <div className={TREE_ROW}>
      <TreeRowLabel name={humanize(token.name)} token={token.name} />

      <code
        className="ms-auto max-w-1/2 truncate font-mono text-xs text-muted-foreground"
        title={token.light.raw}
      >
        {token.light.raw}
      </code>
    </div>
  )
}

/**
 * The tokens that are neither a colour nor a measurable length: animation
 * shorthands, the two extra widths, and the scalars the ramps are tuned with.
 * There is nothing to preview, so the authored value is the whole story.
 */
export function SystemTree({
  motion,
  breakpoints,
  dials,
  /** Open by default when a search has already narrowed the tree. */
  expanded = false,
}: {
  motion: DesignToken[]
  breakpoints: DesignToken[]
  dials: DesignToken[]
  expanded?: boolean
}) {
  const tree = useTreeState(expanded)
  const total = motion.length + breakpoints.length + dials.length

  return (
    <TreeCard
      icon={SlidersHorizontalIcon}
      title="System"
      subtitle={`${plural(total, "token")} — motion, breakpoints, and the dials the ramps are tuned with`}
      open={tree.open}
      onOpenChange={tree.setOpen}
    >
      {motion.length > 0 && (
        <TreeGroup
          title="Motion"
          // Duration comes from a `--speed` the element sets, so these
          // deliberately do not resolve here and are not counted as broken.
          count={motion.length}
          open={tree.isGroupOpen("motion")}
          onOpenChange={(next) => tree.setGroupOpen("motion", next)}
        >
          {motion.map((token) => (
            <ValueRow key={token.name} token={token} />
          ))}
          <p className="border-t bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
            Each pairs with a <code className="font-mono">@keyframes</code>{" "}
            block in globals.css. Duration comes from a{" "}
            <code className="font-mono">--speed</code> the element sets, so
            these only resolve at the point of use.
          </p>
        </TreeGroup>
      )}

      {breakpoints.length > 0 && (
        <TreeGroup
          title="Breakpoints"
          {...countTokens(breakpoints)}
          open={tree.isGroupOpen("breakpoints")}
          onOpenChange={(next) => tree.setGroupOpen("breakpoints", next)}
        >
          {breakpoints.map((token) => (
            <ValueRow key={token.name} token={token} />
          ))}
        </TreeGroup>
      )}

      {dials.length > 0 && (
        <TreeGroup
          title="Dials"
          {...countTokens(dials)}
          open={tree.isGroupOpen("dials")}
          onOpenChange={(next) => tree.setGroupOpen("dials", next)}
        >
          {dials.map((token) => (
            <ValueRow key={token.name} token={token} />
          ))}
          <p className="border-t bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
            Single values the ramps above are tuned with rather than scales of
            their own — change one and everything derived from it follows.
          </p>
        </TreeGroup>
      )}
    </TreeCard>
  )
}
