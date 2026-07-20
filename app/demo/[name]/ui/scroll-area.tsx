import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
)

const artworks = [
  "Aurora Drift",
  "Quiet Harbor",
  "Neon Dusk",
  "Paper Cranes",
  "Salt Flats",
  "Ember Field",
  "Glass River",
]

export const scrollArea = {
  name: "scroll-area",
  components: {
    Default: (
      <div className="flex w-full justify-center p-6">
        <ScrollArea className="h-72 w-48 rounded-lg border">
          <div className="p-4">
            <h4 className="mb-4 text-sm leading-none font-medium">Tags</h4>
            {tags.map((tag) => (
              <div key={tag}>
                <div className="text-sm">{tag}</div>
                <Separator className="my-2" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    ),
    Horizontal: (
      <div className="flex w-full justify-center p-6">
        <ScrollArea className="w-full max-w-96 rounded-lg border">
          <div className="flex w-max gap-4 p-4">
            {artworks.map((title) => (
              <figure key={title} className="shrink-0">
                <div className="flex h-32 w-40 items-center justify-center overflow-hidden rounded-md bg-muted">
                  <span className="px-2 text-center text-sm font-medium text-muted-foreground">
                    {title}
                  </span>
                </div>
                <figcaption className="pt-2 text-xs text-muted-foreground">
                  Photo by{" "}
                  <span className="font-semibold text-foreground">
                    {title.split(" ")[0]} Studio
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    ),
  },
}
