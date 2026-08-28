"use client"

import { Orb } from "@/components/ai/orb"

export function OrbDemo() {
  // Orb already centers itself in a viewport-height wrapper; this only caps
  // how wide it may run, matching the other examples.
  return (
    <div className="mx-auto w-xl max-w-full">
      <Orb />
    </div>
  )
}
