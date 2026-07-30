"use client"

import type { ReactNode } from "react"
import { useState } from "react"

import { AddToCursor } from "@/components/registry/add-to-cursor"
import { CopyButton } from "@/components/registry/copy-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getMcpConfig } from "@/lib/mcp-config"

export function MCPTabs({
  rootUrl,
  highlightedConfig,
  highlightedClients,
}: {
  rootUrl: string
  highlightedConfig?: string
  highlightedClients?: Record<string, string>
}) {
  const { componentsJson, mcp, clients } = getMcpConfig(rootUrl)
  const [tab, setTab] = useState(clients[0]?.value ?? "cursor")

  return (
    <div className="flex flex-col gap-6">
      {/* Step 1 — register this registry's namespace in components.json */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <StepBadge>1</StepBadge>
          <p className="text-sm font-medium">
            Add this registry to your{" "}
            <code className="inline text-sm tabular-nums">components.json</code>
          </p>
        </div>

        <div className="relative">
          <div className="absolute top-2.5 right-3 z-10">
            <CopyButton content={componentsJson} />
          </div>

          {highlightedConfig ? (
            <div
              className="no-scrollbar overflow-x-auto rounded-lg border font-mono text-sm"
              dangerouslySetInnerHTML={{ __html: highlightedConfig }}
            />
          ) : (
            <pre className="no-scrollbar overflow-x-auto rounded-lg border  p-4">
              <code className="font-mono text-sm text-muted-foreground">
                {componentsJson}
              </code>
            </pre>
          )}
        </div>
      </div>

      {/* Step 2 — install the shadcn MCP server for the chosen client */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <StepBadge>2</StepBadge>
          <p className="text-sm font-medium">Install the shadcn MCP server</p>
        </div>

        <Tabs value={tab} onValueChange={(value) => setTab(String(value))}>
          <TabsList>
            {clients.map((client) => (
              <TabsTrigger key={client.value} value={client.value}>
                {client.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {clients.map((client) => {
            const content = client.command ?? client.config ?? ""
            const highlighted = highlightedClients?.[client.value]

            return (
              <TabsContent
                key={client.value}
                value={client.value}
                className="flex flex-col gap-2"
              >
                <p className="text-sm text-muted-foreground">
                  {client.command
                    ? "Run the following command in your project:"
                    : "Add the following to your config file:"}
                </p>

                <div className="relative">
                  <div className="absolute top-2.5 right-3 z-10">
                    <CopyButton content={content} />
                  </div>
                  {highlighted ? (
                    <div
                      className="no-scrollbar overflow-x-auto rounded-lg border font-mono text-sm"
                      dangerouslySetInnerHTML={{ __html: highlighted }}
                    />
                  ) : (
                    <pre className="no-scrollbar overflow-x-auto rounded-lg border p-4 pe-12">
                      <code className="font-mono text-sm text-muted-foreground">
                        {content}
                      </code>
                    </pre>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">{client.note}</p>

                {client.value === "cursor" && (
                  <div className="flex">
                    <AddToCursor mcp={mcp} />
                  </div>
                )}
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </div>
  )
}

function StepBadge({ children }: { children: ReactNode }) {
  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
      {children}
    </span>
  )
}
