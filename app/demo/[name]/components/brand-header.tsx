import { BrandHeader } from "@/components/brand-header"
import { BrandPanelsProvider } from "@/components/brand-panels"
import { SidebarProvider } from "@/components/ui/sidebar"

export const brandHeader = {
  name: "brand-header",
  components: {
    Default: (
      <SidebarProvider>
        <BrandPanelsProvider>
          <BrandHeader />
        </BrandPanelsProvider>
      </SidebarProvider>
    ),
  },
}
