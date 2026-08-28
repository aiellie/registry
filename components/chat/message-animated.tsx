"use client"

import * as React from "react"
import {
  BotIcon,
  Copy01Icon,
  GitBranchIcon,
  Edit02Icon,
  ReloadIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Tick02Icon,
  UserIcon,
  VolumeHighIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
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
import { toast } from "@/components/ui/toast"
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
  { label: "Edit", icon: Edit02Icon },
  { label: "Copy", icon: Copy01Icon },
  { label: "Branch", icon: GitBranchIcon },
]

const ASSISTANT_MESSAGE_ACTIONS: MessageAnimatedAction[] = [
  { label: "Regenerate", icon: ReloadIcon },
  { label: "Copy", icon: Copy01Icon },
  { label: "Like", icon: ThumbsUpIcon },
  { label: "Dislike", icon: ThumbsDownIcon },
  { label: "Read aloud", icon: VolumeHighIcon },
]

const MotionMessageScrollerItem = motion.create(MessageScrollerItem)

function MessageAnimated({
  message,
  animationPreset = MESSAGE_ANIMATIONS["slide-up"],
  assistantActions = ASSISTANT_MESSAGE_ACTIONS,
  assistantAvatar,
  assistantVariant = "muted",
  isStreaming = false,
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
  isStreaming?: boolean
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
          isStreaming={isStreaming}
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
        isStreaming={isStreaming}
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
  isStreaming,
  onAction,
  userActions,
  userAvatar,
  userVariant,
}: {
  assistantActions: MessageAnimatedAction[]
  assistantAvatar?: React.ReactNode
  assistantVariant: React.ComponentProps<typeof Bubble>["variant"]
  isStreaming?: boolean
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
  const [copied, setCopied] = React.useState(false)
  const [feedback, setFeedback] = React.useState<"like" | "dislike" | null>(
    null
  )
  const copiedTimeoutRef = React.useRef<number | undefined>(undefined)

  React.useEffect(() => {
    return () => window.clearTimeout(copiedTimeoutRef.current)
  }, [])

  const handleAction = (action: MessageAnimatedAction) => {
    if (action.label === "Copy") {
      void navigator.clipboard
        ?.writeText(textParts.map((part) => part.text).join("\n\n"))
        .catch(() => {})
      setCopied(true)
      window.clearTimeout(copiedTimeoutRef.current)
      copiedTimeoutRef.current = window.setTimeout(() => setCopied(false), 2000)
      toast.add({ title: "Copied to clipboard", type: "success" })
    }
    if (action.label === "Like" || action.label === "Dislike") {
      const value = action.label === "Like" ? "like" : "dislike"
      const next = feedback === value ? null : value
      setFeedback(next)
      if (next === "like") {
        toast.add({ title: "Marked as helpful", type: "success" })
      } else if (next === "dislike") {
        toast.add({ title: "Marked as not helpful", type: "error" })
      }
    }
    onAction?.(action, message)
  }

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
        {actions.length > 0 && !isStreaming && (
          <MessageFooter className="gap-1">
            {actions.map((action) => {
              const isCopied = copied && action.label === "Copy"
              const isLiked = feedback === "like" && action.label === "Like"
              const isDisliked =
                feedback === "dislike" && action.label === "Dislike"
              const isFeedbackAction =
                action.label === "Like" || action.label === "Dislike"

              return (
                <Tooltip key={action.label}>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={action.label}
                        aria-pressed={
                          isFeedbackAction ? isLiked || isDisliked : undefined
                        }
                        onClick={() => handleAction(action)}
                        className={cn(
                          "text-muted-foreground opacity-0 transition-opacity group-focus-within/message:opacity-100 group-hover/message:opacity-100",
                          (isCopied || isLiked || isDisliked) && "opacity-100",
                          isLiked && "text-success hover:text-success",
                          isDisliked &&
                            "text-destructive hover:text-destructive"
                        )}
                      />
                    }
                  >
                    <HugeiconsIcon
                      icon={isCopied ? Tick02Icon : action.icon}
                      strokeWidth={2}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    {isCopied ? "Copied" : action.label}
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </MessageFooter>
        )}
      </MessageContent>
    </Message>
  )
}

function MessageAnimatedRoleAvatar({ role }: { role: "user" | "assistant" }) {
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
