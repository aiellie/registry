import { cn } from "@/lib/utils"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const rows = [
  { id: "component", width: "w-40" },
  { id: "dependency", width: "w-28" },
  { id: "tokens", width: "w-32" },
]

export function InstallCommand() {
  return (
    <Card>
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-32 rounded-md" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-24 rounded-md" />
        </div>
        <CardAction>
          <Skeleton className="h-7 w-28 rounded-[10px]" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-2.5">
        <Skeleton className="h-8 w-full rounded-lg" />
        <div className="flex items-center gap-2 rounded-lg border bg-muted/60 py-1 ps-2.5 pe-1">
          <Skeleton className="h-3 w-2 rounded-sm" />
          <Skeleton className="my-2 h-3 flex-1 rounded-md" />
          <Skeleton className="size-7 shrink-0 rounded-xl" />
        </div>
      </CardContent>
      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-4 w-32 rounded-md" />
        <div className="flex flex-col gap-1.5">
          {rows.map((row) => (
            <div
              key={row.id}
              className="flex items-center gap-2.5 rounded-lg bg-muted/50 px-2.5 py-2"
            >
              <Skeleton className="size-4 shrink-0 rounded-sm bg-muted-foreground/15" />
              <Skeleton
                className={cn(
                  "h-3 rounded-md bg-muted-foreground/15",
                  row.width
                )}
              />
              <Skeleton className="ms-auto h-3 w-16 shrink-0 rounded-md bg-muted-foreground/15" />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <Skeleton className="h-4 w-32 rounded-md" />
        <Skeleton className="h-4 w-14 rounded-md" />
      </CardFooter>
    </Card>
  )
}
