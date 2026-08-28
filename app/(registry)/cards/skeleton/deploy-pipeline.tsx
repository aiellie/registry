import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const stages = ["build", "test", "preview", "production"]

export function DeployPipeline() {
  return (
    <Card>
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-36 rounded-md" />
        <Skeleton className="h-5 w-44 rounded-md" />
        <CardAction>
          <Skeleton className="h-5 w-12 rounded-full" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-start">
          {stages.map((stage, index) => (
            <div key={stage} className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex items-center">
                <Skeleton className="size-6 shrink-0 rounded-full" />
                {index < stages.length - 1 ? (
                  <Skeleton className="h-0.5 flex-1 rounded-full" />
                ) : null}
              </div>
              <div className="flex min-w-0 flex-col gap-1 pe-2">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-8 rounded-md" />
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/50 p-3">
          <div className="flex min-w-0 flex-col gap-1.5">
            <Skeleton className="h-3 w-16 rounded-md bg-muted-foreground/15" />
            <Skeleton className="h-3 w-full rounded-md bg-muted-foreground/15" />
          </div>
          <div className="flex min-w-0 flex-col gap-1.5">
            <Skeleton className="h-3 w-14 rounded-md bg-muted-foreground/15" />
            <Skeleton className="h-3 w-20 rounded-md bg-muted-foreground/15" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <Skeleton className="h-5 w-20 rounded-full" />
        <div className="flex shrink-0 items-center gap-2">
          <Skeleton className="h-3 w-12 rounded-md" />
          <Skeleton className="h-7 w-24 rounded-xl" />
        </div>
      </CardFooter>
    </Card>
  )
}
