"use client"

import {
  ChatConversation,
  ChatEmptyState,
  useActiveChatTranscript,
} from "@/components/chat-conversation"

export default function NewChatPage() {
  const transcript = useActiveChatTranscript()

  if (transcript) {
    return <ChatConversation key={transcript.id} transcript={transcript} />
  }

  return <ChatEmptyState />
}
