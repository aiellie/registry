"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import {
  ArrowRight01Icon,
  PaintBoardIcon,
  Tick02Icon,
  Copy01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Announcement } from "@/components/registry/announcement"
import { ScrollToComponentsButton } from "@/components/registry/scroll-to-components-button"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { cn } from "@/lib/utils"

const css = `
@keyframes home-rise {
  from { opacity: 0; transform: translate3d(0, 14px, 0); filter: blur(3px); }
  to { opacity: 1; transform: none; filter: blur(0); }
}
@keyframes home-line {
  from { transform: translate3d(0, 110%, 0); }
  to { transform: none; }
}
@keyframes home-aurora {
  0%, 100% { transform: translate3d(-6%, -4%, 0) scale(1); }
  50% { transform: translate3d(6%, 5%, 0) scale(1.12); }
}
.home-rise { animation: home-rise 900ms cubic-bezier(0.16, 1, 0.3, 1) both; }
.home-line { animation: home-line 1100ms cubic-bezier(0.16, 1, 0.3, 1) both; }
.home-aurora { animation: home-aurora 22s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .home-rise, .home-line, .home-aurora { animation: none; }
}
`

function HeroStyles() {
  return (
    <style href="home-hero" precedence="default">
      {css}
    </style>
  )
}

/**
 * Counts from zero to `value` the first time the number scrolls into view.
 * Reduced-motion (and any browser without IntersectionObserver work to do)
 * lands on the final value immediately.
 */
function CountUp({
  value,
  duration = 1100,
}: {
  value: number
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    let frame = 0
    const run = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setDisplay(value)
        return
      }

      // The clock starts on the first frame rather than here: a frame's
      // timestamp is when the browser began that frame, which can predate this
      // call, and a negative elapsed time would send the ease-out cubic below
      // zero and paint a negative count.
      let start: number | null = null
      const tick = (now: number) => {
        start ??= now
        const progress = Math.min((now - start) / duration, 1)
        // Ease-out cubic: fast off the mark, settles onto the real number.
        setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))))
        if (progress < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        run()
        observer.disconnect()
      }
    })

    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  )
}

/** One headline line, masked so the words slide up from behind it. */
function Line({
  children,
  delay,
  className,
}: {
  children: ReactNode
  delay: number
  className?: string
}) {
  return (
    // The mask clips descenders, so the box grows by a slice of the em and
    // pulls the next line back up by the same amount.
    <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
      <span
        className={cn("home-line block", className)}
        style={{ animationDelay: `${delay}ms` }}
      >
        {children}
      </span>
    </span>
  )
}

function InstallCommand({ command }: { command: string }) {
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  return (
    <div className="flex w-full max-w-[min(34rem,100%)] items-center gap-1 rounded-xl border border-border/70 bg-card/60 py-1 ps-3 pe-1 text-start shadow-xs backdrop-blur-md">
      <span
        aria-hidden
        className="shrink-0 font-mono text-xs text-muted-foreground/70 select-none"
      >
        $
      </span>
      {/* The line is a few characters too long for a phone, and a command cut
          off mid-word reads as broken — so it wraps at its spaces below `sm`
          and goes back to a single line once there is room. */}
      <code className="min-w-0 flex-1 py-1.5 font-mono text-xs text-foreground sm:[scrollbar-width:none] sm:overflow-x-auto sm:text-[0.8rem] sm:whitespace-nowrap sm:[&::-webkit-scrollbar]:hidden">
        {command}
      </code>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Copy install command"
              onClick={async () => {
                if (await copyToClipboard(command)) {
                  toast.add({
                    title: "Copied install command",
                    type: "success",
                  })
                }
              }}
            />
          }
        >
          <HugeiconsIcon
            icon={isCopied ? Tick02Icon : Copy01Icon}
            strokeWidth={2}
          />
        </TooltipTrigger>
        <TooltipContent>{isCopied ? "Copied" : "Copy command"}</TooltipContent>
      </Tooltip>
    </div>
  )
}

export interface HeroStat {
  label: string
  value: number
}

export function HomeHero({
  command,
  stats,
  browseHref,
}: {
  /** Ready-to-paste `npx shadcn add` line for a representative item. */
  command: string
  stats: HeroStat[]
  /** Registry item the primary call to action opens. */
  browseHref: string
}) {
  return (
    <TooltipProvider delay={300}>
      <HeroStyles />
      {/* `overflow-x-clip` rather than `overflow-hidden`: the aurora blobs run
          wider than a phone viewport and would otherwise scroll the page
          sideways, but clipping only the inline axis lets them keep bleeding
          up past the top edge instead of ending on a hard line. */}
      <section className="relative isolate flex w-full flex-col items-center overflow-x-clip px-6 pt-14 pb-16 sm:pt-20 sm:pb-24 lg:pt-28 lg:pb-28">
        {/* Backdrop: a dot grid that fades out toward the edges, with two slow
            washes of brand colour drifting behind it. Purely decorative and
            transform-animated, so it stays cheap under the site effect. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(color-mix(in_oklch,var(--border)_80%,transparent)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,#000,transparent)] bg-size-[22px_22px]" />
          <div className="home-aurora absolute start-[8%] -top-24 size-[26rem] rounded-full bg-primary/18 blur-[110px] sm:size-[34rem]" />
          <div
            className="home-aurora absolute end-[6%] -top-10 size-[22rem] rounded-full bg-chart-1/25 blur-[110px] sm:size-[30rem]"
            style={{ animationDelay: "-11s" }}
          />
        </div>

        <div className="home-rise mb-6" style={{ animationDelay: "80ms" }}>
          <Announcement />
        </div>

        <h1 className="max-w-4xl text-center font-heading text-[2.5rem] leading-[1.04] font-medium tracking-tighter text-balance text-foreground sm:text-6xl lg:text-7xl">
          <Line delay={120}>Ship AI interfaces</Line>
          <Line
            delay={220}
            className="bg-[linear-gradient(100deg,var(--foreground)_0%,var(--primary)_52%,color-mix(in_oklch,var(--primary),white_38%)_100%)] bg-clip-text text-transparent"
          >
            that feel considered.
          </Line>
        </h1>

        <p
          className="home-rise mt-6 max-w-xl text-center text-base text-pretty text-muted-foreground sm:text-lg"
          style={{ animationDelay: "420ms" }}
        >
          A shadcn registry of chat surfaces, code and audio UI, and the
          primitives underneath — built on Base UI and Tailwind v4, with dark
          mode and RTL from the first line. Install a piece, own the code.
        </p>

        <div
          className="home-rise mt-8 flex flex-wrap items-center justify-center gap-2"
          style={{ animationDelay: "520ms" }}
        >
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href={browseHref} />}
            className="group/cta"
          >
            Browse the registry
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              strokeWidth={2}
              className="transition-transform duration-200 group-hover/cta:translate-x-0.5 rtl:rotate-180 rtl:group-hover/cta:-translate-x-0.5"
            />
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<Link href="/tokens" />}
          >
            <HugeiconsIcon icon={PaintBoardIcon} strokeWidth={2} />
            Design tokens
          </Button>
          <ScrollToComponentsButton />
        </div>

        <div
          className="home-rise mt-8 flex w-full justify-center"
          style={{ animationDelay: "600ms" }}
        >
          <InstallCommand command={command} />
        </div>

        <dl
          className="home-rise mt-12 grid w-full max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/70 sm:grid-cols-4"
          style={{ animationDelay: "700ms" }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-0.5 bg-card/60 px-3 py-4 backdrop-blur-md"
            >
              <dt className="order-2 text-xs text-muted-foreground">
                {stat.label}
              </dt>
              <dd className="order-1 font-heading text-2xl font-medium tracking-tight text-foreground">
                <CountUp value={stat.value} />
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </TooltipProvider>
  )
}
