"use client"

import * as React from "react"

import { Example, ExampleWrapper } from "@/components/example"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

export default function CarouselExample() {
  return (
    <ExampleWrapper className="lg:grid-cols-1">
      <CarouselBasic />
      <CarouselMultiple />
      <CarouselWithGap />
      <CarouselApiDemo />
      <CarouselOrientation />
    </ExampleWrapper>
  )
}

function CarouselBasic({ className }: { className?: string }) {
  return (
    <Example title="Basic" containerClassName={className}>
      <Carousel className="mx-auto max-w-xs sm:max-w-sm">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:inline-flex" />
        <CarouselNext className="hidden sm:inline-flex" />
      </Carousel>
    </Example>
  )
}

function CarouselMultiple({ className }: { className?: string }) {
  return (
    <Example title="Multiple" containerClassName={className}>
      <Carousel
        className="mx-auto max-w-xs sm:max-w-sm"
        opts={{
          align: "start",
        }}
      >
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="sm:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-3xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:inline-flex" />
        <CarouselNext className="hidden sm:inline-flex" />
      </Carousel>
    </Example>
  )
}

function CarouselApiDemo({ className }: { className?: string }) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <Example title="API" containerClassName={className}>
      <div className="mx-auto max-w-xs sm:max-w-sm">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-4xl font-semibold">
                        {index + 1}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:inline-flex" />
          <CarouselNext className="hidden sm:inline-flex" />
        </Carousel>
        <div className="py-2 text-center text-sm text-muted-foreground">
          Slide {current} of {count}
        </div>
      </div>
    </Example>
  )
}

function CarouselOrientation({ className }: { className?: string }) {
  return (
    <Example title="Orientation" containerClassName={className}>
      <Carousel
        opts={{
          align: "start",
        }}
        orientation="vertical"
        className="mx-auto max-w-xs"
      >
        <CarouselContent className="-mt-1 h-[270px]">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="basis-1/2 pt-1">
              <div className="p-1">
                <Card>
                  <CardContent className="flex items-center justify-center p-6">
                    <span className="text-3xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </Example>
  )
}

function CarouselWithGap({ className }: { className?: string }) {
  return (
    <Example title="With Gap" containerClassName={className}>
      <Carousel className="mx-auto max-w-xs sm:max-w-sm">
        <CarouselContent className="-ms-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="ps-1 md:basis-1/2">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-2xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:inline-flex" />
        <CarouselNext className="hidden sm:inline-flex" />
      </Carousel>
    </Example>
  )
}
