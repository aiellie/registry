import type { ComponentType, ReactElement, ReactNode } from "react"

// blocks
import BlankPage from "@/app/demo/[name]/blocks/blank/page"
import LoginPage from "@/app/demo/[name]/blocks/login/page"
import { shell } from "@/app/demo/[name]/blocks/shell/demo"
import { chat } from "@/app/demo/[name]/blocks/chat"
import { newchat } from "@/app/demo/[name]/blocks/newchat"
import { dashboard } from "@/app/demo/[name]/blocks/dashboard"
import { projects } from "@/app/demo/[name]/blocks/projects"
import { store } from "@/app/demo/[name]/blocks/store"

// brand
import BrandAvatarExample from "@/app/demo/[name]/components/brand/brand-avatar"
import LogoExample from "@/app/demo/[name]/components/brand/logo"
import { brandHeader } from "@/app/demo/[name]/components/brand/brand-header"
import { brandFooter } from "@/app/demo/[name]/components/brand/brand-footer"
import { brandSidebar } from "@/app/demo/[name]/components/brand-sidebar"

// components
import { hero } from "@/app/demo/[name]/components/hero"
import { promo } from "@/app/demo/[name]/components/promo"
import { productGrid } from "@/app/demo/[name]/components/product-grid"
import { promptInput } from "@/app/demo/[name]/components/prompt-input"
import IconPickerExample from "@/app/demo/[name]/components/icon-picker"
import EventCalendarExample from "@/app/demo/[name]/components/data/event-calendar"
import LiquidExample from "@/app/demo/[name]/components/liquid"
import GlassExample from "@/app/demo/[name]/components/glass"
import BubblesExample from "@/app/demo/[name]/components/bubbles"
import AnimatedBotsExample from "@/app/demo/[name]/components/animated-bots"

// ai + audio
import PersonaExample from "@/app/demo/[name]/aiellie/persona"
import OrbExample from "@/app/demo/[name]/aiellie/orb"
import MicSelectorExample from "@/app/demo/[name]/aiellie/mic-selector"
import SpeechInputExample from "@/app/demo/[name]/aiellie/speech-input"
import LiveWaveformExample from "@/app/demo/[name]/aiellie/live-waveform"
import ModelSelectorExample from "@/app/demo/[name]/aiellie/model-selector"
import TerminalExample from "@/app/demo/[name]/aiellie/terminal"
import WebPreviewExample from "@/app/demo/[name]/aiellie/web-preview"
import FindInPageExample from "@/app/demo/[name]/aiellie/find-in-page"
import CodeWorkspaceExample from "@/app/demo/[name]/aiellie/code-workspace"

// aiellie ui
import StatusExample from "@/app/demo/[name]/aiellie/status"
import TimePickerExample from "@/app/demo/[name]/aiellie/time-picker"
import LoaderExample from "@/app/demo/[name]/aiellie/loader"
import NativeSelectExample from "@/app/demo/[name]/ui/native-select"
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
import ComboboxExample from "@/app/demo/[name]/ui/combobox"
import CommandExample from "@/app/demo/[name]/ui/command"
import ContextMenuExample from "@/app/demo/[name]/ui/context-menu"
import DataTableExample from "@/app/demo/[name]/components/data/data-table"
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
import MenubarExample from "@/app/demo/[name]/ui/menubar"
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
import SwitchExample from "@/app/demo/[name]/ui/switch"
import TableExample from "@/app/demo/[name]/ui/table"
import TabsExample from "@/app/demo/[name]/ui/tabs"
import TextareaExample from "@/app/demo/[name]/ui/textarea"
import ToastExample from "@/app/demo/[name]/ui/toast"
import ToggleExample from "@/app/demo/[name]/ui/toggle"
import ToggleGroupExample from "@/app/demo/[name]/ui/toggle-group"
import TooltipExample from "@/app/demo/[name]/ui/tooltip"

// code
import AgentExample from "@/app/demo/[name]/code/agent"
import ArtifactExample from "@/app/demo/[name]/code/artifact"
import CodeBlockExample from "@/app/demo/[name]/code/code-block"
import CommitExample from "@/app/demo/[name]/code/commit"
import EnvironmentVariablesExample from "@/app/demo/[name]/code/environment-variables"
import FileTreeExample from "@/app/demo/[name]/aiellie/file-tree"
import PackageInfoExample from "@/app/demo/[name]/code/package-info"
import SnippetExample from "@/app/demo/[name]/code/snippet"
import StackTraceExample from "@/app/demo/[name]/code/stack-trace"
// chat
import AttachmentExample from "@/app/demo/[name]/ui/attachment"
import BubbleExample from "@/app/demo/[name]/ui/bubble"
import ChainOfThoughtExample from "@/app/demo/[name]/chat/chain-of-thought"
import MarkerExamples from "@/app/demo/[name]/ui/marker"
import MessageExample from "@/app/demo/[name]/ui/message"
import MessageScrollerExample from "@/app/demo/[name]/ui/message-scroller"
// design
import ColorPickerExample from "@/app/demo/[name]/design/color-picker"
import TailwindColorPickerExample from "@/app/demo/[name]/design/tailwind-color-picker"
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

export const demos: { [name: string]: Demo } = {
  // blocks
  blank: BlankPage,
  chat,
  dashboard,
  login: LoginPage,
  newchat,
  projects,
  shell,
  store,
  // brand
  "brand-avatar": BrandAvatarExample,
  logo: LogoExample,
  "brand-header": brandHeader,
  "brand-footer": brandFooter,
  "brand-sidebar": brandSidebar,
  hero,
  promo,
  // components
  "product-grid": productGrid,
  "prompt-input": promptInput,
  "icon-picker": IconPickerExample,
  "event-calendar": EventCalendarExample,
  liquid: LiquidExample,
  glass: GlassExample,
  bubbles: BubblesExample,
  "animated-bots": AnimatedBotsExample,
  // ai + audio
  persona: PersonaExample,
  orb: OrbExample,
  "mic-selector": MicSelectorExample,
  "speech-input": SpeechInputExample,
  "live-waveform": LiveWaveformExample,
  "model-selector": ModelSelectorExample,
  terminal: TerminalExample,
  "web-preview": WebPreviewExample,
  "find-in-page": FindInPageExample,
  "code-workspace": CodeWorkspaceExample,
  // aiellie ui
  status: StatusExample,
  "time-picker": TimePickerExample,
  loader: LoaderExample,
  "native-select": NativeSelectExample,
  // chat
  attachment: AttachmentExample,
  bubble: BubbleExample,
  "chain-of-thought": ChainOfThoughtExample,
  marker: MarkerExamples,
  message: MessageExample,
  "message-scroller": MessageScrollerExample,

  // code
  agent: AgentExample,
  artifact: ArtifactExample,
  "code-block": CodeBlockExample,
  commit: CommitExample,
  "environment-variables": EnvironmentVariablesExample,
  "file-tree": FileTreeExample,
  "package-info": PackageInfoExample,
  snippet: SnippetExample,
  "stack-trace": StackTraceExample,
  // design
  "color-picker": ColorPickerExample,
  "tailwind-color-picker": TailwindColorPickerExample,
  // ui
  accordion: AccordionExample,
  alert: AlertExample,
  "alert-dialog": AlertDialogExample,
  "aspect-ratio": AspectRatioExample,
  avatar: AvatarExample,
  badge: BadgeExample,
  breadcrumb: BreadcrumbExample,
  button: ButtonExample,
  "button-group": ButtonGroupExample,
  calendar: CalendarExample,
  card: CardExample,
  carousel: CarouselExample,
  chart: ChartExample,
  checkbox: CheckboxExample,
  collapsible: CollapsibleExample,
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
  menubar: MenubarExample,
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
  switch: SwitchExample,
  table: TableExample,
  tabs: TabsExample,
  textarea: TextareaExample,
  toast: ToastExample,
  toggle: ToggleExample,
  "toggle-group": ToggleGroupExample,
  tooltip: TooltipExample,
}
