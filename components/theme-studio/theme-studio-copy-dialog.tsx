"use client"

import { useEffect, useState } from "react"

import { CopyButton } from "@/components/registry/copy-button"
import { DownloadButton } from "@/components/registry/download-button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import type { ThemeStudioState } from "@/lib/theme-studio"

type Source = { code: string; highlighted?: string }

/**
 * `app/globals.css` with the live overrides folded back into the blocks they
 * were authored in — the file to paste over the one in the repo when a look is
 * worth keeping.
 */
export function ThemeStudioCopyDialog({
  open,
  onOpenChange,
  state,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  state: ThemeStudioState
}) {
  const [result, setResult] = useState<{
    /** The state this result was built from; anything else is stale. */
    key: string
    source: Source | null
  } | null>(null)

  // Doubles as the request body, so the file rebuilds whenever a token moves
  // underneath an open dialog.
  const body = JSON.stringify(state)

  useEffect(() => {
    if (!open) return

    let cancelled = false

    fetch("/api/theme-studio", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    })
      .then((response) =>
        response.ok ? response.json() : Promise.reject(new Error("Bad status"))
      )
      .then((data: Source) => {
        if (!cancelled) setResult({ key: body, source: data })
      })
      .catch(() => {
        if (!cancelled) setResult({ key: body, source: null })
      })

    return () => {
      cancelled = true
    }
  }, [open, body])

  // Derived rather than cleared in the effect, so a stale file never flashes
  // up while the next one is still being built.
  const current = result?.key === body ? result : null
  const source = current?.source ?? null
  const failed = current !== null && current.source === null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>globals.css</DialogTitle>
          <DialogDescription>
            Every change you made, written back into the block it belongs to.
            Paste this over{" "}
            <code className="inline text-sm">app/globals.css</code> to make the
            look permanent — until then it lives in this browser only.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          {source && (
            <div className="absolute end-3 top-3 z-10 flex items-center gap-1">
              <DownloadButton content={source.code} name="globals.css" />
              <CopyButton content={source.code} />
            </div>
          )}

          {source ? (
            source.highlighted ? (
              <div
                className="no-scrollbar max-h-[55vh] overflow-auto rounded-lg border bg-muted/40 font-mono text-sm"
                dangerouslySetInnerHTML={{ __html: source.highlighted }}
              />
            ) : (
              <pre className="no-scrollbar max-h-[55vh] overflow-auto rounded-lg border bg-muted/40 p-4">
                <code className="font-mono text-sm text-muted-foreground">
                  {source.code}
                </code>
              </pre>
            )
          ) : (
            <div className="flex h-40 items-center justify-center gap-2 rounded-lg border bg-muted/40 text-sm text-muted-foreground">
              {failed ? (
                "Could not read the stylesheet."
              ) : (
                <>
                  <Spinner />
                  Building the file…
                </>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
