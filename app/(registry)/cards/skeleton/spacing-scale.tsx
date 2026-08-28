import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const steps = [4, 8, 12, 16, 24, 32, 48]
const radii = [0, 1, 2, 3]

export function SpacingScale() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div className="flex flex-1 flex-col gap-1">
          <Skeleton className="h-[22px] w-40 rounded-md" />
          <div className="flex flex-col">
            <Skeleton className="h-5 w-full rounded-md" />
            <Skeleton className="h-5 w-32 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-5 w-20 shrink-0 rounded-full" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-3 w-12 rounded-md" />
          </div>
          <div className="flex flex-col gap-2.5 rounded-lg bg-muted/50 p-3">
            {steps.map((width) => (
              <div key={width} className="flex h-4 items-center gap-3">
                <Skeleton className="h-3 w-5 shrink-0 rounded-sm bg-muted-foreground/15" />
                <span className="flex min-w-0 flex-1 items-center">
                  <Skeleton
                    className="h-2.5 rounded-sm bg-muted-foreground/15"
                    style={{ width: `${width}px` }}
                  />
                </span>
                <Skeleton className="h-3 w-14 shrink-0 rounded-sm bg-muted-foreground/15" />
                <Skeleton className="h-3 w-8 shrink-0 rounded-sm bg-muted-foreground/15" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-4 w-16 rounded-md" />
            <Skeleton className="h-3 w-12 rounded-md" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {radii.map((index) => (
              <div key={index} className="flex min-w-0 flex-col gap-1.5">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="mx-auto h-2.5 w-6 rounded-sm" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <Skeleton className="h-4 w-16 rounded-md" />
        <Skeleton className="h-4 w-16 shrink-0 rounded-md" />
      </CardFooter>
    </Card>
  )
}
