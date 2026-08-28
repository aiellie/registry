"use client"

import * as React from "react"

import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
  FullScreenIcon,
  Globe02Icon,
  MessageMultiple01Icon,
  PlusSignIcon,
  RefreshIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  FindInPage,
  FindInPageAction,
  FindInPageActions,
  FindInPageBar,
  FindInPageClose,
  FindInPageInput,
  FindInPageResults,
  FindInPageSeparator,
} from "@/components/ai-elements/find-in-page"
import {
  WebPreview,
  WebPreviewAnnotateToggle,
  WebPreviewBody,
  WebPreviewConsole,
  WebPreviewMenu,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
} from "@/components/ai-elements/web-preview"
import {
  readPanelStorage,
  useBrandPanels,
  writePanelStorage,
} from "@/components/brand/brand-panels"
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
import { webPreviewBridgeCode } from "@/lib/web-preview-bridge"

const RIGHT_PANEL_ID = "sidebar-right"
const RIGHT_PANEL_DEFAULT_SIZE = "31.5rem"
const RIGHT_PANEL_MIN_SIZE = "18rem"
const RIGHT_PANEL_MAX_SIZE = "42rem"

const RIGHT_TABS_KEY = "brand-panels:right-tabs"
const RIGHT_SIZE_KEY = "brand-panels:right-size"

/** Lets people type `example.com` and still get somewhere. */
function normalizeUrl(input: string) {
  const trimmed = input.trim()
  if (!trimmed) return ""
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (
    /^(?:localhost|127(?:\.\d{1,3}){3}|\[::1\])(?::\d+)?(?:\/|$)/i.test(trimmed)
  ) {
    return `http://${trimmed}`
  }
  return `https://${trimmed}`
}

// Served through the proxy so sites that refuse to be framed still load.
const proxyUrl = (url: string) =>
  `/api/web-preview?url=${encodeURIComponent(url)}`

const isLoopbackHost = (hostname: string) =>
  hostname === "localhost" ||
  hostname === "::1" ||
  hostname === "[::1]" ||
  /^127(?:\.\d{1,3}){3}$/.test(hostname)

// Loopback pages are useful during local design work but are intentionally
// rejected by the server proxy. Let the browser frame those directly instead.
function previewUrl(url: string) {
  try {
    if (isLoopbackHost(new URL(url).hostname)) {
      return url
    }
  } catch {
    // Navigation normalisation handles incomplete URLs before this point.
  }
  return proxyUrl(url)
}

// Google's favicon service resolves <link rel="icon"> too, not just
// /favicon.ico — but it cannot reach loopback hosts, so those are asked for
// their icon directly.
function faviconUrl(url: string) {
  try {
    const parsed = new URL(url)
    if (isLoopbackHost(parsed.hostname)) {
      return `${parsed.origin}/favicon.ico`
    }
    return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=64`
  } catch {
    return null
  }
}

function TabFavicon({ url }: { url: string }) {
  const src = url ? faviconUrl(url) : null
  const [failedSrc, setFailedSrc] = React.useState<string | null>(null)

  if (!src || src === failedSrc) {
    return (
      <HugeiconsIcon
        icon={Globe02Icon}
        strokeWidth={2}
        className="size-4 shrink-0"
      />
    )
  }

  return (
    <img
      alt=""
      className="size-4 shrink-0 rounded-sm"
      onError={() => setFailedSrc(src)}
      src={src}
    />
  )
}

type ConsoleLog = {
  level: "log" | "warn" | "error"
  message: string
  timestamp: Date
}

interface FindState {
  open: boolean
  query: string
  total: number
  active: number
}

const emptyFindState = (): FindState => ({
  active: 0,
  open: false,
  query: "",
  total: 0,
})

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
  const [fullScreen, setFullScreen] = React.useState(false)
  const [annotating, setAnnotating] = React.useState(false)
  const [zoom, setZoom] = React.useState(100)
  const [find, setFind] = React.useState<FindState>(emptyFindState)
  const [logs, setLogs] = React.useState<ConsoleLog[]>([])
  const [panelOpenSnapshot, setPanelOpenSnapshot] = React.useState(rightOpen)

  const log = React.useCallback(
    (level: ConsoleLog["level"], message: string) => {
      setLogs((current) =>
        [...current, { level, message, timestamp: new Date() }].slice(-50)
      )
    },
    []
  )

  if (panelOpenSnapshot !== rightOpen) {
    setPanelOpenSnapshot(rightOpen)
    if (!rightOpen) setFullScreen(false)
  }

  const { tabs } = state
  const activeTab = tabs.find((tab) => tab.id === state.activeId) ?? tabs[0]
  const url = tabUrl(activeTab)
  const canGoBack = activeTab.index > 0
  const canGoForward = activeTab.index < activeTab.entries.length - 1
  const documentKey = `${activeTab.id}:${url}:${activeTab.reloadKey}`
  const [toolDocumentKey, setToolDocumentKey] = React.useState(documentKey)

  // Reset page-scoped controls before painting a different document. This is
  // derived state, so the replacement render lands without a stale overlay.
  if (toolDocumentKey !== documentKey) {
    setToolDocumentKey(documentKey)
    setFind(emptyFindState())
    setAnnotating(false)
    setZoom(100)
  }

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
        tabs: current.tabs.map((tab) => (tab.id === tabId ? update(tab) : tab)),
      }))
    },
    []
  )

  const navigateTab = React.useCallback(
    (tabId: string, next: string) => {
      const target = normalizeUrl(next)
      if (!target) return
      let opened = false
      setState((current) => {
        const tab = current.tabs.find((item) => item.id === tabId)
        if (!tab || tabUrl(tab) === target) return current
        opened = true
        const entries = [...tab.entries.slice(0, tab.index + 1), target]
        return {
          ...current,
          tabs: current.tabs.map((item) =>
            item.id === tabId
              ? { ...tab, entries, index: entries.length - 1 }
              : item
          ),
        }
      })
      if (opened) log("log", `Opening ${target}`)
    },
    [log]
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

  const tabButtonRefs = React.useRef(new Map<string, HTMLButtonElement>())
  const focusTab = (tabId: string) =>
    requestAnimationFrame(() => tabButtonRefs.current.get(tabId)?.focus())

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
      const next = freshState()
      setState(next)
      focusTab(next.activeId)
      return
    }
    // Closing the active tab activates its right neighbor, like a browser.
    const activeId =
      tabId === state.activeId
        ? remaining[Math.min(index, remaining.length - 1)].id
        : state.activeId
    setState({ tabs: remaining, activeId })
    if (tabId === state.activeId) focusTab(activeId)
  }

  const framesRef = React.useRef(new Map<string, HTMLIFrameElement>())

  const sendToTab = React.useCallback(
    (tabId: string, type: string, data?: object) => {
      framesRef.current
        .get(tabId)
        ?.contentWindow?.postMessage(
          { source: "web-preview-host", type, ...data },
          "*"
        )
    },
    []
  )

  const send = React.useCallback(
    (type: string, data?: object) => sendToTab(activeTab.id, type, data),
    [activeTab.id, sendToTab]
  )

  const toolbarRef = React.useRef({
    activeTabId: activeTab.id,
    annotating,
    find,
    url,
    zoom,
  })
  React.useEffect(() => {
    toolbarRef.current = {
      activeTabId: activeTab.id,
      annotating,
      find,
      url,
      zoom,
    }
  })

  // Page tools belong to a document, not the panel. Clear them when history or
  // the active tab changes so background frames never keep stale overlays.
  React.useEffect(() => {
    return () => {
      sendToTab(activeTab.id, "find", { query: "" })
      sendToTab(activeTab.id, "annotate", { enabled: false })
      sendToTab(activeTab.id, "zoom", { zoom: 100 })
    }
  }, [activeTab.id, activeTab.reloadKey, sendToTab, url])

  // Match bridge messages back to the frame that sent them. Besides link
  // navigation, this keeps the floating find counter and page tools in sync.
  React.useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data
      if (!data || data.source !== "web-preview") return

      let sourceTabId: string | undefined
      for (const [tabId, frame] of framesRef.current) {
        if (frame.contentWindow === event.source) {
          sourceTabId = tabId
          break
        }
      }
      if (!sourceTabId) return

      if (data.type === "navigate") {
        if (typeof data.url === "string" && /^https?:/i.test(data.url)) {
          navigateTab(sourceTabId, data.url)
        }
        return
      }

      const toolbar = toolbarRef.current
      if (sourceTabId !== toolbar.activeTabId) return

      if (data.type === "loaded") {
        if (toolbar.url) log("log", `Loaded ${toolbar.url}`)
        if (toolbar.zoom !== 100) {
          sendToTab(sourceTabId, "zoom", { zoom: toolbar.zoom })
        }
        if (toolbar.annotating) {
          sendToTab(sourceTabId, "annotate", { enabled: true })
        }
        if (toolbar.find.open && toolbar.find.query) {
          sendToTab(sourceTabId, "find", { query: toolbar.find.query })
        }
        return
      }

      if (data.type === "find:results") {
        setFind((current) => ({
          ...current,
          active: Number(data.active) || 0,
          total: Number(data.total) || 0,
        }))
      }
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [log, navigateTab, sendToTab])

  const panel = (
    <div
      data-slot="brand-sidebar-right"
      className={cn(
        "relative flex h-full w-full flex-col bg-sidebar text-sidebar-foreground",
        // z-50 matches the portaled overlays (menus, tooltips, popovers) so
        // they still paint above the panel; DOM order keeps it over the header.
        fullScreen && "fixed inset-0 z-50",
        className
      )}
    >
      <div className="flex h-10 shrink-0 items-center gap-1 px-1.5">
        {/* The tab strip scrolls rather than squeezing the actions out. */}
        <div
          role="tablist"
          aria-label="Browser tabs"
          className="flex min-w-0 flex-1 [scrollbar-width:none] items-center gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab.id
            return (
              <div
                key={tab.id}
                className={cn(
                  "group/tab flex h-7 w-[9.75rem] flex-none items-center rounded-xl pe-0.5 text-sm transition-colors",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50"
                )}
              >
                <button
                  aria-selected={isActive}
                  className="flex h-full min-w-0 flex-1 items-center gap-1.5 rounded-xl ps-2 text-start outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  onClick={() => selectTab(tab.id)}
                  onKeyDown={(event) => {
                    if (
                      event.key !== "ArrowLeft" &&
                      event.key !== "ArrowRight"
                    ) {
                      return
                    }
                    event.preventDefault()
                    const index = tabs.findIndex((item) => item.id === tab.id)
                    const delta = event.key === "ArrowLeft" ? -1 : 1
                    const nextId =
                      tabs[(index + delta + tabs.length) % tabs.length].id
                    selectTab(nextId)
                    focusTab(nextId)
                  }}
                  ref={(button) => {
                    if (button) tabButtonRefs.current.set(tab.id, button)
                    else tabButtonRefs.current.delete(tab.id)
                  }}
                  role="tab"
                  tabIndex={isActive ? 0 : -1}
                  type="button"
                >
                  <TabFavicon url={tabUrl(tab)} />
                  <span className="min-w-0 flex-1 truncate">
                    {tabTitle(tab)}
                  </span>
                </button>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className={cn(
                          "size-6 shrink-0 rounded-lg",
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
                          className="size-4"
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
              <Button variant="ghost" size="icon-sm" onClick={addTab}>
                <HugeiconsIcon
                  icon={PlusSignIcon}
                  strokeWidth={2}
                  className="size-3.5 text-muted-foreground"
                />
                <span className="sr-only">New tab</span>
              </Button>
            }
          />
          <TooltipContent side="bottom">New tab</TooltipContent>
        </Tooltip>
        <div className="ms-auto flex shrink-0 items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-xl"
                  aria-pressed={fullScreen}
                  onClick={() => setFullScreen((current) => !current)}
                >
                  <HugeiconsIcon
                    icon={FullScreenIcon}
                    strokeWidth={2}
                    className="size-4 text-muted-foreground"
                  />
                  <span className="sr-only">Toggle full screen</span>
                </Button>
              }
            />
            <TooltipContent side="bottom">Toggle full screen</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {find.open && (
        <FindInPage
          active={find.active}
          className="absolute end-[0.875rem] top-1 z-50 w-[calc(100%-1.75rem)]"
          onClose={() => {
            setFind(emptyFindState())
            send("find", { query: "" })
          }}
          onQueryChange={(query) => {
            setFind((current) => ({ ...current, query }))
            send("find", { query })
          }}
          onStep={(delta) => send("find:step", { delta })}
          query={find.query}
          total={find.total}
        >
          <FindInPageBar>
            <FindInPageInput autoFocus />
            <FindInPageActions>
              <FindInPageAction
                aria-label="Ask about this page"
                className="disabled:opacity-100"
                disabled
              >
                <HugeiconsIcon icon={MessageMultiple01Icon} strokeWidth={2} />
              </FindInPageAction>
              <FindInPageAction
                aria-label="Search the web"
                className="disabled:opacity-100"
                disabled
              >
                <HugeiconsIcon icon={Globe02Icon} strokeWidth={2} />
              </FindInPageAction>
              <FindInPageSeparator />
              <FindInPageClose />
            </FindInPageActions>
          </FindInPageBar>
          <FindInPageResults />
        </FindInPage>
      )}

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
          <WebPreviewAnnotateToggle
            active={annotating}
            disabled={!url}
            onActiveChange={(next) => {
              setAnnotating(next)
              send("annotate", { enabled: next })
              log("log", next ? "Annotating enabled" : "Annotating disabled")
            }}
          />

          <WebPreviewMenu
            fullScreen={fullScreen}
            onFindInPage={
              url
                ? () => setFind((current) => ({ ...current, open: true }))
                : undefined
            }
            onFullScreenChange={setFullScreen}
            onPrint={url ? () => send("print") : undefined}
            onZoomChange={
              url
                ? (next) => {
                    setZoom(next)
                    send("zoom", { zoom: next })
                  }
                : undefined
            }
            zoom={zoom}
          />
        </WebPreviewNavigation>

        {/* Every tab keeps its frame mounted; switching only toggles which one
            is visible, so background tabs don't lose their state. */}
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab.id
          const currentUrl = tabUrl(tab)
          if (!currentUrl) {
            return isActive ? (
              <div key={tab.id} className="relative flex-1 p-6 text-center">
                <div className="absolute inset-x-6 top-1/2 flex flex-col items-center gap-1">
                  <HugeiconsIcon
                    icon={Globe02Icon}
                    strokeWidth={2}
                    className="size-8 -translate-y-1/2 text-[#616161]"
                  />
                  <p className="text-base font-medium text-foreground">
                    Start browsing
                  </p>
                  <p className="text-sm text-[#616161]">
                    Enter a URL to open a page
                  </p>
                </div>
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
                onLoad={(event) => {
                  if (previewUrl(currentUrl) !== currentUrl) return
                  try {
                    if (new URL(currentUrl).origin !== window.location.origin) {
                      return
                    }
                    const document = event.currentTarget.contentDocument
                    if (
                      !document ||
                      document.querySelector("script[data-web-preview-bridge]")
                    ) {
                      return
                    }
                    const script = document.createElement("script")
                    script.dataset.webPreviewBridge = ""
                    script.textContent = webPreviewBridgeCode(currentUrl)
                    ;(document.head ?? document.documentElement).appendChild(
                      script
                    )
                  } catch {
                    // A different loopback origin may be framed, but the host
                    // cannot inject tools into it without same-origin access.
                  }
                }}
                src={previewUrl(currentUrl)}
              />
            </div>
          )
        })}

        <WebPreviewConsole logs={logs} />
      </WebPreview>
    </div>
  )

  // A phone has no width to give away, so the panel slides over the content as
  // a sheet instead of taking a column from it.
  if (isMobile) {
    return (
      <Sheet
        open={rightOpen}
        onOpenChange={(open) => {
          if (!open) setFullScreen(false)
          setRightOpen(open)
        }}
      >
        <SheetContent
          side="right"
          showCloseButton={false}
          className="gap-0 p-0 data-[side=right]:w-full data-[side=right]:max-w-none data-[side=right]:sm:max-w-[31.5rem]"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Preview</SheetTitle>
            <SheetDescription>Browse the web in a side panel.</SheetDescription>
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
