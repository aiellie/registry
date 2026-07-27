import { type Metadata } from "next"

import { Announcement } from "@/components/registry/announcement"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/registry/page-header"

import { BlockDisplay } from "@/components/registry/block-display"
import { ScrollToComponentsButton } from "@/components/registry/scroll-to-components-button"
import { RegistryFooter } from "@/components/registry/registry-footer"

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
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader className="md:**:[.container]:pb-8 lg:**:[.container]:pb-12">
        <Announcement />
        <PageHeaderHeading className="max-w-4xl">{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <PageActions>
          <ScrollToComponentsButton />
        </PageActions>
      </PageHeader>
      <div className="mb-14! flex min-w-0 flex-col gap-6 p-5 md:p-10">
        <BlockDisplay name="dashboard" />
      </div>
      <RegistryFooter />
    </div>
  )
}
