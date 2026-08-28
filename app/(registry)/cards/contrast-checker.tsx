"use client"

import * as React from "react"
import {
  ArrowDataTransferHorizontalIcon,
  Cancel01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { ColorPicker } from "@/components/design/color-picker"
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
import {
  Status,
  StatusIndicator,
  StatusLabel,
} from "@/components/aiellie/ui/status"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const PRESETS = [
  { name: "Brand", fg: "#ffffff", bg: "#4f46e5" },
  { name: "Ink", fg: "#0a0a0a", bg: "#fafafa" },
  { name: "Warn", fg: "#422006", bg: "#facc15" },
  { name: "Danger", fg: "#ffffff", bg: "#dc2626" },
]

/** #rgb / #rrggbb → 0-255 channels. Anything else falls back to black so a
 * half-typed value can never throw mid-render. */
function parseHex(value: string): [number, number, number] {
  const hex = value.trim().replace(/^#/, "")
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((char) => char + char)
          .join("")
      : hex
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return [0, 0, 0]
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ]
}

/** WCAG 2.x relative luminance — sRGB channels linearised, then weighted. */
function luminance(color: string) {
  const [r, g, b] = parseHex(color).map((channel) => {
    const c = channel / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** (L1 + 0.05) / (L2 + 0.05), lighter colour first. */
function contrastRatio(a: string, b: string) {
  const la = luminance(a)
  const lb = luminance(b)
  const lighter = Math.max(la, lb)
  const darker = Math.min(la, lb)
  return (lighter + 0.05) / (darker + 0.05)
}

export function ContrastChecker() {
  const [fg, setFg] = React.useState(PRESETS[0].fg)
  const [bg, setBg] = React.useState(PRESETS[0].bg)

  const ratio = contrastRatio(fg, bg)

  // AA/AAA thresholds differ for normal (4.5 / 7) and large (3 / 4.5) text.
  const levels = [
    { level: "AA", size: "Normal text", pass: ratio >= 4.5 },
    { level: "AAA", size: "Normal text", pass: ratio >= 7 },
    { level: "AA", size: "Large text", pass: ratio >= 3 },
    { level: "AAA", size: "Large text", pass: ratio >= 4.5 },
  ]

  const grade =
    ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : ratio >= 3 ? "AA L" : "Fail"
  const passes = ratio >= 4.5

  const swap = () => {
    setFg(bg)
    setBg(fg)
  }

  const pair = [
    { role: "Fg", value: fg, onChange: setFg, label: "Foreground colour" },
    { role: "Bg", value: bg, onChange: setBg, label: "Background colour" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contrast Checker</CardTitle>
        <CardDescription>WCAG 2.2 · relative luminance</CardDescription>
        <CardAction>
          <Status variant={passes ? "success" : "error"}>
            <StatusIndicator />
            <StatusLabel>{grade}</StatusLabel>
          </Status>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <div
          className="flex flex-col gap-1 rounded-lg p-4"
          style={{ backgroundColor: bg, color: fg }}
        >
          <span className="truncate font-heading text-2xl leading-8 font-medium tracking-tight">
            Grumpy wizards
          </span>
          <span className="truncate text-xs leading-4 opacity-80">
            The quick brown fox jumps over the lazy dog.
          </span>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Contrast ratio
            </span>
            <span className="font-heading text-3xl leading-8 font-medium tracking-tight tabular-nums">
              {ratio.toFixed(2)}:1
            </span>
          </div>
          <span className="shrink-0 pb-1 font-mono text-[11px] text-muted-foreground tabular-nums">
            min 4.5:1
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {levels.map((level) => (
            <div
              key={`${level.level}-${level.size}`}
              className={cn(
                "flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 ring-1 ring-inset",
                level.pass
                  ? "bg-success/10 ring-success/15"
                  : "bg-destructive/10 ring-destructive/15"
              )}
            >
              <div className="flex min-w-0 flex-col gap-1">
                <span className="font-heading text-xs leading-none font-medium">
                  {level.level}
                </span>
                <span className="truncate text-[10px] leading-none text-muted-foreground">
                  {level.size}
                </span>
              </div>
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full",
                  level.pass
                    ? "bg-success/15 text-success"
                    : "bg-destructive/15 text-destructive"
                )}
              >
                <HugeiconsIcon
                  icon={level.pass ? Tick02Icon : Cancel01Icon}
                  strokeWidth={2}
                  className="size-3"
                />
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 rounded-lg border p-2">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            {pair.map((item) => (
              <div key={item.role} className="flex items-center gap-2">
                <ColorPicker
                  label={item.label}
                  value={item.value}
                  onValueChange={item.onChange}
                  hideValue
                  className="**:size-4 **:rounded-[5px]"
                />
                <span className="w-5 shrink-0 text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                  {item.role}
                </span>
                <span className="truncate font-mono text-[11px] uppercase">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Swap foreground and background"
                  onClick={swap}
                />
              }
            >
              <HugeiconsIcon
                icon={ArrowDataTransferHorizontalIcon}
                strokeWidth={2}
                className="rtl:rotate-180"
              />
            </TooltipTrigger>
            <TooltipContent>Swap foreground and background</TooltipContent>
          </Tooltip>
        </div>
      </CardContent>

      <CardFooter className="gap-1.5">
        {PRESETS.map((preset) => (
          <Button
            key={preset.name}
            variant="outline"
            size="xs"
            className="flex-1"
            onClick={() => {
              setFg(preset.fg)
              setBg(preset.bg)
            }}
          >
            <span
              aria-hidden
              className="size-2.5 rounded-full ring-1 ring-foreground/15 ring-inset"
              style={{ backgroundColor: preset.bg }}
            />
            {preset.name}
          </Button>
        ))}
      </CardFooter>
    </Card>
  )
}
