"use client"

import * as React from "react"
import {
  BotIcon,
  Copy01Icon,
  GitBranchIcon,
  PencilEdit02Icon,
  ReloadIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  UserIcon,
  VolumeHighIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { motion, useReducedMotion } from "motion/react"

import type { MessageAnimationPreset } from "@/lib/message-animations"
import { MESSAGE_ANIMATIONS } from "@/lib/message-animations"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
} from "@/components/ui/message"
import { MessageScrollerItem } from "@/components/ui/message-scroller"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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

type MessageAnimatedAction = {
  label: string
  icon: IconSvgElement
}

const USER_MESSAGE_ACTIONS: MessageAnimatedAction[] = [
  { label: "Edit", icon: PencilEdit02Icon },
  { label: "Copy", icon: Copy01Icon },
]

const ASSISTANT_MESSAGE_ACTIONS: MessageAnimatedAction[] = [
  { label: "Regenerate", icon: ReloadIcon },
  { label: "Copy", icon: Copy01Icon },
  { label: "Like", icon: ThumbsUpIcon },
  { label: "Dislike", icon: ThumbsDownIcon },
  { label: "Branch", icon: GitBranchIcon },
  { label: "Read aloud", icon: VolumeHighIcon },
]

const MotionMessageScrollerItem = motion.create(MessageScrollerItem)

function MessageAnimated({
  message,
  animationPreset = MESSAGE_ANIMATIONS["slide-up"],
  assistantActions = ASSISTANT_MESSAGE_ACTIONS,
  assistantAvatar,
  assistantVariant = "muted",
  onAction,
  scrollAnchor,
  userActions = USER_MESSAGE_ACTIONS,
  userAvatar,
  userVariant = "default",
  ...props
}: Omit<
  React.ComponentProps<typeof MotionMessageScrollerItem>,
  "animate" | "children" | "exit" | "initial" | "messageId" | "variants"
> & {
  animationPreset?: MessageAnimationPreset
  assistantActions?: MessageAnimatedAction[]
  assistantAvatar?: React.ReactNode
  assistantVariant?: React.ComponentProps<typeof Bubble>["variant"]
  message: MessageAnimatedMessage
  onAction?: (
    action: MessageAnimatedAction,
    message: MessageAnimatedMessage
  ) => void
  userActions?: MessageAnimatedAction[]
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
          assistantActions={assistantActions}
          assistantAvatar={assistantAvatar}
          assistantVariant={assistantVariant}
          onAction={onAction}
          userActions={userActions}
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
        assistantActions={assistantActions}
        assistantAvatar={assistantAvatar}
        assistantVariant={assistantVariant}
        onAction={onAction}
        userActions={userActions}
        userAvatar={userAvatar}
        userVariant={userVariant}
      />
    </MotionMessageScrollerItem>
  )
}

function MessageAnimatedRow({
  message,
  assistantActions,
  assistantAvatar,
  assistantVariant,
  onAction,
  userActions,
  userAvatar,
  userVariant,
}: {
  assistantActions: MessageAnimatedAction[]
  assistantAvatar?: React.ReactNode
  assistantVariant: React.ComponentProps<typeof Bubble>["variant"]
  message: MessageAnimatedMessage
  onAction?: (
    action: MessageAnimatedAction,
    message: MessageAnimatedMessage
  ) => void
  userActions: MessageAnimatedAction[]
  userAvatar?: React.ReactNode
  userVariant: React.ComponentProps<typeof Bubble>["variant"]
}) {
  const isUserMessage = message.role === "user"
  const textParts = getMessageAnimatedTextParts(message)
  const actions = isUserMessage ? userActions : assistantActions
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
        {actions.length > 0 && (
          <MessageFooter className="gap-1">
            {actions.map((action) => (
              <Tooltip key={action.label}>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={action.label}
                      onClick={() => onAction?.(action, message)}
                      className="text-muted-foreground opacity-0 transition-opacity group-focus-within/message:opacity-100 group-hover/message:opacity-100"
                    />
                  }
                >
                  <HugeiconsIcon icon={action.icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent side="bottom">{action.label}</TooltipContent>
              </Tooltip>
            ))}
          </MessageFooter>
        )}
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

export {
  MessageAnimated,
  type MessageAnimatedAction,
  type MessageAnimatedMessage,
}
