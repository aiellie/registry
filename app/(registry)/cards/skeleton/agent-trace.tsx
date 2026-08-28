import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const steps = [
  { tool: 40, args: 112 },
  { tool: 40, args: 128 },
  { tool: 36, args: 104 },
  { tool: 40, args: 136 },
  { tool: 36, args: 120 },
]

export function AgentTrace() {
  return (
    <Card>
      <CardHeader className="gap-2.5">
        <Skeleton className="h-5 w-28 rounded-md" />
        <Skeleton className="h-4 w-36 rounded-md" />
        <CardAction>
          <Skeleton className="h-5 w-20 rounded-full" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-20 rounded-md" />
          <Skeleton className="h-4 w-16 rounded-md" />
        </div>
        <div className="flex flex-col gap-3.5">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="mt-1 size-2.5 shrink-0 rounded-full" />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-center justify-between gap-2">
                  <Skeleton
                    className="h-4 rounded-md"
                    style={{ width: step.tool }}
                  />
                  <Skeleton className="h-4 w-8 rounded-md" />
                </div>
                <Skeleton
                  className="h-4 rounded-md"
                  style={{ width: step.args }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <Skeleton className="h-4 w-28 rounded-md" />
        <Skeleton className="size-7 rounded-xl" />
      </CardFooter>
    </Card>
  )
}
