import Link from "next/link"
import { ArrowRightIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status"

export function Announcement() {
  return (
    <Status
      variant="brand"
      pulse
      className="gap-2 py-1 transition-colors hover:bg-primary/10"
    >
      <StatusIndicator />
      <StatusLabel>Updated</StatusLabel>
    </Status>
  )
}
