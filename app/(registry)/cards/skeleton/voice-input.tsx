import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function VoiceInput() {
  return (
    <Card size="sm">
      <CardHeader>
        <Skeleton className="h-5 w-28 rounded-md" />
        <Skeleton className="h-5 w-40 rounded-md" />
        <CardAction>
          <Skeleton className="h-5 w-20 rounded-4xl" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
          <Skeleton className="size-9 shrink-0 rounded-full bg-muted-foreground/15" />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <Skeleton className="h-9 w-full rounded-md bg-muted-foreground/15" />
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-4 w-8 shrink-0 rounded-sm bg-muted-foreground/15" />
              <Skeleton className="h-4 w-20 shrink-0 rounded-sm bg-muted-foreground/15" />
            </div>
          </div>
        </div>
      </CardContent>
      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-4 w-24 rounded-sm" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-5 w-full rounded-sm" />
          <Skeleton className="h-5 w-32 rounded-sm" />
        </div>
        <div className="flex items-center gap-1.5">
          <Skeleton className="size-3.5 shrink-0 rounded-full" />
          <Skeleton className="h-4 w-40 rounded-sm" />
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Skeleton className="h-7 flex-1 rounded-lg" />
        <Skeleton className="h-7 flex-1 rounded-lg" />
      </CardFooter>
    </Card>
  )
}
