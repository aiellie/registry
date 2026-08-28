import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function PackageUpdates() {
  return (
    <Card>
      <CardHeader className="gap-2.5">
        <Skeleton className="h-5 w-40 rounded-md" />
        <Skeleton className="h-4 w-36 rounded-md" />
        <CardAction>
          <Skeleton className="h-5 w-12 rounded-full" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Skeleton className="h-8 w-full rounded-lg" />
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 rounded-lg border p-2.5"
          >
            <Skeleton className="size-8 shrink-0 rounded-md" />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <Skeleton className="h-3.5 w-24 rounded-md" />
              <Skeleton className="h-3 w-32 rounded-md" />
            </div>
            <Skeleton className="size-7 shrink-0 rounded-md" />
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Skeleton className="h-3 w-44 rounded-md" />
      </CardFooter>
    </Card>
  )
}
