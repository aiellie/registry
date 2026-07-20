import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export const carousel = {
  name: "carousel",
  components: {
    Default: (
      <div className="flex w-full items-center justify-center p-6">
        <div className="px-12">
          <Carousel className="w-full max-w-3xs">
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="font-heading text-4xl font-semibold">
                          {index + 1}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    ),
    "Multiple Items": (
      <div className="flex w-full items-center justify-center p-6">
        <div className="px-12">
          <Carousel opts={{ align: "start" }} className="w-full max-w-xs">
            <CarouselContent>
              {Array.from({ length: 6 }).map((_, index) => (
                <CarouselItem key={index} className="basis-1/3">
                  <div className="p-1">
                    <Card size="sm">
                      <CardContent className="flex aspect-square items-center justify-center p-2">
                        <span className="font-heading text-2xl font-semibold">
                          {index + 1}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    ),
  },
}
