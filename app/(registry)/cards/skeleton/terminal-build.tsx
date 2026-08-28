import { cn } from "@/lib/utils"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const lines = ["w-32", "w-24", "w-40", "w-36", "w-36", "w-40", "w-36", "w-28"]

const stats = ["w-8", "w-12", "w-14"]

export function TerminalBuild() {
  return (
    <Card size="sm">
      <CardHeader>
        <Skeleton className="h-5 w-32 rounded-md" />
        <Skeleton className="h-5 w-28 rounded-md" />
        <CardAction>
          <Skeleton className="h-5 w-16 rounded-4xl" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-xl border bg-muted/40">
          <div className="flex items-center justify-between border-b px-3 py-1.5">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="size-6 rounded-md" />
          </div>
          <div className="flex h-44 flex-col gap-2.5 p-3">
            {lines.map((width, index) => (
              <Skeleton className={cn("h-2.5 rounded-sm", width)} key={index} />
            ))}
          </div>
        </div>
      </CardContent>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {stats.map((width, index) => (
            <div className="rounded-lg bg-muted/60 px-2.5 py-2" key={index}>
              <Skeleton className="h-3 w-10 rounded-sm bg-muted-foreground/15" />
              <Skeleton
                className={cn(
                  "mt-1 h-5 rounded-sm bg-muted-foreground/15",
                  width
                )}
              />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Skeleton className="size-3.5 shrink-0 rounded-full" />
        <Skeleton className="h-4 w-24 rounded-sm" />
        <Skeleton className="ms-auto size-3.5 shrink-0 rounded-full" />
        <Skeleton className="h-4 w-10 rounded-sm" />
      </CardFooter>
    </Card>
  )
}
