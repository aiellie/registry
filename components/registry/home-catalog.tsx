import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"

import { Reveal } from "@/components/registry/reveal"
import { groupByCategory } from "@/lib/items"
import type { Component } from "@/lib/registry"
import { cn } from "@/lib/utils"

/** Item chips shown per category before the rest collapse into a counter. */
const PREVIEW = 6

/**
 * A flat index of the whole registry, grouped the same way the sidebar groups
 * it. The showcase above shows a curated handful running live; this is the
 * part that admits how much else is in here, and links straight to it.
 */
export function HomeCatalog({
  components,
  className,
}: {
  components: Component[]
  className?: string
}) {
  const groups = groupByCategory(components)

  return (
    <section
      aria-label="Component catalog"
      className={cn("w-full px-4 py-16 sm:px-6 sm:py-20 lg:px-8", className)}
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <Reveal className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <p className="font-mono text-xs tracking-[0.18em] text-primary uppercase">
            The whole catalog
          </p>
          <h2 className="mt-3 font-heading text-3xl font-medium tracking-tighter text-balance text-foreground sm:text-4xl">
            {components.length} items, grouped the way you look for them.
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            Blocks, components and the primitives they are made of — every one
            with a live preview, its source, and a one-line install.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {groups.map(({ category, items }, index) => {
            const preview = items.slice(0, PREVIEW)
            const rest = items.length - preview.length

            return (
              <Reveal key={category.id} delay={(index % 3) * 70}>
                <div className="group/group style-lyra:rounded-none style-sera:rounded-none flex h-full flex-col rounded-2xl border border-border/70 bg-card/50 p-5 backdrop-blur-md transition-colors duration-300 hover:border-primary/25">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-8 items-center justify-center rounded-lg border border-border/70 bg-background/70 text-primary">
                      <HugeiconsIcon
                        icon={category.icon}
                        strokeWidth={2}
                        className="size-4"
                      />
                    </span>
                    <h3 className="font-heading text-sm font-medium tracking-tight text-foreground">
                      {category.label}
                    </h3>
                    <span className="ms-auto font-mono text-xs text-muted-foreground tabular-nums">
                      {items.length}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {preview.map((item) => (
                      <Link
                        key={item.name}
                        href={`/registry/${item.name}`}
                        className="rounded-md border border-transparent bg-muted/60 px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/25 hover:bg-primary/5 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                      >
                        {item.title}
                      </Link>
                    ))}
                    {rest > 0 && (
                      <span className="px-2 py-1 font-mono text-xs text-muted-foreground/70 tabular-nums">
                        +{rest}
                      </span>
                    )}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
