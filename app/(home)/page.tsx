import { type Metadata } from "next"

import { Announcement } from "@/components/registry/announcement"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/registry/page-header"

import { RegistryFooter } from "@/components/registry/registry-footer"
import { getRegistryItems } from "@/lib/registry"
import { CardsDemo } from "@/app/(registry)/cards"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon } from "@hugeicons/core-free-icons"
import Link from "next/link"
import { Wand } from "@hugeicons/core-free-icons"
const title = "AIEllie UI"
const description =
  "Building my design system. Explore some of my components below."

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
    <div className="flex w-full min-w-0 flex-1 flex-col">
      <PageHeader className="border-0">
        <div className="flex w-full flex-col items-center gap-2 xl:gap-4">
          <Announcement />
          <PageHeaderHeading className="max-w-4xl">{title}</PageHeaderHeading>
          <PageHeaderDescription>{description}</PageHeaderDescription>
          <PageActions>
          <div
          className="home-rise flex flex-wrap items-center justify-center gap-2"
          style={{ animationDelay: "520ms" }}
        >
          <Button
            size="default"
            nativeButton={false}
            render={<Link href="/registry/blank" />}
            className="group/cta"
          >
             <HugeiconsIcon
              icon={Search01Icon}
              strokeWidth={2}
              className="transition-transform duration-200 group-hover/cta:translate-x-0.5 rtl:rotate-180 rtl:group-hover/cta:-translate-x-0.5"
            />
            Explore
           
          </Button>
          <Button
            size="default"
            variant="outline"
            nativeButton={false}
            render={<Link href="/tokens" />}
          >
            <HugeiconsIcon icon={Wand} strokeWidth={2} />
            Design
          </Button>
        </div>
          </PageActions>
        </div>
      </PageHeader>
      <div className="flex-1">
        <CardsDemo />
      </div>
      <RegistryFooter className="z-10 border-t-0 bg-transparent backdrop-blur-none" />
    </div>
  )
}
