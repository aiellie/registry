import { HugeiconsIcon } from "@hugeicons/react"
import { SparklesIcon } from "@hugeicons/core-free-icons"

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@/components/ui/message"

export const message = {
  name: "message",
  components: {
    Conversation: (
      <div className="flex w-full items-center justify-center p-6">
        <MessageGroup className="w-full max-w-sm">
          <Message>
            <MessageAvatar>
              <span className="flex size-8 items-center justify-center text-xs font-medium">
                AK
              </span>
            </MessageAvatar>
            <MessageContent>
              <MessageHeader>Ava King</MessageHeader>
              <Bubble variant="muted">
                <BubbleContent>
                  Morning! Did you get a chance to review the design draft?
                </BubbleContent>
              </Bubble>
              <MessageFooter>10:02 AM</MessageFooter>
            </MessageContent>
          </Message>
          <Message align="end">
            <MessageContent>
              <Bubble align="end">
                <BubbleContent>
                  Yes — left a few comments. Overall it looks great!
                </BubbleContent>
              </Bubble>
              <MessageFooter>Read 10:05 AM</MessageFooter>
            </MessageContent>
          </Message>
        </MessageGroup>
      </div>
    ),
    Assistant: (
      <div className="flex w-full items-center justify-center p-6">
        <MessageGroup className="w-full max-w-sm">
          <Message align="end">
            <MessageContent>
              <Bubble align="end">
                <BubbleContent>What is a design token?</BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
          <Message>
            <MessageAvatar className="self-start">
              <span className="flex size-8 items-center justify-center">
                <HugeiconsIcon
                  icon={SparklesIcon}
                  strokeWidth={2}
                  className="size-4"
                />
              </span>
            </MessageAvatar>
            <MessageContent>
              <Bubble variant="ghost">
                <BubbleContent>
                  A design token is a named value — like a color, spacing unit,
                  or font size — that stores a design decision so it can be
                  reused consistently across platforms and themes.
                </BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
        </MessageGroup>
      </div>
    ),
  },
}
