import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const levels = [0, 1, 2, 3]
const pair = [0, 1]

export function ContrastChecker() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-[22px] w-36 rounded-md" />
          <Skeleton className="h-5 w-44 rounded-md" />
        </div>
        <Skeleton className="h-5 w-14 shrink-0 rounded-full" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-1 rounded-lg bg-muted p-4">
          <div className="flex h-8 items-center">
            <Skeleton className="h-6 w-40 rounded-md bg-muted-foreground/15" />
          </div>
          <div className="flex h-4 items-center">
            <Skeleton className="h-3 w-full rounded-sm bg-muted-foreground/15" />
          </div>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <Skeleton className="h-4 w-24 rounded-md" />
            <div className="flex h-8 items-center">
              <Skeleton className="h-7 w-24 rounded-md" />
            </div>
          </div>
          <Skeleton className="mb-1 h-3 w-16 shrink-0 rounded-sm" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {levels.map((index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-2 rounded-lg border px-2.5 py-2"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <Skeleton className="h-3 w-6 rounded-sm" />
                <Skeleton className="h-2.5 w-16 rounded-sm" />
              </div>
              <Skeleton className="size-5 shrink-0 rounded-full" />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-lg border p-2">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            {pair.map((index) => (
              <div key={index} className="flex h-5 items-center gap-2">
                <Skeleton className="size-4 shrink-0 rounded-[5px]" />
                <Skeleton className="h-2.5 w-5 shrink-0 rounded-sm" />
                <Skeleton className="h-3 w-32 rounded-sm" />
              </div>
            ))}
          </div>
          <Skeleton className="size-7 shrink-0 rounded-lg" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-8 w-full rounded-lg" />
      </CardFooter>
    </Card>
  )
}
