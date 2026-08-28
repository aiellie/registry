import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import {
  Announcement as AnnouncementBase,
  AnnouncementTag,
  AnnouncementTitle,
} from "@/components/aiellie/alerts/announcement"
import { Status, StatusIndicator } from "@/components/aiellie/ui/status"

export function Announcement() {
  return (
    <AnnouncementBase>
      <Link href="/demo/newchat" className="flex items-center gap-2">
        <AnnouncementTag className="inline-flex items-center gap-1.5">
          <Status
            variant="brand"
            pulse
            aria-label="Live"
            className="border-transparent bg-transparent p-0"
          >
            <StatusIndicator />
          </Status>
          New
        </AnnouncementTag>
        <AnnouncementTitle>
          Chatbot Template{" "}
          <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
        </AnnouncementTitle>
      </Link>
    </AnnouncementBase>
  )
}
