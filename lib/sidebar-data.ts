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
  GitPullRequestIcon,
  Image02Icon,
  Key01Icon,
  LayoutTable01Icon,
  LibraryIcon,
  PaintBoardIcon,
  PlayIcon,
  PlusSignIcon,
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
}

export interface SidebarNavGroup {
  /** Omit to render the group without a heading. */
  label?: string
  items: SidebarNavItem[]
}

export interface SidebarChat {
  name: string
  url: string
}

export interface SidebarTeam {
  name: string
  logo: IconSvgElement
  plan: string
  groups: SidebarNavGroup[]
  /** Recent conversations. Teams without a chat surface omit this. */
  chats?: SidebarChat[]
}

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
          { title: "New Chat", href: "#chat", icon: PlusSignIcon },
          {
            title: "Projects",
            href: "#chat-projects",
            icon: DashboardCircleIcon,
            action: { title: "Add Project", icon: PlusSignIcon },
          },
          { title: "Library", href: "#chat-library", icon: LibraryIcon },
          { title: "Scheduled", href: "#chat-scheduled", icon: Calendar01Icon },
        ],
      },
    ],
    chats: [
      { name: "Onboarding flow ideas", url: "#" },
      { name: "Q3 roadmap draft", url: "#" },
      { name: "Bug triage notes", url: "#" },
    ],
  },
  {
    name: "Cowork",
    logo: CheckListIcon,
    plan: "Enterprise",
    groups: [
      {
        items: [
          { title: "New Chat", href: "#cowork", icon: PlusSignIcon },
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
    chats: [
      { name: "Standup summary", url: "#" },
      { name: "Handoff checklist", url: "#" },
      { name: "Vendor review", url: "#" },
    ],
  },
  {
    name: "Code",
    logo: BashIcon,
    plan: "Free",
    groups: [
      {
        items: [
          { title: "New Chat", href: "#code", icon: PlusSignIcon },
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
    chats: [
      { name: "Migrate auth middleware", url: "#" },
      { name: "Flaky e2e test", url: "#" },
      { name: "Bundle size audit", url: "#" },
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
    chats: [
      { name: "Brand palette v2", url: "#" },
      { name: "Podcast intro cut", url: "#" },
      { name: "Hero illustration", url: "#" },
    ],
  },
]

export const user = {
  name: "aiellie",
  email: "hello@aiellie.dev",
  avatar: "/avatars/aiellie.png",
}

export const sidebarData = { teams, user }
