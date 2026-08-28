import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ReportIssue() {
  return (
    <Card>
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-32 rounded-md" />
        <Skeleton className="h-4 w-56 rounded-md" />
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-12 rounded-md" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-24 rounded-md" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-16 rounded-md" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-20 rounded-md" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
        <div className="flex items-center justify-end gap-2">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  )
}
