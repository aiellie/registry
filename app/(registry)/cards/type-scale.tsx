"use client"

import * as React from "react"
import { ArrowReloadHorizontalIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const DEFAULT_SCALE = 1

/** `size` is the unscaled px of the step; `leading` its unitless ratio. */
const specimens = [
  {
    name: "Display",
    sample: "Design",
    size: 30,
    leading: 1.25,
    utility: "text-3xl leading-tight font-medium tracking-tight",
    className: "text-3xl leading-tight font-medium tracking-tight",
  },
  {
    name: "Heading",
    sample: "Section heading",
    size: 20,
    leading: 1.375,
    utility: "text-xl leading-snug font-medium",
    className: "text-xl leading-snug font-medium",
  },
  {
    name: "Body",
    sample: "The quick brown fox jumps",
    size: 14,
    leading: 1.5,
    utility: "text-sm leading-normal",
    className: "text-sm leading-normal",
  },
  {
    name: "Caption",
    sample: "Supporting caption copy",
    size: 12,
    leading: 1.5,
    utility: "text-xs leading-normal text-muted-foreground",
    className: "text-xs leading-normal text-muted-foreground",
  },
  {
    name: "Label",
    sample: "Overline label",
    size: 12,
    leading: 1.5,
    utility: "text-xs font-medium tracking-wider uppercase",
    className: "text-xs font-medium tracking-wider uppercase",
  },
]

const fonts = [
  { value: "sans", label: "Sans", className: "font-sans" },
  { value: "heading", label: "Heading", className: "font-heading" },
  { value: "mono", label: "Mono", className: "font-mono" },
]

export function TypeScale() {
  const [scale, setScale] = React.useState(DEFAULT_SCALE)
  const [font, setFont] = React.useState("sans")
  const [selected, setSelected] = React.useState<string | null>(null)
  const { copyToClipboard } = useCopyToClipboard()

  const fontClass =
    fonts.find((item) => item.value === font)?.className ?? "font-sans"

  async function copyUtility(specimen: (typeof specimens)[number]) {
    setSelected(specimen.name)
    const copied = await copyToClipboard(specimen.utility)
    toast.add(
      copied
        ? {
            title: `Copied ${specimen.name} classes`,
            description: specimen.utility,
            type: "success",
          }
        : {
            title: "Could not copy",
            description: "The clipboard is unavailable here.",
            type: "error",
          }
    )
  }

  return (
    <Card style={{ "--text-scale": scale } as React.CSSProperties}>
      <CardHeader>
        <CardTitle>Type Scale</CardTitle>
        <CardDescription>Geist · Geist Mono</CardDescription>
        <CardAction>
          <Badge
            variant="secondary"
            className="font-mono text-[11px] tabular-nums"
          >
            {scale.toFixed(2)}×
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-2.5">
        <ToggleGroup
          size="sm"
          spacing={0}
          variant="outline"
          className="w-full"
          value={[font]}
          onValueChange={(value) => {
            const next = value[0]
            if (next) setFont(String(next))
          }}
        >
          {fonts.map((item) => (
            <ToggleGroupItem
              key={item.value}
              value={item.value}
              className="flex-1"
            >
              {item.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
            Scale
          </span>
          <Slider
            className="min-w-0 flex-1"
            aria-label="Type scale"
            min={0.8}
            max={1.4}
            step={0.05}
            value={[scale]}
            onValueChange={(value) => {
              setScale(Array.isArray(value) ? value[0] : value)
            }}
          />
          <span className="w-9 shrink-0 text-end font-mono text-[11px] text-muted-foreground tabular-nums">
            {scale.toFixed(2)}×
          </span>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Reset the type scale"
                  onClick={() => setScale(DEFAULT_SCALE)}
                />
              }
            >
              <HugeiconsIcon icon={ArrowReloadHorizontalIcon} strokeWidth={2} />
            </TooltipTrigger>
            <TooltipContent>Reset to 1.00×</TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
      <CardContent className="flex flex-col">
        {specimens.map((specimen) => (
          <button
            key={specimen.name}
            type="button"
            aria-pressed={selected === specimen.name}
            onClick={() => void copyUtility(specimen)}
            className={cn(
              "flex cursor-pointer items-baseline justify-between gap-3 border-b border-dashed px-1.5 py-3 text-start outline-none first:pt-0 last:border-b-0 last:pb-0 hover:bg-muted/50 focus-visible:ring-[3px] focus-visible:ring-ring/50",
              selected === specimen.name && "bg-muted/70"
            )}
          >
            <span
              className={cn("min-w-0 truncate", fontClass, specimen.className)}
            >
              {specimen.sample}
            </span>
            <span className="flex shrink-0 items-baseline gap-2">
              <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                {specimen.name}
              </span>
              <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                {Math.round(specimen.size * scale)}/
                {Math.round(specimen.size * scale * specimen.leading)}
              </span>
            </span>
          </button>
        ))}
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <span className="truncate font-mono text-xs text-muted-foreground">
          {selected
            ? specimens.find((item) => item.name === selected)?.utility
            : "--text-scale"}
        </span>
        <span className="shrink-0 font-mono text-xs tabular-nums">
          {scale.toFixed(2)}×
        </span>
      </CardFooter>
    </Card>
  )
}
