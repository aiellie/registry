"use client"

import * as React from "react"

import {
  WebPreview,
  WebPreviewBody,
  WebPreviewConsole,
  WebPreviewNavigation,
  WebPreviewUrl,
} from "@/components/ai-elements/web-preview"
import { Button } from "@/components/ui/button"

type ConsoleLog = {
  level: "log" | "warn" | "error"
  message: string
  timestamp: Date
}

const proxyUrl = (url: string) =>
  `/api/web-preview?url=${encodeURIComponent(url)}`

export function WebPreviewDemo() {
  const [logs, setLogs] = React.useState<ConsoleLog[]>(() => [
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
    <div className="flex w-full flex-col gap-3 py-6">
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
  )
}
