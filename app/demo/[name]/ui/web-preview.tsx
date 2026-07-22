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
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Cursor02Icon,
  LinkSquare02Icon,
  Maximize01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

/* -------------------------------------------------------------------------- */
/*                                    Data                                     */
/* -------------------------------------------------------------------------- */

/**
 * Renders a self-contained page inside the iframe via `srcDoc`, so the demos
 * load instantly with zero network requests (no slow external previews).
 */
function previewDoc(url = "https://example.com") {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      *{box-sizing:border-box}
      body{margin:0;min-height:100vh;font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:#0a0a0a;background:linear-gradient(180deg,#fafafa,#f4f4f5)}
      header{display:flex;align-items:center;gap:6px;padding:14px 20px;border-bottom:1px solid #e4e4e7;background:#fff}
      .dot{width:9px;height:9px;border-radius:999px;background:#d4d4d8}
      main{max-width:560px;margin:0 auto;padding:44px 24px}
      h1{margin:0 0 10px;font-size:26px;letter-spacing:-.02em}
      p{margin:0 0 22px;color:#52525b;line-height:1.6}
      .card{padding:18px;border:1px solid #e4e4e7;border-radius:12px;background:#fff;font-size:14px;color:#52525b}
      code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
      @media (prefers-color-scheme:dark){
        body{color:#fafafa;background:linear-gradient(180deg,#09090b,#18181b)}
        header{background:#0a0a0a;border-color:#27272a}
        p,.card{color:#a1a1aa}
        .card{background:#111113;border-color:#27272a}
      }
    </style>
  </head>
  <body>
    <header><span class="dot"></span><span class="dot"></span><span class="dot"></span></header>
    <main>
      <h1>Preview</h1>
      <p>Showing <code>${url}</code></p>
      <div class="card">Rendered instantly from <code>srcDoc</code> — no network request.</div>
    </main>
  </body>
</html>`
}

const PREVIEW_DOC = previewDoc()

type ConsoleLog = {
  level: "log" | "warn" | "error"
  message: string
  timestamp: Date
}

const INITIAL_LOGS: ConsoleLog[] = [
  {
    level: "log",
    message: "Page loaded successfully",
    timestamp: new Date(Date.now() - 10_000),
  },
  {
    level: "warn",
    message: "Deprecated API usage detected",
    timestamp: new Date(Date.now() - 5000),
  },
  {
    level: "error",
    message: "Failed to load resource: net::ERR_CONNECTION_REFUSED",
    timestamp: new Date(),
  },
]

const URL_PRESETS = [
  "https://example.com",
  "https://example.org",
  "https://example.net",
]

const noop = (label: string) => () => {
  // Wire these up to your own history / router in a real app.
  console.log(label)
}

/* -------------------------------------------------------------------------- */
/*                                  Examples                                   */
/* -------------------------------------------------------------------------- */

export default function WebPreviewExample() {
  return (
    <ExampleWrapper>
      <DefaultExample />
      <MinimalExample />
      <NavigationExample />
      <ConsoleExample />
      <LoadingExample />
      <ControlledUrlExample />
    </ExampleWrapper>
  )
}

function DefaultExample() {
  return (
    <Example title="Default">
      <WebPreview
        className="h-[420px]"
        defaultUrl="https://example.com"
        onUrlChange={noop("URL changed")}
      >
        <WebPreviewNavigation>
          <WebPreviewNavigationButton
            onClick={noop("Go back")}
            tooltip="Go back"
          >
            <HugeiconsIcon className="size-4" icon={ArrowLeft01Icon} />
          </WebPreviewNavigationButton>
          <WebPreviewNavigationButton
            onClick={noop("Go forward")}
            tooltip="Go forward"
          >
            <HugeiconsIcon className="size-4" icon={ArrowRight01Icon} />
          </WebPreviewNavigationButton>
          <WebPreviewNavigationButton
            onClick={noop("Reload")}
            tooltip="Reload"
          >
            <HugeiconsIcon className="size-4" icon={RefreshIcon} />
          </WebPreviewNavigationButton>
          <WebPreviewUrl />
          <WebPreviewNavigationButton
            onClick={noop("Select")}
            tooltip="Select"
          >
            <HugeiconsIcon className="size-4" icon={Cursor02Icon} />
          </WebPreviewNavigationButton>
          <WebPreviewNavigationButton
            onClick={noop("Open in new tab")}
            tooltip="Open in new tab"
          >
            <HugeiconsIcon className="size-4" icon={LinkSquare02Icon} />
          </WebPreviewNavigationButton>
          <WebPreviewNavigationButton
            onClick={noop("Maximize")}
            tooltip="Maximize"
          >
            <HugeiconsIcon className="size-4" icon={Maximize01Icon} />
          </WebPreviewNavigationButton>
        </WebPreviewNavigation>
        <WebPreviewBody srcDoc={PREVIEW_DOC} />
        <WebPreviewConsole logs={INITIAL_LOGS} />
      </WebPreview>
    </Example>
  )
}

function MinimalExample() {
  return (
    <Example title="Minimal — URL bar only">
      <WebPreview className="h-[420px]" defaultUrl="https://example.com">
        <WebPreviewNavigation>
          <WebPreviewUrl />
        </WebPreviewNavigation>
        <WebPreviewBody srcDoc={PREVIEW_DOC} />
      </WebPreview>
    </Example>
  )
}

function NavigationExample() {
  return (
    <Example title="Navigation controls">
      <WebPreview className="h-[420px]" defaultUrl="https://example.com">
        <WebPreviewNavigation>
          <WebPreviewNavigationButton
            onClick={noop("Go back")}
            tooltip="Go back"
          >
            <HugeiconsIcon className="size-4" icon={ArrowLeft01Icon} />
          </WebPreviewNavigationButton>
          <WebPreviewNavigationButton
            disabled
            onClick={noop("Go forward")}
            tooltip="Go forward"
          >
            <HugeiconsIcon className="size-4" icon={ArrowRight01Icon} />
          </WebPreviewNavigationButton>
          <WebPreviewNavigationButton
            onClick={noop("Reload")}
            tooltip="Reload"
          >
            <HugeiconsIcon className="size-4" icon={RefreshIcon} />
          </WebPreviewNavigationButton>
          <WebPreviewUrl />
          <WebPreviewNavigationButton
            onClick={noop("Open in new tab")}
            tooltip="Open in new tab"
          >
            <HugeiconsIcon className="size-4" icon={LinkSquare02Icon} />
          </WebPreviewNavigationButton>
        </WebPreviewNavigation>
        <WebPreviewBody srcDoc={PREVIEW_DOC} />
      </WebPreview>
    </Example>
  )
}

function ConsoleExample() {
  const [logs, setLogs] = React.useState<ConsoleLog[]>(INITIAL_LOGS)

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
        <WebPreview className="h-[420px]" defaultUrl="https://example.com">
          <WebPreviewNavigation>
            <WebPreviewNavigationButton
              onClick={noop("Reload")}
              tooltip="Reload"
            >
              <HugeiconsIcon className="size-4" icon={RefreshIcon} />
            </WebPreviewNavigationButton>
            <WebPreviewUrl />
          </WebPreviewNavigation>
          <WebPreviewBody srcDoc={PREVIEW_DOC} />
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

function LoadingExample() {
  const [loading, setLoading] = React.useState(true)

  const reload = React.useCallback(() => {
    setLoading(true)
    const timeout = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timeout)
  }, [])

  React.useEffect(() => reload(), [reload])

  return (
    <Example title="Loading state">
      <WebPreview className="h-[420px]" defaultUrl="https://example.com">
        <WebPreviewNavigation>
          <WebPreviewNavigationButton onClick={reload} tooltip="Reload">
            <HugeiconsIcon className="size-4" icon={RefreshIcon} />
          </WebPreviewNavigationButton>
          <WebPreviewUrl />
        </WebPreviewNavigation>
        <WebPreviewBody
          loading={
            loading ? (
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/80 text-sm text-muted-foreground backdrop-blur-sm">
                <Spinner />
                Loading preview…
              </div>
            ) : null
          }
          srcDoc={PREVIEW_DOC}
        />
      </WebPreview>
    </Example>
  )
}

function ControlledUrlExample() {
  const [url, setUrl] = React.useState(URL_PRESETS[0])

  return (
    <Example title="Controlled URL">
      <div className="flex w-full flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {URL_PRESETS.map((preset) => (
            <Button
              key={preset}
              onClick={() => setUrl(preset)}
              size="sm"
              variant={preset === url ? "default" : "outline"}
            >
              {preset.replace("https://", "")}
            </Button>
          ))}
        </div>
        <WebPreview
          className="h-[420px]"
          defaultUrl={url}
          key={url}
          onUrlChange={setUrl}
        >
          <WebPreviewNavigation>
            <WebPreviewNavigationButton
              onClick={noop("Reload")}
              tooltip="Reload"
            >
              <HugeiconsIcon className="size-4" icon={RefreshIcon} />
            </WebPreviewNavigationButton>
            <WebPreviewUrl />
          </WebPreviewNavigation>
          <WebPreviewBody srcDoc={previewDoc(url)} />
        </WebPreview>
        <p className="text-sm text-muted-foreground">
          Current URL: <span className="text-foreground">{url}</span>
        </p>
      </div>
    </Example>
  )
}
