import Link from "next/link"
import { ArrowRightIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status"

export function Announcement() {
  return (
    <Status
      variant="brand"
      pulse
      render={<Link href="/docs/changelog" />}
      className="gap-2 py-1 transition-colors hover:bg-primary/10"
    >
      <StatusIndicator />
      <StatusLabel>Updated</StatusLabel>
      <HugeiconsIcon
        icon={ArrowRightIcon}
        strokeWidth={2}
        className="size-3 transition-transform group-hover/status:translate-x-0.5"
      />
    </Status>
  )
}
