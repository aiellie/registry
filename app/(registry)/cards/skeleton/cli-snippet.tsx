import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CliSnippet() {
  return (
    <Card>
      <CardHeader className="gap-2.5">
        <Skeleton className="h-5 w-36 rounded-md" />
        <Skeleton className="h-4 w-48 rounded-md" />
        <CardAction>
          <Skeleton className="h-5 w-16 rounded-full" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Skeleton className="h-8 w-full rounded-lg" />
        {[0, 1].map((i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <Skeleton className="h-2.5 w-24 rounded-md" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Skeleton className="h-3 w-40 rounded-md" />
      </CardFooter>
    </Card>
  )
}
