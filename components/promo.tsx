import Link from "next/link"

import { Button } from "@/components/ui/button"

export function Promo({
  title,
  description,
  buttonText,
  buttonLink,
}: {
  title: string
  description: string
  buttonText: string
  buttonLink: string
}) {
  return (
    <div className="relative h-[300px] w-full overflow-hidden bg-linear-to-r from-primary/15 via-primary/5 to-transparent">
      <div className="relative z-10 flex h-full flex-col justify-center gap-3 px-8 py-3">
        <h1 className="font-heading text-3xl font-medium tracking-tight md:text-4xl">
          {title}
        </h1>
        <p className="text-muted-foreground">{description}</p>
        <div>
          <Button
            nativeButton={false}
            render={<Link href={buttonLink} />}
            size="lg"
            className="rounded-md"
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  )
}
