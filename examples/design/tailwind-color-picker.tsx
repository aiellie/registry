"use client"

import * as React from "react"

import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  TAILWIND_SHADES,
  TailwindColorPicker,
  TailwindSwatch,
  getTailwindColor,
} from "@/components/design/tailwind-color-picker"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/** The three ways a picked colour tends to get pasted somewhere else. */
function notations(name: string, value: string) {
  return [
    { label: "Class", text: `bg-${name}` },
    { label: "Variable", text: `var(--color-${name})` },
    { label: "Value", text: value },
  ]
}

function CopyRow({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(timer)
  }, [copied])

  return (
    <div className="flex items-center gap-2">
      <span className="w-14 shrink-0 text-xs text-muted-foreground">
        {label}
      </span>
      <code className="min-w-0 flex-1 truncate font-mono text-xs">{text}</code>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label={`Copy ${label.toLowerCase()}`}
                // Only confirm once the write lands — a blocked clipboard
                // should leave the button offering to copy rather than lie.
                onClick={() => {
                  navigator.clipboard
                    .writeText(text)
                    .then(() => setCopied(true))
                    .catch(() => setCopied(false))
                }}
              />
            }
          >
            <HugeiconsIcon
              aria-hidden
              className="size-3.5"
              icon={copied ? Tick02Icon : Copy01Icon}
              strokeWidth={2}
            />
          </TooltipTrigger>
          <TooltipContent>
            {copied ? "Copied" : `Copy ${label.toLowerCase()}`}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export function TailwindColorsDemo() {
  const [name, setName] = React.useState<string | null>("sky-500")
  const color = name ? getTailwindColor(name) : undefined

  // `black` and `white` have no ramp to lay out beneath them.
  const ramp =
    color && color.shade
      ? TAILWIND_SHADES.map((shade) => `${color.family}-${shade}`)
      : []

  return (
    <div className="flex w-full max-w-sm flex-col gap-5 py-8">
      <TailwindColorPicker value={name} onValueChange={setName} />

      {color ? (
        <div className="flex flex-col gap-4 rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <TailwindSwatch color={color} className="size-10 rounded-lg" />
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{color.name}</div>
              <div className="truncate text-xs text-muted-foreground capitalize">
                {color.family}
                {color.shade ? ` · ${color.shade}` : null}
              </div>
            </div>
          </div>

          {ramp.length > 0 && (
            <div className="flex gap-1">
              {ramp.map((step) => (
                <TooltipProvider key={step}>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <button
                          type="button"
                          aria-label={step}
                          aria-pressed={step === color.name}
                          onClick={() => setName(step)}
                          className="flex-1 cursor-pointer transition-transform active:scale-95"
                        />
                      }
                    >
                      <TailwindSwatch
                        color={getTailwindColor(step)}
                        className={
                          step === color.name
                            ? "h-8 w-full ring-2 ring-foreground"
                            : "h-8 w-full"
                        }
                      />
                    </TooltipTrigger>
                    <TooltipContent>{step}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-1">
            {notations(color.name, color.value).map((notation) => (
              <CopyRow key={notation.label} {...notation} />
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          Pick a color to see its class, variable and value.
        </div>
      )}
    </div>
  )
}
