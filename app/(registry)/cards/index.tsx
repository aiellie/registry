"use client"

import * as React from "react"
import { ArrowExpandDiagonal01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

// Registry showcase cards — AI, dev, web, design and coding surfaces built out
// of this registry's own primitives. `full` is the real card, `skeleton` its
// loading state; the grid swaps between them on the "F" key. Every card and
// its metadata comes from the manifest, which the standalone previews at
// /demo/cards/<name> read too.
import { cards, getCardPreviewName, type CardName } from "./manifest"
import { cn } from "@/lib/utils"
import { ItemDetailsDialog } from "@/components/registry/item-details-dialog"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { Component } from "@/lib/registry"

type Cell = {
  name: CardName
  /** Cards that stay real through the skeleton toggle. */
  alwaysFull?: boolean
}

const columns: { className: string; cells: Cell[] }[] = [
  {
    className: "flex flex-col items-start gap-(--gap)",
    cells: [
      { name: "orb" },
      { name: "install-command" },
      { name: "context-window" },
      { name: "commit-heatmap" },
      { name: "web-vitals" },
      { name: "commit-detail" },
      { name: "ui-elements", alwaysFull: true },
      { name: "agent-roster" },
    ],
  },
  {
    className: "hidden flex-col gap-(--gap) lg:flex",
    cells: [
      { name: "file-explorer" },
      { name: "deploy-pipeline" },
      { name: "token-spend" },
      { name: "contrast-checker" },
      { name: "api-latency" },
      { name: "design-tokens" },
      { name: "package-updates" },
      { name: "cli-snippet" },
    ],
  },
  {
    className: "hidden flex-col gap-(--gap) min-[1400px]:flex",
    cells: [
      { name: "pull-request" },
      { name: "palette-picker" },
      { name: "eval-scores" },
      { name: "bundle-size" },
      { name: "env-vars" },
      { name: "icon-grid" },
      { name: "stack-trace-card" },
      { name: "artifact-preview" },
    ],
  },
  {
    className: "hidden flex-col gap-(--gap) md:flex",
    cells: [
      { name: "terminal-build" },
      { name: "ai-chat" },
      { name: "agent-trace" },
      { name: "type-scale" },
      { name: "ci-checks" },
      { name: "code-review" },
      { name: "secrets-vault" },
      { name: "loader-gallery" },
    ],
  },
  {
    className: "hidden flex-col gap-(--gap) min-[1900px]:flex",
    cells: [
      { name: "voice-input" },
      { name: "uptime-monitor" },
      { name: "inference-params" },
      { name: "spacing-scale" },
      { name: "rag-sources" },
      { name: "edge-regions" },
      { name: "reasoning-trace" },
      { name: "release-notes" },
      { name: "schedule-run" },
    ],
  },
]

/** The four skeleton stacks flanking the grid on very wide screens. */
const rails: CardName[][] = [
  ["deploy-pipeline", "eval-scores", "token-spend", "bundle-size"],
  ["ui-elements", "commit-heatmap", "pull-request", "env-vars", "api-latency"],
  [
    "context-window",
    "web-vitals",
    "icon-grid",
    "file-explorer",
    "uptime-monitor",
    "rag-sources",
    "spacing-scale",
  ],
  [
    "terminal-build",
    "inference-params",
    "agent-trace",
    "design-tokens",
    "edge-regions",
    "contrast-checker",
    "type-scale",
  ],
]

function SkeletonRail({ names }: { names: CardName[] }) {
  return (
    <div className="flex flex-col gap-(--gap)">
      {names.map((name) => {
        const Skeleton = cards[name].skeleton
        return <Skeleton key={name} />
      })}
    </div>
  )
}

function CardsSkeletonRails() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-12 z-10 hidden min-[2200px]:block [&_[data-slot=skeleton]:nth-child(even)]:hidden"
    >
      <div className="absolute top-0 left-[calc(50%-950px-var(--rail-width)-var(--gap))] grid w-(--rail-width) grid-cols-[repeat(2,var(--rail-column))] gap-(--gap) opacity-50 [--rail-column:20rem] [--rail-width:calc(var(--rail-column)*2+var(--gap))]">
        <SkeletonRail names={rails[0]} />
        <SkeletonRail names={rails[1]} />
      </div>
      <div className="absolute top-0 right-[calc(50%-950px-var(--rail-width)-var(--gap))] grid w-(--rail-width) grid-cols-[repeat(2,var(--rail-column))] gap-(--gap) opacity-50 [--rail-column:20rem] [--rail-width:calc(var(--rail-column)*2+var(--gap))]">
        <SkeletonRail names={rails[2]} />
        <SkeletonRail names={rails[3]} />
      </div>
    </div>
  )
}

/**
 * One cell of the grid: the card, plus the button that opens its preview. The
 * button floats on the card's outer corner rather than inside it — every card
 * already puts its own controls in the header, and this one shouldn't land on
 * top of them.
 */
function CardSlot({
  name,
  skeleton,
  onOpen,
}: {
  name: CardName
  skeleton: boolean
  onOpen: (name: CardName) => void
}) {
  const card = cards[name]
  const Card = skeleton ? card.skeleton : card.full

  return (
    <div className="group/slot relative w-full">
      <Card />
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onOpen(name)}
              className="pointer-events-none absolute -end-3 -top-3 z-30 rounded-full bg-background opacity-0 shadow-xs transition-opacity duration-150 group-hover/slot:pointer-events-auto group-hover/slot:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100"
            />
          }
        >
          <HugeiconsIcon
            icon={ArrowExpandDiagonal01Icon}
            strokeWidth={2}
            className="size-3.5"
          />
          <span className="sr-only">Open {card.title}</span>
        </TooltipTrigger>
        <TooltipContent>Open preview</TooltipContent>
      </Tooltip>
    </div>
  )
}

export function CardsDemo() {
  const [full, setFull] = React.useState(true)
  /** The card whose preview dialog is open, or `null` when closed. */
  const [opened, setOpened] = React.useState<CardName | null>(null)

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key.toLowerCase() !== "f") return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement | null
      if (
        target?.closest(
          "input, textarea, select, [contenteditable=true], [role=textbox]"
        )
      ) {
        return
      }
      e.preventDefault()
      setFull((value) => !value)
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  // Cards aren't registry items, so this stands in for one: the name is the
  // `/demo/<name>` route the dialog's preview iframe loads, and the rest is
  // what its header reads. Nothing else resolves it — the dialog opens these
  // preview-only, without a registry payload behind them.
  const item = React.useMemo<Component | null>(() => {
    if (!opened) return null

    return {
      name: getCardPreviewName(opened),
      type: "registry:component",
      title: cards[opened].title,
      description: cards[opened].description,
    }
  }, [opened])

  return (
    <div
      data-slot="demo"
      className="theme-neutral relative flex w-full max-w-none flex-col gap-(--gap) overflow-hidden bg-muted p-4 pb-0! [--gap:--spacing(6)] 3xl:[--gap:--spacing(8)] min-[1900px]:p-12 min-[1900px]:[--gap:--spacing(10)]! sm:p-6 lg:p-6 lg:[--gap:--spacing(6)] dark:bg-background"
    >
      <CardsSkeletonRails />
      {/* `grid-cols-1` (a minmax(0,1fr) track) is what lets the single mobile
          column shrink below its cards' min-content width — without it the
          stack sizes to the widest card and gets clipped by the overflow. */}
      <div className="relative z-10 mx-auto grid w-full min-w-0 grid-cols-1 gap-(--gap) **:data-[slot=card]:w-full min-[1400px]:grid-cols-4! min-[1900px]:grid-cols-5! md:max-w-3xl md:grid-cols-2 lg:max-w-none lg:grid-cols-3 xl:max-w-[1600px] 2xl:max-w-[1900px]">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className={cn("min-w-0", column.className)}>
            {column.cells.map((cell) => (
              <CardSlot
                key={cell.name}
                name={cell.name}
                skeleton={!full && !cell.alwaysFull}
                onOpen={setOpened}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-1 h-120 bg-linear-to-b from-background via-muted to-transparent dark:hidden" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-48 bg-linear-to-t from-background via-muted/80 to-transparent lg:h-80 xl:h-64 dark:via-background/80" />

      <ItemDetailsDialog
        item={item}
        previewOnly
        onOpenChange={(open) => {
          if (!open) setOpened(null)
        }}
      />
    </div>
  )
}
