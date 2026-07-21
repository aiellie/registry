"use client"

import { Example, ExampleWrapper } from "@/components/example"
import {
  LanguageProvider,
  LanguageSelector,
  useLanguageContext,
} from "@/components/language-selector"

import { AccordionRtl } from "@/examples/rtl/accordion-rtl"
import { AlertDialogRtl } from "@/examples/rtl/alert-dialog-rtl"
import { AlertRtl } from "@/examples/rtl/alert-rtl"
import { AspectRatioRtl } from "@/examples/rtl/aspect-ratio-rtl"
import { AvatarRtl } from "@/examples/rtl/avatar-rtl"
import { BadgeRtl } from "@/examples/rtl/badge-rtl"
import { BreadcrumbRtl } from "@/examples/rtl/breadcrumb-rtl"
import { ButtonGroupRtl } from "@/examples/rtl/button-group-rtl"
import { ButtonRtl } from "@/examples/rtl/button-rtl"
import { CalendarRtl } from "@/examples/rtl/calendar-rtl"
import { CardRtl } from "@/examples/rtl/card-rtl"
import { CarouselRtl } from "@/examples/rtl/carousel-rtl"
import { ChartRtl } from "@/examples/rtl/chart-rtl"
import { CheckboxRtl } from "@/examples/rtl/checkbox-rtl"
import { CollapsibleRtl } from "@/examples/rtl/collapsible-rtl"
import { ComboboxRtl } from "@/examples/rtl/combobox-rtl"
import { CommandRtl } from "@/examples/rtl/command-rtl"
import { ContextMenuRtl } from "@/examples/rtl/context-menu-rtl"
import { DataTableRtl } from "@/examples/rtl/data-table-rtl"
import { DatePickerRtl } from "@/examples/rtl/date-picker-rtl"
import { DialogRtl } from "@/examples/rtl/dialog-rtl"
import { DrawerRtl } from "@/examples/rtl/drawer-rtl"
import { DropdownMenuRtl } from "@/examples/rtl/dropdown-menu-rtl"
import { EmptyRtl } from "@/examples/rtl/empty-rtl"
import { FieldRtl } from "@/examples/rtl/field-rtl"
import { HoverCardRtl } from "@/examples/rtl/hover-card-rtl"
import { InputGroupRtl } from "@/examples/rtl/input-group-rtl"
import { InputOTPRtl } from "@/examples/rtl/input-otp-rtl"
import { InputRtl } from "@/examples/rtl/input-rtl"
import { ItemRtl } from "@/examples/rtl/item-rtl"
import { KbdRtl } from "@/examples/rtl/kbd-rtl"
import { LabelRtl } from "@/examples/rtl/label-rtl"
import { MenubarRtl } from "@/examples/rtl/menubar-rtl"
import { NativeSelectRtl } from "@/examples/rtl/native-select-rtl"
import { NavigationMenuRtl } from "@/examples/rtl/navigation-menu-rtl"
import { PaginationRtl } from "@/examples/rtl/pagination-rtl"
import { PopoverRtl } from "@/examples/rtl/popover-rtl"
import { ProgressRtl } from "@/examples/rtl/progress-rtl"
import { RadioGroupRtl } from "@/examples/rtl/radio-group-rtl"
import { ResizableRtl } from "@/examples/rtl/resizable-rtl"
import { ScrollAreaRtl } from "@/examples/rtl/scroll-area-rtl"
import { ScrollFadeRtl } from "@/examples/rtl/scroll-fade-rtl"
import { SelectRtl } from "@/examples/rtl/select-rtl"
import { SeparatorRtl } from "@/examples/rtl/separator-rtl"
import { SheetRtl } from "@/examples/rtl/sheet-rtl"
import { ShimmerRtl } from "@/examples/rtl/shimmer-rtl"
import { SkeletonRtl } from "@/examples/rtl/skeleton-rtl"
import { SliderRtl } from "@/examples/rtl/slider-rtl"
import { SpinnerRtl } from "@/examples/rtl/spinner-rtl"
import { SwitchRtl } from "@/examples/rtl/switch-rtl"
import { TableRtl } from "@/examples/rtl/table-rtl"
import { TabsRtl } from "@/examples/rtl/tabs-rtl"
import TextareaRtl from "@/examples/rtl/textarea-rtl"
import { ToggleGroupRtl } from "@/examples/rtl/toggle-group-rtl"
import { ToggleRtl } from "@/examples/rtl/toggle-rtl"
import { TooltipRtl } from "@/examples/rtl/tooltip-rtl"
import { TypographyRtl } from "@/examples/rtl/typography-rtl"

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

export default function DirectionExample() {
  return (
    <LanguageProvider defaultLanguage="he">
      <div className="sticky top-0 z-20 flex justify-end border-b bg-background/70 px-4 py-2 backdrop-blur-md sm:px-6 lg:px-12">
        <LanguageSwitcher />
      </div>
      <ExampleWrapper>
        <Example title="Accordion">
          <AccordionRtl />
        </Example>
        <Example title="Alert Dialog">
          <AlertDialogRtl />
        </Example>
        <Example title="Alert">
          <AlertRtl />
        </Example>
        <Example title="Aspect Ratio">
          <AspectRatioRtl />
        </Example>
        <Example title="Avatar">
          <AvatarRtl />
        </Example>
        <Example title="Badge">
          <BadgeRtl />
        </Example>
        <Example title="Breadcrumb">
          <BreadcrumbRtl />
        </Example>
        <Example title="Button Group">
          <ButtonGroupRtl />
        </Example>
        <Example title="Button">
          <ButtonRtl />
        </Example>
        <Example title="Calendar">
          <CalendarRtl />
        </Example>
        <Example title="Card">
          <CardRtl />
        </Example>
        <Example title="Carousel">
          <CarouselRtl />
        </Example>
        <Example title="Chart">
          <ChartRtl />
        </Example>
        <Example title="Checkbox">
          <CheckboxRtl />
        </Example>
        <Example title="Collapsible">
          <CollapsibleRtl />
        </Example>
        <Example title="Combobox">
          <ComboboxRtl />
        </Example>
        <Example title="Command">
          <CommandRtl />
        </Example>
        <Example title="Context Menu">
          <ContextMenuRtl />
        </Example>
        <Example title="Data Table">
          <DataTableRtl />
        </Example>
        <Example title="Date Picker">
          <DatePickerRtl />
        </Example>
        <Example title="Dialog">
          <DialogRtl />
        </Example>
        <Example title="Drawer">
          <DrawerRtl />
        </Example>
        <Example title="Dropdown Menu">
          <DropdownMenuRtl />
        </Example>
        <Example title="Empty">
          <EmptyRtl />
        </Example>
        <Example title="Field">
          <FieldRtl />
        </Example>
        <Example title="Hover Card">
          <HoverCardRtl />
        </Example>
        <Example title="Input Group">
          <InputGroupRtl />
        </Example>
        <Example title="Input OTP">
          <InputOTPRtl />
        </Example>
        <Example title="Input">
          <InputRtl />
        </Example>
        <Example title="Item">
          <ItemRtl />
        </Example>
        <Example title="Kbd">
          <KbdRtl />
        </Example>
        <Example title="Label">
          <LabelRtl />
        </Example>
        <Example title="Menubar">
          <MenubarRtl />
        </Example>
        <Example title="Native Select">
          <NativeSelectRtl />
        </Example>
        <Example title="Navigation Menu">
          <NavigationMenuRtl />
        </Example>
        <Example title="Pagination">
          <PaginationRtl />
        </Example>
        <Example title="Popover">
          <PopoverRtl />
        </Example>
        <Example title="Progress">
          <ProgressRtl />
        </Example>
        <Example title="Radio Group">
          <RadioGroupRtl />
        </Example>
        <Example title="Resizable">
          <ResizableRtl />
        </Example>
        <Example title="Scroll Area">
          <ScrollAreaRtl />
        </Example>
        <Example title="Scroll Fade">
          <ScrollFadeRtl />
        </Example>
        <Example title="Select">
          <SelectRtl />
        </Example>
        <Example title="Separator">
          <SeparatorRtl />
        </Example>
        <Example title="Sheet">
          <SheetRtl />
        </Example>
        <Example title="Shimmer">
          <ShimmerRtl />
        </Example>
        <Example title="Skeleton">
          <SkeletonRtl />
        </Example>
        <Example title="Slider">
          <SliderRtl />
        </Example>
        <Example title="Spinner">
          <SpinnerRtl />
        </Example>
        <Example title="Switch">
          <SwitchRtl />
        </Example>
        <Example title="Table">
          <TableRtl />
        </Example>
        <Example title="Tabs">
          <TabsRtl />
        </Example>
        <Example title="Textarea">
          <TextareaRtl />
        </Example>
        <Example title="Toggle Group">
          <ToggleGroupRtl />
        </Example>
        <Example title="Toggle">
          <ToggleRtl />
        </Example>
        <Example title="Tooltip">
          <TooltipRtl />
        </Example>
        <Example title="Typography">
          <TypographyRtl />
        </Example>
      </ExampleWrapper>
    </LanguageProvider>
  )
}
