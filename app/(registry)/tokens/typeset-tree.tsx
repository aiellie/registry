"use client"

import { ParagraphIcon } from "@hugeicons/core-free-icons"

import { countTokens, type DesignToken } from "@/lib/design-tokens"

import { humanize } from "./color-values"
import { TypesetBlock } from "./typeset-specimen"
import {
  plural,
  TreeCard,
  TreeGroup,
  TREE_ROW,
  TreeRowLabel,
  useTreeState,
} from "./tree"

/**
 * One stylesheet for HTML you did not write: add `typeset` to a container and
 * rendered markdown picks up the system, with no per-element classes. The three
 * controls it exposes sit above the specimen that demonstrates them.
 */
export function TypesetTree({
  controls,
  /** Open by default when a search has already narrowed the tree. */
  expanded = false,
}: {
  controls: DesignToken[]
  expanded?: boolean
}) {
  const tree = useTreeState(expanded)

  return (
    <TreeCard
      icon={ParagraphIcon}
      title="Typeset"
      subtitle={`${plural(controls.length, "control")} over every tag a markdown renderer emits`}
      open={tree.open}
      onOpenChange={tree.setOpen}
    >
      {controls.length > 0 && (
        <TreeGroup
          title="Controls"
          {...countTokens(controls)}
          open={tree.isGroupOpen("controls")}
          onOpenChange={(next) => tree.setGroupOpen("controls", next)}
        >
          {controls.map((token) => (
            <div key={token.name} className={TREE_ROW}>
              <TreeRowLabel
                name={humanize(token.name.replace("typeset-", ""))}
                token={token.name}
              />
              <code className="ms-auto font-mono text-xs text-muted-foreground tabular-nums">
                {token.light.raw}
              </code>
            </div>
          ))}
        </TreeGroup>
      )}

      <TreeGroup
        title="Specimen"
        open={tree.isGroupOpen("specimen")}
        onOpenChange={(next) => tree.setGroupOpen("specimen", next)}
      >
        <div className="border-t bg-muted/20 p-4">
          <TypesetBlock />
        </div>
      </TreeGroup>
    </TreeCard>
  )
}
