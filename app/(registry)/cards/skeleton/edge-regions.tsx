import { cn } from "@/lib/utils"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const REGIONS = [100, 72, 53, 39, 28]

export function EdgeRegions() {
  return (
    <Card>
      <CardHeader className="gap-1.5">
        <Skeleton className="h-5 w-32 rounded-md" />
        <Skeleton className="h-5 w-44 rounded-md" />
        <CardAction>
          <Skeleton className="size-8 rounded-lg" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {REGIONS.map((share, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-col gap-1.5 rounded-lg px-2.5 py-2",
              index === 0 && "bg-muted/60 ring-1 ring-foreground/10"
            )}
          >
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-9 shrink-0 rounded-md" />
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="ms-auto h-4 w-10 shrink-0 rounded-md" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-foreground/10">
                <Skeleton
                  className="h-full rounded-full"
                  style={{ width: `${share}%` }}
                />
              </div>
              <Skeleton className="h-4 w-12 shrink-0 rounded-md" />
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <Skeleton className="h-4 w-32 rounded-md" />
        <Skeleton className="h-4 w-24 rounded-md" />
      </CardFooter>
    </Card>
  )
}
