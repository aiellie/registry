"use client"

import {
  AnimatedBots,
  Bot,
  CarrierBot,
  RollerBot,
  ScoutBot,
} from "@/components/animations/animated-bots"

/**
 * Card-sized bot scene: shorter walk durations than the component's default
 * scene so bots visibly cross the narrow showcase card.
 */
export function AnimatedBotsDemo() {
  return (
    <div className="mx-auto flex min-h-dvh w-xl max-w-full flex-col justify-center p-6">
      <div className="relative h-40 w-full overflow-hidden">
        <p className="pointer-events-none absolute inset-x-0 top-2 text-center text-[10px] text-muted-foreground">
          hover to startle · click to beep
        </p>
        <div className="absolute inset-x-0 bottom-9 border-t border-dashed" />
        <AnimatedBots sound className="bottom-9">
          <Bot duration="22s" delay="-8s" rest="24cqw">
            <CarrierBot />
          </Bot>
          <Bot duration="16s" delay="-3s" rest="58cqw">
            <ScoutBot />
          </Bot>
          <Bot duration="30s" delay="-17s" rest="76cqw" facing="left">
            <RollerBot />
          </Bot>
        </AnimatedBots>
      </div>
    </div>
  )
}
