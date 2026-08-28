import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SecretsVault() {
  return (
    <Card>
      <CardHeader className="gap-2.5">
        <Skeleton className="h-5 w-32 rounded-md" />
        <Skeleton className="h-4 w-28 rounded-md" />
        <CardAction>
          <Skeleton className="h-5 w-8 rounded-full" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Skeleton className="h-8 w-full rounded-lg" />
        <div className="flex flex-col gap-2 rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 min-w-0 flex-1 rounded-md" />
            <Skeleton className="size-6 shrink-0 rounded-md" />
            <Skeleton className="size-6 shrink-0 rounded-md" />
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-32 shrink-0 rounded-md" />
              <Skeleton className="h-3.5 min-w-0 flex-1 rounded-md" />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-3 w-48 rounded-md" />
      </CardFooter>
    </Card>
  )
}
