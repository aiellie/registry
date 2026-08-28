import { cn } from "@/lib/utils"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const checks = [
  { id: "build", width: "w-28" },
  { id: "types", width: "w-32" },
  { id: "e2e", width: "w-36" },
]

export function PullRequest() {
  return (
    <Card>
      <CardHeader className="gap-2">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-32 rounded-md" />
        </div>
        <Skeleton className="h-4 w-36 rounded-md" />
        <CardAction>
          <Skeleton className="h-5 w-16 rounded-full" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <Skeleton className="size-6 shrink-0 rounded-full" />
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <Skeleton className="h-3 w-24 rounded-md" />
            <Skeleton className="h-3 w-32 rounded-md" />
          </div>
          <div className="flex shrink-0 -space-x-2">
            <Skeleton className="size-6 rounded-full ring-2 ring-background" />
            <Skeleton className="size-6 rounded-full ring-2 ring-background" />
            <Skeleton className="size-6 rounded-full ring-2 ring-background" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-10 rounded-md" />
            <Skeleton className="h-4 w-8 rounded-md" />
            <Skeleton className="ms-auto h-4 w-24 rounded-md" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-full" />
        </div>
        <div className="flex flex-col gap-1.5">
          {checks.map((check) => (
            <div
              key={check.id}
              className="flex items-center gap-2.5 rounded-lg bg-muted/50 px-2.5 py-2"
            >
              <Skeleton className="size-4 shrink-0 rounded-full bg-muted-foreground/15" />
              <Skeleton
                className={cn(
                  "h-3 rounded-md bg-muted-foreground/15",
                  check.width
                )}
              />
              <Skeleton className="ms-auto h-3 w-12 shrink-0 rounded-md bg-muted-foreground/15" />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Skeleton className="h-8 flex-1 rounded-lg" />
        <Skeleton className="h-8 flex-1 rounded-lg" />
      </CardFooter>
    </Card>
  )
}
