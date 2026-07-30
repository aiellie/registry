import type { ComponentType, ReactElement, ReactNode } from "react"

// blocks
import { blank } from "@/app/demo/[name]/blocks/blank"
import { chat } from "@/app/demo/[name]/blocks/chat"
import { dashboard } from "@/app/demo/[name]/blocks/dashboard"
import { login } from "@/app/demo/[name]/blocks/login"
import { newchat } from "@/app/demo/[name]/blocks/newchat"
// components
import BrandAvatarExample from "@/app/demo/[name]/components/brand-avatar"
import { brandFooter } from "@/app/demo/[name]/components/brand-footer"
import { brandHeader } from "@/app/demo/[name]/components/brand-header"
import { brandSidebar } from "@/app/demo/[name]/components/brand-sidebar"
import { hero } from "@/app/demo/[name]/components/hero"
import { loginForm } from "@/app/demo/[name]/components/login-form"
import { logo } from "@/app/demo/[name]/components/logo"

// ai elements
import PersonaExample from "@/app/demo/[name]/ui/persona"

// aiellie examples — the curated single demos also rendered inline on the
// home grid (`lib/aiellie-items.ts`)
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
// ui
import AccordionExample from "@/app/demo/[name]/ui/accordion"
import AlertExample from "@/app/demo/[name]/ui/alert"
import AlertDialogExample from "@/app/demo/[name]/ui/alert-dialog"
import AspectRatioExample from "@/app/demo/[name]/ui/aspect-ratio"
import AvatarExample from "@/app/demo/[name]/ui/avatar"
import BadgeExample from "@/app/demo/[name]/ui/badge"
import BreadcrumbExample from "@/app/demo/[name]/ui/breadcrumb"
import ButtonExample from "@/app/demo/[name]/ui/button"
import ButtonGroupExample from "@/app/demo/[name]/ui/button-group"
import CalendarExample from "@/app/demo/[name]/ui/calendar"
import CardExample from "@/app/demo/[name]/ui/card"
import CarouselExample from "@/app/demo/[name]/ui/carousel"
import ChartExample from "@/app/demo/[name]/ui/chart"
import CheckboxExample from "@/app/demo/[name]/ui/checkbox"
import CollapsibleExample from "@/app/demo/[name]/ui/collapsible"
import ColorPickerExample from "@/app/demo/[name]/ui/color-picker"
import ComboboxExample from "@/app/demo/[name]/ui/combobox"
import CommandExample from "@/app/demo/[name]/ui/command"
import ContextMenuExample from "@/app/demo/[name]/ui/context-menu"
import DataTableExample from "@/app/demo/[name]/ui/data-table"
import DatePickerExample from "@/app/demo/[name]/ui/date-picker"
import DialogExample from "@/app/demo/[name]/ui/dialog"
import DirectionExample from "@/app/demo/[name]/ui/direction"
import DrawerExample from "@/app/demo/[name]/ui/drawer"
import DropdownMenuExample from "@/app/demo/[name]/ui/dropdown-menu"
import EmptyExample from "@/app/demo/[name]/ui/empty"
import FieldExample from "@/app/demo/[name]/ui/field"
import HoverCardExample from "@/app/demo/[name]/ui/hover-card"
import InputExample from "@/app/demo/[name]/ui/input"
import InputGroupExample from "@/app/demo/[name]/ui/input-group"
import InputOTPExample from "@/app/demo/[name]/ui/input-otp"
import ItemExample from "@/app/demo/[name]/ui/item"
import KbdExample from "@/app/demo/[name]/ui/kbd"
import LabelExample from "@/app/demo/[name]/ui/label"
import LoaderExample from "@/app/demo/[name]/ui/loader"
import MenubarExample from "@/app/demo/[name]/ui/menubar"
import NativeSelectExample from "@/app/demo/[name]/ui/native-select"
import NavigationMenuExample from "@/app/demo/[name]/ui/navigation-menu"
import PaginationExample from "@/app/demo/[name]/ui/pagination"
import PopoverExample from "@/app/demo/[name]/ui/popover"
import ProgressExample from "@/app/demo/[name]/ui/progress"
import RadioGroupExample from "@/app/demo/[name]/ui/radio-group"
import ResizableExample from "@/app/demo/[name]/ui/resizable"
import ScrollAreaExample from "@/app/demo/[name]/ui/scroll-area"
import SelectExample from "@/app/demo/[name]/ui/select"
import SeparatorExample from "@/app/demo/[name]/ui/separator"
import SheetExample from "@/app/demo/[name]/ui/sheet"
import SidebarExample from "@/app/demo/[name]/ui/sidebar"
import SkeletonExample from "@/app/demo/[name]/ui/skeleton"
import SliderExample from "@/app/demo/[name]/ui/slider"
import SpinnerExample from "@/app/demo/[name]/ui/spinner"
import StatusExample from "@/app/demo/[name]/ui/status"
import SwitchExample from "@/app/demo/[name]/ui/switch"
import TableExample from "@/app/demo/[name]/ui/table"
import TabsExample from "@/app/demo/[name]/ui/tabs"
import TextareaExample from "@/app/demo/[name]/ui/textarea"
import ToastExample from "@/app/demo/[name]/ui/toast"
import ToggleExample from "@/app/demo/[name]/ui/toggle"
import ToggleGroupExample from "@/app/demo/[name]/ui/toggle-group"
import TooltipExample from "@/app/demo/[name]/ui/tooltip"

// A demo can be authored in one of two ways:
// 1. Object style: `{ name, components: { Default, ... } }` where each entry is
//    a rendered node. Nodes are stacked vertically in the preview.
// 2. Component style: a default-exported React component (e.g. `accordion.tsx`)
//    that lays out its own examples via `ExampleWrapper`/`Example`.
type Demo =
  | {
      name?: string // this must match the `registry.json` name
      components?: {
        [name: string]: ReactNode | ReactElement
      }
    }
  | ComponentType

/**
 * The aiellie examples are single self-contained demos (also rendered inline
 * on the home grid), so the full-page preview centers them instead of laying
 * out variants with `ExampleWrapper`.
 */
function centered(Demo: ComponentType) {
  return function CenteredDemo() {
    return (
      <div className="flex min-h-svh w-full justify-center bg-background bg-[radial-gradient(color-mix(in_oklch,var(--border)_70%,transparent)_1px,transparent_1px)] bg-size-[16px_16px] p-6">
        <div className="m-auto flex w-full max-w-2xl flex-col items-center">
          <Demo />
        </div>
      </div>
    )
  }
}

export const demos: { [name: string]: Demo } = {
  // blocks
  blank,
  chat,
  dashboard,
  login,
  newchat,
  // components
  "brand-header": brandHeader,
  "brand-footer": brandFooter,
  "brand-sidebar": brandSidebar,
  "brand-avatar": BrandAvatarExample,
  hero,
  liquid: centered(LiquidDemo),
  glass: centered(GlassDemo),
  bubbles: centered(BubblesDemo),
  "login-form": loginForm,
  logo,
  "prompt-input": centered(PromptInputDemo),

  // ai elements
  "model-selector": centered(ModelSelectorExample),
  "file-tree": centered(FileTreeDemo),
  "web-preview": centered(WebPreviewDemo),
  terminal: centered(TerminalDemo),
  "find-in-page": centered(FindInPageDemo),
  persona: PersonaExample,
  "ai-orb": AiOrbDemo,
  "mic-selector": centered(MicSelectorDemo),
  "speech-input": centered(SpeechInputDemo),
  "live-waveform": centered(LiveWaveformDemo),
  // ui
  accordion: AccordionExample,
  alert: AlertExample,
  "alert-dialog": AlertDialogExample,
  "aspect-ratio": AspectRatioExample,
  attachment: centered(AttachmentDemo),
  avatar: AvatarExample,
  badge: BadgeExample,
  breadcrumb: BreadcrumbExample,
  bubble: centered(BubbleDemo),
  button: ButtonExample,
  "button-group": ButtonGroupExample,
  calendar: CalendarExample,
  card: CardExample,
  carousel: CarouselExample,
  chart: ChartExample,
  checkbox: CheckboxExample,
  collapsible: CollapsibleExample,
  "color-picker": ColorPickerExample,
  combobox: ComboboxExample,
  command: CommandExample,
  "context-menu": ContextMenuExample,
  "data-table": DataTableExample,
  "date-picker": DatePickerExample,
  dialog: DialogExample,
  direction: DirectionExample,
  drawer: DrawerExample,
  "dropdown-menu": DropdownMenuExample,
  empty: EmptyExample,
  field: FieldExample,
  "hover-card": HoverCardExample,
  input: InputExample,
  "input-group": InputGroupExample,
  "input-otp": InputOTPExample,
  item: ItemExample,
  kbd: KbdExample,
  label: LabelExample,
  loader: LoaderExample,
  marker: centered(MarkerDemo),
  menubar: MenubarExample,
  message: centered(MessageDemo),
  "message-scroller": centered(MessageScrollerDemo),
  "native-select": NativeSelectExample,
  "navigation-menu": NavigationMenuExample,
  pagination: PaginationExample,
  popover: PopoverExample,
  progress: ProgressExample,
  "radio-group": RadioGroupExample,
  resizable: ResizableExample,
  "scroll-area": ScrollAreaExample,
  select: SelectExample,
  separator: SeparatorExample,
  sheet: SheetExample,
  sidebar: SidebarExample,
  skeleton: SkeletonExample,
  slider: SliderExample,
  spinner: SpinnerExample,
  status: StatusExample,
  switch: SwitchExample,
  table: TableExample,
  tabs: TabsExample,
  textarea: TextareaExample,
  toast: ToastExample,
  toggle: ToggleExample,
  "toggle-group": ToggleGroupExample,
  tooltip: TooltipExample,
}
