import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const categories = ["w-10", "w-16", "w-14", "w-12"]
const icons = Array.from({ length: 18 }, (_, index) => index)

export function IconGrid() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-[22px] w-28 rounded-md" />
          <Skeleton className="h-5 w-44 rounded-md" />
        </div>
        <Skeleton className="h-5 w-12 shrink-0 rounded-full" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Skeleton className="h-8 w-full rounded-lg" />
        <div className="flex items-center gap-1.5">
          {categories.map((width) => (
            <Skeleton key={width} className={cn("h-5 rounded-full", width)} />
          ))}
        </div>
        <div className="grid grid-cols-6 gap-1.5">
          {icons.map((index) => (
            <Skeleton key={index} className="aspect-square w-full rounded-lg" />
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <Skeleton className="h-4 w-40 rounded-md" />
        <Skeleton className="h-7 w-24 shrink-0 rounded-lg" />
      </CardFooter>
    </Card>
  )
}
