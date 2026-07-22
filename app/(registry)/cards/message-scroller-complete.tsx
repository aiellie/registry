"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import { ArrowUpIcon, RotateIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"

import { createChat, getMessageText } from "@/lib/ai"
import {
  MESSAGE_ANIMATIONS,
  type MessageAnimationId,
} from "@/lib/message-animations"
import { MessageAnimated } from "@/components/ai/message-animated"
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
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { Marker, MarkerContent } from "@/components/ui/marker"
import {
  Message,
  MessageContent,
} from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
} from "@/components/ui/message-scroller"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/* -------------------------------------------------------------------------- */
/*                            Scripted conversation                           */
/*                                                                            */
/*  One script drives the whole card: turns 1-4 are "older history" that      */
/*  Load History prepends, turns 5-8 are visible on mount, and the rest are   */
/*  queued in the composer and streamed through the AI SDK helper transport.  */
/* -------------------------------------------------------------------------- */

const script = createChat()
  .user(
    "Quick recap before we dive in — what did we decide about the chat view last sprint?",
    { id: "turn-recap" }
  )
  .assistant(
    "We agreed the transcript should stay plain DOM instead of a virtualized list. Selection, find-in-page, and screen readers keep working, and `content-visibility: auto` keeps long threads cheap to render.\n\nThe open question was scroll behavior, which is what today's session covers."
  )
  .user("Did the beta group flag anything about scrolling?", {
    id: "turn-beta",
  })
  .assistant(
    "Two complaints came up again and again: the thread jumps around while a reply streams in, and loading older messages throws you back to the top.\n\nBoth are exactly what the message scroller primitives are designed to fix."
  )
  .user("So let's wire it up. What should the scroll experience do out of the box?", {
    id: "turn-defaults",
  })
  .assistant(
    'Wrap the thread in `MessageScrollerProvider` and you get sensible defaults: the transcript opens at the live edge (`defaultScrollPosition="end"`), and with `autoScroll` on, the viewport follows streamed tokens — but only while the reader is already at the bottom.\n\nScroll up and the follow backs off. `scrollEdgeThreshold` decides how close to the edge still counts as "at the edge".'
  )
  .user("How does anchoring decide where a new turn settles?", {
    id: "turn-anchoring",
  })
  .assistant(
    "Mark a row with `scrollAnchor` and the scroller treats it as the start of a turn. When it's appended, the viewport settles it near the top instead of snapping to the document bottom.\n\n`scrollMargin` controls the gap to the edge, and `scrollPreviousItemPeek` keeps a slice of the previous exchange visible so context never fully disappears. Try the sliders in the settings, then send the next message."
  )
  .user("What happens when someone loads older history mid-conversation?", {
    id: "turn-history",
  })
  .sleep(600)
  .assistant(
    '`MessageScrollerViewport` sets `preserveScrollOnPrepend`, so rows prepended above the fold do not move what you are reading.\n\nPress "Load history" in the composer, scroll anywhere, and watch your place hold. Then flip the setting off to feel the difference.'
  )
  .user("Can I drive the viewport from outside the transcript?", {
    id: "turn-commands",
  })
  .sleep(600)
  .assistant(
    "`useMessageScroller` returns `scrollToMessage`, `scrollToStart`, and `scrollToEnd`. Every command takes `align`, `behavior`, and a `scrollMargin` override — the Commands section in the settings calls them directly.\n\n`MessageScrollerButton` is the packaged version: it appears only when there is somewhere to go and jumps to whichever `direction` you give it."
  )
  .user("And how do I read the scroller's state for my own UI?", {
    id: "turn-state",
  })
  .sleep(600)
  .assistant(
    "Two hooks. `useMessageScrollerScrollable` reports whether you can scroll toward `start` or `end` — the state chips in the settings are wired to it.\n\n`useMessageScrollerVisibility` tracks `visibleMessageIds` plus `currentAnchorId`, which powers the outline that highlights the turn you are reading right now."
  )

const allMessages = script.get()
const archiveMessages = allMessages.slice(0, 4)
const initialMessages = allMessages.slice(4, 8)
const transport = script.transport({ chunkDelayMs: 20 })

/* -------------------------------------------------------------------------- */
/*                                  Settings                                  */
/* -------------------------------------------------------------------------- */

type ScrollPosition = "start" | "end" | "last-anchor"
type AnchorRole = "user" | "assistant"
type ButtonDirection = "start" | "end"
type JumpAlign = "start" | "center" | "end" | "nearest"

const DEFAULT_SETTINGS = {
  autoScroll: true,
  defaultScrollPosition: "end" as ScrollPosition,
  scrollMargin: 0,
  scrollPreviousItemPeek: 64,
  scrollEdgeThreshold: 8,
  preserveScrollOnPrepend: true,
  anchorRole: "user" as AnchorRole,
  animationId: "slide-up" as MessageAnimationId,
  buttonDirection: "end" as ButtonDirection,
  behavior: "smooth" as ScrollBehavior,
  align: "start" as JumpAlign,
}

const SCROLL_POSITIONS: ScrollPosition[] = ["start", "end", "last-anchor"]
const BEHAVIORS: ScrollBehavior[] = ["smooth", "instant", "auto"]
const ALIGNS: JumpAlign[] = ["start", "center", "end", "nearest"]

/* -------------------------------------------------------------------------- */
/*                                    Card                                    */
/* -------------------------------------------------------------------------- */

/**
 * The complete message scroller: a streaming AI SDK conversation with turn
 * anchoring, history prepending, imperative commands, and visibility state —
 * plus a settings panel exposing every provider, viewport, item, and button
 * option the component supports.
 */
export default function MessageScrollerCompleteCard() {
  const [scrollerKey, setScrollerKey] = React.useState(0)
  const [historyLoaded, setHistoryLoaded] = React.useState(false)

  // Provider settings
  const [autoScroll, setAutoScroll] = React.useState(
    DEFAULT_SETTINGS.autoScroll
  )
  const [defaultScrollPosition, setDefaultScrollPosition] =
    React.useState<ScrollPosition>(DEFAULT_SETTINGS.defaultScrollPosition)
  const [scrollMargin, setScrollMargin] = React.useState(
    DEFAULT_SETTINGS.scrollMargin
  )
  const [scrollPreviousItemPeek, setScrollPreviousItemPeek] = React.useState(
    DEFAULT_SETTINGS.scrollPreviousItemPeek
  )
  const [scrollEdgeThreshold, setScrollEdgeThreshold] = React.useState(
    DEFAULT_SETTINGS.scrollEdgeThreshold
  )
  // Viewport settings
  const [preserveScrollOnPrepend, setPreserveScrollOnPrepend] = React.useState(
    DEFAULT_SETTINGS.preserveScrollOnPrepend
  )
  // Item settings
  const [anchorRole, setAnchorRole] = React.useState<AnchorRole>(
    DEFAULT_SETTINGS.anchorRole
  )
  const [animationId, setAnimationId] = React.useState<MessageAnimationId>(
    DEFAULT_SETTINGS.animationId
  )
  // Button and command settings
  const [buttonDirection, setButtonDirection] = React.useState<ButtonDirection>(
    DEFAULT_SETTINGS.buttonDirection
  )
  const [behavior, setBehavior] = React.useState<ScrollBehavior>(
    DEFAULT_SETTINGS.behavior
  )
  const [align, setAlign] = React.useState<JumpAlign>(DEFAULT_SETTINGS.align)

  const { messages, sendMessage, setMessages, status } = useChat({
    messages: initialMessages,
    transport,
  })
  const nextMessage = script.next({ after: messages })
  const isBusy = status === "submitted" || status === "streaming"
  const animationPreset = MESSAGE_ANIMATIONS[animationId]

  const renderedMessages = historyLoaded
    ? [...archiveMessages, ...messages]
    : messages
  const anchoredTurns = renderedMessages
    .filter((message) => message.role === anchorRole)
    .map((message) => ({ id: message.id, text: getMessageText(message) }))

  const resetConversation = () => {
    setMessages(initialMessages)
    setHistoryLoaded(false)
    setScrollerKey((key) => key + 1)
  }

  const resetSettings = () => {
    setAutoScroll(DEFAULT_SETTINGS.autoScroll)
    setDefaultScrollPosition(DEFAULT_SETTINGS.defaultScrollPosition)
    setScrollMargin(DEFAULT_SETTINGS.scrollMargin)
    setScrollPreviousItemPeek(DEFAULT_SETTINGS.scrollPreviousItemPeek)
    setScrollEdgeThreshold(DEFAULT_SETTINGS.scrollEdgeThreshold)
    setPreserveScrollOnPrepend(DEFAULT_SETTINGS.preserveScrollOnPrepend)
    setAnchorRole(DEFAULT_SETTINGS.anchorRole)
    setAnimationId(DEFAULT_SETTINGS.animationId)
    setButtonDirection(DEFAULT_SETTINGS.buttonDirection)
    setBehavior(DEFAULT_SETTINGS.behavior)
    setAlign(DEFAULT_SETTINGS.align)
    setScrollerKey((key) => key + 1)
  }

  const loadHistory = () => {
    setHistoryLoaded(true)
    toast("History loaded", {
      description: "Scroll up — your reading position is preserved.",
    })
  }

  return (
    <MessageScrollerProvider
      key={`${defaultScrollPosition}-${scrollerKey}`}
      autoScroll={autoScroll}
      defaultScrollPosition={defaultScrollPosition}
      scrollEdgeThreshold={scrollEdgeThreshold}
      scrollMargin={scrollMargin}
      scrollPreviousItemPeek={scrollPreviousItemPeek}
    >
      <div className="flex w-full flex-col items-center gap-4">
        <div className="flex w-full max-w-4xl flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-center">
          {/* ------------------------------ Chat ------------------------------ */}
          <Card className="h-140 w-full max-w-sm gap-0 lg:shrink-0">
            <CardHeader className="gap-1 border-b">
              <CardTitle>Message Scroller</CardTitle>
              <CardDescription>
                Streaming, anchoring, history, and commands in one thread.
              </CardDescription>
              <CardAction>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label="Reset conversation"
                        disabled={isBusy}
                        onClick={resetConversation}
                      >
                        <HugeiconsIcon icon={RotateIcon} />
                      </Button>
                    }
                  />
                  <TooltipContent>
                    <p>Reset conversation</p>
                  </TooltipContent>
                </Tooltip>
              </CardAction>
            </CardHeader>
            <CardContent className="min-h-0 flex-1 overflow-hidden p-0">
              <MessageScroller>
                <MessageScrollerViewport
                  preserveScrollOnPrepend={preserveScrollOnPrepend}
                >
                  <MessageScrollerContent
                    aria-busy={isBusy}
                    className="p-(--card-spacing)"
                  >
                    {historyLoaded && (
                      <>
                        {archiveMessages.map((message) => (
                          <HistoryRow
                            key={message.id}
                            message={message}
                            anchorRole={anchorRole}
                          />
                        ))}
                        <MessageScrollerItem scrollAnchor={false}>
                          <Marker variant="separator">
                            <MarkerContent>
                              Earlier messages loaded
                            </MarkerContent>
                          </Marker>
                        </MessageScrollerItem>
                      </>
                    )}
                    {messages.map((message) => (
                      <MessageAnimated
                        key={message.id}
                        message={message}
                        scrollAnchor={message.role === anchorRole}
                        animationPreset={animationPreset}
                      />
                    ))}
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton
                  direction={buttonDirection}
                  behavior={behavior}
                />
              </MessageScroller>
            </CardContent>
            <CardFooter className="flex-col gap-2 border-t pt-(--card-spacing)">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!nextMessage || isBusy) {
                    return
                  }
                  void sendMessage(nextMessage)
                }}
                className="w-full"
              >
                <InputGroup>
                  <div className="h-14 w-full px-3 py-2.5">
                    <span
                      className="line-clamp-2 opacity-60 data-[status=ready]:opacity-100"
                      data-status={status}
                    >
                      {nextMessage ? (
                        getMessageText(nextMessage)
                      ) : (
                        <span className="text-muted-foreground">
                          All scripted messages sent. Reset to replay.
                        </span>
                      )}
                    </span>
                  </div>
                  <InputGroupAddon align="block-end" className="pt-1">
                    <InputGroupButton
                      type="button"
                      variant="outline"
                      size="xs"
                      disabled={historyLoaded}
                      onClick={loadHistory}
                    >
                      {historyLoaded ? "History loaded" : "Load history"}
                    </InputGroupButton>
                    <InputGroupButton
                      type="submit"
                      variant="default"
                      size="icon-sm"
                      disabled={!nextMessage || isBusy}
                      className="ml-auto"
                    >
                      <HugeiconsIcon icon={ArrowUpIcon} />
                      <span className="sr-only">Send</span>
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </form>
            </CardFooter>
          </Card>

          {/* ---------------------------- Settings ---------------------------- */}
          <Card className="w-full max-w-sm gap-0 lg:h-140 lg:w-80">
            <CardHeader className="gap-1 border-b">
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Every option the scroller exposes.
              </CardDescription>
              <CardAction>
                <Button variant="ghost" size="sm" onClick={resetSettings}>
                  Reset
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="scrollbar-thin min-h-0 flex-1 space-y-5 overflow-y-auto pt-(--card-spacing)">
              {/* Provider */}
              <SettingsSection title="Provider">
                <SwitchRow
                  label="autoScroll"
                  description="Follow streamed output at the live edge"
                  checked={autoScroll}
                  onCheckedChange={(checked) => setAutoScroll(checked)}
                />
                <div className="flex flex-col gap-2">
                  <Label className="font-mono text-xs">
                    defaultScrollPosition
                  </Label>
                  <Tabs
                    value={defaultScrollPosition}
                    onValueChange={(value) => {
                      if (
                        SCROLL_POSITIONS.includes(value as ScrollPosition)
                      ) {
                        setDefaultScrollPosition(value as ScrollPosition)
                      }
                    }}
                    className="w-full"
                  >
                    <TabsList className="w-full">
                      {SCROLL_POSITIONS.map((position) => (
                        <TabsTrigger
                          key={position}
                          value={position}
                          className="text-xs"
                        >
                          {position}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                  <p className="text-xs text-muted-foreground">
                    Where a reopened thread starts. Changing it remounts the
                    scroller.
                  </p>
                </div>
                <SliderRow
                  label="scrollMargin"
                  value={scrollMargin}
                  min={0}
                  max={64}
                  onChange={setScrollMargin}
                />
                <SliderRow
                  label="scrollPreviousItemPeek"
                  value={scrollPreviousItemPeek}
                  min={0}
                  max={128}
                  onChange={setScrollPreviousItemPeek}
                />
                <SliderRow
                  label="scrollEdgeThreshold"
                  value={scrollEdgeThreshold}
                  min={0}
                  max={64}
                  onChange={setScrollEdgeThreshold}
                />
              </SettingsSection>
              <Separator />
              {/* Viewport */}
              <SettingsSection title="Viewport">
                <SwitchRow
                  label="preserveScrollOnPrepend"
                  description="Hold your place when history is prepended"
                  checked={preserveScrollOnPrepend}
                  onCheckedChange={(checked) =>
                    setPreserveScrollOnPrepend(checked)
                  }
                />
              </SettingsSection>
              <Separator />
              {/* Items */}
              <SettingsSection title="Items">
                <div className="flex flex-col gap-2">
                  <Label className="font-mono text-xs">scrollAnchor</Label>
                  <ToggleGroup
                    aria-label="Select scroll anchor role"
                    value={[anchorRole]}
                    onValueChange={(value) => {
                      const nextValue = value[0]
                      if (
                        nextValue === "user" ||
                        nextValue === "assistant"
                      ) {
                        setAnchorRole(nextValue)
                      }
                    }}
                    className="w-full"
                  >
                    <ToggleGroupItem
                      value="user"
                      aria-label="Anchor user messages"
                      className="flex-1"
                    >
                      User
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="assistant"
                      aria-label="Anchor assistant messages"
                      className="flex-1"
                    >
                      Assistant
                    </ToggleGroupItem>
                  </ToggleGroup>
                  <p className="text-xs text-muted-foreground">
                    Which role settles near the top when a turn is appended.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="font-mono text-xs">animation</Label>
                  <Select
                    value={animationId}
                    onValueChange={(value) =>
                      setAnimationId(value as MessageAnimationId)
                    }
                  >
                    <SelectTrigger aria-label="Animation preset">
                      <SelectValue>{animationPreset.name}</SelectValue>
                    </SelectTrigger>
                    <SelectContent align="start">
                      <SelectGroup>
                        {Object.values(MESSAGE_ANIMATIONS).map((animation) => (
                          <SelectItem key={animation.id} value={animation.id}>
                            {animation.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </SettingsSection>
              <Separator />
              {/* Button + commands */}
              <SettingsSection title="Button & Commands">
                <div className="flex flex-col gap-2">
                  <Label className="font-mono text-xs">direction</Label>
                  <ToggleGroup
                    aria-label="Scroll button direction"
                    value={[buttonDirection]}
                    onValueChange={(value) => {
                      const nextValue = value[0]
                      if (nextValue === "start" || nextValue === "end") {
                        setButtonDirection(nextValue)
                      }
                    }}
                    className="w-full"
                  >
                    <ToggleGroupItem
                      value="start"
                      aria-label="Button scrolls to start"
                      className="flex-1"
                    >
                      Start
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="end"
                      aria-label="Button scrolls to end"
                      className="flex-1"
                    >
                      End
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-2">
                    <Label className="font-mono text-xs">behavior</Label>
                    <Select
                      value={behavior}
                      onValueChange={(value) =>
                        setBehavior(value as ScrollBehavior)
                      }
                    >
                      <SelectTrigger aria-label="Scroll behavior">
                        <SelectValue>{behavior}</SelectValue>
                      </SelectTrigger>
                      <SelectContent align="start">
                        <SelectGroup>
                          {BEHAVIORS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="font-mono text-xs">align</Label>
                    <Select
                      value={align}
                      onValueChange={(value) => setAlign(value as JumpAlign)}
                    >
                      <SelectTrigger aria-label="Scroll align">
                        <SelectValue>{align}</SelectValue>
                      </SelectTrigger>
                      <SelectContent align="start">
                        <SelectGroup>
                          {ALIGNS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <JumpButtons behavior={behavior} />
              </SettingsSection>
              <Separator />
              {/* Outline (visibility + commands) */}
              <SettingsSection title="Outline">
                <TurnOutline
                  turns={anchoredTurns}
                  align={align}
                  behavior={behavior}
                />
              </SettingsSection>
              <Separator />
              {/* State */}
              <SettingsSection title="State">
                <ScrollStateChips />
              </SettingsSection>
            </CardContent>
          </Card>
        </div>
        <div className="max-w-md px-0.5 text-center text-xs text-balance text-muted-foreground">
          Demo is read-only — send steps through a scripted conversation
          streamed with the AI SDK helper. Every setting on the right maps to a
          prop, hook, or command of the message scroller.
        </div>
      </div>
    </MessageScrollerProvider>
  )
}

/* -------------------------------------------------------------------------- */
/*                              History messages                              */
/* -------------------------------------------------------------------------- */

function HistoryRow({
  message,
  anchorRole,
}: {
  message: (typeof archiveMessages)[number]
  anchorRole: AnchorRole
}) {
  const isUserMessage = message.role === "user"
  const paragraphs = getMessageText(message)
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
  return (
    <MessageScrollerItem
      messageId={message.id}
      scrollAnchor={message.role === anchorRole}
    >
      <Message align={isUserMessage ? "end" : "start"}>
        <MessageContent>
          <Bubble variant={isUserMessage ? "muted" : "ghost"}>
            <BubbleContent className="space-y-2">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="whitespace-pre-wrap">
                  {paragraph}
                </p>
              ))}
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </MessageScrollerItem>
  )
}

/* -------------------------------------------------------------------------- */
/*                             Settings primitives                            */
/* -------------------------------------------------------------------------- */

function SettingsSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {title}
      </div>
      {children}
    </div>
  )
}

function SwitchRow({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 flex-col gap-0.5">
        <Label className="font-mono text-xs">{label}</Label>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={`Toggle ${label}`}
      />
    </div>
  )
}

function SliderRow({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label className="font-mono text-xs">{label}</Label>
        <span className="text-xs text-muted-foreground tabular-nums">
          {value}px
        </span>
      </div>
      <Slider
        aria-label={label}
        value={[value]}
        min={min}
        max={max}
        step={1}
        onValueChange={(next) => {
          const nextValue = Array.isArray(next) ? next[0] : next
          if (typeof nextValue === "number") {
            onChange(nextValue)
          }
        }}
      />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                        Commands, outline, and state                        */
/* -------------------------------------------------------------------------- */

function JumpButtons({ behavior }: { behavior: ScrollBehavior }) {
  const { scrollToStart, scrollToEnd } = useMessageScroller()
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => scrollToStart({ behavior })}
      >
        scrollToStart
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => scrollToEnd({ behavior })}
      >
        scrollToEnd
      </Button>
    </div>
  )
}

function TurnOutline({
  turns,
  align,
  behavior,
}: {
  turns: Array<{ id: string; text: string }>
  align: JumpAlign
  behavior: ScrollBehavior
}) {
  const { scrollToMessage } = useMessageScroller()
  const { currentAnchorId } = useMessageScrollerVisibility()
  if (turns.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        No anchored turns yet — the selected role has no messages.
      </p>
    )
  }
  return (
    <div className="flex flex-col gap-1">
      {turns.map((turn) => (
        <button
          key={turn.id}
          type="button"
          aria-current={currentAnchorId === turn.id ? "location" : undefined}
          className="flex min-h-7 items-center rounded-md px-2 py-1 text-left text-xs transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground aria-current:bg-accent aria-current:text-accent-foreground"
          onClick={() => scrollToMessage(turn.id, { align, behavior })}
        >
          <span className="line-clamp-1 min-w-0">
            {turn.text.length > 48 ? `${turn.text.slice(0, 45)}...` : turn.text}
          </span>
        </button>
      ))}
      <p className="pt-1 text-xs text-muted-foreground">
        The highlighted row is <span className="font-mono">currentAnchorId</span>.
        Click a turn to <span className="font-mono">scrollToMessage</span>.
      </p>
    </div>
  )
}

function ScrollStateChips() {
  const { start, end } = useMessageScrollerScrollable()
  const { visibleMessageIds } = useMessageScrollerVisibility()
  const states = [
    { label: "At top", on: !start },
    { label: "At bottom", on: !end },
    { label: "Older above", on: start },
    { label: "Newer below", on: end },
    { label: `${visibleMessageIds.length} in view`, on: true },
  ]
  return (
    <div className="flex flex-wrap gap-1.5">
      {states.map((state) => (
        <span
          key={state.label}
          data-on={state.on}
          className="rounded-full border bg-background px-2 py-0.5 text-xs text-muted-foreground data-[on=true]:border-transparent data-[on=true]:bg-primary data-[on=true]:text-primary-foreground"
        >
          {state.label}
        </span>
      ))}
    </div>
  )
}
