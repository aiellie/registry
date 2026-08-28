import * as React from "react"
import Image from "next/image"

import { Example, ExampleWrapper } from "@/components/example"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { glassImage } from "@/lib/glass"
import { gradientImage } from "@/lib/gradient"

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
)

const works = [
  {
    artist: "Glass",
    art: glassImage("glass", { size: 150 }),
  },
  {
    artist: "Gradient",
    art: gradientImage("gradient", { width: 150, height: 150 }),
  },
  {
    artist: "Vladimir Malyav",
    art: "https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80",
  },
]

export default function ScrollAreaExample() {
  return (
    <ExampleWrapper>
      <ScrollAreaVertical />
      <ScrollAreaHorizontal />
    </ExampleWrapper>
  )
}

function ScrollAreaVertical({ className }: { className?: string }) {
  return (
    <Example title="Vertical" containerClassName={className}>
      <ScrollArea className="mx-auto h-72 w-48 rounded-md border">
        <div className="p-4">
          <h4 className="mb-4 text-sm leading-none font-medium">Tags</h4>
          {tags.map((tag) => (
            <React.Fragment key={tag}>
              <div className="text-sm">{tag}</div>
              <Separator className="my-2" />
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
    </Example>
  )
}

function ScrollAreaHorizontal({ className }: { className?: string }) {
  return (
    <Example title="Horizontal" containerClassName={className}>
      <ScrollArea className="mx-auto w-full max-w-96 rounded-md border p-4">
        <div className="flex gap-4">
          {works.map((artwork) => (
            <figure key={artwork.artist} className="shrink-0">
              <div className="overflow-hidden rounded-md">
                <Image
                  src={artwork.art}
                  alt={`Photo by ${artwork.artist}`}
                  className="aspect-[3/4] h-fit w-fit object-cover"
                  width={300}
                  height={400}
                />
              </div>
              <figcaption className="pt-2 text-xs text-muted-foreground">
                Photo by{" "}
                <span className="font-semibold text-foreground">
                  {artwork.artist}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Example>
  )
}
