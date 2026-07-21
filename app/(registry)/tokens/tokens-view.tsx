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
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { resolveColor } from "@/lib/color"
import { CONTRAST_PAIRS, type DesignTokenData } from "@/lib/design-tokens"
import { cn } from "@/lib/utils"

import { ColorBlock, type ResolvedPair, type ValueFormat } from "./color-block"
import { ContrastBlock } from "./contrast-block"
import { FONT_FAMILY_TOKENS, FontBlock, WeightBlock } from "./font-block"
import { useDomSnapshot } from "./measure"
import { RadiusBlock, SpacingBlock } from "./scale-block"

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

function Section({
  title,
  description,
  count,
  children,
}: {
  title: string
  description: string
  count?: number
  children: React.ReactNode
}) {
  return (
    <section className="scroll-mt-32">
      <div className="mb-3 flex items-baseline gap-2">
        <h2 className="text-base font-medium tracking-tight">{title}</h2>
        {count !== undefined && (
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {count}
          </span>
        )}
      </div>
      <p className="mb-4 max-w-prose text-sm text-muted-foreground">{description}</p>
      {children}
    </section>
  )
}

export function TokensView({ data }: { data: DesignTokenData }) {
  const [query, setQuery] = useState("")
  const [format, setFormat] = useState<ValueFormat>("source")
  const resolved = useResolvedColors(data.index)
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  const needle = query.trim().toLowerCase()
  const matches = (name: string) => !needle || name.toLowerCase().includes(needle)

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

  const hits =
    colorGroups.reduce((sum, group) => sum + group.tokens.length, 0) +
    radius.length +
    spacing.length +
    weights.length +
    families.length
  const nothingFound = needle.length > 0 && hits === 0

  return (
    <div className="container p-5 md:p-10">
      <header className="mb-8">
        <h1 className="text-3xl font-medium tracking-tight md:text-4xl">
          Design Tokens
        </h1>
        <p className="mt-2 max-w-prose text-muted-foreground">
          Every colour, type, radius, and spacing value in the system — read
          straight out of <code className="font-mono text-sm">globals.css</code>, with
          light and dark shown side by side.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
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
              style={{ background: data.index[name]?.light.resolved ?? undefined }}
              title={`--${name}`}
            />
          ))}
        </div>
      </header>

      <div className="sticky top-14 z-20 -mx-5 mb-8 border-y bg-background/80 px-5 py-2.5 backdrop-blur-md md:-mx-10 md:px-10">
        <div className="flex flex-wrap items-center gap-2">
          <InputGroup className="h-8 w-full sm:w-64">
            <InputGroupAddon>
              <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter tokens…"
              aria-label="Filter tokens"
            />
            {query && (
              <InputGroupAddon align="inline-end">
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Clear filter"
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

          <ToggleGroup
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

          <Button
            variant="outline"
            size="sm"
            className="ms-auto"
            onClick={async () => {
              const copied = await copyToClipboard(data.themeCss)
              if (copied) toast.success("Copied theme CSS")
              else toast.error("Couldn’t reach the clipboard")
            }}
          >
            <HugeiconsIcon
              icon={isCopied ? Tick02Icon : Copy01Icon}
              strokeWidth={2}
            />
            Copy theme
          </Button>
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
        <div className="space-y-12">
          {colorGroups.map((group) => (
            <Section
              key={group.id}
              title={group.title}
              description={group.description}
              count={group.tokens.length}
            >
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {group.tokens.map((token) => (
                  <ColorBlock
                    key={token.name}
                    token={token}
                    resolved={resolved[token.name]}
                    format={format}
                  />
                ))}
              </div>
            </Section>
          ))}

          {pairs.length > 0 && (
            <Section
              title="Contrast"
              description="Every foreground/background pairing in the system, measured against WCAG 2.1 in both themes. Anything below AA needs a second look."
              count={pairs.length}
            >
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {pairs.map((pair) => (
                  <ContrastBlock
                    key={pair.label}
                    pair={pair}
                    index={data.index}
                    resolved={resolved}
                  />
                ))}
              </div>
            </Section>
          )}

          {(families.length > 0 || weights.length > 0) && (
            <Section
              title="Typography"
              description="Two families and a deliberately compressed weight ramp."
            >
              <div className="space-y-3">
                {families.length > 0 && <FontBlock names={families} />}
                {weights.length > 0 && <WeightBlock weights={weights} />}
              </div>
            </Section>
          )}

          {radius.length > 0 && (
            <Section
              title="Radius"
              description="One authored radius, scaled into a seven-step ramp that every component draws from."
              count={radius.length}
            >
              <RadiusBlock tokens={radius} />
            </Section>
          )}

          {spacing.length > 0 && (
            <Section
              title="Layout rhythm"
              description="The spacing scale that sets page density. Several values step up at the md breakpoint."
              count={spacing.length}
            >
              <SpacingBlock tokens={spacing} />
            </Section>
          )}
        </div>
      )}

      <footer className="mt-14 flex items-center gap-2 border-t pt-5 text-xs text-muted-foreground">
        <HugeiconsIcon icon={PaintBoardIcon} strokeWidth={2} className="size-4" />
        Values are parsed from{" "}
        <code className="font-mono">app/globals.css</code> at build time, so this page
        never drifts from the theme.
      </footer>
    </div>
  )
}
