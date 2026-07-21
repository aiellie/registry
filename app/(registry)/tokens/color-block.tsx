"use client"

import type { CSSProperties } from "react"
import { Copy01Icon, Moon02Icon, Sun01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import type { ResolvedColor } from "@/lib/color"
import type { DesignToken, TokenValue } from "@/lib/design-tokens"
import { cn } from "@/lib/utils"

export type ValueFormat = "source" | "hex"

export type ResolvedPair = {
  light: ResolvedColor | null
  dark: ResolvedColor | null
}

/** Bottom-right half of the swatch, so one square can show both themes. */
const DARK_HALF = "polygon(100% 0, 100% 100%, 0 100%)"

/** Makes translucent tokens like `--sidebar-accent` legible instead of near-invisible. */
const CHECKERBOARD: CSSProperties = {
  backgroundImage:
    "linear-gradient(45deg, var(--muted) 25%, transparent 25%), linear-gradient(-45deg, var(--muted) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--muted) 75%), linear-gradient(-45deg, transparent 75%, var(--muted) 75%)",
  backgroundSize: "8px 8px",
  backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0",
}

const HATCH: CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(45deg, var(--muted-foreground) 0 1px, transparent 1px 5px)",
  opacity: 0.4,
}

export function humanize(name: string) {
  const [first, ...rest] = name.split("-")
  return [first.charAt(0).toUpperCase() + first.slice(1), ...rest].join(" ")
}

export function Swatch({
  light,
  dark,
  className,
}: {
  light: string | null
  dark: string | null
  className?: string
}) {
  const split = light !== dark

  return (
    <div
      className={cn("relative shrink-0 overflow-hidden rounded-lg border", className)}
      style={CHECKERBOARD}
    >
      {light ? (
        <div className="absolute inset-0" style={{ background: light }} />
      ) : (
        <div className="absolute inset-0" style={HATCH} />
      )}

      {split &&
        (dark ? (
          <div
            className="absolute inset-0"
            style={{ background: dark, clipPath: DARK_HALF }}
          />
        ) : (
          <div className="absolute inset-0" style={{ ...HATCH, clipPath: DARK_HALF }} />
        ))}
    </div>
  )
}

function ValueRow({
  scheme,
  value,
  color,
  format,
}: {
  scheme: "light" | "dark"
  value: TokenValue
  color: ResolvedColor | null
  format: ValueFormat
}) {
  const undefinedReference = value.resolved === null
  const display = undefinedReference
    ? value.raw
    : format === "hex"
      ? (color?.hex ?? value.raw)
      : value.raw

  return (
    <div className="flex items-center gap-1.5">
      <HugeiconsIcon
        icon={scheme === "light" ? Sun01Icon : Moon02Icon}
        strokeWidth={2}
        className="size-3 shrink-0 text-muted-foreground/50"
      />
      <code
        className={cn(
          "truncate font-mono text-[11px] text-muted-foreground",
          undefinedReference && "text-destructive"
        )}
        title={display}
      >
        {display}
      </code>
      {color && color.alpha < 1 && (
        <span className="shrink-0 font-mono text-[10px] text-muted-foreground/70">
          {Math.round(color.alpha * 100)}%
        </span>
      )}
    </div>
  )
}

export function ColorBlock({
  token,
  resolved,
  format,
}: {
  token: DesignToken
  resolved?: ResolvedPair
  format: ValueFormat
}) {
  const { copyToClipboard, isCopied } = useCopyToClipboard()
  const variable = `--${token.name}`
  const broken = token.light.resolved === null

  return (
    <button
      type="button"
      onClick={async () => {
        const copied = await copyToClipboard(`var(${variable})`)
        if (copied) toast.success(`Copied var(${variable})`)
        else toast.error("Couldn’t reach the clipboard")
      }}
      className="group flex w-full items-start gap-3 rounded-xl border bg-card p-2.5 text-start transition-colors hover:border-ring hover:bg-accent/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Swatch
        className="size-12"
        light={token.light.resolved}
        dark={token.dark.resolved}
      />

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm leading-none font-medium">
            {humanize(token.name)}
          </span>
          {broken ? (
            <Badge variant="destructive" className="h-4 shrink-0 px-1.5 text-[10px]">
              undefined
            </Badge>
          ) : (
            token.light.alias && (
              <Badge variant="outline" className="h-4 shrink-0 px-1.5 text-[10px]">
                alias
              </Badge>
            )
          )}
        </div>

        <code className="block truncate font-mono text-xs text-foreground/70">
          {variable}
        </code>

        <div className="space-y-0.5 pt-0.5">
          <ValueRow
            scheme="light"
            value={token.light}
            color={resolved?.light ?? null}
            format={format}
          />
          <ValueRow
            scheme="dark"
            value={token.dark}
            color={resolved?.dark ?? null}
            format={format}
          />
        </div>
      </div>

      <HugeiconsIcon
        icon={isCopied ? Tick02Icon : Copy01Icon}
        strokeWidth={2}
        className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      />
    </button>
  )
}
