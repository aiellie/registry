import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const weekdays = [0, 1, 2, 3, 4, 5, 6]
const days = Array.from({ length: 35 }, (_, i) => i)

export function Calendar() {
  return (
    <Card className="hidden max-w-[260px] p-0 sm:flex">
      <CardContent className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="size-7 rounded-md" />
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="size-7 rounded-md" />
        </div>
        <div className="grid grid-cols-7 gap-1">
          {weekdays.map((day) => (
            <Skeleton key={`w-${day}`} className="mx-auto h-3 w-6 rounded-md" />
          ))}
          {days.map((day) => (
            <Skeleton key={`d-${day}`} className="mx-auto size-7 rounded-md" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
