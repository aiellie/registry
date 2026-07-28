"use client"

import * as React from "react"

import { Example, ExampleWrapper } from "@/components/example"
import {
  WebPreview,
  WebPreviewBody,
  WebPreviewConsole,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
} from "@/components/ai-elements/web-preview"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Home01Icon,
  LinkSquare02Icon,
  Maximize01Icon,
  Minimize01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

/* -------------------------------------------------------------------------- */
/*                                    Data                                     */
/* -------------------------------------------------------------------------- */

const HOME_URL = "https://ui.aiellie.dev"

const URL_PRESETS = [
  "https://ui.aiellie.dev",
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

/* -------------------------------------------------------------------------- */
/*                                  Examples                                   */
/* -------------------------------------------------------------------------- */

export default function WebPreviewExample() {
  return (
    <ExampleWrapper className="md:grid-cols-1">
      <BrowserExample />
      <MinimalExample />
      <ConsoleExample />
    </ExampleWrapper>
  )
}

/* -------------------------------------------------------------------------- */

function BrowserExample() {
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
  const request = `${url}#${reloadKey}`
  const [pendingRequest, setPendingRequest] = React.useState(request)
  if (pendingRequest !== request) {
    setPendingRequest(request)
    setResolved(null)
    setLoading(true)
    setError(null)
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
        if (probe.framable) {
          setResolved({ mode: "direct", src: target })
          log("log", `Framing ${target} directly`)
        } else {
          setResolved({ mode: "proxy", src: proxyUrl(target) })
          log(
            "warn",
            `${probe.reason ?? "Framing blocked"} — serving through the proxy.`
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
  }, [url, reloadKey, log])

  // Links inside a proxied page can't navigate themselves — the bridge script
  // posts them up here so the address bar and history stay in charge.
  React.useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== frameRef.current?.contentWindow) return
      const data = event.data
      if (!data || data.source !== "web-preview") return
      if (typeof data.url !== "string" || !/^https?:/i.test(data.url)) return
      if (data.type === "navigate") navigate(data.url)
    }

    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [navigate])

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
    <Example
      title="Browser — loads any public URL"
      className={cn(expanded && "p-0")}
    >
      <div
        className={cn(
          "flex w-full flex-col gap-3",
          expanded &&
            "fixed inset-0 z-50 gap-0 bg-background p-4 sm:p-6 [&>p]:hidden"
        )}
      >
        <WebPreview
          className={cn("h-[460px]", expanded && "h-full")}
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
              onClick={() => setReloadKey((current) => current + 1)}
              tooltip="Reload"
            >
              <HugeiconsIcon
                className="size-4"
                icon={RefreshIcon}
                strokeWidth={2}
              />
            </WebPreviewNavigationButton>
            <WebPreviewNavigationButton
              onClick={() => navigate(HOME_URL)}
              tooltip="Home"
            >
              <HugeiconsIcon
                className="size-4"
                icon={Home01Icon}
                strokeWidth={2}
              />
            </WebPreviewNavigationButton>
            <WebPreviewUrl />
            <WebPreviewNavigationButton
              onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
              tooltip="Open in new tab"
            >
              <HugeiconsIcon
                className="size-4"
                icon={LinkSquare02Icon}
                strokeWidth={2}
              />
            </WebPreviewNavigationButton>
            <WebPreviewNavigationButton
              onClick={() => setExpanded((current) => !current)}
              tooltip={expanded ? "Exit full screen" : "Full screen"}
            >
              <HugeiconsIcon
                className="size-4"
                icon={expanded ? Minimize01Icon : Maximize01Icon}
                strokeWidth={2}
              />
            </WebPreviewNavigationButton>
          </WebPreviewNavigation>

          <WebPreviewBody
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
            src={resolved?.src}
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
          Type any URL and press Enter. Sites that refuse to be framed are
          served through <code>/api/web-preview</code>, which strips their
          framing headers and rewrites the document.
        </p>
      </div>
    </Example>
  )
}

/* -------------------------------------------------------------------------- */

function MinimalExample() {
  const [url, setUrl] = React.useState("https://wikipedia.org")

  return (
    <Example title="Minimal — URL bar only">
      <WebPreview className="h-[380px]" defaultUrl={url} onUrlChange={setUrl}>
        <WebPreviewNavigation>
          <WebPreviewUrl />
        </WebPreviewNavigation>
        <WebPreviewBody key={url} src={proxyUrl(url)} />
      </WebPreview>
    </Example>
  )
}

/* -------------------------------------------------------------------------- */

function ConsoleExample() {
  const [logs, setLogs] = React.useState<ConsoleLog[]>([
    {
      level: "log",
      message: "Build completed in 1.2s",
      timestamp: new Date(),
    },
    {
      level: "warn",
      message: "Deprecated API usage detected",
      timestamp: new Date(),
    },
    {
      level: "error",
      message: "Failed to load resource: net::ERR_CONNECTION_REFUSED",
      timestamp: new Date(),
    },
  ])

  const addLog = React.useCallback(() => {
    setLogs((current) => [
      ...current,
      {
        level: "log",
        message: `Console event #${current.length + 1}`,
        timestamp: new Date(),
      },
    ])
  }, [])

  return (
    <Example title="Console output">
      <div className="flex w-full flex-col gap-3">
        <WebPreview className="h-[380px]" defaultUrl="https://example.com">
          <WebPreviewNavigation>
            <WebPreviewUrl />
          </WebPreviewNavigation>
          <WebPreviewBody src={proxyUrl("https://example.com")} />
          <WebPreviewConsole logs={logs} />
        </WebPreview>
        <div className="flex items-center gap-2">
          <Button onClick={addLog} size="sm" variant="outline">
            Emit log
          </Button>
          <p className="text-sm text-muted-foreground">
            Expand the console to view {logs.length} entries.
          </p>
        </div>
      </div>
    </Example>
  )
}
