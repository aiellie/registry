import { type Metadata } from "next"
import Link from "next/link"
import { ArrowRightIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Announcement } from "@/components/registry/announcement"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/registry/page-header"

import { CardsDemo } from "./cards"
import { ShimmerButton } from "@/components/ui/shimmer-button"

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
          <ShimmerButton  className="h-[31px] rounded-lg flex flex-row items-center gap-2">
            <HugeiconsIcon icon={ArrowRightIcon} strokeWidth={2} className="size-4" />
            <Link href="/components">
              Explore Components 
            </Link>
          </ShimmerButton>
        </PageActions>
      </PageHeader>
      <div className="container-wrapper flex-1 p-0">
        <div className=" overflow-hidden md:px-0 lg:max-w-none">
          <section>
            <CardsDemo />
          </section>
        </div>
      </div>
    </div>
  )
}


