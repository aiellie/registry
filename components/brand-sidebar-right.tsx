"use client"

import * as React from "react"

import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
  Globe02Icon,
  PlusSignIcon,
  RefreshIcon,
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
import {
  readPanelStorage,
  useBrandPanels,
  writePanelStorage,
} from "@/components/brand-panels"
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

const RIGHT_TABS_KEY = "brand-panels:right-tabs"
const RIGHT_SIZE_KEY = "brand-panels:right-size"

/** Lets people type `example.com` and still get somewhere. */
function normalizeUrl(input: string) {
  const trimmed = input.trim()
  if (!trimmed) return ""
  return /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`
}

// Served through the proxy so sites that refuse to be framed still load.
const proxyUrl = (url: string) =>
  `/api/web-preview?url=${encodeURIComponent(url)}`

interface BrowserTab {
  id: string
  entries: string[]
  index: number
  reloadKey: number
}

let tabIdCounter = 0
const createTab = (): BrowserTab => ({
  id: `tab-${++tabIdCounter}`,
  entries: [],
  index: -1,
  reloadKey: 0,
})

const tabUrl = (tab: BrowserTab) => tab.entries[tab.index] ?? ""

function tabTitle(tab: BrowserTab) {
  const url = tabUrl(tab)
  if (!url) return "New tab"
  try {
    return new URL(url).host.replace(/^www\./, "") || url
  } catch {
    return url
  }
}

interface TabsState {
  tabs: BrowserTab[]
  activeId: string
}

// Only the histories survive a reload; ids are minted fresh on restore.
interface StoredTabs {
  tabs: { entries: string[]; index: number }[]
  active: number
}

function freshState(): TabsState {
  const tab = createTab()
  return { tabs: [tab], activeId: tab.id }
}

function restoreTabs(): TabsState | null {
  const stored = readPanelStorage<StoredTabs>(RIGHT_TABS_KEY)
  if (!stored || !Array.isArray(stored.tabs)) return null
  const tabs: BrowserTab[] = []
  for (const entry of stored.tabs) {
    if (!entry || !Array.isArray(entry.entries)) continue
    const entries = entry.entries.filter(
      (url): url is string => typeof url === "string"
    )
    const index =
      entries.length === 0
        ? -1
        : Math.min(
            entries.length - 1,
            Math.max(
              0,
              typeof entry.index === "number" ? entry.index : entries.length - 1
            )
          )
    tabs.push({ ...createTab(), entries, index })
  }
  if (tabs.length === 0) return null
  const active =
    tabs[
      Math.min(
        tabs.length - 1,
        Math.max(0, typeof stored.active === "number" ? stored.active : 0)
      )
    ]
  return { tabs, activeId: active.id }
}

export function BrandSidebarRight({ className }: { className?: string }) {
  const { rightOpen, setRightOpen } = useBrandPanels()
  const { isMobile } = useSidebar()

  // The panel only renders after the client restored the open state, so the
  // lazy read never disagrees with server HTML.
  const [state, setState] = React.useState<TabsState>(
    () => restoreTabs() ?? freshState()
  )
  const [initialSize] = React.useState(() =>
    readPanelStorage<number>(RIGHT_SIZE_KEY)
  )

  const { tabs } = state
  const activeTab = tabs.find((tab) => tab.id === state.activeId) ?? tabs[0]
  const url = tabUrl(activeTab)
  const canGoBack = activeTab.index > 0
  const canGoForward = activeTab.index < activeTab.entries.length - 1

  React.useEffect(() => {
    writePanelStorage(RIGHT_TABS_KEY, {
      tabs: state.tabs.map((tab) => ({
        entries: tab.entries,
        index: tab.index,
      })),
      active: Math.max(
        0,
        state.tabs.findIndex((tab) => tab.id === state.activeId)
      ),
    } satisfies StoredTabs)
  }, [state])

  const updateTab = React.useCallback(
    (tabId: string, update: (tab: BrowserTab) => BrowserTab) => {
      setState((current) => ({
        ...current,
        tabs: current.tabs.map((tab) =>
          tab.id === tabId ? update(tab) : tab
        ),
      }))
    },
    []
  )

  const navigateTab = React.useCallback(
    (tabId: string, next: string) => {
      const target = normalizeUrl(next)
      if (!target) return
      updateTab(tabId, (tab) => {
        if (tabUrl(tab) === target) return tab
        const entries = [...tab.entries.slice(0, tab.index + 1), target]
        return { ...tab, entries, index: entries.length - 1 }
      })
    },
    [updateTab]
  )

  const go = (delta: number) =>
    updateTab(activeTab.id, (tab) => {
      const index = Math.min(
        tab.entries.length - 1,
        Math.max(0, tab.index + delta)
      )
      return index === tab.index ? tab : { ...tab, index }
    })

  const reload = () =>
    updateTab(activeTab.id, (tab) => ({
      ...tab,
      reloadKey: tab.reloadKey + 1,
    }))

  const selectTab = (tabId: string) =>
    setState((current) => ({ ...current, activeId: tabId }))

  const addTab = () => {
    const tab = createTab()
    setState((current) => ({
      tabs: [...current.tabs, tab],
      activeId: tab.id,
    }))
  }

  const closeTab = (tabId: string) => {
    const index = tabs.findIndex((tab) => tab.id === tabId)
    if (index === -1) return
    const remaining = tabs.filter((tab) => tab.id !== tabId)
    // The strip never goes empty: closing the last tab leaves a fresh one.
    if (remaining.length === 0) {
      setState(freshState())
      return
    }
    // Closing the active tab activates its right neighbor, like a browser.
    const activeId =
      tabId === state.activeId
        ? remaining[Math.min(index, remaining.length - 1)].id
        : state.activeId
    setState({ tabs: remaining, activeId })
  }

  const framesRef = React.useRef(new Map<string, HTMLIFrameElement>())

  // Links clicked inside the proxied documents arrive as messages from the
  // bridge the proxy injects; match the frame back to its tab so in-frame
  // navigation lands in the right history.
  React.useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data
      if (!data || data.source !== "web-preview") return
      if (
        data.type !== "navigate" ||
        typeof data.url !== "string" ||
        !/^https?:/i.test(data.url)
      ) {
        return
      }
      for (const [tabId, frame] of framesRef.current) {
        if (frame.contentWindow === event.source) {
          navigateTab(tabId, data.url)
          break
        }
      }
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [navigateTab])

  const panel = (
    <div
      data-slot="brand-sidebar-right"
      className={cn(
        "flex h-full w-full flex-col bg-sidebar text-sidebar-foreground",
        className
      )}
    >
      <div className="flex h-10 shrink-0 items-center gap-1 border-b border-sidebar-border px-2">
        {/* The tab strip scrolls rather than squeezing the actions out. */}
        <div
          role="tablist"
          aria-label="Browser tabs"
          className="flex min-w-0 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab.id
            return (
              <div
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                tabIndex={0}
                onClick={() => selectTab(tab.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    selectTab(tab.id)
                  }
                }}
                className={cn(
                  "group/tab flex h-7 max-w-40 flex-none cursor-pointer items-center gap-1.5 rounded-lg pe-1 ps-2 text-sm outline-hidden transition-colors focus-visible:ring-1 focus-visible:ring-ring",
                  isActive
                    ? "bg-muted"
                    : "text-muted-foreground hover:bg-muted/50"
                )}
              >
                <HugeiconsIcon
                  icon={Globe02Icon}
                  strokeWidth={2}
                  className="size-3.5 shrink-0"
                />
                <span className="min-w-0 flex-1 truncate">
                  {tabTitle(tab)}
                </span>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className={cn(
                          "size-5 shrink-0 rounded-full",
                          !isActive &&
                            "opacity-0 group-hover/tab:opacity-100 focus-visible:opacity-100"
                        )}
                        onClick={(event) => {
                          event.stopPropagation()
                          closeTab(tab.id)
                        }}
                      >
                        <HugeiconsIcon
                          icon={Cancel01Icon}
                          strokeWidth={2}
                          className="size-3"
                        />
                        <span className="sr-only">Close tab</span>
                      </Button>
                    }
                  />
                  <TooltipContent side="bottom">Close tab</TooltipContent>
                </Tooltip>
              </div>
            )
          })}
        </div>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-xs"
                className="shrink-0"
                onClick={addTab}
              >
                <HugeiconsIcon
                  icon={PlusSignIcon}
                  strokeWidth={2}
                  className="text-muted-foreground"
                />
                <span className="sr-only">New tab</span>
              </Button>
            }
          />
          <TooltipContent side="bottom">New tab</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-xs"
                className="ms-auto shrink-0"
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
        onUrlChange={(next) => navigateTab(activeTab.id, next)}
        onReload={reload}
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
            onClick={reload}
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

        {/* Every tab keeps its frame mounted; switching only toggles which one
            is visible, so background tabs don't lose their state. */}
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab.id
          const currentUrl = tabUrl(tab)
          if (!currentUrl) {
            return isActive ? (
              <div
                key={tab.id}
                className="flex flex-1 flex-col items-center justify-center gap-1 p-6 text-center"
              >
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
            ) : null
          }
          return (
            <div
              key={tab.id}
              className={cn(
                "min-h-0 flex-1 flex-col",
                isActive ? "flex" : "hidden"
              )}
            >
              <WebPreviewBody
                key={`${currentUrl}-${tab.reloadKey}`}
                ref={(frame: HTMLIFrameElement | null) => {
                  if (frame) framesRef.current.set(tab.id, frame)
                  else framesRef.current.delete(tab.id)
                }}
                className="bg-background"
                src={proxyUrl(currentUrl)}
              />
            </div>
          )
        })}
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
        defaultSize={
          typeof initialSize === "number" && initialSize > 0
            ? initialSize
            : RIGHT_PANEL_DEFAULT_SIZE
        }
        minSize={RIGHT_PANEL_MIN_SIZE}
        maxSize={RIGHT_PANEL_MAX_SIZE}
        groupResizeBehavior="preserve-pixel-size"
        onResize={(size, _id, previous) => {
          // Only user- or layout-driven changes, not the mount measurement.
          if (previous) writePanelStorage(RIGHT_SIZE_KEY, size.inPixels)
        }}
        style={{ overflow: "hidden" }}
      >
        {panel}
      </ResizablePanel>
    </>
  )
}
