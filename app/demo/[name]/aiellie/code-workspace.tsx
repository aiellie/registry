"use client"

import * as React from "react"

import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  CodeWorkspace,
  CodeWorkspacePanel,
  CodeWorkspaceSidebar,
  type CodeWorkspaceFile,
} from "@/components/ai-elements/code-workspace"
import { Example, ExampleWrapper } from "@/components/example"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/* -------------------------------------------------------------------------- */
/*                                    Data                                     */
/* -------------------------------------------------------------------------- */

const FILES: CodeWorkspaceFile[] = [
  {
    path: "app/page.tsx",
    content: `import { Badge } from "@/components/ui/badge"

export default function Page() {
  return (
    <main className="grid min-h-svh place-items-center">
      <Badge>Hello from aiellie</Badge>
    </main>
  )
}
`,
  },
  {
    path: "app/globals.css",
    content: `:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --radius: 0.625rem;
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
}
`,
  },
  {
    path: "components/ui/badge.tsx",
    content: `import { cn } from "@/lib/utils"

export function Badge({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 text-xs",
        className
      )}
      {...props}
    />
  )
}
`,
  },
  {
    path: "lib/utils.ts",
    content: `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`,
  },
  {
    path: "package.json",
    content: `{
  "name": "aiellie-app",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  }
}
`,
  },
]

/* -------------------------------------------------------------------------- */
/*                                  Examples                                   */
/* -------------------------------------------------------------------------- */

export default function CodeWorkspaceExample() {
  return (
    <ExampleWrapper className="md:grid-cols-1">
      <ExplorerExample />
      <SearchExample />
    </ExampleWrapper>
  )
}

/** Copies the active file's contents; rendered on the tab strip. */
function CopyFileButton({ path }: { path: string }) {
  const [copied, setCopied] = React.useState(false)
  const timeoutRef = React.useRef(0)

  React.useEffect(
    () => () => {
      window.clearTimeout(timeoutRef.current)
    },
    []
  )

  const copy = async () => {
    const file = FILES.find((candidate) => candidate.path === path)
    if (!file || !navigator?.clipboard?.writeText) return

    try {
      await navigator.clipboard.writeText(file.content)
      setCopied(true)
      timeoutRef.current = window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access denied — nothing to do.
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            aria-label="Copy file contents"
            className="text-muted-foreground"
            onClick={copy}
            size="icon-sm"
            variant="ghost"
          />
        }
      >
        <HugeiconsIcon
          className="size-3.5"
          icon={copied ? Tick02Icon : Copy01Icon}
          strokeWidth={2}
        />
      </TooltipTrigger>
      <TooltipContent>{copied ? "Copied" : "Copy file"}</TooltipContent>
    </Tooltip>
  )
}

function ExplorerExample({ className }: { className?: string }) {
  const [activeFile, setActiveFile] = React.useState("app/page.tsx")

  return (
    <Example
      title="Explorer — tree, tabs and actions"
      containerClassName={className}
    >
      <div className="flex w-full flex-col gap-3">
        <CodeWorkspace
          defaultFile="app/page.tsx"
          files={FILES}
          onFileChange={setActiveFile}
        >
          <CodeWorkspaceSidebar title="aiellie-app" />
          <CodeWorkspacePanel actions={<CopyFileButton path={activeFile} />} />
        </CodeWorkspace>
        <p className="text-sm text-muted-foreground">
          Click a file to open it as a tab; the + on the tab strip picks from
          every file in the workspace.
        </p>
      </div>
    </Example>
  )
}

function SearchExample({ className }: { className?: string }) {
  return (
    <Example
      title="Search — names, contents and replace preview"
      containerClassName={className}
    >
      <div className="flex w-full flex-col gap-3">
        <CodeWorkspace defaultFile="app/globals.css" files={FILES}>
          <CodeWorkspaceSidebar
            defaultScopes={["names", "contents"]}
            title="aiellie-app"
          />
          <CodeWorkspacePanel />
        </CodeWorkspace>
        <p className="text-sm text-muted-foreground">
          Open search from the magnifier, try <code>background</code>, then use
          the replace field to preview an edit without touching the source.
        </p>
      </div>
    </Example>
  )
}
