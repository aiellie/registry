import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
  CloudIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { DirectionProvider } from "@/components/ui/direction"
import { Slider } from "@/components/ui/slider"

function StorageCard({
  dir,
  title,
  description,
  action,
}: {
  dir: "ltr" | "rtl"
  title: string
  description: string
  action: string
}) {
  return (
    <DirectionProvider direction={dir}>
      <div
        dir={dir}
        className="w-72 rounded-xl border bg-background p-4 shadow-sm"
      >
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-muted">
            <HugeiconsIcon
              icon={CloudIcon}
              strokeWidth={2}
              className="size-4"
            />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{title}</span>
            <span className="text-xs text-muted-foreground">{description}</span>
          </div>
        </div>
        <div className="mt-4">
          <Slider defaultValue={[64]} />
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm">
            {action}
            <HugeiconsIcon
              icon={dir === "rtl" ? ArrowLeft02Icon : ArrowRight02Icon}
              strokeWidth={2}
            />
          </Button>
        </div>
      </div>
    </DirectionProvider>
  )
}

export const direction = {
  name: "direction",
  components: {
    LeftToRight: (
      <div className="flex w-full items-center justify-center p-6">
        <StorageCard
          dir="ltr"
          title="Storage"
          description="64% of your space is in use."
          action="Manage"
        />
      </div>
    ),
    RightToLeft: (
      <div className="flex w-full items-center justify-center p-6">
        <StorageCard
          dir="rtl"
          title="مساحة التخزين"
          description="تم استخدام ٦٤٪ من المساحة المتاحة."
          action="إدارة"
        />
      </div>
    ),
  },
}
