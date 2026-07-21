import { highlightCode } from "@/lib/highlight-code"
import { getMcpConfig } from "@/lib/mcp-config"

// Pre-highlight every MCP code block on the server (Shiki is CPU-heavy and the
// output is deterministic) so the client dialog can render highlighted markup
// without shipping a highlighter to the browser.
export async function getHighlightedMcpConfig(rootUrl: string) {
  const { componentsJson, clients } = getMcpConfig(rootUrl)

  const [highlightedConfig, ...highlightedContents] = await Promise.all([
    highlightCode(componentsJson, "json"),
    ...clients.map((client) =>
      highlightCode(client.command ?? client.config ?? "", client.language)
    ),
  ])

  const highlightedClients: Record<string, string> = {}
  clients.forEach((client, index) => {
    highlightedClients[client.value] = highlightedContents[index]
  })

  return { highlightedConfig, highlightedClients }
}
