import Image from "next/image"

import { Example, ExampleWrapper } from "@/components/example"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { gradientImage } from "@/lib/gradient"

export default function AspectRatioExample() {
  return (
    <ExampleWrapper className="">
      <AspectRatio16x9 />
      <AspectRatio21x9 />
      <AspectRatio1x1 />
      <AspectRatio9x16 />
    </ExampleWrapper>
  )
}

function AspectRatio16x9({ className }: { className?: string }) {
  return (
    <Example
      title="16:9"
      className="items-center justify-center"
      containerClassName={className}
    >
      <AspectRatio ratio={16 / 9} className="rounded-lg bg-muted">
        <Image
          src={gradientImage("aspect-ratio-16x9")}
          alt="Photo"
          fill
          className="h-full w-full rounded-lg object-cover"
        />
      </AspectRatio>
    </Example>
  )
}

function AspectRatio1x1({ className }: { className?: string }) {
  return (
    <Example title="1:1" className="items-start" containerClassName={className}>
      <AspectRatio ratio={1 / 1} className="rounded-lg bg-muted">
        <Image
          src={gradientImage("aspect-ratio-1x1")}
          alt="Photo"
          fill
          className="h-full w-full rounded-lg object-cover"
        />
      </AspectRatio>
    </Example>
  )
}

function AspectRatio9x16({ className }: { className?: string }) {
  return (
    <Example
      title="9:16"
      className="items-center justify-center"
      containerClassName={className}
    >
      <AspectRatio ratio={9 / 16} className="rounded-lg bg-muted">
        <Image
          src={gradientImage("aspect-ratio-9x16")}
          alt="Photo"
          fill
          className="h-full w-full rounded-lg object-cover"
        />
      </AspectRatio>
    </Example>
  )
}

function AspectRatio21x9({ className }: { className?: string }) {
  return (
    <Example
      title="21:9"
      className="items-center justify-center"
      containerClassName={className}
    >
      <AspectRatio ratio={21 / 9} className="rounded-lg bg-muted">
        <Image
          src={gradientImage("aspect-ratio-21x9")}
          alt="Photo"
          fill
          className="h-full w-full rounded-lg object-cover"
        />
      </AspectRatio>
    </Example>
  )
}
