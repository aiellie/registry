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

/** Iframe source used across the examples so every preview renders a page. */
const PREVIEW_SRC =
  "https://preview-v0me-kzml7zc6fkcvbyhzrf47.vusercontent.net/"

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
        <WebPreviewBody src={PREVIEW_SRC} />
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
        <WebPreviewBody src={PREVIEW_SRC} />
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
        <WebPreviewBody src={PREVIEW_SRC} />
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
          <WebPreviewBody src={PREVIEW_SRC} />
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
          src={PREVIEW_SRC}
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
          <WebPreviewBody />
        </WebPreview>
        <p className="text-sm text-muted-foreground">
          Current URL: <span className="text-foreground">{url}</span>
        </p>
      </div>
    </Example>
  )
}
