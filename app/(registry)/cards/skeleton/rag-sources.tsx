import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const chunks = [
  { path: 144, snippet: 208 },
  { path: 168, snippet: 192 },
  { path: 128, snippet: 216 },
  { path: 152, snippet: 200 },
]

export function RagSources() {
  return (
    <Card>
      <CardHeader className="gap-2.5">
        <Skeleton className="h-5 w-40 rounded-md" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-40 rounded-md" />
        </div>
        <CardAction>
          <Skeleton className="size-7 rounded-xl" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {chunks.map((chunk, i) => (
          <div
            key={i}
            className="flex flex-col gap-1.5 rounded-lg bg-muted/50 px-3 py-2.5"
          >
            <div className="flex items-center gap-2">
              <Skeleton className="size-3.5 shrink-0 rounded-sm bg-muted-foreground/15" />
              <Skeleton
                className="h-4 rounded-md bg-muted-foreground/15"
                style={{ width: chunk.path }}
              />
              <Skeleton className="ms-auto h-[18px] w-9 shrink-0 rounded-md bg-muted-foreground/15" />
            </div>
            <Skeleton
              className="h-4 max-w-full rounded-md bg-muted-foreground/15"
              style={{ width: chunk.snippet }}
            />
            <Skeleton className="h-1 w-full rounded-full bg-muted-foreground/15" />
          </div>
        ))}
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <Skeleton className="h-4 w-40 rounded-md" />
        <Skeleton className="h-4 w-10 rounded-md" />
      </CardFooter>
    </Card>
  )
}
