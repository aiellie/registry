import Link from "next/link"
import { ArrowRight01Icon, GithubIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { CopyButton } from "@/components/registry/copy-button"
import { Reveal } from "@/components/registry/reveal"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface CtaStep {
  title: string
  /** Raw text placed on the clipboard by the step's copy button. */
  code: string
  /** Shiki output for `code`, highlighted on the server. */
  html?: string
  /** Takes the larger share of the row — for the step with the longer lines. */
  wide?: boolean
}

function Step({ step, index }: { step: CtaStep; index: number }) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-2.5",
        step.wide ? "sm:col-span-3" : "sm:col-span-2"
      )}
    >
      <div className="flex items-center gap-2">
        <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/10 font-mono text-[0.7rem] text-primary tabular-nums">
          {index + 1}
        </span>
        <p className="text-sm font-medium text-foreground">{step.title}</p>
      </div>

      <div className="relative min-w-0 rounded-xl border border-border/70 bg-background/60 backdrop-blur-md">
        {/* Sits above the scrollport so a long line scrolls under it. */}
        <div className="absolute end-1.5 top-1.5 z-10">
          <CopyButton content={step.code} />
        </div>
        {step.html ? (
          <div
            className="no-scrollbar min-w-0 overflow-x-auto pe-10 font-mono text-xs [&_pre]:py-3"
            dangerouslySetInnerHTML={{ __html: step.html }}
          />
        ) : (
          <pre className="no-scrollbar min-w-0 overflow-x-auto px-4 py-3 pe-10">
            <code className="font-mono text-xs text-muted-foreground">
              {step.code}
            </code>
          </pre>
        )}
      </div>
    </div>
  )
}

/**
 * Closing panel: the two commands that take someone from this page to a
 * component in their own codebase, with nothing between them.
 */
export function HomeCta({
  steps,
  browseHref,
  repoUrl,
  className,
}: {
  steps: CtaStep[]
  browseHref: string
  repoUrl?: string
  className?: string
}) {
  return (
    <section
      aria-label="Get started"
      className={cn("w-full px-4 py-16 sm:px-6 sm:py-20 lg:px-8", className)}
    >
      <Reveal className="mx-auto w-full max-w-5xl">
        <div className="style-lyra:rounded-none style-sera:rounded-none relative isolate overflow-hidden rounded-3xl border border-border/70 bg-card/50 px-6 py-10 backdrop-blur-md sm:px-10 sm:py-14">
          {/* Decorative: a brand wash anchored to the top edge, and the same
              dot grid the hero uses so the page closes the way it opened. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(color-mix(in_oklch,var(--border)_80%,transparent)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000,transparent)] bg-size-[22px_22px]" />
            <div className="absolute start-1/2 -top-32 size-[24rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[100px] rtl:translate-x-1/2" />
          </div>

          <div className="text-center">
            <h2 className="font-heading text-3xl font-medium tracking-tighter text-balance text-foreground sm:text-4xl">
              Two commands and it&rsquo;s yours.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-pretty text-muted-foreground">
              The CLI copies real source files into your project. No runtime
              package, no version to chase — edit them like you wrote them.
            </p>
          </div>

          <div className="mt-8 grid gap-5 text-start sm:grid-cols-5">
            {steps.map((step, index) => (
              <Step key={step.title} step={step} index={index} />
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
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
            {repoUrl && (
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                render={
                  <a href={repoUrl} target="_blank" rel="noreferrer noopener" />
                }
              >
                <HugeiconsIcon icon={GithubIcon} strokeWidth={2} />
                Source on GitHub
              </Button>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
