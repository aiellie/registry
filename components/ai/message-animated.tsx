"use client"

import * as React from "react"
import { BotIcon, UserIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { motion, useReducedMotion } from "motion/react"

import type { MessageAnimationPreset } from "@/lib/message-animations"
import { MESSAGE_ANIMATIONS } from "@/lib/message-animations"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message"
import { MessageScrollerItem } from "@/components/ui/message-scroller"

type MessageAnimatedPart = {
  type: string
  text?: string
}

type MessageAnimatedMessage = {
  id: string
  role: string
  text?: string
  parts?: ReadonlyArray<MessageAnimatedPart>
}

type MessageAnimatedTextPart = {
  key: string
  text: string
}

const MotionMessageScrollerItem = motion.create(MessageScrollerItem)

function MessageAnimated({
  message,
  animationPreset = MESSAGE_ANIMATIONS["slide-up"],
  assistantAvatar,
  assistantVariant = "muted",
  scrollAnchor,
  userAvatar,
  userVariant = "default",
  ...props
}: Omit<
  React.ComponentProps<typeof MotionMessageScrollerItem>,
  "animate" | "children" | "exit" | "initial" | "messageId" | "variants"
> & {
  animationPreset?: MessageAnimationPreset
  assistantAvatar?: React.ReactNode
  assistantVariant?: React.ComponentProps<typeof Bubble>["variant"]
  message: MessageAnimatedMessage
  userAvatar?: React.ReactNode
  userVariant?: React.ComponentProps<typeof Bubble>["variant"]
}) {
  const shouldReduceMotion = useReducedMotion()
  const isUserMessage = message.role === "user"

  if (isUserMessage) {
    return (
      <MotionMessageScrollerItem
        messageId={message.id}
        scrollAnchor={scrollAnchor ?? true}
        variants={animationPreset.variants}
        initial={shouldReduceMotion ? false : "initial"}
        animate="animate"
        exit={shouldReduceMotion ? undefined : "exit"}
        {...props}
      >
        <MessageAnimatedRow
          message={message}
          assistantAvatar={assistantAvatar}
          assistantVariant={assistantVariant}
          userAvatar={userAvatar}
          userVariant={userVariant}
        />
      </MotionMessageScrollerItem>
    )
  }

  return (
    <MotionMessageScrollerItem
      messageId={message.id}
      scrollAnchor={scrollAnchor}
      initial={false}
      {...props}
    >
      <MessageAnimatedRow
        message={message}
        assistantAvatar={assistantAvatar}
        assistantVariant={assistantVariant}
        userAvatar={userAvatar}
        userVariant={userVariant}
      />
    </MotionMessageScrollerItem>
  )
}

function MessageAnimatedRow({
  message,
  assistantAvatar,
  assistantVariant,
  userAvatar,
  userVariant,
}: {
  assistantAvatar?: React.ReactNode
  assistantVariant: React.ComponentProps<typeof Bubble>["variant"]
  message: MessageAnimatedMessage
  userAvatar?: React.ReactNode
  userVariant: React.ComponentProps<typeof Bubble>["variant"]
}) {
  const isUserMessage = message.role === "user"
  const textParts = getMessageAnimatedTextParts(message)
  const avatar =
    (isUserMessage ? userAvatar : assistantAvatar) ??
    (isUserMessage ? (
      <MessageAnimatedRoleAvatar role="user" />
    ) : (
      <MessageAnimatedRoleAvatar role="assistant" />
    ))

  return (
    <Message align={isUserMessage ? "end" : "start"}>
      <MessageAvatar>{avatar}</MessageAvatar>
      <MessageContent>
        {textParts.map((part) => {
          const paragraphs = part.text
            .split(/\n\s*\n/)
            .map((paragraph) => paragraph.trim())
            .filter(Boolean)

          return (
            <Bubble
              key={part.key}
              variant={isUserMessage ? userVariant : assistantVariant}
            >
              <BubbleContent className="space-y-2">
                {paragraphs.map((paragraph, paragraphIndex) => (
                  <p
                    key={`${part.key}-${paragraphIndex}`}
                    className="whitespace-pre-wrap"
                  >
                    {paragraph}
                  </p>
                ))}
              </BubbleContent>
            </Bubble>
          )
        })}
      </MessageContent>
    </Message>
  )
}

function MessageAnimatedRoleAvatar({
  role,
}: {
  role: "user" | "assistant"
}) {
  return (
    <Avatar>
      <AvatarFallback>
        <HugeiconsIcon
          icon={role === "user" ? UserIcon : BotIcon}
          className="size-4"
          strokeWidth={2}
        />
      </AvatarFallback>
    </Avatar>
  )
}

function getMessageAnimatedTextParts(
  message: MessageAnimatedMessage
): MessageAnimatedTextPart[] {
  if (message.parts) {
    return message.parts.flatMap((part, index) => {
      if (part.type !== "text" || typeof part.text !== "string") {
        return []
      }

      return [{ key: `${message.id}-${index}`, text: part.text }]
    })
  }

  return typeof message.text === "string"
    ? [{ key: `${message.id}-text`, text: message.text }]
    : []
}

export { MessageAnimated, type MessageAnimatedMessage }
