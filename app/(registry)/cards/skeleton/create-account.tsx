import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CreateAccount() {
  return (
    <Card>
      <CardHeader className="gap-2">
        <Skeleton className="h-7 w-44 rounded-md" />
        <Skeleton className="h-4 w-56 rounded-md" />
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-9 w-full rounded-lg" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-px flex-1 rounded-none" />
          <Skeleton className="h-3 w-28 rounded-md" />
          <Skeleton className="h-px flex-1 rounded-none" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-12 rounded-md" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-16 rounded-md" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
        <Skeleton className="h-9 w-full rounded-lg" />
      </CardContent>
    </Card>
  )
}
