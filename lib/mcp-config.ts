export function getRootUrl() {
  return process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "ui.aiellie.dev"
}

export function getMcpConfig(rootUrl: string) {
  const mcp = {
    command: "npx -y shadcn@latest registry:mcp",
    env: {
      REGISTRY_URL: `https://${rootUrl}/r/registry.json`,
    },
  }

  const mcpServer = JSON.stringify(
    {
      mcpServers: {
        shadcn: mcp,
      },
    },
    null,
    2
  )

  return { mcp, mcpServer }
}
