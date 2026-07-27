"use client"

import * as React from "react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
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
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import {
  AiBrain01Icon,
  AnchorIcon,
  Archive02Icon,
  ArrowUpRight01Icon,
  AtSignIcon,
  BarChartIcon,
  BookOpen02Icon,
  BriefcaseIcon,
  BrowserIcon,
  CatIcon,
  CheckListIcon,
  Configuration01Icon,
  CreditCardIcon,
  FrameIcon,
  GaugeIcon,
  GitBranchIcon,
  Globe02Icon,
  GlobeIcon,
  Grid2X2Icon,
  HistoryIcon,
  HomeIcon,
  KeyboardIcon,
  LinkIcon,
  Menu09Icon,
  MessageIcon,
  NotificationIcon,
  PaintBoardIcon,
  PlugIcon,
  RecordIcon,
  SettingsIcon,
  ShieldIcon,
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
  category.items.map((item) => ({ ...item, category: category.label })),
)

function getItemKey(category: string, name: string) {
  return `${category}::${name}`
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
    [isControlled, onOpenChange],
  )

  const [activeKey, setActiveKey] = React.useState(
    getItemKey("Personal", "General"),
  )
  const activeItem =
    allNavItems.find(
      (item) => getItemKey(item.category, item.name) === activeKey,
    ) ?? allNavItems[0]

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
        <SidebarProvider className="min-h-0 items-start h-full">
          <Sidebar collapsible="icon" className="hidden md:flex h-full">
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
                                    className="ms-auto size-3.5 opacity-60"
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
          <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
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
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
              {Array.from({
                length: 10,
              }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-video max-w-3xl rounded-xl bg-muted/50"
                />
              ))}
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}
