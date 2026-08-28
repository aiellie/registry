import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const DAYS = 45
const LEGEND = [64, 52, 40]

export function UptimeMonitor() {
  return (
    <Card>
      <CardHeader className="gap-1.5">
        <Skeleton className="h-5 w-36 rounded-md" />
        <Skeleton className="h-4 w-32 rounded-md" />
        <CardAction>
          <Skeleton className="h-6 w-24 rounded-4xl" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-28 rounded-md" />
          <Skeleton className="h-4 w-28 rounded-md" />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex h-10 w-full items-stretch gap-px">
            {Array.from({ length: DAYS }, (_, index) => (
              <Skeleton key={index} className="flex-1 rounded-xs" />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16 rounded-md" />
            <Skeleton className="h-4 w-10 rounded-md" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2 rounded-lg bg-muted/50 px-3 py-2.5">
            <Skeleton className="h-3 w-20 rounded-md bg-muted-foreground/15" />
            <Skeleton className="h-6 w-16 rounded-md bg-muted-foreground/15" />
            <Skeleton className="h-3.5 w-24 rounded-md bg-muted-foreground/15" />
          </div>
          <div className="flex flex-col gap-2 rounded-lg bg-muted/50 px-3 py-2.5">
            <Skeleton className="h-3 w-24 rounded-md bg-muted-foreground/15" />
            <Skeleton className="h-6 w-14 rounded-md bg-muted-foreground/15" />
            <Skeleton className="h-3.5 w-20 rounded-md bg-muted-foreground/15" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-3">
        {LEGEND.map((width, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <Skeleton className="size-1.5 rounded-full" />
            <Skeleton
              className="h-4 rounded-md"
              style={{ width: `${width}px` }}
            />
          </div>
        ))}
      </CardFooter>
    </Card>
  )
}
