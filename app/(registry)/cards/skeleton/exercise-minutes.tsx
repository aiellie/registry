import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const labels = [0, 1, 2, 3, 4, 5, 6]

export function ExerciseMinutes() {
  return (
    <Card>
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-36 rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-40 rounded-md" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Skeleton className="h-[180px] w-full rounded-lg" />
        <div className="flex justify-between px-4">
          {labels.map((label) => (
            <Skeleton key={label} className="h-3 w-6 rounded-md" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
