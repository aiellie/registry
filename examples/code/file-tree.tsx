"use client"

import * as React from "react"

import {
  Copy01Icon,
  Copy02Icon,
  Delete02Icon,
  File01Icon,
  FileAddIcon,
  FolderAddIcon,
  Link01Icon,
  PencilEdit02Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
} from "@/components/code/file-tree"
import {
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from "@/components/ui/context-menu"

type TreeNode =
  | { type: "file"; name: string }
  | { type: "folder"; name: string; children: TreeNode[] }

const TREE: TreeNode[] = [
  {
    type: "folder",
    name: "app",
    children: [
      { type: "file", name: "layout.tsx" },
      { type: "file", name: "page.tsx" },
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
          { type: "file", name: "input.tsx" },
        ],
      },
      { type: "file", name: "icons.tsx" },
    ],
  },
  {
    type: "folder",
    name: "lib",
    children: [{ type: "file", name: "utils.ts" }],
  },
  { type: "file", name: "package.json" },
  { type: "file", name: "README.md" },
]

const joinPath = (parent: string, name: string) =>
  parent ? `${parent}/${name}` : name

function TreeNodes({
  nodes,
  parent = "",
}: {
  nodes: TreeNode[]
  parent?: string
}) {
  return nodes.map((node) => {
    const path = joinPath(parent, node.name)

    return node.type === "folder" ? (
      <FileTreeFolder
        contextMenu={<FolderMenu />}
        key={path}
        name={node.name}
        path={path}
      >
        <TreeNodes nodes={node.children} parent={path} />
      </FileTreeFolder>
    ) : (
      <FileTreeFile
        contextMenu={<FileMenu />}
        key={path}
        name={node.name}
        path={path}
      />
    )
  })
}

function FolderMenu() {
  return (
    <ContextMenuContent>
      <ContextMenuGroup>
        <ContextMenuItem>
          <HugeiconsIcon icon={FileAddIcon} strokeWidth={2} />
          New File
        </ContextMenuItem>
        <ContextMenuItem>
          <HugeiconsIcon icon={FolderAddIcon} strokeWidth={2} />
          New Folder
        </ContextMenuItem>
      </ContextMenuGroup>
      <ContextMenuSeparator />
      <ContextMenuGroup>
        <ContextMenuItem>
          <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
          Find in Folder
        </ContextMenuItem>
        <ContextMenuItem>
          <HugeiconsIcon icon={Link01Icon} strokeWidth={2} />
          Copy Path
          <ContextMenuShortcut>⇧⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <HugeiconsIcon icon={PencilEdit02Icon} strokeWidth={2} />
          Rename
          <ContextMenuShortcut>⏎</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuGroup>
      <ContextMenuSeparator />
      <ContextMenuItem variant="destructive">
        <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
        Delete
        <ContextMenuShortcut>⌫</ContextMenuShortcut>
      </ContextMenuItem>
    </ContextMenuContent>
  )
}

function FileMenu() {
  return (
    <ContextMenuContent>
      <ContextMenuGroup>
        <ContextMenuItem>
          <HugeiconsIcon icon={File01Icon} strokeWidth={2} />
          Open
        </ContextMenuItem>
        <ContextMenuItem>
          <HugeiconsIcon icon={Copy02Icon} strokeWidth={2} />
          Duplicate
          <ContextMenuShortcut>⌘D</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuGroup>
      <ContextMenuSeparator />
      <ContextMenuGroup>
        <ContextMenuItem>
          <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} />
          Copy
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <HugeiconsIcon icon={Link01Icon} strokeWidth={2} />
          Copy Path
          <ContextMenuShortcut>⇧⌘C</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuGroup>
      <ContextMenuSeparator />
      <ContextMenuItem variant="destructive">
        <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
        Delete
        <ContextMenuShortcut>⌫</ContextMenuShortcut>
      </ContextMenuItem>
    </ContextMenuContent>
  )
}

export function FileTreeDemo() {
  const [selectedPath, setSelectedPath] = React.useState<string | undefined>(
    "app/page.tsx"
  )

  return (
    <div className="mx-auto flex min-h-dvh w-xl max-w-full flex-col justify-center gap-3 p-6">
      <FileTree
        defaultExpanded={new Set(["app", "components", "components/ui"])}
        onSelect={setSelectedPath}
        selectedPath={selectedPath}
        variant="file-type"
      >
        <TreeNodes nodes={TREE} />
      </FileTree>
      <p className="text-sm text-muted-foreground">
        Selected: {selectedPath ?? "none"} — right-click for actions.
      </p>
    </div>
  )
}
