import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function LoaderGallery() {
  return (
    <Card>
      <CardHeader className="gap-2.5">
        <Skeleton className="h-5 w-24 rounded-md" />
        <Skeleton className="h-4 w-44 rounded-md" />
        <CardAction>
          <Skeleton className="h-5 w-9 rounded-full" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }, (_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-3 w-36 rounded-md" />
      </CardFooter>
    </Card>
  )
}
