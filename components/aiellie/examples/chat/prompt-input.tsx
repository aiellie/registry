"use client"

import * as React from "react"

import {
  ArrowUp02Icon,
  AudioWave01Icon,
  Cancel01Icon,
  Folder01Icon,
  GitBranchIcon,
  PlusSignIcon,
  Settings01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { SpeechInput } from "@/components/ai-elements/speech-input"
import { BranchPicker, type PromptBranch } from "@/components/branch-picker"
import {
  EnvironmentPicker,
  type PromptEnvironment,
} from "@/components/environment-picker"
import { getIconForLanguageExtension } from "@/components/icons"
import {
  filterAddMenuItems,
  PromptAddMenuPanel,
  type AddMenuItem,
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
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  branches as sidebarBranches,
  environments as sidebarEnvironments,
  projects as sidebarProjects,
} from "@/lib/sidebar-data"
import { cn } from "@/lib/utils"

export type PromptSubmitValue = {
  text: string
  attachments: File[]
  projectId: string | null
  startIn: StartIn
  branch: string
  environmentId: string | null
  approval: ApprovalMode
  model: string
  effort: string
  fast: boolean
}

type PromptAttachment = {
  id: string
  file: File
  previewUrl: string | null
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function fileExtension(name: string) {
  const dot = name.lastIndexOf(".")
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : null
}

function formatAttachmentMeta(file: File) {
  const extension = fileExtension(file.name)
  const label = extension ? extension.toUpperCase() : "File"
  return `${label} · ${formatFileSize(file.size)}`
}

export function PromptInputDemo({
  projects = sidebarProjects,
  branches = sidebarBranches,
  environments = sidebarEnvironments,
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
  const composerRef = React.useRef<HTMLDivElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const attachmentIdRef = React.useRef(0)

  const [value, setValue] = React.useState("")
  const [attachments, setAttachments] = React.useState<PromptAttachment[]>([])
  const [projectId, setProjectId] = React.useState<string | null>(
    defaultProjectId
  )
  const [projectPickerOpen, setProjectPickerOpen] = React.useState(false)
  const [startIn, setStartIn] = React.useState<StartIn>("local")
  const [startInOpen, setStartInOpen] = React.useState(false)
  const [branch, setBranch] = React.useState(branches[0]?.name ?? "main")
  const [branchOpen, setBranchOpen] = React.useState(false)
  const [environmentId, setEnvironmentId] = React.useState<string | null>(null)
  const [environmentOpen, setEnvironmentOpen] = React.useState(false)
  const [approval, setApproval] = React.useState<ApprovalMode>("ask")
  const [model, setModel] = React.useState("claude-opus-5")
  const [effort, setEffort] = React.useState("high")
  const [fast, setFast] = React.useState(true)
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

  // `@` mirrors the slash pattern for the add menu, so typing keeps filtering
  // with the cursor still in the textarea. The + button routes through the
  // same state: with an empty composer it types the `@` for you; otherwise it
  // just opens the unfiltered panel.
  const atQuery =
    value.startsWith("@") && !value.includes("\n") ? value.slice(1) : null
  const [addDismissed, setAddDismissed] = React.useState(false)
  const [addOpenedByButton, setAddOpenedByButton] = React.useState(false)
  const addQuery = atQuery ?? (addOpenedByButton ? "" : null)
  const addGroups = React.useMemo(
    () => (addQuery === null ? [] : filterAddMenuItems(addQuery)),
    [addQuery]
  )
  const addItems = React.useMemo(
    () => addGroups.flatMap((group) => group.items),
    [addGroups]
  )
  const addMenuOpen = !commandMenuOpen && !addDismissed && addItems.length > 0

  const anyMenuOpen = commandMenuOpen || addMenuOpen
  const [activeIndex, setActiveIndex] = React.useState(0)

  // The menus hang above the composer, so cap their height to the space that
  // actually exists between the composer and the viewport top — otherwise
  // they clip off screen whenever the composer sits high on the page.
  const [menuMaxHeight, setMenuMaxHeight] = React.useState<number>()
  React.useLayoutEffect(() => {
    if (!anyMenuOpen) return
    const measure = () => {
      const top = composerRef.current?.getBoundingClientRect().top ?? 0
      setMenuMaxHeight(Math.min(288, Math.max(128, top - 16)))
    }
    measure()
    window.addEventListener("resize", measure)
    window.addEventListener("scroll", measure, true)
    return () => {
      window.removeEventListener("resize", measure)
      window.removeEventListener("scroll", measure, true)
    }
  }, [anyMenuOpen])

  // Reset the highlight whenever the query (or which menu is open) changes,
  // adjusting during render rather than in an effect so the list never
  // paints a stale selection.
  const menuKey = commandMenuOpen
    ? `/${slashQuery}`
    : addMenuOpen
      ? `@${addQuery}`
      : null
  const [lastMenuKey, setLastMenuKey] = React.useState(menuKey)
  if (lastMenuKey !== menuKey) {
    setLastMenuKey(menuKey)
    setActiveIndex(0)
  }

  const project = projects.find((item) => item.id === projectId)
  const startInOption =
    START_IN_OPTIONS.find((option) => option.value === startIn) ??
    START_IN_OPTIONS[0]
  const environment = environments.find((item) => item.id === environmentId)
  const canSubmit = value.trim().length > 0 || attachments.length > 0

  // Blob preview URLs outlive React state, so revoke whatever is left on
  // unmount via a ref that tracks the latest attachments.
  const attachmentsRef = React.useRef(attachments)
  React.useEffect(() => {
    attachmentsRef.current = attachments
  }, [attachments])
  React.useEffect(
    () => () => {
      attachmentsRef.current.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl)
      })
    },
    []
  )

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return
    const next = Array.from(files).map((file) => ({
      id: `attachment-${attachmentIdRef.current++}`,
      file,
      previewUrl: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
    }))
    setAttachments((current) => [...current, ...next])
  }

  const removeAttachment = (attachment: PromptAttachment) => {
    if (attachment.previewUrl) URL.revokeObjectURL(attachment.previewUrl)
    setAttachments((current) =>
      current.filter((item) => item.id !== attachment.id)
    )
  }

  const clearAttachments = () => {
    attachments.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl)
    })
    setAttachments([])
  }

  const submit = () => {
    if (!canSubmit) return
    onSubmit?.({
      text: value.trim(),
      attachments: attachments.map((item) => item.file),
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
    clearAttachments()
    setCommandsDismissed(false)
    setAddDismissed(false)
    setAddOpenedByButton(false)
  }

  const selectCommand = (command: PromptCommand) => {
    setValue(`/${command.name} `)
    setCommandsDismissed(true)
    onCommand?.(command)
    textareaRef.current?.focus()
  }

  const handleAddAction = (action: string) => {
    if (action === "files") fileInputRef.current?.click()
    if (action === "project") setProjectPickerOpen(true)
  }

  const selectAddItem = (item: AddMenuItem) => {
    if (atQuery !== null) setValue("")
    setAddOpenedByButton(false)
    handleAddAction(item.value)
    textareaRef.current?.focus()
  }

  const openAddMenu = () => {
    setAddDismissed(false)
    if (value === "") {
      setValue("@")
    } else {
      setAddOpenedByButton(true)
    }
    textareaRef.current?.focus()
  }

  // Both menus share one keyboard contract; only one can be open at a time.
  const activeMenu = commandMenuOpen
    ? {
        count: commands.length,
        select: (index: number) => selectCommand(commands[index]),
        dismiss: () => setCommandsDismissed(true),
      }
    : addMenuOpen
      ? {
          count: addItems.length,
          select: (index: number) => selectAddItem(addItems[index]),
          dismiss: () => {
            setAddDismissed(true)
            setAddOpenedByButton(false)
          },
        }
      : null

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (activeMenu) {
      const { count, select, dismiss } = activeMenu
      if (event.key === "ArrowDown") {
        event.preventDefault()
        setActiveIndex((index) => (index + 1) % count)
        return
      }
      if (event.key === "ArrowUp") {
        event.preventDefault()
        setActiveIndex((index) => (index - 1 + count) % count)
        return
      }
      if (event.key === "Enter" || event.key === "Tab") {
        event.preventDefault()
        select(activeIndex)
        return
      }
      if (event.key === "Escape") {
        event.preventDefault()
        dismiss()
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
      <div className="mx-3 -mb-4 flex items-center gap-4 rounded-t-2xl bg-muted px-3 pt-2 pb-5">
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

      <div
        ref={composerRef}
        className="relative rounded-2xl border bg-background shadow-xs transition-colors focus-within:border-ring"
      >
        {commandMenuOpen ? (
          <PromptCommandMenu
            id={commandListId}
            commands={commands}
            activeIndex={activeIndex}
            onActiveIndexChange={setActiveIndex}
            onSelect={selectCommand}
            className="absolute inset-x-0 bottom-full mb-2"
            style={{ maxHeight: menuMaxHeight }}
          />
        ) : null}

        {addMenuOpen ? (
          <PromptAddMenuPanel
            id={commandListId}
            groups={addGroups}
            activeIndex={activeIndex}
            onActiveIndexChange={setActiveIndex}
            onSelect={selectAddItem}
            className="absolute inset-x-0 bottom-full mb-2"
            style={{ maxHeight: menuMaxHeight }}
          />
        ) : null}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          tabIndex={-1}
          aria-hidden="true"
          className="hidden"
          onChange={(event) => {
            addFiles(event.target.files)
            // Reset so picking the same file again still fires a change event.
            event.target.value = ""
          }}
        />

        {attachments.length > 0 ? (
          <AttachmentGroup className="px-3 pt-3">
            {attachments.map((attachment) =>
              attachment.previewUrl ? (
                <Attachment key={attachment.id} className="relative min-w-0">
                  <AttachmentMedia variant="image" className="w-16">
                    <img
                      src={attachment.previewUrl}
                      alt={attachment.file.name}
                    />
                  </AttachmentMedia>
                  <AttachmentActions className="absolute end-1 top-1">
                    <AttachmentRemoveAction
                      attachment={attachment}
                      onRemove={removeAttachment}
                      className="rounded-full bg-background/80 shadow-xs backdrop-blur-xs hover:bg-background"
                    />
                  </AttachmentActions>
                </Attachment>
              ) : (
                <Attachment key={attachment.id} size="sm">
                  <AttachmentMedia>
                    {getIconForLanguageExtension(
                      fileExtension(attachment.file.name) ?? ""
                    )}
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>{attachment.file.name}</AttachmentTitle>
                    <AttachmentDescription>
                      {formatAttachmentMeta(attachment.file)}
                    </AttachmentDescription>
                  </AttachmentContent>
                  <AttachmentActions>
                    <AttachmentRemoveAction
                      attachment={attachment}
                      onRemove={removeAttachment}
                    />
                  </AttachmentActions>
                </Attachment>
              )
            )}
          </AttachmentGroup>
        ) : null}

        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => {
            const next = event.target.value
            setValue(next)
            if (!next.startsWith("/")) setCommandsDismissed(false)
            if (!next.startsWith("@")) setAddDismissed(false)
            // Typing prompt text closes a browse-mode add menu; an `@` query
            // keeps it open through `atQuery` instead.
            setAddOpenedByButton(false)
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={2}
          role="combobox"
          aria-expanded={anyMenuOpen}
          aria-controls={anyMenuOpen ? commandListId : undefined}
          aria-activedescendant={
            anyMenuOpen ? `${commandListId}-item-${activeIndex}` : undefined
          }
          className="max-h-64 min-h-16 resize-none border-0 bg-transparent px-4 pt-3 pb-1 shadow-none focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent"
        />

        <div className="flex items-center gap-0.5 p-2">
          <PromptModelMenu
            model={model}
            onModelChange={setModel}
            effort={effort}
            onEffortChange={setEffort}
            fast={fast}
            onFastChange={setFast}
          />
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-full"
                  aria-label="Add files and more"
                  aria-expanded={addMenuOpen}
                  aria-controls={addMenuOpen ? commandListId : undefined}
                  onClick={openAddMenu}
                >
                  <HugeiconsIcon icon={PlusSignIcon} strokeWidth={1.5} />
                </Button>
              }
            />
            <TooltipContent side="top">
              Add files and more
              <Kbd>@</Kbd>
            </TooltipContent>
          </Tooltip>
          {!isDictating && (
            <PromptApprovalMenu value={approval} onValueChange={setApproval} />
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

function AttachmentRemoveAction({
  attachment,
  onRemove,
  className,
}: {
  attachment: PromptAttachment
  onRemove: (attachment: PromptAttachment) => void
  className?: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <AttachmentAction
            aria-label={`Remove ${attachment.file.name}`}
            onClick={() => onRemove(attachment)}
            className={className}
          >
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
          </AttachmentAction>
        }
      />
      <TooltipContent side="top">Remove file</TooltipContent>
    </Tooltip>
  )
}
