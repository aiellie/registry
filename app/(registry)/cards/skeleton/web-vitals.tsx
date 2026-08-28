import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const METRICS = [0, 1, 2]

export function WebVitals() {
  return (
    <Card>
      <CardHeader className="gap-1.5">
        <Skeleton className="h-5 w-36 rounded-md" />
        <Skeleton className="h-4 w-40 rounded-md" />
        <CardAction>
          <Skeleton className="h-6 w-16 rounded-4xl" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-7 w-[7.5rem] rounded-[10px]" />
          <Skeleton className="h-7 w-14 rounded-[10px]" />
        </div>
        {METRICS.map((index) => (
          <div key={index} className="flex flex-col gap-2 py-1">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-3 w-9 rounded-md" />
                <Skeleton className="h-3 w-36 rounded-md" />
              </div>
              <div className="flex flex-col items-end gap-1">
                <Skeleton className="h-6 w-16 rounded-md" />
                <Skeleton className="h-3.5 w-20 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />
          </div>
        ))}
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <Skeleton className="h-4 w-40 rounded-md" />
        <Skeleton className="size-7 rounded-lg" />
      </CardFooter>
    </Card>
  )
}
