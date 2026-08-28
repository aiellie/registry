"use client"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import {
  AlignBottomIcon,
  AnchorIcon,
  ArrowExpand01Icon,
  ArrowUp02Icon,
  ArrowUpDownIcon,
  EyeIcon,
  Image,
  Motion01Icon,
  MouseScroll01Icon,
  PaintBoardIcon,
  Paperclip,
  PinIcon,
  PlusSignIcon,
  RotateCw,
  RulerIcon,
  Search,
  Target02Icon,
  Telescope,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Icons } from "@/components/icons/icons"
import { getMessageText } from "@/lib/ai"
import { MessageAnimated } from "@/components/chat/message-animated"
import {
  CopyRow,
  DemoControls,
  Scrubber,
  SelectRow,
  SwitchRow,
  valuesAreDefault,
} from "@/components/canvasui/demo-controls"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ChatDropdown } from "@/components/chat-dropdown"
import { ChatsDropdown, DEMO_CHATS, type DemoChat } from "@/examples/chat/chats"

/* -------------------------------------------------------------------------- */
/*                              Scroller settings                             */
/*                                                                            */
/*  Every prop the message-scroller parts accept, wired to the floating       */
/*  DemoControls panel: MessageScrollerProvider (autoScroll,                  */
/*  defaultScrollPosition, scrollMargin, scrollPreviousItemPeek,              */
/*  scrollEdgeThreshold), MessageScrollerViewport (preserveScrollOnPrepend),  */
/*  MessageScrollerItem (scrollAnchor, via the role picker), and              */
/*  MessageScrollerButton (direction, behavior, variant, size).              */
/* -------------------------------------------------------------------------- */

type ScrollPosition = "start" | "end" | "last-anchor"
type AnchorRole = "user" | "assistant" | "none"
type ButtonDirection = "start" | "end"
type ButtonVariant =
  "default" | "secondary" | "outline" | "ghost" | "accent" | "destructive"
type ButtonSize = "icon-xs" | "icon-sm" | "icon" | "icon-lg"

const SCROLL_POSITION_OPTIONS: { value: ScrollPosition; label: string }[] = [
  { value: "start", label: "start" },
  { value: "end", label: "end" },
  { value: "last-anchor", label: "last-anchor" },
]

const ANCHOR_ROLE_OPTIONS: { value: AnchorRole; label: string }[] = [
  { value: "user", label: "user" },
  { value: "assistant", label: "assistant" },
  { value: "none", label: "none" },
]

const DIRECTION_OPTIONS: { value: ButtonDirection; label: string }[] = [
  { value: "start", label: "start" },
  { value: "end", label: "end" },
]

const BEHAVIOR_OPTIONS: { value: ScrollBehavior; label: string }[] = [
  { value: "smooth", label: "smooth" },
  { value: "instant", label: "instant" },
  { value: "auto", label: "auto" },
]

const VARIANT_OPTIONS: { value: ButtonVariant; label: string }[] = [
  { value: "secondary", label: "secondary" },
  { value: "default", label: "default" },
  { value: "outline", label: "outline" },
  { value: "ghost", label: "ghost" },
  { value: "accent", label: "accent" },
  { value: "destructive", label: "destructive" },
]

const SIZE_OPTIONS: { value: ButtonSize; label: string }[] = [
  { value: "icon-xs", label: "icon-xs" },
  { value: "icon-sm", label: "icon-sm" },
  { value: "icon", label: "icon" },
  { value: "icon-lg", label: "icon-lg" },
]

type ScrollerSettings = {
  autoScroll: boolean
  defaultScrollPosition: ScrollPosition
  scrollMargin: number
  scrollPreviousItemPeek: number
  scrollEdgeThreshold: number
  preserveScrollOnPrepend: boolean
  anchorRole: AnchorRole
  buttonDirection: ButtonDirection
  buttonBehavior: ScrollBehavior
  buttonVariant: ButtonVariant
  buttonSize: ButtonSize
}

const DEFAULT_SETTINGS: ScrollerSettings = {
  autoScroll: true,
  defaultScrollPosition: "end",
  scrollMargin: 0,
  scrollPreviousItemPeek: 64,
  scrollEdgeThreshold: 8,
  preserveScrollOnPrepend: true,
  anchorRole: "user",
  buttonDirection: "end",
  buttonBehavior: "smooth",
  buttonVariant: "secondary",
  buttonSize: "icon-sm",
}

function SettingsGroup({ label }: { label: string }) {
  return (
    <p className="px-1 pt-2 text-[11px] font-semibold tracking-wide text-muted-foreground/70 uppercase select-none first:pt-0.5">
      {label}
    </p>
  )
}

function ChatCard({
  demoChat,
  settings,
  onSelectChat,
}: {
  demoChat: DemoChat
  settings: ScrollerSettings
  onSelectChat: (id: string) => void
}) {
  const [title, setTitle] = useState(demoChat.title)
  const { messages, sendMessage, status, setMessages, regenerate } = useChat({
    messages: demoChat.initialMessages,
    transport: demoChat.transport,
  })
  const nextMessage = demoChat.chat.next({ after: messages })
  const isBusy = status === "submitted" || status === "streaming"
  // Only the message currently being streamed hides its actions; earlier
  // messages stay actionable while the reply types out.
  const streamingMessageId =
    status === "streaming" ? messages[messages.length - 1]?.id : undefined
  const hasChanges =
    title !== demoChat.title ||
    messages.length !== demoChat.initialMessages.length

  // defaultScrollPosition only applies on mount, so changing it remounts the
  // scroller at the freshly picked position.
  return (
    <MessageScrollerProvider
      key={settings.defaultScrollPosition}
      autoScroll={settings.autoScroll}
      defaultScrollPosition={settings.defaultScrollPosition}
      scrollEdgeThreshold={settings.scrollEdgeThreshold}
      scrollMargin={settings.scrollMargin}
      scrollPreviousItemPeek={settings.scrollPreviousItemPeek}
    >
      <div className="relative mx-auto flex min-h-dvh w-xl max-w-full flex-col justify-center gap-4 p-6">
        <Card className="h-140 w-full gap-0 rounded-3xl p-0 shadow-sm">
          <CardHeader className="flex items-center gap-1 border-b p-3!">
            <ChatsDropdown
              activeId={demoChat.id}
              onSelect={onSelectChat}
              className="-ms-1.5"
            />
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              aria-label="Chat title"
              placeholder="Untitled chat"
              className="field-sizing-content max-w-48 min-w-14 shrink rounded-md px-1.5 py-1 text-sm font-medium text-muted-foreground transition-colors outline-none placeholder:text-muted-foreground/60 hover:bg-muted/50 hover:text-foreground focus-visible:bg-muted/50 focus-visible:text-foreground"
            />
            <ChatDropdown />
            <CardAction className="ms-auto">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="outline"
                      size="icon-sm"
                      aria-label="Reset conversation"
                      onClick={() => {
                        setMessages(demoChat.initialMessages)
                        setTitle(demoChat.title)
                      }}
                      disabled={isBusy || !hasChanges}
                    >
                      <HugeiconsIcon icon={RotateCw} />
                    </Button>
                  }
                />
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
                    <Icons.elephant />
                  </EmptyMedia>
                  <EmptyTitle>Morning, Ellie!</EmptyTitle>
                  <EmptyDescription>
                    What are we working on today? Press send to start a new
                    conversation
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <MessageScroller>
                <MessageScrollerViewport
                  preserveScrollOnPrepend={settings.preserveScrollOnPrepend}
                >
                  <MessageScrollerContent
                    aria-busy={isBusy}
                    className="p-(--card-spacing)"
                  >
                    {messages.map((message) => (
                      <MessageAnimated
                        key={message.id}
                        message={message}
                        isStreaming={message.id === streamingMessageId}
                        scrollAnchor={
                          settings.anchorRole !== "none" &&
                          message.role === settings.anchorRole
                        }
                        onAction={(action) => {
                          if (action.label === "Regenerate" && !isBusy) {
                            void regenerate({ messageId: message.id })
                          }
                        }}
                      />
                    ))}
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton
                  direction={settings.buttonDirection}
                  behavior={settings.buttonBehavior}
                  variant={settings.buttonVariant}
                  size={settings.buttonSize}
                />
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
              <InputGroup className="rounded-xl">
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
                    <DropdownMenuTrigger
                      render={
                        <InputGroupButton
                          aria-label="Add files"
                          type="button"
                          size="icon-xs"
                          variant="outline"
                        >
                          <HugeiconsIcon icon={PlusSignIcon} />
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
                        <HugeiconsIcon icon={Image} />
                        Create Image
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <HugeiconsIcon icon={Telescope} />
                        Deep Research
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <HugeiconsIcon icon={Search} />
                        Web Search
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <InputGroupButton
                    type="submit"
                    variant="default"
                    size="icon-xs"
                    disabled={!nextMessage || isBusy}
                    className="ml-auto"
                  >
                    <HugeiconsIcon icon={ArrowUp02Icon} />
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

export function MessageScrollerDemo() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [activeChatId, setActiveChatId] = useState(DEMO_CHATS[0].id)
  const activeChat =
    DEMO_CHATS.find((demoChat) => demoChat.id === activeChatId) ?? DEMO_CHATS[0]

  const update = (patch: Partial<ScrollerSettings>) =>
    setSettings((prev) => ({ ...prev, ...patch }))

  return (
    <>
      {/* Keyed by chat so picking another conversation remounts useChat with
          that script's own messages and transport. */}
      <ChatCard
        key={activeChat.id}
        demoChat={activeChat}
        settings={settings}
        onSelectChat={setActiveChatId}
      />
      <DemoControls
        title="Scroller settings"
        isDefault={valuesAreDefault(settings, DEFAULT_SETTINGS)}
        onReset={() => setSettings(DEFAULT_SETTINGS)}
        footer={
          <CopyRow
            label="Copy settings"
            toastMessage="Scroller settings copied to clipboard"
            value={() => JSON.stringify(settings, null, 2)}
          />
        }
      >
        <SettingsGroup label="Provider" />
        <SwitchRow
          label="autoScroll"
          icon={MouseScroll01Icon}
          checked={settings.autoScroll}
          onCheckedChange={(autoScroll) => update({ autoScroll })}
        />
        <SelectRow
          label="defaultScrollPosition"
          icon={Target02Icon}
          options={SCROLL_POSITION_OPTIONS}
          value={settings.defaultScrollPosition}
          onValueChange={(defaultScrollPosition) =>
            update({ defaultScrollPosition })
          }
        />
        <Scrubber
          label="scrollMargin"
          icon={RulerIcon}
          min={0}
          max={64}
          step={1}
          decimals={0}
          value={settings.scrollMargin}
          onValueChange={(scrollMargin) => update({ scrollMargin })}
        />
        <Scrubber
          label="scrollPreviousItemPeek"
          icon={EyeIcon}
          min={0}
          max={128}
          step={1}
          decimals={0}
          value={settings.scrollPreviousItemPeek}
          onValueChange={(scrollPreviousItemPeek) =>
            update({ scrollPreviousItemPeek })
          }
        />
        <Scrubber
          label="scrollEdgeThreshold"
          icon={AlignBottomIcon}
          min={0}
          max={64}
          step={1}
          decimals={0}
          value={settings.scrollEdgeThreshold}
          onValueChange={(scrollEdgeThreshold) =>
            update({ scrollEdgeThreshold })
          }
        />
        <SettingsGroup label="Viewport" />
        <SwitchRow
          label="preserveScrollOnPrepend"
          icon={PinIcon}
          checked={settings.preserveScrollOnPrepend}
          onCheckedChange={(preserveScrollOnPrepend) =>
            update({ preserveScrollOnPrepend })
          }
        />
        <SettingsGroup label="Item" />
        <SelectRow
          label="scrollAnchor"
          icon={AnchorIcon}
          options={ANCHOR_ROLE_OPTIONS}
          value={settings.anchorRole}
          onValueChange={(anchorRole) => update({ anchorRole })}
        />
        <SettingsGroup label="Button" />
        <SelectRow
          label="direction"
          icon={ArrowUpDownIcon}
          options={DIRECTION_OPTIONS}
          value={settings.buttonDirection}
          onValueChange={(buttonDirection) => update({ buttonDirection })}
        />
        <SelectRow
          label="behavior"
          icon={Motion01Icon}
          options={BEHAVIOR_OPTIONS}
          value={settings.buttonBehavior}
          onValueChange={(buttonBehavior) => update({ buttonBehavior })}
        />
        <SelectRow
          label="variant"
          icon={PaintBoardIcon}
          options={VARIANT_OPTIONS}
          value={settings.buttonVariant}
          onValueChange={(buttonVariant) => update({ buttonVariant })}
        />
        <SelectRow
          label="size"
          icon={ArrowExpand01Icon}
          options={SIZE_OPTIONS}
          value={settings.buttonSize}
          onValueChange={(buttonSize) => update({ buttonSize })}
        />
      </DemoControls>
    </>
  )
}
