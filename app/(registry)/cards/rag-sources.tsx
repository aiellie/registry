"use client"

import * as React from "react"
import { Copy01Icon, File01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/components/ui/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const CHUNKS = [
  {
    path: "src/auth/refresh-token.ts",
    score: 0.94,
    snippet: "Rotates the grant and revokes the previous refresh token.",
    body: [
      "export async function rotate(grant: Grant) {",
      "  const next = await issue(grant.subject)",
      "  await revoke(grant.refreshToken)",
      "  return next",
      "}",
    ],
  },
  {
    path: "docs/architecture/sessions.mdx",
    score: 0.89,
    snippet: "Sessions are keyed by device id and expire after 30 days.",
    body: [
      "Every session is keyed by `deviceId`, not by user, so signing out",
      "of one device leaves the others untouched. Idle sessions expire",
      "after 30 days; an active refresh extends the window.",
    ],
  },
  {
    path: "src/auth/middleware.ts",
    score: 0.81,
    snippet: "Replays the original request once after a silent refresh.",
    body: [
      "if (response.status === 401 && !request.retried) {",
      "  await refreshSilently()",
      "  return replay({ ...request, retried: true })",
      "}",
    ],
  },
  {
    path: "packages/sdk/src/client.ts",
    score: 0.76,
    snippet: "Surfaces the 401 to the caller when the retry also fails.",
    body: [
      "// A second 401 means the refresh token itself is dead —",
      "// bubble it up so the app can send the user to sign-in.",
      "throw new UnauthorizedError(response)",
    ],
  },
]

const TOTAL_CHUNKS = 128

export function RagSources() {
  const [threshold, setThreshold] = React.useState(0.7)
  const [expanded, setExpanded] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState<string | null>(null)
  const { copyToClipboard } = useCopyToClipboard()

  const visible = CHUNKS.filter((chunk) => chunk.score >= threshold)

  const copyPath = async (path: string) => {
    const ok = await copyToClipboard(path)
    setCopied(ok ? path : null)
    toast.add({
      title: ok ? "Source path copied" : "Couldn't reach the clipboard",
      type: ok ? "success" : "error",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Retrieved Context</CardTitle>
        <CardDescription className="line-clamp-2">
          &ldquo;How does the refresh token rotate after a 401?&rdquo;
        </CardDescription>
        <CardAction>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="bg-muted"
                  aria-label="Copy every retrieved path"
                  onClick={() =>
                    void copyPath(visible.map((c) => c.path).join("\n"))
                  }
                />
              }
            >
              <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} />
            </TooltipTrigger>
            <TooltipContent>Copy all paths</TooltipContent>
          </Tooltip>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="shrink-0 text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Min score
          </span>
          <Slider
            value={[threshold]}
            min={0.5}
            max={0.95}
            step={0.01}
            aria-label="Minimum relevance score"
            onValueChange={(value) => setThreshold((value as number[])[0])}
            className="min-w-0 flex-1"
          />
          <span className="w-8 shrink-0 text-end font-mono text-xs tabular-nums">
            {threshold.toFixed(2)}
          </span>
        </div>

        {visible.length > 0 ? (
          <div className="flex flex-col gap-2">
            {visible.map((chunk) => (
              <Collapsible
                key={chunk.path}
                open={expanded === chunk.path}
                onOpenChange={(open) => setExpanded(open ? chunk.path : null)}
              >
                <div className="flex flex-col gap-1.5 rounded-lg bg-muted/50 px-2.5 py-2">
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={File01Icon}
                      strokeWidth={2}
                      className="size-3.5 shrink-0 text-muted-foreground"
                    />
                    <CollapsibleTrigger
                      render={
                        <button
                          type="button"
                          className="min-w-0 flex-1 cursor-pointer truncate text-start font-mono text-[11px] outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                          aria-label={`Toggle ${chunk.path} snippet`}
                        />
                      }
                    >
                      {chunk.path}
                    </CollapsibleTrigger>
                    <span
                      className={cn(
                        "shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[10px] font-medium tabular-nums",
                        chunk.score >= 0.85
                          ? "bg-success/10 text-success"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {chunk.score.toFixed(2)}
                    </span>
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            aria-label={`Copy ${chunk.path}`}
                            onClick={() => void copyPath(chunk.path)}
                          />
                        }
                      >
                        <HugeiconsIcon
                          icon={copied === chunk.path ? Tick02Icon : Copy01Icon}
                          strokeWidth={2}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        {copied === chunk.path ? "Copied" : "Copy path"}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {chunk.snippet}
                  </p>
                  <CollapsibleContent>
                    <pre className="mt-1 max-h-28 overflow-auto rounded-md bg-background/60 p-2 font-mono text-[0.7rem] leading-relaxed text-muted-foreground">
                      {chunk.body.join("\n")}
                    </pre>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        ) : (
          <Empty className="rounded-lg bg-muted/40 py-6">
            <EmptyTitle className="text-sm">
              Nothing above {threshold.toFixed(2)}
            </EmptyTitle>
            <EmptyDescription className="text-xs">
              Lower the minimum score to bring chunks back.
            </EmptyDescription>
          </Empty>
        )}
      </CardContent>

      <CardFooter>
        <span className="truncate text-xs text-muted-foreground tabular-nums">
          {visible.length} of {TOTAL_CHUNKS} chunks · reranked
        </span>
      </CardFooter>
    </Card>
  )
}
