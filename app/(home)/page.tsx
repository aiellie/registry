import { type Metadata } from "next"

import { Bubble } from "@/components/canvasui/Bubble"
import { Announcement } from "@/components/registry/announcement"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/registry/page-header"

import { HomeShowcase } from "@/components/registry/home-showcase"
import { RegistryFooter } from "@/components/registry/registry-footer"
import { ScrollToComponentsButton } from "@/components/registry/scroll-to-components-button"
import { getRegistryItems } from "@/lib/registry"

const title = "AIEllie Design System"
const description =
  "Building my UI brand. Preview a few of my components below."

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
  // Strip to the fields the showcase and its dialog read — passing whole
  // registry entries would serialize every item's file list into the RSC
  // payload.
  const items = getRegistryItems().map(
    ({ name, title, description, type }) => ({ name, title, description, type })
  )

  return (
    // min-w-0 keeps a wide demo's min-content from flooring the page column
    // past the viewport on phones.
    <div className="flex min-w-0 flex-1 flex-col">
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
      <div className="flex-1">
        <HomeShowcase items={items} />
      </div>
      <RegistryFooter />
    </div>
  )
}
