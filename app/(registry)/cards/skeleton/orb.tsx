import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const states = ["idle", "listening", "thinking", "speaking"]

export function OrbCard() {
  return (
    <Card size="sm">
      <CardHeader className="gap-2">
        <Skeleton className="h-4 w-16 rounded-md" />
        <Skeleton className="h-3.5 w-36 rounded-md" />
        <CardAction>
          <Skeleton className="h-5 w-16 rounded-full" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center overflow-hidden rounded-xl border bg-muted/40 p-3">
          <Skeleton className="size-44 shrink-0 rounded-full bg-muted-foreground/15" />
        </div>
      </CardContent>
      <CardContent className="flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5">
          <Skeleton className="size-3.5 shrink-0 rounded-sm bg-muted-foreground/15" />
          <Skeleton className="h-3 w-40 rounded-md bg-muted-foreground/15" />
          <Skeleton className="ms-auto h-3 w-7 shrink-0 rounded-md bg-muted-foreground/15" />
        </div>
        <div className="flex w-full items-center gap-px">
          {states.map((state) => (
            <Skeleton
              key={state}
              className="h-7 flex-1 rounded-lg bg-muted-foreground/15"
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <Skeleton className="h-7 w-24 rounded-xl" />
        <div className="flex shrink-0 items-center gap-1">
          <Skeleton className="size-7 rounded-xl" />
          <Skeleton className="h-7 w-24 rounded-xl" />
        </div>
      </CardFooter>
    </Card>
  )
}
