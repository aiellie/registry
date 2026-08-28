"use client"

import * as React from "react"

import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Globe02Icon,
  MessageMultiple01Icon,
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
  WebPreviewConnection,
  WebPreviewConsole,
  WebPreviewMenu,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
} from "@/components/ai-elements/web-preview"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

const HOME_URL = "https://registry.aiellie.dev"

const URL_PRESETS = [
  "https://registry.aiellie.dev",
  "https://wikipedia.org",
  "https://news.ycombinator.com",
  "https://github.com",
]

type ConsoleLog = {
  level: "log" | "warn" | "error"
  message: string
  timestamp: Date
}

type LoadMode = "direct" | "proxy"

type ProbeResult = {
  ok: boolean
  url?: string
  status?: number
  framable?: boolean
  reason?: string
  proxyable?: boolean
  error?: string
}

/** Lets people type `example.com` and still get somewhere. */
function normalizeUrl(input: string) {
  const trimmed = input.trim()
  if (!trimmed) return ""
  return /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`
}

const proxyUrl = (url: string) =>
  `/api/web-preview?url=${encodeURIComponent(url)}`

type DeviceName = "mobile" | "tablet" | "desktop"

const DEVICES: { name: DeviceName; label: string; width: string }[] = [
  { label: "Mobile", name: "mobile", width: "max-w-[375px]" },
  { label: "Tablet", name: "tablet", width: "max-w-[768px]" },
  { label: "Desktop", name: "desktop", width: "max-w-full" },
]

/**
 * A working browser: history, a probe that decides between framing a site
 * directly and serving it through `/api/web-preview`, and the page tools
 * (find, zoom, print, annotate) that ride on the proxy's injected bridge.
 */
export function WebPreviewDemo() {
  const [history, setHistory] = React.useState({
    entries: [HOME_URL],
    index: 0,
  })
  // `src` and `mode` move together — keeping them in one object stops the
  // iframe's load event from reporting the previous target's mode.
  const [resolved, setResolved] = React.useState<{
    src: string
    mode: LoadMode
  } | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [expanded, setExpanded] = React.useState(false)
  const [reloadKey, setReloadKey] = React.useState(0)
  const [logs, setLogs] = React.useState<ConsoleLog[]>([])

  // Page tools run inside the injected bridge, which only exists on proxied
  // documents — using one escalates this tab to the proxy for good.
  const [forceProxy, setForceProxy] = React.useState(false)
  const [bridgeReady, setBridgeReady] = React.useState(false)
  const [find, setFind] = React.useState({
    open: false,
    query: "",
    total: 0,
    active: 0,
  })
  const [zoom, setZoom] = React.useState(100)
  const [device, setDevice] = React.useState<DeviceName | null>(null)
  const [annotating, setAnnotating] = React.useState(false)
  const [annotations, setAnnotations] = React.useState(0)

  const frameRef = React.useRef<HTMLIFrameElement>(null)
  const url = history.entries[history.index]

  const log = React.useCallback(
    (level: ConsoleLog["level"], message: string) => {
      setLogs((current) =>
        [...current, { level, message, timestamp: new Date() }].slice(-50)
      )
    },
    []
  )

  /** Push a new entry, discarding anything ahead of the current position. */
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

  // A new target invalidates whatever is on screen right now. Adjusting state
  // during render (rather than in an effect) avoids a frame of stale content.
  const request = `${url}#${reloadKey}#${forceProxy}`
  const [pendingRequest, setPendingRequest] = React.useState(request)
  if (pendingRequest !== request) {
    setPendingRequest(request)
    setResolved(null)
    setLoading(true)
    setError(null)
    setBridgeReady(false)
  }

  // Ask the server whether the target can be framed as-is. If it can't (most
  // real sites), fall back to the proxy, which strips the framing headers.
  React.useEffect(() => {
    if (!url) return

    let cancelled = false

    fetch(`/api/web-preview?probe=1&url=${encodeURIComponent(url)}`)
      .then((response) => response.json() as Promise<ProbeResult>)
      .then((probe) => {
        if (cancelled) return

        if (!probe.ok || probe.error) {
          setResolved(null)
          setLoading(false)
          setError(
            probe.error ??
              `${url} responded with ${probe.status ?? "an error"}.`
          )
          log("error", probe.error ?? `Request failed (${probe.status}).`)
          return
        }

        const target = probe.url ?? url
        if (probe.framable && !forceProxy) {
          setResolved({ mode: "direct", src: target })
          log("log", `Framing ${target} directly`)
        } else {
          setResolved({ mode: "proxy", src: proxyUrl(target) })
          log(
            probe.framable ? "log" : "warn",
            probe.framable
              ? `Proxying ${target} so the page tools stay available.`
              : `${probe.reason ?? "Framing blocked"} — serving through the proxy.`
          )
        }
      })
      .catch(() => {
        if (cancelled) return
        setResolved(null)
        setLoading(false)
        setError(`Could not reach ${url}.`)
        log("error", `Could not reach ${url}.`)
      })

    return () => {
      cancelled = true
    }
  }, [url, reloadKey, forceProxy, log])

  /** Commands travel to the injected bridge; it owns the framed document. */
  const send = React.useCallback((type: string, data?: object) => {
    frameRef.current?.contentWindow?.postMessage(
      { source: "web-preview-host", type, ...data },
      "*"
    )
  }, [])

  /**
   * Find, zoom, print and annotation all need the bridge, which only ships
   * with proxied documents. Escalate rather than silently doing nothing.
   */
  const requireBridge = React.useCallback(
    (what: string) => {
      if (resolved?.mode === "proxy" || forceProxy) return true
      setForceProxy(true)
      log("warn", `Reloading through the proxy to enable ${what}.`)
      return false
    },
    [forceProxy, log, resolved]
  )

  // Messages from the framed document: link clicks, find counts, annotations.
  React.useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== frameRef.current?.contentWindow) return
      const data = event.data
      if (!data || data.source !== "web-preview") return

      if (data.type === "navigate") {
        if (typeof data.url === "string" && /^https?:/i.test(data.url)) {
          navigate(data.url)
        }
        return
      }

      if (data.type === "loaded") {
        setBridgeReady(true)
        return
      }

      if (data.type === "find:results") {
        setFind((current) => ({
          ...current,
          active: Number(data.active) || 0,
          total: Number(data.total) || 0,
        }))
        if (data.supported === false) {
          log("warn", "This browser has no CSS Custom Highlight API.")
        }
        return
      }

      if (data.type === "annotate:select") {
        const element = data.element ?? {}
        setAnnotations((current) => current + 1)
        log(
          "log",
          `Annotated <${element.tag}> ${element.width}×${element.height}`
        )
      }
    }

    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [log, navigate])

  // Read by the re-apply effect below. Held in a ref so that effect fires only
  // when a new document appears, not every time the toolbar state changes —
  // re-sending `find` on each keystroke would reset the active match to 1.
  const toolbar = React.useRef({ annotating, find, zoom })
  React.useEffect(() => {
    toolbar.current = { annotating, find, zoom }
  })

  // A fresh document starts at 100% with annotation off; re-apply the toolbar
  // state once the new bridge announces itself.
  React.useEffect(() => {
    if (!bridgeReady) return
    const current = toolbar.current
    if (current.zoom !== 100) send("zoom", { zoom: current.zoom })
    if (current.annotating) send("annotate", { enabled: true })
    if (current.find.open && current.find.query) {
      send("find", { query: current.find.query })
    }
  }, [bridgeReady, send])

  const canGoBack = history.index > 0
  const canGoForward = history.index < history.entries.length - 1
  const host = React.useMemo(() => {
    try {
      return new URL(url).host
    } catch {
      return url
    }
  }, [url])

  return (
    <div
      className={cn(
        "flex flex-col justify-center gap-3",
        expanded
          ? "fixed inset-0 z-50 w-full gap-0 bg-background p-4 sm:p-6 [&>p]:hidden"
          : "mx-auto min-h-dvh w-xl max-w-full p-6"
      )}
    >
      <WebPreview
        className={cn("h-[380px]", expanded && "h-full")}
        onReload={() => setReloadKey((current) => current + 1)}
        onUrlChange={navigate}
        url={url}
      >
        <WebPreviewNavigation>
          <WebPreviewNavigationButton
            disabled={!canGoBack}
            onClick={() => go(-1)}
            tooltip="Go back"
          >
            <HugeiconsIcon
              className="rtl:rotate-180"
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
              className="rtl:rotate-180"
              icon={ArrowRight01Icon}
              strokeWidth={2}
            />
          </WebPreviewNavigationButton>
          <WebPreviewNavigationButton
            onClick={() => setReloadKey((current) => current + 1)}
            tooltip="Reload"
          >
            <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} />
          </WebPreviewNavigationButton>

          <WebPreviewUrl
            connectionContent={
              <div className="flex flex-col gap-2">
                <WebPreviewConnection url={url} />
                <div className="border-t pt-2 text-xs text-muted-foreground">
                  Served{" "}
                  {resolved?.mode === "proxy" ? (
                    <>
                      through <code>/api/web-preview</code>, which strips this
                      site&rsquo;s framing headers.
                    </>
                  ) : (
                    <>directly — this site allows being framed.</>
                  )}
                </div>
              </div>
            }
          />
          <WebPreviewAnnotateToggle
            active={annotating}
            onActiveChange={(next) => {
              if (next && !requireBridge("annotation")) return
              setAnnotating(next)
              send("annotate", { enabled: next })
              log("log", next ? "Annotating enabled" : "Annotating disabled")
            }}
          />
          <WebPreviewMenu
            deviceToolbar={device !== null}
            fullScreen={expanded}
            onClearCache={() => {
              log("log", "Cache cleared — reloading")
              setReloadKey((current) => current + 1)
            }}
            onDeviceToolbarChange={(open) => setDevice(open ? "desktop" : null)}
            onFindInPage={() => {
              if (!requireBridge("find in page")) return
              setFind((current) => ({ ...current, open: true }))
            }}
            onFullScreenChange={setExpanded}
            onPrint={() => {
              if (!requireBridge("print")) return
              send("print")
            }}
            onZoomChange={(next) => {
              if (!requireBridge("zoom")) return
              setZoom(next)
              send("zoom", { zoom: next })
            }}
            zoom={zoom}
          />
        </WebPreviewNavigation>

        {device !== null && (
          <div className="flex items-center gap-1 border-b p-2">
            {DEVICES.map((option) => (
              <Button
                key={option.name}
                onClick={() => setDevice(option.name)}
                size="sm"
                variant={option.name === device ? "secondary" : "ghost"}
              >
                {option.label}
              </Button>
            ))}
            <span className="ms-auto text-xs text-muted-foreground">
              {annotations > 0 && `${annotations} annotation(s)`}
            </span>
          </div>
        )}

        {find.open && (
          <div className="absolute end-[0.875rem] top-1 z-40 w-[calc(100%-1.75rem)] max-w-[21.25rem]">
            <FindInPage
              active={find.active}
              onClose={() => {
                setFind({ active: 0, open: false, query: "", total: 0 })
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
                    <HugeiconsIcon
                      icon={MessageMultiple01Icon}
                      strokeWidth={2}
                    />
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
          </div>
        )}

        <WebPreviewBody
          className={cn(
            "mx-auto",
            device && DEVICES.find((d) => d.name === device)?.width
          )}
          key={`${resolved?.src ?? "blank"}-${reloadKey}`}
          loading={
            error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background p-6 text-center">
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button
                  onClick={() => setReloadKey((current) => current + 1)}
                  size="sm"
                  variant="outline"
                >
                  Try again
                </Button>
              </div>
            ) : loading ? (
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/80 text-sm text-muted-foreground backdrop-blur-sm">
                <Spinner />
                Loading {host}…
              </div>
            ) : null
          }
          onLoad={() => {
            // The frame is remounted without a src between navigations; that
            // about:blank load is not the one we want to report.
            if (!resolved) return
            setLoading(false)
            log("log", `Loaded ${url} (${resolved.mode})`)
          }}
          ref={frameRef}
          // Explicitly blank while probing: WebPreviewBody otherwise falls back
          // to the context URL and frames the raw (often blocked) target.
          src={resolved?.src ?? "about:blank"}
        />

        <WebPreviewConsole logs={logs} />
      </WebPreview>

      <div className="flex flex-wrap items-center gap-2">
        {URL_PRESETS.map((preset) => (
          <Button
            key={preset}
            onClick={() => navigate(preset)}
            size="sm"
            variant={preset === url ? "default" : "outline"}
          >
            {preset.replace("https://", "")}
          </Button>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Type any URL and press Enter. Sites that refuse to be framed are served
        through <code>/api/web-preview</code>, which strips their framing
        headers and rewrites the document.
      </p>
    </div>
  )
}
