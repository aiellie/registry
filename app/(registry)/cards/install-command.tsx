"use client"

import * as React from "react"
import {
  Copy01Icon,
  PackageIcon,
  PaintBoardIcon,
  SourceCodeIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const managers = [
  { value: "pnpm", label: "pnpm", command: "pnpm dlx shadcn@latest add" },
  { value: "npm", label: "npm", command: "npx shadcn@latest add" },
  { value: "bun", label: "bun", command: "bunx --bun shadcn@latest add" },
]

const registryItems = [
  {
    value: "button",
    title: "Button",
    description: "Base UI primitive, styled base-nova.",
    version: "v2.4.1",
    size: "12.4 kB",
    files: [
      {
        icon: SourceCodeIcon,
        path: "components/ui/button.tsx",
        kind: "Component",
      },
      { icon: PackageIcon, path: "@base-ui/react", kind: "Dependency" },
      { icon: PaintBoardIcon, path: "app/globals.css", kind: "Tokens" },
    ],
  },
  {
    value: "card",
    title: "Card",
    description: "Composable surface, header through footer.",
    version: "v1.9.0",
    size: "6.1 kB",
    files: [
      {
        icon: SourceCodeIcon,
        path: "components/ui/card.tsx",
        kind: "Component",
      },
      { icon: PaintBoardIcon, path: "app/globals.css", kind: "Tokens" },
    ],
  },
  {
    value: "tooltip",
    title: "Tooltip",
    description: "Portalled hint for hover and focus.",
    version: "v2.1.3",
    size: "9.8 kB",
    files: [
      {
        icon: SourceCodeIcon,
        path: "components/ui/tooltip.tsx",
        kind: "Component",
      },
      { icon: PackageIcon, path: "@base-ui/react", kind: "Dependency" },
      { icon: PaintBoardIcon, path: "app/globals.css", kind: "Tokens" },
    ],
  },
  {
    value: "terminal",
    title: "Terminal",
    description: "Shiki-highlighted AI element shell.",
    version: "v0.8.2",
    size: "24.6 kB",
    files: [
      {
        icon: SourceCodeIcon,
        path: "components/ai-elements/terminal.tsx",
        kind: "Component",
      },
      { icon: PackageIcon, path: "shiki", kind: "Dependency" },
      { icon: PackageIcon, path: "@base-ui/react", kind: "Dependency" },
      { icon: PaintBoardIcon, path: "app/globals.css", kind: "Tokens" },
    ],
  },
]

const selectItems = registryItems.map((item) => ({
  label: item.title,
  value: item.value,
}))

function plural(count: number, singular: string, pluralised: string) {
  return `${count} ${count === 1 ? singular : pluralised}`
}

export function InstallCommand() {
  const [manager, setManager] = React.useState("pnpm")
  const [item, setItem] = React.useState("button")
  const { isCopied, copyToClipboard } = useCopyToClipboard()

  const activeManager =
    managers.find((entry) => entry.value === manager) ?? managers[0]
  const activeItem =
    registryItems.find((entry) => entry.value === item) ?? registryItems[0]
  const command = `${activeManager.command} https://registry.aiellie.dev/r/${activeItem.value}.json`

  const dependencies = activeItem.files.filter(
    (file) => file.kind === "Dependency"
  ).length
  const fileCount = activeItem.files.length - dependencies

  async function handleCopy() {
    const copied = await copyToClipboard(command)

    toast.add(
      copied
        ? {
            title: "Command copied",
            description: `${activeManager.label} · ${activeItem.title}`,
            type: "success",
          }
        : {
            title: "Copy failed",
            description: "The clipboard is not available here.",
            type: "error",
          }
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Install {activeItem.title}</CardTitle>
        <CardDescription>
          {activeItem.description}{" "}
          <span className="font-mono tabular-nums">{activeItem.version}</span>
        </CardDescription>
        <CardAction>
          <Select
            items={selectItems}
            value={item}
            onValueChange={(value) => setItem(String(value))}
          >
            <SelectTrigger
              size="sm"
              className="w-28"
              aria-label="Registry item to install"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {selectItems.map((entry) => (
                  <SelectItem key={entry.value} value={entry.value}>
                    {entry.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-2.5">
        <Tabs
          value={manager}
          onValueChange={(value) => setManager(String(value))}
        >
          <TabsList className="w-full">
            {managers.map((entry) => (
              <TabsTrigger key={entry.value} value={entry.value}>
                {entry.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2 rounded-lg border bg-muted/60 py-1 ps-2.5 pe-1">
          <span
            aria-hidden
            className="shrink-0 font-mono text-xs text-muted-foreground"
          >
            $
          </span>
          <code
            data-slot="install-command"
            className="min-w-0 flex-1 truncate font-mono text-xs leading-7 text-foreground"
          >
            {command}
          </code>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Copy install command"
                  onClick={handleCopy}
                />
              }
            >
              <HugeiconsIcon
                icon={isCopied ? Tick02Icon : Copy01Icon}
                strokeWidth={2}
              />
            </TooltipTrigger>
            <TooltipContent>
              {isCopied ? "Copied" : "Copy install command"}
            </TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
      <CardContent className="flex flex-col gap-2">
        <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
          Adds to your project
        </span>
        <div className="flex flex-col gap-1.5">
          {activeItem.files.map((file) => (
            <div
              key={file.path}
              className="flex items-center gap-2.5 rounded-lg bg-muted/50 px-2.5 py-2"
            >
              <HugeiconsIcon
                icon={file.icon}
                strokeWidth={2}
                className="size-4 shrink-0 text-muted-foreground"
              />
              <span className="min-w-0 flex-1 truncate font-mono text-xs">
                {file.path}
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {file.kind}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <span
          data-slot="install-footer"
          className="truncate text-xs text-muted-foreground"
        >
          {plural(fileCount, "file", "files")} &middot;{" "}
          {plural(dependencies, "dependency", "dependencies")}
        </span>
        <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
          {activeItem.size}
        </span>
      </CardFooter>
    </Card>
  )
}
