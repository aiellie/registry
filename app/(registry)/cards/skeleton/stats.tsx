import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function Stats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      <Card>
        <CardHeader className="gap-2">
          <Skeleton className="h-3 w-24 rounded-md" />
          <Skeleton className="h-8 w-32 rounded-md" />
          <Skeleton className="h-3 w-32 rounded-md" />
        </CardHeader>
        <CardContent className="pb-0">
          <Skeleton className="h-[80px] w-full rounded-lg" />
        </CardContent>
      </Card>
      <Card className="pb-0 lg:hidden xl:flex">
        <CardHeader className="gap-2">
          <Skeleton className="h-3 w-24 rounded-md" />
          <Skeleton className="h-8 w-28 rounded-md" />
          <Skeleton className="h-3 w-32 rounded-md" />
          <CardAction>
            <Skeleton className="h-7 w-20 rounded-lg" />
          </CardAction>
        </CardHeader>
        <CardContent className="mt-auto max-h-[124px] flex-1 p-0">
          <Skeleton className="h-[100px] w-full rounded-none" />
        </CardContent>
      </Card>
    </div>
  )
}
