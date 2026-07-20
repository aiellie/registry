import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "@/components/ui/bubble"

export const bubble = {
  name: "bubble",
  components: {
    Conversation: (
      <div className="flex w-full items-center justify-center p-6">
        <BubbleGroup className="w-full max-w-sm">
          <Bubble variant="muted">
            <BubbleContent>
              Hey! Are we still on for lunch tomorrow?
            </BubbleContent>
          </Bubble>
          <Bubble align="end">
            <BubbleContent>Absolutely — noon at the usual spot?</BubbleContent>
          </Bubble>
          <Bubble variant="muted">
            <BubbleContent>Perfect, see you there.</BubbleContent>
          </Bubble>
        </BubbleGroup>
      </div>
    ),
    Variants: (
      <div className="flex w-full items-center justify-center p-6">
        <BubbleGroup className="w-full max-w-sm">
          <Bubble variant="secondary">
            <BubbleContent>Secondary bubble</BubbleContent>
          </Bubble>
          <Bubble variant="tinted">
            <BubbleContent>Tinted bubble</BubbleContent>
          </Bubble>
          <Bubble variant="outline">
            <BubbleContent>Outline bubble</BubbleContent>
          </Bubble>
          <Bubble variant="destructive">
            <BubbleContent>Destructive bubble</BubbleContent>
          </Bubble>
          <Bubble variant="ghost">
            <BubbleContent>
              Ghost bubble renders as plain text, useful for assistant replies
              that should read like a document.
            </BubbleContent>
          </Bubble>
        </BubbleGroup>
      </div>
    ),
    "Reactions & Interactive": (
      <div className="flex w-full items-center justify-center p-6">
        <BubbleGroup className="w-full max-w-sm gap-4">
          <Bubble variant="muted" className="mb-2">
            <BubbleContent>
              Just shipped the new landing page! 🚀
            </BubbleContent>
            <BubbleReactions>
              <span>🎉</span>
              <span>❤️</span>
              <span className="text-xs text-muted-foreground">4</span>
            </BubbleReactions>
          </Bubble>
          <Bubble align="end">
            <BubbleContent render={<button type="button" />}>
              This bubble is a button — hover or focus me
            </BubbleContent>
          </Bubble>
        </BubbleGroup>
      </div>
    ),
  },
}
