import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ScheduleRun() {
  return (
    <Card>
      <CardHeader className="gap-2.5">
        <Skeleton className="h-5 w-36 rounded-md" />
        <Skeleton className="h-4 w-40 rounded-md" />
        <CardAction>
          <Skeleton className="h-5 w-9 rounded-full" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3.5 w-14 rounded-md" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-16 rounded-md" />
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-8 flex-1 rounded-md" />
            ))}
          </div>
        </div>
        <Skeleton className="h-9 w-full rounded-lg" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-full rounded-lg" />
      </CardFooter>
    </Card>
  )
}
