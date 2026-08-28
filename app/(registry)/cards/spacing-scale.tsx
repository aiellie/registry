"use client"

import * as React from "react"
import { RefreshIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/components/ui/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const STEPS = [1, 2, 3, 4, 6, 8, 12]

const RADII = [
  { label: "sm", className: "rounded-sm", rem: "0.25rem" },
  { label: "md", className: "rounded-md", rem: "0.5rem" },
  { label: "lg", className: "rounded-lg", rem: "0.625rem" },
  { label: "xl", className: "rounded-xl", rem: "0.875rem" },
]

/** The stock `--spacing`, and the range the density slider may roam. */
const DEFAULT_SPACING = 0.25

export function SpacingScale() {
  const [spacing, setSpacing] = React.useState(DEFAULT_SPACING)
  const [radius, setRadius] = React.useState<string | null>(null)
  const { copyToClipboard } = useCopyToClipboard()

  const isDefault = Math.abs(spacing - DEFAULT_SPACING) < 0.001

  const copy = async (value: string, label: string) => {
    const ok = await copyToClipboard(value)
    toast.add({
      title: ok ? `Copied ${label}` : "Couldn't reach the clipboard",
      type: ok ? "success" : "error",
    })
  }

  const selectedRadius = RADII.find((item) => item.label === radius)

  return (
    <Card
      // Scoped to this card only — the slider must never leak into the rest of
      // the page, so `--spacing` is set here rather than on the document.
      style={{ "--spacing": `${spacing}rem` } as React.CSSProperties}
    >
      <CardHeader>
        <CardTitle>Spacing &amp; Radius</CardTitle>
        <CardDescription>
          One <span className="font-mono text-xs">--spacing</span> knob scales
          every gap, pad and size.
        </CardDescription>
        <CardAction>
          <Badge variant="secondary" className="font-mono tabular-nums">
            {spacing.toFixed(3).replace(/0+$/, "").replace(/\.$/, "")}rem
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="shrink-0 text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Density
          </span>
          <Slider
            value={[spacing]}
            min={0.15}
            max={0.4}
            step={0.01}
            aria-label="Spacing density"
            onValueChange={(value) => setSpacing((value as number[])[0])}
            className="min-w-0 flex-1"
          />
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Reset spacing to the default"
                  disabled={isDefault}
                  onClick={() => setSpacing(DEFAULT_SPACING)}
                />
              }
            >
              <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} />
            </TooltipTrigger>
            <TooltipContent>Reset density</TooltipContent>
          </Tooltip>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Spacing
            </span>
            <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
              {STEPS.length} steps
            </span>
          </div>
          <div className="flex flex-col gap-2.5 rounded-lg bg-muted/50 p-3">
            {STEPS.map((step) => {
              const rem = step * spacing
              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => void copy(`p-${step}`, `p-${step}`)}
                  className="flex cursor-pointer items-center gap-3 rounded-md text-start outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <span className="w-5 shrink-0 font-mono text-[11px] leading-4 text-muted-foreground tabular-nums">
                    {step}
                  </span>
                  <span className="flex min-w-0 flex-1 items-center">
                    <span
                      className="h-2.5 rounded-sm bg-primary transition-[width] duration-150"
                      style={{ width: `${rem * 16}px` }}
                    />
                  </span>
                  <span className="w-14 shrink-0 text-end font-mono text-[11px] leading-4 text-muted-foreground tabular-nums">
                    {rem.toFixed(2)}rem
                  </span>
                  <span className="w-8 shrink-0 text-end font-mono text-[11px] leading-4 tabular-nums">
                    {Math.round(rem * 16)}px
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Radius
            </span>
            <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
              {RADII.length} steps
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {RADII.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setRadius(item.label)
                  void copy(`rounded-${item.label}`, `rounded-${item.label}`)
                }}
                aria-pressed={radius === item.label}
                className="flex min-w-0 cursor-pointer flex-col gap-1.5 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <span
                  className={cn(
                    "h-12 w-full ring-1 transition-colors ring-inset",
                    item.className,
                    radius === item.label
                      ? "bg-primary/25 ring-primary/40"
                      : "bg-primary/10 ring-primary/20"
                  )}
                />
                <span className="truncate text-center font-mono text-[10px] leading-none text-muted-foreground">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="justify-between gap-2">
        <span className="truncate font-mono text-xs text-muted-foreground">
          {selectedRadius ? `rounded-${selectedRadius.label}` : "--radius"}
        </span>
        <span className="shrink-0 font-mono text-xs tabular-nums">
          {selectedRadius ? selectedRadius.rem : "0.875rem"}
        </span>
      </CardFooter>
    </Card>
  )
}
