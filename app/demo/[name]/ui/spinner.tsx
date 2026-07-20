import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export const spinner = {
  name: "spinner",
  components: {
    Default: (
      <div className="flex w-full items-center justify-center p-6">
        <Spinner />
      </div>
    ),
    Sizes: (
      <div className="flex w-full items-center justify-center gap-6 p-6">
        <Spinner className="size-3" />
        <Spinner />
        <Spinner className="size-6" />
        <Spinner className="size-8" />
      </div>
    ),
    "In Context": (
      <div className="flex w-full flex-wrap items-center justify-center gap-2 p-6">
        <Button disabled>
          <Spinner data-icon="inline-start" />
          Please wait
        </Button>
        <Button variant="outline" disabled>
          <Spinner data-icon="inline-start" />
          Processing
        </Button>
        <Badge variant="secondary">
          <Spinner className="size-3" />
          Syncing
        </Badge>
      </div>
    ),
  },
}
