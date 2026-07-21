import { MCPDialog } from "@/components/registry/mcp-dialog"
import { ModeToggle } from "@/components/registry/theme-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function RegistryHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 bg-background/70 px-4 backdrop-blur-md">
      <SidebarTrigger className="-ms-1.5" />      
      <div className="ms-auto flex items-center gap-1">
        <MCPDialog
          rootUrl={
            process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "ui.aiellie.dev"
          }
        />
        <ModeToggle />
      </div>
    </header>
  )
}
