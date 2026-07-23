"use client"

import * as React from "react"

import {
  ArrowUp02Icon,
  Folder01Icon,
  Mic02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  PromptAddMenu,
} from "@/components/prompt-add-menu"
import {
  PromptApprovalMenu,
  type ApprovalMode,
} from "@/components/prompt-approval-menu"
import {
  PromptCommandMenu,
  filterPromptCommands,
  type PromptCommand,
} from "@/components/prompt-command-menu"
import { PromptModelMenu } from "@/components/prompt-model-menu"
import {
  PromptProjectPicker,
  type PromptProject,
} from "@/components/prompt-project-picker"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export type PromptSubmitValue = {
  text: string
  projectId: string | null
  approval: ApprovalMode
  model: string
  reasoning: string
}

const DEFAULT_PROJECTS: PromptProject[] = [
  { id: "ui-aiellie-dev", name: "ui.aiellie.dev" },
  { id: "aiellie-dev", name: "aiellie.dev" },
  { id: "aiellie", name: "aiellie" },
  { id: "shadcn-inspired", name: "shadcn.inspired" },
]

export function PromptInput({
  projects = DEFAULT_PROJECTS,
  placeholder = "Do anything",
  defaultProjectId = projects[0]?.id ?? null,
  onSubmit,
  onCommand,
  className,
}: {
  projects?: PromptProject[]
  placeholder?: string
  defaultProjectId?: string | null
  onSubmit?: (value: PromptSubmitValue) => void
  onCommand?: (command: PromptCommand) => void
  className?: string
}) {
  const commandListId = React.useId()
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const [value, setValue] = React.useState("")
  const [projectId, setProjectId] = React.useState<string | null>(defaultProjectId)
  const [projectPickerOpen, setProjectPickerOpen] = React.useState(false)
  const [approval, setApproval] = React.useState<ApprovalMode>("ask")
  const [model, setModel] = React.useState("opus-4-8")
  const [reasoning, setReasoning] = React.useState("light")

  // Slash commands only apply to a single leading line, so `/` in the middle of
  // a prompt never triggers the menu.
  const slashQuery =
    value.startsWith("/") && !value.includes("\n") ? value.slice(1) : null
  const [commandsDismissed, setCommandsDismissed] = React.useState(false)
  const commands = React.useMemo(
    () => (slashQuery === null ? [] : filterPromptCommands(slashQuery)),
    [slashQuery]
  )
  const commandMenuOpen = !commandsDismissed && commands.length > 0
  const [activeIndex, setActiveIndex] = React.useState(0)

  // Reset the highlight whenever the query changes, adjusting during render
  // rather than in an effect so the list never paints a stale selection.
  const [lastQuery, setLastQuery] = React.useState(slashQuery)
  if (lastQuery !== slashQuery) {
    setLastQuery(slashQuery)
    setActiveIndex(0)
  }

  const project = projects.find((item) => item.id === projectId)
  const canSubmit = value.trim().length > 0

  const submit = () => {
    if (!canSubmit) return
    onSubmit?.({ text: value.trim(), projectId, approval, model, reasoning })
    setValue("")
    setCommandsDismissed(false)
  }

  const selectCommand = (command: PromptCommand) => {
    setValue(`/${command.name} `)
    setCommandsDismissed(true)
    onCommand?.(command)
    textareaRef.current?.focus()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (commandMenuOpen) {
      if (event.key === "ArrowDown") {
        event.preventDefault()
        setActiveIndex((index) => (index + 1) % commands.length)
        return
      }
      if (event.key === "ArrowUp") {
        event.preventDefault()
        setActiveIndex((index) => (index - 1 + commands.length) % commands.length)
        return
      }
      if (event.key === "Enter" || event.key === "Tab") {
        event.preventDefault()
        selectCommand(commands[activeIndex])
        return
      }
      if (event.key === "Escape") {
        event.preventDefault()
        setCommandsDismissed(true)
        return
      }
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <div className={cn("w-full max-w-3xl", className)}>
      <div className="-mb-4 mx-3 flex items-center rounded-t-2xl bg-muted px-3 pt-1.5 pb-5">
        <PromptProjectPicker
          projects={projects}
          value={projectId}
          onValueChange={setProjectId}
          open={projectPickerOpen}
          onOpenChange={setProjectPickerOpen}
          trigger={
            <button
              type="button"
              className="flex items-center gap-2 rounded-md text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <HugeiconsIcon
                icon={Folder01Icon}
                strokeWidth={1.5}
                className="size-4 text-muted-foreground"
              />
              {project?.name ?? (
                <span className="text-muted-foreground">Choose project</span>
              )}
            </button>
          }
        />
      </div>

      <div className="relative rounded-2xl border bg-background shadow-sm transition-colors focus-within:border-ring">
        {commandMenuOpen ? (
          <PromptCommandMenu
            id={commandListId}
            commands={commands}
            activeIndex={activeIndex}
            onActiveIndexChange={setActiveIndex}
            onSelect={selectCommand}
            className="absolute inset-x-0 bottom-full mb-2"
          />
        ) : null}

        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
            if (!event.target.value.startsWith("/")) setCommandsDismissed(false)
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={2}
          role="combobox"
          aria-expanded={commandMenuOpen}
          aria-controls={commandMenuOpen ? commandListId : undefined}
          aria-activedescendant={
            commandMenuOpen ? `${commandListId}-item-${activeIndex}` : undefined
          }
          className="max-h-64 min-h-16 resize-none border-0 bg-transparent px-4 pt-3 pb-1 shadow-none focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent"
        />

        <div className="flex items-center gap-0.5 p-2">
          <PromptAddMenu
            onSelect={(item) => {
              if (item === "project") setProjectPickerOpen(true)
            }}
          />
          <PromptApprovalMenu value={approval} onValueChange={setApproval} />
          <div className="ms-auto flex items-center gap-0.5">
            <PromptModelMenu
              model={model}
              onModelChange={setModel}
              reasoning={reasoning}
              onReasoningChange={setReasoning}
            />
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
              aria-label="Dictate"
            >
              <HugeiconsIcon icon={Mic02Icon} strokeWidth={1.5} />
            </Button>
            <Button
              size="icon-sm"
              className="rounded-full"
              disabled={!canSubmit}
              onClick={submit}
              aria-label="Send"
            >
              <HugeiconsIcon icon={ArrowUp02Icon} strokeWidth={2} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
