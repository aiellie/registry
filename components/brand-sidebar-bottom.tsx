"use client"

import {
  AlertCircleIcon,
  Cancel01Icon,
  CancelCircleIcon,
  CheckmarkCircle02Icon,
  EraserIcon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { useBrandPanels } from "@/components/brand-panels"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const BOTTOM_PANEL_ID = "sidebar-bottom"
const BOTTOM_PANEL_DEFAULT_SIZE = "16rem"
const BOTTOM_PANEL_MIN_SIZE = "8rem"
const BOTTOM_PANEL_MAX_SIZE = "70%"

type LogLevel = "info" | "success" | "warn" | "error"

const levelIcon: Record<LogLevel, IconSvgElement> = {
  info: InformationCircleIcon,
  success: CheckmarkCircle02Icon,
  warn: AlertCircleIcon,
  error: CancelCircleIcon,
}

const levelClass: Record<LogLevel, string> = {
  info: "text-muted-foreground",
  success: "text-emerald-600 dark:text-emerald-400",
  warn: "text-amber-600 dark:text-amber-400",
  error: "text-destructive",
}

interface LogLine {
  id: string
  level: LogLevel
  time: string
  message: string
}

const consoleLines: LogLine[] = [
  { id: "1", level: "info", time: "14:02:11", message: "ready in 812 ms" },
  {
    id: "2",
    level: "info",
    time: "14:02:12",
    message: "compiled /registry/brand-sidebar-bottom in 214 ms",
  },
  {
    id: "3",
    level: "success",
    time: "14:02:14",
    message: "registry:build — 150 items written to public/r",
  },
  {
    id: "4",
    level: "warn",
    time: "14:02:19",
    message: "prefer logical properties: ml-2 → ms-2",
  },
  {
    id: "5",
    level: "info",
    time: "14:02:26",
    message: "GET /demo/brand-sidebar-right 200 in 38 ms",
  },
]

const problemLines: LogLine[] = [
  {
    id: "p1",
    level: "warn",
    time: "components/promo.tsx:42",
    message: "img element without alt text",
  },
  {
    id: "p2",
    level: "error",
    time: "lib/items.ts:118",
    message: "missing category for item 'brand-sidebar-bottom'",
  },
]

const networkLines: LogLine[] = [
  {
    id: "n1",
    level: "success",
    time: "GET 200",
    message: "/r/brand-sidebar-right.json — 12.4 kB · 24 ms",
  },
  {
    id: "n2",
    level: "success",
    time: "GET 200",
    message: "/hugeicons/manifest.json — 88.1 kB · 61 ms",
  },
  {
    id: "n3",
    level: "error",
    time: "GET 404",
    message: "/avatars/aiellie.png — 0 B · 8 ms",
  },
]

function LogList({ lines }: { lines: LogLine[] }) {
  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col p-2 font-mono text-xs">
        {lines.map((line) => (
          <div
            key={line.id}
            className="flex items-start gap-2 rounded-md px-2 py-1 transition-colors hover:bg-muted/50"
          >
            <HugeiconsIcon
              icon={levelIcon[line.level]}
              strokeWidth={2}
              className={cn("mt-px size-3.5 shrink-0", levelClass[line.level])}
            />
            <span className="shrink-0 text-muted-foreground tabular-nums">
              {line.time}
            </span>
            <span className="min-w-0 break-words">{line.message}</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

export function BrandSidebarBottom({ className }: { className?: string }) {
  const { bottomOpen, setBottomOpen } = useBrandPanels()

  if (!bottomOpen) {
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
        id={BOTTOM_PANEL_ID}
        defaultSize={BOTTOM_PANEL_DEFAULT_SIZE}
        minSize={BOTTOM_PANEL_MIN_SIZE}
        maxSize={BOTTOM_PANEL_MAX_SIZE}
        groupResizeBehavior="preserve-pixel-size"
        style={{ overflow: "hidden" }}
      >
        <Tabs
          defaultValue="console"
          data-slot="brand-sidebar-bottom"
          className={cn(
            "h-full w-full gap-0 border-border bg-sidebar text-sidebar-foreground",
            className
          )}
        >
          <div className="flex h-10 shrink-0 items-center gap-1 border-b border-sidebar-border px-1 sm:gap-2 sm:px-2">
            {/* The tab strip scrolls rather than squeezing the actions out. */}
            <TabsList
              variant="line"
              className="h-8 min-w-0 [scrollbar-width:none] justify-start overflow-x-auto [&::-webkit-scrollbar]:hidden"
            >
              <TabsTrigger value="console" className="flex-none">
                Console
              </TabsTrigger>
              <TabsTrigger value="problems" className="flex-none">
                Problems
                <Badge variant="secondary">{problemLines.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="network" className="flex-none">
                Network
              </TabsTrigger>
            </TabsList>

            <div className="ms-auto flex shrink-0 items-center gap-1">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button variant="ghost" size="icon-xs">
                      <HugeiconsIcon
                        icon={EraserIcon}
                        strokeWidth={2}
                        className="text-muted-foreground"
                      />
                      <span className="sr-only">Clear output</span>
                    </Button>
                  }
                />
                <TooltipContent side="top">Clear output</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => setBottomOpen(false)}
                    >
                      <HugeiconsIcon
                        icon={Cancel01Icon}
                        strokeWidth={2}
                        className="text-muted-foreground"
                      />
                      <span className="sr-only">Close bottom panel</span>
                    </Button>
                  }
                />
                <TooltipContent side="top">Close panel</TooltipContent>
              </Tooltip>
            </div>
          </div>

          <TabsContent value="console" className="min-h-0">
            <LogList lines={consoleLines} />
          </TabsContent>
          <TabsContent value="problems" className="min-h-0">
            <LogList lines={problemLines} />
          </TabsContent>
          <TabsContent value="network" className="min-h-0">
            <LogList lines={networkLines} />
          </TabsContent>
        </Tabs>
      </ResizablePanel>
    </>
  )
}
