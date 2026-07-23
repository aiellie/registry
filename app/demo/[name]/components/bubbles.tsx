"use client"

import { useState } from "react"

import { Bubble } from "@/components/canvasui/Bubble"

type Preset = "clear" | "azure" | "rose" | "gold"

// Every preset sets both `tint` and `tintStrength` explicitly so switching away
// from a tint actually clears it — Bubble's `setOptions` only overrides the keys
// it receives, so an omitted `tintStrength` would otherwise stay applied.
const presets: Record<
  Preset,
  { tint: [number, number, number]; tintStrength: number }
> = {
  clear: { tint: [1, 1, 1], tintStrength: 0 },
  azure: { tint: [0.5, 0.7, 1], tintStrength: 0.4 },
  rose: { tint: [1, 0.6, 0.75], tintStrength: 0.4 },
  gold: { tint: [1, 0.85, 0.5], tintStrength: 0.4 },
}

export default function BubblesExample() {
  const [preset, setPreset] = useState<Preset>("clear")
  const { tint, tintStrength } = presets[preset]

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-neutral-950">
      <Bubble
        tint={tint}
        tintStrength={tintStrength}
        style={{ position: "absolute", inset: 0 }}
      >
        <div className="flex h-full w-full select-none flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-white/50">
            Canvas UI
          </span>
          <h1 className="text-6xl font-semibold tracking-tight text-white sm:text-8xl">
            Bubbles
          </h1>
          <p className="max-w-md text-balance text-sm leading-relaxed text-white/50">
            A trail of refractive metaballs that chases your cursor over live
            HTML. Move across the surface to stretch and merge the bubbles.
          </p>
        </div>
      </Bubble>

      {/* Tint selector — sits above the bubble canvas so it stays interactive. */}
      <div className="absolute left-1/2 top-6 z-10 flex -translate-x-1/2 gap-2">
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
