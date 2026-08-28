"use client"

import * as React from "react"
import {
  AiBrain01Icon,
  ArrowDown01Icon,
  ArrowReloadHorizontalIcon,
  Copy01Icon,
  Delete02Icon,
  FlashIcon,
  SparklesIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ChatStatus } from "ai"

import { cn } from "@/lib/utils"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input"
import { Badge } from "@/components/ui/badge"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Message, MessageAvatar, MessageContent } from "@/components/ui/message"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type Role = "user" | "assistant"
type ChatMessage = { id: string; role: Role; text: string }

const models = [
  {
    id: "nova-sonnet",
    name: "Nova Sonnet",
    short: "Sonnet",
    context: "200K",
    note: "Balanced everyday work",
    speed: 42,
    icon: SparklesIcon,
  },
  {
    id: "nova-opus",
    name: "Nova Opus",
    short: "Opus",
    context: "500K",
    note: "Deepest reasoning",
    speed: 72,
    icon: AiBrain01Icon,
  },
  {
    id: "nova-haiku",
    name: "Nova Haiku",
    short: "Haiku",
    context: "128K",
    note: "Fastest and cheapest",
    speed: 22,
    icon: FlashIcon,
  },
] as const

const seed: ChatMessage[] = [
  {
    id: "seed-1",
    role: "user",
    text: "Where do the theme tokens actually live?",
  },
  {
    id: "seed-2",
    role: "assistant",
    text: "All of them sit in `app/globals.css` — one `@theme inline` block plus the `:root` and `.dark` oklch vars. Components never hardcode a colour.",
  },
  {
    id: "seed-3",
    role: "user",
    text: "And composing a Button as a link?",
  },
  {
    id: "seed-4",
    role: "assistant",
    text: "Base UI composes with `render`, not `asChild`. Pass `nativeButton={false}` alongside it or the console will let you know.",
  },
]

const replies = [
  "Good question. Every item installs through `shadcn add` with a full registry URL, so the component lands in your repo as source you own — edit it, don't wrap it.",
  "Short answer: reach for the token, never the hex. `bg-primary` and `text-muted-foreground` resolve per theme, so light, dark and RTL stay in sync for free.",
  "You can compose almost anything through `render`. It merges props onto whatever element you hand it, which is how a Button becomes a link without losing a single style.",
]

const regenerations = [
  "Let me put that another way — the registry ships primitives, not opinions. Take `Bubble`, `Message` and `PromptInput`, arrange them how you like, and the theme layer handles the rest.",
  "Rewriting that: install once, own the source forever. The only thing you keep pulling from us is `theme.json`, and that is just tokens.",
  "Fewer words this time — use logical utilities everywhere (`ms-`, `pe-`, `start-`) and the whole surface mirrors the moment you flip the document to RTL.",
]

/** Splits on backticks so inline code renders without a markdown parser. */
function renderText(text: string, codeClassName: string) {
  return text.split("`").map((part, index) =>
    index % 2 === 1 ? (
      <code
        key={index}
        className={cn(
          "rounded-sm px-1 py-px font-mono text-[0.72rem] wrap-break-word",
          codeClassName
        )}
      >
        {part}
      </code>
    ) : (
      <React.Fragment key={index}>{part}</React.Fragment>
    )
  )
}

export function AiChat() {
  const [messages, setMessages] = React.useState<ChatMessage[]>(seed)
  const [status, setStatus] = React.useState<ChatStatus>("ready")
  const [streamingId, setStreamingId] = React.useState<string | null>(null)
  const [modelId, setModelId] = React.useState<string>(models[0].id)
  const [draft, setDraft] = React.useState("")
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  const scrollRef = React.useRef<HTMLDivElement | null>(null)
  const delayRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const tickRef = React.useRef<ReturnType<typeof setInterval> | null>(null)
  const startedRef = React.useRef(false)
  const idRef = React.useRef(0)
  const replyRef = React.useRef(0)
  const regenRef = React.useRef(0)

  const { isCopied, copyToClipboard } = useCopyToClipboard()

  const model = models.find((item) => item.id === modelId) ?? models[0]
  const isBusy = status === "submitted" || status === "streaming"

  const clearTimers = React.useCallback(() => {
    if (delayRef.current) {
      clearTimeout(delayRef.current)
      delayRef.current = null
    }
    if (tickRef.current) {
      clearInterval(tickRef.current)
      tickRef.current = null
    }
  }, [])

  React.useEffect(() => clearTimers, [clearTimers])

  const scrollToBottom = React.useCallback(() => {
    const viewport = scrollRef.current?.querySelector<HTMLElement>(
      '[data-slot="scroll-area-viewport"]'
    )
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight
    }
  }, [])

  // Only follows the thread once the reader has actually sent something, so a
  // grid full of these cards does no work on mount.
  React.useEffect(() => {
    if (!startedRef.current) return
    scrollToBottom()
  }, [messages, status, scrollToBottom])

  const startStream = React.useCallback(
    (targetId: string, text: string, delay: number) => {
      clearTimers()
      startedRef.current = true
      setStreamingId(targetId)
      setStatus("submitted")
      setMessages((previous) =>
        previous.map((item) =>
          item.id === targetId ? { ...item, text: "" } : item
        )
      )

      delayRef.current = setTimeout(() => {
        delayRef.current = null
        setStatus("streaming")
        const tokens = text.match(/\S+\s*/g) ?? []
        let index = 0

        tickRef.current = setInterval(() => {
          index += 1
          const next = tokens.slice(0, index).join("")
          setMessages((previous) =>
            previous.map((item) =>
              item.id === targetId ? { ...item, text: next } : item
            )
          )
          if (index >= tokens.length) {
            clearTimers()
            setStatus("ready")
            setStreamingId(null)
          }
        }, delay)
      }, 420)
    },
    [clearTimers]
  )

  function handleSubmit(message: PromptInputMessage) {
    const text = message.text.trim()
    if (!text || isBusy) return

    idRef.current += 1
    const turn = idRef.current
    const replyId = `reply-${turn}`

    setMessages((previous) => [
      ...previous,
      { id: `sent-${turn}`, role: "user", text },
      { id: replyId, role: "assistant", text: "" },
    ])
    setDraft("")

    const reply = replies[replyRef.current % replies.length]
    replyRef.current += 1
    startStream(replyId, reply, model.speed)
  }

  function handleStop() {
    clearTimers()
    setMessages((previous) =>
      previous.map((item) =>
        item.id === streamingId && item.text === ""
          ? { ...item, text: "Stopped." }
          : item
      )
    )
    setStatus("ready")
    setStreamingId(null)
  }

  function handleRegenerate(targetId: string) {
    const reply = regenerations[regenRef.current % regenerations.length]
    regenRef.current += 1
    startStream(targetId, reply, model.speed)
  }

  function handleReset() {
    clearTimers()
    setMessages(seed)
    setStatus("ready")
    setStreamingId(null)
    setDraft("")
    setCopiedId(null)
    toast.add({ title: "Thread reset", type: "success" })
  }

  async function handleCopy(item: ChatMessage) {
    const ok = await copyToClipboard(item.text)
    if (ok) {
      setCopiedId(item.id)
      toast.add({ title: "Reply copied", type: "success" })
      return
    }
    toast.add({ title: "Could not copy reply", type: "error" })
  }

  const lastId = messages[messages.length - 1]?.id

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <HugeiconsIcon
              icon={SparklesIcon}
              strokeWidth={2}
              className="size-3.5"
            />
          </span>
          <span className="truncate">Registry Copilot</span>
        </CardTitle>
        <CardDescription className="truncate">
          {isBusy
            ? `${model.name} is replying…`
            : `Answering with ${model.name}`}
        </CardDescription>
        <CardAction>
          <Badge variant="outline" className="tabular-nums">
            {model.context} ctx
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent ref={scrollRef} className="px-0">
        <ScrollArea className="h-56">
          <div className="flex flex-col gap-3 px-(--card-spacing) py-0.5">
            {messages.map((item) => {
              const isUser = item.role === "user"
              const isStreaming = streamingId === item.id

              if (isUser) {
                return (
                  <Message key={item.id} align="end">
                    <MessageContent>
                      <Bubble className="max-w-[88%]">
                        <BubbleContent className="text-[0.8rem] leading-relaxed">
                          {renderText(
                            item.text,
                            "bg-primary-foreground/20 text-primary-foreground"
                          )}
                        </BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                )
              }

              return (
                <Message key={item.id}>
                  <MessageAvatar className="size-6 min-w-6 self-start bg-secondary text-secondary-foreground">
                    <HugeiconsIcon
                      icon={model.icon}
                      strokeWidth={2}
                      className="size-3.5"
                    />
                  </MessageAvatar>
                  <MessageContent className="gap-1.5">
                    <Bubble variant="muted" className="max-w-full">
                      <BubbleContent className="text-[0.8rem] leading-relaxed">
                        {isStreaming && item.text === "" ? (
                          <span
                            className="flex items-center gap-1 py-1"
                            role="status"
                            aria-label="Assistant is typing"
                          >
                            <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60" />
                            <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:150ms]" />
                            <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:300ms]" />
                          </span>
                        ) : (
                          <>
                            {renderText(item.text, "bg-foreground/10")}
                            {isStreaming ? (
                              <span className="ms-0.5 inline-block h-3 w-[3px] translate-y-0.5 animate-pulse rounded-xs bg-foreground align-baseline" />
                            ) : null}
                          </>
                        )}
                      </BubbleContent>
                    </Bubble>
                    {isStreaming ? null : (
                      <div className="flex items-center gap-0.5 ps-1">
                        <span className="me-auto min-w-0 truncate text-[0.7rem] text-muted-foreground">
                          via {model.name}
                        </span>
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                aria-label="Copy reply"
                                onClick={() => void handleCopy(item)}
                              />
                            }
                          >
                            <HugeiconsIcon
                              icon={
                                isCopied && copiedId === item.id
                                  ? Tick02Icon
                                  : Copy01Icon
                              }
                              strokeWidth={2}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            {isCopied && copiedId === item.id
                              ? "Copied"
                              : "Copy reply"}
                          </TooltipContent>
                        </Tooltip>
                        {item.id === lastId ? (
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Button
                                  variant="ghost"
                                  size="icon-xs"
                                  aria-label="Regenerate reply"
                                  disabled={isBusy}
                                  onClick={() => handleRegenerate(item.id)}
                                />
                              }
                            >
                              <HugeiconsIcon
                                icon={ArrowReloadHorizontalIcon}
                                strokeWidth={2}
                              />
                            </TooltipTrigger>
                            <TooltipContent>Regenerate</TooltipContent>
                          </Tooltip>
                        ) : null}
                      </div>
                    )}
                  </MessageContent>
                </Message>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter>
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputTextarea
            placeholder="Ask about the registry…"
            className="max-h-24 min-h-11 py-2 text-[0.8rem]"
            onChange={(event) => setDraft(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (isBusy && event.key === "Enter" && !event.shiftKey) {
                event.preventDefault()
              }
            }}
          />
          <PromptInputFooter>
            <PromptInputTools>
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label="Change model"
                            className="-ms-1 max-w-[9.5rem] px-1.5 font-normal text-muted-foreground"
                          >
                            <HugeiconsIcon icon={model.icon} strokeWidth={2} />
                            <span className="truncate">{model.short}</span>
                            <HugeiconsIcon
                              icon={ArrowDown01Icon}
                              strokeWidth={2}
                              data-icon="inline-end"
                            />
                          </Button>
                        }
                      />
                    }
                  />
                  <TooltipContent>Model: {model.name}</TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="start" side="top" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Model</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                      value={modelId}
                      onValueChange={(value) => setModelId(String(value))}
                    >
                      {models.map((item) => (
                        <DropdownMenuRadioItem key={item.id} value={item.id}>
                          <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                          <span className="flex min-w-0 flex-col">
                            <span className="truncate">{item.name}</span>
                            <span className="truncate text-xs text-muted-foreground">
                              {item.note}
                            </span>
                          </span>
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Reset thread"
                      className="text-muted-foreground"
                      onClick={handleReset}
                    />
                  }
                >
                  <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Reset thread</TooltipContent>
              </Tooltip>
            </PromptInputTools>
            <PromptInputSubmit
              status={status}
              onStop={handleStop}
              disabled={isBusy ? false : draft.trim().length === 0}
            />
          </PromptInputFooter>
        </PromptInput>
      </CardFooter>
    </Card>
  )
}
