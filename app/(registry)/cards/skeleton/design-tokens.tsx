import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const semantic = [0, 1, 2, 3, 4]
const neutrals = [0, 1, 2]

export function DesignTokens() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-[22px] w-32 rounded-md" />
          <Skeleton className="h-5 w-40 rounded-md" />
        </div>
        <Skeleton className="size-7 shrink-0 rounded-lg" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-20 rounded-md" />
          <div className="grid grid-cols-5 gap-1.5">
            {semantic.map((index) => (
              <div key={index} className="flex min-w-0 flex-col gap-1.5">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="mx-auto h-2.5 w-3/4 rounded-sm" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-3 w-12 rounded-md" />
          </div>
          <Skeleton className="h-8 w-full rounded-lg" />
        </div>
        <div className="flex flex-col gap-1">
          {neutrals.map((index) => (
            <div
              key={index}
              className="flex items-center gap-2.5 rounded-lg bg-muted/50 px-2.5 py-2"
            >
              <Skeleton className="size-5 shrink-0 rounded-md bg-muted-foreground/15" />
              <Skeleton className="h-4 w-24 rounded-md bg-muted-foreground/15" />
              <Skeleton className="ms-auto h-3 w-14 rounded-md bg-muted-foreground/15" />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <Skeleton className="h-4 w-40 rounded-md" />
        <Skeleton className="h-5 w-14 shrink-0 rounded-full" />
      </CardFooter>
    </Card>
  )
}
