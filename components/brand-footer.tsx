import { Copyright } from "@/components/copyright"
import { Latency } from "@/components/latency"
import { LoadStatus } from "@/components/load-status"
import { NyClock } from "@/components/ny-clock"
import { ModeToggle } from "@/components/theme-toggle"

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
        </div>
      </div>
    </footer>
  )
}
