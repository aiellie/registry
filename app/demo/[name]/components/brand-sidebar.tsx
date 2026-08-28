import { BrandSidebar } from "@/components/brand-sidebar"
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { SidebarProvider } from "@/components/ui/sidebar"

export const brandSidebar = {
  name: "brand-sidebar",
  components: {
    Default: (
      <SidebarProvider>
        <ResizablePanelGroup
          orientation="horizontal"
          style={{ height: "100svh" }}
        >
          <BrandSidebar />
          <ResizablePanel id="content" />
        </ResizablePanelGroup>
      </SidebarProvider>
    ),
  },
}
