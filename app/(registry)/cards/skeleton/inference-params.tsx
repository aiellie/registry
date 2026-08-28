import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const sliders = [88, 52]
const toggles = [128, 96]

export function InferenceParams() {
  return (
    <Card>
      <CardHeader className="gap-2.5">
        <Skeleton className="h-5 w-24 rounded-md" />
        <Skeleton className="h-4 w-48 rounded-md" />
        <CardAction>
          <Skeleton className="size-7 rounded-xl" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {sliders.map((width, i) => (
          <div key={i} className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-4 rounded-md" style={{ width }} />
              <Skeleton className="h-5 w-12 rounded-md" />
            </div>
            <div className="flex h-3 items-center">
              <Skeleton className="h-1 w-full rounded-full" />
            </div>
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-4 w-14 rounded-md" />
              <Skeleton className="h-4 w-16 rounded-md" />
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between gap-3 rounded-lg bg-muted/50 px-3 py-2.5">
          <div className="flex flex-col gap-0.5">
            <Skeleton className="h-5 w-24 rounded-md bg-muted-foreground/15" />
            <Skeleton className="h-4 w-32 rounded-md bg-muted-foreground/15" />
          </div>
          <Skeleton className="h-5 w-12 rounded-md bg-muted-foreground/15" />
        </div>
        <Skeleton className="h-px w-full rounded-none" />
        <div className="flex flex-col gap-4">
          {toggles.map((width, i) => (
            <div key={i} className="flex items-center justify-between gap-3">
              <div className="flex flex-col gap-0.5">
                <Skeleton className="h-3.5 w-28 rounded-md" />
                <Skeleton className="h-4 rounded-md" style={{ width }} />
              </div>
              <Skeleton className="h-5 w-8 shrink-0 rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <Skeleton className="h-4 w-36 rounded-md" />
        <Skeleton className="h-7 w-24 rounded-lg" />
      </CardFooter>
    </Card>
  )
}
