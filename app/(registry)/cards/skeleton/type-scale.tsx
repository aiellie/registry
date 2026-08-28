import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const specimens = [
  { row: "h-9", bar: "h-6 w-28" },
  { row: "h-7", bar: "h-5 w-36" },
  { row: "h-5", bar: "h-3.5 w-44" },
  { row: "h-5", bar: "h-3 w-40" },
  { row: "h-5", bar: "h-3 w-32" },
]

export function TypeScale() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-[22px] w-28 rounded-md" />
          <Skeleton className="h-5 w-36 rounded-md" />
        </div>
        <Skeleton className="h-5 w-16 shrink-0 rounded-full" />
      </CardHeader>
      <CardContent className="flex flex-col">
        {specimens.map((specimen, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-3 border-b border-dashed py-3 first:pt-0 last:border-b-0 last:pb-0"
          >
            <div className={cn("flex min-w-0 items-center", specimen.row)}>
              <Skeleton className={cn("rounded-md", specimen.bar)} />
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Skeleton className="h-3 w-12 rounded-sm" />
              <Skeleton className="h-3 w-9 rounded-sm" />
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-4 w-10 shrink-0 rounded-md" />
      </CardFooter>
    </Card>
  )
}
