import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const people = [0, 1, 2, 3]

export function Share() {
  return (
    <Card>
      <CardHeader className="gap-1">
        <Skeleton className="h-[22px] w-40 rounded-md" />
        <Skeleton className="h-5 w-56 rounded-md" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 flex-1 rounded-lg" />
          <Skeleton className="h-7 w-20 rounded-lg" />
        </div>
        <Skeleton className="my-4 h-px w-full rounded-none" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-5 w-36 rounded-md" />
          <div className="flex flex-col gap-2.5">
            {people.map((person) => (
              <div
                key={person}
                className="flex items-center gap-2.5 border border-transparent py-2"
              >
                <Skeleton className="size-8 rounded-full" />
                <div className="flex flex-1 flex-col gap-1">
                  <Skeleton className="h-5 w-28 rounded-md" />
                  <Skeleton className="h-5 w-36 rounded-md" />
                </div>
                <Skeleton className="h-7 w-24 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
