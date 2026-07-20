import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function Hero({
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
    <div className="relative h-[600px] w-full overflow-hidden bg-linear-to-b from-primary/15 via-primary/5 to-transparent">
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Badge variant="secondary" className="mb-4">
            Coming soon
          </Badge>
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">{description}</p>
          <div className="mt-10">
            <Button
              nativeButton={false}
              render={<Link href={buttonLink} />}
              variant="secondary"
              size="lg"
              className="rounded-md px-8"
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
