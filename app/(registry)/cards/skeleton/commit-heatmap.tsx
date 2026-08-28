import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const cells = Array.from({ length: 119 }, (_, index) => index)
const legend = [0, 1, 2, 3, 4]

export function CommitHeatmap() {
  return (
    <Card>
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-40 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-md" />
        <CardAction>
          <Skeleton className="h-5 w-24 rounded-full" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="grid grid-cols-[repeat(17,minmax(0,1fr))] gap-[3px]">
          <Skeleton className="col-span-2 h-2.5 rounded-sm" />
          <span className="col-span-2" />
          <Skeleton className="col-span-2 h-2.5 rounded-sm" />
          <span className="col-span-2" />
          <Skeleton className="col-span-2 h-2.5 rounded-sm" />
          <span className="col-span-3" />
          <Skeleton className="col-span-2 h-2.5 rounded-sm" />
          <span className="col-span-2" />
        </div>
        <div className="grid grid-flow-col grid-cols-[repeat(17,minmax(0,1fr))] grid-rows-7 gap-[3px]">
          {cells.map((cell) => (
            <Skeleton
              key={cell}
              className="aspect-square w-full rounded-[3px]"
            />
          ))}
        </div>
        <div className="flex items-center justify-end gap-1.5 pt-0.5">
          <Skeleton className="h-4 w-8 rounded-md" />
          <div className="flex items-center gap-[3px]">
            {legend.map((step) => (
              <Skeleton key={step} className="size-2.5 rounded-[3px]" />
            ))}
          </div>
          <Skeleton className="h-4 w-8 rounded-md" />
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3 w-24 rounded-md" />
          <Skeleton className="h-4 w-16 rounded-md" />
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <Skeleton className="h-3 w-20 rounded-md" />
          <Skeleton className="h-4 w-20 rounded-md" />
        </div>
      </CardFooter>
    </Card>
  )
}
