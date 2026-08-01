"use client"

import * as React from "react"
import { AlertCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { BlockViewer } from "@/components/registry/block-viewer"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status"
import { getItem } from "@/lib/items"
import type { Component } from "@/lib/registry"
import type {
  FileTree,
  HighlightedRegistryFile,
  RegistryItemWithFiles,
} from "@/lib/registry-server"
import { getPrompt } from "@/lib/utils"

interface ItemDetails {
  item: RegistryItemWithFiles
  tree: FileTree[]
  highlightedFiles: HighlightedRegistryFile[]
  baseUrl: string
}

/** One fetch per item per session — reopening a card is instant. */
const detailsCache = new Map<string, Promise<ItemDetails>>()

function fetchDetails(name: string): Promise<ItemDetails> {
  const cached = detailsCache.get(name)
  if (cached) return cached

  const request = fetch(`/api/registry-item/${name}`).then(async (response) => {
    if (!response.ok) throw new Error(`Failed to load "${name}"`)
    return (await response.json()) as ItemDetails
  })
  // A failed fetch shouldn't poison the cache — dropping it lets reopening
  // the card retry.
  request.catch(() => detailsCache.delete(name))
  detailsCache.set(name, request)
  return request
}

export function ItemDetailsDialog({
  item,
  exampleName,
  onOpenChange,
}: {
  /** The registry item to show, or `null` when the dialog is closed. */
  item: Component | null
  /**
   * Registry item the block viewer loads — its files, preview and install
   * command. Defaults to `item.name`; the home showcase points this at the
   * `registry:example` entry whose file is the demo rendered on the card, so
   * the dialog shows that same demo while the header keeps the primitive's
   * own title, icon and description.
   */
  exampleName?: string
  onOpenChange: (open: boolean) => void
}) {
  const [state, setState] = React.useState<{
    name: string | undefined
    details: ItemDetails | null
    failed: boolean
  }>({ name: undefined, details: null, failed: false })

  const name = item ? (exampleName ?? item.name) : undefined
  const meta = item ? getItem(item.name) : undefined

  // A different item means stale details — reset during render rather than in
  // the effect, so the old item's code never paints under the new title.
  if (state.name !== name) {
    setState({ name, details: null, failed: false })
  }

  React.useEffect(() => {
    if (!name) return
    fetchDetails(name)
      .then((data) => {
        setState((current) =>
          current.name === name ? { ...current, details: data } : current
        )
      })
      .catch(() => {
        setState((current) =>
          current.name === name ? { ...current, failed: true } : current
        )
      })
  }, [name])

  const { details, failed } = state

  return (
    <Dialog open={item !== null} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[calc(100svh-3rem)] flex-col gap-4 overflow-hidden sm:max-w-[min(1500px,calc(100%-3rem))]">
        {item && (
          <>
            <DialogHeader className="pe-10">
              <DialogTitle className="flex items-center gap-2">
                {meta && (
                  <HugeiconsIcon
                    icon={meta.icon}
                    strokeWidth={2}
                    className="size-4 shrink-0"
                  />
                )}
                {item.title}
                {meta?.isNew && (
                  <Status
                    variant="brand"
                    className="border-transparent bg-transparent px-0"
                  >
                    <StatusIndicator />
                    <StatusLabel>New</StatusLabel>
                  </Status>
                )}
              </DialogTitle>
              {item.description && (
                <DialogDescription className="max-w-prose">
                  {item.description}
                </DialogDescription>
              )}
            </DialogHeader>

            <div className="min-h-0 flex-1 overflow-y-auto lg:overflow-hidden">
              {details ? (
                <BlockViewer
                  item={details.item}
                  tree={details.tree}
                  highlightedFiles={details.highlightedFiles}
                  baseUrl={details.baseUrl}
                  prompt={getPrompt()}
                  iframeHeight="100%"
                />
              ) : failed ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                  <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} />
                  <p className="text-sm">
                    Couldn’t load this item — close the dialog and try again.
                  </p>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Spinner className="size-5" />
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
