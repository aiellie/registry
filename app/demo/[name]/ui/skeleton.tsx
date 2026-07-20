import { Skeleton } from "@/components/ui/skeleton"

export const skeleton = {
  name: "skeleton",
  components: {
    Default: (
      <div className="flex w-full justify-center p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="size-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-62" />
            <Skeleton className="h-4 w-50" />
          </div>
        </div>
      </div>
    ),
    Card: (
      <div className="flex w-full justify-center p-6">
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-31 w-62 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-62" />
            <Skeleton className="h-4 w-50" />
          </div>
        </div>
      </div>
    ),
  },
}
