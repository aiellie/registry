import type { ComponentType, ReactElement, ReactNode } from "react"

// blocks
import { blank } from "@/app/demo/[name]/blocks/blank"
import { dashboard } from "@/app/demo/[name]/blocks/dashboard"

// components
import { brandHeader } from "@/app/demo/[name]/components/brand-header"
import { brandSidebar } from "@/app/demo/[name]/components/brand-sidebar"
import { hero } from "@/app/demo/[name]/components/hero"
import { login } from "@/app/demo/[name]/components/login"
import { logo } from "@/app/demo/[name]/components/logo"

// ui
import AccordionExample from "@/app/demo/[name]/ui/accordion"
import AlertExample from "@/app/demo/[name]/ui/alert"
import AlertDialogExample from "@/app/demo/[name]/ui/alert-dialog"
import { aspectRatio } from "@/app/demo/[name]/ui/aspect-ratio"
import AttachmentExample from "@/app/demo/[name]/ui/attachment"
import { avatar } from "@/app/demo/[name]/ui/avatar"
import { badge } from "@/app/demo/[name]/ui/badge"
import { breadcrumb } from "@/app/demo/[name]/ui/breadcrumb"
import { bubble } from "@/app/demo/[name]/ui/bubble"
import { button } from "@/app/demo/[name]/ui/button"
import { buttonGroup } from "@/app/demo/[name]/ui/button-group"
import { calendar } from "@/app/demo/[name]/ui/calendar"
import { card } from "@/app/demo/[name]/ui/card"
import { carousel } from "@/app/demo/[name]/ui/carousel"
import { chart } from "@/app/demo/[name]/ui/chart"
import { checkbox } from "@/app/demo/[name]/ui/checkbox"
import { collapsible } from "@/app/demo/[name]/ui/collapsible"
import { combobox } from "@/app/demo/[name]/ui/combobox"
import { command } from "@/app/demo/[name]/ui/command"
import { contextMenu } from "@/app/demo/[name]/ui/context-menu"
import { dataTable } from "@/app/demo/[name]/ui/data-table"
import { datePicker } from "@/app/demo/[name]/ui/date-picker"
import { dialog } from "@/app/demo/[name]/ui/dialog"
import { direction } from "@/app/demo/[name]/ui/direction"
import { drawer } from "@/app/demo/[name]/ui/drawer"
import { dropdownMenu } from "@/app/demo/[name]/ui/dropdown-menu"
import { empty } from "@/app/demo/[name]/ui/empty"
import { field } from "@/app/demo/[name]/ui/field"
import { hoverCard } from "@/app/demo/[name]/ui/hover-card"
import { input } from "@/app/demo/[name]/ui/input"
import { inputGroup } from "@/app/demo/[name]/ui/input-group"
import { inputOtp } from "@/app/demo/[name]/ui/input-otp"
import { item } from "@/app/demo/[name]/ui/item"
import { kbd } from "@/app/demo/[name]/ui/kbd"
import { label } from "@/app/demo/[name]/ui/label"
import { marker } from "@/app/demo/[name]/ui/marker"
import { menubar } from "@/app/demo/[name]/ui/menubar"
import { message } from "@/app/demo/[name]/ui/message"
import { messageScroller } from "@/app/demo/[name]/ui/message-scroller"
import { nativeSelect } from "@/app/demo/[name]/ui/native-select"
import { navigationMenu } from "@/app/demo/[name]/ui/navigation-menu"
import { pagination } from "@/app/demo/[name]/ui/pagination"
import { popover } from "@/app/demo/[name]/ui/popover"
import { progress } from "@/app/demo/[name]/ui/progress"
import { radioGroup } from "@/app/demo/[name]/ui/radio-group"
import { resizable } from "@/app/demo/[name]/ui/resizable"
import { scrollArea } from "@/app/demo/[name]/ui/scroll-area"
import { select } from "@/app/demo/[name]/ui/select"
import { separator } from "@/app/demo/[name]/ui/separator"
import { sheet } from "@/app/demo/[name]/ui/sheet"
import { sidebar } from "@/app/demo/[name]/ui/sidebar"
import { skeleton } from "@/app/demo/[name]/ui/skeleton"
import { slider } from "@/app/demo/[name]/ui/slider"
import { sonner } from "@/app/demo/[name]/ui/sonner"
import { spinner } from "@/app/demo/[name]/ui/spinner"
import { switchComponent } from "@/app/demo/[name]/ui/switch"
import { table } from "@/app/demo/[name]/ui/table"
import { tabs } from "@/app/demo/[name]/ui/tabs"
import { textarea } from "@/app/demo/[name]/ui/textarea"
import { toggle } from "@/app/demo/[name]/ui/toggle"
import { toggleGroup } from "@/app/demo/[name]/ui/toggle-group"
import { tooltip } from "@/app/demo/[name]/ui/tooltip"

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
  blank,
  dashboard,

  // components
  "brand-header": brandHeader,
  "brand-sidebar": brandSidebar,
  hero,
  login,
  logo,

  // ui
  accordion: AccordionExample,
  alert: AlertExample,
  "alert-dialog": AlertDialogExample,
  "aspect-ratio": aspectRatio,
  attachment: AttachmentExample,
  avatar,
  badge,
  breadcrumb,
  bubble,
  button,
  "button-group": buttonGroup,
  calendar,
  card,
  carousel,
  chart,
  checkbox,
  collapsible,
  combobox,
  command,
  "context-menu": contextMenu,
  "data-table": dataTable,
  "date-picker": datePicker,
  dialog,
  direction,
  drawer,
  "dropdown-menu": dropdownMenu,
  empty,
  field,
  "hover-card": hoverCard,
  input,
  "input-group": inputGroup,
  "input-otp": inputOtp,
  item,
  kbd,
  label,
  marker,
  menubar,
  message,
  "message-scroller": messageScroller,
  "native-select": nativeSelect,
  "navigation-menu": navigationMenu,
  pagination,
  popover,
  progress,
  "radio-group": radioGroup,
  resizable,
  "scroll-area": scrollArea,
  select,
  separator,
  sheet,
  sidebar,
  skeleton,
  slider,
  sonner,
  spinner,
  switch: switchComponent,
  table,
  tabs,
  textarea,
  toggle,
  "toggle-group": toggleGroup,
  tooltip,
}
