"use client"

import { HugeiconsIcon } from "@hugeicons/react"

import { Icons } from "@/components/icons"
import { useLocationHash } from "@/components/nav-chats"
import { PromptInput } from "@/components/prompt-input"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import {
  Message,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/components/ui/message"
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
  type ChatEntry,
  type ChatTranscript,
} from "@/lib/chat-data"

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
        <MessageScroller className="flex-1">
          <MessageScrollerViewport>
            <MessageScrollerContent className="mx-auto w-full max-w-3xl px-4 py-6">
              <Marker variant="border">
                <MarkerContent className="font-medium text-foreground">
                  {transcript.title}
                </MarkerContent>
              </Marker>
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
        {entry.footer && <MessageFooter>{entry.footer}</MessageFooter>}
      </MessageContent>
    </Message>
  )
}
