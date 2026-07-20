import { HugeiconsIcon } from "@hugeicons/react"
import {
  Calendar03Icon,
  InformationCircleIcon,
  PinIcon,
} from "@hugeicons/core-free-icons"

import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"

export const marker = {
  name: "marker",
  components: {
    Default: (
      <div className="flex w-full justify-center p-6">
        <div className="grid w-full max-w-md gap-4">
          <Marker>
            <MarkerIcon>
              <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} />
            </MarkerIcon>
            <MarkerContent>
              12 new messages since <a href="#">yesterday</a>
            </MarkerContent>
          </Marker>
          <Marker>
            <MarkerIcon>
              <HugeiconsIcon icon={PinIcon} strokeWidth={2} />
            </MarkerIcon>
            <MarkerContent>Pinned by the moderators</MarkerContent>
          </Marker>
        </div>
      </div>
    ),
    Separator: (
      <div className="flex w-full justify-center p-6">
        <div className="grid w-full max-w-md gap-4">
          <Marker variant="separator">
            <MarkerContent>Today</MarkerContent>
          </Marker>
          <Marker variant="separator">
            <MarkerIcon>
              <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} />
            </MarkerIcon>
            <MarkerContent>July 20, 2026</MarkerContent>
          </Marker>
        </div>
      </div>
    ),
    Border: (
      <div className="flex w-full justify-center p-6">
        <div className="w-full max-w-md">
          <Marker variant="border">
            <MarkerIcon>
              <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} />
            </MarkerIcon>
            <MarkerContent>Unread messages below</MarkerContent>
          </Marker>
        </div>
      </div>
    ),
  },
}
