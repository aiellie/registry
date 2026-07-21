"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Calculator01Icon,
  Calendar03Icon,
  CreditCardIcon,
  Happy01Icon,
  Settings02Icon,
  User03Icon,
} from "@hugeicons/core-free-icons"
import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"
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

const translations: Translations = {
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

export function CommandRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
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
  )
}
