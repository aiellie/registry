import {
  AiChat01Icon,
  CodeIcon,
  AttachmentIcon,
  AudioWave01Icon,
  AudioWave02Icon,
  BloodIcon,
  BubblesIcon,
  Comment01Icon,
  ComputerTerminal01Icon,
  CubeIcon,
  GlassWaterIcon,
  GlobeIcon,
  HierarchyFilesIcon,
  HighlighterIcon,
  Home01Icon,
  Message01Icon,
  MessageMultiple01Icon,
  Mic01Icon,
  PaintBucketIcon,
  RoboticIcon,
  Search01Icon,
  SiriIcon,
  SmileIcon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"
import type { ComponentType } from "react"

import {
  AiOrbDemo,
  AttachmentDemo,
  BubbleDemo,
  BubblesDemo,
  FileTreeDemo,
  FindInPageDemo,
  GlassDemo,
  LiquidDemo,
  LiveWaveformDemo,
  MarkerDemo,
  MessageDemo,
  MessageScrollerDemo,
  MicSelectorDemo,
  ModelSelectorExample,
  PromptInputDemo,
  SpeechInputDemo,
  TerminalDemo,
  WebPreviewDemo,
} from "@/components/aiellie/examples"
import type { Component } from "@/lib/registry"

/**
 * The two ways the registry sidebar can group its items: by their registry
 * `type` (Blocks / Components / UI Primitives) or by their curated `category`.
 */
export type SortMode = "type" | "category"

export type CategoryId = "chat" | "code" | "audio" | "web" | "animation"

export interface Category {
  id: CategoryId
  label: string
  icon: IconSvgElement
}

/** Category definitions with the icon shown on their sidebar group header. */
export const categories: Record<CategoryId, Category> = {
  chat: { id: "chat", label: "Chat", icon: AiChat01Icon },
  code: { id: "code", label: "Code", icon: CodeIcon },
  audio: { id: "audio", label: "Audio", icon: AudioWave01Icon },
  web: { id: "web", label: "Web", icon: GlobeIcon },
  animation: { id: "animation", label: "Animation", icon: BloodIcon },
}

/** Order category groups render in when sorting by category. */
export const categoryOrder: CategoryId[] = [
  "chat",
  "code",
  "audio",
  "web",
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
  /** Whether the item appears in the home page grid. */
  displayHome: boolean
  /**
   * Live example rendered inside the home grid card. Items without one fall
   * back to the scaled `/demo/<name>` iframe.
   */
  demo?: ComponentType
}

/**
 * Every registry item shown in the sidebar, with its icon, type, category, and
 * new status. This is the single source of truth for item metadata — the icon
 * map (`getItemIcon`) and category grouping both derive from it.
 */
export const items: Item[] = [
  // AI
  {
    name: "prompt-input",
    icon: AiChat01Icon,
    type: "registry:component",
    category: "chat",
    isNew: true,
    displayHome: true,
    demo: PromptInputDemo,
  },
  {
    name: "model-selector",
    icon: RoboticIcon,
    type: "registry:ui",
    category: "chat",
    isNew: true,
    displayHome: true,
    demo: ModelSelectorExample,
  },
  {
    name: "file-tree",
    icon: HierarchyFilesIcon,
    type: "registry:ui",
    category: "code",
    isNew: true,
    displayHome: true,
    demo: FileTreeDemo,
  },
  {
    name: "web-preview",
    icon: GlobeIcon,
    type: "registry:ui",
    category: "web",
    isNew: true,
    displayHome: true,
    demo: WebPreviewDemo,
  },
  {
    name: "terminal",
    icon: ComputerTerminal01Icon,
    type: "registry:ui",
    category: "code",
    isNew: true,
    displayHome: true,
    demo: TerminalDemo,
  },
  {
    name: "find-in-page",
    icon: Search01Icon,
    type: "registry:ui",
    category: "web",
    isNew: true,
    displayHome: true,
    demo: FindInPageDemo,
  },
  {
    name: "ai-orb",
    icon: SiriIcon,
    type: "registry:ui",
    category: "audio",
    isNew: true,
    displayHome: true,
    demo: AiOrbDemo,
  },
  {
    name: "mic-selector",
    icon: Mic01Icon,
    type: "registry:ui",
    category: "audio",
    isNew: true,
    displayHome: true,
    demo: MicSelectorDemo,
  },
  {
    name: "speech-input",
    icon: AudioWave01Icon,
    type: "registry:ui",
    category: "audio",
    isNew: true,
    displayHome: true,
    demo: SpeechInputDemo,
  },
  {
    name: "live-waveform",
    icon: AudioWave02Icon,
    type: "registry:ui",
    category: "audio",
    isNew: true,
    displayHome: true,
    demo: LiveWaveformDemo,
  },
  {
    name: "bubble",
    icon: Comment01Icon,
    type: "registry:ui",
    category: "chat",
    isNew: false,
    displayHome: true,
    demo: BubbleDemo,
  },
  {
    name: "message",
    icon: MessageMultiple01Icon,
    type: "registry:ui",
    category: "chat",
    isNew: false,
    displayHome: true,
    demo: MessageDemo,
  },
  {
    name: "message-scroller",
    icon: Message01Icon,
    type: "registry:ui",
    category: "chat",
    isNew: false,
    displayHome: true,
    demo: MessageScrollerDemo,
  },
  {
    name: "attachment",
    icon: AttachmentIcon,
    type: "registry:ui",
    category: "chat",
    isNew: false,
    displayHome: true,
    demo: AttachmentDemo,
  },
  {
    name: "marker",
    icon: HighlighterIcon,
    type: "registry:ui",
    category: "chat",
    isNew: false,
    displayHome: true,
    demo: MarkerDemo,
  },
  // Animation
  {
    name: "liquid",
    icon: BloodIcon,
    type: "registry:component",
    category: "animation",
    isNew: true,
    displayHome: true,
    demo: LiquidDemo,
  },
  {
    name: "glass",
    icon: GlassWaterIcon,
    type: "registry:component",
    category: "animation",
    isNew: true,
    displayHome: true,
    demo: GlassDemo,
  },
  {
    name: "bubbles",
    icon: BubblesIcon,
    type: "registry:component",
    category: "animation",
    isNew: true,
    displayHome: true,
    demo: BubblesDemo,
  },
]

/** Icons for non-item sidebar entries (Getting Started nav + theme). */
const extraIcons: Record<string, IconSvgElement> = {
  home: Home01Icon,
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
    const category = itemByName.get(component.name)?.category ?? "chat"
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
