import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ArtifactPreview() {
  return (
    <Card>
      <CardHeader className="gap-2.5">
        <Skeleton className="h-5 w-40 rounded-md" />
        <Skeleton className="h-4 w-36 rounded-md" />
        <CardAction>
          <Skeleton className="h-8 w-28 rounded-lg" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 rounded-lg border">
          <div className="flex items-center gap-2 border-b p-2.5">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <Skeleton className="h-3.5 w-24 rounded-md" />
              <Skeleton className="h-3 w-32 rounded-md" />
            </div>
            <Skeleton className="size-7 shrink-0 rounded-md" />
            <Skeleton className="size-7 shrink-0 rounded-md" />
          </div>
          <div className="flex flex-col gap-1.5 p-2.5 pt-0">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-3 w-full rounded-md" />
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-3 w-44 rounded-md" />
      </CardFooter>
    </Card>
  )
}
