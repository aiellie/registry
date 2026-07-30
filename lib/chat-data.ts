import {
  AudioWave01Icon,
  CheckmarkCircle02Icon,
  GitBranchIcon,
  SourceCodeIcon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

export type ChatRole = "user" | "assistant"

export interface ChatMessageEntry {
  kind: "message"
  role: ChatRole
  /** Rendered as stacked paragraphs inside one bubble. */
  paragraphs: string[]
  /** Name line above the bubble. */
  header?: string
  /** Status line below the bubble (e.g. "Delivered", "Voice · 0:42"). */
  footer?: string
}

export interface ChatMarkerEntry {
  kind: "marker"
  label: string
  /** `separator` draws lines around the label — used for date dividers. */
  variant?: "default" | "separator" | "border"
  icon?: IconSvgElement
  /** Animated spinner instead of `icon` — for in-progress markers. */
  spinner?: boolean
}

export type ChatEntry = ChatMessageEntry | ChatMarkerEntry

export interface ChatTranscript {
  /** Matches `SidebarChat.id` in lib/sidebar-data.ts. */
  id: string
  title: string
  entries: ChatEntry[]
}

const user = (text: string, extra?: Partial<ChatMessageEntry>): ChatEntry => ({
  kind: "message",
  role: "user",
  paragraphs: [text],
  ...extra,
})

const assistant = (
  paragraphs: string[],
  extra?: Partial<ChatMessageEntry>
): ChatEntry => ({
  kind: "message",
  role: "assistant",
  paragraphs,
  ...extra,
})

const day = (label: string): ChatEntry => ({
  kind: "marker",
  label,
  variant: "separator",
})

/** Demo conversations, one per sidebar chat, keyed by `SidebarChat.id`. */
export const chatTranscripts: Record<string, ChatTranscript> = {
  "update-ui": {
    id: "update-ui",
    title: "Update UI to match examples",
    entries: [
      day("Yesterday"),
      user(
        "The buttons on the pricing page don't match the new examples. Can you bring them in line?"
      ),
      assistant([
        "Compared the pricing page against the registry examples — the buttons are still on the old radius and shadow tokens.",
        "Updating the call-to-action, plan card, and footer buttons to the current variants.",
      ]),
      {
        kind: "marker",
        label: "Updated pricing-cta.tsx, plan-card.tsx, and footer-cta.tsx",
        icon: SourceCodeIcon,
      },
      assistant([
        "Done. All three now use the rounded-2xl scale and the muted secondary variant from the examples. Light and dark previews look consistent.",
      ]),
      user("Perfect, merging.", { footer: "Delivered" }),
    ],
  },
  "launch-voice-memo": {
    id: "launch-voice-memo",
    title: "Launch voice memo",
    entries: [
      day("Today"),
      user("Transcribe the launch memo and pull out the action items.", {
        footer: "Voice memo · 0:42",
      }),
      assistant(
        [
          "Three action items from the memo: lock the changelog copy by Thursday, stage the announcement post for Friday morning, and hold the registry deploy until the docs preview is green.",
          "The rest was context about timing — no owner changes.",
        ],
        { header: "Transcript summary" }
      ),
      {
        kind: "marker",
        label: "Voice memo transcribed · 0:42",
        icon: AudioWave01Icon,
      },
    ],
  },
  "design-tokens-sync": {
    id: "design-tokens-sync",
    title: "Design tokens sync",
    entries: [
      day("Today"),
      user(
        "Sync the new oklch accent ramp into globals.css and mirror it to the registry copy."
      ),
      assistant([
        "Pulled the ramp from the tokens page. Rewriting the accent steps in app/globals.css first, then re-syncing registry/common/globals.css so the distributable theme matches.",
      ]),
      {
        kind: "marker",
        label: "Syncing tokens to registry/common/globals.css…",
        spinner: true,
      },
    ],
  },
  "portfolio-site-preview": {
    id: "portfolio-site-preview",
    title: "Portfolio Site Preview",
    entries: [
      {
        kind: "marker",
        label: "Branch preview · portfolio/redesign",
        icon: GitBranchIcon,
      },
      user("Spin up a preview of the portfolio redesign branch."),
      assistant(
        [
          "Preview is live. The hero picks up the new serif with fluid sizing, and the project grid collapses to a single column under 640px.",
        ],
        { footer: "personal-portfolio-0728.aiellie-dev.chatgpt.site" }
      ),
      user("Nice. Leave it up, I'll review tonight."),
    ],
  },
  "weekly-recap": {
    id: "weekly-recap",
    title: "Weekly recap",
    entries: [
      day("Monday"),
      user("What shipped last week?"),
      assistant(
        [
          "Shipped: sidebar resize handles, the icon explorer, and RTL fixes for the breadcrumb.",
          "In review: message scroller autoscroll tuning.",
          "Next up: the chat surface you're reading right now.",
        ],
        { header: "Weekly recap" }
      ),
      user("Good week. Pin this."),
    ],
  },
  "voice-brainstorm": {
    id: "voice-brainstorm",
    title: "Voice brainstorm",
    entries: [
      day("Last week"),
      user("Riff with me on names for the icon explorer.", {
        footer: "Voice · 2:10",
      }),
      assistant([
        "From the transcript, the strongest candidates were Glyph, Iconarium, and Pictogram. Glyph won the room — short, obvious in the sidebar, and the domain is free.",
      ]),
      user("Glyph it is."),
    ],
  },
  "standup-summary": {
    id: "standup-summary",
    title: "Standup summary",
    entries: [
      day("Today"),
      user("Summarize standup for the ops channel."),
      assistant(
        [
          "Vendor Hub migration is at 80% — data backfill finishes tonight.",
          "The handoff checklist is blocked on access revocation steps.",
          "No incidents. Next sync is Thursday.",
        ],
        { header: "Standup — 3 updates" }
      ),
      {
        kind: "marker",
        label: "Posted to #ops",
        icon: CheckmarkCircle02Icon,
      },
    ],
  },
  "handoff-checklist": {
    id: "handoff-checklist",
    title: "Handoff checklist",
    entries: [
      user("Draft the handoff checklist for the vendor hub."),
      assistant([
        "Draft covers: transfer repo ownership, rotate the deploy keys, hand over the vendor contacts sheet, and archive the old runbook.",
      ]),
      user("Add access revocation, then it's ready."),
      assistant([
        "Added revoking SSO seats and API tokens as the final step. Checklist is final.",
      ]),
    ],
  },
  "vendor-review": {
    id: "vendor-review",
    title: "Vendor review",
    entries: [
      user("Summarize the vendor call.", { footer: "Voice · 31:04" }),
      assistant([
        "Three takeaways: pricing locks for 12 months, SSO ships in Q3, and the support SLA drops to 4 hours on the new tier.",
      ]),
      user("Send the takeaways to procurement.", { footer: "Delivered" }),
    ],
  },
  "registry-build-pipeline": {
    id: "registry-build-pipeline",
    title: "Registry build pipeline",
    entries: [
      {
        kind: "marker",
        label: "ci/registry-build",
        icon: GitBranchIcon,
      },
      user("The registry build is flaky on CI. Find out why."),
      assistant([
        "The icons manifest is regenerated on every run and the shard hashes differ between Node versions. Pinning the runner to Node 22 and caching the icon shards by package version.",
      ]),
      {
        kind: "marker",
        label: "Running registry:build on ci/registry-build…",
        spinner: true,
      },
    ],
  },
  "brand-palette-v2": {
    id: "brand-palette-v2",
    title: "Brand palette v2",
    entries: [
      user("Push the accent toward coral, keep the neutrals."),
      assistant([
        "Shifted the accent hue from 25° to 18° in oklch and bumped chroma one step. Neutrals untouched — contrast on white still passes AA at button size.",
      ]),
      user("That's the one. Export it to the theme."),
    ],
  },
  "podcast-intro-cut": {
    id: "podcast-intro-cut",
    title: "Podcast intro cut",
    entries: [
      user("Cut the intro to 15 seconds and tighten the music bed.", {
        footer: "Audio · intro-v3.wav",
      }),
      assistant([
        "Trimmed to 14.8 seconds — cold open on the hook, music ducks under the first line, and the fade lands right before the theme resolves.",
      ]),
      {
        kind: "marker",
        label: "Rendered intro-v4.wav · 14.8s",
        icon: AudioWave01Icon,
      },
    ],
  },
  "hero-illustration": {
    id: "hero-illustration",
    title: "Hero illustration",
    entries: [
      user(
        "Generate options for the hero illustration. Warm, geometric, no gradients."
      ),
      assistant([
        "Two directions so far: overlapping arcs in the accent ramp, and a tiled sunrise motif. Rendering a third with the elephant mark worked in.",
      ]),
      {
        kind: "marker",
        label: "Rendering option 3 of 3…",
        spinner: true,
      },
    ],
  },
}

const CHAT_HASH_PREFIX = "#chat/"

/** Resolves a `#chat/<id>` location hash to its transcript, if any. */
export function getTranscriptFromHash(
  hash: string | null
): ChatTranscript | null {
  if (!hash?.startsWith(CHAT_HASH_PREFIX)) return null
  return (
    chatTranscripts[decodeURIComponent(hash.slice(CHAT_HASH_PREFIX.length))] ??
    null
  )
}
