"use client"

import * as React from "react"

import { Globe02Icon, MessageMultiple01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  FindInPage,
  FindInPageAction,
  FindInPageActions,
  FindInPageBar,
  FindInPageClose,
  FindInPageInput,
  FindInPageResults,
  FindInPageSeparator,
  useFindInPage,
} from "@/components/ai-elements/find-in-page"
import { Button } from "@/components/ui/button"

const ARTICLE = [
  "A design system is a shared language. It survives when the tokens, the components and the documentation move together — and it rots the moment any one of them drifts.",
  "Tokens are the smallest unit of that language. A colour token is not a colour; it is a promise that every surface using it will change together the next time the brand does.",
  "Components turn tokens into behaviour. A button is a token arrangement plus the states nobody remembers to design: hover, focus, disabled, loading, and the long tail of the keyboard.",
]

/**
 * `useFindInPage` searches a DOM subtree with the CSS Custom Highlight API,
 * so matches are painted without touching the markup being searched.
 */
export function FindInPageDemo() {
  const articleRef = React.useRef<HTMLDivElement>(null)
  const [open, setOpen] = React.useState(true)
  const find = useFindInPage(articleRef)

  return (
    <div className="flex w-full max-w-sm flex-col gap-4 py-6">
      {open ? (
        <FindInPage
          {...find}
          onClose={() => {
            find.onClose()
            setOpen(false)
          }}
        >
          <FindInPageBar>
            <FindInPageInput />
            <FindInPageActions>
              <FindInPageAction
                aria-label="Ask about this page"
                className="disabled:opacity-100"
                disabled
              >
                <HugeiconsIcon
                  className="size-4"
                  icon={MessageMultiple01Icon}
                  strokeWidth={2}
                />
              </FindInPageAction>
              <FindInPageAction
                aria-label="Search the web"
                className="disabled:opacity-100"
                disabled
              >
                <HugeiconsIcon
                  className="size-4"
                  icon={Globe02Icon}
                  strokeWidth={2}
                />
              </FindInPageAction>
              <FindInPageSeparator />
              <FindInPageClose />
            </FindInPageActions>
          </FindInPageBar>
          <FindInPageResults />
        </FindInPage>
      ) : (
        <Button
          className="self-start"
          onClick={() => setOpen(true)}
          size="sm"
          variant="outline"
        >
          Open find bar
        </Button>
      )}

      <div
        className="flex flex-col gap-3 text-sm leading-relaxed"
        ref={articleRef}
      >
        {ARTICLE.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        Try <code>design</code> or <code>token</code>. Enter and Shift+Enter
        step through matches, Escape closes the bar.
      </p>
    </div>
  )
}
