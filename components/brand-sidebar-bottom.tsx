"use client"

import * as React from "react"

import {
  AlertCircleIcon,
  Cancel01Icon,
  CancelCircleIcon,
  CheckmarkCircle02Icon,
  EraserIcon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import {
  Terminal,
  TerminalContent,
  TerminalInput,
  TerminalTab,
  TerminalTabs,
} from "@/components/ai-elements/terminal"
import {
  readPanelStorage,
  useBrandPanels,
  writePanelStorage,
} from "@/components/brand/brand-panels"
import {
  NEW_TAB_OPTIONS,
  NewTabDropdown,
  type NewTabType,
} from "@/components/new-tab-dropdown"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
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

const BOTTOM_SIZE_KEY = "brand-panels:bottom-size"

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

const TERMINAL_PROMPT = "stashd@Mac registry.aiellie.dev %"

const TERMINAL_HELP = [
  "Available commands:",
  "  pnpm dev  help  ls  pwd  whoami  date  echo <text>  clear",
].join("\n")

// `pnpm dev` replays a real boot of this repo, chunk by chunk — each entry
// appends its lines after `delay` ms so the panel feels like a live shell.
const PNPM_DEV_RUN: { delay: number; lines: string[] }[] = [
  {
    delay: 250,
    lines: [
      "",
      "> registry.aiellie.dev@0.0.1 dev /Users/stashd/registry.aiellie.dev",
      "> pnpm registry:build && pnpm icons:build && next dev",
    ],
  },
  {
    delay: 450,
    lines: [
      "",
      "",
      "> registry.aiellie.dev@0.0.1 registry:build /Users/stashd/registry.aiellie.dev",
      "> shadcn build",
    ],
  },
  { delay: 650, lines: ["", "✔ Building registry."] },
  {
    delay: 400,
    lines: [
      "",
      "> registry.aiellie.dev@0.0.1 icons:build /Users/stashd/registry.aiellie.dev",
      "> node scripts/build-hugeicons.mjs",
    ],
  },
  {
    delay: 550,
    lines: ["", "hugeicons: manifest already at 4.2.2 (schema 2), skipping"],
  },
  {
    delay: 350,
    lines: [
      "▲ Next.js 16.2.6 (Turbopack)",
      "- Local:         http://localhost:3000",
      "- Network:       http://192.168.1.158:3000",
      "- Environments: .env.local",
    ],
  },
  { delay: 262, lines: ["✓ Ready in 262ms"] },
]

interface PanelTab {
  id: number
  type: NewTabType
  /** Terminal scrollback; unused by the log views. */
  output: string
  /** True while a simulated long-running command owns the terminal. */
  running?: boolean
}

const TAB_META = Object.fromEntries(
  NEW_TAB_OPTIONS.map((option) => [option.type, option])
) as Record<NewTabType, (typeof NEW_TAB_OPTIONS)[number]>

const LOG_LINES: Record<Exclude<NewTabType, "terminal">, LogLine[]> = {
  console: consoleLines,
  network: networkLines,
  problems: problemLines,
}

function runCommand(command: string) {
  const [name, ...rest] = command.trim().split(/\s+/)
  switch (name) {
    case "help":
      return TERMINAL_HELP
    case "ls":
      return "app  components  lib  public  package.json  registry.json"
    case "pwd":
      return "/Users/stashd/registry.aiellie.dev"
    case "whoami":
      return "stashd"
    case "date":
      return new Date().toString()
    case "echo":
      return rest.join(" ")
    case "pnpm":
      // `pnpm dev` is intercepted by the staged runner before reaching here.
      return rest.length === 0
        ? "Usage: pnpm [command] [flags]\nTry `pnpm dev`."
        : ` ERR_PNPM_NO_SCRIPT  Missing script: ${rest.join(" ")}`
    case "":
      return ""
    default:
      return `zsh: command not found: ${name}`
  }
}

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

const DEFAULT_TABS: PanelTab[] = [{ id: 1, output: "", type: "terminal" }]
const DEFAULT_ACTIVE_ID = 1

export function BrandSidebarBottom({ className }: { className?: string }) {
  const { bottomOpen, setBottomOpen } = useBrandPanels()

  const [tabs, setTabs] = React.useState<PanelTab[]>(DEFAULT_TABS)
  const [activeId, setActiveId] = React.useState(DEFAULT_ACTIVE_ID)
  const nextId = React.useRef(2)
  // Pending output timers per tab, so Ctrl+C and tab close can cancel a run.
  const runTimeouts = React.useRef(new Map<number, number[]>())

  // The panel only renders after the client restored the open state, so the
  // lazy read never disagrees with server HTML.
  const [initialSize] = React.useState(() =>
    readPanelStorage<number>(BOTTOM_SIZE_KEY)
  )

  if (!bottomOpen) {
    return null
  }

  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0]

  const setOutput = (id: number, update: (current: string) => string) =>
    setTabs((current) =>
      current.map((tab) =>
        tab.id === id ? { ...tab, output: update(tab.output) } : tab
      )
    )

  const setRunning = (id: number, running: boolean) =>
    setTabs((current) =>
      current.map((tab) => (tab.id === id ? { ...tab, running } : tab))
    )

  // Cancels a run and hands the prompt back, like Ctrl+C in a real shell.
  const interrupt = (id: number) => {
    runTimeouts.current.get(id)?.forEach((timer) => window.clearTimeout(timer))
    runTimeouts.current.delete(id)
    setOutput(id, (current) => `${current}\n^C`)
    setRunning(id, false)
  }

  const run = (command: string) => {
    // The running dev server owns the session; Enter just gets swallowed.
    if (activeTab.running) return
    if (command.trim() === "clear") {
      setOutput(activeTab.id, () => "")
      return
    }
    const echoed = `${TERMINAL_PROMPT} ${command}`.trimEnd()
    // The dev-server boot streams in over ~3s and then stays running — the
    // prompt never comes back on its own; Ctrl+C interrupts it.
    if (command.trim().replace(/\s+/g, " ") === "pnpm dev") {
      const { id } = activeTab
      setOutput(id, (current) => (current ? `${current}\n${echoed}` : echoed))
      setRunning(id, true)
      let elapsed = 0
      const timers: number[] = []
      for (const chunk of PNPM_DEV_RUN) {
        elapsed += chunk.delay
        timers.push(
          window.setTimeout(
            () =>
              setOutput(
                id,
                (current) => `${current}\n${chunk.lines.join("\n")}`
              ),
            elapsed
          )
        )
      }
      runTimeouts.current.set(id, timers)
      return
    }
    const result = runCommand(command)
    const entry = result ? `${echoed}\n${result}` : echoed
    setOutput(activeTab.id, (current) =>
      current ? `${current}\n${entry}` : entry
    )
  }

  // Terminals stack like shell sessions; the log views are singletons that
  // refocus their existing tab instead of duplicating it.
  const openTab = (type: NewTabType) => {
    if (type !== "terminal") {
      const existing = tabs.find((tab) => tab.type === type)
      if (existing) {
        setActiveId(existing.id)
        return
      }
    }
    const id = nextId.current++
    setTabs((current) => [...current, { id, output: "", type }])
    setActiveId(id)
  }

  const closeTab = (id: number) => {
    runTimeouts.current.get(id)?.forEach((timer) => window.clearTimeout(timer))
    runTimeouts.current.delete(id)
    const remaining = tabs.filter((tab) => tab.id !== id)
    // Closing the last tab closes the whole panel; the default set is
    // restored so the panel never reopens empty.
    if (remaining.length === 0) {
      setTabs(DEFAULT_TABS)
      setActiveId(DEFAULT_ACTIVE_ID)
      nextId.current = 2
      setBottomOpen(false)
      return
    }
    setTabs(remaining)
    if (id === activeId) {
      setActiveId(remaining[0].id)
    }
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
        defaultSize={
          typeof initialSize === "number" && initialSize > 0
            ? initialSize
            : BOTTOM_PANEL_DEFAULT_SIZE
        }
        minSize={BOTTOM_PANEL_MIN_SIZE}
        maxSize={BOTTOM_PANEL_MAX_SIZE}
        groupResizeBehavior="preserve-pixel-size"
        onResize={(size, _id, previous) => {
          // Only user- or layout-driven changes, not the mount measurement.
          if (previous) writePanelStorage(BOTTOM_SIZE_KEY, size.inPixels)
        }}
        style={{ overflow: "hidden" }}
      >
        <div
          data-slot="brand-sidebar-bottom"
          className={cn(
            "flex h-full w-full flex-col border-border bg-sidebar text-sidebar-foreground",
            className
          )}
        >
          <div className="flex h-10 shrink-0 items-center gap-1 border-b border-sidebar-border px-1 sm:gap-2 sm:px-2">
            {/* The tab strip scrolls rather than squeezing the actions out. */}
            <TerminalTabs className="min-w-0 flex-1 [scrollbar-width:none] justify-start overflow-x-auto border-0 p-0 [&::-webkit-scrollbar]:hidden">
              {tabs.map((tab) => (
                <TerminalTab
                  active={tab.id === activeTab.id}
                  className="flex-none"
                  icon={TAB_META[tab.type].icon}
                  key={tab.id}
                  onClick={() => setActiveId(tab.id)}
                  onClose={() => closeTab(tab.id)}
                >
                  {tab.type === "terminal" ? "zsh" : TAB_META[tab.type].label}
                  {tab.type === "problems" && (
                    <Badge className="ms-1.5" variant="secondary">
                      {problemLines.length}
                    </Badge>
                  )}
                </TerminalTab>
              ))}
              <NewTabDropdown className="flex-none" onSelect={openTab} />
            </TerminalTabs>

            <div className="ms-auto flex shrink-0 items-center gap-1">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      disabled={
                        activeTab.type !== "terminal" ||
                        activeTab.output === "" ||
                        activeTab.running
                      }
                      onClick={() => setOutput(activeTab.id, () => "")}
                    >
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

          <div className="min-h-0 flex-1">
            {activeTab.type === "terminal" ? (
              <Terminal
                className="h-full rounded-none border-0 bg-transparent"
                isStreaming={activeTab.running ?? false}
                output={activeTab.output}
              >
                <TerminalContent className="h-full max-h-none">
                  {/* While the dev server runs there is no prompt, but the
                      input stays enabled so Ctrl+C can interrupt it. */}
                  <TerminalInput
                    disabled={false}
                    onKeyDown={(event) => {
                      if (
                        activeTab.running &&
                        event.ctrlKey &&
                        event.key.toLowerCase() === "c"
                      ) {
                        event.preventDefault()
                        interrupt(activeTab.id)
                      }
                    }}
                    onSubmit={run}
                    prompt={activeTab.running ? "" : TERMINAL_PROMPT}
                  />
                </TerminalContent>
              </Terminal>
            ) : (
              <LogList lines={LOG_LINES[activeTab.type]} />
            )}
          </div>
        </div>
      </ResizablePanel>
    </>
  )
}
