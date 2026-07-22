import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const members = [0, 1, 2]

export function TeamMembers() {
  return (
    <Card className="gap-4">
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-32 rounded-md" />
        <Skeleton className="h-4 w-56 rounded-md" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          {members.map((member) => (
            <div key={member} className="flex items-center gap-2 py-2">
              <Skeleton className="size-8 rounded-full" />
              <div className="flex flex-1 flex-col gap-1.5">
                <Skeleton className="h-3 w-28 rounded-md" />
                <Skeleton className="h-3 w-36 rounded-md" />
              </div>
              <Skeleton className="h-8 w-28 rounded-lg" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
