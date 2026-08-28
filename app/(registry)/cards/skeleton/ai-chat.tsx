import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Mirrors the thread in ../ai-chat.tsx: assistant turns sit on the leading
// edge behind an avatar, the user's turn on the trailing edge without one.
const turns = [
  { role: "assistant", lines: ["w-full", "w-[82%]"] },
  { role: "user", lines: ["w-[70%]"] },
  { role: "assistant", lines: ["w-full", "w-[64%]"] },
] as const

export function AiChat() {
  return (
    <Card>
      <CardHeader className="gap-2">
        <div className="flex items-center gap-2">
          <Skeleton className="size-6 shrink-0 rounded-lg" />
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>
        <Skeleton className="h-4 w-44 rounded-md" />
        <CardAction>
          <Skeleton className="h-5 w-16 rounded-full" />
        </CardAction>
      </CardHeader>

      <CardContent className="px-0">
        <div className="flex h-56 flex-col gap-3 px-(--card-spacing) py-0.5">
          {turns.map((turn, index) =>
            turn.role === "user" ? (
              <div key={index} className="flex justify-end">
                <div className="flex w-[70%] flex-col gap-1.5 rounded-xl bg-muted p-2.5">
                  {turn.lines.map((width, line) => (
                    <Skeleton
                      key={line}
                      className={`h-3 ${width} rounded-md bg-muted-foreground/15`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div key={index} className="flex gap-2">
                <Skeleton className="size-6 min-w-6 shrink-0 rounded-full" />
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex flex-col gap-1.5 rounded-xl bg-muted p-2.5">
                    {turn.lines.map((width, line) => (
                      <Skeleton
                        key={line}
                        className={`h-3 ${width} rounded-md bg-muted-foreground/15`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1 ps-1">
                    <Skeleton className="me-auto h-3 w-20 rounded-md" />
                    <Skeleton className="size-6 rounded-lg" />
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex w-full flex-col gap-2 rounded-xl border p-2">
          <Skeleton className="h-11 w-full rounded-lg" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-7 w-28 rounded-lg" />
            <Skeleton className="size-7 rounded-lg" />
            <Skeleton className="ms-auto size-7 rounded-full" />
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
