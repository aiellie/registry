"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import {
  AiMagicIcon,
  AlignBottomIcon,
  AlignTopIcon,
  AlignVerticalCenterIcon,
  AnchorIcon,
  AnchorPointIcon,
  ArrowDown01Icon,
  ArrowExpand01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  BlurIcon,
  BotIcon,
  BounceRightIcon,
  CameraIcon,
  CenterFocusIcon,
  EyeClosedIcon,
  EyeIcon,
  FlashIcon,
  GlobeIcon,
  HistoryIcon,
  Motion01Icon,
  MouseScroll01Icon,
  Navigation03Icon,
  Paperclip,
  PinIcon,
  PlugIcon,
  RotateIcon,
  RulerIcon,
  SparklesIcon,
  Target02Icon,
  Telescope01Icon,
  UserIcon,
  WaveIcon,
} from "@hugeicons/core-free-icons"
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
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { Marker, MarkerContent } from "@/components/ui/marker"
import { Message, MessageContent } from "@/components/ui/message"
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Toggle } from "@/components/ui/toggle"
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
    "Mark a row with `scrollAnchor` and the scroller treats it as the start of a turn. When it's appended, the viewport settles it near the top instead of snapping to the document bottom.\n\n`scrollMargin` controls the gap to the edge, and `scrollPreviousItemPeek` keeps a slice of the previous exchange visible so context never fully disappears. Try the sliders in the toolbar, then send the next message."
  )
  .user("What happens when someone loads older history mid-conversation?", {
    id: "turn-history",
  })
  .sleep(600)
  .assistant(
    '`MessageScrollerViewport` sets `preserveScrollOnPrepend`, so rows prepended above the fold do not move what you are reading.\n\nPress "Load history" in the composer, scroll anywhere, and watch your place hold. Then flip the pin toggle off to feel the difference.'
  )
  .user("Can I drive the viewport from outside the transcript?", {
    id: "turn-commands",
  })
  .sleep(600)
  .assistant(
    "`useMessageScroller` returns `scrollToMessage`, `scrollToStart`, and `scrollToEnd`. Every command takes `align`, `behavior`, and a `scrollMargin` override — the jump menu and the outline rail call them directly.\n\n`MessageScrollerButton` is the packaged version: it appears only when there is somewhere to go and jumps to whichever `direction` you give it."
  )
  .user("And how do I read the scroller's state for my own UI?", {
    id: "turn-state",
  })
  .sleep(600)
  .assistant(
    "Two hooks. `useMessageScrollerScrollable` reports whether you can scroll toward `start` or `end` — the chips under the composer are wired to it.\n\n`useMessageScrollerVisibility` tracks `visibleMessageIds` plus `currentAnchorId`, which powers the outline rail that highlights the turn you are reading right now."
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
type Turn = { id: string; text: string }

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

const ANIMATION_ICONS: Record<MessageAnimationId, typeof BlurIcon> = {
  fade: BlurIcon,
  "slide-up": ArrowUp01Icon,
  "slide-side": ArrowRight01Icon,
  pop: FlashIcon,
  "spring-bounce": BounceRightIcon,
  "blur-fade": EyeClosedIcon,
  "scale-fade": ArrowExpand01Icon,
}

/* -------------------------------------------------------------------------- */
/*                                    Card                                    */
/* -------------------------------------------------------------------------- */

/**
 * The complete message scroller: a streaming AI SDK conversation with turn
 * anchoring, history prepending, imperative commands, and visibility state.
 * Every provider, viewport, item, and button setting is an icon button in the
 * toolbar; the outline rail on the right tracks the current anchored turn.
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
  const anchoredTurns: Turn[] = renderedMessages
    .filter((message) => message.role === anchorRole)
    .map((message) => ({ id: message.id, text: getMessageText(message) }))

  const reset = () => {
    setMessages(initialMessages)
    setHistoryLoaded(false)
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
        <div className="relative w-full max-w-md">
          <Card className="h-140 w-full gap-0">
            {/* ----------------------------- Toolbar ----------------------------- */}
            <div className="flex flex-wrap items-center gap-0.5 border-b px-2 pb-2">
              <ToolbarToggle
                icon={MouseScroll01Icon}
                label="autoScroll"
                pressed={autoScroll}
                onPressedChange={setAutoScroll}
              />
              <ToolbarMenu
                icon={Target02Icon}
                label="defaultScrollPosition"
                value={defaultScrollPosition}
                onValueChange={(value) =>
                  setDefaultScrollPosition(value as ScrollPosition)
                }
                options={[
                  { value: "start", label: "start", icon: AlignTopIcon },
                  { value: "end", label: "end", icon: AlignBottomIcon },
                  {
                    value: "last-anchor",
                    label: "last-anchor",
                    icon: AnchorPointIcon,
                  },
                ]}
              />
              <ToolbarSlider
                icon={RulerIcon}
                label="scrollMargin"
                value={scrollMargin}
                min={0}
                max={64}
                onChange={setScrollMargin}
              />
              <ToolbarSlider
                icon={EyeIcon}
                label="scrollPreviousItemPeek"
                value={scrollPreviousItemPeek}
                min={0}
                max={128}
                onChange={setScrollPreviousItemPeek}
              />
              <ToolbarSlider
                icon={AlignBottomIcon}
                label="scrollEdgeThreshold"
                value={scrollEdgeThreshold}
                min={0}
                max={64}
                onChange={setScrollEdgeThreshold}
              />
              <ToolbarToggle
                icon={PinIcon}
                label="preserveScrollOnPrepend"
                pressed={preserveScrollOnPrepend}
                onPressedChange={setPreserveScrollOnPrepend}
              />
              <ToolbarMenu
                icon={AnchorIcon}
                label="scrollAnchor role"
                value={anchorRole}
                onValueChange={(value) => setAnchorRole(value as AnchorRole)}
                options={[
                  { value: "user", label: "user", icon: UserIcon },
                  { value: "assistant", label: "assistant", icon: BotIcon },
                ]}
              />
              <ToolbarMenu
                icon={SparklesIcon}
                label="animation"
                value={animationId}
                onValueChange={(value) =>
                  setAnimationId(value as MessageAnimationId)
                }
                options={Object.values(MESSAGE_ANIMATIONS).map((animation) => ({
                  value: animation.id,
                  label: animation.name,
                  icon: ANIMATION_ICONS[animation.id],
                }))}
              />
              <ToolbarMenu
                icon={ArrowUpDownIcon}
                label="button direction"
                value={buttonDirection}
                onValueChange={(value) =>
                  setButtonDirection(value as ButtonDirection)
                }
                options={[
                  { value: "start", label: "start", icon: ArrowUp01Icon },
                  { value: "end", label: "end", icon: ArrowDown01Icon },
                ]}
              />
              <ToolbarMenu
                icon={Motion01Icon}
                label="behavior"
                value={behavior}
                onValueChange={(value) => setBehavior(value as ScrollBehavior)}
                options={[
                  { value: "smooth", label: "smooth", icon: WaveIcon },
                  { value: "instant", label: "instant", icon: FlashIcon },
                  { value: "auto", label: "auto", icon: AiMagicIcon },
                ]}
              />
              <ToolbarMenu
                icon={AlignVerticalCenterIcon}
                label="align"
                value={align}
                onValueChange={(value) => setAlign(value as JumpAlign)}
                options={[
                  { value: "start", label: "start", icon: AlignTopIcon },
                  {
                    value: "center",
                    label: "center",
                    icon: AlignVerticalCenterIcon,
                  },
                  { value: "end", label: "end", icon: AlignBottomIcon },
                  { value: "nearest", label: "nearest", icon: CenterFocusIcon },
                ]}
              />
              <div className="ms-auto flex items-center gap-0.5">
                <ScrollStateChips />
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Load history"
                        disabled={historyLoaded}
                        onClick={loadHistory}
                      >
                        <HugeiconsIcon icon={HistoryIcon} />
                      </Button>
                    }
                  />
                  <TooltipContent>
                    <p>{historyLoaded ? "History loaded" : "Load history"}</p>
                  </TooltipContent>
                </Tooltip>
                <JumpMenu
                  turns={anchoredTurns}
                  align={align}
                  behavior={behavior}
                />
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Reset conversation and settings"
                        disabled={isBusy}
                        onClick={reset}
                      >
                        <HugeiconsIcon icon={RotateIcon} />
                      </Button>
                    }
                  />
                  <TooltipContent>
                    <p>Reset</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            {/* ------------------------------ Thread ----------------------------- */}
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
            {/* ----------------------------- Composer ---------------------------- */}
            <CardFooter className="flex-col gap-3 border-t pt-(--card-spacing)">
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
                  <div className="h-14 w-full  px-3 py-2.5">
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
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <InputGroupButton
                            aria-label="Add files"
                            type="button"
                            size="icon-sm"
                            variant="outline"
                          >
                            <HugeiconsIcon icon={PlugIcon} />
                          </InputGroupButton>
                        }
                      />
                      <DropdownMenuContent
                        align="start"
                        side="top"
                        className="w-44"
                      >
                        <DropdownMenuItem>
                          <HugeiconsIcon icon={Paperclip} />
                          Add Photos & Files
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <HugeiconsIcon icon={CameraIcon} />
                          Create Image
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <HugeiconsIcon icon={Telescope01Icon} />
                          Deep Research
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <HugeiconsIcon icon={GlobeIcon} />
                          Web Search
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <InputGroupButton
                      type="submit"
                      variant="default"
                      size="icon-sm"
                      className="ml-auto"
                      disabled={!nextMessage || isBusy}
                    >
                      <HugeiconsIcon icon={ArrowUpIcon} />
                      <span className="sr-only">Send</span>
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </form>
            </CardFooter>
          </Card>
          {/* --------------------------- Outline rail --------------------------- */}
          <div className="absolute top-1/2 -right-12 -translate-y-1/2">
            <TranscriptOutline
              turns={anchoredTurns}
              align={align}
              behavior={behavior}
            />
          </div>
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
/*                              Toolbar controls                              */
/* -------------------------------------------------------------------------- */

type ToolbarIcon = typeof MouseScroll01Icon
type ToolbarOption = { value: string; label: string; icon: ToolbarIcon }

function ToolbarToggle({
  icon,
  label,
  pressed,
  onPressedChange,
}: {
  icon: ToolbarIcon
  label: string
  pressed: boolean
  onPressedChange: (pressed: boolean) => void
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Toggle
            pressed={pressed}
            onPressedChange={onPressedChange}
            aria-label={`Toggle ${label}`}
            className="size-8 p-0"
          >
            <HugeiconsIcon icon={icon} />
          </Toggle>
        }
      />
      <TooltipContent>
        <p className="font-mono text-xs">
          {label}: {pressed ? "on" : "off"}
        </p>
      </TooltipContent>
    </Tooltip>
  )
}

function ToolbarMenu({
  icon,
  label,
  value,
  onValueChange,
  options,
}: {
  icon: ToolbarIcon
  label: string
  value: string
  onValueChange: (value: string) => void
  options: ToolbarOption[]
}) {
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon-sm" aria-label={label}>
                  <HugeiconsIcon icon={icon} />
                </Button>
              }
            />
          }
        />
        <TooltipContent>
          <p className="font-mono text-xs">
            {label}: {value}
          </p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(next) => onValueChange(String(next))}
        >
          <DropdownMenuLabel className="font-mono text-xs">
            {label}
          </DropdownMenuLabel>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              <HugeiconsIcon icon={option.icon} />
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ToolbarSlider({
  icon,
  label,
  value,
  min,
  max,
  onChange,
}: {
  icon: ToolbarIcon
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
}) {
  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger
              render={
                <Button variant="ghost" size="icon-sm" aria-label={label}>
                  <HugeiconsIcon icon={icon} />
                </Button>
              }
            />
          }
        />
        <TooltipContent>
          <p className="font-mono text-xs">
            {label}: {value}px
          </p>
        </TooltipContent>
      </Tooltip>
      <PopoverContent align="start" className="w-56">
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
          className="mt-3"
          onValueChange={(next) => {
            const nextValue = Array.isArray(next) ? next[0] : next
            if (typeof nextValue === "number") {
              onChange(nextValue)
            }
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

/* -------------------------------------------------------------------------- */
/*                         Commands, outline, and state                       */
/* -------------------------------------------------------------------------- */

function trimTurnText(text: string) {
  return text.length > 42 ? `${text.slice(0, 39)}...` : text
}

function JumpMenu({
  turns,
  align,
  behavior,
}: {
  turns: Turn[]
  align: JumpAlign
  behavior: ScrollBehavior
}) {
  const { scrollToMessage, scrollToStart, scrollToEnd } = useMessageScroller()
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon-sm" aria-label="Jump to...">
                  <HugeiconsIcon icon={Navigation03Icon} />
                </Button>
              }
            />
          }
        />
        <TooltipContent>
          <p>Jump to...</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Jump to</DropdownMenuLabel>
          {turns.map((turn) => (
            <DropdownMenuItem
              key={turn.id}
              onClick={() => scrollToMessage(turn.id, { align, behavior })}
            >
              <span className="line-clamp-1 min-w-0">
                {trimTurnText(turn.text)}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => scrollToStart({ behavior })}>
          Start of conversation
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => scrollToEnd({ behavior })}>
          Latest message
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function TranscriptOutline({
  turns,
  align,
  behavior,
}: {
  turns: Turn[]
  align: JumpAlign
  behavior: ScrollBehavior
}) {
  const { scrollToMessage } = useMessageScroller()
  const { currentAnchorId } = useMessageScrollerVisibility()
  if (turns.length === 0) {
    return null
  }
  return (
    <HoverCard>
      <HoverCardTrigger
        render={
          <button
            type="button"
            aria-label="Open transcript outline"
            className="flex h-9 w-9 flex-col items-center justify-center gap-1 rounded-md transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        }
      >
        {turns.map((turn) => (
          <span
            key={turn.id}
            data-current={turn.id === currentAnchorId}
            className="h-0.5 w-4 rounded-full bg-muted-foreground/40 data-[current=true]:bg-foreground"
          />
        ))}
      </HoverCardTrigger>
      <HoverCardContent
        align="center"
        side="left"
        sideOffset={-28}
        className="flex w-64 flex-col gap-1 rounded-2xl p-1"
      >
        {turns.map((turn) => (
          <button
            key={turn.id}
            type="button"
            aria-current={currentAnchorId === turn.id ? "location" : undefined}
            className="flex min-h-7 items-center rounded-xl px-2 py-1.5 text-left text-sm transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground aria-current:bg-accent aria-current:text-accent-foreground"
            onClick={() => scrollToMessage(turn.id, { align, behavior })}
          >
            <span className="line-clamp-1 min-w-0">
              {trimTurnText(turn.text)}
            </span>
          </button>
        ))}
      </HoverCardContent>
    </HoverCard>
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
    <HoverCard>
      <HoverCardTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Scroll state"
          >
            <HugeiconsIcon icon={Navigation03Icon} />
          </Button>
        }
      />
      <HoverCardContent className="w-auto">
        <div className="flex w-full flex-wrap justify-center gap-1.5">
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
      </HoverCardContent>
    </HoverCard>
  )
}
