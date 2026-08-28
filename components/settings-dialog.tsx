"use client"

import * as React from "react"

import { Warp } from "@paper-design/shaders-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { Icons } from "@/components/icons/icons"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Slider } from "@/components/ui/slider"
import { Status, StatusIndicator, StatusLabel } from "@/components/aiellie/ui/status"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import {
  AiBrain01Icon,
  AiImageIcon,
  AnchorIcon,
  AppleFinderIcon,
  Archive02Icon,
  ArrowUpRight01Icon,
  AtSignIcon,
  BarChartIcon,
  BirdIcon,
  BookOpen02Icon,
  BriefcaseIcon,
  BrowserIcon,
  CatIcon,
  CheckListIcon,
  CheckmarkCircle02Icon,
  ChromeIcon,
  Configuration01Icon,
  CreditCardIcon,
  Delete02Icon,
  Download01Icon,
  EggIcon,
  FigmaIcon,
  FishIcon,
  Folder01Icon,
  FrameIcon,
  GaugeIcon,
  GitBranchIcon,
  Globe02Icon,
  GlobeIcon,
  GoogleDriveIcon,
  Grid2X2Icon,
  GridViewIcon,
  HistoryIcon,
  HomeIcon,
  KeyboardIcon,
  LaptopIcon,
  LinkIcon,
  Menu09Icon,
  MessageIcon,
  Note01Icon,
  NotificationIcon,
  PaintBoardIcon,
  PlugIcon,
  RecordIcon,
  SearchIcon,
  SettingsIcon,
  ShieldIcon,
  SlackIcon,
  SmartPhone01Icon,
  SparklesIcon,
  SplitIcon,
  Sun01Icon,
  TerminalIcon,
  Tick02Icon,
  UserCircle02Icon,
  UserIcon,
  VoiceIcon,
} from "@hugeicons/core-free-icons"

type NavItem = {
  name: string
  icon: IconSvgElement
  external?: boolean
}

const navCategories: { label: string; items: NavItem[] }[] = [
  {
    label: "Personal",
    items: [
      { name: "General", icon: SettingsIcon },
      { name: "Profile", icon: UserCircle02Icon },
      { name: "Appearance", icon: Sun01Icon },
      { name: "Voice", icon: VoiceIcon },
      { name: "Configuration", icon: Configuration01Icon },
      { name: "Personalization", icon: HistoryIcon },
      { name: "Pets", icon: CatIcon },
      { name: "Keyboard shortcuts", icon: KeyboardIcon },
      { name: "Usage & billing", icon: GaugeIcon },
      { name: "Account", icon: UserIcon, external: true },
      { name: "Home", icon: HomeIcon },
      { name: "Navigation", icon: Menu09Icon },
      { name: "Language & region", icon: Globe02Icon },
    ],
  },
  {
    label: "Integrations",
    items: [
      { name: "Appshots", icon: FrameIcon },
      { name: "Plugins", icon: AtSignIcon },
      { name: "Browser", icon: BrowserIcon },
      { name: "Computer use", icon: SparklesIcon },
      { name: "Connected accounts", icon: LinkIcon },
    ],
  },
  {
    label: "Coding",
    items: [
      { name: "Hooks", icon: AnchorIcon },
      { name: "Connections", icon: GlobeIcon },
      { name: "Git", icon: GitBranchIcon },
      { name: "Environments", icon: TerminalIcon },
      { name: "Worktrees", icon: SplitIcon },
      { name: "Advanced", icon: SettingsIcon },
    ],
  },
  {
    label: "Archived",
    items: [{ name: "Archived chats", icon: Archive02Icon }],
  },
  {
    label: "Settings",
    items: [
      { name: "Privacy", icon: ShieldIcon },
      { name: "Billing", icon: CreditCardIcon },
      { name: "Usage", icon: BarChartIcon },
      { name: "Capabilities", icon: BriefcaseIcon },
      { name: "Cowork", icon: CheckListIcon },
    ],
  },
  {
    label: "Customize",
    items: [
      { name: "Skills", icon: BookOpen02Icon },
      { name: "Connectors", icon: Grid2X2Icon },
      { name: "Plugins", icon: PlugIcon },
      { name: "Memory", icon: AiBrain01Icon },
    ],
  },
  {
    label: "Notifications",
    items: [
      { name: "Notifications", icon: NotificationIcon },
      { name: "Mark as read", icon: Tick02Icon },
    ],
  },
  {
    label: "Communication",
    items: [
      { name: "Messages & media", icon: MessageIcon },
      { name: "Audio & video", icon: RecordIcon },
    ],
  },
  {
    label: "Accessibility",
    items: [{ name: "Accessibility", icon: PaintBoardIcon }],
  },
]

const allNavItems = navCategories.flatMap((category) =>
  category.items.map((item) => ({ ...item, category: category.label }))
)

function getItemKey(category: string, name: string) {
  return `${category}::${name}`
}

/* ------------------------------------------------------------------------- */
/* Building blocks — shared shapes for every panel, matching AiellieProfile: */
/* section headers, muted label/value rows, bordered stat grids, icon chips. */
/* ------------------------------------------------------------------------- */

function SettingsPanel({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-6">{children}</div>
}

function SettingsSection({
  title,
  action,
  children,
}: {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium">{title}</p>
        {action ? (
          <div className="-my-1 flex items-center [&>[data-slot=button]]:-me-2.5">
            {action}
          </div>
        ) : null}
      </div>
      {children}
    </section>
  )
}

function SettingsNote({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>
}

function SettingsRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  const labelId = React.useId()
  // Name the control after the row label for assistive tech; the label is
  // otherwise an unassociated sibling span.
  const content = React.isValidElement(children)
    ? React.cloneElement(
        children as React.ReactElement<{ "aria-labelledby"?: string }>,
        { "aria-labelledby": labelId }
      )
    : children
  return (
    <div className="flex items-center justify-between gap-4 py-1.5 text-sm">
      <span id={labelId} className="text-muted-foreground">
        {label}
      </span>
      {content}
    </div>
  )
}

function SettingsValue({ children }: { children: React.ReactNode }) {
  return <span className="font-medium tabular-nums">{children}</span>
}

function SettingsStatGrid({
  stats,
}: {
  stats: { value: string; label: string }[]
}) {
  return (
    <div className="grid auto-cols-fr grid-flow-col rounded-xl border">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center gap-1 px-2 py-4 not-first:border-s"
        >
          <span className="text-lg font-semibold tabular-nums">
            {stat.value}
          </span>
          <span className="text-xs text-muted-foreground">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}

function SettingsChipRow({
  icon,
  name,
  meta,
  children,
}: {
  icon: React.ReactNode
  name: React.ReactNode
  meta?: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1 text-sm">
      <span className="flex items-center gap-2.5">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground [&_svg]:size-3.5">
          {icon}
        </span>
        {name}
      </span>
      <span className="flex items-center gap-3">
        {meta ? (
          <span className="text-muted-foreground tabular-nums">{meta}</span>
        ) : null}
        {children}
      </span>
    </div>
  )
}

function SettingsSelect({
  items,
  defaultValue,
  ...props
}: {
  items: string[]
  defaultValue: string
} & React.AriaAttributes) {
  const selectItems = items.map((item) => ({ label: item, value: item }))
  return (
    <Select items={selectItems} defaultValue={defaultValue}>
      <SelectTrigger size="sm" {...props}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {selectItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

function SettingsToggleGroup({
  options,
  defaultValue,
  ...props
}: {
  options: { label: string; value: string }[]
  defaultValue: string
} & React.AriaAttributes) {
  // Controlled so clicking the active item can't deselect down to an empty
  // state — these rows are mutually exclusive choices.
  const [value, setValue] = React.useState([defaultValue])
  return (
    <ToggleGroup
      variant="outline"
      size="sm"
      value={value}
      onValueChange={(next) => {
        if (next.length > 0) setValue(next)
      }}
      {...props}
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          aria-label={option.label}
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

function SettingsTextTabs({
  options,
  defaultValue,
}: {
  options: readonly string[]
  defaultValue?: string
}) {
  const [active, setActive] = React.useState(defaultValue ?? options[0])
  return (
    <div className="flex items-center gap-3">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setActive(option)}
          className={cn(
            "text-sm transition-colors",
            active === option
              ? "font-medium text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

function SettingsSliderRow({
  label,
  value,
  children,
}: {
  label: string
  value?: string
  children: React.ReactElement<{ "aria-labelledby"?: string }>
}) {
  const labelId = React.useId()
  return (
    <div className="flex flex-col gap-2 py-1.5">
      <div className="flex items-center justify-between text-sm">
        <span id={labelId} className="text-muted-foreground">
          {label}
        </span>
        {value ? (
          <span className="font-medium tabular-nums">{value}</span>
        ) : null}
      </div>
      {React.cloneElement(children, { "aria-labelledby": labelId })}
    </div>
  )
}

function SettingsShortcutRow({
  label,
  keys,
}: {
  label: string
  keys: string[]
}) {
  return (
    <SettingsRow label={label}>
      <KbdGroup>
        {keys.map((key) => (
          <Kbd key={key}>{key}</Kbd>
        ))}
      </KbdGroup>
    </SettingsRow>
  )
}

function SettingsFallbackPanel() {
  return (
    <SettingsPanel>
      <SettingsNote>Nothing to configure here yet.</SettingsNote>
    </SettingsPanel>
  )
}

/* ----------------------------- Personal panels ---------------------------- */

function GeneralPanel() {
  return (
    <SettingsPanel>
      <SettingsSection title="Preferences">
        <SettingsRow label="Startup page">
          <SettingsToggleGroup
            options={[
              { label: "Home", value: "home" },
              { label: "New chat", value: "new" },
              { label: "Last chat", value: "last" },
            ]}
            defaultValue="home"
          />
        </SettingsRow>
        <SettingsRow label="Auto-save chats">
          <Switch defaultChecked />
        </SettingsRow>
        <SettingsRow label="Show suggestions">
          <Switch defaultChecked />
        </SettingsRow>
        <SettingsRow label="Confirm before closing">
          <Switch />
        </SettingsRow>
      </SettingsSection>
      <SettingsSection title="Defaults">
        <SettingsRow label="Model">
          <SettingsSelect
            items={["Fable 5", "Opus 5", "Sonnet 5", "Haiku 4.5"]}
            defaultValue="Fable 5"
          />
        </SettingsRow>
        <SettingsRow label="Reasoning effort">
          <SettingsToggleGroup
            options={[
              { label: "Low", value: "low" },
              { label: "Medium", value: "medium" },
              { label: "High", value: "high" },
            ]}
            defaultValue="high"
          />
        </SettingsRow>
        <SettingsRow label="Fast mode">
          <Switch />
        </SettingsRow>
      </SettingsSection>
    </SettingsPanel>
  )
}

function ProfilePanel() {
  return (
    <SettingsPanel>
      <div className="flex flex-col items-center gap-1 text-center">
        <Avatar className="mb-3 size-20">
          <AvatarImage
            src="/avatars/aiellie.png"
            alt="3D avatar of Ai Ellie, a woman with brown hair and tortoiseshell glasses."
          />
          <AvatarFallback>AE</AvatarFallback>
        </Avatar>
        <p className="font-heading text-xl font-semibold tracking-tight">
          Ellie Linder
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>@aiellie.dev</span>
          <span>·</span>
          <Badge variant="secondary" className="rounded-full">
            Plus
          </Badge>
        </div>
      </div>
      <SettingsSection title="Details">
        <div className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="profile-display-name">Display name</FieldLabel>
            <Input id="profile-display-name" defaultValue="Ellie Linder" />
          </Field>
          <Field>
            <FieldLabel htmlFor="profile-handle">Handle</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>@</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput id="profile-handle" defaultValue="aiellie.dev" />
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="profile-bio">Bio</FieldLabel>
            <Textarea
              id="profile-bio"
              rows={3}
              defaultValue="Design engineer. Building a registry, feeding pixel pets."
            />
            <FieldDescription>Shown on your public profile.</FieldDescription>
          </Field>
        </div>
      </SettingsSection>
      <SettingsSection title="Visibility">
        <SettingsRow label="Public profile">
          <Switch />
        </SettingsRow>
        <SettingsRow label="Show streak on profile">
          <Switch defaultChecked />
        </SettingsRow>
      </SettingsSection>
    </SettingsPanel>
  )
}

function AppearancePanel() {
  return (
    <SettingsPanel>
      <SettingsSection title="Theme">
        <RadioGroup defaultValue="system" className="grid grid-cols-3 gap-2">
          {[
            { value: "light", label: "Light", swatch: "bg-background" },
            { value: "dark", label: "Dark", swatch: "bg-foreground" },
            {
              value: "system",
              label: "System",
              swatch: "bg-linear-to-r from-background to-foreground",
            },
          ].map((theme) => (
            <FieldLabel
              key={theme.value}
              htmlFor={`appearance-theme-${theme.value}`}
            >
              <Field orientation="horizontal">
                <span
                  className={cn(
                    "size-4 shrink-0 rounded-full border",
                    theme.swatch
                  )}
                />
                <FieldContent>
                  <FieldTitle>{theme.label}</FieldTitle>
                </FieldContent>
                <RadioGroupItem
                  value={theme.value}
                  id={`appearance-theme-${theme.value}`}
                />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
      </SettingsSection>
      <SettingsSection title="Interface">
        <SettingsRow label="Density">
          <SettingsToggleGroup
            options={[
              { label: "Comfortable", value: "comfortable" },
              { label: "Compact", value: "compact" },
            ]}
            defaultValue="comfortable"
          />
        </SettingsRow>
        <SettingsRow label="Reduce transparency">
          <Switch />
        </SettingsRow>
        <SettingsSliderRow label="Font size" value="15px">
          <Slider defaultValue={[15]} min={12} max={20} step={1} />
        </SettingsSliderRow>
      </SettingsSection>
      <SettingsSection title="Code">
        <SettingsRow label="Code font">
          <SettingsSelect
            items={["JetBrains Mono", "Fira Code", "SF Mono"]}
            defaultValue="JetBrains Mono"
          />
        </SettingsRow>
        <SettingsRow label="Ligatures">
          <Switch defaultChecked />
        </SettingsRow>
        <SettingsRow label="Line numbers">
          <Switch defaultChecked />
        </SettingsRow>
      </SettingsSection>
    </SettingsPanel>
  )
}

const VOICES: {
  name: string
  detail: string
  colors: [string, string, string]
}[] = [
  {
    name: "Aura",
    detail: "Bright and expressive",
    colors: ["#a5b4fc", "#e0e7ff", "#4f46e5"],
  },
  {
    name: "Cove",
    detail: "Calm and steady",
    colors: ["#67e8f9", "#ecfeff", "#0e7490"],
  },
  {
    name: "Ember",
    detail: "Warm and low",
    colors: ["#fdba74", "#ffedd5", "#c2410c"],
  },
  {
    name: "Tide",
    detail: "Deep and unhurried",
    colors: ["#93c5fd", "#eff6ff", "#1d4ed8"],
  },
]

// Same shader recipe as the orb defaults, clipped to a small circle.
// The wrapper must be a sized block-level box (flex) — an inline span
// ignores size-20 and lets the shader mount size itself to the slide.
function VoiceOrb({ colors }: { colors: [string, string, string] }) {
  return (
    <span className="flex size-20 shrink-0 overflow-hidden rounded-full">
      <Warp
        width={80}
        height={80}
        colors={colors}
        shape="edge"
        proportion={0.35}
        softness={1}
        distortion={0.32}
        swirl={1}
        swirlIterations={0}
        shapeScale={0}
        speed={12.2}
        scale={0.31}
        rotation={176}
        offsetX={0.65}
        offsetY={0.09}
      />
    </span>
  )
}

function VoicePanel() {
  const [voice, setVoice] = React.useState("Cove")
  return (
    <SettingsPanel>
      <SettingsSection title="Voice">
        <Carousel className="mx-10">
          <CarouselContent>
            {VOICES.map((option) => (
              <CarouselItem key={option.name} className="basis-1/2">
                <button
                  type="button"
                  aria-pressed={voice === option.name}
                  onClick={() => setVoice(option.name)}
                  className={cn(
                    "flex w-full flex-col items-center gap-2 rounded-xl border p-4 text-center transition-colors",
                    voice === option.name ? "border-ring" : "hover:bg-muted/50"
                  )}
                >
                  <VoiceOrb colors={option.colors} />
                  <span className="text-sm font-medium">{option.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {option.detail}
                  </span>
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <Tooltip>
            <TooltipTrigger
              render={<CarouselPrevious className="-start-10" />}
            />
            <TooltipContent>Previous voices</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={<CarouselNext className="-end-10" />} />
            <TooltipContent>More voices</TooltipContent>
          </Tooltip>
        </Carousel>
      </SettingsSection>
      <SettingsSection title="Playback">
        <SettingsSliderRow label="Speaking rate" value="1.0x">
          <Slider defaultValue={[1]} min={0.5} max={2} step={0.1} />
        </SettingsSliderRow>
        <SettingsRow label="Voice replies">
          <Switch defaultChecked />
        </SettingsRow>
      </SettingsSection>
      <SettingsSection title="Input">
        <SettingsRow label="Input device">
          <SettingsSelect
            items={["MacBook Pro Microphone", "AirPods Pro"]}
            defaultValue="MacBook Pro Microphone"
          />
        </SettingsRow>
        <SettingsRow label="Push to talk">
          <Switch defaultChecked />
        </SettingsRow>
        <SettingsShortcutRow label="Shortcut" keys={["⌥", "Space"]} />
      </SettingsSection>
    </SettingsPanel>
  )
}

function ConfigurationPanel() {
  return (
    <SettingsPanel>
      <SettingsSection title="Model">
        <SettingsRow label="Context window">
          <SettingsValue>200K tokens</SettingsValue>
        </SettingsRow>
        <SettingsRow label="Output limit">
          <SettingsToggleGroup
            options={[
              { label: "8K", value: "8k" },
              { label: "16K", value: "16k" },
              { label: "32K", value: "32k" },
            ]}
            defaultValue="16k"
          />
        </SettingsRow>
        <SettingsSliderRow label="Temperature" value="0.7">
          <Slider defaultValue={[0.7]} min={0} max={1} step={0.1} />
        </SettingsSliderRow>
        <SettingsRow label="Streaming">
          <Switch defaultChecked />
        </SettingsRow>
      </SettingsSection>
      <SettingsSection title="Tools">
        <SettingsRow label="Parallel tool calls">
          <Switch defaultChecked />
        </SettingsRow>
        <SettingsRow label="Max agents">
          <SettingsSelect items={["4", "8", "16"]} defaultValue="8" />
        </SettingsRow>
      </SettingsSection>
    </SettingsPanel>
  )
}

function PersonalizationPanel() {
  return (
    <SettingsPanel>
      <SettingsSection title="Memory & history">
        <SettingsRow label="Reference chat history">
          <Switch defaultChecked />
        </SettingsRow>
        <SettingsRow label="Reference memory">
          <Switch defaultChecked />
        </SettingsRow>
        <SettingsRow label="Personalized suggestions">
          <Switch />
        </SettingsRow>
      </SettingsSection>
      <SettingsSection title="About you">
        <div className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="personalization-nickname">
              What should Ellie call you?
            </FieldLabel>
            <Input id="personalization-nickname" defaultValue="Ellie" />
          </Field>
          <Field>
            <FieldLabel htmlFor="personalization-about">
              What should Ellie know about you?
            </FieldLabel>
            <Textarea
              id="personalization-about"
              rows={4}
              defaultValue="Design engineer. Prefers warm, concise answers with working code over long explanations."
            />
            <FieldDescription>
              Included at the start of every chat.
            </FieldDescription>
          </Field>
        </div>
      </SettingsSection>
    </SettingsPanel>
  )
}

const PETS = [
  { name: "Mochi", level: 8, progress: 80, icon: CatIcon },
  { name: "Pixel", level: 5, progress: 45, icon: BirdIcon },
  { name: "Beans", level: 2, progress: 20, icon: FishIcon },
]

function PetsPanel() {
  return (
    <SettingsPanel>
      <SettingsStatGrid
        stats={[
          { value: "3", label: "Pets hatched" },
          { value: "128", label: "Treats fed" },
          { value: "12 days", label: "Oldest pet" },
        ]}
      />
      <SettingsSection
        title="Your pets"
        action={
          <Button variant="ghost" size="sm">
            <HugeiconsIcon icon={EggIcon} strokeWidth={2} />
            Hatch
          </Button>
        }
      >
        <div className="flex flex-col gap-1">
          {PETS.map((pet) => (
            <div key={pet.name} className="flex items-center gap-2.5 py-1">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground [&_svg]:size-3.5">
                <HugeiconsIcon icon={pet.icon} strokeWidth={2} />
              </span>
              <span className="w-16 text-sm">{pet.name}</span>
              <Progress value={pet.progress} className="flex-1" />
              <span className="text-sm text-muted-foreground tabular-nums">
                Lv {pet.level}
              </span>
            </div>
          ))}
        </div>
      </SettingsSection>
      <SettingsSection title="Behavior">
        <SettingsRow label="Show pet in sidebar">
          <Switch defaultChecked />
        </SettingsRow>
        <SettingsRow label="Treat reminders">
          <Switch />
        </SettingsRow>
      </SettingsSection>
    </SettingsPanel>
  )
}

const SHORTCUTS: {
  section: string
  rows: { label: string; keys: string[] }[]
}[] = [
  {
    section: "General",
    rows: [
      { label: "New chat", keys: ["⌘", "N"] },
      { label: "Search", keys: ["⌘", "K"] },
      { label: "Toggle sidebar", keys: ["⌘", "B"] },
      { label: "Settings", keys: ["⌘", ","] },
    ],
  },
  {
    section: "Chat",
    rows: [
      { label: "Send message", keys: ["⏎"] },
      { label: "New line", keys: ["⇧", "⏎"] },
      { label: "Edit last message", keys: ["↑"] },
      { label: "Fast mode", keys: ["⌘", "⇧", "F"] },
    ],
  },
]

function KeyboardShortcutsPanel() {
  const [query, setQuery] = React.useState("")
  const filtered = SHORTCUTS.map((group) => ({
    ...group,
    rows: group.rows.filter((row) =>
      row.label.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter((group) => group.rows.length > 0)

  return (
    <SettingsPanel>
      <InputGroup>
        <InputGroupAddon>
          <HugeiconsIcon
            icon={SearchIcon}
            strokeWidth={2}
            className="text-muted-foreground"
          />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Search shortcuts"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </InputGroup>
      {filtered.length === 0 ? (
        <SettingsNote>No shortcuts match “{query}”.</SettingsNote>
      ) : (
        filtered.map((group) => (
          <SettingsSection key={group.section} title={group.section}>
            {group.rows.map((row) => (
              <SettingsShortcutRow
                key={row.label}
                label={row.label}
                keys={row.keys}
              />
            ))}
          </SettingsSection>
        ))
      )}
    </SettingsPanel>
  )
}

const TOKEN_CHART_DATA = [
  { month: "Feb", tokens: 9.2 },
  { month: "Mar", tokens: 14.8 },
  { month: "Apr", tokens: 22.1 },
  { month: "May", tokens: 31.4 },
  { month: "Jun", tokens: 37.7 },
  { month: "Jul", tokens: 42.3 },
]

const TOKEN_CHART_CONFIG = {
  tokens: {
    label: "Tokens (M)",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

function UsageBillingPanel() {
  return (
    <SettingsPanel>
      <SettingsStatGrid
        stats={[
          { value: "157.5M", label: "Lifetime tokens" },
          { value: "88.6M", label: "Peak tokens" },
          { value: "166", label: "Total chats" },
        ]}
      />
      <SettingsSection title="Tokens per month">
        <ChartContainer config={TOKEN_CHART_CONFIG} className="h-40 w-full">
          <BarChart accessibilityLayer data={TOKEN_CHART_DATA}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey="tokens"
              fill="var(--color-tokens)"
              radius={4}
              isAnimationActive={false}
            />
          </BarChart>
        </ChartContainer>
      </SettingsSection>
      <SettingsSection
        title="Plan usage"
        action={
          <Button variant="ghost" size="sm">
            Manage billing
          </Button>
        }
      >
        <Progress value={64} />
        <p className="mt-2 text-xs text-muted-foreground">
          64% of the monthly limit used · resets Aug 1
        </p>
      </SettingsSection>
    </SettingsPanel>
  )
}

function AccountPanel() {
  return (
    <SettingsPanel>
      <Alert>
        <HugeiconsIcon icon={ShieldIcon} strokeWidth={2} />
        <AlertTitle>Two-factor authentication is on</AlertTitle>
        <AlertDescription>
          Signing in on a new device requires a code from your authenticator.
        </AlertDescription>
      </Alert>
      <SettingsSection title="Account">
        <SettingsRow label="Email">
          <SettingsValue>ellie@aiellie.dev</SettingsValue>
        </SettingsRow>
        <SettingsRow label="Plan">
          <Badge variant="secondary" className="rounded-full">
            Plus
          </Badge>
        </SettingsRow>
        <SettingsRow label="Member since">
          <SettingsValue>Aug 2025</SettingsValue>
        </SettingsRow>
      </SettingsSection>
      <SettingsSection title="Sessions">
        <div className="flex flex-col gap-2">
          <Item variant="outline">
            <ItemMedia variant="icon">
              <HugeiconsIcon icon={LaptopIcon} strokeWidth={2} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>MacBook Pro</ItemTitle>
              <ItemDescription>Tel Aviv · Active now</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Status variant="success">
                <StatusIndicator />
                <StatusLabel>This device</StatusLabel>
              </Status>
            </ItemActions>
          </Item>
          <Item variant="outline">
            <ItemMedia variant="icon">
              <HugeiconsIcon icon={SmartPhone01Icon} strokeWidth={2} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>iPhone 16</ItemTitle>
              <ItemDescription>Tel Aviv · 2h ago</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="destructive" size="sm">
                Sign out
              </Button>
            </ItemActions>
          </Item>
        </div>
      </SettingsSection>
      <div>
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={
            <a
              href="https://aiellie.dev"
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          Manage account
          <HugeiconsIcon
            icon={ArrowUpRight01Icon}
            strokeWidth={2}
            className="rtl:-scale-x-100"
          />
        </Button>
      </div>
    </SettingsPanel>
  )
}

function HomePanel() {
  return (
    <SettingsPanel>
      <SettingsSection title="Home screen">
        <div className="flex flex-col gap-4 pb-2">
          <Field>
            <FieldLabel htmlFor="home-greeting">Greeting</FieldLabel>
            <Input id="home-greeting" defaultValue="Good evening, Ellie" />
            <FieldDescription>
              Shown at the top of your home screen.
            </FieldDescription>
          </Field>
        </div>
        <SettingsRow label="Recent chats">
          <SettingsToggleGroup
            options={[
              { label: "Off", value: "off" },
              { label: "3", value: "3" },
              { label: "5", value: "5" },
              { label: "10", value: "10" },
            ]}
            defaultValue="5"
          />
        </SettingsRow>
        <SettingsRow label="Suggested prompts">
          <Switch defaultChecked />
        </SettingsRow>
        <SettingsRow label="Continue where you left off">
          <Switch defaultChecked />
        </SettingsRow>
      </SettingsSection>
    </SettingsPanel>
  )
}

function NavigationPanel() {
  return (
    <SettingsPanel>
      <SettingsSection title="Sidebar">
        <SettingsRow label="Collapse to icons">
          <Switch defaultChecked />
        </SettingsRow>
        <SettingsRow label="Group chats by">
          <SettingsToggleGroup
            options={[
              { label: "Date", value: "date" },
              { label: "Project", value: "project" },
              { label: "Topic", value: "topic" },
            ]}
            defaultValue="date"
          />
        </SettingsRow>
        <SettingsRow label="Show pinned">
          <Switch defaultChecked />
        </SettingsRow>
      </SettingsSection>
      <SettingsSection title="Tabs">
        <SettingsRow label="Open links in">
          <SettingsToggleGroup
            options={[
              { label: "New tab", value: "new" },
              { label: "Same tab", value: "same" },
            ]}
            defaultValue="new"
          />
        </SettingsRow>
        <SettingsRow label="Show tab bar">
          <Switch />
        </SettingsRow>
      </SettingsSection>
    </SettingsPanel>
  )
}

function LanguageRegionPanel() {
  return (
    <SettingsPanel>
      <SettingsSection title="Language & region">
        <SettingsRow label="Language">
          <SettingsSelect
            items={["English", "עברית", "Français", "日本語"]}
            defaultValue="English"
          />
        </SettingsRow>
        <SettingsRow label="Region">
          <SettingsSelect
            items={["United States", "Israel", "France", "Japan"]}
            defaultValue="United States"
          />
        </SettingsRow>
        <SettingsRow label="First day of week">
          <SettingsToggleGroup
            options={[
              { label: "Sunday", value: "sunday" },
              { label: "Monday", value: "monday" },
            ]}
            defaultValue="sunday"
          />
        </SettingsRow>
        <SettingsRow label="24-hour time">
          <Switch />
        </SettingsRow>
      </SettingsSection>
    </SettingsPanel>
  )
}

/* --------------------------- Integrations panels -------------------------- */

function AppshotsPanel() {
  return (
    <SettingsPanel>
      <SettingsStatGrid
        stats={[
          { value: "34", label: "Shots taken" },
          { value: "12", label: "This week" },
          { value: "2.1s", label: "Avg render" },
        ]}
      />
      <SettingsSection title="Capture">
        <SettingsRow label="Device frame">
          <SettingsSelect
            items={["iPhone 16 Pro", "Pixel 9", "iPad Pro", "None"]}
            defaultValue="iPhone 16 Pro"
          />
        </SettingsRow>
        <SettingsRow label="Scale">
          <SettingsToggleGroup
            options={[
              { label: "1x", value: "1" },
              { label: "2x", value: "2" },
              { label: "3x", value: "3" },
            ]}
            defaultValue="2"
          />
        </SettingsRow>
        <SettingsRow label="Transparent background">
          <Switch defaultChecked />
        </SettingsRow>
        <SettingsSliderRow label="Corner radius" value="24px">
          <Slider defaultValue={[24]} min={0} max={48} step={4} />
        </SettingsSliderRow>
      </SettingsSection>
    </SettingsPanel>
  )
}

const INTEGRATION_PLUGINS = [
  {
    name: "@browser",
    runs: "22 runs",
    icon: <HugeiconsIcon icon={BrowserIcon} strokeWidth={2} />,
    enabled: true,
  },
  {
    name: "@sites",
    runs: "21 runs",
    icon: <HugeiconsIcon icon={GridViewIcon} strokeWidth={2} />,
    enabled: true,
  },
  {
    name: "$imagegen",
    runs: "11 runs",
    icon: <HugeiconsIcon icon={AiImageIcon} strokeWidth={2} />,
    enabled: true,
  },
  {
    name: "$hatch-pet",
    runs: "8 runs",
    icon: <HugeiconsIcon icon={EggIcon} strokeWidth={2} />,
    enabled: true,
  },
  {
    name: "@github",
    runs: "2 runs",
    icon: <Icons.gitHub className="size-3.5" />,
    enabled: false,
  },
]

function IntegrationPluginsPanel() {
  const [query, setQuery] = React.useState("")
  const filtered = INTEGRATION_PLUGINS.filter((plugin) =>
    plugin.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <SettingsPanel>
      <InputGroup>
        <InputGroupAddon>
          <HugeiconsIcon
            icon={SearchIcon}
            strokeWidth={2}
            className="text-muted-foreground"
          />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Search plugins"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <InputGroupAddon align="inline-end">
          <Kbd>@</Kbd>
        </InputGroupAddon>
      </InputGroup>
      <SettingsSection
        title="Installed plugins"
        action={
          <Button variant="ghost" size="sm">
            Browse
          </Button>
        }
      >
        {filtered.length === 0 ? (
          <SettingsNote>No plugins match “{query}”.</SettingsNote>
        ) : (
          filtered.map((plugin) => (
            <SettingsChipRow
              key={plugin.name}
              icon={plugin.icon}
              name={plugin.name}
              meta={plugin.runs}
            >
              <Switch defaultChecked={plugin.enabled} />
            </SettingsChipRow>
          ))
        )}
      </SettingsSection>
      <SettingsSection title="Behavior">
        <SettingsRow label="Suggest plugins in chat">
          <Switch defaultChecked />
        </SettingsRow>
        <SettingsRow label="Auto-run trusted plugins">
          <Switch />
        </SettingsRow>
      </SettingsSection>
    </SettingsPanel>
  )
}

function BrowserPanel() {
  return (
    <SettingsPanel>
      <SettingsSection title="Browsing">
        <SettingsRow label="Allow browsing">
          <Switch defaultChecked />
        </SettingsRow>
        <SettingsRow label="Search engine">
          <SettingsSelect
            items={["Google", "DuckDuckGo", "Brave"]}
            defaultValue="Google"
          />
        </SettingsRow>
        <SettingsRow label="Block trackers">
          <Switch defaultChecked />
        </SettingsRow>
      </SettingsSection>
      <SettingsSection title="Allowed domains">
        <div className="mb-2">
          <InputGroup>
            <InputGroupAddon>
              <HugeiconsIcon
                icon={GlobeIcon}
                strokeWidth={2}
                className="text-muted-foreground"
              />
            </InputGroupAddon>
            <InputGroupInput placeholder="example.com" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton variant="secondary">Add</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
        <SettingsChipRow
          icon={<HugeiconsIcon icon={GlobeIcon} strokeWidth={2} />}
          name="registry.aiellie.dev"
          meta="Always"
        />
        <SettingsChipRow
          icon={<HugeiconsIcon icon={GlobeIcon} strokeWidth={2} />}
          name="github.com"
          meta="Always"
        />
        <SettingsChipRow
          icon={<HugeiconsIcon icon={GlobeIcon} strokeWidth={2} />}
          name="vercel.com"
          meta="Ask first"
        />
      </SettingsSection>
    </SettingsPanel>
  )
}

function ComputerUsePanel() {
  return (
    <SettingsPanel>
      <Alert>
        <HugeiconsIcon icon={SparklesIcon} strokeWidth={2} />
        <AlertTitle>Ellie can see your screen while granted</AlertTitle>
        <AlertDescription>
          Access is per app and can be revoked at any time. Each tier limits
          what Ellie can do.
        </AlertDescription>
      </Alert>
      <SettingsSection title="Granted apps">
        <SettingsChipRow
          icon={<HugeiconsIcon icon={AppleFinderIcon} strokeWidth={2} />}
          name="Finder"
        >
          <Badge variant="secondary" className="rounded-full">
            Full
          </Badge>
        </SettingsChipRow>
        <SettingsChipRow
          icon={<HugeiconsIcon icon={Note01Icon} strokeWidth={2} />}
          name="Notes"
        >
          <Badge variant="secondary" className="rounded-full">
            Full
          </Badge>
        </SettingsChipRow>
        <SettingsChipRow
          icon={<HugeiconsIcon icon={ChromeIcon} strokeWidth={2} />}
          name="Chrome"
        >
          <Badge variant="secondary" className="rounded-full">
            Read
          </Badge>
        </SettingsChipRow>
        <SettingsChipRow
          icon={<HugeiconsIcon icon={TerminalIcon} strokeWidth={2} />}
          name="Terminal"
        >
          <Badge variant="secondary" className="rounded-full">
            Click
          </Badge>
        </SettingsChipRow>
      </SettingsSection>
      <SettingsSection title="Behavior">
        <SettingsRow label="Ask before each app">
          <Switch defaultChecked />
        </SettingsRow>
        <SettingsRow label="Show live cursor">
          <Switch defaultChecked />
        </SettingsRow>
      </SettingsSection>
    </SettingsPanel>
  )
}

function ConnectedAccountsPanel() {
  return (
    <SettingsPanel>
      <SettingsSection title="Accounts">
        <div className="flex flex-col gap-2">
          <Item variant="outline">
            <ItemMedia variant="icon">
              <Icons.gitHub className="size-4" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>GitHub</ItemTitle>
              <ItemDescription>@aiellie</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Status variant="success">
                <StatusIndicator />
                <StatusLabel>Connected</StatusLabel>
              </Status>
            </ItemActions>
          </Item>
          <Item variant="outline">
            <ItemMedia variant="icon">
              <HugeiconsIcon icon={GoogleDriveIcon} strokeWidth={2} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Google Drive</ItemTitle>
              <ItemDescription>ellie@aiellie.dev</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Status variant="success">
                <StatusIndicator />
                <StatusLabel>Connected</StatusLabel>
              </Status>
            </ItemActions>
          </Item>
          <Item variant="outline">
            <ItemMedia variant="icon">
              <HugeiconsIcon icon={FigmaIcon} strokeWidth={2} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Figma</ItemTitle>
              <ItemDescription>Not connected</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="outline" size="sm">
                Connect
              </Button>
            </ItemActions>
          </Item>
        </div>
      </SettingsSection>
    </SettingsPanel>
  )
}

/* ------------------------------ Coding panels ----------------------------- */

const HOOKS = [
  {
    event: "PreToolUse",
    command: "lint-staged",
    detail: "Runs before every tool call that edits files.",
    enabled: true,
  },
  {
    event: "PostToolUse",
    command: "prettier --write",
    detail: "Formats files right after they change.",
    enabled: true,
  },
  {
    event: "Stop",
    command: "afplay done.aiff",
    detail: "Plays a chime when Ellie finishes a turn.",
    enabled: false,
  },
]

function HooksPanel() {
  return (
    <SettingsPanel>
      <SettingsNote>
        Run your own commands when lifecycle events fire.
      </SettingsNote>
      <SettingsSection
        title="Configured hooks"
        action={
          <Button variant="ghost" size="sm">
            Add hook
          </Button>
        }
      >
        <Accordion>
          {HOOKS.map((hook) => (
            <AccordionItem key={hook.event} value={hook.event}>
              <AccordionTrigger>{hook.event}</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-3">
                  <p className="text-muted-foreground">{hook.detail}</p>
                  <code className="w-fit rounded-md bg-muted px-2 py-1 font-mono text-xs">
                    {hook.command}
                  </code>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Enabled</span>
                    <Switch defaultChecked={hook.enabled} size="sm" />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </SettingsSection>
    </SettingsPanel>
  )
}

function ConnectionsPanel() {
  return (
    <SettingsPanel>
      <SettingsSection
        title="MCP servers"
        action={
          <Button variant="ghost" size="sm">
            Add server
          </Button>
        }
      >
        <SettingsChipRow
          icon={<HugeiconsIcon icon={GlobeIcon} strokeWidth={2} />}
          name="shadcn-ui"
          meta="12 tools"
        >
          <Status variant="success">
            <StatusIndicator />
            <StatusLabel>Connected</StatusLabel>
          </Status>
        </SettingsChipRow>
        <SettingsChipRow
          icon={<HugeiconsIcon icon={GlobeIcon} strokeWidth={2} />}
          name="hugeicons"
          meta="3 tools"
        >
          <Status variant="success">
            <StatusIndicator />
            <StatusLabel>Connected</StatusLabel>
          </Status>
        </SettingsChipRow>
        <SettingsChipRow
          icon={<HugeiconsIcon icon={GlobeIcon} strokeWidth={2} />}
          name="playwright"
          meta="0 tools"
        >
          <Status variant="cancelled">
            <StatusIndicator />
            <StatusLabel>Offline</StatusLabel>
          </Status>
        </SettingsChipRow>
      </SettingsSection>
      <SettingsSection title="Behavior">
        <SettingsRow label="Reconnect on launch">
          <Switch defaultChecked />
        </SettingsRow>
        <SettingsRow label="Ask before new tools">
          <Switch defaultChecked />
        </SettingsRow>
      </SettingsSection>
    </SettingsPanel>
  )
}

function GitPanel() {
  return (
    <SettingsPanel>
      <SettingsSection title="Repository">
        <div className="flex flex-col gap-4 pb-2">
          <Field>
            <FieldLabel htmlFor="git-default-branch">Default branch</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <HugeiconsIcon
                  icon={GitBranchIcon}
                  strokeWidth={2}
                  className="text-muted-foreground"
                />
              </InputGroupAddon>
              <InputGroupInput
                id="git-default-branch"
                defaultValue="main"
                className="font-mono"
              />
            </InputGroup>
          </Field>
        </div>
        <SettingsRow label="Auto-stage edits">
          <Switch />
        </SettingsRow>
      </SettingsSection>
      <SettingsSection title="Commits">
        <SettingsRow label="Commit style">
          <SettingsToggleGroup
            options={[
              { label: "Conventional", value: "conventional" },
              { label: "Plain", value: "plain" },
            ]}
            defaultValue="conventional"
          />
        </SettingsRow>
        <SettingsRow label="Co-author trailer">
          <Switch defaultChecked />
        </SettingsRow>
        <SettingsRow label="Sign commits">
          <Switch />
        </SettingsRow>
      </SettingsSection>
    </SettingsPanel>
  )
}

function EnvironmentsPanel() {
  return (
    <SettingsPanel>
      <SettingsSection title="Runtime">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tool</TableHead>
              <TableHead>Version</TableHead>
              <TableHead className="text-end">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="flex items-center gap-2.5">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground [&_svg]:size-3.5">
                  <HugeiconsIcon icon={TerminalIcon} strokeWidth={2} />
                </span>
                Node
              </TableCell>
              <TableCell className="tabular-nums">v22.11</TableCell>
              <TableCell className="text-end">
                <Badge variant="secondary" className="rounded-full">
                  Active
                </Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center gap-2.5">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground [&_svg]:size-3.5">
                  <Icons.pnpm className="size-3.5" />
                </span>
                pnpm
              </TableCell>
              <TableCell className="tabular-nums">10.4</TableCell>
              <TableCell className="text-end">
                <Badge variant="secondary" className="rounded-full">
                  Active
                </Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center gap-2.5">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground [&_svg]:size-3.5">
                  <Icons.ts className="size-3.5" />
                </span>
                TypeScript
              </TableCell>
              <TableCell className="tabular-nums">5.9</TableCell>
              <TableCell className="text-end">
                <span className="text-muted-foreground">—</span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center gap-2.5">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground [&_svg]:size-3.5">
                  <Icons.react className="size-3.5" />
                </span>
                React
              </TableCell>
              <TableCell className="tabular-nums">19.2</TableCell>
              <TableCell className="text-end">
                <span className="text-muted-foreground">—</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </SettingsSection>
      <SettingsSection title="Behavior">
        <SettingsRow label="Load .env files">
          <Switch defaultChecked />
        </SettingsRow>
        <SettingsRow label="Shell">
          <SettingsSelect items={["zsh", "bash", "fish"]} defaultValue="zsh" />
        </SettingsRow>
      </SettingsSection>
    </SettingsPanel>
  )
}

function WorktreesPanel() {
  return (
    <SettingsPanel>
      <SettingsSection title="Worktrees">
        <SettingsRow label="Isolate agents in worktrees">
          <Switch defaultChecked />
        </SettingsRow>
        <SettingsRow label="Location">
          <SettingsValue>.worktrees/</SettingsValue>
        </SettingsRow>
        <SettingsRow label="Clean up unchanged">
          <Switch defaultChecked />
        </SettingsRow>
      </SettingsSection>
      <SettingsSection title="Active">
        <SettingsChipRow
          icon={<HugeiconsIcon icon={GitBranchIcon} strokeWidth={2} />}
          name={<span className="font-mono text-xs">fix-tooltip-overflow</span>}
          meta="2 files changed"
        />
        <SettingsChipRow
          icon={<HugeiconsIcon icon={GitBranchIcon} strokeWidth={2} />}
          name={<span className="font-mono text-xs">registry-sync</span>}
          meta="clean"
        />
      </SettingsSection>
    </SettingsPanel>
  )
}

function AdvancedPanel() {
  return (
    <SettingsPanel>
      <SettingsSection title="Developer">
        <SettingsRow label="Verbose logging">
          <Switch />
        </SettingsRow>
        <SettingsRow label="Telemetry">
          <Switch defaultChecked />
        </SettingsRow>
        <SettingsRow label="Experimental features">
          <Switch />
        </SettingsRow>
      </SettingsSection>
      <SettingsSection title="Data">
        <SettingsRow label="Export settings">
          <Button variant="ghost" size="sm">
            <HugeiconsIcon icon={Download01Icon} strokeWidth={2} />
            Export
          </Button>
        </SettingsRow>
        <SettingsRow label="Reset all settings">
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                >
                  <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                  Reset
                </Button>
              }
            />
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogTitle>Reset all settings?</AlertDialogTitle>
                <AlertDialogDescription>
                  Every preference goes back to its default. Your chats and pets
                  are not affected.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Reset</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SettingsRow>
      </SettingsSection>
    </SettingsPanel>
  )
}

/* ----------------------------- Archived panels ---------------------------- */

const ARCHIVED_CHATS = [
  { title: "Registry heatmap ideas", date: "Jul 12" },
  { title: "RTL audit notes", date: "Jun 28" },
  { title: "$hatch-pet naming brainstorm", date: "Jun 25" },
]

function ArchivedChatsPanel() {
  return (
    <SettingsPanel>
      <SettingsSection title="Archive">
        <SettingsRow label="Auto-archive after">
          <SettingsSelect
            items={["30 days", "60 days", "90 days", "Never"]}
            defaultValue="90 days"
          />
        </SettingsRow>
      </SettingsSection>
      <SettingsSection
        title="Archived chats"
        action={
          <ButtonGroup>
            <Button variant="outline" size="sm">
              Restore
            </Button>
            <Button variant="outline" size="sm">
              Delete
            </Button>
          </ButtonGroup>
        }
      >
        {ARCHIVED_CHATS.map((chat, index) => (
          <div
            key={chat.title}
            className="flex items-center justify-between gap-4 py-1.5 text-sm"
          >
            <span className="flex items-center gap-2.5">
              <Checkbox
                id={`archived-chat-${index}`}
                defaultChecked={index === 0}
              />
              <FieldLabel
                htmlFor={`archived-chat-${index}`}
                className="font-normal"
              >
                {chat.title}
              </FieldLabel>
            </span>
            <span className="text-muted-foreground tabular-nums">
              {chat.date}
            </span>
          </div>
        ))}
      </SettingsSection>
    </SettingsPanel>
  )
}

/* ----------------------------- Settings panels ---------------------------- */

function PrivacyPanel() {
  return (
    <SettingsPanel>
      <Alert>
        <HugeiconsIcon icon={ShieldIcon} strokeWidth={2} />
        <AlertTitle>Your chats stay on your devices</AlertTitle>
        <AlertDescription>
          End-to-end encrypted and never used for training unless you opt in.
        </AlertDescription>
      </Alert>
      <SettingsSection title="Data">
        <SettingsRow label="Improve the model">
          <Switch />
        </SettingsRow>
        <SettingsRow label="Include chats in reports">
          <Switch />
        </SettingsRow>
        <SettingsRow label="Blur previews in screenshots">
          <Switch defaultChecked />
        </SettingsRow>
      </SettingsSection>
      <SettingsSection title="Controls">
        <SettingsRow label="Export your data">
          <Button variant="ghost" size="sm">
            <HugeiconsIcon icon={Download01Icon} strokeWidth={2} />
            Export
          </Button>
        </SettingsRow>
        <SettingsRow label="Delete all chats">
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                >
                  <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                  Delete
                </Button>
              }
            />
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete all chats?</AlertDialogTitle>
                <AlertDialogDescription>
                  All 166 chats will be permanently deleted. This cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SettingsRow>
      </SettingsSection>
    </SettingsPanel>
  )
}

const PLANS = [
  {
    name: "Plus",
    price: "$20/month",
    tagline: "Room to build every day. Upgrade when you outgrow it.",
    features: [
      "10x the usage of Free",
      "Pets, plugins, and skills",
      "Projects and memory",
    ],
    banner: "from-chart-1/50 via-chart-2/40 to-chart-4/30",
    cta: "Current plan",
    current: true,
  },
  {
    name: "Max",
    price: "$100/month",
    tagline: "For the heaviest days of building, side by side.",
    features: [
      "20x the usage of Plus",
      "Long-running agents",
      "Early access to previews",
    ],
    banner: "from-chart-3/40 via-chart-4/30 to-chart-5/40",
    cta: "Upgrade to Max",
    current: false,
  },
]

function BillingPanel() {
  return (
    <SettingsPanel>
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="font-heading text-lg font-semibold tracking-tight">
          Plans that grow with you
        </p>
        <p className="text-sm text-muted-foreground">
          Switch or cancel anytime. Usage resets monthly.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {PLANS.map((plan) => (
          <Card key={plan.name} className="overflow-hidden pt-0">
            <div className={cn("h-20 w-full bg-linear-to-br", plan.banner)} />
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{plan.name}</CardTitle>
                <Badge variant="secondary" className="rounded-full">
                  {plan.price}
                </Badge>
              </div>
              <CardDescription>{plan.tagline}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <p className="text-sm font-medium">What you get:</p>
              {plan.features.map((feature) => (
                <span
                  key={feature}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    strokeWidth={2}
                    className="size-4 shrink-0"
                  />
                  {feature}
                </span>
              ))}
            </CardContent>
            <CardFooter className="mt-auto">
              <Button
                className="w-full rounded-full"
                variant={plan.current ? "secondary" : "default"}
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <SettingsSection
        title="Payment method"
        action={
          <Button variant="ghost" size="sm">
            Update
          </Button>
        }
      >
        <SettingsChipRow
          icon={<HugeiconsIcon icon={CreditCardIcon} strokeWidth={2} />}
          name="Visa ending 4242"
          meta="Expires 08/29"
        />
      </SettingsSection>
      <SettingsSection title="Invoices">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-end">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {["Jul 2026", "Jun 2026", "May 2026"].map((month) => (
              <TableRow key={month}>
                <TableCell>{month}</TableCell>
                <TableCell className="tabular-nums">$20.00</TableCell>
                <TableCell className="text-end">
                  <Badge variant="secondary" className="rounded-full">
                    Paid
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SettingsSection>
    </SettingsPanel>
  )
}

const USAGE_WEEKS = 26
const USAGE_DAYS = 7

// "week-day" -> intensity; the streak lives in the last few columns.
const USAGE_HEAT: Record<string, number> = {
  "22-2": 1,
  "23-4": 4,
  "24-0": 1,
  "24-2": 2,
  "24-4": 2,
  "25-0": 2,
  "25-1": 3,
  "25-2": 1,
  "25-3": 2,
  "25-5": 1,
}

const USAGE_HEAT_CLASS = [
  "bg-muted",
  "bg-chart-1/50",
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
]

const USAGE_MONTHS = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"]

function UsagePanel() {
  return (
    <SettingsPanel>
      <SettingsStatGrid
        stats={[
          { value: "42.3M", label: "This month" },
          { value: "1.4M", label: "Daily avg" },
          { value: "3 days", label: "Streak" },
        ]}
      />
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Token activity</p>
          <SettingsTextTabs options={["Daily", "Weekly", "Cumulative"]} />
        </div>
        <div className="overflow-x-auto">
          <div className="flex flex-col gap-2">
            <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
              {Array.from({ length: USAGE_WEEKS * USAGE_DAYS }, (_, i) => {
                const week = Math.floor(i / USAGE_DAYS)
                const day = i % USAGE_DAYS
                return (
                  <span
                    key={i}
                    className={cn(
                      "size-2 rounded-xs",
                      USAGE_HEAT_CLASS[USAGE_HEAT[`${week}-${day}`] ?? 0]
                    )}
                  />
                )
              })}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              {USAGE_MONTHS.map((month) => (
                <span key={month}>{month}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SettingsPanel>
  )
}

const CAPABILITIES = [
  {
    id: "code",
    label: "Code execution",
    detail: "Run code in a sandbox to test and iterate.",
    enabled: true,
  },
  {
    id: "files",
    label: "File creation",
    detail: "Create documents, spreadsheets, and slides.",
    enabled: true,
  },
  {
    id: "search",
    label: "Web search",
    detail: "Look things up when the answer needs fresh data.",
    enabled: true,
  },
  {
    id: "research",
    label: "Deep research",
    detail: "Multi-step research with cited sources.",
    enabled: true,
  },
  {
    id: "imagegen",
    label: "Image generation",
    detail: "Generate images with $imagegen.",
    enabled: true,
  },
  {
    id: "computer",
    label: "Computer use",
    detail: "See the screen and control approved apps.",
    enabled: false,
  },
]

function CapabilitiesPanel() {
  return (
    <SettingsPanel>
      <SettingsSection title="Capabilities">
        <div className="flex flex-col gap-3">
          {CAPABILITIES.map((capability) => (
            <Field key={capability.id} orientation="horizontal">
              <Checkbox
                id={`capability-${capability.id}`}
                defaultChecked={capability.enabled}
              />
              <FieldContent>
                <FieldLabel htmlFor={`capability-${capability.id}`}>
                  {capability.label}
                </FieldLabel>
                <FieldDescription>{capability.detail}</FieldDescription>
              </FieldContent>
            </Field>
          ))}
        </div>
      </SettingsSection>
    </SettingsPanel>
  )
}

function CoworkPanel() {
  return (
    <SettingsPanel>
      <SettingsSection title="Cowork">
        <div className="flex flex-col gap-4 pb-2">
          <Field>
            <FieldLabel htmlFor="cowork-folder">Default folder</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <HugeiconsIcon
                  icon={Folder01Icon}
                  strokeWidth={2}
                  className="text-muted-foreground"
                />
              </InputGroupAddon>
              <InputGroupInput
                id="cowork-folder"
                defaultValue="~/Cowork"
                className="font-mono"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton variant="secondary">Browse</InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </div>
        <SettingsSliderRow label="Parallel tasks" value="4">
          <Slider defaultValue={[4]} min={1} max={8} step={1} />
        </SettingsSliderRow>
        <SettingsRow label="Ask before sending files">
          <Switch defaultChecked />
        </SettingsRow>
        <SettingsRow label="Task summaries">
          <Switch defaultChecked />
        </SettingsRow>
      </SettingsSection>
    </SettingsPanel>
  )
}

/* ----------------------------- Customize panels --------------------------- */

function SkillsPanel() {
  return (
    <SettingsPanel>
      <SettingsStatGrid
        stats={[
          { value: "8", label: "Explored" },
          { value: "66", label: "Total runs" },
          { value: "3", label: "Custom" },
        ]}
      />
      <SettingsSection
        title="Most used"
        action={
          <Button variant="ghost" size="sm">
            Browse
          </Button>
        }
      >
        <SettingsChipRow
          icon={<HugeiconsIcon icon={BookOpen02Icon} strokeWidth={2} />}
          name="dataviz"
          meta="21 runs"
        />
        <SettingsChipRow
          icon={<HugeiconsIcon icon={BookOpen02Icon} strokeWidth={2} />}
          name="theme-factory"
          meta="14 runs"
        />
        <SettingsChipRow
          icon={<HugeiconsIcon icon={BookOpen02Icon} strokeWidth={2} />}
          name={
            <span className="flex items-center gap-2">
              skill-creator
              <Badge variant="secondary" className="rounded-full">
                Custom
              </Badge>
            </span>
          }
          meta="9 runs"
        />
      </SettingsSection>
    </SettingsPanel>
  )
}

function ConnectorsPanel() {
  return (
    <SettingsPanel>
      <SettingsSection
        title="Connectors"
        action={
          <Button variant="ghost" size="sm">
            Browse all
          </Button>
        }
      >
        <div className="grid gap-2 sm:grid-cols-2">
          <Item variant="outline">
            <ItemMedia variant="icon">
              <HugeiconsIcon icon={FigmaIcon} strokeWidth={2} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Figma</ItemTitle>
              <ItemDescription>Read designs</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Switch defaultChecked size="sm" />
            </ItemActions>
          </Item>
          <Item variant="outline">
            <ItemMedia variant="icon">
              <HugeiconsIcon icon={SlackIcon} strokeWidth={2} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Slack</ItemTitle>
              <ItemDescription>Send messages</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Switch defaultChecked size="sm" />
            </ItemActions>
          </Item>
          <Item variant="outline">
            <ItemMedia variant="icon">
              <HugeiconsIcon icon={GoogleDriveIcon} strokeWidth={2} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Google Drive</ItemTitle>
              <ItemDescription>Read files</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Switch size="sm" />
            </ItemActions>
          </Item>
          <Item variant="outline">
            <ItemMedia variant="icon">
              <Icons.gitHub className="size-4" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>GitHub</ItemTitle>
              <ItemDescription>Repos and PRs</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Switch defaultChecked size="sm" />
            </ItemActions>
          </Item>
        </div>
      </SettingsSection>
    </SettingsPanel>
  )
}

function CustomizePluginsPanel() {
  return (
    <SettingsPanel>
      <SettingsSection title="Installed">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plugin</TableHead>
              <TableHead>Version</TableHead>
              <TableHead className="text-end">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>design</TableCell>
              <TableCell className="font-mono text-xs">v2.1.0</TableCell>
              <TableCell className="text-end text-muted-foreground">
                Up to date
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>anthropic-skills</TableCell>
              <TableCell className="font-mono text-xs">v1.8.2</TableCell>
              <TableCell className="text-end">
                <Badge variant="secondary" className="rounded-full">
                  Update
                </Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>cowork</TableCell>
              <TableCell className="font-mono text-xs">v1.0.4</TableCell>
              <TableCell className="text-end text-muted-foreground">
                Up to date
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </SettingsSection>
      <SettingsSection title="Updates">
        <SettingsRow label="Auto-update plugins">
          <Switch defaultChecked />
        </SettingsRow>
      </SettingsSection>
    </SettingsPanel>
  )
}

const MEMORIES = [
  { fact: "Prefers logical RTL utilities", date: "Jul 24" },
  { fact: "Dev server lives on port 3000", date: "Jul 21" },
  { fact: "Tooltips on every icon button", date: "Jul 12" },
]

function MemoryPanel() {
  return (
    <SettingsPanel>
      <SettingsSection title="Memory">
        <SettingsRow label="Enable memory">
          <Switch defaultChecked />
        </SettingsRow>
        <SettingsRow label="Memories saved">
          <SettingsValue>42</SettingsValue>
        </SettingsRow>
        <SettingsRow label="Last consolidated">
          <SettingsValue>Jul 18</SettingsValue>
        </SettingsRow>
      </SettingsSection>
      <SettingsSection
        title="Recent memories"
        action={
          <Button variant="ghost" size="sm">
            View all
          </Button>
        }
      >
        <div className="mb-2">
          <InputGroup>
            <InputGroupAddon>
              <HugeiconsIcon
                icon={AiBrain01Icon}
                strokeWidth={2}
                className="text-muted-foreground"
              />
            </InputGroupAddon>
            <InputGroupInput placeholder="Remember something…" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton variant="secondary">Save</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
        {MEMORIES.map((memory) => (
          <div
            key={memory.fact}
            className="flex items-center justify-between gap-4 py-1.5 text-sm"
          >
            <span>{memory.fact}</span>
            <span className="text-muted-foreground tabular-nums">
              {memory.date}
            </span>
          </div>
        ))}
      </SettingsSection>
    </SettingsPanel>
  )
}

/* --------------------------- Notifications panels ------------------------- */

function NotificationsPanel() {
  return (
    <SettingsPanel>
      <SettingsSection title="Delivery">
        <SettingsRow label="Notify me about">
          <SettingsToggleGroup
            options={[
              { label: "Everything", value: "all" },
              { label: "Mentions", value: "mentions" },
              { label: "Nothing", value: "none" },
            ]}
            defaultValue="all"
          />
        </SettingsRow>
        <SettingsRow label="Push notifications">
          <Switch defaultChecked />
        </SettingsRow>
        <SettingsRow label="Sounds">
          <Switch />
        </SettingsRow>
        <SettingsRow label="Badge app icon">
          <Switch defaultChecked />
        </SettingsRow>
      </SettingsSection>
      <SettingsSection title="Include">
        <div className="flex flex-col gap-3">
          {[
            { id: "tasks", label: "Task completions", checked: true },
            { id: "mentions", label: "Mentions", checked: true },
            { id: "pets", label: "Pet milestones", checked: true },
            { id: "digest", label: "Weekly digest", checked: false },
          ].map((option) => (
            <Field key={option.id} orientation="horizontal">
              <Checkbox
                id={`notify-${option.id}`}
                defaultChecked={option.checked}
              />
              <FieldLabel
                htmlFor={`notify-${option.id}`}
                className="font-normal"
              >
                {option.label}
              </FieldLabel>
            </Field>
          ))}
        </div>
      </SettingsSection>
    </SettingsPanel>
  )
}

function MarkAsReadPanel() {
  return (
    <SettingsPanel>
      <SettingsSection title="Auto-mark">
        <SettingsRow label="Mark after opening">
          <Switch defaultChecked />
        </SettingsRow>
        <SettingsRow label="Delay">
          <SettingsToggleGroup
            options={[
              { label: "Instantly", value: "0" },
              { label: "5s", value: "5" },
              { label: "30s", value: "30" },
            ]}
            defaultValue="0"
          />
        </SettingsRow>
      </SettingsSection>
      <SettingsSection title="Inbox">
        <SettingsRow label="Unread notifications">
          <SettingsValue>12</SettingsValue>
        </SettingsRow>
        <div className="pt-1.5">
          <Button variant="outline" size="sm">
            <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
            Mark all as read
          </Button>
        </div>
      </SettingsSection>
    </SettingsPanel>
  )
}

/* -------------------------- Communication panels -------------------------- */

function MessagesMediaPanel() {
  return (
    <SettingsPanel>
      <SettingsSection title="Messages">
        <SettingsRow label="Read receipts">
          <Switch defaultChecked />
        </SettingsRow>
        <SettingsRow label="Autoplay media">
          <Switch />
        </SettingsRow>
        <SettingsRow label="Convert pasted screenshots">
          <Switch defaultChecked />
        </SettingsRow>
      </SettingsSection>
      <SettingsSection title="Media">
        <SettingsRow label="Image quality">
          <SettingsToggleGroup
            options={[
              { label: "Standard", value: "standard" },
              { label: "High", value: "high" },
              { label: "Original", value: "original" },
            ]}
            defaultValue="high"
          />
        </SettingsRow>
      </SettingsSection>
    </SettingsPanel>
  )
}

function AudioVideoPanel() {
  return (
    <SettingsPanel>
      <Tabs defaultValue="input">
        <TabsList variant="line">
          <TabsTrigger value="input">Input</TabsTrigger>
          <TabsTrigger value="output">Output</TabsTrigger>
          <TabsTrigger value="camera">Camera</TabsTrigger>
        </TabsList>
        <TabsContent value="input" className="flex flex-col pt-2">
          <SettingsRow label="Microphone">
            <SettingsSelect
              items={["MacBook Pro Microphone", "AirPods Pro"]}
              defaultValue="MacBook Pro Microphone"
            />
          </SettingsRow>
          <SettingsSliderRow label="Input level">
            <Progress value={35} />
          </SettingsSliderRow>
          <SettingsRow label="Noise suppression">
            <Switch defaultChecked />
          </SettingsRow>
          <SettingsRow label="Echo cancellation">
            <Switch defaultChecked />
          </SettingsRow>
        </TabsContent>
        <TabsContent value="output" className="flex flex-col pt-2">
          <SettingsRow label="Speaker">
            <SettingsSelect
              items={["MacBook Pro Speakers", "AirPods Pro"]}
              defaultValue="MacBook Pro Speakers"
            />
          </SettingsRow>
          <SettingsSliderRow label="Volume" value="70%">
            <Slider defaultValue={[70]} max={100} step={5} />
          </SettingsSliderRow>
        </TabsContent>
        <TabsContent value="camera" className="flex flex-col pt-2">
          <SettingsRow label="Camera">
            <SettingsSelect
              items={["FaceTime HD Camera", "iPhone Camera"]}
              defaultValue="FaceTime HD Camera"
            />
          </SettingsRow>
          <SettingsRow label="Mirror my video">
            <Switch defaultChecked />
          </SettingsRow>
          <SettingsRow label="Background blur">
            <Switch />
          </SettingsRow>
        </TabsContent>
      </Tabs>
    </SettingsPanel>
  )
}

/* -------------------------- Accessibility panels -------------------------- */

function AccessibilityPanel() {
  return (
    <SettingsPanel>
      <SettingsSection title="Vision">
        <SettingsRow label="Reduce motion">
          <Switch />
        </SettingsRow>
        <SettingsRow label="High contrast">
          <Switch />
        </SettingsRow>
        <SettingsSliderRow label="Text size" value="100%">
          <Slider defaultValue={[100]} min={80} max={140} step={10} />
        </SettingsSliderRow>
      </SettingsSection>
      <SettingsSection title="Interaction">
        <SettingsRow label="Always show scroll bars">
          <Switch defaultChecked />
        </SettingsRow>
        <SettingsRow label="Keyboard focus rings">
          <Switch defaultChecked />
        </SettingsRow>
        <SettingsRow label="Screen reader hints">
          <Switch defaultChecked />
        </SettingsRow>
      </SettingsSection>
    </SettingsPanel>
  )
}

/* ------------------------------------------------------------------------- */

const TAB_CONTENT: Record<string, React.ComponentType> = {
  [getItemKey("Personal", "General")]: GeneralPanel,
  [getItemKey("Personal", "Profile")]: ProfilePanel,
  [getItemKey("Personal", "Appearance")]: AppearancePanel,
  [getItemKey("Personal", "Voice")]: VoicePanel,
  [getItemKey("Personal", "Configuration")]: ConfigurationPanel,
  [getItemKey("Personal", "Personalization")]: PersonalizationPanel,
  [getItemKey("Personal", "Pets")]: PetsPanel,
  [getItemKey("Personal", "Keyboard shortcuts")]: KeyboardShortcutsPanel,
  [getItemKey("Personal", "Usage & billing")]: UsageBillingPanel,
  [getItemKey("Personal", "Account")]: AccountPanel,
  [getItemKey("Personal", "Home")]: HomePanel,
  [getItemKey("Personal", "Navigation")]: NavigationPanel,
  [getItemKey("Personal", "Language & region")]: LanguageRegionPanel,
  [getItemKey("Integrations", "Appshots")]: AppshotsPanel,
  [getItemKey("Integrations", "Plugins")]: IntegrationPluginsPanel,
  [getItemKey("Integrations", "Browser")]: BrowserPanel,
  [getItemKey("Integrations", "Computer use")]: ComputerUsePanel,
  [getItemKey("Integrations", "Connected accounts")]: ConnectedAccountsPanel,
  [getItemKey("Coding", "Hooks")]: HooksPanel,
  [getItemKey("Coding", "Connections")]: ConnectionsPanel,
  [getItemKey("Coding", "Git")]: GitPanel,
  [getItemKey("Coding", "Environments")]: EnvironmentsPanel,
  [getItemKey("Coding", "Worktrees")]: WorktreesPanel,
  [getItemKey("Coding", "Advanced")]: AdvancedPanel,
  [getItemKey("Archived", "Archived chats")]: ArchivedChatsPanel,
  [getItemKey("Settings", "Privacy")]: PrivacyPanel,
  [getItemKey("Settings", "Billing")]: BillingPanel,
  [getItemKey("Settings", "Usage")]: UsagePanel,
  [getItemKey("Settings", "Capabilities")]: CapabilitiesPanel,
  [getItemKey("Settings", "Cowork")]: CoworkPanel,
  [getItemKey("Customize", "Skills")]: SkillsPanel,
  [getItemKey("Customize", "Connectors")]: ConnectorsPanel,
  [getItemKey("Customize", "Plugins")]: CustomizePluginsPanel,
  [getItemKey("Customize", "Memory")]: MemoryPanel,
  [getItemKey("Notifications", "Notifications")]: NotificationsPanel,
  [getItemKey("Notifications", "Mark as read")]: MarkAsReadPanel,
  [getItemKey("Communication", "Messages & media")]: MessagesMediaPanel,
  [getItemKey("Communication", "Audio & video")]: AudioVideoPanel,
  [getItemKey("Accessibility", "Accessibility")]: AccessibilityPanel,
}

export function SettingsDialog({
  open: openProp,
  onOpenChange,
  trigger,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
} = {}) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = openProp !== undefined
  const open = isControlled ? openProp : internalOpen
  const setOpen = React.useCallback(
    (value: boolean) => {
      if (!isControlled) setInternalOpen(value)
      onOpenChange?.(value)
    },
    [isControlled, onOpenChange]
  )

  const [activeKey, setActiveKey] = React.useState(
    getItemKey("Personal", "General")
  )
  const activeItem =
    allNavItems.find(
      (item) => getItemKey(item.category, item.name) === activeKey
    ) ?? allNavItems[0]
  const ActivePanel = TAB_CONTENT[activeKey] ?? SettingsFallbackPanel

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger render={<Button size="sm" />}>{trigger}</DialogTrigger>
      ) : null}
      <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Customize your settings here.
        </DialogDescription>
        <SidebarProvider className="h-full min-h-0 min-w-0 items-start">
          <Sidebar collapsible="icon" className="hidden h-full md:flex">
            <SidebarContent className="overflow-hidden group-data-[collapsible=icon]:overflow-hidden">
              <ScrollArea className="min-h-0 flex-1">
                {navCategories.map((category) => (
                  <SidebarGroup key={category.label}>
                    <SidebarGroupLabel>{category.label}</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {category.items.map((item) => {
                          const itemKey = getItemKey(category.label, item.name)

                          return (
                            <SidebarMenuItem key={itemKey}>
                              <SidebarMenuButton
                                isActive={itemKey === activeKey}
                                tooltip={item.name}
                                onClick={() => setActiveKey(itemKey)}
                              >
                                <HugeiconsIcon
                                  icon={item.icon}
                                  strokeWidth={2}
                                />
                                <span>{item.name}</span>
                                {item.external ? (
                                  <HugeiconsIcon
                                    icon={ArrowUpRight01Icon}
                                    strokeWidth={2}
                                    className="ms-auto size-3.5 opacity-60 rtl:-scale-x-100"
                                  />
                                ) : null}
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          )
                        })}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                ))}
              </ScrollArea>
            </SidebarContent>
            <SidebarRail />
          </Sidebar>
          <main className="flex h-[480px] min-w-0 flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ms-1" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">Settings</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="flex items-center gap-1.5">
                        <HugeiconsIcon
                          icon={activeItem.icon}
                          strokeWidth={2}
                          className="size-4"
                        />
                        {activeItem.name}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 pt-1 md:p-6 md:pt-1">
              <ActivePanel key={activeKey} />
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}
