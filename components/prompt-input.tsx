"use client"

import * as React from "react"

import {
  ArrowUp02Icon,
  AudioWave01Icon,
  Folder01Icon,
  GitBranchIcon,
  Settings01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { SpeechInput } from "@/components/ai-elements/speech-input"
import {
  BranchPicker,
  type PromptBranch,
} from "@/components/branch-picker"
import {
  EnvironmentPicker,
  type PromptEnvironment,
} from "@/components/environment-picker"
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
import {
  START_IN_OPTIONS,
  StartInPicker,
  type StartIn,
} from "@/components/start-in-picker"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export type PromptSubmitValue = {
  text: string
  projectId: string | null
  startIn: StartIn
  branch: string
  environmentId: string | null
  approval: ApprovalMode
  model: string
  effort: string
  fast: boolean
}

const DEFAULT_PROJECTS: PromptProject[] = [
  { id: "ui-aiellie-dev", name: "ui.aiellie.dev" },
  { id: "aiellie-dev", name: "aiellie.dev" },
  { id: "aiellie", name: "aiellie" },
  { id: "shadcn-inspired", name: "shadcn.inspired" },
]

const DEFAULT_BRANCHES: PromptBranch[] = [
  { name: "main", hint: "Uncommitted: 1 file" },
]

const DEFAULT_ENVIRONMENTS: PromptEnvironment[] = []

export function PromptInput({
  projects = DEFAULT_PROJECTS,
  branches = DEFAULT_BRANCHES,
  environments = DEFAULT_ENVIRONMENTS,
  placeholder = "Do anything",
  defaultProjectId = projects[0]?.id ?? null,
  onSubmit,
  onCommand,
  className,
}: {
  projects?: PromptProject[]
  branches?: PromptBranch[]
  environments?: PromptEnvironment[]
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
  const [startIn, setStartIn] = React.useState<StartIn>("local")
  const [startInOpen, setStartInOpen] = React.useState(false)
  const [branch, setBranch] = React.useState(branches[0]?.name ?? "main")
  const [branchOpen, setBranchOpen] = React.useState(false)
  const [environmentId, setEnvironmentId] = React.useState<string | null>(null)
  const [environmentOpen, setEnvironmentOpen] = React.useState(false)
  const [approval, setApproval] = React.useState<ApprovalMode>("ask")
  const [model, setModel] = React.useState("claude-opus-5")
  const [effort, setEffort] = React.useState("light")
  const [fast, setFast] = React.useState(false)
  const [isDictating, setIsDictating] = React.useState(false)

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
  const startInOption =
    START_IN_OPTIONS.find((option) => option.value === startIn) ??
    START_IN_OPTIONS[0]
  const environment = environments.find((item) => item.id === environmentId)
  const canSubmit = value.trim().length > 0

  const submit = () => {
    if (!canSubmit) return
    onSubmit?.({
      text: value.trim(),
      projectId,
      startIn,
      branch,
      environmentId,
      approval,
      model,
      effort,
      fast,
    })
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
      <div className="-mb-4 mx-3 flex items-center gap-4 rounded-t-2xl bg-muted px-3 pt-2 pb-5">
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
                className={cn(
                  "size-3.5 text-muted-foreground",
                  project &&
                    "transition-opacity group-hover/project:opacity-0 group-has-[[data-slot=prompt-project-clear]:focus-visible]/project:opacity-0"
                )}
              />
              {project?.name ?? (
                <span className="text-muted-foreground">Choose project</span>
              )}
            </button>
          }
        />
        {project ? (
          <>
            <Tooltip>
              <StartInPicker
                value={startIn}
                onValueChange={(next) => {
                  setStartIn(next)
                  if (next !== "worktree") setEnvironmentId(null)
                }}
                open={startInOpen}
                onOpenChange={setStartInOpen}
                trigger={
                  <TooltipTrigger
                    render={
                      <button
                        type="button"
                        className="flex items-center gap-1.5 rounded-md text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        <HugeiconsIcon
                          icon={startInOption.icon}
                          strokeWidth={1.5}
                          className="size-3.5 text-muted-foreground"
                        />
                        {startInOption.triggerLabel}
                      </button>
                    }
                  />
                }
              />
              <TooltipContent side="top">
                Select where to run the chat
              </TooltipContent>
            </Tooltip>
            {startIn === "worktree" ? (
              <Tooltip>
                <EnvironmentPicker
                  environments={environments}
                  value={environmentId}
                  onValueChange={setEnvironmentId}
                  open={environmentOpen}
                  onOpenChange={setEnvironmentOpen}
                  trigger={
                    <TooltipTrigger
                      render={
                        <button
                          type="button"
                          className="flex items-center gap-1.5 rounded-md text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                        >
                          <HugeiconsIcon
                            icon={Settings01Icon}
                            strokeWidth={1.5}
                            className="size-3.5 text-muted-foreground"
                          />
                          {environment?.name ?? "No environment"}
                        </button>
                      }
                    />
                  }
                />
                <TooltipContent side="top">Select environment</TooltipContent>
              </Tooltip>
            ) : null}
            <Tooltip>
              <BranchPicker
                branches={branches}
                value={branch}
                onValueChange={setBranch}
                localChanges={Boolean(
                  branches.find((item) => item.name === branch)?.hint
                )}
                open={branchOpen}
                onOpenChange={setBranchOpen}
                trigger={
                  <TooltipTrigger
                    render={
                      <button
                        type="button"
                        className="flex items-center gap-1.5 rounded-md text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        <HugeiconsIcon
                          icon={GitBranchIcon}
                          strokeWidth={1.5}
                          className="size-3.5 text-muted-foreground"
                        />
                        {branch}
                      </button>
                    }
                  />
                }
              />
              <TooltipContent side="top">Switch branch</TooltipContent>
            </Tooltip>
          </>
        ) : null}
      </div>

      <div className="relative rounded-2xl border bg-background shadow-xs transition-colors focus-within:border-ring">
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
          {!isDictating && (
            <>
              <PromptApprovalMenu value={approval} onValueChange={setApproval} />
              <PromptModelMenu
                model={model}
                onModelChange={setModel}
                effort={effort}
                onEffortChange={setEffort}
                fast={fast}
                onFastChange={setFast}
              />
            </>
          )}
          <div
            className={cn(
              "ms-auto flex items-center gap-0.5",
              isDictating && "min-w-0 flex-1"
            )}
          >
            <SpeechInput
              aria-label={isDictating ? "Stop dictation" : "Dictate"}
              tooltip={isDictating ? "Stop dictation" : "Dictate"}
              onListeningChange={setIsDictating}
              onTranscriptionChange={(text) => {
                setValue((current) =>
                  current ? `${current.trimEnd()} ${text}` : text
                )
                setCommandsDismissed(false)
              }}
            />
            {canSubmit ? (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      size="icon-sm"
                      className="rounded-full"
                      onClick={submit}
                      aria-label="Send"
                    >
                      <HugeiconsIcon icon={ArrowUp02Icon} strokeWidth={2} />
                    </Button>
                  }
                />
                <TooltipContent>Send</TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      size="icon-sm"
                      className="rounded-full"
                      aria-label="Start voice chat"
                    >
                      <HugeiconsIcon icon={AudioWave01Icon} strokeWidth={2} />
                    </Button>
                  }
                />
                <TooltipContent>Start voice chat</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
