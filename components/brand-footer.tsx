import { Copyright } from "@/components/copyright"
import { Latency } from "@/components/latency"
import { LoadStatus } from "@/components/load-status"
import { NyClock } from "@/components/ny-clock"
import { ModeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function BrandFooter() {
  return (
    <footer className="fixed bottom-0 z-50 w-full border-t border-border bg-background">
      <div className="flex h-8 items-center justify-between gap-2 px-3 sm:px-4">
        {/* Shrinks and ellipsizes; the status cluster never gives up space. */}
        <Copyright className="min-w-0 truncate" />
        <div className="ms-auto flex shrink-0 items-center gap-2 sm:gap-4">
          <Latency />
          <span className="h-3 w-px shrink-0 bg-border" />
          <NyClock />
          <span className="h-3 w-px shrink-0 bg-border" />
          <LoadStatus />
          <span className="h-3 w-px shrink-0 bg-border" />
          <ModeToggle />
          <span className="h-3 w-px shrink-0 bg-border" />
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  nativeButton={false}
                  className="size-auto h-auto w-auto shrink-0 rounded-full p-0 text-muted-foreground hover:bg-transparent hover:opacity-80"
                  render={
                    <a
                      href="https://aiellie.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                />
              }
            >
              <img
                src="/avatars/aiellie.png"
                alt="AiEllie"
                width={20}
                height={20}
                className="size-5 rounded-full"
              />
              <span className="sr-only">AiEllie</span>
            </TooltipTrigger>
            <TooltipContent>AiEllie</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </footer>
  )
}
