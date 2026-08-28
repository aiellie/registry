import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function StackTraceCard() {
  return (
    <Card>
      <CardHeader className="gap-2.5">
        <Skeleton className="h-5 w-28 rounded-md" />
        <Skeleton className="h-4 w-32 rounded-md" />
        <CardAction>
          <Skeleton className="h-5 w-16 rounded-full" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 min-w-0 flex-1 rounded-md" />
            <Skeleton className="size-6 shrink-0 rounded-md" />
          </div>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-3 w-full rounded-md" />
          ))}
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Skeleton className="h-3 min-w-0 flex-1 rounded-md" />
        <Skeleton className="h-8 w-20 shrink-0 rounded-lg" />
      </CardFooter>
    </Card>
  )
}
