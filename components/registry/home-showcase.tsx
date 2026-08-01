"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"

import { MessageScrollerDemo } from "@/app/(registry)/cards/message-scroller"
import {
  AiOrbDemo,
  AnimatedBotsDemo,
  AttachmentDemo,
  BubbleDemo,
  BubblesDemo,
  FileTreeDemo,
  FindInPageDemo,
  GlassDemo,
  LiquidDemo,
  LiveWaveformDemo,
  MarkerDemo,
  MessageDemo,
  MicSelectorDemo,
  ModelSelectorExample,
  PromptInputDemo,
  SpeechInputDemo,
  TerminalDemo,
  WebPreviewDemo,
} from "@/components/aiellie/examples"
import { ItemWrapper } from "@/components/item-wrapper"
import { ItemDetailsDialog } from "@/components/registry/item-details-dialog"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status"
import { getItem } from "@/lib/items"
import type { Component } from "@/lib/registry"
import { cn } from "@/lib/utils"

interface Cell {
  /** Registry item name — clicking the card title opens this item's dialog. */
  name: string
  demo: React.ComponentType
  /**
   * Overrides for demos whose standalone-page chrome misbehaves inside a
   * card (viewport-height wrappers, floating control panels, captions).
   */
  demoClassName?: string
}

/**
 * Same masonry-column structure as the cards page (`CardsDemo`): column one is
 * always visible, the rest fade in as the viewport widens, so every
 * breakpoint sees full columns instead of orphaned cards.
 */
const columns: { className: string; cells: Cell[] }[] = [
  {
    className: "flex flex-col gap-(--gap)",
    cells: [
      { name: "prompt-input", demo: PromptInputDemo },
      {
        // AiOrb ships as a full-page playground — collapse its viewport-height
        // wrapper, let the dot grid show through, and drop the floating
        // shader-controls panel that would pin itself to the page corner.
        name: "ai-orb",
        demo: AiOrbDemo,
        demoClassName:
          "**:[.min-h-screen]:min-h-0! **:[.min-h-screen]:bg-transparent! **:[.fixed]:hidden",
      },
      { name: "animated-bots", demo: AnimatedBotsDemo },
      {
        // The terminal demo centers itself in a viewport-height wrapper; the
        // card already provides the frame and padding.
        name: "terminal",
        demo: TerminalDemo,
        demoClassName: "**:[.min-h-dvh]:min-h-0! **:[.min-h-dvh]:p-0!",
      },
      { name: "speech-input", demo: SpeechInputDemo },
    ],
  },
  {
    className: "hidden flex-col gap-(--gap) lg:flex",
    cells: [
      { name: "liquid", demo: LiquidDemo },
      { name: "web-preview", demo: WebPreviewDemo },
      { name: "bubble", demo: BubbleDemo },
    ],
  },
  {
    className: "hidden flex-col gap-(--gap) min-[1400px]:flex",
    cells: [
      { name: "glass", demo: GlassDemo },
      { name: "attachment", demo: AttachmentDemo },
      { name: "find-in-page", demo: FindInPageDemo },
      { name: "model-selector", demo: ModelSelectorExample },
    ],
  },
  {
    className: "hidden flex-col gap-(--gap) md:flex",
    cells: [
      {
        // The cards-page scroller demo (no floating settings panel); its
        // "read only" caption is noise inside the card.
        name: "message-scroller",
        demo: MessageScrollerDemo,
        demoClassName: "**:[.text-center.text-xs]:hidden",
      },
      { name: "file-tree", demo: FileTreeDemo },
      { name: "live-waveform", demo: LiveWaveformDemo },
    ],
  },
  {
    className: "hidden flex-col gap-(--gap) min-[1900px]:flex",
    cells: [
      { name: "bubbles", demo: BubblesDemo },
      { name: "message", demo: MessageDemo },
      { name: "mic-selector", demo: MicSelectorDemo },
      { name: "marker", demo: MarkerDemo },
    ],
  },
]

const ShowcaseCard = React.memo(function ShowcaseCard({
  item,
  cell,
  onSelect,
}: {
  item: Component
  cell: Cell
  onSelect: (item: Component) => void
}) {
  const meta = getItem(item.name)
  const Demo = cell.demo

  return (
    <div className="style-lyra:rounded-none style-sera:rounded-none w-full min-w-0 rounded-2xl">
      <ItemWrapper
        title={
          <button
            type="button"
            onClick={() => onSelect(item)}
            className="flex w-full min-w-0 cursor-pointer items-center gap-2 rounded-sm text-start focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {meta && (
              <HugeiconsIcon
                icon={meta.icon}
                strokeWidth={2}
                className="size-3.5 shrink-0"
              />
            )}
            <span className="truncate text-foreground">{item.title}</span>
            {meta?.isNew && (
              <Status
                variant="brand"
                className="ms-auto border-transparent bg-transparent px-0"
              >
                <StatusIndicator />
                <StatusLabel>New</StatusLabel>
              </Status>
            )}
          </button>
        }
      >
        <div
          className={cn(
            "relative flex min-h-32 w-full flex-col overflow-hidden bg-background bg-[radial-gradient(color-mix(in_oklch,var(--border)_70%,transparent)_1px,transparent_1px)] bg-size-[16px_16px] p-5",
            cell.demoClassName
          )}
        >
          <div className="m-auto flex w-full min-w-0 flex-col items-center">
            <Demo />
          </div>
        </div>
      </ItemWrapper>
    </div>
  )
})

export function HomeShowcase({ items }: { items: Component[] }) {
  /** The item whose details dialog is open, or `null` when closed. */
  const [selected, setSelected] = React.useState<Component | null>(null)

  const byName = React.useMemo(
    () => new Map(items.map((item) => [item.name, item])),
    [items]
  )

  // Stable so the memoized cards don't re-render when the dialog opens.
  const handleSelect = React.useCallback(
    (item: Component) => setSelected(item),
    []
  )

  return (
    <div
      data-slot="components-demo"
      className="relative flex w-full max-w-none flex-col gap-(--gap) overflow-hidden bg-muted p-4 pb-0! [--gap:--spacing(8)] 3xl:[--gap:--spacing(8)] min-[1900px]:p-12 min-[1900px]:[--gap:--spacing(10)]! md:p-12 lg:p-6 lg:[--gap:--spacing(6)] dark:bg-background"
    >
      {/* Unlike CardsDemo, the base breakpoint needs an explicit grid-cols-1:
          the terminal demo's fixed w-xl would otherwise floor the implicit
          track at its 576px min-content width and blow the page out sideways
          on phones (percentage max-widths don't cap intrinsic sizing). */}
      <div className="relative z-10 mx-auto grid max-w-full grid-cols-1 gap-(--gap) **:data-[slot=card]:w-full min-[1400px]:grid-cols-4! min-[1900px]:grid-cols-5! md:max-w-3xl md:grid-cols-2 lg:max-w-none lg:grid-cols-3 xl:max-w-[1600px] 2xl:max-w-[1900px]">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className={column.className}>
            {column.cells.map((cell) => {
              const item = byName.get(cell.name)
              if (!item) return null
              return (
                <ShowcaseCard
                  key={cell.name}
                  item={item}
                  cell={cell}
                  onSelect={handleSelect}
                />
              )
            })}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-1 h-120 bg-linear-to-b from-background via-muted to-transparent dark:hidden" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-48 bg-linear-to-t from-background via-muted/80 to-transparent lg:h-80 xl:h-64 dark:via-background/80" />
      <ItemDetailsDialog
        item={selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
      />
    </div>
  )
}
