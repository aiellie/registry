import Link from "next/link"
import {
  Atom01Icon,
  ArrowLeftRightIcon,
  ArrowUpRight01Icon,
  PaintBucketIcon,
  Robot01Icon,
  SmileIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"

import { Reveal } from "@/components/registry/reveal"
import { cn } from "@/lib/utils"

interface Feature {
  icon: IconSvgElement
  title: string
  description: string
  href?: string
  /** Widens the card on large screens, giving the grid its bento rhythm. */
  wide?: boolean
}

const features: Feature[] = [
  {
    icon: Atom01Icon,
    title: "Base UI underneath",
    description:
      "Unstyled, accessible primitives with real focus management and keyboard behaviour. Composition runs through render props, so a button can become a link without an extra wrapper element.",
    wide: true,
  },
  {
    icon: PaintBucketIcon,
    title: "One set of tokens",
    description:
      "Colour, radius, type scale and shadow all resolve from a single Tailwind v4 theme block. Retune a token and the whole system moves with it.",
    href: "/tokens",
  },
  {
    icon: ArrowLeftRightIcon,
    title: "RTL from the first line",
    description:
      "Logical properties everywhere and mirrored directional icons, so Arabic and Hebrew layouts work without a pile of overrides.",
  },
  {
    icon: Robot01Icon,
    title: "Made for agents",
    description:
      "Point the shadcn MCP server at the @aiellie namespace and your coding agent can install any component by name — source, dependencies and all.",
    wide: true,
  },
  {
    icon: SmileIcon,
    title: "HugeIcons, browsable",
    description:
      "Search thousands of icons by name, tag or category and copy the import without leaving the docs.",
    href: "/icons",
  },
  {
    icon: SparklesIcon,
    title: "Open in v0",
    description:
      "Every item hands off to v0 with its full source, so a component can become a whole screen in one step — no copying between tabs.",
    // Keeps the bento on three complete rows rather than leaving a hole in the
    // last one.
    wide: true,
  },
]

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const body = (
    <>
      {/* Brand wash that only resolves on hover — keeps the resting grid calm
          and makes the pointer feel like it is lighting cards up. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_100%_at_0%_0%,color-mix(in_oklch,var(--primary),transparent_88%),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover/feature:opacity-100"
      />
      <span className="flex size-9 items-center justify-center rounded-xl border border-border/70 bg-background/70 text-primary transition-colors duration-300 group-hover/feature:border-primary/30 group-hover/feature:bg-primary/10">
        <HugeiconsIcon
          icon={feature.icon}
          strokeWidth={2}
          className="size-4.5"
        />
      </span>
      <h3 className="mt-4 flex items-center gap-1.5 font-heading text-base font-medium tracking-tight text-foreground">
        {feature.title}
        {feature.href && (
          <HugeiconsIcon
            icon={ArrowUpRight01Icon}
            strokeWidth={2}
            className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-all duration-200 group-hover/feature:translate-x-0.5 group-hover/feature:opacity-100 rtl:-scale-x-100"
          />
        )}
      </h3>
      <p className="mt-2 text-sm text-pretty text-muted-foreground">
        {feature.description}
      </p>
    </>
  )

  const className =
    "group/feature relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/50 p-5 backdrop-blur-md transition-colors duration-300 hover:border-primary/25 style-lyra:rounded-none style-sera:rounded-none"

  return (
    // The reveal wrapper is the grid child, so the bento span lives on it.
    <Reveal
      delay={(index % 3) * 80}
      className={cn("h-full", feature.wide && "lg:col-span-2")}
    >
      {feature.href ? (
        <Link
          href={feature.href}
          className={cn(
            className,
            "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          )}
        >
          {body}
        </Link>
      ) : (
        <div className={className}>{body}</div>
      )}
    </Reveal>
  )
}

export function HomeFeatures({ className }: { className?: string }) {
  return (
    <section
      aria-label="How it is built"
      className={cn("w-full px-4 py-16 sm:px-6 sm:py-20 lg:px-8", className)}
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <Reveal className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <p className="font-mono text-xs tracking-[0.18em] text-primary uppercase">
            Under the hood
          </p>
          <h2 className="mt-3 font-heading text-3xl font-medium tracking-tighter text-balance text-foreground sm:text-4xl">
            Opinionated where it helps, out of the way everywhere else.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
