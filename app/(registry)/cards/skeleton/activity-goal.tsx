import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const bars = [60, 45, 30, 45, 30, 42, 28, 36, 45, 30, 42, 28, 52]

export function ActivityGoal() {
  return (
    <Card className="h-full gap-5">
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-24 rounded-md" />
        <Skeleton className="h-4 w-40 rounded-md" />
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-6">
        <div className="flex items-center justify-center gap-4">
          <Skeleton className="size-7 rounded-full" />
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-10 w-20 rounded-md" />
            <Skeleton className="h-3 w-24 rounded-md" />
          </div>
          <Skeleton className="size-7 rounded-full" />
        </div>
        <div className="flex h-16 flex-1 items-end gap-1.5">
          {bars.map((height, i) => (
            <Skeleton
              key={i}
              className="flex-1 rounded-sm"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-full rounded-lg" />
      </CardFooter>
    </Card>
  )
}
