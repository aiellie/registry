import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function AgentRoster() {
  return (
    <Card>
      <CardHeader className="gap-2.5">
        <Skeleton className="h-5 w-36 rounded-md" />
        <Skeleton className="h-4 w-40 rounded-md" />
        <CardAction>
          <Skeleton className="size-8 rounded-lg" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-2 rounded-lg px-2.5 py-2">
            <div className="flex items-center gap-2.5">
              <Skeleton className="size-7 shrink-0 rounded-full" />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Skeleton className="h-3.5 w-24 rounded-md" />
                <Skeleton className="h-2.5 w-32 rounded-md" />
              </div>
              <Skeleton className="h-5 w-6 shrink-0 rounded-full" />
            </div>
            {i === 0 ? (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-3 w-full rounded-md" />
                <div className="flex gap-1">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Skeleton className="h-3 w-56 rounded-md" />
      </CardFooter>
    </Card>
  )
}
