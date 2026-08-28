"use client"

import * as React from "react"

import {
  ArrowExpandIcon,
  ArrowShrinkIcon,
  Folder01Icon,
  Folder02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
} from "@/components/code/file-tree"
import { getIconForLanguageExtension } from "@/components/icons/icons"
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

/** `.gitignore` -> `gitignore`, `button.tsx` -> `tsx`, `Dockerfile` -> `dockerfile`. */
function extensionOf(name: string) {
  const withoutLeadingDot = name.startsWith(".") ? name.slice(1) : name
  const lastDot = withoutLeadingDot.lastIndexOf(".")
  const extension =
    lastDot === -1 ? withoutLeadingDot : withoutLeadingDot.slice(lastDot + 1)

  return extension.toLowerCase()
}

type TreeNode =
  | { type: "file"; name: string }
  | { type: "folder"; name: string; children: TreeNode[] }

const TREE: TreeNode[] = [
  {
    type: "folder",
    name: "app",
    children: [
      {
        type: "folder",
        name: "(registry)",
        children: [
          { type: "file", name: "layout.tsx" },
          { type: "file", name: "page.tsx" },
        ],
      },
      {
        type: "folder",
        name: "demo",
        children: [{ type: "file", name: "index.tsx" }],
      },
      { type: "file", name: "globals.css" },
    ],
  },
  {
    type: "folder",
    name: "components",
    children: [
      {
        type: "folder",
        name: "ui",
        children: [
          { type: "file", name: "button.tsx" },
          { type: "file", name: "card.tsx" },
          { type: "file", name: "tooltip.tsx" },
        ],
      },
      {
        type: "folder",
        name: "registry",
        children: [{ type: "file", name: "block-viewer.tsx" }],
      },
    ],
  },
  {
    type: "folder",
    name: "lib",
    children: [
      { type: "file", name: "registry-server.ts" },
      { type: "file", name: "items.ts" },
      { type: "file", name: "utils.ts" },
    ],
  },
  { type: "file", name: "registry.json" },
  { type: "file", name: "package.json" },
  { type: "file", name: "README.md" },
]

const DEFAULT_EXPANDED = ["app", "components", "components/ui", "lib"]

function folderPaths(nodes: TreeNode[], parent = ""): string[] {
  return nodes.flatMap((node) => {
    if (node.type !== "folder") return []
    const path = parent ? `${parent}/${node.name}` : node.name
    return [path, ...folderPaths(node.children, path)]
  })
}

const ALL_FOLDERS = folderPaths(TREE)

function countNodes(nodes: TreeNode[]): { files: number; folders: number } {
  let files = 0
  let folders = 0

  for (const node of nodes) {
    if (node.type === "folder") {
      const nested = countNodes(node.children)
      files += nested.files
      folders += nested.folders + 1
    } else {
      files += 1
    }
  }

  return { files, folders }
}

const { files: FILE_COUNT, folders: FOLDER_COUNT } = countNodes(TREE)

function TreeNodes({
  nodes,
  parent = "",
}: {
  nodes: TreeNode[]
  parent?: string
}) {
  return nodes.map((node) => {
    const path = parent ? `${parent}/${node.name}` : node.name

    return node.type === "folder" ? (
      <FileTreeFolder key={path} name={node.name} path={path}>
        <TreeNodes nodes={node.children} parent={path} />
      </FileTreeFolder>
    ) : (
      <FileTreeFile key={path} name={node.name} path={path} />
    )
  })
}

export function FileExplorer() {
  const [expanded, setExpanded] = React.useState(
    () => new Set(DEFAULT_EXPANDED)
  )
  const [selectedPath, setSelectedPath] = React.useState(
    "components/ui/card.tsx"
  )

  const isOpen = expanded.size > 0
  const selectedName = selectedPath.slice(selectedPath.lastIndexOf("/") + 1)
  const isFolder = ALL_FOLDERS.includes(selectedPath)
  const extension = isFolder ? "folder" : extensionOf(selectedName)

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="truncate">registry.aiellie.dev</CardTitle>
        <CardDescription className="truncate">
          main · {FILE_COUNT} files · {FOLDER_COUNT} folders
        </CardDescription>
        <CardAction>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  aria-label={isOpen ? "Collapse all" : "Expand all"}
                  onClick={() =>
                    setExpanded(isOpen ? new Set() : new Set(ALL_FOLDERS))
                  }
                  size="icon-sm"
                  variant="ghost"
                >
                  <HugeiconsIcon
                    icon={isOpen ? ArrowShrinkIcon : ArrowExpandIcon}
                    strokeWidth={2}
                  />
                </Button>
              }
            />
            <TooltipContent>
              {isOpen ? "Collapse all" : "Expand all"}
            </TooltipContent>
          </Tooltip>
        </CardAction>
      </CardHeader>
      <CardContent>
        <FileTree
          className="h-56 overflow-auto text-xs"
          expanded={expanded}
          onExpandedChange={setExpanded}
          onSelect={setSelectedPath}
          selectedPath={selectedPath}
          variant="file-type"
        >
          <TreeNodes nodes={TREE} />
        </FileTree>
      </CardContent>
      <CardFooter className="gap-2">
        <span className="flex size-3.5 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-3.5">
          {isFolder ? (
            <HugeiconsIcon
              icon={expanded.has(selectedPath) ? Folder02Icon : Folder01Icon}
              strokeWidth={2}
            />
          ) : (
            getIconForLanguageExtension(extensionOf(selectedName))
          )}
        </span>
        <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
          {selectedPath}
        </span>
        <Badge
          className="shrink-0 font-mono text-[10px] uppercase"
          variant="secondary"
        >
          {extension}
        </Badge>
      </CardFooter>
    </Card>
  )
}
