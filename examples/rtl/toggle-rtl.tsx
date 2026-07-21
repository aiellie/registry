"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Bookmark01Icon,
} from "@hugeicons/core-free-icons"
import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"
import { Toggle } from "@/components/ui/toggle"

const translations: Translations = {
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

export function ToggleRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <Toggle aria-label="Toggle bookmark" size="sm" variant="outline" dir={dir}>
      <HugeiconsIcon icon={Bookmark01Icon} className="group-aria-pressed/toggle:fill-foreground" strokeWidth={2} />
      {t.label}
    </Toggle>
  )
}
