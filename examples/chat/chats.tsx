"use client"

import {
  Comment02Icon,
  Globe02Icon,
  PaintBoardIcon,
  Rocket01Icon,
  SourceCodeIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { createChat } from "@/lib/ai"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type DemoChatApi = ReturnType<typeof createChat>

export interface DemoChat {
  id: string
  title: string
  icon: IconSvgElement
  chat: DemoChatApi
  initialMessages: ReturnType<DemoChatApi["get"]>
  transport: ReturnType<DemoChatApi["transport"]>
}

function defineChat(options: {
  id: string
  title: string
  icon: IconSvgElement
  /** How many scripted messages are already on screen when the chat opens. */
  visibleMessages: number
  build: (chat: DemoChatApi) => void
}): DemoChat {
  const chat = createChat({ messageIdPrefix: options.id })
  options.build(chat)

  return {
    id: options.id,
    title: options.title,
    icon: options.icon,
    chat,
    initialMessages: chat.get({ count: options.visibleMessages }),
    transport: chat.transport(),
  }
}

/** Scripted conversations the demo can switch between. */
export const DEMO_CHATS: DemoChat[] = [
  defineChat({
    id: "new-chat",
    title: "New Chat",
    icon: Comment02Icon,
    visibleMessages: 0,
    build: (chat) =>
      chat
        .user(
          "I'm building a chat for our app and the scroll behavior is driving me nuts. Every time the AI streams a reply, the whole thread jumps around."
        )
        .sleep(1000)
        .assistant(
          "That's the classic streaming scroll problem. Wrap your message list in `MessageScroller` and turn on `autoScroll` — the viewport pins to the bottom as tokens arrive, so users always see the latest text land in place.\n\nThe important part: it only auto-scrolls while the reader is already at the bottom. The moment they scroll up to read something earlier, auto-scroll backs off and their position is preserved. You get smooth streaming without fighting the user's intent."
        )
        .user(
          "Okay, but when someone sends a new message the view still feels jarring — like the whole conversation reloads from the top."
        )
        .sleep(1000)
        .assistant(
          "MessageScrollerItem fixes that with turn anchoring. Set `scrollAnchor` on the turn that should settle near the top instead of blindly snapping to the document bottom.\n\nIt also leaves a small peek of the previous exchange visible above the anchor, so context isn't lost. The reply starts in view without that disorienting jump you get from a plain overflow container."
        )
        .user(
          "And if they've scrolled up to re-read an older answer? I don't want to yank them back down."
        )
        .sleep(1000)
        .assistant(
          "You won't. Auto-scroll only runs when the viewport is already pinned to the bottom, so scrolling up is a deliberate opt-out — their place in the thread stays put even as new tokens keep arriving below.\n\nWhen there is content they haven't seen yet, `MessageScrollerButton` appears at the bottom of the viewport. One tap jumps them back to the newest message and re-engages auto-scroll. Same pattern as Slack or iMessage: quiet when you're caught up, helpful when you're not."
        )
        .user("Last one — does this work with assistive tech?")
        .sleep(1000)
        .assistant(
          '`MessageScrollerContent` sets `role="log"` and `aria-relevant="additions"` by default, so screen readers announce new messages as they stream in.\n\nThe scroll button is a real `<button>` with an sr-only label, and it\'s removed from the tab order when you\'re already at the bottom — no ghost focus stops.'
        ),
  }),
  defineChat({
    id: "design-tokens",
    title: "Design tokens",
    icon: PaintBoardIcon,
    visibleMessages: 4,
    build: (chat) =>
      chat
        .user(
          "Our brand color looks completely different in dark mode. Why does this registry keep every color in oklch instead of hex?"
        )
        .sleep(600)
        .assistant(
          "Because `oklch` is perceptually uniform — equal steps in the lightness channel actually look like equal steps, across every hue.\n\nTokens live in `app/globals.css` as `:root` / `.dark` variable pairs, so the dark variant is usually the same hue with lightness shifted, not a brand-new hex guess."
        )
        .user("So if I want to add an accent color, where does it go?")
        .sleep(600)
        .assistant(
          "Add the variable to both `:root` and `.dark`, then register it in the `@theme inline` block so Tailwind exposes it as `bg-`, `text-`, and `border-` utilities.\n\nNever hardcode the value in a component — the token is the contract, and both themes stay in sync for free."
        )
        .user("Can I check both themes without leaving the page?")
        .sleep(600)
        .assistant(
          "The preview iframe listens for `localStorage` storage events, so toggling the site theme flips every demo instantly — parent window and iframe stay in lockstep.\n\nFor a full sweep, the `/tokens` page renders the whole palette in context."
        ),
  }),
  defineChat({
    id: "rtl-audit",
    title: "RTL audit",
    icon: Globe02Icon,
    visibleMessages: 4,
    build: (chat) =>
      chat
        .user(
          "Flipped the app to Arabic and half the chat UI is hugging the wrong side."
        )
        .sleep(600)
        .assistant(
          "That's what physical utilities do — `ml-`, `pl-`, and `left-` don't care about writing direction. Swap them for logical ones: `ms-`/`me-` for margin, `ps-`/`pe-` for padding, `start-`/`end-` for positioning.\n\nOnce the styles are logical, `dir=\"rtl\"` mirrors the layout for free."
        )
        .user("The send arrow still points the wrong way though.")
        .sleep(600)
        .assistant(
          "Icons don't flip on their own. Directional glyphs — arrows, chevrons, back buttons — get `rtl:rotate-180`, or `rtl:-scale-x-100` for asymmetric shapes, so they mirror with the layout.\n\nSymmetric icons like search or settings stay exactly as they are."
        )
        .user("Any quick way to audit a whole screen?")
        .sleep(600)
        .assistant(
          'Set `dir="rtl"` on `<html>` and walk the page corner to corner — misaligned pieces jump out immediately.\n\nThe registry keeps RTL fixtures under `examples/rtl/` if you want reference layouts to compare against.'
        ),
  }),
  defineChat({
    id: "streaming-markdown",
    title: "Streaming markdown",
    icon: SourceCodeIcon,
    visibleMessages: 4,
    build: (chat) =>
      chat
        .user(
          "Code blocks flash as plain text while the reply is still streaming, then suddenly repaint. Looks glitchy."
        )
        .sleep(600)
        .assistant(
          "Highlight incrementally instead of waiting for the closing fence. Treat an unclosed code block as open-ended, highlight what has arrived, and append tokens as they land.\n\nThe repaint disappears because there's no unstyled-then-styled swap — the block is styled from its first line."
        )
        .user("What about half-finished bold text or links mid-stream?")
        .sleep(600)
        .assistant(
          "Same trick: close unterminated inline marks at the end of the buffer, so `**bold` renders bold immediately instead of showing raw asterisks.\n\nWhen the real closing mark arrives the tree is identical, so nothing re-flows."
        )
        .user("Does that play nicely with the scroller?")
        .sleep(600)
        .assistant(
          "Yes — incremental rendering keeps height changes small and continuous, which is exactly what `MessageScroller` likes. Big one-shot repaints are what cause visible jumps.\n\nStream, highlight, append — the viewport glides instead of lurching."
        ),
  }),
  defineChat({
    id: "release-notes",
    title: "Release notes",
    icon: Rocket01Icon,
    visibleMessages: 2,
    build: (chat) =>
      chat
        .user("Draft release notes for the new `message-scroller` component.")
        .sleep(600)
        .assistant(
          "**message-scroller** — a chat viewport that behaves.\n\nAuto-scroll pins to the bottom while replies stream and backs off the moment the reader scrolls up. Turn anchoring settles each new exchange near the top with a peek of the previous one, and a scroll-to-latest button appears only when there's something unread."
        )
        .user("Tighten that into three bullets for the changelog.")
        .sleep(600)
        .assistant(
          '- Auto-scroll that respects the reader — pinned at the bottom, hands-off when you scroll up\n- Turn anchoring with a previous-message peek, so replies land in view without the jump\n- Unread-aware scroll button with `role="log"` announcements for screen readers'
        ),
  }),
]

/** Chat switcher — lists the scripted demo conversations. */
export function ChatsDropdown({
  chats = DEMO_CHATS,
  activeId,
  onSelect,
  className,
}: {
  chats?: DemoChat[]
  activeId: string
  onSelect?: (id: string) => void
  className?: string
}) {
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className={cn("text-muted-foreground", className)}
                  aria-label="Switch chat"
                />
              }
            />
          }
        >
          <HugeiconsIcon icon={Comment02Icon} strokeWidth={2} />
        </TooltipTrigger>
        <TooltipContent side="bottom">Chats</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="start" className="w-56 rounded-xl">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Chats</DropdownMenuLabel>
          {chats.map((demoChat) => (
            <DropdownMenuItem
              key={demoChat.id}
              className="cursor-pointer"
              onClick={() => onSelect?.(demoChat.id)}
            >
              <HugeiconsIcon icon={demoChat.icon} strokeWidth={2} />
              <span className="min-w-0 truncate">{demoChat.title}</span>
              {demoChat.id === activeId && (
                <HugeiconsIcon
                  icon={Tick02Icon}
                  strokeWidth={2}
                  className="ms-auto size-3.5 text-muted-foreground"
                />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
