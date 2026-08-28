import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function Stats() {
  return (
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
  )
}
