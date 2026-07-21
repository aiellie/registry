"use client"

import * as React from "react"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import {
  BellIcon,
  BotIcon,
  Book02Icon,
  CheckmarkBadge01Icon,
  ArrowRight01Icon,
  CreditCardIcon,
  Delete02Icon,
  Folder01Icon,
  FrameIcon,
  GalleryVerticalEndIcon,
  Logout01Icon,
  MapsIcon,
  MoreHorizontalIcon,
  PieChart01Icon,
  SentIcon,
  Settings02Icon,
  SparklesIcon,
  TerminalIcon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons"

import {
  LanguageProvider,
  LanguageSelector,
  useTranslation,
  type Translations,
} from "@/components/language-selector"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { DirectionProvider } from "@/components/ui/direction"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      teamName: "Acme Inc",
      teamPlan: "Enterprise",
      platform: "Platform",
      projects: "Projects",
      viewProject: "View Project",
      shareProject: "Share Project",
      deleteProject: "Delete Project",
      more: "More",
      upgradeToPro: "Upgrade to Pro",
      account: "Account",
      billing: "Billing",
      notifications: "Notifications",
      logOut: "Log out",
      playground: "Playground",
      history: "History",
      starred: "Starred",
      settings: "Settings",
      models: "Models",
      genesis: "Genesis",
      explorer: "Explorer",
      quantum: "Quantum",
      documentation: "Documentation",
      introduction: "Introduction",
      getStarted: "Get Started",
      tutorials: "Tutorials",
      changelog: "Changelog",
      general: "General",
      team: "Team",
      limits: "Limits",
      designEngineering: "Design Engineering",
      salesMarketing: "Sales & Marketing",
      travel: "Travel",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      teamName: "شركة أكمي",
      teamPlan: "المؤسسة",
      platform: "المنصة",
      projects: "المشاريع",
      viewProject: "عرض المشروع",
      shareProject: "مشاركة المشروع",
      deleteProject: "حذف المشروع",
      more: "المزيد",
      upgradeToPro: "ترقية إلى Pro",
      account: "الحساب",
      billing: "الفوترة",
      notifications: "الإشعارات",
      logOut: "تسجيل الخروج",
      playground: "ملعب",
      history: "السجل",
      starred: "المميز",
      settings: "الإعدادات",
      models: "النماذج",
      genesis: "جينيسيس",
      explorer: "إكسبلورر",
      quantum: "كوانتوم",
      documentation: "التوثيق",
      introduction: "مقدمة",
      getStarted: "ابدأ",
      tutorials: "الدروس",
      changelog: "سجل التغييرات",
      general: "عام",
      team: "الفريق",
      limits: "الحدود",
      designEngineering: "هندسة التصميم",
      salesMarketing: "المبيعات والتسويق",
      travel: "السفر",
    },
  },
  he: {
    dir: "rtl",
    values: {
      teamName: "אקמי בע״מ",
      teamPlan: "ארגוני",
      platform: "פלטפורמה",
      projects: "פרויקטים",
      viewProject: "הצג פרויקט",
      shareProject: "שתף פרויקט",
      deleteProject: "מחק פרויקט",
      more: "עוד",
      upgradeToPro: "שדרג ל-Pro",
      account: "חשבון",
      billing: "חיוב",
      notifications: "התראות",
      logOut: "התנתק",
      playground: "מגרש משחקים",
      history: "היסטוריה",
      starred: "מועדפים",
      settings: "הגדרות",
      models: "מודלים",
      genesis: "ג'נסיס",
      explorer: "אקספלורר",
      quantum: "קוונטום",
      documentation: "תיעוד",
      introduction: "מבוא",
      getStarted: "התחל",
      tutorials: "מדריכים",
      changelog: "יומן שינויים",
      general: "כללי",
      team: "צוות",
      limits: "מגבלות",
      designEngineering: "הנדסת עיצוב",
      salesMarketing: "מכירות ושיווק",
      travel: "נסיעות",
    },
  },
}

export function SidebarRtl() {
  return (
    <LanguageProvider defaultLanguage="ar">
      <AppSidebarWithProvider />
    </LanguageProvider>
  )
}

function AppSidebarWithProvider() {
  const { language, setLanguage, dir } = useTranslation(translations, "ar")

  return (
    <DirectionProvider direction={dir}>
      <div className="relative" dir={dir}>
        <LanguageSelector
          value={language}
          onValueChange={setLanguage}
          className="absolute top-4 right-4 z-10 rtl:right-auto rtl:left-4"
        />
        <AppSidebar />
      </div>
    </DirectionProvider>
  )
}

function AppSidebar() {
  const { dir, t } = useTranslation(translations, "ar")

  const navMain = [
    {
      title: t.playground,
      url: "#",
      icon: TerminalIcon,
      isActive: true,
      items: [
        { title: t.history, url: "#" },
        { title: t.starred, url: "#" },
        { title: t.settings, url: "#" },
      ],
    },
    {
      title: t.models,
      url: "#",
      icon: BotIcon,
      items: [
        { title: t.genesis, url: "#" },
        { title: t.explorer, url: "#" },
        { title: t.quantum, url: "#" },
      ],
    },
    {
      title: t.documentation,
      url: "#",
      icon: Book02Icon,
      items: [
        { title: t.introduction, url: "#" },
        { title: t.getStarted, url: "#" },
        { title: t.tutorials, url: "#" },
        { title: t.changelog, url: "#" },
      ],
    },
    {
      title: t.settings,
      url: "#",
      icon: Settings02Icon,
      items: [
        { title: t.general, url: "#" },
        { title: t.team, url: "#" },
        { title: t.billing, url: "#" },
        { title: t.limits, url: "#" },
      ],
    },
  ]

  const projects = [
    { name: t.designEngineering, url: "#", icon: FrameIcon },
    { name: t.salesMarketing, url: "#", icon: PieChart01Icon },
    { name: t.travel, url: "#", icon: MapsIcon },
  ]

  const user = {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  }

  return (
    <SidebarProvider>
      <SidebarContentInner
        dir={dir}
        t={t}
        navMain={navMain}
        projects={projects}
        user={user}
      />
    </SidebarProvider>
  )
}

function SidebarContentInner({
  dir,
  t,
  navMain,
  projects,
  user,
}: {
  dir: "ltr" | "rtl"
  t: typeof translations.ar.values
  navMain: Array<{
    title: string
    url: string
    icon?: IconSvgElement
    isActive?: boolean
    items?: Array<{ title: string; url: string }>
  }>
  projects: Array<{
    name: string
    url: string
    icon: IconSvgElement
  }>
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()

  return (
    <>
      <Sidebar
        collapsible="icon"
        dir={dir}
        side={dir === "ltr" ? "left" : "right"}
        variant="floating"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" render={<a href="#" />}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <HugeiconsIcon icon={GalleryVerticalEndIcon} strokeWidth={2} className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">{t.teamName}</span>
                  <span className="">{t.teamPlan}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{t.platform}</SidebarGroupLabel>
            <SidebarMenu>
              {navMain.map((item) => (
                <Collapsible
                  key={item.title}
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger
                      render={<SidebarMenuButton tooltip={item.title} />}
                    >
                      {item.icon && <HugeiconsIcon icon={item.icon} strokeWidth={2} />}
                      <span>{item.title}</span>
                      <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="ms-auto transition-transform duration-200 group-data-open/collapsible:rotate-90 rtl:rotate-180 rtl:group-data-open/collapsible:rotate-90" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              render={<a href={subItem.url} />}
                            >
                              <span>{subItem.title}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>{t.projects}</SidebarGroupLabel>
            <SidebarMenu>
              {projects.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton render={<a href={item.url} />}>
                    <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={<SidebarMenuAction showOnHover />}
                    >
                      <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
                      <span className="sr-only">{t.more}</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48 rounded-lg"
                      side={isMobile ? "bottom" : "inline-end"}
                      align={isMobile ? "end" : "start"}
                      dir={dir}
                    >
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <HugeiconsIcon icon={Folder01Icon} strokeWidth={2} className="text-muted-foreground" />
                          <span>{t.viewProject}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <HugeiconsIcon icon={SentIcon} strokeWidth={2} className="text-muted-foreground" />
                          <span>{t.shareProject}</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="text-muted-foreground" />
                          <span>{t.deleteProject}</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton className="text-sidebar-foreground/70">
                  <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} className="text-sidebar-foreground/70" />
                  <span>{t.more}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuButton
                      size="lg"
                      className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
                    />
                  }
                >
                  <Avatar className="rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-start text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                  <HugeiconsIcon icon={UnfoldMoreIcon} strokeWidth={2} className="ms-auto size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  side={isMobile ? "bottom" : "inline-end"}
                  align="end"
                  sideOffset={4}
                  dir={dir}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="rounded-lg">
                            CN
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-start text-sm leading-tight">
                          <span className="truncate font-medium">
                            {user.name}
                          </span>
                          <span className="truncate text-xs">{user.email}</span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <HugeiconsIcon icon={SparklesIcon} strokeWidth={2} />
                      {t.upgradeToPro}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <HugeiconsIcon icon={CheckmarkBadge01Icon} strokeWidth={2} />
                      {t.account}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <HugeiconsIcon icon={CreditCardIcon} strokeWidth={2} />
                      {t.billing}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <HugeiconsIcon icon={BellIcon} strokeWidth={2} />
                      {t.notifications}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <HugeiconsIcon icon={Logout01Icon} strokeWidth={2} />
                      {t.logOut}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header
          className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
          dir={dir}
        >
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
      </SidebarInset>
    </>
  )
}
