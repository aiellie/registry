import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CookieSettings() {
  return (
    <Card>
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-32 rounded-md" />
        <Skeleton className="h-4 w-52 rounded-md" />
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-36 rounded-md" />
            <Skeleton className="h-3 w-full rounded-md" />
            <Skeleton className="h-3 w-40 rounded-md" />
          </div>
          <Skeleton className="h-5 w-9 rounded-full" />
        </div>
        <Skeleton className="h-9 w-full rounded-lg" />
      </CardContent>
    </Card>
  )
}
