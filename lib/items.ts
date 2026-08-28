import {
  AiChat01Icon,
  AiChat02Icon,
  Alert02Icon,
  AppWindowIcon,
  ArrowExpandIcon,
  ArrowLeftRightIcon,
  AspectRatioIcon,
  BotIcon,
  CodeSquareIcon,
  AiContentGenerator01Icon,
  AttachmentIcon,
  AudioWave01Icon,
  AudioWave02Icon,
  BarChartIcon,
  BlocksIcon,
  BloodIcon,
  BadgeIcon,
  Bone01Icon,
  BrowserIcon,
  BubbleChatAddIcon,
  BubbleChatIcon,
  Bug01Icon,
  CommandLineIcon,
  BubblesIcon,
  Cabinet01Icon,
  Calendar03Icon,
  CalendarIcon,
  CarouselHorizontalIcon,
  CollapseIcon,
  ColorPickerIcon,
  ClockIcon,
  Clock01Icon,
  ColorsIcon,
  Comment01Icon,
  ComputerTerminal01Icon,
  CreditCardIcon,
  CubeIcon,
  CursorInfo01Icon,
  CursorPointer01Icon,
  DashboardSquare01Icon,
  DateTimeIcon,
  DistributeHorizontalCenterIcon,
  File02Icon,
  FileEmpty02Icon,
  Folder01Icon,
  FormIcon,
  GitCommitIcon,
  GlassWaterIcon,
  GlobeIcon,
  Grid2X2Icon,
  GridTableIcon,
  GridViewIcon,
  HierarchyFilesIcon,
  HighlighterIcon,
  Home01Icon,
  HourglassIcon,
  Image01Icon,
  InformationCircleIcon,
  KeyboardIcon,
  LabelIcon,
  Layout01Icon,
  LayoutBottomIcon,
  LayoutTopIcon,
  ListViewIcon,
  Loading03Icon,
  LoadingIcon,
  Login01Icon,
  Menu01Icon,
  MenuCollapseIcon,
  MenuSquareIcon,
  Message01Icon,
  MessageMultiple01Icon,
  Mic01Icon,
  MoreHorizontalIcon,
  ModernTvIssueIcon,
  MouseScroll01Icon,
  Navigation03Icon,
  Notification01Icon,
  PackageIcon,
  PackageOpenIcon,
  PaintBoardIcon,
  PaintBucketIcon,
  ParagraphIcon,
  PasswordValidationIcon,
  PromotionIcon,
  RadioButtonIcon,
  Robot01Icon,
  RoboticIcon,
  Route01Icon,
  Search01Icon,
  SearchIcon,
  SearchList01Icon,
  ShoppingBag01Icon,
  SidebarLeft01Icon,
  SidebarLeftIcon,
  SidebarRight01Icon,
  SiriIcon,
  SiriNewIcon,
  SlidersHorizontalIcon,
  SmileIcon,
  SolidLine01Icon,
  SourceCodeIcon,
  SparklesIcon,
  SquareArrowDown01Icon,
  SquareArrowDown02Icon,
  StatusIcon,
  Store01Icon,
  Table01Icon,
  Tag01Icon,
  TextFontIcon,
  TextIndent01Icon,
  Tick02Icon,
  ToggleOffIcon,
  ToggleOnIcon,
  TailwindcssIcon,
  UserSquareIcon,
  PuzzleIcon,
  BrainIcon,
  VariableIcon,
  Key01Icon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

import type { Component } from "@/lib/registry"

/**
 * The two ways the registry sidebar can group its items: by their registry
 * `type` (Blocks / Components / UI Primitives) or by their curated `category`.
 */
export type SortMode = "type" | "category"

export type CategoryId =
  | "buttons"
  | "menus"
  | "inputs"
  | "data"
  | "info"
  | "blocks"
  | "brand"
  | "chat"
  | "ai"
  | "audio"
  | "code"
  | "design"
  | "forms"
  | "navigation"
  | "overlays"
  | "media"
  | "display"
  | "feedback"
  | "layout"
  | "animation"
  | "ui"

export interface Category {
  id: CategoryId
  label: string
  icon: IconSvgElement
}

/** Category definitions with the icon shown on their sidebar group header. */
export const categories: Record<CategoryId, Category> = {
  blocks: { id: "blocks", label: "Blocks", icon: BlocksIcon },
  chat: { id: "chat", label: "Chat", icon: AiChat01Icon },
  data: { id: "data", label: "Data", icon: GridViewIcon },
  ui: { id: "ui", label: "UI", icon: PuzzleIcon },
  buttons: { id: "buttons", label: "Buttons", icon: CursorPointer01Icon },
  menus: { id: "menus", label: "Menus", icon: Menu01Icon },
  inputs: { id: "inputs", label: "Inputs", icon: TextFontIcon },
  info: { id: "info", label: "Info", icon: InformationCircleIcon },
  brand: { id: "brand", label: "Brand", icon: SparklesIcon },
  ai: { id: "ai", label: "AI", icon: AiChat02Icon },
  code: { id: "code", label: "Code", icon: SourceCodeIcon },
  audio: { id: "audio", label: "Audio", icon: AudioWave01Icon },
  design: { id: "design", label: "Design", icon: PaintBoardIcon },
  forms: { id: "forms", label: "Forms & Inputs", icon: FormIcon },
  navigation: { id: "navigation", label: "Navigation", icon: Navigation03Icon },
  overlays: { id: "overlays", label: "Overlays", icon: AppWindowIcon },
  media: { id: "media", label: "Media", icon: Image01Icon },
  display: { id: "display", label: "Data Display", icon: GridViewIcon },
  feedback: { id: "feedback", label: "Feedback", icon: Notification01Icon },
  layout: { id: "layout", label: "Layout", icon: LayoutTopIcon },
  animation: { id: "animation", label: "Animation", icon: SparklesIcon },
}

/** Order category groups render in when sorting by category. */
export const categoryOrder: CategoryId[] = [
  "blocks",
  "brand",
  "code",
  "chat",
  "design",
  "data",
  "buttons",
  "menus",
  "inputs",
  "info",
  "ai",
  "audio",
  "forms",
  "navigation",
  "overlays",
  "media",
  "display",
  "feedback",
  "layout",
  "animation",
  "ui",
]

export interface Item {
  /** Registry item name (matches `registry.json`). */
  name: string
  /** Icon shown next to the item in the sidebar and command palette. */
  icon: IconSvgElement
  /** Registry type as it appears in `registry.json`. */
  type: "registry:block" | "registry:component" | "registry:ui"
  /** Curated category used when grouping the sidebar by category. */
  category: CategoryId
  /** Whether the item is recently added — surfaces a "New" marker. */
  isNew: boolean
  /** Whether the item appears in the home page grid. */
  displayHome: boolean
}

/**
 * Every registry item shown in the sidebar, with its icon, type, category, and
 * new status. This is the single source of truth for item metadata — the icon
 * map (`getItemIcon`) and category grouping both derive from it.
 */
export const items: Item[] = [
  // Blocks
  {
    name: "blank",
    icon: FileEmpty02Icon,
    type: "registry:block",
    category: "blocks",
    isNew: false,
    displayHome: false,
  },
  {
    name: "chat",
    icon: AiChat01Icon,
    type: "registry:block",
    category: "blocks",
    isNew: true,
    displayHome: false,
  },
  {
    name: "dashboard",
    icon: DashboardSquare01Icon,
    type: "registry:block",
    category: "blocks",
    isNew: false,
    displayHome: false,
  },
  {
    name: "login",
    icon: Login01Icon,
    type: "registry:block",
    category: "blocks",
    isNew: false,
    displayHome: false,
  },
  {
    name: "newchat",
    icon: BubbleChatAddIcon,
    type: "registry:block",
    category: "blocks",
    isNew: true,
    displayHome: false,
  },
  {
    name: "projects",
    icon: Folder01Icon,
    type: "registry:block",
    category: "blocks",
    isNew: true,
    displayHome: false,
  },
  {
    name: "shell",
    icon: Layout01Icon,
    type: "registry:block",
    category: "blocks",
    isNew: true,
    displayHome: false,
  },
  {
    name: "store",
    icon: Store01Icon,
    type: "registry:block",
    category: "blocks",
    isNew: true,
    displayHome: false,
  },

  // Brand
  {
    name: "logo",
    icon: SparklesIcon,
    type: "registry:component",
    category: "brand",
    isNew: false,
    displayHome: true,
  },
  {
    name: "brand-avatar",
    icon: SmileIcon,
    type: "registry:component",
    category: "brand",
    isNew: true,
    displayHome: true,
  },
  {
    name: "hero",
    icon: Image01Icon,
    type: "registry:component",
    category: "brand",
    isNew: false,
    displayHome: true,
  },
  {
    name: "brand-header",
    icon: LayoutTopIcon,
    type: "registry:component",
    category: "brand",
    isNew: false,
    displayHome: true,
  },
  {
    name: "brand-footer",
    icon: LayoutBottomIcon,
    type: "registry:component",
    category: "brand",
    isNew: false,
    displayHome: true,
  },
  {
    name: "brand-sidebar",
    icon: SidebarLeft01Icon,
    type: "registry:component",
    category: "brand",
    isNew: false,
    displayHome: true,
  },
  {
    name: "promo",
    icon: PromotionIcon,
    type: "registry:component",
    category: "brand",
    isNew: true,
    displayHome: true,
  },
  //Chat
  {
    name: "attachment",
    icon: AttachmentIcon,
    type: "registry:ui",
    category: "chat",
    isNew: false,
    displayHome: true,
  },
  {
    name: "bubble",
    icon: Comment01Icon,
    type: "registry:ui",
    category: "chat",
    isNew: false,
    displayHome: true,
  },
  {
    name: "chain-of-thought",
    icon: BrainIcon,
    type: "registry:ui",
    category: "chat",
    isNew: true,
    displayHome: true,
  },
  {
    name: "marker",
    icon: HighlighterIcon,
    type: "registry:ui",
    category: "chat",
    isNew: false,
    displayHome: true,
  },
  {
    name: "message",
    icon: MessageMultiple01Icon,
    type: "registry:ui",
    category: "chat",
    isNew: false,
    displayHome: true,
  },
  {
    name: "message-scroller",
    icon: Message01Icon,
    type: "registry:ui",
    category: "chat",
    isNew: false,
    displayHome: true,
  },
  //Code
  {
    name: "code-block",
    icon: CodeSquareIcon,
    type: "registry:ui",
    category: "code",
    isNew: true,
    displayHome: true,
  },
  {
    name: "agent",
    icon: BotIcon,
    type: "registry:ui",
    category: "code",
    isNew: true,
    displayHome: true,
  },
  {
    name: "artifact",
    icon: AiContentGenerator01Icon,
    type: "registry:ui",
    category: "code",
    isNew: true,
    displayHome: true,
  },
  {
    name: "commit",
    icon: GitCommitIcon,
    type: "registry:ui",
    category: "code",
    isNew: true,
    displayHome: true,
  },
  {
    name: "environment-variables",
    icon: Key01Icon,
    type: "registry:ui",
    category: "code",
    isNew: true,
    displayHome: true,
  },
  {
    name: "package-info",
    icon: PackageIcon,
    type: "registry:ui",
    category: "code",
    isNew: true,
    displayHome: true,
  },
  {
    name: "snippet",
    icon: CommandLineIcon,
    type: "registry:ui",
    category: "code",
    isNew: true,
    displayHome: true,
  },
  {
    name: "stack-trace",
    icon: Bug01Icon,
    type: "registry:ui",
    category: "code",
    isNew: true,
    displayHome: true,
  },
  //Data
  {
    name: "calendar",
    icon: CalendarIcon,
    type: "registry:ui",
    category: "data",
    isNew: true,
    displayHome: true,
  },
  {
    name: "chart",
    icon: BarChartIcon,
    type: "registry:ui",
    category: "data",
    isNew: true,
    displayHome: true,
  },
  {
    name: "data-table",
    icon: GridTableIcon,
    type: "registry:ui",
    category: "data",
    isNew: true,
    displayHome: true,
  },
  {
    name: "date-picker",
    icon: DateTimeIcon,
    type: "registry:ui",
    category: "data",
    isNew: true,
    displayHome: true,
  },
  {
    name: "event-calendar",
    icon: Calendar03Icon,
    type: "registry:ui",
    category: "data",
    isNew: true,
    displayHome: true,
  },
  {
    name: "product-grid",
    icon: ShoppingBag01Icon,
    type: "registry:component",
    category: "data",
    isNew: true,
    displayHome: true,
  },
  {
    name: "sidebar",
    icon: SidebarLeftIcon,
    type: "registry:ui",
    category: "data",
    isNew: false,
    displayHome: true,
  },
  // AI
  {
    name: "prompt-input",
    icon: AiChat01Icon,
    type: "registry:component",
    category: "ai",
    isNew: true,
    displayHome: true,
  },
  {
    name: "model-selector",
    icon: RoboticIcon,
    type: "registry:ui",
    category: "ai",
    isNew: true,
    displayHome: true,
  },
  {
    name: "file-tree",
    icon: HierarchyFilesIcon,
    type: "registry:ui",
    category: "code",
    isNew: true,
    displayHome: true,
  },
  {
    name: "web-preview",
    icon: GlobeIcon,
    type: "registry:ui",
    category: "ai",
    isNew: true,
    displayHome: true,
  },
  {
    name: "terminal",
    icon: ComputerTerminal01Icon,
    type: "registry:ui",
    category: "code",
    isNew: true,
    displayHome: true,
  },
  {
    name: "code-workspace",
    icon: SourceCodeIcon,
    type: "registry:ui",
    category: "code",
    isNew: true,
    displayHome: true,
  },
  {
    name: "find-in-page",
    icon: Search01Icon,
    type: "registry:ui",
    category: "ai",
    isNew: true,
    displayHome: true,
  },
  {
    name: "persona",
    icon: SiriNewIcon,
    type: "registry:ui",
    category: "audio",
    isNew: true,
    displayHome: true,
  },
  {
    name: "orb",
    icon: SiriIcon,
    type: "registry:ui",
    category: "audio",
    isNew: true,
    displayHome: true,
  },
  {
    name: "mic-selector",
    icon: Mic01Icon,
    type: "registry:ui",
    category: "audio",
    isNew: true,
    displayHome: true,
  },
  {
    name: "speech-input",
    icon: AudioWave01Icon,
    type: "registry:ui",
    category: "audio",
    isNew: true,
    displayHome: true,
  },
  {
    name: "live-waveform",
    icon: AudioWave02Icon,
    type: "registry:ui",
    category: "ai",
    isNew: true,
    displayHome: true,
  },

  // Design
  {
    name: "color-picker",
    icon: ColorPickerIcon,
    type: "registry:ui",
    category: "design",
    isNew: true,
    displayHome: true,
  },
  {
    name: "tailwind-color-picker",
    icon: TailwindcssIcon,
    type: "registry:ui",
    category: "design",
    isNew: false,
    displayHome: true,
  },
  // Forms & Inputs
  {
    name: "button",
    icon: CursorPointer01Icon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "button-group",
    icon: DistributeHorizontalCenterIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "checkbox",
    icon: Tick02Icon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "combobox",
    icon: SearchList01Icon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "icon-picker",
    icon: GridViewIcon,
    type: "registry:component",
    category: "design",
    isNew: true,
    displayHome: true,
  },
  {
    name: "field",
    icon: FormIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "input",
    icon: TextFontIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "input-group",
    icon: TextIndent01Icon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "input-otp",
    icon: PasswordValidationIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "label",
    icon: LabelIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "native-select",
    icon: SquareArrowDown02Icon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "radio-group",
    icon: RadioButtonIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "select",
    icon: SquareArrowDown01Icon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "slider",
    icon: SlidersHorizontalIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "switch",
    icon: ToggleOnIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "textarea",
    icon: ParagraphIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "toggle",
    icon: ToggleOffIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "toggle-group",
    icon: Grid2X2Icon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },

  // Navigation
  {
    name: "breadcrumb",
    icon: Route01Icon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "command",
    icon: SearchIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "menubar",
    icon: MenuCollapseIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "navigation-menu",
    icon: Navigation03Icon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "pagination",
    icon: MoreHorizontalIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "tabs",
    icon: BrowserIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },

  // Overlays
  {
    name: "alert-dialog",
    icon: ModernTvIssueIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "context-menu",
    icon: MenuSquareIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "dialog",
    icon: AppWindowIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "drawer",
    icon: Cabinet01Icon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "dropdown-menu",
    icon: Menu01Icon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "hover-card",
    icon: CursorInfo01Icon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "popover",
    icon: BubbleChatIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "sheet",
    icon: SidebarRight01Icon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "tooltip",
    icon: InformationCircleIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },

  // Data Display
  {
    name: "accordion",
    icon: MenuCollapseIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "avatar",
    icon: UserSquareIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "badge",
    icon: BadgeIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "card",
    icon: CreditCardIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "carousel",
    icon: CarouselHorizontalIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "empty",
    icon: PackageOpenIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "item",
    icon: ListViewIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "kbd",
    icon: KeyboardIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "table",
    icon: Table01Icon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "aspect-ratio",
    icon: AspectRatioIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },

  // Feedback
  {
    name: "alert",
    icon: Alert02Icon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "progress",
    icon: HourglassIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "skeleton",
    icon: Bone01Icon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "spinner",
    icon: LoadingIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "time-picker",
    icon: Clock01Icon,
    type: "registry:ui",
    category: "design",
    isNew: true,
    displayHome: true,
  },
  {
    name: "status",
    icon: StatusIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "toast",
    icon: Notification01Icon,
    type: "registry:ui",
    category: "ui",
    isNew: true,
    displayHome: true,
  },
  {
    name: "loader",
    icon: Loading03Icon,
    type: "registry:ui",
    category: "ui",
    isNew: true,
    displayHome: true,
  },

  // Layout
  {
    name: "collapsible",
    icon: CollapseIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "direction",
    icon: ArrowLeftRightIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "resizable",
    icon: ArrowExpandIcon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "scroll-area",
    icon: MouseScroll01Icon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },
  {
    name: "separator",
    icon: SolidLine01Icon,
    type: "registry:ui",
    category: "ui",
    isNew: false,
    displayHome: true,
  },

  // Animation
  {
    name: "liquid",
    icon: BloodIcon,
    type: "registry:component",
    category: "animation",
    isNew: true,
    displayHome: true,
  },
  {
    name: "glass",
    icon: GlassWaterIcon,
    type: "registry:component",
    category: "animation",
    isNew: true,
    displayHome: true,
  },
  {
    name: "bubbles",
    icon: BubblesIcon,
    type: "registry:component",
    category: "animation",
    isNew: true,
    displayHome: true,
  },
  {
    name: "animated-bots",
    icon: Robot01Icon,
    type: "registry:component",
    category: "animation",
    isNew: true,
    displayHome: true,
  },
]

/** Icons for non-item sidebar entries (Getting Started nav + theme). */
const extraIcons: Record<string, IconSvgElement> = {
  home: Home01Icon,
  tokens: PaintBoardIcon,
  icons: SmileIcon,
  theme: PaintBucketIcon,
}

const itemByName = new Map(items.map((item) => [item.name, item]))

const iconByName: Record<string, IconSvgElement> = {
  ...extraIcons,
  ...Object.fromEntries(items.map((item) => [item.name, item.icon])),
}

/**
 * Look up an icon by item (or nav) name. `registry:example` entries have no
 * metadata of their own, so `<name>-demo` / `<name>-example` borrows the icon
 * of the item it demonstrates; anything else falls back to a generic cube.
 */
export function getItemIcon(name: string): IconSvgElement {
  return (
    iconByName[name] ??
    iconByName[name.replace(/-(demo|example)$/, "")] ??
    CubeIcon
  )
}

/** Look up the full metadata for a registry item by name. */
export function getItem(name: string): Item | undefined {
  return itemByName.get(name)
}

export interface CategoryGroup {
  category: Category
  items: Component[]
}

/**
 * Group registry components by their curated category, in `categoryOrder`.
 * Empty categories are omitted and items within a group are sorted by title.
 */
export function groupByCategory(components: Component[]): CategoryGroup[] {
  const byCategory = new Map<CategoryId, Component[]>()

  for (const component of components) {
    const category = itemByName.get(component.name)?.category ?? "display"
    const group = byCategory.get(category)
    if (group) {
      group.push(component)
    } else {
      byCategory.set(category, [component])
    }
  }

  return categoryOrder
    .filter((id) => byCategory.has(id))
    .map((id) => ({
      category: categories[id],
      items: byCategory.get(id)!.sort((a, b) => a.title.localeCompare(b.title)),
    }))
}
