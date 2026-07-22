import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const messages = [
  { width: "w-40", align: "" },
  { width: "w-52", align: "ml-auto" },
  { width: "w-44", align: "" },
  { width: "w-24", align: "ml-auto" },
]

export function Chat() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-3 w-32 rounded-md" />
        </div>
        <Skeleton className="ml-auto size-8 rounded-full" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {messages.map((message, i) => (
          <Skeleton
            key={i}
            className={`h-9 max-w-[75%] rounded-lg ${message.width} ${message.align}`}
          />
        ))}
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-full rounded-lg" />
      </CardFooter>
    </Card>
  )
}
