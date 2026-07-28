"use client"

import * as React from "react"

import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
  Globe02Icon,
  RefreshIcon,
  SidebarRightIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  WebPreview,
  WebPreviewBody,
  WebPreviewMenu,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
} from "@/components/ai-elements/web-preview"
import { useBrandPanels } from "@/components/brand-panels"
import { Button } from "@/components/ui/button"
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useSidebar } from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const RIGHT_PANEL_ID = "sidebar-right"
const RIGHT_PANEL_DEFAULT_SIZE = "20rem"
const RIGHT_PANEL_MIN_SIZE = "15rem"
const RIGHT_PANEL_MAX_SIZE = "30rem"

/** Lets people type `example.com` and still get somewhere. */
function normalizeUrl(input: string) {
  const trimmed = input.trim()
  if (!trimmed) return ""
  return /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`
}

// Served through the proxy so sites that refuse to be framed still load.
const proxyUrl = (url: string) =>
  `/api/web-preview?url=${encodeURIComponent(url)}`

export function BrandSidebarRight({ className }: { className?: string }) {
  const { rightOpen, setRightOpen } = useBrandPanels()
  const { isMobile } = useSidebar()

  const [history, setHistory] = React.useState<{
    entries: string[]
    index: number
  }>({ entries: [], index: -1 })
  const [reloadKey, setReloadKey] = React.useState(0)

  const url = history.index >= 0 ? history.entries[history.index] : ""
  const canGoBack = history.index > 0
  const canGoForward = history.index < history.entries.length - 1

  const navigate = React.useCallback((next: string) => {
    const target = normalizeUrl(next)
    if (!target) return
    setHistory((current) => {
      if (current.entries[current.index] === target) return current
      const entries = [...current.entries.slice(0, current.index + 1), target]
      return { entries, index: entries.length - 1 }
    })
  }, [])

  const go = React.useCallback((delta: number) => {
    setHistory((current) => {
      const index = Math.min(
        current.entries.length - 1,
        Math.max(0, current.index + delta)
      )
      return index === current.index ? current : { ...current, index }
    })
  }, [])

  const panel = (
    <div
      data-slot="brand-sidebar-right"
      className={cn(
        "flex h-full w-full flex-col bg-sidebar text-sidebar-foreground",
        className
      )}
    >
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-sidebar-border px-2">
        <HugeiconsIcon
          icon={SidebarRightIcon}
          strokeWidth={2}
          className="size-4 text-muted-foreground"
        />
        <span className="flex-1 truncate text-sm font-medium">Preview</span>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setRightOpen(false)}
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  strokeWidth={2}
                  className="text-muted-foreground"
                />
                <span className="sr-only">Close preview panel</span>
              </Button>
            }
          />
          <TooltipContent side="bottom">Close panel</TooltipContent>
        </Tooltip>
      </div>

      <WebPreview
        className="min-h-0 flex-1 rounded-none border-0 bg-transparent"
        url={url}
        onUrlChange={navigate}
        onReload={() => setReloadKey((current) => current + 1)}
      >
        <WebPreviewNavigation>
          <WebPreviewNavigationButton
            disabled={!canGoBack}
            onClick={() => go(-1)}
            tooltip="Go back"
          >
            <HugeiconsIcon
              className="size-4 rtl:rotate-180"
              icon={ArrowLeft01Icon}
              strokeWidth={2}
            />
          </WebPreviewNavigationButton>
          <WebPreviewNavigationButton
            disabled={!canGoForward}
            onClick={() => go(1)}
            tooltip="Go forward"
          >
            <HugeiconsIcon
              className="size-4 rtl:rotate-180"
              icon={ArrowRight01Icon}
              strokeWidth={2}
            />
          </WebPreviewNavigationButton>
          <WebPreviewNavigationButton
            disabled={!url}
            onClick={() => setReloadKey((current) => current + 1)}
            tooltip="Reload"
          >
            <HugeiconsIcon
              className="size-4"
              icon={RefreshIcon}
              strokeWidth={2}
            />
          </WebPreviewNavigationButton>
          <WebPreviewUrl />
          <WebPreviewMenu />
        </WebPreviewNavigation>

        {url ? (
          <WebPreviewBody
            key={`${url}-${reloadKey}`}
            className="bg-background"
            src={proxyUrl(url)}
          />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-1 p-6 text-center">
            <HugeiconsIcon
              icon={Globe02Icon}
              strokeWidth={2}
              className="mb-2 size-8 text-muted-foreground"
            />
            <p className="text-sm font-medium">Start browsing</p>
            <p className="text-sm text-muted-foreground">
              Enter a URL to open a page
            </p>
          </div>
        )}
      </WebPreview>
    </div>
  )

  // A phone has no width to give away, so the panel slides over the content as
  // a sheet instead of taking a column from it.
  if (isMobile) {
    return (
      <Sheet open={rightOpen} onOpenChange={setRightOpen}>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="gap-0 p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Preview</SheetTitle>
            <SheetDescription>
              Browse the web in a side panel.
            </SheetDescription>
          </SheetHeader>
          {panel}
        </SheetContent>
      </Sheet>
    )
  }

  if (!rightOpen) {
    return null
  }

  return (
    <>
      {/* The grip only shows up once the handle is hovered, dragged or focused. */}
      <ResizableHandle
        withHandle
        className={cn(
          "[&>div]:opacity-0 [&>div]:transition-opacity",
          "hover:[&>div]:opacity-100",
          "active:[&>div]:opacity-100",
          "focus-visible:[&>div]:opacity-100"
        )}
      />
      <ResizablePanel
        id={RIGHT_PANEL_ID}
        defaultSize={RIGHT_PANEL_DEFAULT_SIZE}
        minSize={RIGHT_PANEL_MIN_SIZE}
        maxSize={RIGHT_PANEL_MAX_SIZE}
        groupResizeBehavior="preserve-pixel-size"
        style={{ overflow: "hidden" }}
      >
        {panel}
      </ResizablePanel>
    </>
  )
}
