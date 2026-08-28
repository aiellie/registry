import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const PERCENTILES = [0, 1, 2]

export function ApiLatency() {
  return (
    <Card>
      <CardHeader className="gap-1.5">
        <Skeleton className="h-5 w-28 rounded-md" />
        <Skeleton className="h-4 w-44 rounded-md" />
        <CardAction>
          <Skeleton className="h-4 w-20 rounded-md" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-[88px] w-full rounded-lg" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-12 rounded-md" />
            <Skeleton className="h-4 w-16 rounded-md" />
            <Skeleton className="h-4 w-8 rounded-md" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {PERCENTILES.map((index) => (
            <div
              key={index}
              className="flex flex-col gap-1 rounded-lg bg-muted/50 px-2.5 py-2"
            >
              <Skeleton className="h-4 w-8 rounded-md bg-muted-foreground/15" />
              <Skeleton className="h-6 w-14 rounded-md bg-muted-foreground/15" />
              <Skeleton className="h-4 w-10 rounded-md bg-muted-foreground/15" />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <Skeleton className="h-4 w-28 rounded-md" />
        <Skeleton className="h-[22px] w-24 rounded-4xl" />
      </CardFooter>
    </Card>
  )
}
