import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"

import { cn } from "@/lib/utils"

const css = `
@keyframes home-marquee {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-50%, 0, 0); }
}
.home-marquee-track {
  display: flex;
  width: max-content;
  will-change: transform;
  animation: home-marquee var(--marquee-duration, 60s) linear infinite;
}
.home-marquee-track[data-direction="reverse"] { animation-direction: reverse; }
.home-marquee:hover .home-marquee-track { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) {
  .home-marquee-track { animation: none; }
}
`

function MarqueeStyles() {
  return (
    <style href="home-marquee" precedence="default">
      {css}
    </style>
  )
}

export interface MarqueeItem {
  name: string
  title: string
  icon: IconSvgElement
}

function Row({
  items,
  duration,
  reverse = false,
}: {
  items: MarqueeItem[]
  duration: string
  reverse?: boolean
}) {
  return (
    // Two identical halves: the track travels exactly one half's width, so the
    // second is in the first's place the moment the loop restarts.
    <div
      className="home-marquee-track"
      data-direction={reverse ? "reverse" : undefined}
      style={{ "--marquee-duration": duration } as React.CSSProperties}
    >
      {[0, 1].map((half) => (
        <div
          key={half}
          className="flex shrink-0 gap-2 pe-2"
          aria-hidden={half === 1}
        >
          {items.map((item) => (
            <Link
              key={item.name}
              href={`/registry/${item.name}`}
              tabIndex={half === 1 ? -1 : undefined}
              className="group/chip flex items-center gap-2 rounded-full border border-border/70 bg-card/50 px-3.5 py-1.5 text-sm whitespace-nowrap text-muted-foreground backdrop-blur-md transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <HugeiconsIcon
                icon={item.icon}
                strokeWidth={2}
                className="size-3.5 shrink-0 text-muted-foreground/70 transition-colors group-hover/chip:text-primary"
              />
              {item.title}
            </Link>
          ))}
        </div>
      ))}
    </div>
  )
}

/**
 * Two counter-rotating rows of registry items, edge-faded and paused on hover
 * so a name can actually be clicked. Purely a way to show the breadth of the
 * registry at a glance — every chip is a real link into it.
 */
export function HomeMarquee({
  rows,
  className,
}: {
  rows: MarqueeItem[][]
  className?: string
}) {
  return (
    <section
      aria-label="Registry contents"
      className={cn(
        "home-marquee relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] py-2",
        className
      )}
    >
      <MarqueeStyles />
      <div className="flex flex-col gap-2">
        {rows.map((items, index) => (
          <Row
            key={index}
            items={items}
            duration={`${64 + index * 16}s`}
            reverse={index % 2 === 1}
          />
        ))}
      </div>
    </section>
  )
}
