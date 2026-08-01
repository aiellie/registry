"use client"

import * as React from "react"
import {
  AlertCircleIcon,
  CancelCircleIcon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import {
  Terminal,
  TerminalActions,
  TerminalClearButton,
  TerminalContent,
  TerminalCopyButton,
  TerminalHeader,
  TerminalInput,
  TERMINAL_TAB_OPTIONS,
  TerminalStatus,
  TerminalTab,
  TerminalTabAdd,
  TerminalTabs,
  TerminalTitle,
  type TerminalTabType,
} from "@/components/ai-elements/terminal"
import { Example, ExampleWrapper } from "@/components/example"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

/* -------------------------------------------------------------------------- */
/*                                    Data                                     */
/* -------------------------------------------------------------------------- */

const BUILD_OUTPUT = `$ pnpm build

> registry@0.1.0 build
> next build

  ▲ Next.js 16.0.0 (Turbopack)

  Creating an optimized production build ...
 ✓ Compiled successfully in 8.2s
 ✓ Collecting page data
 ✓ Generating static pages (150/150)
 ✓ Finalizing page optimization

Route (app)                 Size     First Load JS
┌ ○ /                       5.2 kB   120 kB
├ ○ /registry               12.4 kB  180 kB
└ ○ /tokens                 8.9 kB   143 kB`

const STREAM_LINES = [
  "$ pnpm registry:build",
  "",
  "> registry@0.1.0 registry:build",
  "> shadcn build",
  "",
  "- Building registry...",
  "✓ Validated registry.json",
  "✓ Built theme.json",
  "✓ Built button.json",
  "✓ Built tooltip.json",
  "✓ Built web-preview.json",
  "✓ Built terminal.json",
  "",
  "Done. 150 items written to public/r in 1.8s.",
]

const RESPONSE_OUTPUT = `{
  "name": "terminal",
  "type": "registry:ui",
  "dependencies": ["shiki"],
  "registryDependencies": [
    "https://ui.aiellie.dev/r/button.json",
    "https://ui.aiellie.dev/r/tooltip.json"
  ]
}`

/* -------------------------------------------------------------------------- */
/*                                  Examples                                   */
/* -------------------------------------------------------------------------- */

export default function TerminalExample() {
  return (
    <ExampleWrapper className="md:grid-cols-1">
      <InteractiveExample />
      <DefaultExample />
      <StreamingExample />
      <LanguageExample />
    </ExampleWrapper>
  )
}

/* -------------------------------------------------------------------------- */

const PROMPT = "stashd@Mac ui.aiellie.dev %"

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
  success: CheckmarkCircle02Icon,
  warning: AlertCircleIcon,
  error: CancelCircleIcon,
}

const STATUS_ICON_CLASSES: Record<StatusLevel, string> = {
  info: "bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400",
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
    { level: "info", text: "> ui.aiellie.dev@0.0.1 build — next build" },
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

function InteractiveExample({ className }: { className?: string }) {
  const [sessions, setSessions] = React.useState<Session[]>([
    { id: 1, output: "", title: "ui.aiellie.dev", type: "terminal" },
  ])
  const [activeId, setActiveId] = React.useState(1)
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
    else if (name === "pwd") result = "/Users/stashd/ui.aiellie.dev"
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
    <Example title="Interactive — panel tabs" containerClassName={className}>
      <div className="flex w-xl max-w-full flex-col gap-3">
        <Terminal className="h-72 w-full" output={session.output}>
          <TerminalTabs className="shrink-0">
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
            <TerminalTabAdd onSelect={addTab} />
          </TerminalTabs>
          <TerminalContent className="min-h-0 min-w-0 flex-1 overflow-auto">
            {session.type === "terminal" ? (
              <TerminalInput onSubmit={run} prompt={PROMPT} />
            ) : (
              <PanelOutput type={session.type} />
            )}
          </TerminalContent>
        </Terminal>
        <p className="text-sm text-muted-foreground">
          {PANEL_DESCRIPTIONS[session.type]}
          {session.type === "terminal" && (
            <>
              {" "}
              Type <code>help</code> to see the available commands.
            </>
          )}
        </p>
      </div>
    </Example>
  )
}

/* -------------------------------------------------------------------------- */

function DefaultExample({ className }: { className?: string }) {
  const [output, setOutput] = React.useState(BUILD_OUTPUT)

  return (
    <Example title="Default — copy and clear actions" containerClassName={className}>
      <div className="flex w-xl max-w-full flex-col gap-3">
        <Terminal
          className="h-72 w-full"
          onClear={() => setOutput("")}
          output={output}
        >
          <TerminalHeader className="shrink-0">
            <TerminalTitle />
            <div className="flex items-center gap-1">
              <TerminalStatus />
              <TerminalActions>
                <TerminalCopyButton />
                <TerminalClearButton />
              </TerminalActions>
            </div>
          </TerminalHeader>
          <TerminalContent className="min-h-0 min-w-0 flex-1 overflow-auto" />
        </Terminal>
        {output === "" && (
          <Button
            className="self-start"
            onClick={() => setOutput(BUILD_OUTPUT)}
            size="sm"
            variant="outline"
          >
            Restore output
          </Button>
        )}
      </div>
    </Example>
  )
}

/* -------------------------------------------------------------------------- */

function StreamingExample({ className }: { className?: string }) {
  const [lineCount, setLineCount] = React.useState(0)
  const isStreaming = lineCount < STREAM_LINES.length

  React.useEffect(() => {
    if (!isStreaming) return
    const id = window.setInterval(
      () => setLineCount((current) => current + 1),
      400
    )
    return () => window.clearInterval(id)
  }, [isStreaming])

  return (
    <Example title="Streaming — clear restarts the run" containerClassName={className}>
      <Terminal
        className="h-72 w-xl max-w-full"
        isStreaming={isStreaming}
        onClear={() => setLineCount(0)}
        output={STREAM_LINES.slice(0, lineCount).join("\n")}
      >
        <TerminalHeader className="shrink-0">
          <TerminalTitle>registry:build</TerminalTitle>
          <div className="flex items-center gap-2">
            <TerminalStatus>
              <Spinner className="size-3" />
              Running
            </TerminalStatus>
            <TerminalActions>
              <TerminalCopyButton />
              <TerminalClearButton />
            </TerminalActions>
          </div>
        </TerminalHeader>
        <TerminalContent className="min-h-0 min-w-0 flex-1 overflow-auto" />
      </Terminal>
    </Example>
  )
}

/* -------------------------------------------------------------------------- */

function LanguageExample({ className }: { className?: string }) {
  return (
    <Example title="Custom language — JSON response" containerClassName={className}>
      <Terminal
        className="h-72 w-xl max-w-full"
        lang="json"
        output={RESPONSE_OUTPUT}
      >
        <TerminalHeader className="shrink-0">
          <TerminalTitle>terminal.json</TerminalTitle>
          <TerminalActions>
            <TerminalCopyButton tooltip="Copy JSON" />
          </TerminalActions>
        </TerminalHeader>
        <TerminalContent className="min-h-0 min-w-0 flex-1 overflow-auto" />
      </Terminal>
    </Example>
  )
}
