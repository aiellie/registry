"use client"

import * as React from "react"

import {
  Terminal,
  TerminalContent,
  TerminalInput,
  TerminalTab,
  TerminalTabAdd,
  TerminalTabs,
} from "@/components/ai-elements/terminal"

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

export function TerminalDemo() {
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
    <div className="flex w-full flex-col gap-3 py-6">
      <Terminal className="w-full" output={session.output}>
        <TerminalTabs>
          {sessions.map((tab) => (
            <TerminalTab
              active={tab.id === session.id}
              key={tab.id}
              onClick={() => setActiveId(tab.id)}
              onClose={sessions.length > 1 ? () => closeTab(tab.id) : undefined}
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
  )
}
