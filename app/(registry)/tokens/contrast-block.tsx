"use client"

import { Moon02Icon, Sun01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Badge } from "@/components/ui/badge"
import { contrastRatio, gradeContrast } from "@/lib/color"
import type { ContrastPair, DesignToken } from "@/lib/design-tokens"
import { cn } from "@/lib/utils"

import type { ResolvedPair } from "./color-block"

type Scheme = "light" | "dark"

function Sample({
  scheme,
  background,
  foreground,
  resolved,
}: {
  scheme: Scheme
  background?: DesignToken
  foreground?: DesignToken
  resolved: Record<string, ResolvedPair>
}) {
  const backgroundValue = background?.[scheme].resolved ?? null
  const foregroundValue = foreground?.[scheme].resolved ?? null

  const backgroundColor = background && resolved[background.name]?.[scheme]
  const foregroundColor = foreground && resolved[foreground.name]?.[scheme]

  const ratio =
    backgroundColor && foregroundColor
      ? contrastRatio(foregroundColor.rgb, backgroundColor.rgb)
      : null
  const grade = ratio === null ? null : gradeContrast(ratio)

  return (
    <div className="flex-1 space-y-1.5">
      <div
        className="flex h-14 items-center justify-center rounded-lg border"
        style={{
          background: backgroundValue ?? undefined,
          color: foregroundValue ?? undefined,
        }}
      >
        <span className="text-lg leading-none font-medium">Aa</span>
      </div>

      <div className="flex items-center gap-1">
        <HugeiconsIcon
          icon={scheme === "light" ? Sun01Icon : Moon02Icon}
          strokeWidth={2}
          className="size-3 shrink-0 text-muted-foreground/50"
        />
        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
          {ratio === null ? "—" : `${ratio.toFixed(2)}:1`}
        </span>
        {grade && (
          <Badge
            variant={grade.pass ? "outline" : "destructive"}
            className={cn("ms-auto h-4 px-1.5 text-[10px]")}
          >
            {grade.label}
          </Badge>
        )}
      </div>
    </div>
  )
}

export function ContrastBlock({
  pair,
  index,
  resolved,
}: {
  pair: ContrastPair
  index: Record<string, DesignToken>
  resolved: Record<string, ResolvedPair>
}) {
  const background = index[pair.background]
  const foreground = index[pair.foreground]

  return (
    <div className="rounded-xl border bg-card p-2.5">
      <div className="mb-2 space-y-0.5">
        <div className="truncate text-sm leading-none font-medium">{pair.label}</div>
        <code
          className="block truncate font-mono text-[11px] text-muted-foreground"
          title={`--${pair.foreground} on --${pair.background}`}
        >
          --{pair.foreground} on --{pair.background}
        </code>
      </div>

      <div className="flex gap-2">
        <Sample
          scheme="light"
          background={background}
          foreground={foreground}
          resolved={resolved}
        />
        <Sample
          scheme="dark"
          background={background}
          foreground={foreground}
          resolved={resolved}
        />
      </div>
    </div>
  )
}
