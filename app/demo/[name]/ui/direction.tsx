"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { arSA, he } from "date-fns/locale"
import {
  arSA as arSADayPicker,
  he as heDayPicker,
} from "react-day-picker/locale"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  AlertCircleIcon,
  Archive01Icon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUpDownIcon,
  ArrowUpRight01Icon,
  BluetoothIcon,
  Bookmark01Icon,
  Calculator01Icon,
  Calendar03Icon,
  CalendarAdd01Icon,
  CheckmarkBadge01Icon,
  CheckmarkCircle02Icon,
  CircleDashedIcon,
  Clock01Icon,
  CreditCardIcon,
  Delete02Icon,
  DotIcon,
  FilterHorizontalIcon,
  FolderCodeIcon,
  Happy01Icon,
  InformationCircleIcon,
  Mail01Icon,
  MoreHorizontalIcon,
  PlusSignIcon,
  RotateClockwiseIcon,
  Search01Icon,
  Settings02Icon,
  Tag01Icon,
  UnfoldMoreIcon,
  User03Icon,
} from "@hugeicons/core-free-icons"

import { useIsMobile } from "@/hooks/use-mobile"
import { Example, ExampleWrapper } from "@/components/example"
import {
  LanguageProvider,
  LanguageSelector,
  useLanguageContext,
  useTranslation,
  type Translations,
} from "@/components/language-selector"
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
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
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
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardAction,
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Label } from "@/components/ui/label"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function DirectionExample() {
  return (
    <LanguageProvider defaultLanguage="he">
      <div className="sticky top-0 z-20 flex justify-end border-b bg-background/70 px-4 py-2 backdrop-blur-md sm:px-6 lg:px-12">
        <LanguageSwitcher />
      </div>
      <ExampleWrapper>
        <AccordionRtl />
        <AlertDialogRtl />
        <AlertRtl />
        <AspectRatioRtl />
        <AvatarRtl />
        <BadgeRtl />
        <BreadcrumbRtl />
        <ButtonGroupRtl />
        <ButtonRtl />
        <CalendarRtl />
        <CardRtl />
        <CarouselRtl />
        <ChartRtl />
        <CheckboxRtl />
        <CollapsibleRtl />
        <ComboboxRtl />
        <CommandRtl />
        <ContextMenuRtl />
        <DataTableRtl />
        <DatePickerRtl />
        <DialogRtl />
        <DrawerRtl />
        <DropdownMenuRtl />
        <EmptyRtl />
        <FieldRtl />
        <HoverCardRtl />
        <InputGroupRtl />
        <InputOTPRtl />
        <InputRtl />
        <ItemRtl />
        <KbdRtl />
        <LabelRtl />
        <MenubarRtl />
        <NativeSelectRtl />
        <NavigationMenuRtl />
        <PaginationRtl />
        <PopoverRtl />
        <ProgressRtl />
        <RadioGroupRtl />
        <ResizableRtl />
        <ScrollAreaRtl />
        <ScrollFadeRtl />
        <SelectRtl />
        <SeparatorRtl />
        <SheetRtl />
        <ShimmerRtl />
        <SkeletonRtl />
        <SliderRtl />
        <SpinnerRtl />
        <SwitchRtl />
        <TableRtl />
        <TabsRtl />
        <TextareaRtl />
        <ToggleGroupRtl />
        <ToggleRtl />
        <TooltipRtl />
        <TypographyRtl />
      </ExampleWrapper>
    </LanguageProvider>
  )
}

function LanguageSwitcher() {
  const context = useLanguageContext()
  if (!context) return null

  return (
    <LanguageSelector
      value={context.language}
      onValueChange={context.setLanguage}
    />
  )
}

const accordionTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      question1: "How do I reset my password?",
      answer1:
        "Click on 'Forgot Password' on the login page, enter your email address, and we'll send you a link to reset your password.",
      question2: "Can I change my subscription plan?",
      answer2:
        "Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes will be reflected in your next billing cycle.",
      question3: "What payment methods do you accept?",
      answer3:
        "We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our payment partners.",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      question1: "كيف يمكنني إعادة تعيين كلمة المرور؟",
      answer1:
        "انقر على 'نسيت كلمة المرور' في صفحة تسجيل الدخول، أدخل عنوان بريدك الإلكتروني، وسنرسل لك رابطًا لإعادة تعيين كلمة المرور. سينتهي صلاحية الرابط خلال 24 ساعة.",
      question2: "هل يمكنني تغيير خطة الاشتراك الخاصة بي؟",
      answer2:
        "نعم، يمكنك ترقية أو تخفيض خطتك في أي وقت من إعدادات حسابك. ستظهر التغييرات في دورة الفوترة التالية.",
      question3: "ما هي طرق الدفع التي تقبلونها؟",
      answer3:
        "نقبل جميع بطاقات الائتمان الرئيسية و PayPal والتحويلات المصرفية. تتم معالجة جميع المدفوعات بأمان من خلال شركاء الدفع لدينا.",
    },
  },
  he: {
    dir: "rtl",
    values: {
      question1: "איך אני מאפס את הסיסמה שלי?",
      answer1:
        "לחץ על 'שכחתי סיסמה' בעמוד ההתחברות, הזן את כתובת האימייל שלך, ונשלח לך קישור לאיפוס הסיסמה. הקישור יפוג תוך 24 שעות.",
      question2: "האם אני יכול לשנות את תוכנית המנוי שלי?",
      answer2:
        "כן, אתה יכול לשדרג או להוריד את התוכנית שלך בכל עת מההגדרות של החשבון שלך. השינויים יבואו לידי ביטוי במחזור החיוב הבא.",
      question3: "אילו אמצעי תשלום אתם מקבלים?",
      answer3: "אנו מקבלים כרטיסי אשראי, PayPal והעברות בנקאיות.",
    },
  },
}

const accordionItems = [
  {
    value: "item-1",
    questionKey: "question1" as const,
    answerKey: "answer1" as const,
  },
  {
    value: "item-2",
    questionKey: "question2" as const,
    answerKey: "answer2" as const,
  },
  {
    value: "item-3",
    questionKey: "question3" as const,
    answerKey: "answer3" as const,
  },
] as const

function AccordionRtl() {
  const { t } = useTranslation(accordionTranslations, "ar")

  return (
    <Example title="Accordion">
      <Accordion defaultValue={["item-1"]} className="max-w-md">
        {accordionItems.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger>{t[item.questionKey]}</AccordionTrigger>
            <AccordionContent>{t[item.answerKey]}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Example>
  )
}

const alertDialogTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      showDialog: "Show Dialog",
      showDialogSm: "Show Dialog (sm)",
      title: "Are you absolutely sure?",
      description:
        "This action cannot be undone. This will permanently delete your account from our servers.",
      cancel: "Cancel",
      continue: "Continue",
      smallTitle: "Allow accessory to connect?",
      smallDescription:
        "Do you want to allow the USB accessory to connect to this device?",
      dontAllow: "Don't allow",
      allow: "Allow",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      showDialog: "إظهار الحوار",
      showDialogSm: "إظهار الحوار (صغير)",
      title: "هل أنت متأكد تمامًا؟",
      description:
        "لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف حسابك نهائيًا من خوادمنا.",
      cancel: "إلغاء",
      continue: "متابعة",
      smallTitle: "السماح للملحق بالاتصال؟",
      smallDescription: "هل تريد السماح لملحق USB بالاتصال بهذا الجهاز؟",
      dontAllow: "عدم السماح",
      allow: "السماح",
    },
  },
  he: {
    dir: "rtl",
    values: {
      showDialog: "הצג דיאלוג",
      showDialogSm: "הצג דיאלוג (קטן)",
      title: "האם אתה בטוח לחלוטין?",
      description:
        "פעולה זו לא ניתנת לביטול. זה ימחק לצמיתות את החשבון שלך מהשרתים שלנו.",
      cancel: "ביטול",
      continue: "המשך",
      smallTitle: "לאפשר להתקן להתחבר?",
      smallDescription: "האם אתה רוצה לאפשר להתקן USB להתחבר למכשיר זה?",
      dontAllow: "אל תאפשר",
      allow: "אפשר",
    },
  },
}

function AlertDialogRtl() {
  const { dir, t, language } = useTranslation(alertDialogTranslations, "ar")

  return (
    <Example title="Alert Dialog">
      <div className="flex gap-4" dir={dir}>
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="outline" />}>
            {t.showDialog}
          </AlertDialogTrigger>
          <AlertDialogContent
            dir={dir}
            data-lang={dir === "rtl" ? language : undefined}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>{t.title}</AlertDialogTitle>
              <AlertDialogDescription>{t.description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
              <AlertDialogAction>{t.continue}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="outline" />}>
            {t.showDialogSm}
          </AlertDialogTrigger>
          <AlertDialogContent
            size="sm"
            dir={dir}
            data-lang={dir === "rtl" ? language : undefined}
          >
            <AlertDialogHeader>
              <AlertDialogMedia>
                <HugeiconsIcon icon={BluetoothIcon} strokeWidth={2} />
              </AlertDialogMedia>
              <AlertDialogTitle>{t.smallTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                {t.smallDescription}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t.dontAllow}</AlertDialogCancel>
              <AlertDialogAction>{t.allow}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Example>
  )
}

const alertTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      paymentTitle: "Payment successful",
      paymentDescription:
        "Your payment of $29.99 has been processed. A receipt has been sent to your email address.",
      featureTitle: "New feature available",
      featureDescription:
        "We've added dark mode support. You can enable it in your account settings.",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      paymentTitle: "تم الدفع بنجاح",
      paymentDescription:
        "تمت معالجة دفعتك البالغة 29.99 دولارًا. تم إرسال إيصال إلى عنوان بريدك الإلكتروني.",
      featureTitle: "ميزة جديدة متاحة",
      featureDescription:
        "لقد أضفنا دعم الوضع الداكن. يمكنك تفعيله في إعدادات حسابك.",
    },
  },
  he: {
    dir: "rtl",
    values: {
      paymentTitle: "התשלום בוצע בהצלחה",
      paymentDescription:
        "התשלום שלך בסך 29.99 דולר עובד. קבלה נשלחה לכתובת האימייל שלך.",
      featureTitle: "תכונה חדשה זמינה",
      featureDescription:
        "הוספנו תמיכה במצב כהה. אתה יכול להפעיל אותו בהגדרות החשבון שלך.",
    },
  },
}

const alertItems = [
  {
    icon: CheckmarkCircle02Icon,
    titleKey: "paymentTitle" as const,
    descriptionKey: "paymentDescription" as const,
  },
  {
    icon: InformationCircleIcon,
    titleKey: "featureTitle" as const,
    descriptionKey: "featureDescription" as const,
  },
] as const

function AlertRtl() {
  const { dir, t } = useTranslation(alertTranslations, "ar")

  return (
    <Example title="Alert">
      <div className="grid w-full max-w-md items-start gap-4" dir={dir}>
        {alertItems.map((alert, index) => {
          const Icon = alert.icon
          return (
            <Alert key={index}>
              <HugeiconsIcon icon={Icon} strokeWidth={2} />
              <AlertTitle>{t[alert.titleKey]}</AlertTitle>
              <AlertDescription>{t[alert.descriptionKey]}</AlertDescription>
            </Alert>
          )
        })}
      </div>
    </Example>
  )
}

const aspectRatioTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      caption: "Beautiful landscape",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      caption: "منظر طبيعي جميل",
    },
  },
  he: {
    dir: "rtl",
    values: {
      caption: "נוף יפה",
    },
  },
}

function AspectRatioRtl() {
  const { dir, t } = useTranslation(aspectRatioTranslations, "ar")

  return (
    <Example title="Aspect Ratio">
      <figure className="w-full max-w-sm" dir={dir}>
        <AspectRatio ratio={16 / 9} className="rounded-lg bg-muted">
          <Image
            src="https://avatar.vercel.sh/shadcn1"
            alt="Photo"
            fill
            className="rounded-lg object-cover grayscale dark:brightness-20"
          />
        </AspectRatio>
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {t.caption}
        </figcaption>
      </figure>
    </Example>
  )
}

const avatarTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      moreUsers: "+3",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      moreUsers: "+٣",
    },
  },
  he: {
    dir: "rtl",
    values: {
      moreUsers: "+3",
    },
  },
}

function AvatarRtl() {
  const { dir, t } = useTranslation(avatarTranslations, "ar")

  return (
    <Example title="Avatar">
      <div
        className="flex flex-row flex-wrap items-center gap-6 md:gap-12"
        dir={dir}
      >
        <Avatar>
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt="@shadcn"
            className="grayscale"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            src="https://github.com/evilrabbit.png"
            alt="@evilrabbit"
          />
          <AvatarFallback>ER</AvatarFallback>
          <AvatarBadge className="bg-green-600 dark:bg-green-800" />
        </Avatar>
        <AvatarGroup className="grayscale">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src="https://github.com/maxleiter.png"
              alt="@maxleiter"
            />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src="https://github.com/evilrabbit.png"
              alt="@evilrabbit"
            />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>{t.moreUsers}</AvatarGroupCount>
        </AvatarGroup>
      </div>
    </Example>
  )
}

const badgeTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      badge: "Badge",
      secondary: "Secondary",
      destructive: "Destructive",
      outline: "Outline",
      verified: "Verified",
      bookmark: "Bookmark",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      badge: "شارة",
      secondary: "ثانوي",
      destructive: "مدمر",
      outline: "مخطط",
      verified: "متحقق",
      bookmark: "إشارة مرجعية",
    },
  },
  he: {
    dir: "rtl",
    values: {
      badge: "תג",
      secondary: "משני",
      destructive: "הרסני",
      outline: "קווי מתאר",
      verified: "מאומת",
      bookmark: "סימנייה",
    },
  },
}

function BadgeRtl() {
  const { dir, t } = useTranslation(badgeTranslations, "ar")

  return (
    <Example title="Badge">
      <div className="flex w-full flex-wrap justify-center gap-2" dir={dir}>
        <Badge>{t.badge}</Badge>
        <Badge variant="secondary">{t.secondary}</Badge>
        <Badge variant="destructive">{t.destructive}</Badge>
        <Badge variant="outline">{t.outline}</Badge>
        <Badge variant="secondary">
          <HugeiconsIcon
            icon={CheckmarkBadge01Icon}
            data-icon="inline-start"
            strokeWidth={2}
          />
          {t.verified}
        </Badge>
        <Badge variant="outline">
          {t.bookmark}
          <HugeiconsIcon
            icon={Bookmark01Icon}
            data-icon="inline-end"
            strokeWidth={2}
          />
        </Badge>
      </div>
    </Example>
  )
}

const breadcrumbTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      home: "Home",
      components: "Components",
      documentation: "Documentation",
      themes: "Themes",
      github: "GitHub",
      breadcrumb: "Breadcrumb",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      home: "الرئيسية",
      components: "المكونات",
      documentation: "التوثيق",
      themes: "السمات",
      github: "جيت هاب",
      breadcrumb: "مسار التنقل",
    },
  },
  he: {
    dir: "rtl",
    values: {
      home: "בית",
      components: "רכיבים",
      documentation: "תיעוד",
      themes: "ערכות נושא",
      github: "גיטהאב",
      breadcrumb: "פירורי לחם",
    },
  },
}

function BreadcrumbRtl() {
  const { dir, t, language } = useTranslation(breadcrumbTranslations, "ar")

  return (
    <Example title="Breadcrumb">
      <Breadcrumb dir={dir}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>{t.home}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <HugeiconsIcon icon={DotIcon} strokeWidth={2} />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<button className="flex items-center gap-1" />}
              >
                {t.components}
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  data-icon="inline-end"
                  className="size-3.5"
                  strokeWidth={2}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align={dir === "rtl" ? "end" : "start"}
                data-lang={dir === "rtl" ? language : undefined}
                dir={dir}
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem>{t.documentation}</DropdownMenuItem>
                  <DropdownMenuItem>{t.themes}</DropdownMenuItem>
                  <DropdownMenuItem>{t.github}</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <HugeiconsIcon icon={DotIcon} strokeWidth={2} />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{t.breadcrumb}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </Example>
  )
}

const buttonGroupTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      archive: "Archive",
      report: "Report",
      snooze: "Snooze",
      markAsRead: "Mark as Read",
      addToCalendar: "Add to Calendar",
      addToList: "Add to List",
      labelAs: "Label As...",
      personal: "Personal",
      work: "Work",
      other: "Other",
      trash: "Trash",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      archive: "أرشفة",
      report: "تقرير",
      snooze: "تأجيل",
      markAsRead: "وضع علامة كمقروء",
      addToCalendar: "إضافة إلى التقويم",
      addToList: "إضافة إلى القائمة",
      labelAs: "تصنيف كـ...",
      personal: "شخصي",
      work: "عمل",
      other: "آخر",
      trash: "سلة المهملات",
    },
  },
  he: {
    dir: "rtl",
    values: {
      archive: "ארכיון",
      report: "דוח",
      snooze: "דחה",
      markAsRead: "סמן כנקרא",
      addToCalendar: "הוסף ליומן",
      addToList: "הוסף לרשימה",
      labelAs: "תייג כ...",
      personal: "אישי",
      work: "עבודה",
      other: "אחר",
      trash: "פח",
    },
  },
}

function ButtonGroupRtl() {
  const { dir, t, language } = useTranslation(buttonGroupTranslations, "ar")
  const [label, setLabel] = React.useState("personal")

  return (
    <Example title="Button Group">
      <div dir={dir}>
        <ButtonGroup>
          <ButtonGroup className="hidden sm:flex">
            <Button variant="outline" size="icon" aria-label="Go Back">
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                className="rtl:rotate-180"
                strokeWidth={2}
              />
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="outline">{t.archive}</Button>
            <Button variant="outline">{t.report}</Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="outline">{t.snooze}</Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="More Options"
                  />
                }
              >
                <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align={dir === "rtl" ? "start" : "end"}
                data-lang={dir === "rtl" ? language : undefined}
                dir={dir}
                className="w-40"
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={Mail01Icon} strokeWidth={2} />
                    {t.markAsRead}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={Archive01Icon} strokeWidth={2} />
                    {t.archive}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} />
                    {t.snooze}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={CalendarAdd01Icon} strokeWidth={2} />
                    {t.addToCalendar}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HugeiconsIcon
                      icon={FilterHorizontalIcon}
                      strokeWidth={2}
                    />
                    {t.addToList}
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <HugeiconsIcon icon={Tag01Icon} strokeWidth={2} />
                      {t.labelAs}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent
                      dir={dir}
                      data-lang={dir === "rtl" ? language : undefined}
                    >
                      <DropdownMenuRadioGroup
                        value={label}
                        onValueChange={setLabel}
                      >
                        <DropdownMenuRadioItem value="personal">
                          {t.personal}
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="work">
                          {t.work}
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="other">
                          {t.other}
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem variant="destructive">
                    <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                    {t.trash}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
        </ButtonGroup>
      </div>
    </Example>
  )
}

const buttonTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      button: "Button",
      submit: "Submit",
      delete: "Delete",
      loading: "Loading",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      button: "زر",
      submit: "إرسال",
      delete: "حذف",
      loading: "جاري التحميل",
    },
  },
  he: {
    dir: "rtl",
    values: {
      button: "כפתור",
      submit: "שלח",
      delete: "מחק",
      loading: "טוען",
    },
  },
}

function ButtonRtl() {
  const { dir, t } = useTranslation(buttonTranslations, "ar")

  return (
    <Example title="Button">
      <div className="flex flex-wrap items-center gap-2 md:flex-row" dir={dir}>
        <Button variant="outline">{t.button}</Button>
        <Button variant="destructive">{t.delete}</Button>
        <Button variant="outline">
          {t.submit}{" "}
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className="rtl:rotate-180"
            data-icon="inline-end"
            strokeWidth={2}
          />
        </Button>
        <Button variant="outline" size="icon" aria-label="Add">
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
        </Button>
        <Button variant="secondary" disabled>
          <Spinner data-icon="inline-start" /> {t.loading}
        </Button>
      </div>
    </Example>
  )
}

const calendarTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {},
  },
  ar: {
    dir: "rtl",
    values: {},
  },
  he: {
    dir: "rtl",
    values: {},
  },
}

const calendarLocales = {
  ar: arSADayPicker,
  he: heDayPicker,
} as const

function CalendarRtl() {
  const { dir, language } = useTranslation(calendarTranslations, "ar")
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <Example title="Calendar">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-lg border [--cell-size:--spacing(9)]"
        captionLayout="dropdown"
        dir={dir}
        locale={
          dir === "rtl"
            ? calendarLocales[language as keyof typeof calendarLocales]
            : undefined
        }
      />
    </Example>
  )
}

const cardTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      title: "Login to your account",
      description: "Enter your email below to login to your account",
      signUp: "Sign Up",
      email: "Email",
      emailPlaceholder: "m@example.com",
      password: "Password",
      forgotPassword: "Forgot your password?",
      login: "Login",
      loginWithGoogle: "Login with Google",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      title: "تسجيل الدخول إلى حسابك",
      description: "أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك",
      signUp: "إنشاء حساب",
      email: "البريد الإلكتروني",
      emailPlaceholder: "m@example.com",
      password: "كلمة المرور",
      forgotPassword: "نسيت كلمة المرور؟",
      login: "تسجيل الدخول",
      loginWithGoogle: "تسجيل الدخول باستخدام Google",
    },
  },
  he: {
    dir: "rtl",
    values: {
      title: "התחבר לחשבון שלך",
      description: "הזן את האימייל שלך למטה כדי להתחבר לחשבון שלך",
      signUp: "הירשם",
      email: "אימייל",
      emailPlaceholder: "m@example.com",
      password: "סיסמה",
      forgotPassword: "שכחת את הסיסמה?",
      login: "התחבר",
      loginWithGoogle: "התחבר עם Google",
    },
  },
}

function CardRtl() {
  const { dir, t } = useTranslation(cardTranslations, "ar")

  return (
    <Example title="Card">
      <Card className="w-full max-w-sm" dir={dir}>
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
          <CardAction>
            <Button variant="link">{t.signUp}</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email-rtl">{t.email}</Label>
                <Input
                  id="email-rtl"
                  type="email"
                  placeholder={t.emailPlaceholder}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password-rtl">{t.password}</Label>
                  <a
                    href="#"
                    className="ms-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    {t.forgotPassword}
                  </a>
                </div>
                <Input id="password-rtl" type="password" required />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            {t.login}
          </Button>
          <Button variant="outline" className="w-full">
            {t.loginWithGoogle}
          </Button>
        </CardFooter>
      </Card>
    </Example>
  )
}

const carouselTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {},
  },
  ar: {
    dir: "rtl",
    values: {},
  },
  he: {
    dir: "rtl",
    values: {},
  },
}

function toArabicNumerals(num: number): string {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"]
  return num
    .toString()
    .split("")
    .map((digit) => arabicNumerals[parseInt(digit, 10)])
    .join("")
}

function CarouselRtl() {
  const { dir, language } = useTranslation(carouselTranslations, "ar")

  const formatNumber = (num: number): string => {
    if (language === "ar") {
      return toArabicNumerals(num)
    }
    return num.toString()
  }

  return (
    <Example title="Carousel">
      <Carousel
        dir={dir}
        className="w-full max-w-[12rem] sm:max-w-xs"
        opts={{
          direction: dir,
        }}
      >
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">
                      {formatNumber(index + 1)}
                    </span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </Example>
  )
}

const chartTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      january: "January",
      february: "February",
      march: "March",
      april: "April",
      may: "May",
      june: "June",
      desktop: "Desktop",
      mobile: "Mobile",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      january: "يناير",
      february: "فبراير",
      march: "مارس",
      april: "أبريل",
      may: "مايو",
      june: "يونيو",
      desktop: "سطح المكتب",
      mobile: "الجوال",
    },
  },
  he: {
    dir: "rtl",
    values: {
      january: "ינואר",
      february: "פברואר",
      march: "מרץ",
      april: "אפריל",
      may: "מאי",
      june: "יוני",
      desktop: "מחשב",
      mobile: "נייד",
    },
  },
}

const chartData = [
  { month: "january", desktop: 186, mobile: 80 },
  { month: "february", desktop: 305, mobile: 200 },
  { month: "march", desktop: 237, mobile: 120 },
  { month: "april", desktop: 73, mobile: 190 },
  { month: "may", desktop: 209, mobile: 130 },
  { month: "june", desktop: 214, mobile: 140 },
]

function ChartRtl() {
  const { t, dir } = useTranslation(chartTranslations, "ar")

  const chartConfig = {
    desktop: {
      label: t.desktop,
      color: "var(--chart-2)",
    },
    mobile: {
      label: t.mobile,
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig

  return (
    <Example title="Chart">
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid
            vertical={false}
            orientation={dir === "rtl" ? "right" : "left"}
          />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) =>
              (t[value as keyof typeof t] as string).slice(0, 3)
            }
            reversed={dir === "rtl"}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(value) => t[value as keyof typeof t] as string}
              />
            }
            labelClassName="w-32"
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
        </BarChart>
      </ChartContainer>
    </Example>
  )
}

const checkboxTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      acceptTerms: "Accept terms and conditions",
      acceptTermsDescription:
        "By clicking this checkbox, you agree to the terms.",
      enableNotifications: "Enable notifications",
      enableNotificationsDescription:
        "You can enable or disable notifications at any time.",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      acceptTerms: "قبول الشروط والأحكام",
      acceptTermsDescription: "بالنقر على هذا المربع، فإنك توافق على الشروط.",
      enableNotifications: "تفعيل الإشعارات",
      enableNotificationsDescription:
        "يمكنك تفعيل أو إلغاء تفعيل الإشعارات في أي وقت.",
    },
  },
  he: {
    dir: "rtl",
    values: {
      acceptTerms: "קבל תנאים והגבלות",
      acceptTermsDescription:
        "על ידי לחיצה על תיבת הסימון הזו, אתה מסכים לתנאים.",
      enableNotifications: "הפעל התראות",
      enableNotificationsDescription:
        "אתה יכול להפעיל או להשבית התראות בכל עת.",
    },
  },
}

function CheckboxRtl() {
  const { dir, t } = useTranslation(checkboxTranslations, "ar")

  return (
    <Example title="Checkbox">
      <FieldGroup className="max-w-sm" dir={dir}>
        <Field orientation="horizontal">
          <Checkbox id="terms-checkbox-rtl" name="terms-checkbox" />
          <Label htmlFor="terms-checkbox-rtl">{t.acceptTerms}</Label>
        </Field>
        <Field orientation="horizontal">
          <Checkbox
            id="terms-checkbox-2-rtl"
            name="terms-checkbox-2"
            defaultChecked
          />
          <FieldContent>
            <FieldLabel htmlFor="terms-checkbox-2-rtl">
              {t.acceptTerms}
            </FieldLabel>
            <FieldDescription>{t.acceptTermsDescription}</FieldDescription>
          </FieldContent>
        </Field>
        <Field orientation="horizontal" data-disabled>
          <Checkbox id="toggle-checkbox-rtl" name="toggle-checkbox" disabled />
          <FieldLabel htmlFor="toggle-checkbox-rtl">
            {t.enableNotifications}
          </FieldLabel>
        </Field>
        <FieldLabel>
          <Field orientation="horizontal">
            <Checkbox id="toggle-checkbox-2" name="toggle-checkbox-2" />
            <FieldContent>
              <FieldTitle>{t.enableNotifications}</FieldTitle>
              <FieldDescription>
                {t.enableNotificationsDescription}
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>
      </FieldGroup>
    </Example>
  )
}

const collapsibleTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      orderNumber: "Order #4189",
      status: "Status",
      shipped: "Shipped",
      shippingAddress: "Shipping address",
      address: "100 Market St, San Francisco",
      items: "Items",
      itemsDescription: "2x Studio Headphones",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      orderNumber: "الطلب #4189",
      status: "الحالة",
      shipped: "تم الشحن",
      shippingAddress: "عنوان الشحن",
      address: "100 Market St, San Francisco",
      items: "العناصر",
      itemsDescription: "2x سماعات الاستوديو",
    },
  },
  he: {
    dir: "rtl",
    values: {
      orderNumber: "הזמנה #4189",
      status: "סטטוס",
      shipped: "נשלח",
      shippingAddress: "כתובת משלוח",
      address: "100 Market St, San Francisco",
      items: "פריטים",
      itemsDescription: "2x אוזניות סטודיו",
    },
  },
}

function CollapsibleRtl() {
  const { dir, t } = useTranslation(collapsibleTranslations, "ar")
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Example title="Collapsible">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="flex w-[350px] flex-col gap-2"
        dir={dir}
      >
        <div className="flex items-center justify-between gap-4 px-4">
          <h4 className="text-sm font-semibold">{t.orderNumber}</h4>
          <CollapsibleTrigger
            render={<Button variant="ghost" size="icon" className="size-8" />}
          >
            <HugeiconsIcon icon={UnfoldMoreIcon} strokeWidth={2} />
            <span className="sr-only">Toggle details</span>
          </CollapsibleTrigger>
        </div>
        <div className="flex items-center justify-between rounded-md border px-4 py-2 text-sm">
          <span className="text-muted-foreground">{t.status}</span>
          <span className="font-medium">{t.shipped}</span>
        </div>
        <CollapsibleContent className="flex flex-col gap-2">
          <div className="rounded-md border px-4 py-2 text-sm">
            <p className="font-medium">{t.shippingAddress}</p>
            <p className="text-muted-foreground">{t.address}</p>
          </div>
          <div className="rounded-md border px-4 py-2 text-sm">
            <p className="font-medium">{t.items}</p>
            <p className="text-muted-foreground">{t.itemsDescription}</p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Example>
  )
}

const comboboxCategories = [
  "technology",
  "design",
  "business",
  "marketing",
  "education",
  "health",
] as const

const comboboxTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      label: "Categories",
      placeholder: "Add categories",
      empty: "No categories found.",
      technology: "Technology",
      design: "Design",
      business: "Business",
      marketing: "Marketing",
      education: "Education",
      health: "Health",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      label: "الفئات",
      placeholder: "أضف فئات",
      empty: "لم يتم العثور على فئات.",
      technology: "التكنولوجيا",
      design: "التصميم",
      business: "الأعمال",
      marketing: "التسويق",
      education: "التعليم",
      health: "الصحة",
    },
  },
  he: {
    dir: "rtl",
    values: {
      label: "קטגוריות",
      placeholder: "הוסף קטגוריות",
      empty: "לא נמצאו קטגוריות.",
      technology: "טכנולוגיה",
      design: "עיצוב",
      business: "עסקים",
      marketing: "שיווק",
      education: "חינוך",
      health: "בריאות",
    },
  },
}

function ComboboxRtl() {
  const { dir, t, language } = useTranslation(comboboxTranslations, "ar")
  const anchor = useComboboxAnchor()

  const categoryLabels: Record<string, string> = {
    technology: t.technology,
    design: t.design,
    business: t.business,
    marketing: t.marketing,
    education: t.education,
    health: t.health,
  }

  return (
    <Example title="Combobox">
      <Field className="mx-auto w-full max-w-xs">
        <FieldLabel>{t.label}</FieldLabel>
        <Combobox
          multiple
          autoHighlight
          items={comboboxCategories}
          defaultValue={[comboboxCategories[0]]}
          itemToStringValue={(item: (typeof comboboxCategories)[number]) =>
            categoryLabels[item] || item
          }
        >
          <ComboboxChips ref={anchor}>
            <ComboboxValue>
              {(values) => (
                <React.Fragment>
                  {values.map((value: string) => (
                    <ComboboxChip key={value}>
                      {categoryLabels[value] || value}
                    </ComboboxChip>
                  ))}
                  <ComboboxChipsInput placeholder={t.placeholder} />
                </React.Fragment>
              )}
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxContent
            anchor={anchor}
            dir={dir}
            data-lang={dir === "rtl" ? language : undefined}
          >
            <ComboboxEmpty>{t.empty}</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item} value={item}>
                  {categoryLabels[item] || item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>
    </Example>
  )
}

const commandTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      placeholder: "Type a command or search...",
      empty: "No results found.",
      suggestions: "Suggestions",
      calendar: "Calendar",
      searchEmoji: "Search Emoji",
      calculator: "Calculator",
      settings: "Settings",
      profile: "Profile",
      billing: "Billing",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      placeholder: "اكتب أمرًا أو ابحث...",
      empty: "لم يتم العثور على نتائج.",
      suggestions: "اقتراحات",
      calendar: "التقويم",
      searchEmoji: "البحث عن الرموز التعبيرية",
      calculator: "الآلة الحاسبة",
      settings: "الإعدادات",
      profile: "الملف الشخصي",
      billing: "الفوترة",
    },
  },
  he: {
    dir: "rtl",
    values: {
      placeholder: "הקלד פקודה או חפש...",
      empty: "לא נמצאו תוצאות.",
      suggestions: "הצעות",
      calendar: "לוח שנה",
      searchEmoji: "חפש אמוג'י",
      calculator: "מחשבון",
      settings: "הגדרות",
      profile: "פרופיל",
      billing: "חיוב",
    },
  },
}

function CommandRtl() {
  const { dir, t } = useTranslation(commandTranslations, "ar")

  return (
    <Example title="Command">
      <Command className="max-w-sm rounded-lg border" dir={dir}>
        <CommandInput placeholder={t.placeholder} dir={dir} />
        <CommandList>
          <CommandEmpty>{t.empty}</CommandEmpty>
          <CommandGroup heading={t.suggestions}>
            <CommandItem>
              <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} />
              <span>{t.calendar}</span>
            </CommandItem>
            <CommandItem>
              <HugeiconsIcon icon={Happy01Icon} strokeWidth={2} />
              <span>{t.searchEmoji}</span>
            </CommandItem>
            <CommandItem disabled>
              <HugeiconsIcon icon={Calculator01Icon} strokeWidth={2} />
              <span>{t.calculator}</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading={t.settings}>
            <CommandItem>
              <HugeiconsIcon icon={User03Icon} strokeWidth={2} />
              <span>{t.profile}</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <HugeiconsIcon icon={CreditCardIcon} strokeWidth={2} />
              <span>{t.billing}</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <HugeiconsIcon icon={Settings02Icon} strokeWidth={2} />
              <span>{t.settings}</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </Example>
  )
}

const contextMenuTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      rightClick: "Right click here",
      longPress: "Long press here",
      navigation: "Navigation",
      back: "Back",
      forward: "Forward",
      reload: "Reload",
      moreTools: "More Tools",
      savePage: "Save Page...",
      createShortcut: "Create Shortcut...",
      nameWindow: "Name Window...",
      developerTools: "Developer Tools",
      delete: "Delete",
      showBookmarks: "Show Bookmarks",
      showFullUrls: "Show Full URLs",
      people: "People",
      pedro: "Pedro Duarte",
      colm: "Colm Tuite",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      rightClick: "انقر بزر الماوس الأيمن هنا",
      longPress: "اضغط مطولاً هنا",
      navigation: "التنقل",
      back: "رجوع",
      forward: "تقدم",
      reload: "إعادة تحميل",
      moreTools: "المزيد من الأدوات",
      savePage: "حفظ الصفحة...",
      createShortcut: "إنشاء اختصار...",
      nameWindow: "تسمية النافذة...",
      developerTools: "أدوات المطور",
      delete: "حذف",
      showBookmarks: "إظهار الإشارات المرجعية",
      showFullUrls: "إظهار عناوين URL الكاملة",
      people: "الأشخاص",
      pedro: "Pedro Duarte",
      colm: "Colm Tuite",
    },
  },
  he: {
    dir: "rtl",
    values: {
      rightClick: "לחץ לחיצה ימנית כאן",
      longPress: "לחץ לחיצה ארוכה כאן",
      navigation: "ניווט",
      back: "חזור",
      forward: "קדימה",
      reload: "רענן",
      moreTools: "כלים נוספים",
      savePage: "שמור עמוד...",
      createShortcut: "צור קיצור דרך...",
      nameWindow: "שם חלון...",
      developerTools: "כלי מפתח",
      delete: "מחק",
      showBookmarks: "הצג סימניות",
      showFullUrls: "הצג כתובות URL מלאות",
      people: "אנשים",
      pedro: "Pedro Duarte",
      colm: "Colm Tuite",
    },
  },
}

function ContextMenuRtl() {
  const { dir, t, language } = useTranslation(contextMenuTranslations, "ar")
  const [people, setPeople] = React.useState("pedro")

  return (
    <Example title="Context Menu">
      <ContextMenu>
        <ContextMenuTrigger className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm">
          <span className="hidden pointer-fine:inline-block">
            {t.rightClick}
          </span>
          <span className="hidden pointer-coarse:inline-block">
            {t.longPress}
          </span>
        </ContextMenuTrigger>
        <ContextMenuContent
          className="w-48"
          dir={dir}
          data-lang={dir === "rtl" ? language : undefined}
        >
          <ContextMenuGroup>
            <ContextMenuSub>
              <ContextMenuSubTrigger>{t.navigation}</ContextMenuSubTrigger>
              <ContextMenuSubContent
                className="w-44"
                dir={dir}
                data-lang={dir === "rtl" ? language : undefined}
              >
                <ContextMenuGroup>
                  <ContextMenuItem>
                    <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
                    {t.back}
                    <ContextMenuShortcut>⌘[</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuItem disabled>
                    <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
                    {t.forward}
                    <ContextMenuShortcut>⌘]</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <HugeiconsIcon icon={RotateClockwiseIcon} strokeWidth={2} />
                    {t.reload}
                    <ContextMenuShortcut>⌘R</ContextMenuShortcut>
                  </ContextMenuItem>
                </ContextMenuGroup>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSub>
              <ContextMenuSubTrigger>{t.moreTools}</ContextMenuSubTrigger>
              <ContextMenuSubContent
                className="w-44"
                dir={dir}
                data-lang={dir === "rtl" ? language : undefined}
              >
                <ContextMenuGroup>
                  <ContextMenuItem>{t.savePage}</ContextMenuItem>
                  <ContextMenuItem>{t.createShortcut}</ContextMenuItem>
                  <ContextMenuItem>{t.nameWindow}</ContextMenuItem>
                </ContextMenuGroup>
                <ContextMenuSeparator />
                <ContextMenuGroup>
                  <ContextMenuItem>{t.developerTools}</ContextMenuItem>
                </ContextMenuGroup>
                <ContextMenuSeparator />
                <ContextMenuGroup>
                  <ContextMenuItem variant="destructive">
                    {t.delete}
                  </ContextMenuItem>
                </ContextMenuGroup>
              </ContextMenuSubContent>
            </ContextMenuSub>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuCheckboxItem checked>
              {t.showBookmarks}
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem>{t.showFullUrls}</ContextMenuCheckboxItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuRadioGroup value={people} onValueChange={setPeople}>
              <ContextMenuLabel>{t.people}</ContextMenuLabel>
              <ContextMenuRadioItem value="pedro">
                {t.pedro}
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="colm">{t.colm}</ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </Example>
  )
}

const dataTableTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      filterEmails: "Filter emails...",
      columns: "Columns",
      status: "Status",
      email: "Email",
      amount: "Amount",
      actions: "Actions",
      copyPaymentId: "Copy payment ID",
      viewCustomer: "View customer",
      viewPaymentDetails: "View payment details",
      selectAll: "Select all",
      selectRow: "Select row",
      openMenu: "Open menu",
      noResults: "No results.",
      rowsSelected: "of",
      rowsSelectedSuffix: "row(s) selected.",
      previous: "Previous",
      next: "Next",
      success: "Success",
      processing: "Processing",
      failed: "Failed",
      pending: "Pending",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      filterEmails: "تصفية البريد الإلكتروني...",
      columns: "الأعمدة",
      status: "الحالة",
      email: "البريد الإلكتروني",
      amount: "المبلغ",
      actions: "الإجراءات",
      copyPaymentId: "نسخ معرف الدفع",
      viewCustomer: "عرض العميل",
      viewPaymentDetails: "عرض تفاصيل الدفع",
      selectAll: "تحديد الكل",
      selectRow: "تحديد الصف",
      openMenu: "فتح القائمة",
      noResults: "لا توجد نتائج.",
      rowsSelected: "من",
      rowsSelectedSuffix: "صف(وف) محدد.",
      previous: "السابق",
      next: "التالي",
      success: "ناجح",
      processing: "قيد المعالجة",
      failed: "فشل",
      pending: "قيد الانتظار",
    },
  },
  he: {
    dir: "rtl",
    values: {
      filterEmails: "סנן אימיילים...",
      columns: "עמודות",
      status: "סטטוס",
      email: "אימייל",
      amount: "סכום",
      actions: "פעולות",
      copyPaymentId: "העתק מזהה תשלום",
      viewCustomer: "צפה בלקוח",
      viewPaymentDetails: "צפה בפרטי תשלום",
      selectAll: "בחר הכל",
      selectRow: "בחר שורה",
      openMenu: "פתח תפריט",
      noResults: "אין תוצאות.",
      rowsSelected: "מתוך",
      rowsSelectedSuffix: "שורות נבחרו.",
      previous: "הקודם",
      next: "הבא",
      success: "הצליח",
      processing: "מעבד",
      failed: "נכשל",
      pending: "ממתין",
    },
  },
}

type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

const payments: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@example.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@example.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@example.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@example.com",
  },
]

function DataTableRtl() {
  const { t, dir, language } = useTranslation(dataTableTranslations, "ar")
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const columns: ColumnDef<Payment>[] = React.useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() ? true : false)
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label={t.selectAll}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label={t.selectRow}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "status",
        header: t.status,
        cell: ({ row }) => {
          const status = row.getValue("status") as string
          const statusMap: Record<string, string> = {
            success: t.success,
            processing: t.processing,
            failed: t.failed,
            pending: t.pending,
          }
          return <div className="capitalize">{statusMap[status]}</div>
        },
      },
      {
        accessorKey: "email",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {t.email}
              <HugeiconsIcon icon={ArrowUpDownIcon} strokeWidth={2} />
            </Button>
          )
        },
        cell: ({ row }) => (
          <div className="lowercase">{row.getValue("email")}</div>
        ),
      },
      {
        accessorKey: "amount",
        header: () => <div className="text-start">{t.amount}</div>,
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("amount"))
          const formatted = new Intl.NumberFormat(
            dir === "rtl" ? "ar-SA" : "en-US",
            {
              style: "currency",
              currency: "USD",
            }
          ).format(amount)

          return <div className="text-start font-medium">{formatted}</div>
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const payment = row.original

          return (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon-xs" />}
              >
                <span className="sr-only">{t.openMenu}</span>
                <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align={dir === "rtl" ? "start" : "end"}
                data-lang={dir === "rtl" ? language : undefined}
                className="w-40"
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel>{t.actions}</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(payment.id)}
                  >
                    {t.copyPaymentId}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>{t.viewCustomer}</DropdownMenuItem>
                  <DropdownMenuItem>{t.viewPaymentDetails}</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [t, dir, language]
  )

  const table = useReactTable({
    data: payments,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <Example title="Data Table">
      <div className="w-full">
        <div className="flex items-center gap-2 py-4">
          <Input
            placeholder={t.filterEmails}
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" className="ms-auto" />}
            >
              {t.columns}{" "}
              <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align={dir === "rtl" ? "start" : "end"}
              data-lang={dir === "rtl" ? language : undefined}
            >
              <DropdownMenuGroup>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {t.noResults}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end gap-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} {t.rowsSelected}{" "}
            {table.getFilteredRowModel().rows.length} {t.rowsSelectedSuffix}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {t.previous}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {t.next}
            </Button>
          </div>
        </div>
      </div>
    </Example>
  )
}

const datePickerTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      placeholder: "Pick a date",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      placeholder: "اختر تاريخًا",
    },
  },
  he: {
    dir: "rtl",
    values: {
      placeholder: "בחר תאריך",
    },
  },
}

const dayPickerLocales = {
  ar: arSADayPicker,
  he: heDayPicker,
} as const

const dateFnsLocales = {
  ar: arSA,
  he: he,
} as const

function DatePickerRtl() {
  const { dir, t, language } = useTranslation(datePickerTranslations, "ar")
  const [date, setDate] = React.useState<Date>()

  const dateFnsLocale =
    dir === "rtl"
      ? dateFnsLocales[language as keyof typeof dateFnsLocales]
      : undefined
  const dayPickerLocale =
    dir === "rtl"
      ? dayPickerLocales[language as keyof typeof dayPickerLocales]
      : undefined

  return (
    <Example title="Date Picker">
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant={"outline"}
              data-empty={!date}
              className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
              dir={dir}
            />
          }
        >
          {date ? (
            format(date, "PPP", { locale: dateFnsLocale })
          ) : (
            <span>{t.placeholder}</span>
          )}
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            data-icon="inline-end"
            strokeWidth={2}
          />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start" dir={dir}>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            defaultMonth={date}
            dir={dir}
            locale={dayPickerLocale}
          />
        </PopoverContent>
      </Popover>
    </Example>
  )
}

const dialogTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      openDialog: "Open Dialog",
      editProfile: "Edit profile",
      description:
        "Make changes to your profile here. Click save when you're done.",
      name: "Name",
      username: "Username",
      cancel: "Cancel",
      saveChanges: "Save changes",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      openDialog: "فتح الحوار",
      editProfile: "تعديل الملف الشخصي",
      description:
        "قم بإجراء تغييرات على ملفك الشخصي هنا. انقر فوق حفظ عند الانتهاء.",
      name: "الاسم",
      username: "اسم المستخدم",
      cancel: "إلغاء",
      saveChanges: "حفظ التغييرات",
    },
  },
  he: {
    dir: "rtl",
    values: {
      openDialog: "פתח דיאלוג",
      editProfile: "ערוך פרופיל",
      description: "בצע שינויים בפרופיל שלך כאן. לחץ על שמור כשתסיים.",
      name: "שם",
      username: "שם משתמש",
      cancel: "בטל",
      saveChanges: "שמור שינויים",
    },
  },
}

function DialogRtl() {
  const { dir, t, language } = useTranslation(dialogTranslations, "ar")

  return (
    <Example title="Dialog">
      <Dialog>
        <form>
          <DialogTrigger render={<Button variant="outline" />}>
            {t.openDialog}
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-sm"
            dir={dir}
            data-lang={dir === "rtl" ? language : undefined}
          >
            <DialogHeader>
              <DialogTitle>{t.editProfile}</DialogTitle>
              <DialogDescription>{t.description}</DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Label htmlFor="name-1">{t.name}</Label>
                <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
              </Field>
              <Field>
                <Label htmlFor="username-1">{t.username}</Label>
                <Input
                  id="username-1"
                  name="username"
                  defaultValue="@peduarte"
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                {t.cancel}
              </DialogClose>
              <Button type="submit">{t.saveChanges}</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </Example>
  )
}

const drawerTranslations = {
  en: {
    dir: "ltr",
    locale: "en-US",
    values: {
      trigger: "Open Drawer",
      title: "Pick a delivery time",
      description: "We'll prepare your order as soon as possible.",
      confirm: "Confirm Delivery Time",
      cancel: "Cancel",
      toastTitle: "Delivery time confirmed",
      asapLabel: "Standard delivery",
      asapDescription: "25–35 min · Driver assigned now",
      asapBadge: "Fastest",
      slot500Label: "5:00 PM – 5:15 PM",
      slot500Description: "Prep starts at 4:45 PM",
      slot530Label: "5:30 PM – 5:45 PM",
      slot530Description: "Good if you're heading home",
      slot600Label: "6:00 PM – 6:15 PM",
      slot600Description: "Most popular · High demand",
      slot630Label: "6:30 PM – 6:45 PM",
      slot630Description: "Last slot before kitchen closes",
    },
  },
  ar: {
    dir: "rtl",
    locale: "ar-EG",
    values: {
      trigger: "فتح الدرج",
      title: "اختر وقت التوصيل",
      description: "سنجهز طلبك في أقرب وقت ممكن.",
      confirm: "تأكيد وقت التوصيل",
      cancel: "إلغاء",
      toastTitle: "تم تأكيد وقت التوصيل",
      asapLabel: "توصيل قياسي",
      asapDescription: "25–35 دقيقة · تم تعيين السائق الآن",
      asapBadge: "الأسرع",
      slot500Label: "5:00 م – 5:15 م",
      slot500Description: "يبدأ التحضير في 4:45 م",
      slot530Label: "5:30 م – 5:45 م",
      slot530Description: "مناسب إذا كنت في الطريق إلى المنزل",
      slot600Label: "6:00 م – 6:15 م",
      slot600Description: "الأكثر شيوعًا · طلب مرتفع",
      slot630Label: "6:30 م – 6:45 م",
      slot630Description: "آخر موعد قبل إغلاق المطبخ",
    },
  },
  he: {
    dir: "rtl",
    locale: "he-IL",
    values: {
      trigger: "פתח מגירה",
      title: "בחר זמן משלוח",
      description: "נכין את ההזמנה שלך בהקדם האפשרי.",
      confirm: "אשר זמן משלוח",
      cancel: "בטל",
      toastTitle: "זמן המשלוח אושר",
      asapLabel: "משלוח רגיל",
      asapDescription: "25–35 דק׳ · נהג הוקצה כעת",
      asapBadge: "הכי מהיר",
      slot500Label: "17:00 – 17:15",
      slot500Description: "ההכנה מתחילה ב-16:45",
      slot530Label: "17:30 – 17:45",
      slot530Description: "מתאים אם אתה בדרך הביתה",
      slot600Label: "18:00 – 18:15",
      slot600Description: "הפופולרי ביותר · ביקוש גבוה",
      slot630Label: "18:30 – 18:45",
      slot630Description: "המשבצת האחרונה לפני סגירת המטבח",
    },
  },
} satisfies Translations

type DrawerTranslationKey = keyof typeof drawerTranslations.en.values

const deliveryTimes: Array<{
  value: string
  id: string
  labelKey: DrawerTranslationKey
  descriptionKey: DrawerTranslationKey
  badgeKey?: DrawerTranslationKey
}> = [
  {
    value: "asap",
    id: "delivery-asap-rtl",
    labelKey: "asapLabel",
    descriptionKey: "asapDescription",
    badgeKey: "asapBadge",
  },
  {
    value: "5-00",
    id: "delivery-5-00-rtl",
    labelKey: "slot500Label",
    descriptionKey: "slot500Description",
  },
  {
    value: "5-30",
    id: "delivery-5-30-rtl",
    labelKey: "slot530Label",
    descriptionKey: "slot530Description",
  },
  {
    value: "6-00",
    id: "delivery-6-00-rtl",
    labelKey: "slot600Label",
    descriptionKey: "slot600Description",
  },
  {
    value: "6-30",
    id: "delivery-6-30-rtl",
    labelKey: "slot630Label",
    descriptionKey: "slot630Description",
  },
]

function DrawerRtl() {
  const { dir, language, t } = useTranslation(drawerTranslations, "ar")
  const [open, setOpen] = React.useState(false)
  const [deliveryTime, setDeliveryTime] = React.useState("asap")
  const isMobile = useIsMobile()

  function handleConfirm() {
    const selected = deliveryTimes.find((time) => time.value === deliveryTime)

    if (!selected) {
      return
    }

    setOpen(false)
    toast.add({
      title: t.toastTitle,
      description: t[selected.labelKey],
    })
  }

  return (
    <Example title="Drawer">
      <Drawer
        open={open}
        onOpenChange={setOpen}
        showSwipeHandle={isMobile}
        swipeDirection={isMobile ? "down" : "right"}
      >
        <DrawerTrigger render={<Button variant="secondary" />}>
          {t.trigger}
        </DrawerTrigger>
        <DrawerContent
          dir={dir}
          data-lang={dir === "rtl" ? language : undefined}
        >
          <DrawerHeader>
            <DrawerTitle>{t.title}</DrawerTitle>
            <DrawerDescription>{t.description}</DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 scroll-fade overflow-y-auto p-4">
            <RadioGroup
              value={deliveryTime}
              onValueChange={setDeliveryTime}
              className="gap-2"
              dir={dir}
            >
              {deliveryTimes.map((time) => (
                <FieldLabel key={time.value} htmlFor={time.id} dir={dir}>
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle className="flex items-center gap-2">
                        {t[time.labelKey]}
                        {time.badgeKey ? (
                          <Badge variant="secondary">{t[time.badgeKey]}</Badge>
                        ) : null}
                      </FieldTitle>
                      <FieldDescription dir={dir}>
                        {t[time.descriptionKey]}
                      </FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value={time.value} id={time.id} dir={dir} />
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
          </div>
          <DrawerFooter>
            <Button onClick={handleConfirm} className="h-[34px]">
              {t.confirm}
            </Button>
            <DrawerClose render={<Button variant="outline" />}>
              {t.cancel}
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Example>
  )
}

const dropdownMenuTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      open: "Open",
      account: "Account",
      profile: "Profile",
      billing: "Billing",
      settings: "Settings",
      logout: "Log out",
      team: "Team",
      inviteUsers: "Invite users",
      email: "Email",
      message: "Message",
      more: "More",
      calendar: "Calendar",
      chat: "Chat",
      webhook: "Webhook",
      advanced: "Advanced...",
      newTeam: "New Team",
      view: "View",
      statusBar: "Status Bar",
      activityBar: "Activity Bar",
      panel: "Panel",
      position: "Position",
      top: "Top",
      bottom: "Bottom",
      right: "Right",
      left: "Left",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      open: "افتح القائمة",
      account: "الحساب",
      profile: "الملف الشخصي",
      billing: "الفوترة",
      settings: "الإعدادات",
      logout: "تسجيل الخروج",
      team: "الفريق",
      inviteUsers: "دعوة المستخدمين",
      email: "البريد الإلكتروني",
      message: "رسالة",
      more: "المزيد",
      calendar: "تقويم",
      chat: "دردشة",
      webhook: "خطاف ويب",
      advanced: "متقدم...",
      newTeam: "فريق جديد",
      view: "عرض",
      statusBar: "شريط الحالة",
      activityBar: "شريط النشاط",
      panel: "اللوحة",
      position: "الموضع",
      top: "أعلى",
      bottom: "أسفل",
      right: "يمين",
      left: "يسار",
    },
  },
  he: {
    dir: "rtl",
    values: {
      open: "פתח תפריט",
      account: "חשבון",
      profile: "פרופיל",
      billing: "חיוב",
      settings: "הגדרות",
      logout: "התנתק",
      team: "הצוות",
      inviteUsers: "הזמן משתמשים",
      email: "אימייל",
      message: "הודעה",
      more: "עוד",
      calendar: "יומן",
      chat: "צ'אט",
      webhook: "Webhook",
      advanced: "מתקדם...",
      newTeam: "צוות חדש",
      view: "תצוגה",
      statusBar: "שורת סטטוס",
      activityBar: "שורת פעילות",
      panel: "לוח",
      position: "מיקום",
      top: "למעלה",
      bottom: "למטה",
      right: "ימין",
      left: "שמאל",
    },
  },
}

function DropdownMenuRtl() {
  const { dir, language, t } = useTranslation(dropdownMenuTranslations, "ar")
  const [showStatusBar, setShowStatusBar] = React.useState(true)
  const [showActivityBar, setShowActivityBar] = React.useState(false)
  const [showPanel, setShowPanel] = React.useState(false)
  const [position, setPosition] = React.useState("bottom")

  return (
    <Example title="Dropdown Menu">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          {t.open}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={dir === "rtl" ? "end" : "start"}
          dir={dir}
          className="w-36"
          data-lang={dir === "rtl" ? language : undefined}
        >
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>{t.account}</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent
                  dir={dir}
                  data-lang={dir === "rtl" ? language : undefined}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <HugeiconsIcon icon={User03Icon} strokeWidth={2} />
                      {t.profile}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <HugeiconsIcon icon={CreditCardIcon} strokeWidth={2} />
                      {t.billing}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <HugeiconsIcon icon={Settings02Icon} strokeWidth={2} />
                      {t.settings}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>{t.team}</DropdownMenuLabel>
            <DropdownMenuItem>{t.team}</DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>{t.inviteUsers}</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent
                  dir={dir}
                  data-lang={dir === "rtl" ? language : undefined}
                >
                  <DropdownMenuItem>{t.email}</DropdownMenuItem>
                  <DropdownMenuItem>{t.message}</DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>{t.more}</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent
                        dir={dir}
                        data-lang={dir === "rtl" ? language : undefined}
                      >
                        <DropdownMenuItem>{t.calendar}</DropdownMenuItem>
                        <DropdownMenuItem>{t.chat}</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>{t.webhook}</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>{t.advanced}</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem>
              {t.newTeam}
              <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>{t.view}</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={showStatusBar}
              onCheckedChange={setShowStatusBar}
            >
              {t.statusBar}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showActivityBar}
              onCheckedChange={setShowActivityBar}
            >
              {t.activityBar}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showPanel}
              onCheckedChange={setShowPanel}
            >
              {t.panel}
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>{t.position}</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={position}
              onValueChange={setPosition}
            >
              <DropdownMenuRadioItem value="top">{t.top}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bottom">
                {t.bottom}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="right">
                {t.right}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="left">
                {t.left}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive">
              {t.logout}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </Example>
  )
}

const emptyTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      title: "No Projects Yet",
      description:
        "You haven't created any projects yet. Get started by creating your first project.",
      createProject: "Create Project",
      importProject: "Import Project",
      learnMore: "Learn More",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      title: "لا توجد مشاريع بعد",
      description: "لم تقم بإنشاء أي مشاريع بعد. ابدأ بإنشاء مشروعك الأول.",
      createProject: "إنشاء مشروع",
      importProject: "استيراد مشروع",
      learnMore: "تعرف على المزيد",
    },
  },
  he: {
    dir: "rtl",
    values: {
      title: "אין פרויקטים עדיין",
      description:
        "עדיין לא יצרת פרויקטים. התחל על ידי יצירת הפרויקט הראשון שלך.",
      createProject: "צור פרויקט",
      importProject: "ייבא פרויקט",
      learnMore: "למד עוד",
    },
  },
}

function EmptyRtl() {
  const { dir, t } = useTranslation(emptyTranslations, "ar")

  return (
    <Example title="Empty">
      <Empty dir={dir}>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HugeiconsIcon icon={FolderCodeIcon} strokeWidth={2} />
          </EmptyMedia>
          <EmptyTitle>{t.title}</EmptyTitle>
          <EmptyDescription>{t.description}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row justify-center gap-2">
          <Button>{t.createProject}</Button>
          <Button variant="outline">{t.importProject}</Button>
        </EmptyContent>
        <Button
          variant="link"
          render={<a href="#" />}
          className="text-muted-foreground"
          size="sm"
          nativeButton={false}
        >
          {t.learnMore}{" "}
          <HugeiconsIcon
            icon={ArrowUpRight01Icon}
            className="rtl:rotate-270"
            data-icon="inline-end"
            strokeWidth={2}
          />
        </Button>
      </Empty>
    </Example>
  )
}

const fieldMonths = [
  { label: "MM", value: null },
  { label: "01", value: "01" },
  { label: "02", value: "02" },
  { label: "03", value: "03" },
  { label: "04", value: "04" },
  { label: "05", value: "05" },
  { label: "06", value: "06" },
  { label: "07", value: "07" },
  { label: "08", value: "08" },
  { label: "09", value: "09" },
  { label: "10", value: "10" },
  { label: "11", value: "11" },
  { label: "12", value: "12" },
]

const fieldYears = [
  { label: "YYYY", value: null },
  { label: "2024", value: "2024" },
  { label: "2025", value: "2025" },
  { label: "2026", value: "2026" },
  { label: "2027", value: "2027" },
  { label: "2028", value: "2028" },
  { label: "2029", value: "2029" },
]

const fieldTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      paymentMethod: "Payment Method",
      secureTransactions: "All transactions are secure and encrypted",
      nameOnCard: "Name on Card",
      cardNumber: "Card Number",
      cardNumberDescription: "Enter your 16-digit card number",
      month: "Month",
      year: "Year",
      cvv: "CVV",
      monthPlaceholder: "MM",
      month01: "01",
      month02: "02",
      month03: "03",
      month04: "04",
      month05: "05",
      month06: "06",
      month07: "07",
      month08: "08",
      month09: "09",
      month10: "10",
      month11: "11",
      month12: "12",
      billingAddress: "Billing Address",
      billingAddressDescription:
        "The billing address associated with your payment method",
      sameAsShipping: "Same as shipping address",
      comments: "Comments",
      commentsPlaceholder: "Add any additional comments",
      submit: "Submit",
      cancel: "Cancel",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      paymentMethod: "طريقة الدفع",
      secureTransactions: "جميع المعاملات آمنة ومشفرة",
      nameOnCard: "الاسم على البطاقة",
      cardNumber: "رقم البطاقة",
      cardNumberDescription: "أدخل رقم البطاقة المكون من 16 رقمًا",
      month: "الشهر",
      year: "السنة",
      cvv: "CVV",
      monthPlaceholder: "ش.ش",
      month01: "٠١",
      month02: "٠٢",
      month03: "٠٣",
      month04: "٠٤",
      month05: "٠٥",
      month06: "٠٦",
      month07: "٠٧",
      month08: "٠٨",
      month09: "٠٩",
      month10: "١٠",
      month11: "١١",
      month12: "١٢",
      billingAddress: "عنوان الفوترة",
      billingAddressDescription: "عنوان الفوترة المرتبط بطريقة الدفع الخاصة بك",
      sameAsShipping: "نفس عنوان الشحن",
      comments: "تعليقات",
      commentsPlaceholder: "أضف أي تعليقات إضافية",
      submit: "إرسال",
      cancel: "إلغاء",
    },
  },
  he: {
    dir: "rtl",
    values: {
      paymentMethod: "אמצעי תשלום",
      secureTransactions: "כל העסקאות מאובטחות ומוצפנות",
      nameOnCard: "שם על הכרטיס",
      cardNumber: "מספר כרטיס",
      cardNumberDescription: "הזן את מספר הכרטיס בן 16 הספרות שלך",
      month: "חודש",
      year: "שנה",
      cvv: "CVV",
      monthPlaceholder: "MM",
      month01: "01",
      month02: "02",
      month03: "03",
      month04: "04",
      month05: "05",
      month06: "06",
      month07: "07",
      month08: "08",
      month09: "09",
      month10: "10",
      month11: "11",
      month12: "12",
      billingAddress: "כתובת חיוב",
      billingAddressDescription: "כתובת החיוב המשויכת לאמצעי התשלום שלך",
      sameAsShipping: "זהה לכתובת המשלוח",
      comments: "הערות",
      commentsPlaceholder: "הוסף הערות נוספות",
      submit: "שלח",
      cancel: "בטל",
    },
  },
}

function FieldRtl() {
  const { dir, t } = useTranslation(fieldTranslations, "ar")

  const getMonthLabel = (value: string | null): string => {
    if (value === null) return t.monthPlaceholder
    const monthKey = `month${value}` as keyof typeof t
    return t[monthKey] || value
  }

  return (
    <Example title="Field">
      <div className="w-full max-w-md py-6" dir={dir}>
        <form>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>{t.paymentMethod}</FieldLegend>
              <FieldDescription>{t.secureTransactions}</FieldDescription>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-card-name-43j-rtl">
                    {t.nameOnCard}
                  </FieldLabel>
                  <Input
                    id="checkout-7j9-card-name-43j-rtl"
                    placeholder="Evil Rabbit"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-card-number-uw1-rtl">
                    {t.cardNumber}
                  </FieldLabel>
                  <Input
                    id="checkout-7j9-card-number-uw1-rtl"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                  <FieldDescription>{t.cardNumberDescription}</FieldDescription>
                </Field>
                <div className="grid grid-cols-3 gap-4">
                  <Field>
                    <FieldLabel htmlFor="checkout-exp-month-ts6-rtl">
                      {t.month}
                    </FieldLabel>
                    <Select items={fieldMonths}>
                      <SelectTrigger id="checkout-exp-month-ts6-rtl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent dir={dir}>
                        <SelectGroup>
                          {fieldMonths.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {getMonthLabel(item.value)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="checkout-7j9-exp-year-f59-rtl">
                      {t.year}
                    </FieldLabel>
                    <Select items={fieldYears}>
                      <SelectTrigger id="checkout-7j9-exp-year-f59-rtl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent dir={dir}>
                        <SelectGroup>
                          {fieldYears.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="checkout-7j9-cvv-rtl">
                      {t.cvv}
                    </FieldLabel>
                    <Input
                      id="checkout-7j9-cvv-rtl"
                      placeholder="123"
                      required
                    />
                  </Field>
                </div>
              </FieldGroup>
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend>{t.billingAddress}</FieldLegend>
              <FieldDescription>{t.billingAddressDescription}</FieldDescription>
              <FieldGroup>
                <Field orientation="horizontal">
                  <Checkbox
                    id="checkout-7j9-same-as-shipping-wgm-rtl"
                    defaultChecked
                  />
                  <FieldLabel
                    htmlFor="checkout-7j9-same-as-shipping-wgm-rtl"
                    className="font-normal"
                  >
                    {t.sameAsShipping}
                  </FieldLabel>
                </Field>
              </FieldGroup>
            </FieldSet>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-optional-comments-rtl">
                    {t.comments}
                  </FieldLabel>
                  <Textarea
                    id="checkout-7j9-optional-comments-rtl"
                    placeholder={t.commentsPlaceholder}
                    className="resize-none"
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
            <Field orientation="horizontal">
              <Button type="submit">{t.submit}</Button>
              <Button variant="outline" type="button">
                {t.cancel}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </Example>
  )
}

const hoverCardTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      trigger: "Wireless Headphones",
      name: "Wireless Headphones",
      price: "$99.99",
      "inline-start": "Inline Start",
      left: "Left",
      top: "Top",
      bottom: "Bottom",
      right: "Right",
      "inline-end": "Inline End",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      trigger: "سماعات لاسلكية",
      name: "سماعات لاسلكية",
      price: "٩٩.٩٩ $",
      "inline-start": "بداية السطر",
      left: "يسار",
      top: "أعلى",
      bottom: "أسفل",
      right: "يمين",
      "inline-end": "نهاية السطر",
    },
  },
  he: {
    dir: "rtl",
    values: {
      trigger: "אוזניות אלחוטיות",
      name: "אוזניות אלחוטיות",
      price: "99.99 $",
      "inline-start": "תחילת השורה",
      left: "שמאל",
      top: "למעלה",
      bottom: "למטה",
      right: "ימין",
      "inline-end": "סוף השורה",
    },
  },
}

const physicalSides = ["left", "top", "bottom", "right"] as const
const logicalSides = ["inline-start", "inline-end"] as const

function HoverCardRtl() {
  const { dir, t } = useTranslation(hoverCardTranslations, "ar")

  return (
    <Example title="Hover Card">
      <div className="grid gap-4">
        <div className="flex flex-wrap justify-center gap-2">
          {physicalSides.map((side) => (
            <HoverCard key={side}>
              <HoverCardTrigger
                delay={10}
                closeDelay={100}
                render={<Button variant="outline" />}
              >
                {t[side]}
              </HoverCardTrigger>
              <HoverCardContent
                side={side}
                className="flex w-64 flex-col gap-1"
                dir={dir}
              >
                <div className="font-semibold">{t.name}</div>
                <div className="text-sm text-muted-foreground">{t.price}</div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {logicalSides.map((side) => (
            <HoverCard key={side}>
              <HoverCardTrigger
                delay={10}
                closeDelay={100}
                render={<Button variant="outline" />}
              >
                {t[side]}
              </HoverCardTrigger>
              <HoverCardContent
                side={side}
                className="flex w-64 flex-col gap-1"
                dir={dir}
              >
                <div className="font-semibold">{t.name}</div>
                <div className="text-sm text-muted-foreground">{t.price}</div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </div>
    </Example>
  )
}

const inputGroupTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      placeholder: "Search...",
      results: "12 results",
      searching: "Searching...",
      saving: "Saving...",
      savingChanges: "Saving changes...",
      textareaLabel: "Textarea",
      textareaPlaceholder: "Write a comment...",
      characterCount: "0/280",
      post: "Post",
      textareaDescription: "Footer positioned below the textarea.",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      placeholder: "بحث...",
      results: "١٢ نتيجة",
      searching: "جاري البحث...",
      saving: "جاري الحفظ...",
      savingChanges: "جاري حفظ التغييرات...",
      textareaLabel: "منطقة النص",
      textareaPlaceholder: "اكتب تعليقًا...",
      characterCount: "٠/٢٨٠",
      post: "نشر",
      textareaDescription: "تذييل موضع أسفل منطقة النص.",
    },
  },
  he: {
    dir: "rtl",
    values: {
      placeholder: "חפש...",
      results: "12 תוצאות",
      searching: "מחפש...",
      saving: "שומר...",
      savingChanges: "שומר שינויים...",
      textareaLabel: "אזור טקסט",
      textareaPlaceholder: "כתוב תגובה...",
      characterCount: "0/280",
      post: "פרסם",
      textareaDescription: "כותרת תחתונה ממוקמת מתחת לאזור הטקסט.",
    },
  },
}

function InputGroupRtl() {
  const { dir, t } = useTranslation(inputGroupTranslations, "ar")

  return (
    <Example title="Input Group">
      <div className="grid w-full max-w-sm gap-6" dir={dir}>
        <InputGroup className="max-w-xs">
          <InputGroupInput placeholder={t.placeholder} />
          <InputGroupAddon>
            <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">{t.results}</InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput placeholder={t.searching} />
          <InputGroupAddon align="inline-end">
            <Spinner />
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput placeholder={t.savingChanges} />
          <InputGroupAddon align="inline-end">
            <InputGroupText>{t.saving}</InputGroupText>
            <Spinner />
          </InputGroupAddon>
        </InputGroup>
        <FieldGroup className="max-w-sm">
          <Field>
            <FieldLabel htmlFor="rtl-textarea">{t.textareaLabel}</FieldLabel>
            <InputGroup>
              <InputGroupTextarea
                id="rtl-textarea"
                placeholder={t.textareaPlaceholder}
              />
              <InputGroupAddon align="block-end">
                <InputGroupText>{t.characterCount}</InputGroupText>
                <InputGroupButton
                  variant="default"
                  size="sm"
                  className="ms-auto"
                >
                  {t.post}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            <FieldDescription>{t.textareaDescription}</FieldDescription>
          </Field>
        </FieldGroup>
      </div>
    </Example>
  )
}

const inputOtpTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      verificationCode: "Verification code",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      verificationCode: "رمز التحقق",
    },
  },
  he: {
    dir: "rtl",
    values: {
      verificationCode: "קוד אימות",
    },
  },
}

function InputOTPRtl() {
  const { dir, t } = useTranslation(inputOtpTranslations, "ar")
  const [value, setValue] = React.useState("123456")

  return (
    <Example title="Input OTP">
      <Field className="mx-auto max-w-xs">
        <FieldLabel htmlFor="input-otp-rtl">{t.verificationCode}</FieldLabel>
        <InputOTP
          maxLength={6}
          value={value}
          onChange={setValue}
          dir={dir}
          id="input-otp-rtl"
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </Field>
    </Example>
  )
}

const inputTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      apiKey: "API Key",
      placeholder: "sk-...",
      description: "Your API key is encrypted and stored securely.",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      apiKey: "مفتاح API",
      placeholder: "sk-...",
      description: "مفتاح API الخاص بك مشفر ومخزن بأمان.",
    },
  },
  he: {
    dir: "rtl",
    values: {
      apiKey: "מפתח API",
      placeholder: "sk-...",
      description: "מפתח ה-API שלך מוצפן ונשמר בצורה מאובטחת.",
    },
  },
}

function InputRtl() {
  const { dir, t } = useTranslation(inputTranslations, "ar")

  return (
    <Example title="Input">
      <Field dir={dir}>
        <FieldLabel htmlFor="input-rtl-api-key">{t.apiKey}</FieldLabel>
        <Input
          id="input-rtl-api-key"
          type="password"
          placeholder={t.placeholder}
          dir={dir}
        />
        <FieldDescription>{t.description}</FieldDescription>
      </Field>
    </Example>
  )
}

const itemTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      basicItem: "Basic Item",
      basicItemDesc: "A simple item with title and description.",
      action: "Action",
      verifiedTitle: "Your profile has been verified.",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      basicItem: "عنصر أساسي",
      basicItemDesc: "عنصر بسيط يحتوي على عنوان ووصف.",
      action: "إجراء",
      verifiedTitle: "تم التحقق من ملفك الشخصي.",
    },
  },
  he: {
    dir: "rtl",
    values: {
      basicItem: "פריט בסיסי",
      basicItemDesc: "פריט פשוט עם כותרת ותיאור.",
      action: "פעולה",
      verifiedTitle: "הפרופיל שלך אומת.",
    },
  },
}

function ItemRtl() {
  const { dir, t } = useTranslation(itemTranslations, "ar")

  return (
    <Example title="Item">
      <div className="flex w-full max-w-md flex-col gap-6" dir={dir}>
        <Item variant="outline" dir={dir}>
          <ItemContent>
            <ItemTitle>{t.basicItem}</ItemTitle>
            <ItemDescription>{t.basicItemDesc}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline" size="sm">
              {t.action}
            </Button>
          </ItemActions>
        </Item>
        <Item variant="outline" size="sm" render={<a href="#" />} dir={dir}>
          <ItemMedia>
            <HugeiconsIcon
              icon={CheckmarkBadge01Icon}
              className="size-5"
              strokeWidth={2}
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{t.verifiedTitle}</ItemTitle>
          </ItemContent>
          <ItemActions>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              className="size-4"
              strokeWidth={2}
            />
          </ItemActions>
        </Item>
      </div>
    </Example>
  )
}

const kbdTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {},
  },
  ar: {
    dir: "rtl",
    values: {},
  },
  he: {
    dir: "rtl",
    values: {},
  },
}

function KbdRtl() {
  const { dir } = useTranslation(kbdTranslations, "ar")

  return (
    <Example title="Kbd">
      <div className="flex flex-col items-center gap-4" dir={dir}>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>⇧</Kbd>
          <Kbd>⌥</Kbd>
          <Kbd>⌃</Kbd>
        </KbdGroup>
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <span>+</span>
          <Kbd>B</Kbd>
        </KbdGroup>
      </div>
    </Example>
  )
}

const labelTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      label: "Accept terms and conditions",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      label: "قبول الشروط والأحكام",
    },
  },
  he: {
    dir: "rtl",
    values: {
      label: "קבל תנאים והגבלות",
    },
  },
}

function LabelRtl() {
  const { dir, t } = useTranslation(labelTranslations, "ar")

  return (
    <Example title="Label">
      <div className="flex gap-2" dir={dir}>
        <Checkbox id="terms-rtl" dir={dir} />
        <Label htmlFor="terms-rtl" dir={dir}>
          {t.label}
        </Label>
      </div>
    </Example>
  )
}

const menubarTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      file: "File",
      newTab: "New Tab",
      newWindow: "New Window",
      newIncognitoWindow: "New Incognito Window",
      share: "Share",
      emailLink: "Email link",
      messages: "Messages",
      notes: "Notes",
      print: "Print...",
      edit: "Edit",
      undo: "Undo",
      redo: "Redo",
      find: "Find",
      searchTheWeb: "Search the web",
      findItem: "Find...",
      findNext: "Find Next",
      findPrevious: "Find Previous",
      cut: "Cut",
      copy: "Copy",
      paste: "Paste",
      view: "View",
      bookmarksBar: "Bookmarks Bar",
      fullUrls: "Full URLs",
      reload: "Reload",
      forceReload: "Force Reload",
      toggleFullscreen: "Toggle Fullscreen",
      hideSidebar: "Hide Sidebar",
      profiles: "Profiles",
      andy: "Andy",
      benoit: "Benoit",
      luis: "Luis",
      editProfile: "Edit...",
      addProfile: "Add Profile...",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      file: "ملف",
      newTab: "علامة تبويب جديدة",
      newWindow: "نافذة جديدة",
      newIncognitoWindow: "نافذة التصفح المتخفي الجديدة",
      share: "مشاركة",
      emailLink: "رابط البريد الإلكتروني",
      messages: "الرسائل",
      notes: "الملاحظات",
      print: "طباعة...",
      edit: "تعديل",
      undo: "تراجع",
      redo: "إعادة",
      find: "بحث",
      searchTheWeb: "البحث على الويب",
      findItem: "بحث...",
      findNext: "البحث التالي",
      findPrevious: "البحث السابق",
      cut: "قص",
      copy: "نسخ",
      paste: "لصق",
      view: "عرض",
      bookmarksBar: "شريط الإشارات المرجعية",
      fullUrls: "عناوين URL الكاملة",
      reload: "إعادة تحميل",
      forceReload: "إعادة تحميل قسري",
      toggleFullscreen: "تبديل وضع ملء الشاشة",
      hideSidebar: "إخفاء الشريط الجانبي",
      profiles: "الملفات الشخصية",
      andy: "Andy",
      benoit: "Benoit",
      luis: "Luis",
      editProfile: "تعديل...",
      addProfile: "إضافة ملف شخصي...",
    },
  },
  he: {
    dir: "rtl",
    values: {
      file: "קובץ",
      newTab: "כרטיסייה חדשה",
      newWindow: "חלון חדש",
      newIncognitoWindow: "חלון גלישה בסתר חדש",
      share: "שתף",
      emailLink: "קישור אימייל",
      messages: "הודעות",
      notes: "הערות",
      print: "הדפס...",
      edit: "ערוך",
      undo: "בטל",
      redo: "בצע שוב",
      find: "מצא",
      searchTheWeb: "חפש באינטרנט",
      findItem: "מצא...",
      findNext: "מצא הבא",
      findPrevious: "מצא הקודם",
      cut: "גזור",
      copy: "העתק",
      paste: "הדבק",
      view: "תצוגה",
      bookmarksBar: "סרגל סימניות",
      fullUrls: "כתובות URL מלאות",
      reload: "רענן",
      forceReload: "רענן בכוח",
      toggleFullscreen: "החלף מסך מלא",
      hideSidebar: "הסתר סרגל צד",
      profiles: "פרופילים",
      andy: "Andy",
      benoit: "Benoit",
      luis: "Luis",
      editProfile: "ערוך...",
      addProfile: "הוסף פרופיל...",
    },
  },
}

function MenubarRtl() {
  const { dir, t, language } = useTranslation(menubarTranslations, "ar")
  const [profile, setProfile] = React.useState("benoit")

  return (
    <Example title="Menubar">
      <Menubar className="w-72" dir={dir}>
        <MenubarMenu>
          <MenubarTrigger>{t.file}</MenubarTrigger>
          <MenubarContent dir={dir} align={dir === "rtl" ? "end" : "start"}>
            <MenubarGroup>
              <MenubarItem>
                {t.newTab} <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                {t.newWindow} <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem disabled>{t.newIncognitoWindow}</MenubarItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarSub>
                <MenubarSubTrigger>{t.share}</MenubarSubTrigger>
                <MenubarSubContent
                  dir={dir}
                  data-lang={dir === "rtl" ? language : undefined}
                >
                  <MenubarGroup>
                    <MenubarItem>{t.emailLink}</MenubarItem>
                    <MenubarItem>{t.messages}</MenubarItem>
                    <MenubarItem>{t.notes}</MenubarItem>
                  </MenubarGroup>
                </MenubarSubContent>
              </MenubarSub>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem>
                {t.print} <MenubarShortcut>⌘P</MenubarShortcut>
              </MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>{t.edit}</MenubarTrigger>
          <MenubarContent
            dir={dir}
            align={dir === "rtl" ? "end" : "start"}
            data-lang={dir === "rtl" ? language : undefined}
          >
            <MenubarGroup>
              <MenubarItem>
                {t.undo} <MenubarShortcut>⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                {t.redo} <MenubarShortcut>⇧⌘Z</MenubarShortcut>
              </MenubarItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarSub>
                <MenubarSubTrigger>{t.find}</MenubarSubTrigger>
                <MenubarSubContent
                  dir={dir}
                  data-lang={dir === "rtl" ? language : undefined}
                >
                  <MenubarGroup>
                    <MenubarItem>{t.searchTheWeb}</MenubarItem>
                  </MenubarGroup>
                  <MenubarSeparator />
                  <MenubarGroup>
                    <MenubarItem>{t.findItem}</MenubarItem>
                    <MenubarItem>{t.findNext}</MenubarItem>
                    <MenubarItem>{t.findPrevious}</MenubarItem>
                  </MenubarGroup>
                </MenubarSubContent>
              </MenubarSub>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem>{t.cut}</MenubarItem>
              <MenubarItem>{t.copy}</MenubarItem>
              <MenubarItem>{t.paste}</MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>{t.view}</MenubarTrigger>
          <MenubarContent
            className="w-44"
            dir={dir}
            align={dir === "rtl" ? "end" : "start"}
            data-lang={dir === "rtl" ? language : undefined}
          >
            <MenubarGroup>
              <MenubarCheckboxItem>{t.bookmarksBar}</MenubarCheckboxItem>
              <MenubarCheckboxItem checked>{t.fullUrls}</MenubarCheckboxItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem inset>
                {t.reload} <MenubarShortcut>⌘R</MenubarShortcut>
              </MenubarItem>
              <MenubarItem disabled inset>
                {t.forceReload} <MenubarShortcut>⇧⌘R</MenubarShortcut>
              </MenubarItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem inset>{t.toggleFullscreen}</MenubarItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem inset>{t.hideSidebar}</MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>{t.profiles}</MenubarTrigger>
          <MenubarContent
            dir={dir}
            align={dir === "rtl" ? "end" : "start"}
            data-lang={dir === "rtl" ? language : undefined}
          >
            <MenubarRadioGroup value={profile} onValueChange={setProfile}>
              <MenubarRadioItem value="andy">{t.andy}</MenubarRadioItem>
              <MenubarRadioItem value="benoit">{t.benoit}</MenubarRadioItem>
              <MenubarRadioItem value="Luis">{t.luis}</MenubarRadioItem>
            </MenubarRadioGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem inset>{t.editProfile}</MenubarItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem inset>{t.addProfile}</MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </Example>
  )
}

const nativeSelectTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      placeholder: "Select status",
      todo: "Todo",
      inProgress: "In Progress",
      done: "Done",
      cancelled: "Cancelled",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      placeholder: "اختر الحالة",
      todo: "مهام",
      inProgress: "قيد التنفيذ",
      done: "منجز",
      cancelled: "ملغي",
    },
  },
  he: {
    dir: "rtl",
    values: {
      placeholder: "בחר סטטוס",
      todo: "לעשות",
      inProgress: "בתהליך",
      done: "הושלם",
      cancelled: "בוטל",
    },
  },
}

function NativeSelectRtl() {
  const { dir, t } = useTranslation(nativeSelectTranslations, "ar")

  return (
    <Example title="Native Select">
      <NativeSelect dir={dir}>
        <NativeSelectOption value="">{t.placeholder}</NativeSelectOption>
        <NativeSelectOption value="todo">{t.todo}</NativeSelectOption>
        <NativeSelectOption value="in-progress">
          {t.inProgress}
        </NativeSelectOption>
        <NativeSelectOption value="done">{t.done}</NativeSelectOption>
        <NativeSelectOption value="cancelled">{t.cancelled}</NativeSelectOption>
      </NativeSelect>
    </Example>
  )
}

const navigationMenuTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      gettingStarted: "Getting started",
      introduction: "Introduction",
      introductionDesc: "Re-usable components built with Tailwind CSS.",
      installation: "Installation",
      installationDesc: "How to install dependencies and structure your app.",
      typography: "Typography",
      typographyDesc: "Styles for headings, paragraphs, lists...etc",
      components: "Components",
      alertDialog: "Alert Dialog",
      alertDialogDesc:
        "A modal dialog that interrupts the user with important content and expects a response.",
      hoverCard: "Hover Card",
      hoverCardDesc:
        "For sighted users to preview content available behind a link.",
      progress: "Progress",
      progressDesc:
        "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
      scrollArea: "Scroll-area",
      scrollAreaDesc: "Visually or semantically separates content.",
      tabs: "Tabs",
      tabsDesc:
        "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
      tooltip: "Tooltip",
      tooltipDesc:
        "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
      withIcon: "With Icon",
      backlog: "Backlog",
      toDo: "To Do",
      done: "Done",
      docs: "Docs",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      gettingStarted: "البدء",
      introduction: "مقدمة",
      introductionDesc:
        "مكونات قابلة لإعادة الاستخدام مبنية باستخدام Tailwind CSS.",
      installation: "التثبيت",
      installationDesc: "كيفية تثبيت التبعيات وتنظيم تطبيقك.",
      typography: "الطباعة",
      typographyDesc: "أنماط للعناوين والفقرات والقوائم...إلخ",
      components: "المكونات",
      alertDialog: "حوار التنبيه",
      alertDialogDesc: "حوار نافذة يقطع المستخدم بمحتوى مهم ويتوقع استجابة.",
      hoverCard: "بطاقة التحويم",
      hoverCardDesc: "للمستخدمين المبصرين لمعاينة المحتوى المتاح خلف الرابط.",
      progress: "التقدم",
      progressDesc:
        "يعرض مؤشرًا يوضح تقدم إتمام المهمة، عادةً يتم عرضه كشريط تقدم.",
      scrollArea: "منطقة التمرير",
      scrollAreaDesc: "يفصل المحتوى بصريًا أو دلاليًا.",
      tabs: "التبويبات",
      tabsDesc:
        "مجموعة من أقسام المحتوى المتعددة الطبقات—المعروفة بألواح التبويب—التي يتم عرضها واحدة في كل مرة.",
      tooltip: "تلميح",
      tooltipDesc:
        "نافذة منبثقة تعرض معلومات متعلقة بعنصر عندما يتلقى العنصر التركيز على لوحة المفاتيح أو عند تحويم الماوس فوقه.",
      withIcon: "مع أيقونة",
      backlog: "قائمة الانتظار",
      toDo: "المهام",
      done: "منجز",
      docs: "الوثائق",
    },
  },
  he: {
    dir: "rtl",
    values: {
      gettingStarted: "התחלה",
      introduction: "הקדמה",
      introductionDesc: "רכיבים לשימוש חוזר שנבנו עם Tailwind CSS.",
      installation: "התקנה",
      installationDesc: "כיצד להתקין תלויות ולבנות את האפליקציה שלך.",
      typography: "טיפוגרפיה",
      typographyDesc: "סגנונות לכותרות, פסקאות, רשימות...וכו'",
      components: "רכיבים",
      alertDialog: "דיאלוג התראה",
      alertDialogDesc: "דיאלוג מודאלי שמפריע למשתמש עם תוכן חשוב ומצפה לתגובה.",
      hoverCard: "כרטיס ריחוף",
      hoverCardDesc:
        "למשתמשים רואים כדי להציג תצוגה מקדימה של תוכן זמין מאחורי קישור.",
      progress: "התקדמות",
      progressDesc:
        "מציג אינדיקטור המציג את התקדמות ההשלמה של משימה, בדרך כלל מוצג כסרגל התקדמות.",
      scrollArea: "אזור גלילה",
      scrollAreaDesc: "מפריד תוכן חזותית או סמנטית.",
      tabs: "כרטיסיות",
      tabsDesc:
        "קבוצה של חלקי תוכן מרובדים—המכונים לוחות כרטיסיות—המוצגים אחד בכל פעם.",
      tooltip: "טולטיפ",
      tooltipDesc:
        "חלון קופץ המציג מידע הקשור לאלמנט כאשר האלמנט מקבל מיקוד מקלדת או כאשר העכבר מרחף מעליו.",
      withIcon: "עם אייקון",
      backlog: "רשימת המתנה",
      toDo: "לעשות",
      done: "הושלם",
      docs: "תיעוד",
    },
  },
}

const navigationMenuComponents = [
  {
    titleKey: "alertDialog" as const,
    descriptionKey: "alertDialogDesc" as const,
    href: "/docs/primitives/alert-dialog",
  },
  {
    titleKey: "hoverCard" as const,
    descriptionKey: "hoverCardDesc" as const,
    href: "/docs/primitives/hover-card",
  },
  {
    titleKey: "progress" as const,
    descriptionKey: "progressDesc" as const,
    href: "/docs/primitives/progress",
  },
  {
    titleKey: "scrollArea" as const,
    descriptionKey: "scrollAreaDesc" as const,
    href: "/docs/primitives/scroll-area",
  },
  {
    titleKey: "tabs" as const,
    descriptionKey: "tabsDesc" as const,
    href: "/docs/primitives/tabs",
  },
  {
    titleKey: "tooltip" as const,
    descriptionKey: "tooltipDesc" as const,
    href: "/docs/primitives/tooltip",
  },
] as const

function NavigationMenuListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink render={<Link href={href} />}>
        <div className="flex flex-col gap-1 text-sm">
          <div className="leading-none font-medium">{title}</div>
          <div className="line-clamp-2 text-muted-foreground">{children}</div>
        </div>
      </NavigationMenuLink>
    </li>
  )
}

function NavigationMenuRtl() {
  const { dir, t, language } = useTranslation(navigationMenuTranslations, "ar")

  return (
    <Example title="Navigation Menu">
      <NavigationMenu dir={dir} align={dir === "rtl" ? "end" : "start"}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>{t.gettingStarted}</NavigationMenuTrigger>
            <NavigationMenuContent
              dir={dir}
              data-lang={dir === "rtl" ? language : undefined}
            >
              <ul className="w-96">
                <NavigationMenuListItem href="/docs" title={t.introduction}>
                  {t.introductionDesc}
                </NavigationMenuListItem>
                <NavigationMenuListItem
                  href="/docs/installation"
                  title={t.installation}
                >
                  {t.installationDesc}
                </NavigationMenuListItem>
                <NavigationMenuListItem
                  href="/docs/primitives/typography"
                  title={t.typography}
                >
                  {t.typographyDesc}
                </NavigationMenuListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem className="hidden md:flex">
            <NavigationMenuTrigger>{t.components}</NavigationMenuTrigger>
            <NavigationMenuContent
              dir={dir}
              data-lang={dir === "rtl" ? language : undefined}
            >
              <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {navigationMenuComponents.map((component) => (
                  <NavigationMenuListItem
                    key={component.titleKey}
                    title={t[component.titleKey]}
                    href={component.href}
                  >
                    {t[component.descriptionKey]}
                  </NavigationMenuListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>{t.withIcon}</NavigationMenuTrigger>
            <NavigationMenuContent
              dir={dir}
              data-lang={dir === "rtl" ? language : undefined}
            >
              <ul className="grid w-[200px]">
                <li>
                  <NavigationMenuLink
                    render={
                      <Link href="#" className="flex-row items-center gap-2" />
                    }
                  >
                    <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} />
                    {t.backlog}
                  </NavigationMenuLink>
                  <NavigationMenuLink
                    render={
                      <Link href="#" className="flex-row items-center gap-2" />
                    }
                  >
                    <HugeiconsIcon icon={CircleDashedIcon} strokeWidth={2} />
                    {t.toDo}
                  </NavigationMenuLink>
                  <NavigationMenuLink
                    render={
                      <Link href="#" className="flex-row items-center gap-2" />
                    }
                  >
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      strokeWidth={2}
                    />
                    {t.done}
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              render={<Link href="/docs" />}
              className={navigationMenuTriggerStyle()}
              data-lang={dir === "rtl" ? language : undefined}
            >
              {t.docs}
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </Example>
  )
}

const paginationTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      previous: "Previous",
      next: "Next",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      previous: "السابق",
      next: "التالي",
    },
  },
  he: {
    dir: "rtl",
    values: {
      previous: "הקודם",
      next: "הבא",
    },
  },
}

function PaginationRtl() {
  const { dir, t, language } = useTranslation(paginationTranslations, "ar")

  const formatNumber = (num: number): string => {
    if (language === "ar") {
      return toArabicNumerals(num)
    }
    return num.toString()
  }

  return (
    <Example title="Pagination">
      <Pagination dir={dir}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" text={t.previous} />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">{formatNumber(1)}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              {formatNumber(2)}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">{formatNumber(3)}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" text={t.next} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </Example>
  )
}

const popoverTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      title: "Dimensions",
      description: "Set the dimensions for the layer.",
      "inline-start": "Inline Start",
      left: "Left",
      top: "Top",
      bottom: "Bottom",
      right: "Right",
      "inline-end": "Inline End",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      title: "الأبعاد",
      description: "تعيين الأبعاد للطبقة.",
      "inline-start": "بداية السطر",
      left: "يسار",
      top: "أعلى",
      bottom: "أسفل",
      right: "يمين",
      "inline-end": "نهاية السطر",
    },
  },
  he: {
    dir: "rtl",
    values: {
      title: "מימדים",
      description: "הגדר את המימדים לשכבה.",
      "inline-start": "תחילת השורה",
      left: "שמאל",
      top: "למעלה",
      bottom: "למטה",
      right: "ימין",
      "inline-end": "סוף השורה",
    },
  },
}

function PopoverRtl() {
  const { dir, t } = useTranslation(popoverTranslations, "ar")

  return (
    <Example title="Popover">
      <div className="grid gap-4">
        <div className="flex flex-wrap justify-center gap-2">
          {physicalSides.map((side) => (
            <Popover key={side}>
              <PopoverTrigger render={<Button variant="outline" />}>
                {t[side]}
              </PopoverTrigger>
              <PopoverContent side={side} dir={dir}>
                <PopoverHeader>
                  <PopoverTitle>{t.title}</PopoverTitle>
                  <PopoverDescription>{t.description}</PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </Popover>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {logicalSides.map((side) => (
            <Popover key={side}>
              <PopoverTrigger render={<Button variant="outline" />}>
                {t[side]}
              </PopoverTrigger>
              <PopoverContent side={side} dir={dir}>
                <PopoverHeader>
                  <PopoverTitle>{t.title}</PopoverTitle>
                  <PopoverDescription>{t.description}</PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </Popover>
          ))}
        </div>
      </div>
    </Example>
  )
}

const progressTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      label: "Upload progress",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      label: "تقدم الرفع",
    },
  },
  he: {
    dir: "rtl",
    values: {
      label: "התקדמות העלאה",
    },
  },
}

function ProgressRtl() {
  const { dir, t, language } = useTranslation(progressTranslations, "ar")

  const formatNumber = (num: number): string => {
    if (language === "ar") {
      return toArabicNumerals(num)
    }
    return num.toString()
  }

  return (
    <Example title="Progress">
      <Progress value={56} className="w-full max-w-sm" dir={dir}>
        <ProgressLabel>{t.label}</ProgressLabel>
        <ProgressValue>
          {(value) => (
            <span className="ms-auto">
              {formatNumber(parseFloat(value ?? "0"))}%
            </span>
          )}
        </ProgressValue>
      </Progress>
    </Example>
  )
}

const radioGroupTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      default: "Default",
      defaultDescription: "Standard spacing for most use cases.",
      comfortable: "Comfortable",
      comfortableDescription: "More space between elements.",
      compact: "Compact",
      compactDescription: "Minimal spacing for dense layouts.",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      default: "افتراضي",
      defaultDescription: "تباعد قياسي لمعظم حالات الاستخدام.",
      comfortable: "مريح",
      comfortableDescription: "مساحة أكبر بين العناصر.",
      compact: "مضغوط",
      compactDescription: "تباعد أدنى للتخطيطات الكثيفة.",
    },
  },
  he: {
    dir: "rtl",
    values: {
      default: "ברירת מחדל",
      defaultDescription: "ריווח סטנדרטי לרוב מקרי השימוש.",
      comfortable: "נוח",
      comfortableDescription: "יותר מקום בין האלמנטים.",
      compact: "קומפקטי",
      compactDescription: "ריווח מינימלי לפריסות צפופות.",
    },
  },
}

function RadioGroupRtl() {
  const { dir, t } = useTranslation(radioGroupTranslations, "ar")

  return (
    <Example title="Radio Group">
      <RadioGroup defaultValue="comfortable" className="w-fit" dir={dir}>
        <Field orientation="horizontal">
          <RadioGroupItem value="default" id="r1-rtl" dir={dir} />
          <FieldContent>
            <FieldLabel htmlFor="r1-rtl" dir={dir}>
              {t.default}
            </FieldLabel>
            <FieldDescription dir={dir}>
              {t.defaultDescription}
            </FieldDescription>
          </FieldContent>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="comfortable" id="r2-rtl" dir={dir} />
          <FieldContent>
            <FieldLabel htmlFor="r2-rtl" dir={dir}>
              {t.comfortable}
            </FieldLabel>
            <FieldDescription dir={dir}>
              {t.comfortableDescription}
            </FieldDescription>
          </FieldContent>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="compact" id="r3-rtl" dir={dir} />
          <FieldContent>
            <FieldLabel htmlFor="r3-rtl" dir={dir}>
              {t.compact}
            </FieldLabel>
            <FieldDescription dir={dir}>
              {t.compactDescription}
            </FieldDescription>
          </FieldContent>
        </Field>
      </RadioGroup>
    </Example>
  )
}

const resizableTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      one: "One",
      two: "Two",
      three: "Three",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      one: "واحد",
      two: "اثنان",
      three: "ثلاثة",
    },
  },
  he: {
    dir: "rtl",
    values: {
      one: "אחד",
      two: "שניים",
      three: "שלושה",
    },
  },
}

function ResizableRtl() {
  const { dir, t } = useTranslation(resizableTranslations, "ar")

  return (
    <Example title="Resizable">
      <ResizablePanelGroup
        orientation="horizontal"
        className="max-w-sm rounded-lg border"
        dir={dir}
      >
        <ResizablePanel defaultSize="50%">
          <div className="flex h-[200px] items-center justify-center p-6">
            <span className="font-semibold">{t.one}</span>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="50%">
          <ResizablePanelGroup orientation="vertical" dir={dir}>
            <ResizablePanel defaultSize="25%">
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">{t.two}</span>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="75%">
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">{t.three}</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Example>
  )
}

const scrollAreaTags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
)

const scrollAreaTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      tags: "Tags",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      tags: "العلامات",
    },
  },
  he: {
    dir: "rtl",
    values: {
      tags: "תגיות",
    },
  },
}

function ScrollAreaRtl() {
  const { dir, t } = useTranslation(scrollAreaTranslations, "ar")

  return (
    <Example title="Scroll Area">
      <ScrollArea className="h-72 w-48 rounded-md border" dir={dir}>
        <div className="p-4">
          <h4 className="mb-4 text-sm leading-none font-medium">{t.tags}</h4>
          {scrollAreaTags.map((tag) => (
            <React.Fragment key={tag}>
              <div className="text-sm">{tag}</div>
              <Separator className="my-2" />
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
    </Example>
  )
}

const scrollFadeTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      design: "Design",
      engineering: "Engineering",
      marketing: "Marketing",
      product: "Product",
      research: "Research",
      sales: "Sales",
      support: "Support",
      operations: "Operations",
      finance: "Finance",
      legal: "Legal",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      design: "تصميم",
      engineering: "هندسة",
      marketing: "تسويق",
      product: "منتج",
      research: "أبحاث",
      sales: "مبيعات",
      support: "دعم",
      operations: "عمليات",
      finance: "مالية",
      legal: "قانوني",
    },
  },
  he: {
    dir: "rtl",
    values: {
      design: "עיצוב",
      engineering: "הנדסה",
      marketing: "שיווק",
      product: "מוצר",
      research: "מחקר",
      sales: "מכירות",
      support: "תמיכה",
      operations: "תפעול",
      finance: "כספים",
      legal: "משפטי",
    },
  },
}

function ScrollFadeRtl() {
  const { dir, t } = useTranslation(scrollFadeTranslations, "ar")

  return (
    <Example title="Scroll Fade">
      <div
        className="mx-auto w-full max-w-xs overflow-hidden rounded-2xl border"
        dir={dir}
      >
        <div className="scroll-fade-x scrollbar-none overflow-x-auto">
          <div className="flex w-max gap-1.5 p-1.5">
            {Object.values(t).map((tag) => (
              <div
                key={tag}
                className="shrink-0 rounded-lg bg-muted px-3 py-2.5 text-sm"
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Example>
  )
}

const selectTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      selectFruit: "Select a fruit",
      fruits: "Fruits",
      apple: "Apple",
      banana: "Banana",
      blueberry: "Blueberry",
      grapes: "Grapes",
      pineapple: "Pineapple",
      vegetables: "Vegetables",
      carrot: "Carrot",
      broccoli: "Broccoli",
      spinach: "Spinach",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      selectFruit: "اختر فاكهة",
      fruits: "الفواكه",
      apple: "تفاح",
      banana: "موز",
      blueberry: "توت أزرق",
      grapes: "عنب",
      pineapple: "أناناس",
      vegetables: "الخضروات",
      carrot: "جزر",
      broccoli: "بروكلي",
      spinach: "سبانخ",
    },
  },
  he: {
    dir: "rtl",
    values: {
      selectFruit: "בחר פרי",
      fruits: "פירות",
      apple: "תפוח",
      banana: "בננה",
      blueberry: "אוכמניה",
      grapes: "ענבים",
      pineapple: "אננס",
      vegetables: "ירקות",
      carrot: "גזר",
      broccoli: "ברוקולי",
      spinach: "תרד",
    },
  },
}

function SelectRtl() {
  const { dir, t, language } = useTranslation(selectTranslations, "ar")
  const [selectedFruit, setSelectedFruit] = React.useState<string | null>(null)

  const fruits = [
    { label: t.apple, value: "apple" },
    { label: t.banana, value: "banana" },
    { label: t.blueberry, value: "blueberry" },
    { label: t.grapes, value: "grapes" },
    { label: t.pineapple, value: "pineapple" },
  ]

  const vegetables = [
    { label: t.carrot, value: "carrot" },
    { label: t.broccoli, value: "broccoli" },
    { label: t.spinach, value: "spinach" },
  ]

  const allItems = [
    { label: t.selectFruit, value: null },
    ...fruits,
    ...vegetables,
  ]

  return (
    <Example title="Select">
      <Select
        items={allItems}
        value={selectedFruit}
        onValueChange={setSelectedFruit}
      >
        <SelectTrigger className="w-32" dir={dir}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          dir={dir}
          data-lang={dir === "rtl" ? language : undefined}
        >
          <SelectGroup>
            <SelectLabel>{t.fruits}</SelectLabel>
            {fruits.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>{t.vegetables}</SelectLabel>
            {vegetables.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Example>
  )
}

const separatorTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      title: "shadcn/ui",
      subtitle: "The Foundation for your Design System",
      description:
        "A set of beautifully designed components that you can customize, extend, and build on.",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      title: "shadcn/ui",
      subtitle: "الأساس لنظام التصميم الخاص بك",
      description:
        "مجموعة من المكونات المصممة بشكل جميل يمكنك تخصيصها وتوسيعها والبناء عليها.",
    },
  },
  he: {
    dir: "rtl",
    values: {
      title: "shadcn/ui",
      subtitle: "הבסיס למערכת העיצוב שלך",
      description:
        "סט של רכיבים מעוצבים בצורה יפה שאתה יכול להתאים אישית, להרחיב ולבנות עליהם.",
    },
  },
}

function SeparatorRtl() {
  const { dir, t } = useTranslation(separatorTranslations, "ar")

  return (
    <Example title="Separator">
      <div className="flex max-w-sm flex-col gap-4 text-sm" dir={dir}>
        <div className="flex flex-col gap-1.5">
          <div className="leading-none font-medium">{t.title}</div>
          <div className="text-muted-foreground">{t.subtitle}</div>
        </div>
        <Separator />
        <div>{t.description}</div>
      </div>
    </Example>
  )
}

const sheetTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      open: "Open",
      editProfile: "Edit profile",
      description:
        "Make changes to your profile here. Click save when you're done.",
      name: "Name",
      username: "Username",
      save: "Save changes",
      close: "Close",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      open: "فتح",
      editProfile: "تعديل الملف الشخصي",
      description:
        "قم بإجراء تغييرات على ملفك الشخصي هنا. انقر حفظ عند الانتهاء.",
      name: "الاسم",
      username: "اسم المستخدم",
      save: "حفظ التغييرات",
      close: "إغلاق",
    },
  },
  he: {
    dir: "rtl",
    values: {
      open: "פתח",
      editProfile: "עריכת פרופיל",
      description: "בצע שינויים בפרופיל שלך כאן. לחץ שמור כשתסיים.",
      name: "שם",
      username: "שם משתמש",
      save: "שמור שינויים",
      close: "סגור",
    },
  },
}

function SheetRtl() {
  const { dir, t, language } = useTranslation(sheetTranslations, "ar")

  return (
    <Example title="Sheet">
      <Sheet>
        <SheetTrigger render={<Button variant="outline" />}>
          {t.open}
        </SheetTrigger>
        <SheetContent
          dir={dir}
          side={dir === "rtl" ? "left" : "right"}
          data-lang={dir === "rtl" ? language : undefined}
        >
          <SheetHeader>
            <SheetTitle>{t.editProfile}</SheetTitle>
            <SheetDescription>{t.description}</SheetDescription>
          </SheetHeader>
          <FieldGroup className="px-4">
            <Field>
              <FieldLabel htmlFor="sheet-rtl-name">{t.name}</FieldLabel>
              <Input id="sheet-rtl-name" defaultValue="Pedro Duarte" />
            </Field>
            <Field>
              <FieldLabel htmlFor="sheet-rtl-username">{t.username}</FieldLabel>
              <Input id="sheet-rtl-username" defaultValue="peduarte" />
            </Field>
          </FieldGroup>
          <SheetFooter>
            <Button type="submit">{t.save}</Button>
            <SheetClose render={<Button variant="outline" />}>
              {t.close}
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </Example>
  )
}

function ShimmerRtl() {
  return (
    <Example title="Shimmer">
      <div className="mx-auto grid w-full max-w-lg gap-6 text-center text-sm text-muted-foreground sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          <p dir="ltr" className="shimmer">
            Generating response&hellip;
          </p>
          <p className="font-mono text-xs">dir=&quot;ltr&quot;</p>
        </div>
        <div className="flex flex-col gap-3">
          <p dir="rtl" className="shimmer">
            جارٍ إنشاء الرد&hellip;
          </p>
          <p className="font-mono text-xs">dir=&quot;rtl&quot;</p>
        </div>
      </div>
    </Example>
  )
}

const skeletonTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {},
  },
  ar: {
    dir: "rtl",
    values: {},
  },
  he: {
    dir: "rtl",
    values: {},
  },
}

function SkeletonRtl() {
  const { dir } = useTranslation(skeletonTranslations, "ar")

  return (
    <Example title="Skeleton">
      <div className="flex items-center gap-4" dir={dir}>
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    </Example>
  )
}

const sliderTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {},
  },
  ar: {
    dir: "rtl",
    values: {},
  },
  he: {
    dir: "rtl",
    values: {},
  },
}

function SliderRtl() {
  const { dir } = useTranslation(sliderTranslations, "ar")

  return (
    <Example title="Slider">
      <Slider
        defaultValue={[75]}
        max={100}
        step={1}
        className="mx-auto w-full max-w-xs"
        dir={dir}
      />
    </Example>
  )
}

const spinnerTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      title: "Processing payment...",
      amount: "$100.00",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      title: "جاري معالجة الدفع...",
      amount: "١٠٠.٠٠ دولار",
    },
  },
  he: {
    dir: "rtl",
    values: {
      title: "מעבד תשלום...",
      amount: "$100.00",
    },
  },
}

function SpinnerRtl() {
  const { dir, t } = useTranslation(spinnerTranslations, "ar")

  return (
    <Example title="Spinner">
      <div
        className="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]"
        dir={dir}
      >
        <Item variant="muted" dir={dir}>
          <ItemMedia>
            <Spinner />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="line-clamp-1">{t.title}</ItemTitle>
          </ItemContent>
          <ItemContent className="flex-none justify-end">
            <span className="text-sm tabular-nums">{t.amount}</span>
          </ItemContent>
        </Item>
      </div>
    </Example>
  )
}

const switchTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      label: "Share across devices",
      description:
        "Focus is shared across devices, and turns off when you leave the app.",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      label: "المشاركة عبر الأجهزة",
      description:
        "يتم مشاركة التركيز عبر الأجهزة، ويتم إيقاف تشغيله عند مغادرة التطبيق.",
    },
  },
  he: {
    dir: "rtl",
    values: {
      label: "שיתוף בין מכשירים",
      description: "המיקוד משותף בין מכשירים, וכבה כשאתה עוזב את האפליקציה.",
    },
  },
}

function SwitchRtl() {
  const { dir, t } = useTranslation(switchTranslations, "ar")

  return (
    <Example title="Switch">
      <Field orientation="horizontal" className="max-w-sm" dir={dir}>
        <FieldContent>
          <FieldLabel htmlFor="switch-focus-mode-rtl" dir={dir}>
            {t.label}
          </FieldLabel>
          <FieldDescription dir={dir}>{t.description}</FieldDescription>
        </FieldContent>
        <Switch id="switch-focus-mode-rtl" dir={dir} />
      </Field>
    </Example>
  )
}

const tableTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      caption: "A list of your recent invoices.",
      invoice: "Invoice",
      status: "Status",
      method: "Method",
      amount: "Amount",
      paid: "Paid",
      pending: "Pending",
      unpaid: "Unpaid",
      creditCard: "Credit Card",
      paypal: "PayPal",
      bankTransfer: "Bank Transfer",
      total: "Total",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      caption: "قائمة بفواتيرك الأخيرة.",
      invoice: "الفاتورة",
      status: "الحالة",
      method: "الطريقة",
      amount: "المبلغ",
      paid: "مدفوع",
      pending: "قيد الانتظار",
      unpaid: "غير مدفوع",
      creditCard: "بطاقة ائتمانية",
      paypal: "PayPal",
      bankTransfer: "تحويل بنكي",
      total: "المجموع",
    },
  },
  he: {
    dir: "rtl",
    values: {
      caption: "רשימת החשבוניות האחרונות שלך.",
      invoice: "חשבונית",
      status: "סטטוס",
      method: "שיטה",
      amount: "סכום",
      paid: "שולם",
      pending: "ממתין",
      unpaid: "לא שולם",
      creditCard: "כרטיס אשראי",
      paypal: "PayPal",
      bankTransfer: "העברה בנקאית",
      total: 'סה"כ',
    },
  },
}

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "paid" as const,
    totalAmount: "$250.00",
    paymentMethod: "creditCard" as const,
  },
  {
    invoice: "INV002",
    paymentStatus: "pending" as const,
    totalAmount: "$150.00",
    paymentMethod: "paypal" as const,
  },
  {
    invoice: "INV003",
    paymentStatus: "unpaid" as const,
    totalAmount: "$350.00",
    paymentMethod: "bankTransfer" as const,
  },
  {
    invoice: "INV004",
    paymentStatus: "paid" as const,
    totalAmount: "$450.00",
    paymentMethod: "creditCard" as const,
  },
  {
    invoice: "INV005",
    paymentStatus: "paid" as const,
    totalAmount: "$550.00",
    paymentMethod: "paypal" as const,
  },
  {
    invoice: "INV006",
    paymentStatus: "pending" as const,
    totalAmount: "$200.00",
    paymentMethod: "bankTransfer" as const,
  },
  {
    invoice: "INV007",
    paymentStatus: "unpaid" as const,
    totalAmount: "$300.00",
    paymentMethod: "creditCard" as const,
  },
]

function TableRtl() {
  const { dir, t } = useTranslation(tableTranslations, "ar")

  return (
    <Example title="Table">
      <Table dir={dir}>
        <TableCaption>{t.caption}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">{t.invoice}</TableHead>
            <TableHead>{t.status}</TableHead>
            <TableHead>{t.method}</TableHead>
            <TableHead className="text-right">{t.amount}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell className="font-medium">{invoice.invoice}</TableCell>
              <TableCell>{t[invoice.paymentStatus]}</TableCell>
              <TableCell>{t[invoice.paymentMethod]}</TableCell>
              <TableCell className="text-right">
                {invoice.totalAmount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>{t.total}</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Example>
  )
}

const tabsTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      overview: "Overview",
      analytics: "Analytics",
      reports: "Reports",
      settings: "Settings",
      overviewTitle: "Overview",
      overviewDesc:
        "View your key metrics and recent project activity. Track progress across all your active projects.",
      overviewContent: "You have 12 active projects and 3 pending tasks.",
      analyticsTitle: "Analytics",
      analyticsDesc:
        "Track performance and user engagement metrics. Monitor trends and identify growth opportunities.",
      analyticsContent: "Page views are up 25% compared to last month.",
      reportsTitle: "Reports",
      reportsDesc:
        "Generate and download your detailed reports. Export data in multiple formats for analysis.",
      reportsContent: "You have 5 reports ready and available to export.",
      settingsTitle: "Settings",
      settingsDesc:
        "Manage your account preferences and options. Customize your experience to fit your needs.",
      settingsContent: "Configure notifications, security, and themes.",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      overview: "نظرة عامة",
      analytics: "التحليلات",
      reports: "التقارير",
      settings: "الإعدادات",
      overviewTitle: "نظرة عامة",
      overviewDesc:
        "عرض مقاييسك الرئيسية وأنشطة المشروع الأخيرة. تتبع التقدم عبر جميع مشاريعك النشطة.",
      overviewContent: "لديك ١٢ مشروعًا نشطًا و٣ مهام معلقة.",
      analyticsTitle: "التحليلات",
      analyticsDesc:
        "تتبع مقاييس الأداء ومشاركة المستخدمين. راقب الاتجاهات وحدد فرص النمو.",
      analyticsContent: "زادت مشاهدات الصفحة بنسبة ٢٥٪ مقارنة بالشهر الماضي.",
      reportsTitle: "التقارير",
      reportsDesc:
        "إنشاء وتنزيل تقاريرك التفصيلية. تصدير البيانات بتنسيقات متعددة للتحليل.",
      reportsContent: "لديك ٥ تقارير جاهزة ومتاحة للتصدير.",
      settingsTitle: "الإعدادات",
      settingsDesc:
        "إدارة تفضيلات حسابك وخياراته. تخصيص تجربتك لتناسب احتياجاتك.",
      settingsContent: "تكوين الإشعارات والأمان والسمات.",
    },
  },
  he: {
    dir: "rtl",
    values: {
      overview: "סקירה כללית",
      analytics: "אנליטיקה",
      reports: "דוחות",
      settings: "הגדרות",
      overviewTitle: "סקירה כללית",
      overviewDesc:
        "הצג את המדדים העיקריים שלך ופעילות הפרויקט האחרונה. עקוב אחר התקדמות בכל הפרויקטים הפעילים שלך.",
      overviewContent: "יש לך 12 פרויקטים פעילים ו-3 משימות ממתינות.",
      analyticsTitle: "אנליטיקה",
      analyticsDesc:
        "עקוב אחר ביצועים ומדדי מעורבות משתמשים. עקוב אחר מגמות וזהה הזדמנויות צמיחה.",
      analyticsContent: "צפיות בדף עלו ב-25% בהשוואה לחודש שעבר.",
      reportsTitle: "דוחות",
      reportsDesc:
        "צור והורד את הדוחות המפורטים שלך. ייצא נתונים בפורמטים מרובים לניתוח.",
      reportsContent: "יש לך 5 דוחות מוכנים וזמינים לייצוא.",
      settingsTitle: "הגדרות",
      settingsDesc:
        "נהל את העדפות החשבון והאפשרויות שלך. התאם אישית את החוויה שלך כך שתתאים לצרכים שלך.",
      settingsContent: "הגדר התראות, אבטחה וערכות נושא.",
    },
  },
}

function TabsRtl() {
  const { dir, t } = useTranslation(tabsTranslations, "ar")

  return (
    <Example title="Tabs">
      <Tabs defaultValue="overview" className="w-full max-w-sm" dir={dir}>
        <TabsList dir={dir}>
          <TabsTrigger value="overview">{t.overview}</TabsTrigger>
          <TabsTrigger value="analytics">{t.analytics}</TabsTrigger>
          <TabsTrigger value="reports">{t.reports}</TabsTrigger>
          <TabsTrigger value="settings">{t.settings}</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card dir={dir}>
            <CardHeader>
              <CardTitle>{t.overviewTitle}</CardTitle>
              <CardDescription>{t.overviewDesc}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {t.overviewContent}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <Card dir={dir}>
            <CardHeader>
              <CardTitle>{t.analyticsTitle}</CardTitle>
              <CardDescription>{t.analyticsDesc}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {t.analyticsContent}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports">
          <Card dir={dir}>
            <CardHeader>
              <CardTitle>{t.reportsTitle}</CardTitle>
              <CardDescription>{t.reportsDesc}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {t.reportsContent}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card dir={dir}>
            <CardHeader>
              <CardTitle>{t.settingsTitle}</CardTitle>
              <CardDescription>{t.settingsDesc}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {t.settingsContent}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Example>
  )
}

const textareaTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      label: "Feedback",
      placeholder: "Your feedback helps us improve...",
      description: "Share your thoughts about our service.",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      label: "التعليقات",
      placeholder: "تعليقاتك تساعدنا على التحسين...",
      description: "شاركنا أفكارك حول خدمتنا.",
    },
  },
  he: {
    dir: "rtl",
    values: {
      label: "משוב",
      placeholder: "המשוב שלך עוזר לנו להשתפר...",
      description: "שתף את מחשבותיך על השירות שלנו.",
    },
  },
}

function TextareaRtl() {
  const { dir, t } = useTranslation(textareaTranslations, "ar")

  return (
    <Example title="Textarea">
      <Field className="w-full max-w-xs" dir={dir}>
        <FieldLabel htmlFor="feedback" dir={dir}>
          {t.label}
        </FieldLabel>
        <Textarea
          id="feedback"
          placeholder={t.placeholder}
          dir={dir}
          rows={4}
        />
        <FieldDescription dir={dir}>{t.description}</FieldDescription>
      </Field>
    </Example>
  )
}

const toggleGroupTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      list: "List",
      grid: "Grid",
      cards: "Cards",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      list: "قائمة",
      grid: "شبكة",
      cards: "بطاقات",
    },
  },
  he: {
    dir: "rtl",
    values: {
      list: "רשימה",
      grid: "רשת",
      cards: "כרטיסים",
    },
  },
}

function ToggleGroupRtl() {
  const { dir, t } = useTranslation(toggleGroupTranslations, "ar")

  return (
    <Example title="Toggle Group">
      <ToggleGroup variant="outline" defaultValue={["list"]} dir={dir}>
        <ToggleGroupItem value="list" aria-label={t.list}>
          {t.list}
        </ToggleGroupItem>
        <ToggleGroupItem value="grid" aria-label={t.grid}>
          {t.grid}
        </ToggleGroupItem>
        <ToggleGroupItem value="cards" aria-label={t.cards}>
          {t.cards}
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  )
}

const toggleTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      label: "Bookmark",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      label: "إشارة مرجعية",
    },
  },
  he: {
    dir: "rtl",
    values: {
      label: "סימנייה",
    },
  },
}

function ToggleRtl() {
  const { dir, t } = useTranslation(toggleTranslations, "ar")

  return (
    <Example title="Toggle">
      <Toggle
        aria-label="Toggle bookmark"
        size="sm"
        variant="outline"
        dir={dir}
      >
        <HugeiconsIcon
          icon={Bookmark01Icon}
          className="group-aria-pressed/toggle:fill-foreground"
          strokeWidth={2}
        />
        {t.label}
      </Toggle>
    </Example>
  )
}

const tooltipTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      content: "Add to library",
      "inline-start": "Inline Start",
      left: "Left",
      top: "Top",
      bottom: "Bottom",
      right: "Right",
      "inline-end": "Inline End",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      content: "إضافة إلى المكتبة",
      "inline-start": "بداية السطر",
      left: "يسار",
      top: "أعلى",
      bottom: "أسفل",
      right: "يمين",
      "inline-end": "نهاية السطر",
    },
  },
  he: {
    dir: "rtl",
    values: {
      content: "הוסף לספרייה",
      "inline-start": "תחילת השורה",
      left: "שמאל",
      top: "למעלה",
      bottom: "למטה",
      right: "ימין",
      "inline-end": "סוף השורה",
    },
  },
}

function TooltipRtl() {
  const { dir, t } = useTranslation(tooltipTranslations, "ar")

  return (
    <Example title="Tooltip">
      <div className="grid gap-4">
        <div className="flex flex-wrap justify-center gap-2">
          {physicalSides.map((side) => (
            <Tooltip key={side}>
              <TooltipTrigger render={<Button variant="outline" />}>
                {t[side]}
              </TooltipTrigger>
              <TooltipContent side={side} dir={dir}>
                {t.content}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {logicalSides.map((side) => (
            <Tooltip key={side}>
              <TooltipTrigger render={<Button variant="outline" />}>
                {t[side]}
              </TooltipTrigger>
              <TooltipContent side={side} dir={dir}>
                {t.content}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </Example>
  )
}

const typographyTranslations: Translations = {
  en: {
    dir: "ltr",
    values: {
      title: "Taxing Laughter: The Joke Tax Chronicles",
      leadParagraph:
        "Once upon a time, in a far-off land, there was a very lazy king who spent all day lounging on his throne. One day, his advisors came to him with a problem: the kingdom was running out of money.",
      kingsPlan: "The King's Plan",
      kingThought: "The king thought long and hard, and finally came up with",
      brilliantPlan: "a brilliant plan",
      taxJokes: ": he would tax the jokes in the kingdom.",
      blockquote:
        '"After all," he said, "everyone enjoys a good joke, so it\'s only fair that they should pay for the privilege."',
      jokeTax: "The Joke Tax",
      subjectsNotAmused:
        "The king's subjects were not amused. They grumbled and complained, but the king was firm:",
      level1: "1st level of puns: 5 gold coins",
      level2: "2nd level of jokes: 10 gold coins",
      level3: "3rd level of one-liners: 20 gold coins",
      stoppedTelling:
        "As a result, people stopped telling jokes, and the kingdom fell into a gloom. But there was one person who refused to let the king's foolishness get him down: a court jester named Jokester.",
      jokestersRevolt: "Jokester's Revolt",
      sneaking:
        "Jokester began sneaking into the castle in the middle of the night and leaving jokes all over the place: under the king's pillow, in his soup, even in the royal toilet. The king was furious, but he couldn't seem to stop Jokester.",
      discovered:
        "And then, one day, the people of the kingdom discovered that the jokes left by Jokester were so funny that they couldn't help but laugh. And once they started laughing, they couldn't stop.",
      peoplesRebellion: "The People's Rebellion",
      uplifted:
        "The people of the kingdom, feeling uplifted by the laughter, started to tell jokes and puns again, and soon the entire kingdom was in on the joke.",
      kingsTreasury: "King's Treasury",
      peoplesHappiness: "People's happiness",
      empty: "Empty",
      overflowing: "Overflowing",
      modest: "Modest",
      satisfied: "Satisfied",
      full: "Full",
      ecstatic: "Ecstatic",
      realized:
        "The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax. Jokester was declared a hero, and the kingdom lived happily ever after.",
      moral:
        "The moral of the story is: never underestimate the power of a good laugh and always be careful of bad ideas.",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      title: "فرض الضرائب على الضحك: سجلات ضريبة النكتة",
      leadParagraph:
        "في قديم الزمان، في أرض بعيدة، كان هناك ملك كسول جداً يقضي يومه كله مستلقياً على عرشه. في أحد الأيام، جاءه مستشاروه بمشكلة: المملكة كانت تنفد من المال.",
      kingsPlan: "خطة الملك",
      kingThought: "فكر الملك طويلاً وبجد، وأخيراً توصل إلى",
      brilliantPlan: "خطة عبقرية",
      taxJokes: ": سيفرض ضريبة على النكات في المملكة.",
      blockquote:
        '"في النهاية،" قال، "الجميع يستمتع بنكتة جيدة، لذا من العدل أن يدفعوا مقابل هذا الامتياز."',
      jokeTax: "ضريبة النكتة",
      subjectsNotAmused:
        "لم يكن رعايا الملك سعداء. تذمروا واشتكوا، لكن الملك كان حازماً:",
      level1: "المستوى الأول من التورية: 5 قطع ذهبية",
      level2: "المستوى الثاني من النكات: 10 قطع ذهبية",
      level3: "المستوى الثالث من النكات القصيرة: 20 قطعة ذهبية",
      stoppedTelling:
        "نتيجة لذلك، توقف الناس عن رواية النكات، وغرقت المملكة في الكآبة. لكن كان هناك شخص واحد رفض أن تحبطه حماقة الملك: مهرج البلاط المسمى المازح.",
      jokestersRevolt: "ثورة المازح",
      sneaking:
        "بدأ المازح يتسلل إلى القلعة في منتصف الليل ويترك النكات في كل مكان: تحت وسادة الملك، في حسائه، حتى في المرحاض الملكي. كان الملك غاضباً، لكنه لم يستطع إيقاف المازح.",
      discovered:
        "وبعد ذلك، في يوم من الأيام، اكتشف سكان المملكة أن النكات التي تركها المازح كانت مضحكة جداً لدرجة أنهم لم يستطيعوا منع أنفسهم من الضحك. وبمجرد أن بدأوا بالضحك، لم يستطيعوا التوقف.",
      peoplesRebellion: "ثورة الشعب",
      uplifted:
        "شعر سكان المملكة بالبهجة من الضحك، وبدأوا في رواية النكات والتورية مرة أخرى، وسرعان ما أصبحت المملكة بأكملها جزءاً من النكتة.",
      kingsTreasury: "خزينة الملك",
      peoplesHappiness: "سعادة الشعب",
      empty: "فارغة",
      overflowing: "فائضة",
      modest: "متواضعة",
      satisfied: "راضٍ",
      full: "ممتلئة",
      ecstatic: "منتشٍ",
      realized:
        "الملك، عندما رأى مدى سعادة رعاياه، أدرك خطأ طرقه وألغى ضريبة النكتة. أُعلن المازح بطلاً، وعاشت المملكة في سعادة دائمة.",
      moral:
        "مغزى القصة هو: لا تستهن أبداً بقوة الضحك الجيد وكن دائماً حذراً من الأفكار السيئة.",
    },
  },
  he: {
    dir: "rtl",
    values: {
      title: "מיסוי הצחוק: כרוניקות מס הבדיחה",
      leadParagraph:
        "היה היה פעם, בארץ רחוקה, מלך עצלן מאוד שבילה את כל היום בהתרווחות על כס מלכותו. יום אחד, יועציו באו אליו עם בעיה: הממלכה נגמר לה הכסף.",
      kingsPlan: "התוכנית של המלך",
      kingThought: "המלך חשב ארוכות וקשות, ולבסוף העלה",
      brilliantPlan: "תוכנית גאונית",
      taxJokes: ": הוא ימסה את הבדיחות בממלכה.",
      blockquote:
        '"אחרי הכל," אמר, "כולם נהנים מבדיחה טובה, אז זה רק הוגן שישלמו על הזכות הזו."',
      jokeTax: "מס הבדיחה",
      subjectsNotAmused:
        "נתיני המלך לא היו מרוצים. הם התלוננו והתרעמו, אבל המלך היה נחוש:",
      level1: "רמה ראשונה של משחקי מילים: 5 מטבעות זהב",
      level2: "רמה שנייה של בדיחות: 10 מטבעות זהב",
      level3: "רמה שלישית של חידודים: 20 מטבעות זהב",
      stoppedTelling:
        "כתוצאה מכך, אנשים הפסיקו לספר בדיחות, והממלכה שקעה בעצב. אבל היה אדם אחד שסירב לתת לטיפשות המלך להפיל אותו: ליצן חצר בשם הבדחן.",
      jokestersRevolt: "המרד של הבדחן",
      sneaking:
        "הבדחן התחיל להתגנב לטירה באמצע הלילה ולהשאיר בדיחות בכל מקום: מתחת לכרית המלך, במרק שלו, אפילו בשירותים המלכותיים. המלך היה זועם, אבל הוא לא הצליח לעצור את הבדחן.",
      discovered:
        "ואז, יום אחד, תושבי הממלכה גילו שהבדיחות שהבדחן השאיר היו כל כך מצחיקות שהם לא יכלו להתאפק מלצחוק. וברגע שהתחילו לצחוק, הם לא יכלו להפסיק.",
      peoplesRebellion: "המרד של העם",
      uplifted:
        "תושבי הממלכה, שהרגישו מרוממים מהצחוק, התחילו לספר בדיחות ומשחקי מילים שוב, ובקרוב כל הממלכה הייתה חלק מהבדיחה.",
      kingsTreasury: "אוצר המלך",
      peoplesHappiness: "אושר העם",
      empty: "ריק",
      overflowing: "גדוש",
      modest: "צנוע",
      satisfied: "מרוצה",
      full: "מלא",
      ecstatic: "אקסטטי",
      realized:
        "המלך, כשראה כמה מאושרים נתיניו, הבין את טעותו וביטל את מס הבדיחה. הבדחן הוכרז כגיבור, והממלכה חיה באושר לנצח.",
      moral:
        "המוסר של הסיפור הוא: לעולם אל תזלזל בכוח של צחוק טוב ותמיד היזהר מרעיונות רעים.",
    },
  },
}

function TypographyRtl() {
  const { dir, t } = useTranslation(typographyTranslations, "ar")

  return (
    <Example title="Typography">
      <div dir={dir}>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
          {t.title}
        </h1>
        <p className="text-xl leading-7 text-muted-foreground [&:not(:first-child)]:mt-6">
          {t.leadParagraph}
        </p>
        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t.kingsPlan}
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t.kingThought}{" "}
          <a
            href="#"
            className="font-medium text-primary underline underline-offset-4"
          >
            {t.brilliantPlan}
          </a>
          {t.taxJokes}
        </p>
        <blockquote className="mt-6 border-s-2 ps-6 italic">
          {t.blockquote}
        </blockquote>
        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          {t.jokeTax}
        </h3>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t.subjectsNotAmused}
        </p>
        <ul className="my-6 ms-6 list-disc [&>li]:mt-2">
          <li>{t.level1}</li>
          <li>{t.level2}</li>
          <li>{t.level3}</li>
        </ul>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t.stoppedTelling}
        </p>
        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          {t.jokestersRevolt}
        </h3>
        <p className="leading-7 [&:not(:first-child)]:mt-6">{t.sneaking}</p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">{t.discovered}</p>
        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          {t.peoplesRebellion}
        </h3>
        <p className="leading-7 [&:not(:first-child)]:mt-6">{t.uplifted}</p>
        <div className="my-6 w-full overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr className="m-0 border-t p-0 even:bg-muted">
                <th className="border px-4 py-2 text-start font-bold">
                  {t.kingsTreasury}
                </th>
                <th className="border px-4 py-2 text-start font-bold">
                  {t.peoplesHappiness}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="m-0 border-t p-0 even:bg-muted">
                <td className="border px-4 py-2 text-start">{t.empty}</td>
                <td className="border px-4 py-2 text-start">{t.overflowing}</td>
              </tr>
              <tr className="m-0 border-t p-0 even:bg-muted">
                <td className="border px-4 py-2 text-start">{t.modest}</td>
                <td className="border px-4 py-2 text-start">{t.satisfied}</td>
              </tr>
              <tr className="m-0 border-t p-0 even:bg-muted">
                <td className="border px-4 py-2 text-start">{t.full}</td>
                <td className="border px-4 py-2 text-start">{t.ecstatic}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="leading-7 [&:not(:first-child)]:mt-6">{t.realized}</p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">{t.moral}</p>
      </div>
    </Example>
  )
}
