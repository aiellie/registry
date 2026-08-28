"use client"

import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
} from "@/components/code/file-tree"
import { ExampleWrapper } from "@/components/example"
import {
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from "@/components/ui/context-menu"
import {
  Copy01Icon,
  Copy02Icon,
  Delete02Icon,
  Download01Icon,
  File01Icon,
  FileAddIcon,
  FolderAddIcon,
  Link01Icon,
  PencilEdit02Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

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
        <ContextMenuItem>
          <HugeiconsIcon icon={Download01Icon} strokeWidth={2} />
          Download
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

export default function FileTreeExample() {
  const [selectedPath, setSelectedPath] = useState("app/page.tsx")

  return (
    <ExampleWrapper className="min-h-svh grid-cols-1 place-content-center place-items-center md:grid-cols-1">
      <div className="w-full max-w-sm">
        <FileTree
          defaultExpanded={new Set(["app"])}
          onSelect={setSelectedPath}
          selectedPath={selectedPath}
          variant="file-type"
        >
          <FileTreeFolder contextMenu={<FolderMenu />} name="app" path="app">
            <FileTreeFile
              contextMenu={<FileMenu />}
              name="layout.tsx"
              path="app/layout.tsx"
            />
            <FileTreeFile
              contextMenu={<FileMenu />}
              name="page.tsx"
              path="app/page.tsx"
            />
            <FileTreeFile
              contextMenu={<FileMenu />}
              name="globals.css"
              path="app/globals.css"
            />
          </FileTreeFolder>
          <FileTreeFolder
            contextMenu={<FolderMenu />}
            name="components"
            path="components"
          >
            <FileTreeFolder
              contextMenu={<FolderMenu />}
              name="ui"
              path="components/ui"
            >
              <FileTreeFile
                contextMenu={<FileMenu />}
                name="button.tsx"
                path="components/ui/button.tsx"
              />
              <FileTreeFile
                contextMenu={<FileMenu />}
                name="input.tsx"
                path="components/ui/input.tsx"
              />
            </FileTreeFolder>
            <FileTreeFile
              contextMenu={<FileMenu />}
              name="icons.tsx"
              path="components/icons.tsx"
            />
          </FileTreeFolder>
          <FileTreeFolder contextMenu={<FolderMenu />} name="lib" path="lib">
            <FileTreeFile
              contextMenu={<FileMenu />}
              name="utils.ts"
              path="lib/utils.ts"
            />
          </FileTreeFolder>
          <FileTreeFolder
            contextMenu={<FolderMenu />}
            name="public"
            path="public"
          >
            <FileTreeFile
              contextMenu={<FileMenu />}
              name="favicon.ico"
              path="public/favicon.ico"
            />
            <FileTreeFile
              contextMenu={<FileMenu />}
              name="logo.svg"
              path="public/logo.svg"
            />
          </FileTreeFolder>
          <FileTreeFile
            contextMenu={<FileMenu />}
            name=".gitignore"
            path=".gitignore"
          />
          <FileTreeFile
            contextMenu={<FileMenu />}
            name="package.json"
            path="package.json"
          />
          <FileTreeFile
            contextMenu={<FileMenu />}
            name="README.md"
            path="README.md"
          />
        </FileTree>
      </div>
    </ExampleWrapper>
  )
}
