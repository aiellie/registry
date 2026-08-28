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
  { indent: "ps-0", width: "w-14" },
  { indent: "ps-6", width: "w-20" },
  { indent: "ps-12", width: "w-24" },
  { indent: "ps-12", width: "w-20" },
  { indent: "ps-6", width: "w-16" },
  { indent: "ps-0", width: "w-24" },
  { indent: "ps-6", width: "w-12" },
  { indent: "ps-12", width: "w-20" },
]

export function FileExplorer() {
  return (
    <Card size="sm">
      <CardHeader>
        <Skeleton className="h-5 w-32 rounded-md" />
        <Skeleton className="h-5 w-40 rounded-md" />
        <CardAction>
          <Skeleton className="size-7 rounded-lg" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="h-56 overflow-hidden rounded-lg border bg-background p-2">
          {rows.map((row, index) => (
            <div
              className={cn("flex items-center gap-1.5 py-1", row.indent)}
              key={index}
            >
              <Skeleton className="size-4 shrink-0 rounded-sm" />
              <Skeleton className={cn("h-3 rounded-sm", row.width)} />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Skeleton className="size-3.5 shrink-0 rounded-sm" />
        <Skeleton className="h-3 w-36 rounded-sm" />
        <Skeleton className="ms-auto h-5 w-10 rounded-md" />
      </CardFooter>
    </Card>
  )
}
