"use client"

import { useState, useSyncExternalStore, type ReactNode } from "react"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"
import { useTheme } from "next-themes"

import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

/**
 * Base UI measures the panel once and hands the result back as a custom
 * property; this is what turns that into a transition.
 *
 * Only the group panels get it. The measurement is taken on open and never
 * revised, so pinning the card's own panel to a height would clip whichever
 * group you expanded inside it.
 */
const PANEL =
  "h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0"

const CHEVRON =
  "size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-panel-open/row:rotate-180"

const TRIGGER =
  "group/row flex w-full cursor-pointer items-center gap-3 px-4 text-start transition-colors hover:bg-muted/40"

/** The leaf row every tree hangs its content on. */
export const TREE_ROW =
  "flex items-center gap-3 border-t bg-muted/20 px-4 py-2.5"

/** Subtitles are counts of a filtered set, so "1 groups" is always one search away. */
export const plural = (count: number, word: string) =>
  `${count} ${word}${count === 1 ? "" : "s"}`

export function CountBadges({
  count,
  broken,
  /** What the destructive badge counts, e.g. "undefined" or "below AA". */
  brokenLabel = "undefined",
}: {
  count: number
  broken: number
  brokenLabel?: string
}) {
  return (
    <div className="ms-auto flex items-center gap-1.5">
      <Badge className="bg-(--success-foreground) font-mono text-success tabular-nums">
        {count}
      </Badge>
      {broken > 0 && (
        <Badge className="bg-(--destructive-foreground) font-mono text-destructive tabular-nums">
          {broken} {brokenLabel}
        </Badge>
      )}
    </div>
  )
}

/** The outer card: an icon, a title, and everything else behind one chevron. */
export function TreeCard({
  icon,
  title,
  subtitle,
  action,
  open,
  onOpenChange,
  children,
}: {
  icon: IconSvgElement
  title: string
  subtitle: ReactNode
  /** Sits outside the trigger, so pressing it does not toggle the card. */
  action?: ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Collapsible open={open} onOpenChange={onOpenChange}>
        <div className="flex items-center gap-3">
          <CollapsibleTrigger className={cn(TRIGGER, "flex-1 py-3.5")}>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <HugeiconsIcon
                icon={icon}
                strokeWidth={2}
                className="size-4.5 text-muted-foreground"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium">{title}</div>
              <div className="text-xs text-muted-foreground">{subtitle}</div>
            </div>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              strokeWidth={2}
              className={CHEVRON}
            />
          </CollapsibleTrigger>

          {action}
        </div>

        <CollapsibleContent>{children}</CollapsibleContent>
      </Collapsible>
    </div>
  )
}

/** One curated group inside a card, opening onto its own rows. */
export function TreeGroup({
  title,
  count,
  broken = 0,
  brokenLabel,
  open,
  onOpenChange,
  children,
}: {
  title: string
  /** Omitted by groups that hold a demo rather than a countable list. */
  count?: number
  broken?: number
  brokenLabel?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}) {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <CollapsibleTrigger className={cn(TRIGGER, "border-t py-3")}>
        <span className="text-sm">{title}</span>
        {count === undefined ? (
          <span className="ms-auto" />
        ) : (
          <CountBadges
            count={count}
            broken={broken}
            brokenLabel={brokenLabel}
          />
        )}
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          strokeWidth={2}
          className={CHEVRON}
        />
      </CollapsibleTrigger>

      <CollapsibleContent className={PANEL}>{children}</CollapsibleContent>
    </Collapsible>
  )
}

/**
 * The name and token every row leads with. Kept here so a radius row and a
 * colour row line up down the page rather than each inventing its own gutter.
 */
export function TreeRowLabel({ name, token }: { name: string; token: string }) {
  return (
    <>
      <span className="truncate text-sm">{name}</span>
      <code className="truncate font-mono text-xs text-muted-foreground/70">
        --{token}
      </code>
    </>
  )
}

/**
 * The theme a tree should read, held back until after hydration.
 *
 * next-themes seeds itself from `localStorage` during the first client render,
 * so trusting it any earlier renders "dark" against a server that said "light" —
 * a mismatch the moment anything mode-dependent reaches the markup.
 */
export function useThemeMode(): "light" | "dark" {
  const { resolvedTheme } = useTheme()

  // Hydration itself is the external store: false while the server's markup is
  // being matched, true from the first client render on.
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  return hydrated && resolvedTheme === "dark" ? "dark" : "light"
}

/**
 * Keeps a tree's open state. `expanded` flips underneath an already-mounted
 * tree the moment a search starts, so the panels have to be controlled; groups
 * you opened by hand override it until the next flip, which clears them back to
 * following the search.
 */
export function useTreeState(expanded: boolean) {
  const [open, setOpen] = useState(expanded)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})
  const [wasExpanded, setWasExpanded] = useState(expanded)

  if (expanded !== wasExpanded) {
    setWasExpanded(expanded)
    setOpen(expanded)
    setOpenGroups({})
  }

  return {
    open,
    setOpen,
    isGroupOpen: (id: string) => openGroups[id] ?? expanded,
    setGroupOpen: (id: string, next: boolean) =>
      setOpenGroups((prev) => ({ ...prev, [id]: next })),
  }
}
