import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const SEGMENTS = [38.6, 28.3, 18.1, 10.3, 4.7]
const CHUNKS = [0, 1, 2, 3]

export function BundleSize() {
  return (
    <Card>
      <CardHeader className="gap-1.5">
        <Skeleton className="h-5 w-28 rounded-md" />
        <Skeleton className="h-4 w-44 rounded-md" />
        <CardAction>
          <Skeleton className="size-7 rounded-lg" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-4 w-20 rounded-md" />
          <Skeleton className="ms-auto h-5 w-16 rounded-4xl" />
        </div>
        <div className="flex h-2.5 w-full gap-0.5">
          {SEGMENTS.map((share, index) => (
            <Skeleton
              key={index}
              className="h-full rounded-full"
              style={{ width: `${share}%` }}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2.5">
          {CHUNKS.map((index) => (
            <div key={index} className="flex items-center gap-2">
              <Skeleton className="size-2 shrink-0 rounded-full" />
              <Skeleton className="h-4 flex-1 rounded-md" />
              <Skeleton className="h-4 w-14 shrink-0 rounded-md" />
              <Skeleton className="h-4 w-12 shrink-0 rounded-md" />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-4 w-24 rounded-md" />
      </CardFooter>
    </Card>
  )
}
