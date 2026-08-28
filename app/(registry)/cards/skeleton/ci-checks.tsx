import { cn } from "@/lib/utils"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const tiles = ["passed", "failed", "skipped"]

const suites = [
  { id: "components", width: "w-32" },
  { id: "hooks", width: "w-24" },
  { id: "registry", width: "w-28" },
  { id: "axe", width: "w-20" },
]

export function CiChecks() {
  return (
    <Card>
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-28 rounded-md" />
        <Skeleton className="h-4 w-40 rounded-md" />
        <CardAction>
          <Skeleton className="h-5 w-20 rounded-full" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-2">
          {tiles.map((tile) => (
            <div
              key={tile}
              className="flex flex-col gap-1.5 rounded-lg bg-muted/50 px-2.5 py-2"
            >
              <Skeleton className="h-5 w-10 rounded-md bg-muted-foreground/15" />
              <Skeleton className="h-4 w-14 rounded-md bg-muted-foreground/15" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {suites.map((suite) => (
            <div key={suite.id} className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Skeleton className="size-4 shrink-0 rounded-full" />
                <Skeleton className={cn("h-4 rounded-md", suite.width)} />
                <Skeleton className="ms-auto h-4 w-12 shrink-0 rounded-md" />
              </div>
              <div className="flex items-center gap-2 ps-6">
                <Skeleton className="h-1.5 min-w-0 flex-1 rounded-full" />
                <Skeleton className="h-4 w-12 shrink-0 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <Skeleton className="h-4 w-28 rounded-md" />
        <Skeleton className="h-7 w-28 shrink-0 rounded-xl" />
      </CardFooter>
    </Card>
  )
}
