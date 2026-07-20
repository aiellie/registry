import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  CheckmarkBadge02Icon,
} from "@hugeicons/core-free-icons"

import { Badge } from "@/components/ui/badge"

export const badge = {
  name: "badge",
  components: {
    Variants: (
      <div className="flex w-full flex-wrap items-center justify-center gap-2 p-6">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="ghost">Ghost</Badge>
        <Badge variant="link">Link</Badge>
      </div>
    ),
    WithIcon: (
      <div className="flex w-full flex-wrap items-center justify-center gap-2 p-6">
        <Badge variant="secondary">
          <HugeiconsIcon
            icon={CheckmarkBadge02Icon}
            strokeWidth={2}
            data-icon="inline-start"
          />
          Verified
        </Badge>
        <Badge variant="outline">
          v2.1.0
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            strokeWidth={2}
            data-icon="inline-end"
            className="rtl:rotate-180"
          />
        </Badge>
      </div>
    ),
    AsLink: (
      <div className="flex w-full items-center justify-center p-6">
        <Badge render={<Link href="#" />}>
          Changelog
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            strokeWidth={2}
            data-icon="inline-end"
            className="rtl:rotate-180"
          />
        </Badge>
      </div>
    ),
  },
}
