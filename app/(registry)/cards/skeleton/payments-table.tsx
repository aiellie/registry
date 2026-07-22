import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const rows = [0, 1, 2, 3, 4]

export function PaymentsTable() {
  return (
    <Card>
      <CardHeader className="gap-2">
        <Skeleton className="h-6 w-28 rounded-md" />
        <Skeleton className="h-4 w-40 rounded-md" />
        <CardAction>
          <Skeleton className="h-8 w-28 rounded-lg" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col overflow-hidden rounded-md border">
          <div className="flex items-center gap-4 border-b bg-muted/50 px-3 py-3">
            <Skeleton className="size-4 rounded-sm" />
            <Skeleton className="h-4 w-16 rounded-md" />
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="ml-auto h-4 w-14 rounded-md" />
            <Skeleton className="h-4 w-6 rounded-md" />
          </div>
          {rows.map((row) => (
            <div
              key={row}
              className="flex items-center gap-4 border-b px-3 py-3 last:border-b-0"
            >
              <Skeleton className="size-4 rounded-sm" />
              <Skeleton className="h-4 w-16 rounded-md" />
              <Skeleton className="h-4 w-40 rounded-md" />
              <Skeleton className="ml-auto h-4 w-16 rounded-md" />
              <Skeleton className="size-8 rounded-md" />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-2">
          <Skeleton className="mr-auto h-4 w-40 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-16 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  )
}
