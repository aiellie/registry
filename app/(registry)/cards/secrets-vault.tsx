"use client"

import * as React from "react"

import {
  EnvironmentVariable,
  EnvironmentVariableCopyButton,
  EnvironmentVariableGroup,
  EnvironmentVariableName,
  EnvironmentVariableRequired,
  EnvironmentVariables,
  EnvironmentVariablesContent,
  EnvironmentVariablesDownloadButton,
  EnvironmentVariablesHeader,
  EnvironmentVariablesTitle,
  EnvironmentVariablesToggle,
  EnvironmentVariableValue,
} from "@/components/code/environment-variables"
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

type Env = "production" | "preview" | "development"

const VARIABLES: {
  name: string
  required: boolean
  value: string
  envs: Env[]
}[] = [
  {
    name: "DATABASE_URL",
    required: true,
    value: "postgresql://db.aiellie.dev:5432/registry",
    envs: ["production", "preview"],
  },
  {
    name: "REGISTRY_TOKEN",
    required: true,
    value: "reg_live_8f2c1a94d7e6",
    envs: ["production"],
  },
  {
    name: "NEXT_PUBLIC_SITE_URL",
    required: false,
    value: "https://registry.aiellie.dev",
    envs: ["production", "preview", "development"],
  },
  {
    name: "ANALYZE",
    required: false,
    value: "false",
    envs: ["development"],
  },
]

const ENVS: Env[] = ["production", "preview", "development"]

export function SecretsVault() {
  const [env, setEnv] = React.useState<Env>("production")

  const visible = VARIABLES.filter((variable) => variable.envs.includes(env))
  const requiredCount = visible.filter((v) => v.required).length

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environment</CardTitle>
        <CardDescription className="truncate font-mono text-xs">
          ui-aiellie-dev
        </CardDescription>
        <CardAction>
          <Badge variant="secondary" className="tabular-nums">
            {visible.length}
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <ToggleGroup
          value={[env]}
          onValueChange={(value) => {
            const next = (value as string[])[0]
            if (next) setEnv(next as Env)
          }}
          className="w-full"
        >
          {ENVS.map((key) => (
            <ToggleGroupItem
              key={key}
              value={key}
              className="flex-1 text-[11px] capitalize"
            >
              {key === "development" ? "Dev" : key}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <EnvironmentVariables defaultShowValues={false}>
          <EnvironmentVariablesHeader>
            <EnvironmentVariablesTitle />
            <EnvironmentVariableGroup className="shrink-0 gap-1">
              <EnvironmentVariablesToggle />
              <EnvironmentVariablesDownloadButton />
            </EnvironmentVariableGroup>
          </EnvironmentVariablesHeader>
          <EnvironmentVariablesContent>
            {visible.map((variable) => (
              <EnvironmentVariable
                key={variable.name}
                name={variable.name}
                value={variable.value}
              >
                <EnvironmentVariableGroup className="min-w-0">
                  <EnvironmentVariableName />
                  {variable.required ? <EnvironmentVariableRequired /> : null}
                </EnvironmentVariableGroup>
                <EnvironmentVariableGroup className="shrink-0">
                  <EnvironmentVariableValue />
                  <EnvironmentVariableCopyButton />
                </EnvironmentVariableGroup>
              </EnvironmentVariable>
            ))}
          </EnvironmentVariablesContent>
        </EnvironmentVariables>
      </CardContent>

      <CardFooter>
        <span className="truncate text-xs text-muted-foreground tabular-nums">
          {requiredCount} required · encrypted at rest
        </span>
      </CardFooter>
    </Card>
  )
}
