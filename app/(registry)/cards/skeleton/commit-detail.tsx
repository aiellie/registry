import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CommitDetail() {
  return (
    <Card>
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-32 rounded-md" />
        <Skeleton className="h-4 w-40 rounded-md" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 rounded-lg border p-3">
          <div className="flex items-center gap-2.5">
            <Skeleton className="size-8 shrink-0 rounded-full" />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <Skeleton className="h-4 w-44 rounded-md" />
              <Skeleton className="h-3 w-28 rounded-md" />
            </div>
            <Skeleton className="size-7 shrink-0 rounded-md" />
          </div>
          <div className="flex flex-col gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="size-3.5 shrink-0 rounded-sm" />
                <Skeleton className="h-3 min-w-0 flex-1 rounded-md" />
                <Skeleton className="h-3 w-10 shrink-0 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
