"use client"

import * as React from "react"

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/code/code-block"
import { getIconForLanguageExtension } from "@/components/icons/icons"
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

const FILES = {
  "card.tsx": {
    language: "tsx" as const,
    lines: 24,
    code: `function Card({ size, ...props }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      {...props}
    />
  )
}`,
  },
  "globals.css": {
    language: "css" as const,
    lines: 12,
    code: `@theme inline {
  --color-success: var(--success);
  --color-warning: var(--warning);
}

.dark {
  --success: oklch(0.792 0.209 151.711);
}`,
  },
  "utils.ts": {
    language: "ts" as const,
    lines: 6,
    code: `export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`,
  },
}

type FileKey = keyof typeof FILES

export function CodeReview() {
  const [file, setFile] = React.useState<FileKey>("card.tsx")
  const active = FILES[file]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Code Review</CardTitle>
        <CardDescription className="truncate">
          3 files in this change
        </CardDescription>
        <CardAction>
          <Badge variant="secondary" className="font-mono tabular-nums">
            {active.lines}
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <ToggleGroup
          value={[file]}
          onValueChange={(value) => {
            const next = (value as string[])[0]
            if (next) setFile(next as FileKey)
          }}
          className="w-full"
        >
          {(Object.keys(FILES) as FileKey[]).map((key) => (
            <ToggleGroupItem
              key={key}
              value={key}
              className="min-w-0 flex-1 font-mono text-[10px]"
            >
              <span className="truncate">{key}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <CodeBlock
          // Remounts on file change so Shiki re-tokenises from scratch.
          key={file}
          code={active.code}
          language={active.language}
        >
          <CodeBlockHeader>
            <CodeBlockTitle>
              <span className="flex size-3.5 shrink-0 items-center justify-center [&_svg]:size-3.5">
                {getIconForLanguageExtension(active.language)}
              </span>
              <CodeBlockFilename>{file}</CodeBlockFilename>
            </CodeBlockTitle>
            <CodeBlockActions>
              <CodeBlockCopyButton
                onCopy={() =>
                  toast.add({ title: `Copied ${file}`, type: "success" })
                }
                onError={() =>
                  toast.add({
                    title: "Couldn't reach the clipboard",
                    type: "error",
                  })
                }
              />
            </CodeBlockActions>
          </CodeBlockHeader>
        </CodeBlock>
      </CardContent>

      <CardFooter>
        <span className="truncate text-xs text-muted-foreground">
          Highlighted with Shiki at request time
        </span>
      </CardFooter>
    </Card>
  )
}
