"use client"

import * as React from "react"

import {
  Terminal,
  TerminalActions,
  TerminalClearButton,
  TerminalContent,
  TerminalCopyButton,
  TerminalHeader,
  TerminalInput,
  TerminalStatus,
  TerminalTab,
  TerminalTabAdd,
  TerminalTabs,
  TerminalTitle,
} from "@/components/ai-elements/terminal"
import { Example, ExampleWrapper } from "@/components/example"
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

type Session = { id: number; title: string; output: string }

function InteractiveExample() {
  const [sessions, setSessions] = React.useState<Session[]>([
    { id: 1, output: "", title: "ui.aiellie.dev" },
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

  const addTab = () => {
    const id = nextId.current++
    setSessions((current) => [...current, { id, output: "", title: "zsh" }])
    setActiveId(id)
  }

  const closeTab = (id: number) => {
    const remaining = sessions.filter((tab) => tab.id !== id)
    setSessions(remaining)
    if (id === activeId && remaining.length > 0) setActiveId(remaining[0].id)
  }

  return (
    <Example title="Interactive — tabs and a typed prompt">
      <div className="flex w-full flex-col gap-3">
        <Terminal className="w-full" output={session.output}>
          <TerminalTabs>
            {sessions.map((tab) => (
              <TerminalTab
                active={tab.id === session.id}
                key={tab.id}
                onClick={() => setActiveId(tab.id)}
                onClose={
                  sessions.length > 1 ? () => closeTab(tab.id) : undefined
                }
              >
                {tab.title}
              </TerminalTab>
            ))}
            <TerminalTabAdd onClick={addTab} />
          </TerminalTabs>
          <TerminalContent className="min-h-48">
            <TerminalInput onSubmit={run} prompt={PROMPT} />
          </TerminalContent>
        </Terminal>
        <p className="text-sm text-muted-foreground">
          Click the terminal and type <code>help</code>. Each tab keeps its own
          scrollback; ArrowUp recalls history.
        </p>
      </div>
    </Example>
  )
}

/* -------------------------------------------------------------------------- */

function DefaultExample() {
  const [output, setOutput] = React.useState(BUILD_OUTPUT)

  return (
    <Example title="Default — copy and clear actions">
      <div className="flex w-full flex-col gap-3">
        <Terminal onClear={() => setOutput("")} output={output} />
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

function StreamingExample() {
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
    <Example title="Streaming — clear restarts the run">
      <Terminal
        className="w-full"
        isStreaming={isStreaming}
        onClear={() => setLineCount(0)}
        output={STREAM_LINES.slice(0, lineCount).join("\n")}
      >
        <TerminalHeader>
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
        <TerminalContent />
      </Terminal>
    </Example>
  )
}

/* -------------------------------------------------------------------------- */

function LanguageExample() {
  return (
    <Example title="Custom language — JSON response">
      <Terminal className="w-full" lang="json" output={RESPONSE_OUTPUT}>
        <TerminalHeader>
          <TerminalTitle>terminal.json</TerminalTitle>
          <TerminalActions>
            <TerminalCopyButton tooltip="Copy JSON" />
          </TerminalActions>
        </TerminalHeader>
        <TerminalContent />
      </Terminal>
    </Example>
  )
}
