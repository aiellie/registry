"use client"

import { useEffect, useRef, useState, type ComponentProps } from "react"

import { cn } from "@/lib/utils"

/**
 * Fades its children up the first time they scroll into view.
 *
 * The home page scrolls inside the site effect's `overflow: auto` surface
 * rather than the window, so a scroll listener would have to go find that
 * element. An IntersectionObserver against the viewport already has ancestor
 * overflow clipping folded into its intersection rect, so this works from
 * either scrollport with no root to configure.
 *
 * Motion is CSS-only and `motion-reduce:` neutralises every part of it, so the
 * reduced-motion path is a plain opacity swap with no transform or blur.
 *
 * The resting state is invisible, which would hide the whole page from a
 * scripting-disabled reader — {@link RevealFallback} is the escape hatch, and
 * the page renders it once.
 */
export function Reveal({
  delay = 0,
  className,
  style,
  ...props
}: ComponentProps<"div"> & {
  /** Stagger, in milliseconds, applied to the transition. */
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Anything already on screen at mount reveals on the observer's first
    // synchronous callback, so the hero never waits for a scroll.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: "0px 0px -10% 0px" }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-reveal=""
      data-shown={shown || undefined}
      className={cn(
        // Use blur-[0px] (not blur-0): the arbitrary blur-[2px] otherwise
        // wins source-order over data-shown:blur-0 under Tailwind's :where().
        "translate-y-4 opacity-0 blur-[2px] transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] data-shown:translate-y-0 data-shown:opacity-100 data-shown:blur-[0px] motion-reduce:translate-y-0 motion-reduce:blur-[0px] motion-reduce:transition-opacity",
        className
      )}
      style={{ transitionDelay: `${delay}ms`, ...style }}
      {...props}
    />
  )
}

/**
 * Undoes every {@link Reveal}'s resting state when scripting is off, so the
 * page reads as a normal document instead of a stack of invisible sections.
 * Render once per page that uses `Reveal`.
 */
export function RevealFallback() {
  return (
    <noscript>
      <style>
        {
          "[data-reveal]{opacity:1!important;transform:none!important;filter:none!important}"
        }
      </style>
    </noscript>
  )
}
