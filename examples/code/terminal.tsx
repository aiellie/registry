"use client"

import * as React from "react"
import {
  ExclamationMarkIcon,
  Cancel01Icon,
  EraserIcon,
  Tick02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import {
  Terminal,
  TerminalActions,
  TerminalClearButton,
  TerminalContent,
  TerminalInput,
  TERMINAL_TAB_OPTIONS,
  TerminalTab,
  TerminalTabAdd,
  TerminalTabs,
  type TerminalTabType,
} from "@/components/ai-elements/terminal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const PROMPT = "stashd@Mac registry.aiellie.dev %"

const HELP_TEXT = [
  "Available commands:",
  "  help              this list",
  "  ls                list files",
  "  pwd               print working directory",
  "  whoami            print user",
  "  date              print date",
  "  echo <text>       print text",
  "  clear             clear the terminal",
].join("\n")

type StatusLevel = "info" | "success" | "warning" | "error"
type StaticPanelType = Exclude<TerminalTabType, "terminal">
type PanelLine = { level: StatusLevel; text: string }

const STATUS_ICONS: Record<StatusLevel, IconSvgElement> = {
  info: InformationCircleIcon,
  success: Tick02Icon,
  warning: ExclamationMarkIcon,
  error: Cancel01Icon,
}

const STATUS_ICON_CLASSES: Record<StatusLevel, string> = {
  info: "",
  success:
    "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
  warning:
    "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
  error: "bg-destructive/10 text-destructive dark:bg-destructive/20",
}

const PANEL_LINES: Record<StaticPanelType, PanelLine[]> = {
  console: [
    { level: "success", text: "[14:02:11] ready in 812 ms" },
    {
      level: "info",
      text: "[14:02:12] compiled /demo/terminal in 214 ms",
    },
    {
      level: "success",
      text: "[14:02:14] GET /demo/terminal 200 in 38 ms",
    },
    {
      level: "warning",
      text: "[14:02:19] slow compilation detected (1.4 s)",
    },
    { level: "error", text: "[14:02:26] failed to load /api/session" },
  ],
  problems: [
    {
      level: "warning",
      text: "components/terminal-panel.tsx:42:9 — Add an accessible label to this control",
    },
    {
      level: "error",
      text: "lib/session.ts:118:5 — Type 'undefined' is not assignable to type 'Session'",
    },
  ],
  output: [
    { level: "info", text: "$ pnpm build" },
    { level: "info", text: "> registry.aiellie.dev@0.0.1 build — next build" },
    { level: "info", text: "Creating an optimized production build ..." },
    { level: "success", text: "Compiled successfully in 8.2s" },
    { level: "success", text: "Generated static pages (150/150)" },
  ],
}

const PROBLEM_COUNT = PANEL_LINES.problems.length

const PANEL_DESCRIPTIONS: Record<TerminalTabType, string> = {
  terminal: "Run shell commands and keep independent command history.",
  console: "Inspect timestamped application and development-server logs.",
  problems: "Review sample warnings and errors grouped by source file.",
  output: "Follow sample build and task output.",
}

type Session = {
  id: number
  title: string
  output: string
  type: TerminalTabType
}

function PanelOutput({ type }: { type: StaticPanelType }) {
  return (
    <div className="space-y-1.5 p-2.5">
      {PANEL_LINES[type].map((line) => (
        <div className="flex items-start gap-2 leading-relaxed" key={line.text}>
          <span
            className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full ${STATUS_ICON_CLASSES[line.level]}`}
          >
            <HugeiconsIcon
              className="size-3"
              icon={STATUS_ICONS[line.level]}
              strokeWidth={2}
            />
          </span>
          <span>{line.text}</span>
        </div>
      ))}
    </div>
  )
}

export function TerminalDemo() {
  const [sessions, setSessions] = React.useState<Session[]>([
    { id: 1, output: "", title: "registry.aiellie.dev", type: "terminal" },
  ])
  const [activeId, setActiveId] = React.useState(1)
  const [isOpen, setIsOpen] = React.useState(true)
  const nextId = React.useRef(2)

  const session = sessions.find((tab) => tab.id === activeId) ?? sessions[0]

  const setOutput = (id: number, output: (current: string) => string) =>
    setSessions((current) =>
      current.map((tab) =>
        tab.id === id ? { ...tab, output: output(tab.output) } : tab
      )
    )

  const run = (command: string) => {
    const trimmed = command.trim()

    if (trimmed === "clear") {
      setOutput(session.id, () => "")
      return
    }

    const [name, ...rest] = trimmed.split(/\s+/)
    let result = ""

    if (trimmed === "") result = ""
    else if (name === "help") result = HELP_TEXT
    else if (name === "ls")
      result = "app  components  lib  public  package.json  registry.json"
    else if (name === "pwd") result = "/Users/stashd/registry.aiellie.dev"
    else if (name === "whoami") result = "stashd"
    else if (name === "date") result = new Date().toString()
    else if (name === "echo") result = rest.join(" ")
    else result = `zsh: command not found: ${name}`

    const echoed = `${PROMPT} ${command}`.trimEnd()
    const entry = result ? `${echoed}\n${result}` : echoed
    setOutput(session.id, (current) =>
      current ? `${current}\n${entry}` : entry
    )
  }

  const addTab = (type: TerminalTabType) => {
    const id = nextId.current++
    const title =
      TERMINAL_TAB_OPTIONS.find((option) => option.type === type)?.label ?? type
    setSessions((current) => [...current, { id, output: "", title, type }])
    setActiveId(id)
  }

  const closeTab = (id: number) => {
    const remaining = sessions.filter((tab) => tab.id !== id)
    setSessions(remaining)
    if (id === activeId && remaining.length > 0) setActiveId(remaining[0].id)
  }

  return (
    <div className="flex min-h-dvh w-full items-center justify-center p-6">
      {isOpen ? (
        <Terminal
          className="h-72 w-xl max-w-full"
          onClear={() => setOutput(session.id, () => "")}
          output={session.output}
        >
          <div className="flex shrink-0 items-center gap-1 border-b px-2 py-1.5">
            <TerminalTabs className="no-scrollbar min-w-0 flex-1 overflow-x-auto border-0 p-0">
              {sessions.map((tab) => (
                <TerminalTab
                  active={tab.id === session.id}
                  className="w-max shrink-0"
                  icon={
                    TERMINAL_TAB_OPTIONS.find(
                      (option) => option.type === tab.type
                    )?.icon
                  }
                  key={tab.id}
                  onClick={() => setActiveId(tab.id)}
                  onClose={
                    sessions.length > 1 ? () => closeTab(tab.id) : undefined
                  }
                >
                  {tab.title}
                  {tab.type === "problems" && (
                    <Badge
                      className="ms-1 h-4 min-w-4 px-1 text-[10px] leading-none"
                      variant="destructive"
                    >
                      {PROBLEM_COUNT}
                    </Badge>
                  )}
                </TerminalTab>
              ))}
              <TerminalTabAdd className="shrink-0" onSelect={addTab} />
            </TerminalTabs>
            <TerminalActions className="ms-auto shrink-0">
              <TerminalClearButton
                aria-label="Clear output"
                disabled={session.type !== "terminal" || session.output === ""}
                tooltip="Clear output"
              >
                <HugeiconsIcon
                  icon={EraserIcon}
                  strokeWidth={1.5}
                  className="size-3.5"
                />
              </TerminalClearButton>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      aria-label="Close terminal panel"
                      onClick={() => setIsOpen(false)}
                      size="icon-xs"
                      variant="ghost"
                    />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Close panel</TooltipContent>
              </Tooltip>
            </TerminalActions>
          </div>
          <TerminalContent className="min-h-0 min-w-0 flex-1 overflow-auto">
            {session.type === "terminal" ? (
              <TerminalInput
                onSubmit={run}
                placeholder={
                  session.output === ""
                    ? "Type help to see available commands"
                    : undefined
                }
                prompt={PROMPT}
              />
            ) : (
              <PanelOutput type={session.type} />
            )}
          </TerminalContent>
        </Terminal>
      ) : (
        <Button
          className="self-start"
          onClick={() => setIsOpen(true)}
          size="sm"
          variant="outline"
        >
          Open terminal
        </Button>
      )}
    </div>
  )
}
