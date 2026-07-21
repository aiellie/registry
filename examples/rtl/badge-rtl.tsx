"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Bookmark01Icon,
  CheckmarkBadge01Icon,
} from "@hugeicons/core-free-icons"
import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"
import { Badge } from "@/components/ui/badge"

const translations: Translations = {
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

export function BadgeRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <div className="flex w-full flex-wrap justify-center gap-2" dir={dir}>
      <Badge>{t.badge}</Badge>
      <Badge variant="secondary">{t.secondary}</Badge>
      <Badge variant="destructive">{t.destructive}</Badge>
      <Badge variant="outline">{t.outline}</Badge>
      <Badge variant="secondary">
        <HugeiconsIcon icon={CheckmarkBadge01Icon} data-icon="inline-start" strokeWidth={2} />
        {t.verified}
      </Badge>
      <Badge variant="outline">
        {t.bookmark}
        <HugeiconsIcon icon={Bookmark01Icon} data-icon="inline-end" strokeWidth={2} />
      </Badge>
    </div>
  )
}
