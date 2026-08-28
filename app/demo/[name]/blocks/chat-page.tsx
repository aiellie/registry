"use client"

import {
  ChatConversation,
  ChatEmptyState,
  useActiveChatTranscript,
} from "@/components/chat-conversation"
import { useLocationHash } from "@/components/nav-chats"
import { chatTranscripts } from "@/lib/chat-data"

/** Shown before any sidebar chat is clicked. */
const DEFAULT_CHAT_ID = "design-tokens-sync"

export default function ChatPage() {
  const hash = useLocationHash()
  const active = useActiveChatTranscript()
  // No hash yet means nothing was clicked: open on the default transcript.
  // "New Chat" (#chat) and unknown ids fall through to the empty state.
  const transcript =
    active ?? (hash === null ? chatTranscripts[DEFAULT_CHAT_ID] : null)

  if (transcript) {
    return <ChatConversation key={transcript.id} transcript={transcript} />
  }

  return <ChatEmptyState />
}
