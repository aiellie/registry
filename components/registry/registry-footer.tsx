import { Copyright } from "@/components/copyright"
import { Latency } from "@/components/latency"
import { LoadStatus } from "@/components/load-status"
import { NyClock } from "@/components/ny-clock"
import { FooterBots } from "@/components/registry/footer-bots"
import { cn } from "@/lib/utils"

export function RegistryFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        // overflow-x-clip keeps bots entering offscreen from painting past the
        // sides; y stays visible so chirp bubbles can rise into the section
        // above (overflow-hidden would clip them at the bar's top edge).
        "relative z-50 w-full overflow-x-clip border-t border-border bg-background/30 backdrop-blur-md",
        className
      )}
    >
      <FooterBots className="opacity-70" />

      {/* Transparent to clicks so the bots stay reachable through the gaps;
          the readouts opt back in to keep their text selectable. Each is
          wrapped so <FooterBots> has a box to measure and climb. */}
      <div className="pointer-events-none relative flex h-14 items-center justify-between px-4">
        <div data-bot-step className="pointer-events-auto">
          <Copyright />
        </div>

        <div className="flex items-center gap-4">
          <div data-bot-step className="pointer-events-auto">
            <Latency />
          </div>
          <span className="h-3 w-px bg-border" />
          <div data-bot-step className="pointer-events-auto shrink-0">
            <NyClock />
          </div>
          <span className="h-3 w-px bg-border" />
          <div data-bot-step className="pointer-events-auto shrink-0">
            <LoadStatus />
          </div>
        </div>
      </div>
    </footer>
  )
}
