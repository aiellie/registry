import { Copyright } from "@/components/copyright"
import { Latency } from "@/components/latency"
import { LoadStatus } from "@/components/load-status"
import { NyClock } from "@/components/ny-clock"

export function RegistryFooter() {
  return (
    <footer className="fixed bottom-0 z-50 w-full border-t border-border bg-background/30 backdrop-blur-md">
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
