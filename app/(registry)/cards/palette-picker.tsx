"use client"

import * as React from "react"

import {
  ArrowReloadHorizontalIcon,
  Copy01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/**
 * Seeded from the theme's own custom properties rather than literal colors, so
 * the card follows light/dark and a consumer's retheme. A swatch only becomes a
 * hex once it has actually been edited.
 */
const TOKENS = [
  { label: "Primary", token: "--primary" },
  { label: "Accent", token: "--accent" },
  { label: "Ring", token: "--ring" },
  { label: "Destructive", token: "--destructive" },
]

const RAMP = [
  "--chart-1",
  "--chart-2",
  "--chart-3",
  "--chart-4",
  "--chart-5",
  "--foreground",
]

export function PalettePicker() {
  const [edits, setEdits] = React.useState<Record<string, string>>({})

  const editToken = (token: string) => (value: string) =>
    setEdits((prev) => ({ ...prev, [token]: value }))

  const colorOf = (token: string) => edits[token] ?? `var(${token})`

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="truncate">Brand palette</CardTitle>
        <CardDescription className="truncate">
          {TOKENS.length} tokens · {RAMP.length} ramp steps
        </CardDescription>
        <CardAction>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  aria-label="Reset palette"
                  onClick={() => setEdits({})}
                  size="icon-sm"
                  variant="ghost"
                >
                  <HugeiconsIcon
                    icon={ArrowReloadHorizontalIcon}
                    strokeWidth={2}
                  />
                </Button>
              }
            />
            <TooltipContent>Reset palette</TooltipContent>
          </Tooltip>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5">
        <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
          Tokens
        </span>
        {TOKENS.map((entry) => (
          <div
            className="flex h-9 items-center justify-between gap-3 rounded-lg bg-muted/60 px-3 transition-colors hover:bg-muted"
            key={entry.token}
          >
            <span className="min-w-0 truncate text-[12.5px] font-medium text-foreground/90">
              {entry.label}
            </span>
            <ColorPicker
              className="shrink-0"
              // Until it is edited the row reads as the token it came from,
              // rather than a hex that would go stale on a retheme.
              displayValue={edits[entry.token] ? undefined : entry.token}
              label={entry.label}
              onValueChange={editToken(entry.token)}
              value={colorOf(entry.token)}
            />
          </div>
        ))}
      </CardContent>
      <CardContent className="flex flex-col gap-2">
        <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
          Ramp
        </span>
        <div className="flex items-center justify-between gap-1">
          {RAMP.map((token, index) => (
            <ColorPicker
              className="shrink-0 **:size-7"
              hideValue
              key={token}
              label={`Ramp step ${index + 1}`}
              onValueChange={editToken(token)}
              value={colorOf(token)}
            />
          ))}
        </div>
        <div
          aria-label="Palette preview"
          className="flex h-6 overflow-hidden rounded-md ring-1 ring-foreground/10"
          role="img"
        >
          {RAMP.map((token) => (
            <div
              className="flex-1"
              key={token}
              style={{ background: colorOf(token) }}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="outline">
          <HugeiconsIcon
            data-icon="inline-start"
            icon={Copy01Icon}
            strokeWidth={2}
          />
          Copy theme.css
        </Button>
      </CardFooter>
    </Card>
  )
}
