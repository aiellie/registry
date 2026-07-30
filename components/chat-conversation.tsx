"use client"

import {
  Copy01Icon,
  FileIcon,
  GitBranchIcon,
  PencilEdit02Icon,
  ReloadIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  VolumeHighIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { ChatDropdown } from "@/components/chat-dropdown"
import { Icons } from "@/components/icons"
import { useLocationHash } from "@/components/nav-chats"
import { PromptInput } from "@/components/prompt-input"
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import {
  Message,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/components/ui/message"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { Spinner } from "@/components/ui/spinner"
import {
  getTranscriptFromHash,
  type ChatAttachment,
  type ChatEntry,
  type ChatTranscript,
} from "@/lib/chat-data"
import { chatTypeIcons, teams } from "@/lib/sidebar-data"

const sidebarChats = teams.flatMap((team) => [
  ...(team.pinned ?? []),
  ...(team.chats ?? []),
])

/** The chat-nav row icon for this transcript's chat type. */
function chatIcon(id: string) {
  const chat = sidebarChats.find((item) => item.id === id)
  return chatTypeIcons[chat?.type ?? "chat"]
}

/** The transcript the current `#chat/<id>` hash points at, if any. */
export function useActiveChatTranscript() {
  return getTranscriptFromHash(useLocationHash())
}

/** The blank "Where should we start?" surface with the composer. */
export function ChatEmptyState() {
  return (
    <div className="flex min-h-full flex-col items-center px-4">
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-6 text-center">
          <Icons.elephant
            aria-hidden
            className="size-12 text-muted-foreground/40"
          />
          <div className="text-2xl tracking-tight text-balance">
            Where should we start?
          </div>
        </div>
      </div>
      <div className="w-full max-w-3xl pb-6">
        <PromptInput />
      </div>
    </div>
  )
}

/** A demo transcript in a message scroller with the composer pinned below. */
export function ChatConversation({
  transcript,
}: {
  transcript: ChatTranscript
}) {
  return (
    <MessageScrollerProvider>
      <div className="flex h-full min-h-0 flex-col">
        <Marker variant="border" className="px-4 py-2">
          <MarkerIcon>
            <HugeiconsIcon icon={chatIcon(transcript.id)} strokeWidth={2} />
          </MarkerIcon>
          <MarkerContent className="font-medium text-foreground">
            {transcript.title}
          </MarkerContent>
          <ChatDropdown />
        </Marker>
        <MessageScroller className="flex-1">
          <MessageScrollerViewport>
            <MessageScrollerContent className="mx-auto w-full max-w-3xl px-4 py-6">
              {transcript.entries.map((entry, index) => (
                <MessageScrollerItem
                  key={index}
                  scrollAnchor={
                    entry.kind === "message" && entry.role === "user"
                  }
                >
                  <ChatEntryView entry={entry} />
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
        <div className="mx-auto w-full max-w-3xl px-4 pb-6">
          <PromptInput />
        </div>
      </div>
    </MessageScrollerProvider>
  )
}

interface MessageAction {
  label: string
  icon: IconSvgElement
}

const userMessageActions: MessageAction[] = [
  { label: "Edit", icon: PencilEdit02Icon },
  { label: "Copy", icon: Copy01Icon },
]

const assistantMessageActions: MessageAction[] = [
  { label: "Regenerate", icon: ReloadIcon },
  { label: "Copy", icon: Copy01Icon },
  { label: "Like", icon: ThumbsUpIcon },
  { label: "Dislike", icon: ThumbsDownIcon },
  { label: "Branch", icon: GitBranchIcon },
  { label: "Read aloud", icon: VolumeHighIcon },
]

/** Icon actions in a message footer, revealed on message hover or focus. */
function MessageActions({ actions }: { actions: MessageAction[] }) {
  return (
    <>
      {actions.map((action) => (
        <Tooltip key={action.label}>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={action.label}
                className="text-muted-foreground opacity-0 transition-opacity group-focus-within/message:opacity-100 group-hover/message:opacity-100"
              />
            }
          >
            <HugeiconsIcon icon={action.icon} strokeWidth={2} />
          </TooltipTrigger>
          <TooltipContent side="bottom">{action.label}</TooltipContent>
        </Tooltip>
      ))}
    </>
  )
}

function ChatAttachmentView({ attachment }: { attachment: ChatAttachment }) {
  if (attachment.kind === "image") {
    return (
      <Attachment orientation="vertical">
        <AttachmentMedia variant="image">
          <img src={attachment.url} alt={attachment.name} />
        </AttachmentMedia>
      </Attachment>
    )
  }

  return (
    <Attachment size="sm">
      <AttachmentMedia>
        <HugeiconsIcon icon={attachment.icon ?? FileIcon} strokeWidth={2} />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>{attachment.name}</AttachmentTitle>
        {attachment.meta && (
          <AttachmentDescription>{attachment.meta}</AttachmentDescription>
        )}
      </AttachmentContent>
    </Attachment>
  )
}

function ChatEntryView({ entry }: { entry: ChatEntry }) {
  if (entry.kind === "marker") {
    return (
      <Message>
        <Marker
          variant={entry.variant ?? "default"}
          role={entry.spinner ? "status" : undefined}
        >
          {(entry.spinner || entry.icon) && (
            <MarkerIcon>
              {entry.spinner ? (
                <Spinner />
              ) : (
                entry.icon && (
                  <HugeiconsIcon icon={entry.icon} strokeWidth={2} />
                )
              )}
            </MarkerIcon>
          )}
          <MarkerContent>{entry.label}</MarkerContent>
        </Marker>
      </Message>
    )
  }

  const isUser = entry.role === "user"
  return (
    <Message align={isUser ? "end" : "start"}>
      <MessageContent>
        {entry.header && (
          <MessageHeader className={isUser ? "justify-end" : undefined}>
            {entry.header}
          </MessageHeader>
        )}
        {entry.attachments &&
          (entry.attachments.length > 1 ? (
            <AttachmentGroup className="max-w-[80%]">
              {entry.attachments.map((attachment) => (
                <ChatAttachmentView
                  key={attachment.name}
                  attachment={attachment}
                />
              ))}
            </AttachmentGroup>
          ) : (
            <ChatAttachmentView attachment={entry.attachments[0]} />
          ))}
        <Bubble variant={isUser ? "tinted" : "ghost"}>
          <BubbleContent
            className={entry.paragraphs.length > 1 ? "space-y-2" : undefined}
          >
            {entry.paragraphs.length > 1
              ? entry.paragraphs.map((paragraph, index) => (
                  <div key={index}>{paragraph}</div>
                ))
              : entry.paragraphs[0]}
          </BubbleContent>
        </Bubble>
        <MessageFooter className="gap-1">
          {entry.footer && <span className="me-1">{entry.footer}</span>}
          <MessageActions
            actions={isUser ? userMessageActions : assistantMessageActions}
          />
        </MessageFooter>
      </MessageContent>
    </Message>
  )
}
