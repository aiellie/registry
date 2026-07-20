import { MCPDialog } from "@/components/registry/mcp-dialog"
import { ModeToggle } from "@/components/registry/theme-toggle"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function RegistryHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ms-1" />
      <Separator
        orientation="vertical"
        className="me-2 data-[orientation=vertical]:h-4"
      />
      <div className="ms-auto flex items-center gap-1">
        <MCPDialog
          rootUrl={
            process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "ui.aiellie.dev"
          }
        />
        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4"
        />
        <ModeToggle />
      </div>
    </header>
  )
}
