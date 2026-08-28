"use client"

import * as React from "react"

import { Icons } from "@/components/icons/icons"
import {
  type ChangeType,
  PackageInfo,
  PackageInfoActions,
  PackageInfoContent,
  PackageInfoCopyButton,
  PackageInfoDependencies,
  PackageInfoDependency,
  PackageInfoDescription,
  PackageInfoExpandButton,
  PackageInfoHeader,
  PackageInfoIcon,
  PackageInfoInfo,
  PackageInfoName,
  PackageInfoVersion,
} from "@/components/code/package-info"
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

const PACKAGES = [
  {
    changeType: "major" as ChangeType,
    command: "pnpm add next@16.0.1",
    currentVersion: "15.5.4",
    newVersion: "16.0.1",
    name: "next",
    icon: <Icons.nextjs />,
    description:
      "Turbopack is now the default bundler, so the dev server no longer reads webpack config.",
    dependencies: [
      { name: "react", version: "^19.2.0" },
      { name: "react-dom", version: "^19.2.0" },
    ],
  },
  {
    changeType: "minor" as ChangeType,
    command: "pnpm add tailwindcss@4.2.0",
    currentVersion: "4.1.11",
    newVersion: "4.2.0",
    name: "tailwindcss",
    icon: <Icons.tailwind />,
  },
  {
    changeType: "patch" as ChangeType,
    command: "pnpm add @base-ui/react@1.0.3",
    currentVersion: "1.0.2",
    newVersion: "1.0.3",
    name: "@base-ui/react",
    icon: <Icons.baseui />,
  },
]

type Filter = "all" | "major" | "minor" | "patch"

const FILTERS: Filter[] = ["all", "major", "minor", "patch"]

export function PackageUpdates() {
  const [filter, setFilter] = React.useState<Filter>("all")

  const visible = PACKAGES.filter(
    (pkg) => filter === "all" || pkg.changeType === filter
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dependency Updates</CardTitle>
        <CardDescription>3 of 148 packages behind</CardDescription>
        <CardAction>
          <Badge variant="secondary" className="font-mono">
            pnpm
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <ToggleGroup
          value={[filter]}
          onValueChange={(value) => {
            const next = (value as string[])[0]
            if (next) setFilter(next as Filter)
          }}
          className="w-full"
        >
          {FILTERS.map((key) => (
            <ToggleGroupItem
              key={key}
              value={key}
              className="flex-1 text-xs capitalize"
            >
              {key}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <div className="flex flex-col gap-2">
          {visible.map((pkg, index) => (
            <PackageInfo
              key={pkg.name}
              changeType={pkg.changeType}
              currentVersion={pkg.currentVersion}
              newVersion={pkg.newVersion}
              name={pkg.name}
              // Only cards with something to reveal expand.
              defaultOpen={index === 0 && Boolean(pkg.dependencies)}
              disabled={!pkg.dependencies}
            >
              <PackageInfoHeader>
                <PackageInfoIcon>{pkg.icon}</PackageInfoIcon>
                <PackageInfoInfo>
                  <PackageInfoName />
                  <PackageInfoVersion />
                  {pkg.description ? (
                    <PackageInfoDescription>
                      {pkg.description}
                    </PackageInfoDescription>
                  ) : null}
                </PackageInfoInfo>
                <PackageInfoActions>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <PackageInfoCopyButton
                          command={pkg.command}
                          onCopy={() =>
                            toast.add({
                              title: `Copied “${pkg.command}”`,
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
                    <TooltipContent>Copy install command</TooltipContent>
                  </Tooltip>
                  {pkg.dependencies ? <PackageInfoExpandButton /> : null}
                </PackageInfoActions>
              </PackageInfoHeader>
              {pkg.dependencies ? (
                <PackageInfoContent>
                  <PackageInfoDependencies>
                    {pkg.dependencies.map((dependency) => (
                      <PackageInfoDependency
                        key={dependency.name}
                        name={dependency.name}
                        version={dependency.version}
                      />
                    ))}
                  </PackageInfoDependencies>
                </PackageInfoContent>
              ) : null}
            </PackageInfo>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <span className="truncate text-xs text-muted-foreground tabular-nums">
          {visible.length} shown · 1 major needs review
        </span>
      </CardFooter>
    </Card>
  )
}
