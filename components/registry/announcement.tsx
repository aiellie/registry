import Link from "next/link"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status"

export function Announcement() {
  return (
    <Status
      variant="brand"
      pulse
      render={<Link href="/demo/newchat" />}
      className="gap-2 py-1 transition-colors hover:bg-primary/10"
    >
      <StatusIndicator />
      <StatusLabel className="inline-flex items-center gap-1">
        Chat Dashboard Template
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          strokeWidth={2}
          className="size-3.5 rtl:rotate-180"
        />
      </StatusLabel>
    </Status>
  )
}
