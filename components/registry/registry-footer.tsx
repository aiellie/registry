import { Copyright } from "@/components/copyright"
import { Latency } from "@/components/latency"
import { LoadStatus } from "@/components/load-status"
import { NyClock } from "@/components/ny-clock"
import { cn } from "@/lib/utils"

export function RegistryFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "z-50 w-full border-t border-border bg-background/30 backdrop-blur-md",
        className
      )}
    >
      <div className="flex h-10 items-center justify-between px-4">
        <Copyright />

        <div className="flex items-center gap-4">
          <Latency />
          <span className="h-3 w-px bg-border" />
          <NyClock />
          <span className="h-3 w-px bg-border" />
          <LoadStatus />
        </div>
      </div>
    </footer>
  )
}
