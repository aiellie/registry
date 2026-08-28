import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ReasoningTrace() {
  return (
    <Card>
      <CardHeader className="gap-2.5">
        <Skeleton className="h-5 w-24 rounded-md" />
        <Skeleton className="h-4 w-24 rounded-md" />
        <CardAction>
          <Skeleton className="size-7 rounded-md" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Skeleton className="h-5 w-32 rounded-md" />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-2.5">
            <Skeleton className="mt-0.5 size-4 shrink-0 rounded-full" />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <Skeleton className="h-3.5 w-full rounded-md" />
              {i === 0 ? <Skeleton className="h-3 w-2/3 rounded-md" /> : null}
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Skeleton className="h-3 w-52 rounded-md" />
      </CardFooter>
    </Card>
  )
}
