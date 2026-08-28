import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ReleaseNotes() {
  return (
    <Card>
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-28 rounded-md" />
        <Skeleton className="h-4 w-48 rounded-md" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Skeleton className="h-7 w-full rounded-full" />
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-start gap-2">
              <Skeleton className="h-4 w-14 shrink-0 rounded-md" />
              <Skeleton className="h-4 min-w-0 flex-1 rounded-md" />
            </div>
          ))}
        </div>
        <Skeleton className="h-px w-full" />
        <div className="flex gap-1.5">
          <Skeleton className="h-1.5 flex-1 rounded-full" />
          <Skeleton className="h-1.5 flex-1 rounded-full" />
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <Skeleton className="size-7 rounded-md" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </CardFooter>
    </Card>
  )
}
