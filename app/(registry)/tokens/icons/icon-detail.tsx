"use client"

import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import {
  type CompactElement,
  type IconEntry,
  toSvgElement,
  toSvgMarkup,
} from "@/lib/hugeicons"

/** The sizes this system actually uses, so legibility can be judged at a glance. */
const PREVIEW_SIZES = [16, 20, 24, 32, 48]

function CopyRow({ label, value }: { label: string; value: string }) {
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={async () => {
            const copied = await copyToClipboard(value)
            if (copied) toast.success(`Copied ${label.toLowerCase()}`)
            else toast.error("Couldn’t reach the clipboard")
          }}
        >
          <HugeiconsIcon
            icon={isCopied ? Tick02Icon : Copy01Icon}
            strokeWidth={2}
            className="size-3.5"
          />
          Copy
        </Button>
      </div>
      <pre className="overflow-x-auto rounded-lg border bg-muted/40 p-2.5 font-mono text-xs leading-relaxed">
        {value}
      </pre>
    </div>
  )
}

export function IconDetail({
  entry,
  elements,
  strokeWidth,
  onOpenChange,
}: {
  entry: IconEntry | null
  elements: CompactElement[] | undefined
  strokeWidth: number
  onOpenChange: (open: boolean) => void
}) {
  const icon = elements ? toSvgElement(elements) : null

  return (
    <Dialog open={entry !== null} onOpenChange={onOpenChange}>
      {/*
        DialogContent is a grid, so its items default to `min-width: auto` and the
        long single-line SVG below would stretch the whole dialog instead of
        scrolling inside it. `min-w-0` lets the tracks shrink so `overflow-x-auto`
        actually engages.
      */}
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg [&>*]:min-w-0">
        {entry && (
          <>
            <DialogHeader>
              <DialogTitle className="font-mono text-base">{entry.name}</DialogTitle>
              <DialogDescription>
                {entry.words} · stroke rounded · 24×24
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-end justify-center gap-5 rounded-xl border bg-muted/30 py-6">
              {icon ? (
                PREVIEW_SIZES.map((size) => (
                  <div key={size} className="flex flex-col items-center gap-2">
                    <HugeiconsIcon
                      icon={icon}
                      size={size}
                      strokeWidth={strokeWidth}
                    />
                    <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                      {size}
                    </span>
                  </div>
                ))
              ) : (
                <div className="h-12 animate-pulse text-sm text-muted-foreground">
                  Loading…
                </div>
              )}
            </div>

            {entry.aliases.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Also known as</span>
                {entry.aliases.map((alias) => (
                  <Badge key={alias} variant="secondary" className="font-mono text-xs">
                    {alias}
                  </Badge>
                ))}
              </div>
            )}

            <div className="space-y-3">
              <CopyRow
                label="Import"
                value={`import { ${entry.name} } from "@hugeicons/core-free-icons"`}
              />
              <CopyRow
                label="JSX"
                value={`<HugeiconsIcon icon={${entry.name}} strokeWidth={${strokeWidth}} className="size-4" />`}
              />
              {elements && (
                <CopyRow label="SVG" value={toSvgMarkup(elements, strokeWidth)} />
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
