import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const rows = [100, 65, 29, 16]

export function TokenSpend() {
  return (
    <Card>
      <CardHeader className="gap-2.5">
        <Skeleton className="h-5 w-28 rounded-md" />
        <Skeleton className="h-4 w-40 rounded-md" />
        <CardAction>
          <Skeleton className="size-7 rounded-xl" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-36 rounded-md" />
          <Skeleton className="ms-auto h-5 w-16 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-0.5 rounded-lg bg-muted/50 px-3 py-2.5"
            >
              <Skeleton className="h-4 w-14 rounded-md bg-muted-foreground/15" />
              <Skeleton className="h-6 w-16 rounded-md bg-muted-foreground/15" />
              <Skeleton className="h-4 w-20 rounded-md bg-muted-foreground/15" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-4 w-14 rounded-md" />
          </div>
          {rows.map((width, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-lg bg-muted/50 px-3 py-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-4 w-32 rounded-md bg-muted-foreground/15" />
                <Skeleton className="h-4 w-14 rounded-md bg-muted-foreground/15" />
              </div>
              <Skeleton
                className="h-1 rounded-full bg-muted-foreground/15"
                style={{ width: `${width}%` }}
              />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <Skeleton className="h-4 w-36 rounded-md" />
        <Skeleton className="h-4 w-16 rounded-md" />
      </CardFooter>
    </Card>
  )
}
