import { Separator } from "@/components/ui/separator"

export const separator = {
  name: "separator",
  components: {
    Default: (
      <div className="flex w-full justify-center p-6">
        <div className="w-full max-w-xs">
          <div className="space-y-1">
            <h4 className="text-sm leading-none font-medium">Base Nova UI</h4>
            <p className="text-sm text-muted-foreground">
              A design system built on Base UI primitives.
            </p>
          </div>
          <Separator className="my-4" />
          <div className="flex h-5 items-center gap-4 text-sm">
            <div>Blog</div>
            <Separator orientation="vertical" />
            <div>Docs</div>
            <Separator orientation="vertical" />
            <div>Source</div>
          </div>
        </div>
      </div>
    ),
  },
}
