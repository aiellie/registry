"use client"

import { useState } from "react"
import { PaintBoardIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"

import { CopyButton } from "@/components/registry/copy-button"
import { DownloadButton } from "@/components/registry/download-button"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type ThemeSource = {
  id: string
  label: string
  /** Path shown under the tab, so it is obvious where the file lands. */
  target: string
  hint: string
  code: string
  /** Shiki output from the server; falls back to plain `code` when absent. */
  highlighted?: string
}

function SourcePane({ source }: { source: ThemeSource }) {
  return (
    <div className="relative">
      <div className="absolute end-3 top-3 z-10 flex items-center gap-1">
        <DownloadButton content={source.code} name={source.target} />
        <CopyButton content={source.code} />
      </div>

      {source.highlighted ? (
        <div
          className="no-scrollbar max-h-[55vh] overflow-auto rounded-lg border bg-muted/40 font-mono text-sm"
          dangerouslySetInnerHTML={{ __html: source.highlighted }}
        />
      ) : (
        <pre className="no-scrollbar max-h-[55vh] overflow-auto rounded-lg border bg-muted/40 p-4">
          <code className="font-mono text-sm text-muted-foreground">
            {source.code}
          </code>
        </pre>
      )}
    </div>
  )
}

export function ThemeDialog({
  sources,
  trigger,
}: {
  sources: ThemeSource[]
  /** Defaults to an icon button for the header; pass a labelled button elsewhere. */
  trigger?: React.ReactElement
}) {
  const [tab, setTab] = useState(sources[0]?.id ?? "")
  const active = sources.find((source) => source.id === tab) ?? sources[0]

  if (sources.length === 0) {
    return null
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          trigger ?? (
            <Button variant="ghost" size="icon-sm" aria-label="Theme source">
              <HugeiconsIcon
                icon={PaintBoardIcon}
                strokeWidth={2}
                className="size-4"
              />
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Theme source</DialogTitle>
          <DialogDescription>
            Everything that defines the look of this system. Install it with{" "}
            <code className="inline text-sm">
              npx shadcn@latest add {"{registry}"}/r/theme.json
            </code>
            , or copy a file straight into your project. The published tokens
            live in{" "}
            <Link href="/r/theme.json" className="underline">
              <code className="inline text-sm">theme.json</code>
            </Link>
            .
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(value) => setTab(String(value))}>
          <TabsList>
            {sources.map((source) => (
              <TabsTrigger key={source.id} value={source.id}>
                {source.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {sources.map((source) => (
            <TabsContent key={source.id} value={source.id}>
              <p className="text-sm text-muted-foreground">
                {source.hint}{" "}
                <code className="inline text-sm">{source.target}</code>
              </p>
            </TabsContent>
          ))}

          {/* Rendered once outside the panels so the tall code block is not duplicated. */}
          {active && <SourcePane source={active} />}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
