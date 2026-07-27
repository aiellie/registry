import Link from "next/link"

import { LogoIcon, LogoWordmark } from "@/components/logo"
import { MCPDialog } from "@/components/registry/mcp-dialog"
import { ModeToggle } from "@/components/registry/theme-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { getRootUrl } from "@/lib/mcp-config"

export function RegistryHeader({
  highlightedConfig,
  highlightedClients,
  showSidebarTrigger = true,
  // Error and not-found render this header without reading from disk, so the
  // theme dialog simply drops out there.
}: {
  highlightedConfig?: string
  highlightedClients?: Record<string, string>
  showSidebarTrigger?: boolean
}) {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-none bg-background/30 px-4 backdrop-blur-md">
      {showSidebarTrigger ? (
        <SidebarTrigger className="-ms-1.5" />
      ) : (
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <LogoIcon className="size-6" />
          <LogoWordmark as="span" className="text-sm font-medium" />
        </Link>
      )}
      <div className="ms-auto flex items-center gap-1">
        <span className="mx-1 h-3 w-px bg-border" />
        <MCPDialog
          rootUrl={getRootUrl()}
          highlightedConfig={highlightedConfig}
          highlightedClients={highlightedClients}
        />
        <ModeToggle />
      </div>
    </header>
  )
}
