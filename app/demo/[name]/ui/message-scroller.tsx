"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import {
  ArrowUpIcon,
  GlobeIcon,
  MessageCircleCodeIcon,
  Paperclip,
  PlugIcon,
  RotateIcon,
  Telescope01Icon,
  CameraIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { createChat, getMessageText } from "@/lib/ai"
import {
  MESSAGE_ANIMATIONS,
  type MessageAnimationId,
} from "@/lib/message-animations"
import { MessageAnimated } from "@/components/ai/message-animated"
import { ExampleWrapper } from "@/components/example"
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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
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
import { Marker, MarkerContent } from "@/components/ui/marker"
import {
  Message,
  MessageContent,
  MessageHeader,
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
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/toast"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function MessageScrollerExample() {
  return (
    <ExampleWrapper>
      <MessageScrollerDemo />
      <MessageScrollerAnchoring />
      <MessageScrollerGroupChat />
      <MessageScrollerPreviousContext />
      <MessageScrollerStreaming />
      <MessageScrollerLoadHistory />
      <MessageScrollerAnimation />
      <MessageScrollerScrollable />
      <MessageScrollerCommands />
      <MessageScrollerOpeningPosition />
      <MessageScrollerState />
      <MessageScrollerVisibility />
    </ExampleWrapper>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    Demo                                     */
/* -------------------------------------------------------------------------- */

const demoChat = createChat()
  .user(
    "I'm building a chat for our app and the scroll behavior is driving me nuts. Every time the AI streams a reply, the whole thread jumps around."
  )
  .sleep(1000)
  .assistant(
    "That's the classic streaming scroll problem. Wrap your message list in `MessageScroller` and turn on `autoScroll` — the viewport pins to the bottom as tokens arrive, so users always see the latest text land in place.\n\nThe important part: it only auto-scrolls while the reader is already at the bottom. The moment they scroll up to read something earlier, auto-scroll backs off and their position is preserved. You get smooth streaming without fighting the user's intent."
  )
  .user(
    "Okay, but when someone sends a new message the view still feels jarring — like the whole conversation reloads from the top."
  )
  .sleep(1000)
  .assistant(
    "MessageScrollerItem fixes that with turn anchoring. Set `scrollAnchor` on the turn that should settle near the top instead of blindly snapping to the document bottom.\n\nIt also leaves a small peek of the previous exchange visible above the anchor, so context isn't lost. The reply starts in view without that disorienting jump you get from a plain overflow container."
  )
  .user(
    "And if they've scrolled up to re-read an older answer? I don't want to yank them back down."
  )
  .sleep(1000)
  .assistant(
    "You won't. Auto-scroll only runs when the viewport is already pinned to the bottom, so scrolling up is a deliberate opt-out — their place in the thread stays put even as new tokens keep arriving below.\n\nWhen there is content they haven't seen yet, `MessageScrollerButton` appears at the bottom of the viewport. One tap jumps them back to the newest message and re-engages auto-scroll. Same pattern as Slack or iMessage: quiet when you're caught up, helpful when you're not."
  )
  .user("Last one — does this work with assistive tech?")
  .sleep(1000)
  .assistant(
    '`MessageScrollerContent` sets `role="log"` and `aria-relevant="additions"` by default, so screen readers announce new messages as they stream in.\n\nThe scroll button is a real `<button>` with an sr-only label, and it\'s removed from the tab order when you\'re already at the bottom — no ghost focus stops.'
  )
const demoInitialMessages = demoChat.get({ count: 0 })
const demoTransport = demoChat.transport({ chunkDelayMs: 20 })

function MessageScrollerDemo() {
  const { messages, sendMessage, status, setMessages } = useChat({
    messages: demoInitialMessages,
    transport: demoTransport,
  })
  const nextMessage = demoChat.next({ after: messages })
  const isBusy = status === "submitted" || status === "streaming"

  return (
    <MessageScrollerProvider>
      <div className="relative flex flex-col gap-4">
        <Card className="mx-auto h-140 w-full max-w-sm gap-0">
          <CardHeader className="gap-1 border-b">
            <CardTitle>New Chat</CardTitle>
            <CardDescription>How can I help you today?</CardDescription>
            <CardAction>
              <Tooltip>
                <TooltipTrigger render={<Button variant="outline" size="icon" aria-label="Reset conversation" onClick={() => setMessages(demoInitialMessages)} disabled={isBusy}><HugeiconsIcon icon={RotateIcon} /></Button>} />
                <TooltipContent>
                  <p>Reset</p>
                </TooltipContent>
              </Tooltip>
            </CardAction>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            {messages.length === 0 ? (
              <Empty className="h-full">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <HugeiconsIcon icon={MessageCircleCodeIcon} />
                  </EmptyMedia>
                  <EmptyTitle>Morning, shadcn!</EmptyTitle>
                  <EmptyDescription>
                    What are we working on today? Press send to start a new
                    conversation
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <MessageScroller>
                <MessageScrollerViewport>
                  <MessageScrollerContent
                    aria-busy={isBusy}
                    className="p-(--card-spacing)"
                  >
                    {messages.map((message) => (
                      <MessageAnimated
                        key={message.id}
                        message={message}
                        scrollAnchor={message.role === "user"}
                      />
                    ))}
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton />
              </MessageScroller>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2">
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
                        No messages queued. Reset the conversation.
                      </span>
                    )}
                  </span>
                </div>
                <InputGroupAddon align="block-end" className="pt-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<InputGroupButton aria-label="Add files" type="button" size="icon-sm" variant="outline"><HugeiconsIcon icon={PlugIcon} /></InputGroupButton>} />
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
        <div className="px-0.5 text-center text-xs text-muted-foreground">
          Demo is read only. Press send to send messages.
        </div>
      </div>
    </MessageScrollerProvider>
  )
}

/* -------------------------------------------------------------------------- */
/*                               Anchoring Turns                              */
/* -------------------------------------------------------------------------- */

type AnchorRole = "user" | "assistant"
type AnchoringMessage = {
  id: string
  role: AnchorRole
  text: string
}
const anchoringMessages: AnchoringMessage[] = [
  {
    id: "anchor-1-user",
    role: "user",
    text: "Can you show me how anchoring behaves when a new prompt starts the turn?",
  },
  {
    id: "anchor-1-assistant",
    role: "assistant",
    text: "Append the user prompt first, then append the assistant response. With User selected, the prompt settles near the top and the assistant response fills in below it.",
  },
  {
    id: "anchor-2-user",
    role: "user",
    text: "What changes when assistant messages are the anchor?",
  },
  {
    id: "anchor-2-assistant",
    role: "assistant",
    text: "Now each assistant response is the item `MessageScroller` keeps in view. This is useful when the reply is the moment you want readers to land on after each turn.",
  },
  {
    id: "anchor-3-user",
    role: "user",
    text: "Can I switch roles and keep adding turns?",
  },
  {
    id: "anchor-3-assistant",
    role: "assistant",
    text: "Yes. The next appended message with the selected role becomes the anchor, so you can compare user and assistant anchoring without resetting the demo.",
  },
]

function MessageScrollerAnchoring() {
  const [anchorRole, setAnchorRole] = React.useState<AnchorRole>("user")
  const [messages, setMessages] = React.useState<AnchoringMessage[]>([])
  const [messageIndex, setMessageIndex] = React.useState(0)
  const nextMessage = anchoringMessages[messageIndex]
  return (
    <div className="relative flex flex-col gap-4">
      <Card className="mx-auto h-140 w-full max-w-sm gap-0">
        <CardHeader className="border-b">
          <CardTitle>Anchoring Turns</CardTitle>
          <CardDescription>
            Choose which role settles near the top edge.
          </CardDescription>
          <CardAction>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Reset anchored turns"
              disabled={messages.length === 0}
              onClick={() => {
                setMessages([])
                setMessageIndex(0)
              }}
            >
              <HugeiconsIcon icon={RotateIcon} />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="min-h-0 flex-1 overflow-hidden p-0">
          {messages.length === 0 ? (
            <Empty className="h-full">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <HugeiconsIcon icon={MessageCircleCodeIcon} />
                </EmptyMedia>
                <EmptyTitle>No anchored messages yet</EmptyTitle>
                <EmptyDescription>
                  Send the first message to see the selected role anchor.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <MessageScrollerProvider>
              <MessageScroller>
                <MessageScrollerViewport>
                  <MessageScrollerContent className="p-(--card-spacing)">
                    {messages.map((message) => (
                      <MessageAnimated
                        key={message.id}
                        message={message}
                        scrollAnchor={message.role === anchorRole}
                        userVariant="muted"
                        assistantVariant="ghost"
                      />
                    ))}
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton />
              </MessageScroller>
            </MessageScrollerProvider>
          )}
        </CardContent>
        <CardFooter>
          <ToggleGroup
            aria-label="Select scroll anchor role"
            value={[anchorRole]}
            onValueChange={(value) => {
              const nextValue = value[0]
              if (nextValue === "user" || nextValue === "assistant") {
                setAnchorRole(nextValue)
                setMessages([])
                setMessageIndex(0)
              }
            }}
          >
            <ToggleGroupItem value="user" aria-label="Anchor user messages">
              User
            </ToggleGroupItem>
            <ToggleGroupItem
              value="assistant"
              aria-label="Anchor assistant messages"
            >
              Assistant
            </ToggleGroupItem>
          </ToggleGroup>
          <Button
            type="button"
            size="icon"
            className="ml-auto"
            disabled={!nextMessage}
            onClick={() => {
              if (!nextMessage) {
                return
              }
              setMessages((messages) => [...messages, nextMessage])
              setMessageIndex((index) => index + 1)
            }}
          >
            <HugeiconsIcon icon={ArrowUpIcon} />
            <span className="sr-only">Send Message</span>
          </Button>
        </CardFooter>
      </Card>
      <div className="mx-auto max-w-xs px-0.5 text-center text-xs text-muted-foreground">
        Toggle the anchor role, then send messages to compare where turns
        settle.
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                 Group Chat                                 */
/* -------------------------------------------------------------------------- */

const currentUser = "Grace"
type GroupChatItem =
  | {
      id: string
      type: "event"
      text: string
      scrollAnchor?: boolean
    }
  | {
      id: string
      type: "message"
      sender: string
      role: "assistant" | "participant"
      text: string
      scrollAnchor?: boolean
    }
const initialItems = [
  {
    id: "group-1",
    type: "message",
    sender: "Grace",
    role: "participant",
    text: "@mary, the astrophage line keeps matching Venus energy output. Can you check my math?",
  },
  {
    id: "group-2",
    type: "message",
    sender: "Mary (Agent)",
    role: "assistant",
    text: "Yes. Confirmed. The curve points to a microorganism harvesting stellar energy and breeding near carbon dioxide. If @rocky agrees, this is the clue we need.",
  },
  {
    id: "group-3",
    type: "message",
    sender: "Grace",
    role: "participant",
    text: "ping @rocky",
    scrollAnchor: true,
  },
] satisfies GroupChatItem[]
const rockyMarker = {
  id: "group-4",
  type: "event",
  text: "Rocky has joined the chat",
  scrollAnchor: true,
} satisfies GroupChatItem
const rockyMessage = {
  id: "group-5",
  type: "message",
  sender: "Rocky",
  role: "participant",
  text: "Amaze. Astrophage eats light, makes heat, goes to carbon dioxide. Rocky has fuel model. Grace is smart.",
} satisfies GroupChatItem

function MessageScrollerGroupChat() {
  const [demoKey, setDemoKey] = React.useState(0)
  const [rockyTurn, setRockyTurn] = React.useState<
    "idle" | "marker" | "message"
  >("idle")
  const items =
    rockyTurn === "message"
      ? [...initialItems, rockyMarker, rockyMessage]
      : rockyTurn === "marker"
        ? [...initialItems, rockyMarker]
        : initialItems
  const buttonLabel =
    rockyTurn === "idle" ? "Add Rocky" : "Send Message as Rocky"
  const isComplete = rockyTurn === "message"
  return (
    <MessageScrollerProvider>
      <div className="relative flex flex-col gap-4">
        <Card className="mx-auto h-140 w-full max-w-sm gap-0">
          <CardHeader className="gap-1 border-b">
            <CardTitle>Group Chat</CardTitle>
            <CardDescription>
              A group chat with several participants and an assistant. The
              Marker is marked as a turn.
            </CardDescription>
            <CardAction>
              <Tooltip>
                <TooltipTrigger render={<Button type="button" variant="outline" size="icon" aria-label="Reset conversation" disabled={rockyTurn === "idle"} onClick={() => {
                        setRockyTurn("idle")
                        setDemoKey((key) => key + 1)
                      }}><HugeiconsIcon icon={RotateIcon} /></Button>} />
                <TooltipContent>
                  <p>Reset</p>
                </TooltipContent>
              </Tooltip>
            </CardAction>
          </CardHeader>
          <CardContent className="min-h-0 flex-1 p-0">
            <MessageScrollerProvider>
              <MessageScroller key={demoKey}>
                <MessageScrollerViewport>
                  <MessageScrollerContent className="p-(--card-spacing)">
                    {items.map((item) =>
                      item.type === "message" ? (
                        <GroupChatMessage key={item.id} item={item} />
                      ) : (
                        <GroupChatMarker
                          key={item.id}
                          item={item}
                          scrollAnchor={item.scrollAnchor}
                        />
                      )
                    )}
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton />
              </MessageScroller>
            </MessageScrollerProvider>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-2 border-t">
            <Button
              type="button"
              disabled={isComplete}
              onClick={() =>
                setRockyTurn((turn) => (turn === "idle" ? "marker" : "message"))
              }
              className="w-full"
              variant="secondary"
            >
              {buttonLabel}
            </Button>
            <p className="text-xs text-muted-foreground">
              {rockyTurn === "idle"
                ? "This will create a marker and make it the anchor"
                : "Now send Rocky's reply into the conversation"}
            </p>
          </CardFooter>
        </Card>
        <div className="mx-auto max-w-sm px-0.5 text-center text-xs text-balance text-muted-foreground">
          When a user joins, a marker is created. scrollAnchor on the marker
          marks it as the next turn
        </div>
      </div>
    </MessageScrollerProvider>
  )
}

function GroupChatMessage({
  item,
}: {
  item: Extract<GroupChatItem, { type: "message" }>
}) {
  const isCurrentUser = item.sender === currentUser
  const variant = isCurrentUser
    ? "muted"
    : item.role === "assistant"
      ? "ghost"
      : "tinted"
  return (
    <MessageScrollerItem messageId={item.id} scrollAnchor={item.scrollAnchor}>
      <Message align={isCurrentUser ? "end" : "start"}>
        <MessageContent>
          {!isCurrentUser && <MessageHeader>{item.sender}</MessageHeader>}
          <Bubble variant={variant}>
            <BubbleContent>{item.text}</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </MessageScrollerItem>
  )
}

function GroupChatMarker({
  item,
  scrollAnchor = false,
}: {
  item: Extract<GroupChatItem, { type: "event" }>
  scrollAnchor?: boolean
}) {
  return (
    <MessageScrollerItem scrollAnchor={scrollAnchor}>
      <Marker variant="separator">
        <MarkerContent>{item.text}</MarkerContent>
      </Marker>
    </MessageScrollerItem>
  )
}

/* -------------------------------------------------------------------------- */
/*                           Keeping Context Visible                         */
/* -------------------------------------------------------------------------- */

const DEFAULT_PEEK = 64
const contextChat = createChat()
  .user(
    "I'm building a chat for our app and the scroll behavior is driving me nuts. Every time the AI streams a reply, the whole thread jumps around."
  )
  .sleep(1000)
  .assistant(
    "That's the classic streaming scroll problem. Wrap your message list in `MessageScroller` and turn on `autoScroll` — the viewport pins to the bottom as tokens arrive, so users always see the latest text land in place.\n\nThe important part: it only auto-scrolls while the reader is already at the bottom. The moment they scroll up to read something earlier, auto-scroll backs off and their position is preserved. You get smooth streaming without fighting the user's intent."
  )
  .user(
    "Okay, but when someone sends a new message the view still feels jarring — like the whole conversation reloads from the top."
  )
  .sleep(1000)
  .assistant(
    "MessageScrollerItem fixes that with turn anchoring. Set `scrollAnchor` on the turn that should settle near the top instead of blindly snapping to the document bottom.\n\nIt also leaves a small peek of the previous exchange visible above the anchor, so context isn't lost. The reply starts in view without that disorienting jump you get from a plain overflow container."
  )
  .user(
    "And if they've scrolled up to re-read an older answer? I don't want to yank them back down."
  )
  .sleep(1000)
  .assistant(
    "You won't. Auto-scroll only runs when the viewport is already pinned to the bottom, so scrolling up is a deliberate opt-out — their place in the thread stays put even as new tokens keep arriving below.\n\nWhen there is content they haven't seen yet, `MessageScrollerButton` appears at the bottom of the viewport. One tap jumps them back to the newest message and re-engages auto-scroll. Same pattern as Slack or iMessage: quiet when you're caught up, helpful when you're not."
  )
  .user("Last one — does this work with assistive tech?")
  .sleep(1000)
  .assistant(
    '`MessageScrollerContent` sets `role="log"` and `aria-relevant="additions"` by default, so screen readers announce new messages as they stream in.\n\nThe scroll button is a real `<button>` with an sr-only label, and it\'s removed from the tab order when you\'re already at the bottom — no ghost focus stops.'
  )
const contextInitialMessages = contextChat.get({ count: 2 })
const contextTransport = contextChat.transport({ chunkDelayMs: 35 })

function MessageScrollerPreviousContext() {
  const [demoKey, setDemoKey] = React.useState(0)
  const [peek, setPeek] = React.useState(DEFAULT_PEEK)
  const { messages, sendMessage, setMessages, status } = useChat({
    messages: contextInitialMessages,
    transport: contextTransport,
  })
  const nextMessage = contextChat.next({ after: messages })
  const isBusy = status === "submitted" || status === "streaming"
  return (
    <MessageScrollerProvider
      key={demoKey}
      scrollMargin={24}
      scrollPreviousItemPeek={peek}
    >
      <div className="relative flex flex-col gap-4">
        <Card className="mx-auto h-140 w-full max-w-sm gap-0">
          <CardHeader className="gap-1 border-b">
            <CardTitle>Keeping Context Visible</CardTitle>
            <CardDescription>
              New turns keep part of the previous reply in view.
            </CardDescription>
            <CardAction>
              <Tooltip>
                <TooltipTrigger render={<Button variant="outline" size="icon" aria-label="Reset context example" disabled={isBusy} onClick={() => {
                        setMessages(contextInitialMessages)
                        setPeek(DEFAULT_PEEK)
                        setDemoKey((key) => key + 1)
                      }}><HugeiconsIcon icon={RotateIcon} /></Button>} />
                <TooltipContent>
                  <p>Reset</p>
                </TooltipContent>
              </Tooltip>
            </CardAction>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <MessageScroller>
              <MessageScrollerViewport>
                <MessageScrollerContent
                  aria-busy={isBusy}
                  className="p-(--card-spacing)"
                >
                  {messages.map((message) => (
                    <MessageAnimated
                      key={message.id}
                      message={message}
                      scrollAnchor={message.role === "user"}
                    />
                  ))}
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          </CardContent>
          <CardFooter className="flex-col gap-2">
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
                        No messages queued. Reset the context.
                      </span>
                    )}
                  </span>
                </div>
                <InputGroupAddon align="block-end" className="pt-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<InputGroupButton aria-label="Add files" type="button" size="icon-sm" variant="outline"><HugeiconsIcon icon={PlugIcon} /></InputGroupButton>} />
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
                  <div className="flex w-28 items-center gap-2">
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {peek}px
                    </span>
                    <Slider
                      aria-label="Previous context peek"
                      value={[peek]}
                      min={64}
                      max={128}
                      step={1}
                      disabled={isBusy}
                      onValueChange={(value) => {
                        const nextValue = Array.isArray(value)
                          ? value[0]
                          : value
                        setPeek(nextValue ?? DEFAULT_PEEK)
                      }}
                    />
                  </div>
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
        <div className="px-0.5 text-center text-xs text-muted-foreground">
          Adjust the slider and send. Observe the previous message peak
        </div>
      </div>
    </MessageScrollerProvider>
  )
}

/* -------------------------------------------------------------------------- */
/*                             Streaming Messages                            */
/* -------------------------------------------------------------------------- */

const streamingChat = createChat()
  .user(
    "I'm building a chat for our app and the scroll behavior is driving me nuts. Every time the AI streams a reply, the whole thread jumps around."
  )
  .sleep(1000)
  .assistant(
    "That's the classic streaming scroll problem. Wrap your message list in `MessageScroller` and turn on `autoScroll` — the viewport pins to the bottom as tokens arrive, so users always see the latest text land in place.\n\nThe important part: it only auto-scrolls while the reader is already at the bottom. The moment they scroll up to read something earlier, auto-scroll backs off and their position is preserved. You get smooth streaming without fighting the user's intent."
  )
  .user(
    "Okay, but when someone sends a new message the view still feels jarring — like the whole conversation reloads from the top."
  )
  .sleep(1000)
  .assistant(
    "MessageScrollerItem fixes that with turn anchoring. Set `scrollAnchor` on the turn that should settle near the top instead of blindly snapping to the document bottom.\n\nIt also leaves a small peek of the previous exchange visible above the anchor, so context isn't lost. The reply starts in view without that disorienting jump you get from a plain overflow container."
  )
  .user(
    "And if they've scrolled up to re-read an older answer? I don't want to yank them back down."
  )
  .sleep(1000)
  .assistant(
    "You won't. Auto-scroll only runs when the viewport is already pinned to the bottom, so scrolling up is a deliberate opt-out — their place in the thread stays put even as new tokens keep arriving below.\n\nWhen there is content they haven't seen yet, `MessageScrollerButton` appears at the bottom of the viewport. One tap jumps them back to the newest message and re-engages auto-scroll. Same pattern as Slack or iMessage: quiet when you're caught up, helpful when you're not."
  )
  .user("Last one — does this work with assistive tech?")
  .sleep(1000)
  .assistant(
    '`MessageScrollerContent` sets `role="log"` and `aria-relevant="additions"` by default, so screen readers announce new messages as they stream in.\n\nThe scroll button is a real `<button>` with an sr-only label, and it\'s removed from the tab order when you\'re already at the bottom — no ghost focus stops.'
  )
const streamingInitialMessages = streamingChat.get({ count: 0 })
const streamingTransport = streamingChat.transport({ chunkDelayMs: 20 })

function MessageScrollerStreaming() {
  const { messages, sendMessage, setMessages, status } = useChat({
    messages: streamingInitialMessages,
    transport: streamingTransport,
  })
  const nextMessage = streamingChat.next({ after: messages })
  const isBusy = status === "submitted" || status === "streaming"
  return (
    <MessageScrollerProvider autoScroll>
      <div className="relative flex flex-col gap-4">
        <Card className="mx-auto h-140 w-full max-w-sm gap-0">
          <CardHeader className="gap-1 border-b">
            <CardTitle>Streaming Messages</CardTitle>
            <CardDescription>
              Auto-scroll follows the live edge of the conversation.
            </CardDescription>
            <CardAction>
              <Tooltip>
                <TooltipTrigger render={<Button variant="outline" size="icon" aria-label="Reset stream" onClick={() => setMessages(streamingInitialMessages)} disabled={messages.length === 0 || isBusy}><HugeiconsIcon icon={RotateIcon} /></Button>} />
                <TooltipContent>
                  <p>Reset</p>
                </TooltipContent>
              </Tooltip>
            </CardAction>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            {messages.length === 0 ? (
              <Empty className="h-full">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <HugeiconsIcon icon={MessageCircleCodeIcon} />
                  </EmptyMedia>
                  <EmptyTitle>Ready to Stream</EmptyTitle>
                  <EmptyDescription>
                    Press send to stream a scripted launch summary.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <MessageScroller>
                <MessageScrollerViewport>
                  <MessageScrollerContent
                    aria-busy={isBusy}
                    className="p-(--card-spacing)"
                  >
                    {messages.map((message) => (
                      <MessageAnimated
                        key={message.id}
                        message={message}
                        scrollAnchor={message.role === "user"}
                      />
                    ))}
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton />
              </MessageScroller>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2">
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
                        No messages queued. Reset the stream.
                      </span>
                    )}
                  </span>
                </div>
                <InputGroupAddon align="block-end" className="pt-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<InputGroupButton aria-label="Add files" type="button" size="icon-sm" variant="outline"><HugeiconsIcon icon={PlugIcon} /></InputGroupButton>} />
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
        <div className="px-0.5 text-center text-xs text-muted-foreground">
          Streaming is simulated. `autoScroll` is enabled.
        </div>
      </div>
    </MessageScrollerProvider>
  )
}

/* -------------------------------------------------------------------------- */
/*                                Load History                               */
/* -------------------------------------------------------------------------- */

const historyChat = createChat()
  .user("Can you summarize the incident channel?")
  .assistant(
    "The first alert was a delayed export job. It started backing up around 09:42 UTC and triggered the warning once the retry queue crossed the threshold.\n\nNo customer-facing checkout paths were affected, but exports for larger workspaces were running about 12 minutes behind."
  )
  .user("Was checkout affected?")
  .assistant(
    "No checkout errors were reported. Payment authorization, order creation, and confirmation emails stayed inside their normal latency bands.\n\nThe only elevated metric was export queue depth, which maps to analytics downloads instead of checkout."
  )
  .user("What changed in the last deploy?")
  .assistant(
    "Only the export queue worker changed. The deploy moved large CSV jobs onto the shared retry policy, which made each failed attempt hold a worker slot longer than before.\n\nThe app deploy did not include checkout, pricing, or billing API changes."
  )
  .user("Do we need to roll back?")
  .assistant(
    "Not yet. Queue depth is recovering after we reduced retry concurrency, and the oldest pending job is now under five minutes old.\n\nKeep rollback ready if the queue starts climbing again, but the current trend points toward recovery."
  )
  .user("Keep watching for customer-visible issues.")
  .assistant(
    "I will watch the queue and support tags for another 15 minutes. I am tracking export failures, delayed download requests, and any support thread that mentions missing reports.\n\nIf those stay quiet through the next batch window, we can close this as an internal degradation."
  )
const history = historyChat.get()
const INITIAL_VISIBLE_COUNT = 5

function MessageScrollerLoadHistory() {
  const [demoKey, setDemoKey] = React.useState(0)
  const [visibleCount, setVisibleCount] = React.useState(INITIAL_VISIBLE_COUNT)
  const visibleMessages = history.slice(-visibleCount)
  const canLoadHistory = visibleCount < history.length
  return (
    <MessageScrollerProvider>
      <div className="relative flex flex-col gap-4">
        <Card className="mx-auto h-140 w-full max-w-sm gap-0">
          <CardHeader className="gap-1 border-b">
            <CardTitle>Load History</CardTitle>
            <CardDescription>
              Prepended messages keep your place.
            </CardDescription>
            <CardAction>
              <Tooltip>
                <TooltipTrigger render={<Button type="button" variant="outline" size="icon" aria-label="Reset loaded messages" disabled={visibleCount === INITIAL_VISIBLE_COUNT} onClick={() => {
                        setVisibleCount(INITIAL_VISIBLE_COUNT)
                        setDemoKey((key) => key + 1)
                      }}><HugeiconsIcon icon={RotateIcon} /></Button>} />
                <TooltipContent>
                  <p>Reset</p>
                </TooltipContent>
              </Tooltip>
            </CardAction>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <MessageScroller key={demoKey}>
              <MessageScrollerViewport>
                <MessageScrollerContent className="p-(--card-spacing)">
                  {visibleMessages.map((message) => {
                    const isUserMessage = message.role === "user"
                    return (
                      <MessageScrollerItem
                        key={message.id}
                        messageId={message.id}
                      >
                        <Message align={isUserMessage ? "end" : "start"}>
                          <MessageContent>
                            <Bubble variant={isUserMessage ? "muted" : "ghost"}>
                              <BubbleContent className="space-y-2">
                                {getMessageText(message)
                                  .split(/\n\s*\n/)
                                  .map((paragraph) => paragraph.trim())
                                  .filter(Boolean)
                                  .map((paragraph, index) => (
                                    <p
                                      key={index}
                                      className="whitespace-pre-wrap"
                                    >
                                      {paragraph}
                                    </p>
                                  ))}
                              </BubbleContent>
                            </Bubble>
                          </MessageContent>
                        </Message>
                      </MessageScrollerItem>
                    )
                  })}
                  <MessageScrollerItem scrollAnchor={false}>
                    <Marker variant="separator">
                      <MarkerContent>End of Conversation</MarkerContent>
                    </Marker>
                  </MessageScrollerItem>
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-2 border-t">
            <Button
              type="button"
              disabled={!canLoadHistory}
              onClick={() => {
                setVisibleCount(history.length)
                toast.add({
                  title: "History loaded",
                  description: "Scroll up to see earlier messages.",
                })
              }}
              className="w-full"
              variant="secondary"
            >
              {canLoadHistory ? "Load History" : "History Loaded"}
            </Button>
            <p className="text-xs text-muted-foreground">
              Restore earlier messages while keeping your place.
            </p>
          </CardFooter>
        </Card>
        <div className="mx-auto max-w-sm px-0.5 text-center text-xs text-balance text-muted-foreground">
          Click Load History to load the entire conversation
        </div>
      </div>
    </MessageScrollerProvider>
  )
}

/* -------------------------------------------------------------------------- */
/*                                 Animation                                 */
/* -------------------------------------------------------------------------- */

const animationChat = createChat()
  .user("Can user messages pop in like iMessage without breaking anchoring?")
  .sleep(1000)
  .assistant(
    "Yes. Animate the user row with transform and opacity, and let the assistant response stream normally below it.\n\nThat keeps the row measurement predictable while still giving the newly sent bubble a more tactile entrance."
  )
  .user("What makes the animation feel more like iMessage?")
  .sleep(1000)
  .assistant(
    "Use a quick spring from the trailing edge: a little scale, a small upward move, and no layout animation.\n\nThe bubble feels tactile, but the measured row stays predictable, so anchoring and auto-scroll do not have to fight a changing layout."
  )
  .user("Can I switch between presets while testing the same thread?")
  .sleep(1000)
  .assistant(
    "Yes. Keep the conversation in place while you change the preset, then send the next message to compare the new entrance against the same context.\n\nThat makes it easier to judge the difference between a subtle fade, a snappy pop, and a more dramatic 3D tilt without rebuilding the scenario each time."
  )
const animationInitialMessages = animationChat.get({ count: 0 })
const animationTransport = animationChat.transport({ chunkDelayMs: 15 })

function MessageScrollerAnimation() {
  const { messages, sendMessage, setMessages, status } = useChat({
    messages: animationInitialMessages,
    transport: animationTransport,
  })
  const [presetId, setPresetId] = React.useState<MessageAnimationId>("fade")
  const nextMessage = animationChat.next({ after: messages })
  const isBusy = status === "submitted" || status === "streaming"
  const preset = MESSAGE_ANIMATIONS[presetId as MessageAnimationId]
  return (
    <div className="relative flex flex-col gap-4">
      <Card className="mx-auto h-140 w-full max-w-sm gap-0">
        <CardHeader className="border-b">
          <CardTitle>Animation</CardTitle>
          <CardDescription>
            Choose how user messages are animated when they are added to the
            conversation.
          </CardDescription>
          <CardAction className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Reset animated messages"
              disabled={messages.length === 0 || isBusy}
              onClick={() => setMessages(animationInitialMessages)}
            >
              <HugeiconsIcon icon={RotateIcon} />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="min-h-0 flex-1 overflow-hidden p-0">
          {messages.length === 0 ? (
            <Empty className="h-full">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <HugeiconsIcon icon={MessageCircleCodeIcon} />
                </EmptyMedia>
                <EmptyTitle>No Messages Yet</EmptyTitle>
                <EmptyDescription>
                  Click the button below to send the first message.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <MessageScrollerProvider>
              <MessageScroller>
                <MessageScrollerViewport>
                  <MessageScrollerContent
                    aria-busy={isBusy}
                    className="p-(--card-spacing)"
                  >
                    {messages.map((message) => (
                      <MessageAnimated
                        key={message.id}
                        message={message}
                        animationPreset={preset}
                        userVariant="muted"
                        assistantVariant="ghost"
                      />
                    ))}
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton />
              </MessageScroller>
            </MessageScrollerProvider>
          )}
        </CardContent>
        <CardFooter className="border-t">
          <Select
            value={presetId}
            onValueChange={(value) => {
              setPresetId(value as MessageAnimationId)
            }}
          >
            <SelectTrigger aria-label="Animation preset">
              <SelectValue>{preset.name}</SelectValue>
            </SelectTrigger>
            <SelectContent align="start" side="top">
              <SelectGroup>
                {Object.values(MESSAGE_ANIMATIONS).map((animation) => (
                  <SelectItem key={animation.id} value={animation.id}>
                    {animation.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            type="button"
            size="icon"
            className="ml-auto"
            disabled={!nextMessage || isBusy}
            onClick={() => {
              if (!nextMessage || isBusy) {
                return
              }
              void sendMessage(nextMessage)
            }}
          >
            <HugeiconsIcon icon={ArrowUpIcon} />
            <span className="sr-only">Send Message</span>
          </Button>
        </CardFooter>
      </Card>
      <div className="mx-auto max-w-sm px-0.5 text-center text-xs text-balance text-muted-foreground">
        Select an animation then click send to see it in action.
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                Scroll Status                              */
/* -------------------------------------------------------------------------- */

const scrollableMessages = Array.from({ length: 12 }, (_, index) => ({
  id: `scrollable-${index + 1}`,
  role: index % 2 === 0 ? "user" : "assistant",
  text:
    index % 2 === 0
      ? `Review scroll checkpoint ${index + 1}.`
      : `Checkpoint ${index + 1} is synced. The scrollable hook updates as the viewport moves.\n\nWhen the reader is at the first message, the footer should only point them down. Once they move into the middle of the transcript, it should explain that both directions are available.\n\nAt the latest message, the footer should switch again and only point them back up.`,
})) satisfies Array<{
  id: string
  role: "user" | "assistant"
  text: string
}>

function MessageScrollerScrollable() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4">
      <Card className="h-140 w-full gap-0 overflow-hidden">
        <CardHeader className="gap-1 border-b">
          <CardTitle>Scroll Status</CardTitle>
          <CardDescription>
            Where the reader can go scroll to based on current scroll position.
          </CardDescription>
        </CardHeader>
        <MessageScrollerProvider defaultScrollPosition="start">
          <CardContent className="flex-1 overflow-hidden p-0">
            <MessageScroller>
              <MessageScrollerViewport>
                <MessageScrollerContent className="gap-4 p-(--card-spacing)">
                  <Transcript />
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          </CardContent>
          <ScrollStateFooter />
        </MessageScrollerProvider>
      </Card>
      <div className="px-0.5 text-center text-xs text-muted-foreground">
        Scroll the transcript to see the footer update.
      </div>
    </div>
  )
}

function Transcript() {
  return scrollableMessages.map((message) => (
    <MessageAnimated
      key={message.id}
      message={message}
      scrollAnchor={message.role === "user"}
      userVariant="muted"
      assistantVariant="ghost"
    />
  ))
}

function ScrollStateFooter() {
  const { start, end } = useMessageScrollerScrollable()
  const status = getScrollStatus({ start, end })
  return (
    <CardFooter className="justify-center border-t text-center text-sm text-muted-foreground">
      {status}
    </CardFooter>
  )
}

function getScrollStatus({ start, end }: { start: boolean; end: boolean }) {
  if (start && end) {
    return "You can scroll both ways."
  }
  if (end) {
    return "You are at the top. You can only scroll down."
  }
  if (start) {
    return "You are at the bottom. You can only scroll up."
  }
  return "All messages fit in the viewport."
}

/* -------------------------------------------------------------------------- */
/*                                  Commands                                 */
/* -------------------------------------------------------------------------- */

const commandsChat = createChat()
  .user(
    "We're seeing activation dip after workspace creation. Can you help me find the likely step?",
    { id: "command-activation" }
  )
  .assistant(
    "The sharpest drop is between creating the workspace and inviting the first teammate.\n\nWorkspace creation is still healthy, but the invite step is where users pause. That suggests the product is asking for collaboration before the user has enough confidence in the workspace."
  )
  .user("What should I compare before we change the onboarding flow?", {
    id: "command-compare",
  })
  .assistant(
    "Compare three cohorts:\n\n1. Users who choose a template before inviting teammates.\n2. Users who start from a blank workspace.\n3. Users who skip invites and return within 24 hours.\n\nIf template users invite faster, the fix is probably better first-run guidance rather than a louder invite prompt."
  )
  .user("Can you turn that into an experiment?", {
    id: "command-experiment",
  })
  .assistant(
    "Yes. Create a variant that shows a short checklist after workspace creation:\n\n- Pick a template.\n- Add one project detail.\n- Invite a teammate when the workspace has context.\n\nMeasure first invite completion, 24-hour return rate, and whether teams create a second project."
  )
  .user("What's the risk if we delay the invite prompt?", {
    id: "command-risk",
  })
  .assistant(
    "The main risk is reducing team creation for accounts that already know who they want to invite.\n\nTo protect that path, keep the invite action visible in the header and only change the primary empty-state guidance. That gives confident teams a direct route without forcing uncertain users through the invite step too early."
  )

const commandsMessages = commandsChat.get()
const commandsUserMessages = commandsMessages.filter(
  (message) => message.role === "user"
)

function MessageScrollerCommands() {
  return (
    <MessageScrollerProvider defaultScrollPosition="end">
      <div className="relative flex flex-col gap-4">
        <Card className="mx-auto h-140 w-full max-w-sm gap-0">
          <CardHeader className="gap-1 border-b">
            <CardTitle>Commands</CardTitle>
            <CardDescription>
              Drive the transcript from outside.
            </CardDescription>
            <CardAction>
              <CommandMenu />
            </CardAction>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <MessageScroller>
              <MessageScrollerViewport>
                <MessageScrollerContent className="p-(--card-spacing)">
                  {commandsMessages.map((message) => {
                    const isUserMessage = message.role === "user"
                    const text = getMessageText(message)

                    return (
                      <MessageScrollerItem
                        key={message.id}
                        messageId={message.id}
                        scrollAnchor={isUserMessage}
                      >
                        <Message align={isUserMessage ? "end" : "start"}>
                          <MessageContent>
                            <Bubble variant={isUserMessage ? "muted" : "ghost"}>
                              <BubbleContent className="space-y-2">
                                {text
                                  .split(/\n\s*\n/)
                                  .map((paragraph) => paragraph.trim())
                                  .filter(Boolean)
                                  .map((paragraph, index) => (
                                    <p
                                      key={index}
                                      className="whitespace-pre-wrap"
                                    >
                                      {paragraph}
                                    </p>
                                  ))}
                              </BubbleContent>
                            </Bubble>
                          </MessageContent>
                        </Message>
                      </MessageScrollerItem>
                    )
                  })}
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          </CardContent>
        </Card>
        <div className="mx-auto max-w-sm px-0.5 text-center text-xs text-balance text-muted-foreground">
          Use the controls to jump to any message in the conversation.
        </div>
      </div>
    </MessageScrollerProvider>
  )
}

function CommandMenu() {
  const { scrollToMessage } = useMessageScroller()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button type="button" variant="secondary" />}
      >
        Jump to...
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Conversations</DropdownMenuLabel>
          {commandsUserMessages.map((message) => (
            <DropdownMenuItem
              key={message.id}
              onClick={() =>
                scrollToMessage(message.id, {
                  align: "start",
                  behavior: "smooth",
                })
              }
            >
              <span className="line-clamp-1 min-w-0">
                {getCommandsTrimmedText(message)}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function getCommandsTrimmedText(
  message: (typeof commandsUserMessages)[number]
) {
  const text = getMessageText(message)

  return text.length > 42 ? `${text.slice(0, 39)}...` : text
}

/* -------------------------------------------------------------------------- */
/*                              Opening Position                             */
/* -------------------------------------------------------------------------- */

const openingMessages = [
  {
    id: "open-1",
    role: "user",
    text: "This is the first message the user sent in the conversation.",
  },
  {
    id: "open-2",
    role: "assistant",
    text: "Workspace creation rose 8%, but first invite completion only rose 2%.",
  },
  {
    id: "open-3",
    role: "user",
    text: "This is the last message the user sent in the conversation.",
  },
  {
    id: "open-4",
    role: "assistant",
    text: "Start with the invite step. Teams are creating workspaces but waiting to add collaborators.\n\nRecommended follow-up:\n\n1. Compare invite drop-off by account size.\n2. Check whether users who skip invites still return within 24 hours.\n3. Review the empty-state copy on the first project screen.\n4. Segment activation by template, since template users may not need invites right away.\n\nIf that pattern holds, the next experiment should make collaboration useful earlier instead of prompting for invites harder.",
  },
] satisfies Array<{
  id: string
  role: "user" | "assistant"
  text: string
}>

const openingPositions = [
  { value: "start", label: "start" },
  { value: "end", label: "end" },
  { value: "last-anchor", label: "last-anchor" },
] satisfies Array<{
  value: "start" | "end" | "last-anchor"
  label: string
}>

function MessageScrollerOpeningPosition() {
  const [positionKey, setPositionKey] = React.useState(0)
  const [position, setPosition] = React.useState<
    "start" | "end" | "last-anchor"
  >("last-anchor")

  return (
    <div className="relative flex flex-col gap-4">
      <Card className="mx-auto h-140 w-full max-w-sm gap-0">
        <CardHeader className="gap-1 border-b">
          <CardTitle>Opening Position</CardTitle>
          <CardDescription>
            Choose where a saved transcript opens.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <MessageScrollerProvider>
            <OpeningPositionScroller
              position={position}
              positionKey={positionKey}
            />
          </MessageScrollerProvider>
        </CardContent>
        <CardFooter className="flex items-center justify-center border-t">
          <Tabs
            value={position}
            onValueChange={(value) => {
              if (
                value === "start" ||
                value === "end" ||
                value === "last-anchor"
              ) {
                setPosition(value)
                setPositionKey((key) => key + 1)
              }
            }}
            className="w-full"
          >
            <TabsList className="w-full">
              {openingPositions.map((option) => (
                <TabsTrigger key={option.value} value={option.value}>
                  {option.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardFooter>
      </Card>
      <div className="mx-auto max-w-sm px-0.5 text-center text-xs text-muted-foreground">
        Toggle the defaultScrollPosition to see where the transcript starts when
        you open the thread
      </div>
    </div>
  )
}

function OpeningPositionScroller({
  position,
  positionKey,
}: {
  position: "start" | "end" | "last-anchor"
  positionKey: number
}) {
  const { scrollToEnd, scrollToMessage, scrollToStart } = useMessageScroller()

  React.useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (position === "start") {
        scrollToStart({ behavior: "auto" })
        return
      }

      if (position === "end") {
        scrollToEnd({ behavior: "auto" })
        return
      }

      scrollToMessage("open-3", {
        align: "start",
        behavior: "auto",
        scrollMargin: 64,
      })
    })

    return () => {
      cancelAnimationFrame(frame)
    }
  }, [position, positionKey, scrollToEnd, scrollToMessage, scrollToStart])

  return (
    <MessageScroller>
      <MessageScrollerViewport>
        <MessageScrollerContent className="p-(--card-spacing)">
          {openingMessages.map((message) => {
            const isUserMessage = message.role === "user"

            return (
              <MessageScrollerItem
                key={message.id}
                messageId={message.id}
                scrollAnchor={isUserMessage}
              >
                <Message align={isUserMessage ? "end" : "start"}>
                  <MessageContent>
                    <Bubble variant={isUserMessage ? "muted" : "ghost"}>
                      <BubbleContent className="space-y-2">
                        {message.text
                          .split(/\n\s*\n/)
                          .map((paragraph) => paragraph.trim())
                          .filter(Boolean)
                          .map((paragraph, index) => (
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
          })}
        </MessageScrollerContent>
      </MessageScrollerViewport>
      <MessageScrollerButton />
    </MessageScroller>
  )
}

/* -------------------------------------------------------------------------- */
/*                                Scroll State                              */
/* -------------------------------------------------------------------------- */

const stateMessages = Array.from({ length: 12 }, (_, index) => ({
  id: `state-${index + 1}`,
  role: index % 2 === 0 ? "user" : "assistant",
  text:
    index % 2 === 0
      ? `Check section ${index + 1} of the transcript.`
      : `Section ${index + 1} is ready. Scroll state updates without rerendering the rows.`,
})) satisfies Array<{
  id: string
  role: "user" | "assistant"
  text: string
}>

function MessageScrollerState() {
  return (
    <Card className="mx-auto h-112 w-full max-w-md gap-0">
      <CardHeader className="border-b">
        <CardTitle>Scroll State</CardTitle>
        <CardDescription>
          Read scroll state in JavaScript with the state hook.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 p-0">
        <MessageScrollerProvider defaultScrollPosition="start">
          <MessageScroller>
            <StatusBar />
            <MessageScrollerViewport>
              <MessageScrollerContent className="gap-4 p-4 pt-12">
                {stateMessages.map((message) => (
                  <MessageScrollerItem
                    key={message.id}
                    messageId={message.id}
                    scrollAnchor={message.role === "user"}
                  >
                    <Message align={message.role === "user" ? "end" : "start"}>
                      <MessageContent>
                        <Bubble
                          variant={
                            message.role === "user" ? "default" : "muted"
                          }
                        >
                          <BubbleContent>{message.text}</BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>
      </CardContent>
    </Card>
  )
}

function StatusBar() {
  const { start, end } = useMessageScrollerScrollable()
  const states = [
    { label: "At top", on: !start },
    { label: "At bottom", on: !end },
    { label: "Older above", on: start },
    { label: "Newer below", on: end },
  ]

  return (
    <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex flex-wrap gap-1.5">
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

/* -------------------------------------------------------------------------- */
/*                             Transcript Outline                           */
/* -------------------------------------------------------------------------- */

const visibilityChat = createChat()
  .user("Review the incident handoff and tell me what to read first.", {
    id: "vis-brief",
  })
  .assistant(
    "Start with the summary and the impact section. The regression affected the upload queue, but the recovery path completed for every queued job."
  )
  .user("What was the customer impact?", {
    id: "vis-impact",
  })
  .assistant(
    "Impact was limited to delayed processing.\n\nNo records were dropped, and the reconciliation worker confirmed each retry batch. Support saw confusion from two customers, but there were no checkout or billing errors."
  )
  .user("What actions are open?", {
    id: "vis-actions",
  })
  .assistant(
    "Keep the retry window enabled until the next deploy, then add a queue-depth alert as the long-term fix.\n\nThe alert should fire on sustained queue growth, not a single short spike."
  )
  .user("Give me the follow-up checklist.", {
    id: "vis-checklist",
  })
  .assistant(
    "After that, compare the queue recovery graph with the deploy timeline so the handoff shows exactly when processing returned to baseline. That makes it easier for support and engineering to answer the same customer questions without re-reading the whole incident thread.\n\nI would also add a short owner note beside each follow-up item. The checklist is small, but ownership keeps the retry-window decision, alert tuning, and support macro from drifting into separate follow-up conversations.\n\nKeep the retry window enabled until the next deploy, then add a queue-depth alert as the long-term fix.\n\nThe alert should fire on sustained queue growth, not a single short spike."
  )

const visibilityMessages = visibilityChat.get()
const visibilityUserMessages = visibilityMessages.filter(
  (message) => message.role === "user"
)

function MessageScrollerVisibility() {
  return (
    <MessageScrollerProvider scrollMargin={12}>
      <div className="relative flex flex-col gap-4">
        <div className="relative mx-auto w-full max-w-sm">
          <Card className="h-140 w-full gap-0">
            <CardHeader className="gap-1 border-b">
              <CardTitle>Transcript Outline</CardTitle>
              <CardDescription>
                Track the current anchored turn.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <MessageScroller>
                <MessageScrollerViewport>
                  <MessageScrollerContent className="p-(--card-spacing)">
                    {visibilityMessages.map((message) => {
                      const isUserMessage = message.role === "user"
                      const text = getMessageText(message)

                      return (
                        <MessageScrollerItem
                          key={message.id}
                          messageId={message.id}
                          scrollAnchor={isUserMessage}
                        >
                          <Message align={isUserMessage ? "end" : "start"}>
                            <MessageContent>
                              <Bubble
                                variant={isUserMessage ? "muted" : "ghost"}
                              >
                                <BubbleContent className="space-y-2">
                                  {text
                                    .split(/\n\s*\n/)
                                    .map((paragraph) => paragraph.trim())
                                    .filter(Boolean)
                                    .map((paragraph, index) => (
                                      <p
                                        key={index}
                                        className="whitespace-pre-wrap"
                                      >
                                        {paragraph}
                                      </p>
                                    ))}
                                </BubbleContent>
                              </Bubble>
                            </MessageContent>
                          </Message>
                        </MessageScrollerItem>
                      )
                    })}
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton />
              </MessageScroller>
            </CardContent>
          </Card>
          <div className="absolute top-1/2 -right-12 -translate-y-1/2">
            <TranscriptOutline />
          </div>
        </div>
        <div className="mx-auto max-w-sm px-0.5 text-center text-xs text-muted-foreground">
          Open the outline to jump between anchored turns as you read.
        </div>
      </div>
    </MessageScrollerProvider>
  )
}

function TranscriptOutline() {
  const { scrollToMessage } = useMessageScroller()
  const { currentAnchorId } = useMessageScrollerVisibility()

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
        {visibilityUserMessages.map((message) => (
          <span
            key={message.id}
            data-current={message.id === currentAnchorId}
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
        {visibilityUserMessages.map((message) => (
          <button
            key={message.id}
            type="button"
            aria-current={
              currentAnchorId === message.id ? "location" : undefined
            }
            className="flex min-h-7 items-center rounded-xl px-2 py-1.5 text-left text-sm transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground aria-current:bg-accent aria-current:text-accent-foreground"
            onClick={() =>
              scrollToMessage(message.id, {
                align: "start",
                behavior: "smooth",
              })
            }
          >
            <span className="line-clamp-1 min-w-0">
              {getVisibilityTrimmedText(message)}
            </span>
          </button>
        ))}
      </HoverCardContent>
    </HoverCard>
  )
}

function getVisibilityTrimmedText(
  message: (typeof visibilityUserMessages)[number]
) {
  const text = getMessageText(message)

  return text.length > 42 ? `${text.slice(0, 39)}...` : text
}
