"use client"

import { useState } from "react"

import { Bubble } from "@/components/canvasui/Bubble"

type Preset = "clear" | "azure" | "rose" | "gold"

// Every preset sets both `tint` and `tintStrength` explicitly so switching
// away from a tint actually clears it — Bubble's `setOptions` only overrides
// the keys it receives, so an omitted `tintStrength` would otherwise stay
// applied.
const presets: Record<
  Preset,
  { tint: [number, number, number]; tintStrength: number }
> = {
  clear: { tint: [1, 1, 1], tintStrength: 0 },
  azure: { tint: [0.5, 0.7, 1], tintStrength: 0.4 },
  rose: { tint: [1, 0.6, 0.75], tintStrength: 0.4 },
  gold: { tint: [1, 0.85, 0.5], tintStrength: 0.4 },
}

export function BubblesDemo() {
  const [preset, setPreset] = useState<Preset>("clear")
  const { tint, tintStrength } = presets[preset]

  return (
    <div className="relative h-80 w-full overflow-hidden rounded-xl">
      <Bubble
        tint={tint}
        tintStrength={tintStrength}
        style={{ position: "absolute", inset: 0 }}
      >
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: "url(/brand/aiellie.clouds.png)" }}
        />
      </Bubble>

      {/* Tint selector — sits above the bubble canvas so it stays interactive. */}
      <div className="absolute top-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {(Object.keys(presets) as Preset[]).map((p) => (
          <button
            key={p}
            onClick={() => setPreset(p)}
            className={`rounded-full px-3 py-1 font-sans text-[10px] capitalize transition-colors ${
              preset === p
                ? "bg-white text-neutral-900"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  )
}
