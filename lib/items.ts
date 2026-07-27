import {
  AiChat01Icon,
  AlertCircleIcon,
  AlertDiamondIcon,
  AppWindowIcon,
  ArrowExpandIcon,
  ArrowLeftRightIcon,
  AspectRatioIcon,
  AttachmentIcon,
  BarChartIcon,
  BlocksIcon,
  BloodIcon,
  Bone01Icon,
  BrowserIcon,
  BubbleChatIcon,
  BubblesIcon,
  Cabinet01Icon,
  CalendarIcon,
  CarouselHorizontalIcon,
  CollapseIcon,
  Comment01Icon,
  CreditCardIcon,
  CubeIcon,
  CursorInfo01Icon,
  CursorPointer01Icon,
  DashboardSquare01Icon,
  DateTimeIcon,
  DistributeHorizontalCenterIcon,
  FileEmpty02Icon,
  FormIcon,
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
  MoreHorizontalIcon,
  MouseScroll01Icon,
  Navigation03Icon,
  Notification01Icon,
  PackageOpenIcon,
  PaintBoardIcon,
  PaintBucketIcon,
  ParagraphIcon,
  PasswordValidationIcon,
  RadioButtonIcon,
  RoboticIcon,
  Route01Icon,
  SearchIcon,
  SearchList01Icon,
  SidebarLeft01Icon,
  SidebarLeftIcon,
  SidebarRight01Icon,
  SiriIcon,
  SiriNewIcon,
  SlidersHorizontalIcon,
  SmileIcon,
  SolidLine01Icon,
  SparklesIcon,
  SquareArrowDown01Icon,
  SquareArrowDown02Icon,
  StatusIcon,
  Table01Icon,
  Tag01Icon,
  TextFontIcon,
  TextIndent01Icon,
  Tick02Icon,
  ToggleOffIcon,
  ToggleOnIcon,
  UnfoldMoreIcon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

import type { Component } from "@/lib/registry"

/**
 * The two ways the registry sidebar can group its items: by their registry
 * `type` (Blocks / Components / UI Primitives) or by their curated `category`.
 */
export type SortMode = "type" | "category"

export type CategoryId =
  | "blocks"
  | "brand"
  | "ai"
  | "forms"
  | "navigation"
  | "overlays"
  | "display"
  | "feedback"
  | "layout"
  | "animation"

export interface Category {
  id: CategoryId
  label: string
  icon: IconSvgElement
}

/** Category definitions with the icon shown on their sidebar group header. */
export const categories: Record<CategoryId, Category> = {
  blocks: { id: "blocks", label: "Blocks", icon: BlocksIcon },
  brand: { id: "brand", label: "Brand", icon: SparklesIcon },
  ai: { id: "ai", label: "AI", icon: SiriIcon },
  forms: { id: "forms", label: "Forms & Inputs", icon: FormIcon },
  navigation: { id: "navigation", label: "Navigation", icon: Navigation03Icon },
  overlays: { id: "overlays", label: "Overlays", icon: AppWindowIcon },
  display: { id: "display", label: "Data Display", icon: GridViewIcon },
  feedback: { id: "feedback", label: "Feedback", icon: Notification01Icon },
  layout: { id: "layout", label: "Layout", icon: LayoutTopIcon },
  animation: { id: "animation", label: "Animation", icon: SparklesIcon },
}

/** Order category groups render in when sorting by category. */
export const categoryOrder: CategoryId[] = [
  "blocks",
  "brand",
  "ai",
  "forms",
  "navigation",
  "overlays",
  "display",
  "feedback",
  "layout",
  "animation",
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
}

/**
 * Every registry item shown in the sidebar, with its icon, type, category, and
 * new status. This is the single source of truth for item metadata — the icon
 * map (`getItemIcon`) and category grouping both derive from it.
 */
export const items: Item[] = [
  // Blocks
  { name: "blank", icon: FileEmpty02Icon, type: "registry:block", category: "blocks", isNew: false },
  { name: "dashboard", icon: DashboardSquare01Icon, type: "registry:block", category: "blocks", isNew: false },
  { name: "login", icon: Login01Icon, type: "registry:block", category: "blocks", isNew: false },

  // Brand
  { name: "logo", icon: SparklesIcon, type: "registry:component", category: "brand", isNew: false },
  { name: "hero", icon: Image01Icon, type: "registry:component", category: "brand", isNew: false },
  { name: "brand-header", icon: LayoutTopIcon, type: "registry:component", category: "brand", isNew: false },
  { name: "brand-footer", icon: LayoutBottomIcon, type: "registry:component", category: "brand", isNew: false },
  { name: "brand-sidebar", icon: SidebarLeft01Icon, type: "registry:component", category: "brand", isNew: false },

  // AI
  { name: "prompt-input", icon: AiChat01Icon, type: "registry:component", category: "ai", isNew: true },
  { name: "model-selector", icon: RoboticIcon, type: "registry:ui", category: "ai", isNew: true },
  { name: "file-tree", icon: HierarchyFilesIcon, type: "registry:ui", category: "ai", isNew: true },
  { name: "web-preview", icon: GlobeIcon, type: "registry:ui", category: "ai", isNew: true },
  { name: "persona", icon: SiriNewIcon, type: "registry:ui", category: "ai", isNew: true },
  { name: "ai-orb", icon: SiriIcon, type: "registry:ui", category: "ai", isNew: true },
  { name: "bubble", icon: Comment01Icon, type: "registry:ui", category: "ai", isNew: false },
  { name: "message", icon: MessageMultiple01Icon, type: "registry:ui", category: "ai", isNew: false },
  { name: "message-scroller", icon: Message01Icon, type: "registry:ui", category: "ai", isNew: false },
  { name: "attachment", icon: AttachmentIcon, type: "registry:ui", category: "ai", isNew: false },
  { name: "marker", icon: HighlighterIcon, type: "registry:ui", category: "ai", isNew: false },

  // Forms & Inputs
  { name: "button", icon: CursorPointer01Icon, type: "registry:ui", category: "forms", isNew: false },
  { name: "button-group", icon: DistributeHorizontalCenterIcon, type: "registry:ui", category: "forms", isNew: false },
  { name: "checkbox", icon: Tick02Icon, type: "registry:ui", category: "forms", isNew: false },
  { name: "combobox", icon: SearchList01Icon, type: "registry:ui", category: "forms", isNew: false },
  { name: "field", icon: FormIcon, type: "registry:ui", category: "forms", isNew: false },
  { name: "input", icon: TextFontIcon, type: "registry:ui", category: "forms", isNew: false },
  { name: "input-group", icon: TextIndent01Icon, type: "registry:ui", category: "forms", isNew: false },
  { name: "input-otp", icon: PasswordValidationIcon, type: "registry:ui", category: "forms", isNew: false },
  { name: "label", icon: LabelIcon, type: "registry:ui", category: "forms", isNew: false },
  { name: "native-select", icon: SquareArrowDown02Icon, type: "registry:ui", category: "forms", isNew: false },
  { name: "radio-group", icon: RadioButtonIcon, type: "registry:ui", category: "forms", isNew: false },
  { name: "select", icon: SquareArrowDown01Icon, type: "registry:ui", category: "forms", isNew: false },
  { name: "slider", icon: SlidersHorizontalIcon, type: "registry:ui", category: "forms", isNew: false },
  { name: "switch", icon: ToggleOnIcon, type: "registry:ui", category: "forms", isNew: false },
  { name: "textarea", icon: ParagraphIcon, type: "registry:ui", category: "forms", isNew: false },
  { name: "toggle", icon: ToggleOffIcon, type: "registry:ui", category: "forms", isNew: false },
  { name: "toggle-group", icon: Grid2X2Icon, type: "registry:ui", category: "forms", isNew: false },
  { name: "calendar", icon: CalendarIcon, type: "registry:ui", category: "forms", isNew: false },
  { name: "date-picker", icon: DateTimeIcon, type: "registry:ui", category: "forms", isNew: false },

  // Navigation
  { name: "breadcrumb", icon: Route01Icon, type: "registry:ui", category: "navigation", isNew: false },
  { name: "command", icon: SearchIcon, type: "registry:ui", category: "navigation", isNew: false },
  { name: "menubar", icon: MenuCollapseIcon, type: "registry:ui", category: "navigation", isNew: false },
  { name: "navigation-menu", icon: Navigation03Icon, type: "registry:ui", category: "navigation", isNew: false },
  { name: "pagination", icon: MoreHorizontalIcon, type: "registry:ui", category: "navigation", isNew: false },
  { name: "sidebar", icon: SidebarLeftIcon, type: "registry:ui", category: "navigation", isNew: false },
  { name: "tabs", icon: BrowserIcon, type: "registry:ui", category: "navigation", isNew: false },

  // Overlays
  { name: "alert-dialog", icon: AlertDiamondIcon, type: "registry:ui", category: "overlays", isNew: false },
  { name: "context-menu", icon: MenuSquareIcon, type: "registry:ui", category: "overlays", isNew: false },
  { name: "dialog", icon: AppWindowIcon, type: "registry:ui", category: "overlays", isNew: false },
  { name: "drawer", icon: Cabinet01Icon, type: "registry:ui", category: "overlays", isNew: false },
  { name: "dropdown-menu", icon: Menu01Icon, type: "registry:ui", category: "overlays", isNew: false },
  { name: "hover-card", icon: CursorInfo01Icon, type: "registry:ui", category: "overlays", isNew: false },
  { name: "popover", icon: BubbleChatIcon, type: "registry:ui", category: "overlays", isNew: false },
  { name: "sheet", icon: SidebarRight01Icon, type: "registry:ui", category: "overlays", isNew: false },
  { name: "tooltip", icon: InformationCircleIcon, type: "registry:ui", category: "overlays", isNew: false },

  // Data Display
  { name: "accordion", icon: UnfoldMoreIcon, type: "registry:ui", category: "display", isNew: false },
  { name: "avatar", icon: UserIcon, type: "registry:ui", category: "display", isNew: false },
  { name: "badge", icon: Tag01Icon, type: "registry:ui", category: "display", isNew: false },
  { name: "card", icon: CreditCardIcon, type: "registry:ui", category: "display", isNew: false },
  { name: "carousel", icon: CarouselHorizontalIcon, type: "registry:ui", category: "display", isNew: false },
  { name: "chart", icon: BarChartIcon, type: "registry:ui", category: "display", isNew: false },
  { name: "data-table", icon: GridTableIcon, type: "registry:ui", category: "display", isNew: false },
  { name: "empty", icon: PackageOpenIcon, type: "registry:ui", category: "display", isNew: false },
  { name: "item", icon: ListViewIcon, type: "registry:ui", category: "display", isNew: false },
  { name: "kbd", icon: KeyboardIcon, type: "registry:ui", category: "display", isNew: false },
  { name: "table", icon: Table01Icon, type: "registry:ui", category: "display", isNew: false },
  { name: "aspect-ratio", icon: AspectRatioIcon, type: "registry:ui", category: "display", isNew: false },

  // Feedback
  { name: "alert", icon: AlertCircleIcon, type: "registry:ui", category: "feedback", isNew: false },
  { name: "progress", icon: HourglassIcon, type: "registry:ui", category: "feedback", isNew: false },
  { name: "skeleton", icon: Bone01Icon, type: "registry:ui", category: "feedback", isNew: false },
  { name: "spinner", icon: LoadingIcon, type: "registry:ui", category: "feedback", isNew: false },
  { name: "status", icon: StatusIcon, type: "registry:ui", category: "feedback", isNew: false },
  { name: "toast", icon: Notification01Icon, type: "registry:ui", category: "feedback", isNew: true },
  { name: "loader", icon: Loading03Icon, type: "registry:ui", category: "feedback", isNew: true },

  // Layout
  { name: "collapsible", icon: CollapseIcon, type: "registry:ui", category: "layout", isNew: false },
  { name: "direction", icon: ArrowLeftRightIcon, type: "registry:ui", category: "layout", isNew: false },
  { name: "resizable", icon: ArrowExpandIcon, type: "registry:ui", category: "layout", isNew: false },
  { name: "scroll-area", icon: MouseScroll01Icon, type: "registry:ui", category: "layout", isNew: false },
  { name: "separator", icon: SolidLine01Icon, type: "registry:ui", category: "layout", isNew: false },

  // Animation
  { name: "liquid", icon: BloodIcon, type: "registry:component", category: "animation", isNew: true },
  { name: "glass", icon: GlassWaterIcon, type: "registry:component", category: "animation", isNew: true },
  { name: "bubbles", icon: BubblesIcon, type: "registry:component", category: "animation", isNew: true },
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

/** Look up an icon by item (or nav) name, falling back to a generic cube. */
export function getItemIcon(name: string): IconSvgElement {
  return iconByName[name] ?? CubeIcon
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
      items: byCategory
        .get(id)!
        .sort((a, b) => a.title.localeCompare(b.title)),
    }))
}
