"use client"

import * as React from "react"

import {
  Snippet,
  SnippetAddon,
  SnippetCopyButton,
  SnippetInput,
  SnippetText,
} from "@/components/code/snippet"
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { toast } from "@/components/ui/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type Manager = "pnpm" | "npm" | "bun"

const MANAGERS: Manager[] = ["pnpm", "npm", "bun"]

const RUNNERS: Record<Manager, string> = {
  pnpm: "pnpm dlx",
  npm: "npx",
  bun: "bunx",
}

const STEPS = [
  { label: "Add the item", suffix: "shadcn@latest add @aiellie/snippet" },
  { label: "Rebuild the registry", suffix: "shadcn build" },
]

export function CliSnippet() {
  const [manager, setManager] = React.useState<Manager>("pnpm")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a Component</CardTitle>
        <CardDescription>Copy-paste, from any package manager</CardDescription>
        <CardAction>
          <Badge variant="secondary" className="font-mono">
            @aiellie
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <ToggleGroup
          value={[manager]}
          onValueChange={(value) => {
            const next = (value as string[])[0]
            if (next) setManager(next as Manager)
          }}
          className="w-full"
        >
          {MANAGERS.map((key) => (
            <ToggleGroupItem key={key} value={key} className="flex-1 text-xs">
              {key}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        {STEPS.map((step) => {
          const code = `${RUNNERS[manager]} ${step.suffix}`
          return (
            <div key={step.label} className="flex flex-col gap-1.5">
              <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                {step.label}
              </span>
              <Snippet code={code}>
                <SnippetAddon>
                  <SnippetText>$</SnippetText>
                </SnippetAddon>
                <SnippetInput />
                <SnippetAddon align="inline-end">
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <SnippetCopyButton
                          onCopy={() =>
                            toast.add({
                              title: "Command copied",
                              type: "success",
                            })
                          }
                          onError={() =>
                            toast.add({
                              title: "Couldn't reach the clipboard",
                              type: "error",
                            })
                          }
                        />
                      }
                    />
                    <TooltipContent>Copy command</TooltipContent>
                  </Tooltip>
                </SnippetAddon>
              </Snippet>
            </div>
          )
        })}
      </CardContent>

      <CardFooter>
        <span className="truncate text-xs text-muted-foreground">
          Installs to <span className="font-mono">components/ui</span>
        </span>
      </CardFooter>
    </Card>
  )
}
