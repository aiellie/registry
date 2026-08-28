import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const legend = [
  { label: 92, value: 40 },
  { label: 56, value: 48 },
  { label: 88, value: 48 },
  { label: 76, value: 40 },
]

export function ContextWindow() {
  return (
    <Card>
      <CardHeader className="gap-2.5">
        <Skeleton className="h-5 w-36 rounded-md" />
        <Skeleton className="h-4 w-44 rounded-md" />
        <CardAction>
          <Skeleton className="size-7 rounded-xl" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-4 w-20 rounded-md" />
          <Skeleton className="ms-auto h-5 w-10 rounded-full" />
        </div>
        <Skeleton className="h-2.5 w-full rounded-full" />
        <div className="grid grid-cols-2 gap-x-3 gap-y-3">
          {legend.map((item, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <Skeleton className="size-2 rounded-[3px]" />
                <Skeleton
                  className="h-4 rounded-md"
                  style={{ width: item.label }}
                />
              </div>
              <Skeleton
                className="ms-3.5 h-5 rounded-md"
                style={{ width: item.value }}
              />
            </div>
          ))}
        </div>
        <Skeleton className="h-4 w-52 rounded-md" />
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-7 w-28 rounded-lg" />
      </CardFooter>
    </Card>
  )
}
