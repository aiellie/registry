"use client"

import * as React from "react"

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"

type DemoMessage = {
  id: number
  from: "me" | "them"
  text: string
}

const initialMessages: DemoMessage[] = [
  { id: 1, from: "them", text: "Hey! How is the release coming along?" },
  { id: 2, from: "me", text: "Almost there — wrapping up the changelog." },
  { id: 3, from: "them", text: "Nice. Any blockers I should know about?" },
  { id: 4, from: "me", text: "Just waiting on the final QA pass." },
  { id: 5, from: "them", text: "QA signed off an hour ago 🎉" },
  { id: 6, from: "me", text: "Perfect, then we can ship this afternoon." },
  { id: 7, from: "them", text: "Sounds good. I will prep the announcement." },
  { id: 8, from: "me", text: "Great — I will tag the release once CI is green." },
  { id: 9, from: "them", text: "Scroll up to see the history, then use the button to jump back down." },
]

const cannedReplies: string[] = [
  "New message — the scroller keeps you pinned to the end.",
  "Another one! Auto-scroll only runs while you are at the bottom.",
  "Scroll up first, then add a message to see the difference.",
  "The floating button brings you back to the latest message.",
]

export function MessageScrollerDemo() {
  const [messages, setMessages] = React.useState<DemoMessage[]>(initialMessages)

  function addMessage() {
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        from: prev.length % 2 === 0 ? "them" : "me",
        text: cannedReplies[(prev.length - initialMessages.length) % cannedReplies.length],
      },
    ])
  }

  return (
    <div className="flex h-96 w-full max-w-sm flex-col gap-3">
      <MessageScrollerProvider autoScroll defaultScrollPosition="end">
        <MessageScroller className="flex-1 rounded-xl border">
          <MessageScrollerViewport className="p-4">
            <MessageScrollerContent className="gap-2">
              {messages.map((m) => (
                <MessageScrollerItem
                  key={m.id}
                  messageId={`message-${m.id}`}
                  className="flex flex-col"
                >
                  <Bubble
                    align={m.from === "me" ? "end" : "start"}
                    variant={m.from === "me" ? "default" : "muted"}
                  >
                    <BubbleContent>{m.text}</BubbleContent>
                  </Bubble>
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
      <Button variant="outline" onClick={addMessage}>
        Add message
      </Button>
    </div>
  )
}
