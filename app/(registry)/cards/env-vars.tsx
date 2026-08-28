"use client"

import * as React from "react"
import {
  Copy01Icon,
  SquareLock02Icon,
  ViewIcon,
  ViewOffIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Badge } from "@/components/ui/badge"
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const MASK = "••••••••••••"

const variables = [
  {
    key: "DATABASE_URL",
    value: "postgres://neon.tech/registry",
    environment: "Production",
    badge: "secondary",
  },
  {
    key: "NEXT_PUBLIC_REGISTRY_URL",
    value: "https://registry.aiellie.dev",
    environment: "Production",
    badge: "secondary",
  },
  {
    key: "RESEND_API_KEY",
    value: "re_9f2c1a4e_8b7dQ2zXvT",
    environment: "Preview",
    badge: "outline",
  },
  {
    key: "STRIPE_WEBHOOK_SECRET",
    value: "whsec_4Kd91mQ2zXvTn8Lp",
    environment: "Development",
    badge: "accent",
  },
] as const

export function EnvVars() {
  const [revealed, setRevealed] = React.useState<string[]>([])

  function toggle(key: string) {
    setRevealed((previous) =>
      previous.includes(key)
        ? previous.filter((item) => item !== key)
        : [...previous, key]
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environment Variables</CardTitle>
        <CardDescription className="flex items-center gap-1.5">
          <HugeiconsIcon
            icon={SquareLock02Icon}
            strokeWidth={2}
            className="size-3.5 shrink-0"
          />
          Encrypted at rest
        </CardDescription>
        <CardAction>
          <Badge variant="outline" className="tabular-nums">
            4 keys
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {variables.map((variable) => {
          const isRevealed = revealed.includes(variable.key)

          return (
            <div
              key={variable.key}
              className="flex flex-col gap-1 rounded-lg border bg-muted/40 py-1.5 ps-2.5 pe-1"
            >
              <div className="flex items-center gap-2 pt-0.5">
                <span className="min-w-0 flex-1 truncate font-mono text-xs font-medium">
                  {variable.key}
                </span>
                <Badge variant={variable.badge} className="me-1 shrink-0">
                  {variable.environment}
                </Badge>
              </div>
              <div className="flex items-center gap-0.5">
                <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
                  {isRevealed ? variable.value : MASK}
                </span>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={
                          isRevealed
                            ? `Hide ${variable.key}`
                            : `Reveal ${variable.key}`
                        }
                        onClick={() => toggle(variable.key)}
                      />
                    }
                  >
                    <HugeiconsIcon
                      icon={isRevealed ? ViewOffIcon : ViewIcon}
                      strokeWidth={2}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    {isRevealed ? "Hide value" : "Reveal value"}
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`Copy ${variable.key}`}
                        onClick={() => {
                          void navigator.clipboard?.writeText(variable.value)
                        }}
                      />
                    }
                  >
                    <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} />
                  </TooltipTrigger>
                  <TooltipContent>Copy value</TooltipContent>
                </Tooltip>
              </div>
            </div>
          )
        })}
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <span className="truncate text-xs text-muted-foreground">
          Synced 4 minutes ago
        </span>
        <Button variant="outline" size="sm" className="shrink-0">
          Add Variable
        </Button>
      </CardFooter>
    </Card>
  )
}
