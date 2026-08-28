import { cn } from "@/lib/utils"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const variables = [
  { id: "database-url", key: "w-28", badge: "w-16" },
  { id: "registry-url", key: "w-40", badge: "w-16" },
  { id: "resend-key", key: "w-32", badge: "w-14" },
  { id: "stripe-secret", key: "w-36", badge: "w-20" },
]

export function EnvVars() {
  return (
    <Card>
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-44 rounded-md" />
        <Skeleton className="h-4 w-32 rounded-md" />
        <CardAction>
          <Skeleton className="h-5 w-14 rounded-full" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {variables.map((variable) => (
          <div
            key={variable.id}
            className="flex flex-col gap-1 rounded-lg border bg-muted/40 py-1.5 ps-2.5 pe-1"
          >
            <div className="flex items-center gap-2 pt-0.5">
              <Skeleton
                className={cn(
                  "h-3 rounded-md bg-muted-foreground/15",
                  variable.key
                )}
              />
              <Skeleton
                className={cn(
                  "ms-auto me-1 h-5 shrink-0 rounded-full bg-muted-foreground/15",
                  variable.badge
                )}
              />
            </div>
            <div className="flex items-center gap-0.5">
              <Skeleton className="h-3 w-24 rounded-md bg-muted-foreground/15" />
              <Skeleton className="ms-auto size-6 shrink-0 rounded-lg bg-muted-foreground/15" />
              <Skeleton className="size-6 shrink-0 rounded-lg bg-muted-foreground/15" />
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <Skeleton className="h-3 w-32 rounded-md" />
        <Skeleton className="h-7 w-24 shrink-0 rounded-xl" />
      </CardFooter>
    </Card>
  )
}
