"use client"

import * as React from "react"
import {
  ArtificialIntelligence03Icon,
  CheckmarkBadge01Icon,
  PencilEdit02Icon,
  Telescope01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
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

const SUBAGENTS = [
  {
    name: "Scout",
    model: "claude-haiku-4-5",
    description:
      "Sweeps the web in parallel and returns a shortlist of promising URLs.",
    tools: ["search", "fetch_page"],
    icon: Telescope01Icon,
    tint: "bg-chart-1/10 text-chart-1",
  },
  {
    name: "Fact Checker",
    model: "claude-sonnet-5",
    description:
      "Re-reads each cited source and refutes any claim it cannot verify.",
    tools: ["fetch_page", "cite"],
    icon: CheckmarkBadge01Icon,
    tint: "bg-chart-2/10 text-chart-2",
  },
  {
    name: "Editor",
    model: "claude-opus-4-5",
    description:
      "Folds the verified findings into one answer and keeps the citations.",
    tools: ["cite"],
    icon: PencilEdit02Icon,
    tint: "bg-chart-4/10 text-chart-4",
  },
]

export function AgentRoster() {
  const [expanded, setExpanded] = React.useState<string | null>(
    SUBAGENTS[0].name
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Research Agent</CardTitle>
        <CardDescription className="truncate">
          Orchestrates {SUBAGENTS.length} subagents
        </CardDescription>
        <CardAction>
          <span
            aria-hidden
            className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary"
          >
            <HugeiconsIcon
              icon={ArtificialIntelligence03Icon}
              strokeWidth={2}
              className="size-4"
            />
          </span>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {SUBAGENTS.map((agent) => {
          const open = expanded === agent.name
          return (
            <Collapsible
              key={agent.name}
              open={open}
              onOpenChange={(next) => setExpanded(next ? agent.name : null)}
            >
              <div
                className={cn(
                  "flex flex-col gap-2 rounded-lg px-2.5 py-2 ring-1 transition-colors ring-inset",
                  open ? "bg-muted/60 ring-foreground/10" : "ring-transparent"
                )}
              >
                <CollapsibleTrigger
                  render={
                    <button
                      type="button"
                      className="flex w-full cursor-pointer items-center gap-2.5 rounded-md text-start outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                      aria-label={`Toggle ${agent.name} detail`}
                    />
                  }
                >
                  <span
                    aria-hidden
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full",
                      agent.tint
                    )}
                  >
                    <HugeiconsIcon
                      icon={agent.icon}
                      strokeWidth={2}
                      className="size-3.5"
                    />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-xs font-medium">
                      {agent.name}
                    </span>
                    <span className="truncate font-mono text-[10px] text-muted-foreground">
                      {agent.model}
                    </span>
                  </span>
                  <Badge variant="secondary" className="shrink-0 tabular-nums">
                    {agent.tools.length}
                  </Badge>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {agent.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {agent.tools.map((tool) => (
                      <Badge
                        key={tool}
                        variant="outline"
                        className="font-mono text-[10px]"
                      >
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          )
        })}
      </CardContent>

      <CardFooter>
        <span className="truncate text-xs text-muted-foreground">
          Fans out, verifies, then folds into one answer
        </span>
      </CardFooter>
    </Card>
  )
}
