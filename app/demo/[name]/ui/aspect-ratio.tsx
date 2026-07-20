import { HugeiconsIcon } from "@hugeicons/react"
import { Image02Icon } from "@hugeicons/core-free-icons"

import { AspectRatio } from "@/components/ui/aspect-ratio"

export const aspectRatio = {
  name: "aspect-ratio",
  components: {
    Wide: (
      <div className="flex w-full justify-center p-6">
        <div className="w-full max-w-md">
          <AspectRatio
            ratio={16 / 9}
            className="rounded-lg border border-dashed bg-muted"
          >
            <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <HugeiconsIcon
                icon={Image02Icon}
                strokeWidth={2}
                className="size-6"
              />
              <span className="text-sm">16:9</span>
            </div>
          </AspectRatio>
        </div>
      </div>
    ),
    Square: (
      <div className="flex w-full justify-center gap-4 p-6">
        <div className="w-40">
          <AspectRatio
            ratio={1}
            className="rounded-lg border border-dashed bg-muted"
          >
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              1:1
            </div>
          </AspectRatio>
        </div>
        <div className="w-40">
          <AspectRatio
            ratio={3 / 4}
            className="rounded-lg border border-dashed bg-muted"
          >
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              3:4
            </div>
          </AspectRatio>
        </div>
      </div>
    ),
  },
}
