import { cn } from "@/lib/utils"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const rows = ["w-14", "w-12", "w-12", "w-10"]

const swatches = [0, 1, 2, 3, 4, 5]

export function PalettePicker() {
  return (
    <Card size="sm">
      <CardHeader>
        <Skeleton className="h-5 w-28 rounded-md" />
        <Skeleton className="h-5 w-36 rounded-md" />
        <CardAction>
          <Skeleton className="size-7 rounded-lg" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-14 rounded-sm" />
        {rows.map((width, index) => (
          <div
            className="flex h-9 items-center justify-between gap-3 rounded-lg bg-muted/60 px-3"
            key={index}
          >
            <Skeleton
              className={cn("h-4 rounded-sm bg-muted-foreground/15", width)}
            />
            <div className="flex shrink-0 items-center gap-2">
              <Skeleton className="h-4 w-14 rounded-sm bg-muted-foreground/15" />
              <Skeleton className="size-4.5 shrink-0 rounded-full bg-muted-foreground/15" />
            </div>
          </div>
        ))}
      </CardContent>
      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-4 w-10 rounded-sm" />
        <div className="flex items-center justify-between gap-1">
          {swatches.map((index) => (
            <Skeleton className="size-7 shrink-0 rounded-full" key={index} />
          ))}
        </div>
        <Skeleton className="h-6 w-full rounded-md" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-8 w-full rounded-lg" />
      </CardFooter>
    </Card>
  )
}
