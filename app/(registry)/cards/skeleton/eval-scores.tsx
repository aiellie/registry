import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const rows = [72, 68, 68, 116, 96]

export function EvalScores() {
  return (
    <Card>
      <CardHeader className="gap-2.5">
        <Skeleton className="h-5 w-24 rounded-md" />
        <Skeleton className="h-4 w-44 rounded-md" />
        <CardAction>
          <Skeleton className="size-7 rounded-xl" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Skeleton className="size-16 shrink-0 rounded-full" />
          <div className="flex flex-1 flex-col gap-1">
            <Skeleton className="h-4 w-16 rounded-md" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-12 rounded-full" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-px w-full rounded-none" />
        <div className="flex flex-col gap-3">
          {rows.map((width, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-4 rounded-md" style={{ width }} />
                <Skeleton className="h-4 w-16 rounded-md" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-8 w-full rounded-lg" />
      </CardFooter>
    </Card>
  )
}
