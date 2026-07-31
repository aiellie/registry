"use client"

import { type CSSProperties, useEffect, useState } from "react"

import { CopyButton } from "@/components/registry/copy-button"
import { DownloadButton } from "@/components/registry/download-button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { highlightCode } from "@/lib/highlight"
import {
  type CompactElement,
  type IconCategory,
  type IconEntry,
  BRANDS,
  displayName,
  importSnippet,
  jsxSnippet,
  toSvgMarkup,
} from "@/lib/icon-sets"

import { IconGlyph } from "./icon-glyph"

/**
 * Highlights `code` in the browser via the shared Shiki highlighter, returning
 * `null` until the first result is ready (or if it fails) so callers can fall
 * back to plain text.
 */
function useHighlightedCode(code: string, lang = "tsx") {
  const [html, setHtml] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    highlightCode(code, lang)
      .then((result) => {
        if (active) setHtml(result)
      })
      .catch(() => {
        if (active) setHtml(null)
      })
    return () => {
      active = false
    }
  }, [code, lang])

  return html
}

function CopyRow({
  label,
  value,
  language = "tsx",
  download,
}: {
  label: string
  value: string
  language?: string
  /** When set, shows a download button that saves the snippet under this name. */
  download?: string
}) {
  const highlighted = useHighlightedCode(value, language)

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
        <div className="flex items-center gap-0.5">
          {download && <DownloadButton content={value} name={download} />}
          <CopyButton content={value} />
        </div>
      </div>
      {highlighted ? (
        <div
          className="overflow-hidden rounded-xl border text-xs"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      ) : (
        <pre className="overflow-x-auto rounded-xl border p-2.5 font-mono text-xs leading-relaxed">
          {value}
        </pre>
      )}
    </div>
  )
}

export function IconDetail({
  entry,
  elements,
  categories,
  strokeWidth,
  size,
  color,
  onOpenChange,
}: {
  entry: IconEntry | null
  elements: CompactElement[] | undefined
  /** The HugeIcons taxonomy, for labelling `entry.categories`; empty for Lucide. */
  categories: IconCategory[]
  strokeWidth: number
  /** The size chosen by the grid filters; the preview renders at exactly this. */
  size: number
  /** The tint chosen by the filter bar; `null` leaves the icon on `foreground`. */
  color: string | null
  onOpenChange: (open: boolean) => void
}) {
  const labels = entry
    ? entry.categories
        .map((id) => categories.find((category) => category.id === id)?.label)
        .filter((label): label is string => label !== undefined)
    : []

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
              <div className="flex items-center gap-1.5">
                <DialogTitle className="font-mono text-base">
                  {entry.name}
                </DialogTitle>
                <CopyButton content={entry.name} />
              </div>
              <DialogDescription>
                {entry.words} · {BRANDS[entry.brand].label} ·{" "}
                {BRANDS[entry.brand].style} · 24×24
              </DialogDescription>
            </DialogHeader>

            <div
              className="flex items-center justify-center rounded-xl border py-10"
              style={
                { "--icon-tint": color ?? "currentColor" } as CSSProperties
              }
            >
              {elements ? (
                <div className="flex flex-col items-center gap-2">
                  <IconGlyph
                    brand={entry.brand}
                    elements={elements}
                    size={size}
                    strokeWidth={strokeWidth}
                    className="text-[color:var(--icon-tint)]"
                  />
                  <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                    {size}px
                  </span>
                </div>
              ) : (
                <div className="h-12 animate-pulse text-sm text-muted-foreground">
                  Loading…
                </div>
              )}
            </div>

            {labels.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-muted-foreground">
                  Categories
                </span>
                {labels.map((label) => (
                  <Badge key={label} variant="outline" className="text-xs">
                    {label}
                  </Badge>
                ))}
              </div>
            )}

            {entry.aliases.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-muted-foreground">
                  Also known as
                </span>
                {entry.aliases.map((alias) => (
                  <Badge
                    key={alias}
                    variant="secondary"
                    className="font-mono text-xs"
                  >
                    {alias}
                  </Badge>
                ))}
              </div>
            )}

            <div className="space-y-3">
              <CopyRow label="Import" value={importSnippet(entry)} />
              <CopyRow label="JSX" value={jsxSnippet(entry, strokeWidth)} />
              {elements && (
                <CopyRow
                  label="SVG"
                  value={toSvgMarkup(elements, entry.brand, strokeWidth)}
                  language="xml"
                  download={`${displayName(entry)}.svg`}
                />
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
