import { type Metadata } from "next"

import { Announcement } from "@/components/registry/announcement"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/registry/page-header"

import { ComponentsDemo } from "@/components/registry/components-demo"
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

export default function IndexPage() {
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
      <div className="container-wrapper flex-1 p-0">
        <div className=" overflow-hidden md:px-0 lg:max-w-none">
        <div className="flex-1 overflow-hidden">
        <ComponentsDemo />
          </div>
        </div>
      </div>
      <RegistryFooter />
    </div>
  )
}


