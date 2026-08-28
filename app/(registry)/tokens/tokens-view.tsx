"use client"

import { useState } from "react"
import {
  Cancel01Icon,
  Copy01Icon,
  PaintBoardIcon,
  Search01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Icons } from "@/components/icons/icons"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  ThemeDialog,
  type ThemeSource,
} from "@/components/registry/theme-dialog"
import { toast } from "@/components/ui/toast"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { resolveColor } from "@/lib/color"
import { CONTRAST_PAIRS, type DesignTokenData } from "@/lib/design-tokens"
import { cn } from "@/lib/utils"

import { type ResolvedPair, type ValueFormat } from "./color-values"
import { ColorTree } from "./color-tree"
import { ContrastTree } from "./contrast-tree"
import { useDomSnapshot } from "./measure"
import { ScaleTree } from "./scale-tree"
import { SystemTree } from "./system-tree"
import { FONT_FAMILY_TOKENS, TypographyTree } from "./typography-tree"
import { TypesetTree } from "./typeset-tree"

/**
 * The strip under the page title: the five-step brand ramp, then the two colours
 * that sit outside it. Near-white tokens are left out — they only read as a gap.
 */
const RIBBON = [
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "destructive",
  "foreground",
]

/**
 * Flattens every token onto its own theme's background, so translucent values
 * report the colour they actually paint rather than an unrecoverable premultiplied one.
 */
function useResolvedColors(index: DesignTokenData["index"]) {
  return useDomSnapshot<Record<string, ResolvedPair>>(
    Object.keys(index).join(","),
    () => {
      const lightBackdrop = index.background?.light.resolved ?? "#ffffff"
      const darkBackdrop = index.background?.dark.resolved ?? "#000000"

      return Object.fromEntries(
        Object.values(index).map((token) => [
          token.name,
          {
            light: resolveColor(token.light.resolved, lightBackdrop),
            dark: resolveColor(token.dark.resolved, darkBackdrop),
          },
        ])
      )
    }
  )
}

export function TokensView({
  data,
  themeSources,
}: {
  data: DesignTokenData
  themeSources: ThemeSource[]
}) {
  const [query, setQuery] = useState("")
  const [format, setFormat] = useState<ValueFormat>("source")
  const resolved = useResolvedColors(data.index)
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  const needle = query.trim().toLowerCase()
  const matches = (name: string) =>
    !needle || name.toLowerCase().includes(needle)

  const colorGroups = data.colorGroups
    .map((group) => ({
      ...group,
      tokens: group.tokens.filter((token) => matches(token.name)),
    }))
    .filter((group) => group.tokens.length > 0)

  const pairs = CONTRAST_PAIRS.filter(
    (pair) => matches(pair.background) || matches(pair.foreground)
  )
  const radius = data.radius.filter((token) => matches(token.name))
  const spacing = data.spacing.filter((token) => matches(token.name))
  const weights = data.weights.filter((token) => matches(token.name))
  const families = FONT_FAMILY_TOKENS.filter(matches)
  const typeset = data.typeset.filter((token) => matches(token.name))
  const textSizes = data.textSizes.filter((token) => matches(token.name))
  const shadows = data.shadows.filter((token) => matches(token.name))
  const motion = data.motion.filter((token) => matches(token.name))
  const breakpoints = data.breakpoints.filter((token) => matches(token.name))
  const dials = data.dials.filter((token) => matches(token.name))

  const hits =
    colorGroups.reduce((sum, group) => sum + group.tokens.length, 0) +
    radius.length +
    spacing.length +
    weights.length +
    families.length +
    typeset.length +
    textSizes.length +
    shadows.length +
    motion.length +
    breakpoints.length +
    dials.length
  const nothingFound = needle.length > 0 && hits === 0
  // A search is the one time every card should already be open — you asked for
  // these tokens by name, so nothing should still be behind a chevron.
  const expanded = needle.length > 0

  return (
    <div className="container p-5 md:p-10">
      <header className="mb-2">
        <div className="text-xl font-medium tracking-tight">Design Tokens</div>
        <div className="mt-2 text-sm text-muted-foreground">
          Every colour, type, radius, and spacing value in the system — read
          straight out of <code className="font-mono text-sm">globals.css</code>
          , and shown in the theme you are in.
        </div>

        {/* <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="font-mono">
            {data.totals.tokens} tokens
          </Badge>
          <Badge variant="secondary" className="font-mono">
            {data.totals.colors} colours
          </Badge>
          <Badge variant="secondary" className="font-mono">
            2 themes
          </Badge>
        </div> 

        <div
          className="mt-5 flex h-14 overflow-hidden rounded-xl border"
          aria-hidden="true"
        >
          {RIBBON.map((name) => (
            <div
              key={name}
              className="flex-1 transition-[flex-grow] duration-300 hover:grow-[2]"
              style={{ background: `var(--${name})` }}
              title={`--${name}`}
            />
          ))}
        </div>*/}
      </header>

      <div className="sticky top-14 z-20 -mx-5 mb-8 bg-background/80 px-5 py-2.5 backdrop-blur-md md:-mx-10 md:px-10">
        <div className="flex flex-wrap items-center gap-2">
          <InputGroup className="h-8 w-full sm:w-64">
            <InputGroupAddon>
              <HugeiconsIcon
                icon={Search01Icon}
                strokeWidth={2}
                className="size-4"
              />
            </InputGroupAddon>
            <InputGroupInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search tokens…"
              aria-label="Search tokens"
            />
            {query && (
              <InputGroupAddon align="inline-end">
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    strokeWidth={2}
                    className="size-3.5"
                  />
                </button>
              </InputGroupAddon>
            )}
          </InputGroup>

          {/*  <ToggleGroup
            value={[format]}
            // Deselecting yields an empty array; keep the current format instead.
            onValueChange={([next]) => {
              if (next) setFormat(next as ValueFormat)
            }}
            variant="outline"
            size="sm"
            spacing={0}
          >
            <ToggleGroupItem value="source" aria-label="Show authored values">
              oklch
            </ToggleGroupItem>
            <ToggleGroupItem value="hex" aria-label="Show hex values">
              hex
            </ToggleGroupItem>
          </ToggleGroup>

          <span
            className={cn(
              "font-mono text-xs text-muted-foreground tabular-nums",
              !needle && "hidden sm:inline"
            )}
          >
            {needle ? `${hits} matching` : `${data.totals.tokens} tokens`}
          </span>
*/}
          <div className="ms-auto flex items-center gap-2">
            <ThemeDialog
              sources={themeSources}
              trigger={
                <Button variant="outline" size="default">
                  <Icons.css className="size-4" />
                  .css
                </Button>
              }
            />
          </div>
        </div>
      </div>

      {nothingFound ? (
        <Empty className="rounded-xl border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
            </EmptyMedia>
            <EmptyTitle>No tokens match “{query}”</EmptyTitle>
            <EmptyDescription>
              Try a shorter term like “sidebar”, “chart”, or “radius”.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-4">
          {colorGroups.length > 0 && (
            <ColorTree
              groups={colorGroups}
              resolved={resolved}
              format={format}
              expanded={expanded}
            />
          )}

          {pairs.length > 0 && (
            <ContrastTree
              pairs={pairs}
              index={data.index}
              resolved={resolved}
              expanded={expanded}
            />
          )}

          {(families.length > 0 ||
            weights.length > 0 ||
            textSizes.length > 0) && (
            <TypographyTree
              families={families}
              weights={weights}
              textSizes={textSizes}
              expanded={expanded}
            />
          )}

          {(radius.length > 0 || spacing.length > 0 || shadows.length > 0) && (
            <ScaleTree
              radius={radius}
              spacing={spacing}
              shadows={shadows}
              expanded={expanded}
            />
          )}

          {typeset.length > 0 && (
            <TypesetTree controls={typeset} expanded={expanded} />
          )}

          {(motion.length > 0 ||
            breakpoints.length > 0 ||
            dials.length > 0) && (
            <SystemTree
              motion={motion}
              breakpoints={breakpoints}
              dials={dials}
              expanded={expanded}
            />
          )}
        </div>
      )}

      <footer className="mt-14 flex items-center gap-2 border-t pt-5 text-xs text-muted-foreground">
        <HugeiconsIcon
          icon={PaintBoardIcon}
          strokeWidth={2}
          className="size-4"
        />
        Values are parsed from{" "}
        <code className="font-mono">app/globals.css</code> at build time, so
        this page never drifts from the theme.
      </footer>
    </div>
  )
}
