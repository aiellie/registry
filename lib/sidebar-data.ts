import {
  AiGenerativeIcon,
  ApiIcon,
  AudioWave01Icon,
  BashIcon,
  Book02Icon,
  BotMessageSquareIcon,
  Calendar01Icon,
  ChartHistogramIcon,
  ChartLineData01Icon,
  CheckListIcon,
  Comment02Icon,
  CreditCardIcon,
  DashboardCircleIcon,
  FileScriptIcon,
  FrameIcon,
  GitBranchIcon,
  GitPullRequestIcon,
  Image02Icon,
  Key01Icon,
  LayoutTable01Icon,
  LibraryIcon,
  PaintBoardIcon,
  PlayIcon,
  PlusSignIcon,
  SourceCodeIcon,
  WebDesign02Icon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

export interface SidebarNavItem {
  title: string
  href: string
  icon: IconSvgElement
  badge?: {
    text: string
    className?: string
  }
  /** Hover-revealed button at the end of the row. Shares its slot with `badge`. */
  action?: {
    title: string
    icon: IconSvgElement
  }
  /** Keyboard shortcut hint. Shares its slot with `badge` and `action`. */
  kbd?: string
}

export interface SidebarNavGroup {
  /** Omit to render the group without a heading. */
  label?: string
  items: SidebarNavItem[]
}

export type SidebarChatType = "voice" | "code" | "chat" | "branch"

export type SidebarChatStatus = "read" | "unread" | "working"

export interface SidebarChat {
  name: string
  url: string
  /** Picks the row icon via `chatTypeIcons`. */
  type: SidebarChatType
  /** `unread` shows an indicator dot, `working` a pulsing one. */
  status: SidebarChatStatus
}

/** Row icon for each chat type, shared by the chat and pinned lists. */
export const chatTypeIcons: Record<SidebarChatType, IconSvgElement> = {
  chat: Comment02Icon,
  voice: AudioWave01Icon,
  code: SourceCodeIcon,
  branch: GitBranchIcon,
}

export interface SidebarProject {
  id: string
  name: string
  url: string
  icon: IconSvgElement
}

export interface SidebarTeam {
  name: string
  logo: IconSvgElement
  plan: string
  groups: SidebarNavGroup[]
  /** Named workspaces shown above chats. Teams without projects omit this. */
  projects?: SidebarProject[]
  /** Chats pinned above the recents list. */
  pinned?: SidebarChat[]
  /** Recent conversations. Teams without a chat surface omit this. */
  chats?: SidebarChat[]
}

/** Shared project list: the sidebar Projects group and the prompt-input picker. */
export const projects: SidebarProject[] = [
  { id: "ui-aiellie-dev", name: "ui.aiellie.dev", url: "#", icon: FrameIcon },
  { id: "aiellie-dev", name: "aiellie.dev", url: "#", icon: WebDesign02Icon },
  { id: "aiellie", name: "aiellie", url: "#", icon: PaintBoardIcon },
  {
    id: "shadcn-inspired",
    name: "shadcn.inspired",
    url: "#",
    icon: LayoutTable01Icon,
  },
]

/** Branches for the prompt-input branch picker. */
export const branches: { name: string; hint?: string }[] = [
  { name: "main", hint: "Uncommitted: 1 file" },
]

/** Environments for the prompt-input environment picker. */
export const environments: { id: string; name: string }[] = []

const newBadge = {
  text: "New",
  className: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
}

export const teams: SidebarTeam[] = [
  {
    name: "Chat",
    logo: Comment02Icon,
    plan: "Enterprise",
    groups: [
      {
        items: [
          { title: "New Chat", href: "#chat", icon: PlusSignIcon, kbd: "⌘N" },
          {
            title: "Projects",
            href: "#chat-projects",
            icon: DashboardCircleIcon,
            action: { title: "Add Project", icon: PlusSignIcon },
          },
          { title: "Library", href: "#chat-library", icon: LibraryIcon },
          { title: "Scheduled", href: "#chat-scheduled", icon: Calendar01Icon },
          {
            title: "Pull Requests",
            href: "#code-pull-requests",
            icon: GitPullRequestIcon,
          },
          {
            title: "Sites",
            href: "#code-sites",
            icon: WebDesign02Icon,
            badge: newBadge,
          },
        ],
      },
    ],
    projects,
    pinned: [
      {
        name: "Update UI to match examples",
        url: "#",
        type: "code",
        status: "read",
      },
      { name: "Launch voice memo", url: "#", type: "voice", status: "unread" },
    ],
    chats: [
      { name: "Design tokens sync", url: "#", type: "code", status: "working" },
      {
        name: "Portfolio Site Preview",
        url: "#",
        type: "branch",
        status: "unread",
      },
      { name: "Weekly recap", url: "#", type: "chat", status: "read" },
      { name: "Voice brainstorm", url: "#", type: "voice", status: "read" },
    ],
  },
  {
    name: "Cowork",
    logo: CheckListIcon,
    plan: "Enterprise",
    groups: [
      {
        items: [
          {
            title: "New Chat",
            href: "#cowork",
            icon: PlusSignIcon,
            kbd: "⌘N",
          },
          {
            title: "Projects",
            href: "#cowork-projects",
            icon: DashboardCircleIcon,
            action: { title: "Add Project", icon: PlusSignIcon },
          },
          { title: "Library", href: "#cowork-library", icon: LibraryIcon },
          {
            title: "Scheduled",
            href: "#cowork-scheduled",
            icon: Calendar01Icon,
          },
        ],
      },
    ],
    projects: [
      {
        id: "ops-playbook",
        name: "Ops Playbook",
        url: "#",
        icon: CheckListIcon,
      },
      { id: "vendor-hub", name: "Vendor Hub", url: "#", icon: FrameIcon },
    ],
    chats: [
      { name: "Standup summary", url: "#", type: "chat", status: "unread" },
      { name: "Handoff checklist", url: "#", type: "chat", status: "read" },
      { name: "Vendor review", url: "#", type: "voice", status: "read" },
    ],
  },
  {
    name: "Code",
    logo: BashIcon,
    plan: "Free",
    groups: [
      {
        items: [
          { title: "New Chat", href: "#code", icon: PlusSignIcon, kbd: "⌘N" },
          {
            title: "Pull Requests",
            href: "#code-pull-requests",
            icon: GitPullRequestIcon,
          },
          {
            title: "Sites",
            href: "#code-sites",
            icon: WebDesign02Icon,
            badge: newBadge,
          },
          { title: "Scheduled", href: "#code-scheduled", icon: Calendar01Icon },
        ],
      },
    ],
    projects,
    pinned: [
      {
        name: "Registry build pipeline",
        url: "#",
        type: "branch",
        status: "working",
      },
    ],
    chats: [
      {
        name: "Update UI to match examples",
        url: "#",
        type: "code",
        status: "working",
      },
      {
        name: "Portfolio Site Preview",
        url: "#",
        type: "branch",
        status: "unread",
      },
    ],
  },
  {
    name: "Console",
    logo: BotMessageSquareIcon,
    plan: "Startup",
    groups: [
      {
        items: [
          { title: "Overview", href: "#console", icon: DashboardCircleIcon },
          { title: "Playground", href: "#console-playground", icon: PlayIcon },
          { title: "API Keys", href: "#console-api-keys", icon: Key01Icon },
          { title: "Logs", href: "#console-logs", icon: FileScriptIcon },
        ],
      },
      {
        label: "Manage",
        items: [
          {
            title: "Usage",
            href: "#console-usage",
            icon: ChartHistogramIcon,
          },
          {
            title: "Billing",
            href: "#console-billing",
            icon: CreditCardIcon,
          },
          {
            title: "Rate Limits",
            href: "#console-rate-limits",
            icon: ChartLineData01Icon,
          },
          { title: "Docs", href: "#console-docs", icon: Book02Icon },
        ],
      },
      {
        label: "Integrations",
        items: [
          { title: "Endpoints", href: "#console-endpoints", icon: ApiIcon },
        ],
      },
    ],
  },
  {
    name: "Create",
    logo: AiGenerativeIcon,
    plan: "Free",
    groups: [
      {
        items: [
          { title: "Chat", href: "#create", icon: Comment02Icon },
          { title: "Audio", href: "#create-audio", icon: AudioWave01Icon },
          { title: "Images", href: "#create-images", icon: Image02Icon },
          {
            title: "Design Systems",
            href: "#create-design-systems",
            icon: PaintBoardIcon,
          },
          {
            title: "Templates",
            href: "#create-templates",
            icon: LayoutTable01Icon,
          },
        ],
      },
    ],
    projects: [
      {
        id: "brand-system",
        name: "Brand System",
        url: "#",
        icon: PaintBoardIcon,
      },
      { id: "campaign-kit", name: "Campaign Kit", url: "#", icon: Image02Icon },
    ],
    chats: [
      { name: "Brand palette v2", url: "#", type: "chat", status: "read" },
      { name: "Podcast intro cut", url: "#", type: "voice", status: "unread" },
      { name: "Hero illustration", url: "#", type: "chat", status: "working" },
    ],
  },
]

export const user = {
  name: "aiellie",
  email: "hello@aiellie.dev",
  avatar: "https://avatar.aiellie.dev/vercel?type=glass",
}

export const sidebarData = { teams, user }
