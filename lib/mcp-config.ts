export function getRootUrl() {
  return process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "ui.aiellie.dev"
}

// Namespace registry consumers use in their components.json and when prompting
// the shadcn MCP server (e.g. "add @aiellie/button").
export const REGISTRY_NAMESPACE = "@aiellie"

export interface McpClient {
  value: string
  label: string
  /** Command to run when the client supports `shadcn mcp init`. */
  command?: string
  /** Manual config snippet for clients without `mcp init` (e.g. Codex). */
  config?: string
  /** Language used for the code block. */
  language: "bash" | "toml"
  /** What to do after configuring, mirroring the shadcn docs. */
  note: string
}

export function getMcpConfig(rootUrl: string) {
  const registryUrl = `https://${rootUrl}/r/{name}.json`

  // The snippet registry consumers add to their components.json to register
  // this registry under the @aiellie namespace.
  const componentsJson = JSON.stringify(
    {
      registries: {
        [REGISTRY_NAMESPACE]: registryUrl,
      },
    },
    null,
    2
  )

  // The generic shadcn MCP server. It reads registries from components.json,
  // so no registry URL is baked into the server config anymore.
  const mcp = {
    command: "npx",
    args: ["-y", "shadcn@latest", "mcp"],
  }

  // Per-client install instructions, following
  // https://ui.shadcn.com/docs/registry/mcp
  const clients: McpClient[] = [
    {
      value: "cursor",
      label: "Cursor",
      command: "npx shadcn@latest mcp init --client cursor",
      language: "bash",
      note: "Open Cursor Settings and enable the MCP server for shadcn.",
    },
    {
      value: "claude",
      label: "Claude Code",
      command: "npx shadcn@latest mcp init --client claude",
      language: "bash",
      note: "Restart Claude Code. Use the /mcp command to debug the server.",
    },
    {
      value: "vscode",
      label: "VS Code",
      command: "npx shadcn@latest mcp init --client vscode",
      language: "bash",
      note: "Open .vscode/mcp.json and click Start next to the shadcn server.",
    },
    {
      value: "codex",
      label: "Codex",
      config: `[mcp_servers.shadcn]
command = "npx"
args = ["shadcn@latest", "mcp"]`,
      language: "toml",
      note: "Add the config to ~/.codex/config.toml, then restart Codex.",
    },
    {
      value: "opencode",
      label: "OpenCode",
      command: "npx shadcn@latest mcp init --client opencode",
      language: "bash",
      note: "Restart OpenCode.",
    },
  ]

  return { registryUrl, componentsJson, mcp, clients }
}
