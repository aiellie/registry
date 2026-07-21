"use client"

import { useState } from "react"

import { AddToCursor } from "@/components/registry/add-to-cursor"
import { CopyButton } from "@/components/registry/copy-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getMcpConfig } from "@/lib/mcp-config"

export function MCPTabs({
  rootUrl,
  highlightedMcp,
}: {
  rootUrl: string
  highlightedMcp?: string
}) {
  const [tab, setTab] = useState("cursor")

  const { mcp, mcpServer } = getMcpConfig(rootUrl)

  return (
    <Tabs value={tab} onValueChange={(value) => setTab(String(value))}>
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="cursor">Cursor</TabsTrigger>
          <TabsTrigger value="windsurf">Windsurf</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="cursor">
        <p className="text-sm text-muted-foreground">
          Click Add to Cursor or copy and paste the code into{" "}
          <code className="inline text-sm tabular-nums">.cursor/mcp.json</code>
        </p>
      </TabsContent>

      <TabsContent value="windsurf">
        <p className="text-sm text-muted-foreground">
          Copy and paste the code into{" "}
          <code className="inline text-sm tabular-nums">
            .codeium/windsurf/mcp_config.json
          </code>
        </p>
      </TabsContent>

      <div className="relative">
        <div className="absolute top-3 right-3 flex gap-2">
          {tab === "cursor" && <AddToCursor mcp={mcp} />}

          <CopyButton content={mcpServer} />
        </div>

        {highlightedMcp ? (
          <div
            className="no-scrollbar mt-16 overflow-x-auto rounded-lg border bg-code font-mono text-sm sm:mt-0"
            dangerouslySetInnerHTML={{ __html: highlightedMcp }}
          />
        ) : (
          <pre className="mt-16 overflow-x-auto rounded-lg border p-1 sm:mt-0">
            <code className="relative rounded bg-transparent p-1 font-mono text-sm text-muted-foreground">
              {mcpServer}
            </code>
          </pre>
        )}
      </div>
    </Tabs>
  )
}
