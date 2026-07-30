import { type Metadata } from "next"

import { Bubble } from "@/components/canvasui/Bubble"
import { Announcement } from "@/components/registry/announcement"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/registry/page-header"

import { ItemsGrid } from "@/components/registry/items-grid"
import { ScrollToComponentsButton } from "@/components/registry/scroll-to-components-button"
import { RegistryFooter } from "@/components/registry/registry-footer"
import { getRegistryItems } from "@/lib/registry"

const title = "AIEllie Design System"
const description =
  "Distribute your design system tokens, custom components, hooks, pages, and other files to any React project."

export const dynamic = "force-static"
export const revalidate = false

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
}

export default async function IndexPage() {
  // Strip to the fields the grid reads — passing whole registry entries would
  // serialize every item's file list into the RSC payload.
  const items = getRegistryItems().map(
    ({ name, title, description, type }) => ({ name, title, description, type })
  )

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader className="md:**:[.container]:pb-8 lg:**:[.container]:pb-12">
        {/* min-h keeps the header from collapsing in the html-in-canvas path,
            where Bubble's children render inside an absolutely-positioned
            canvas and contribute no intrinsic height. */}
        <Bubble className="min-h-60 w-full md:min-h-64">
          <div className="flex w-full flex-col items-center gap-2 xl:gap-4">
            <Announcement />
            <PageHeaderHeading className="max-w-4xl">{title}</PageHeaderHeading>
            <PageHeaderDescription>{description}</PageHeaderDescription>
            <PageActions>
              <ScrollToComponentsButton />
            </PageActions>
          </div>
        </Bubble>
      </PageHeader>
      <div
        data-slot="components-demo"
        className="mb-14! flex min-w-0 flex-col gap-6 p-5 md:p-10"
      >
        <ItemsGrid items={items} />
      </div>
      <RegistryFooter />
    </div>
  )
}
