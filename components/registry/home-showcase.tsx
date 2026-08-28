"use client"

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
} from "react"
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { ItemWrapper } from "@/components/item-wrapper"
import { ItemDetailsDialog } from "@/components/registry/item-details-dialog"
import { Reveal } from "@/components/registry/reveal"
import { Skeleton } from "@/components/ui/skeleton"
import { Status, StatusIndicator, StatusLabel } from "@/components/aiellie/ui/status"
import { TooltipProvider } from "@/components/ui/tooltip"
import { getItem } from "@/lib/aiellie-items"
import type { Component } from "@/lib/registry"
import { cn } from "@/lib/utils"

/**
 * Per-demo fixes for standalone-page chrome the shared card frame can't
 * neutralise on its own — floating control panels, page backgrounds, captions
 * that only make sense at `/demo/<name>`.
 */
const demoOverrides: Record<string, string> = {
  // Ships as a full-page playground: let the card's dot grid show through and
  // drop the shader-controls panel that would pin itself to the page corner.
  "orb": "**:[.min-h-screen]:bg-transparent! **:[.fixed]:hidden",
  // The "read only" caption below the demo is noise inside a card.
  "message-scroller": "**:[.text-center.text-xs]:hidden",
}

export interface ShowcaseEntry extends Component {
  /**
   * The `registry:example` entry backing the details dialog, when the item has
   * one. Its file is the demo the card renders, so the dialog's preview, code
   * and install command all match what's on the card — unlike the primitive's
   * own entry, whose demo lives under `app/demo/<name>/`.
   */
  exampleName?: string
}

/** True once the element has been on screen, and it stays true after that. */
function useHasBeenVisible() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          setVisible(true)
          observer.disconnect()
        }
      },
      // Start work a screen early so a card is painted by the time it arrives.
      { rootMargin: "400px" }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return [ref, visible] as const
}

const ShowcaseCard = memo(function ShowcaseCard({
  entry,
  demo: Demo,
  index,
  onSelect,
}: {
  entry: ShowcaseEntry
  demo: ComponentType
  index: number
  onSelect: (entry: ShowcaseEntry) => void
}) {
  const meta = getItem(entry.name)
  // These demos are the expensive part of the page — a WebGL orb, a canvas
  // waveform, an iframe preview. Mounting all of them at load jams the main
  // thread long enough that the page stops responding, so each waits until its
  // card is nearly on screen.
  const [ref, mounted] = useHasBeenVisible()

  return (
    <div ref={ref} className="mb-4 w-full min-w-0 break-inside-avoid sm:mb-5">
      <Reveal delay={(index % 3) * 90}>
        <div className="group/card style-lyra:rounded-none style-sera:rounded-none rounded-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 motion-reduce:hover:translate-y-0">
          <ItemWrapper
            title={
              <button
                type="button"
                onClick={() => onSelect(entry)}
                className="flex w-full min-w-0 cursor-pointer items-center gap-2 rounded-sm text-start focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                {meta && (
                  <HugeiconsIcon
                    icon={meta.icon}
                    strokeWidth={2}
                    className="size-3.5 shrink-0"
                  />
                )}
                <span className="truncate text-foreground">{entry.title}</span>
                {meta?.isNew ? (
                  <Status
                    variant="brand"
                    className="ms-auto border-transparent bg-transparent px-0"
                  >
                    <StatusIndicator />
                    <StatusLabel>New</StatusLabel>
                  </Status>
                ) : (
                  <span className="ms-auto" />
                )}
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  strokeWidth={2}
                  className="size-3.5 shrink-0 opacity-60 rtl:-scale-x-100"
                />
              </button>
            }
          >
            <div
              className={cn(
                "relative flex min-h-52 w-full flex-col overflow-hidden bg-background bg-[radial-gradient(color-mix(in_oklch,var(--border)_70%,transparent)_1px,transparent_1px)] bg-size-[16px_16px] p-5",
                // Every demo centres itself inside a viewport-height wrapper
                // for its standalone page. In a card that wrapper is dead
                // space — the card supplies the frame, padding and centering.
                "**:[.min-h-dvh]:min-h-0! **:[.min-h-dvh]:p-0! **:[.min-h-screen]:min-h-0! **:[.min-h-screen]:p-0!",
                demoOverrides[entry.name]
              )}
            >
              {mounted ? (
                <div className="m-auto flex w-full min-w-0 flex-col items-center">
                  <Demo />
                </div>
              ) : (
                <div
                  aria-hidden
                  className="m-auto flex w-full max-w-xs flex-col gap-2.5"
                >
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              )}
            </div>
          </ItemWrapper>
        </div>
      </Reveal>
    </div>
  )
})

/**
 * The live half of the home page: every card renders the component itself, not
 * a screenshot, and the hover title bar opens the full source, install command
 * and preview in a dialog.
 */
export function HomeShowcase({
  entries,
  className,
}: {
  entries: ShowcaseEntry[]
  className?: string
}) {
  /** The card whose details dialog is open, or `null` when closed. */
  const [selected, setSelected] = useState<ShowcaseEntry | null>(null)

  // Stable so the memoized cards don't re-render when the dialog opens.
  const handleSelect = useCallback(
    (entry: ShowcaseEntry) => setSelected(entry),
    []
  )

  // Only items curated with an inline example — anything else has no demo to
  // render here and belongs in the catalog further down the page.
  const cards = useMemo(
    () =>
      entries
        .map((entry) => ({ entry, demo: getItem(entry.name)?.demo }))
        .filter(
          (card): card is { entry: ShowcaseEntry; demo: ComponentType } =>
            card.demo !== undefined
        ),
    [entries]
  )

  return (
    <TooltipProvider delay={300}>
      <section
        data-slot="components-demo"
        aria-label="Component previews"
        className={cn("w-full px-4 py-16 sm:px-6 sm:py-20 lg:px-8", className)}
      >
        <div className="mx-auto w-full max-w-[1600px]">
          <Reveal className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
            <p className="font-mono text-xs tracking-[0.18em] text-primary uppercase">
              Live previews
            </p>
            <h2 className="mt-3 font-heading text-3xl font-medium tracking-tighter text-balance text-foreground sm:text-4xl">
              Not screenshots. The real components.
            </h2>
            <p className="mt-3 text-pretty text-muted-foreground">
              Every card below is the component itself, running on this page.
              Open one to read its source, copy the install command, or send it
              straight to v0.
            </p>
          </Reveal>

          {/* CSS columns rather than grid: each card keeps its natural height
              and the columns pack them masonry-style. Cards carry their own
              bottom margin; the negative margin swallows the last row's. */}
          <div className="-mb-4 columns-1 gap-4 sm:columns-2 sm:gap-5 xl:columns-3">
            {cards.map(({ entry, demo }, index) => (
              <ShowcaseCard
                key={entry.name}
                entry={entry}
                demo={demo}
                index={index}
                onSelect={handleSelect}
              />
            ))}
          </div>
        </div>

        <ItemDetailsDialog
          item={selected}
          exampleName={selected?.exampleName}
          onOpenChange={(open) => {
            if (!open) setSelected(null)
          }}
        />
      </section>
    </TooltipProvider>
  )
}
