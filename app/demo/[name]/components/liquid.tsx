"use client"

import { useState } from "react"

import { Liquid } from "@/components/canvasui/Liquid"

type Preset = "rainbow" | "indigo" | "emerald" | "rose"

// Every preset sets both `rainbow` and `color` explicitly so switching away from
// rainbow actually clears it — Liquid's `setOptions` only overrides the keys it
// receives, so an omitted `rainbow` would otherwise stay on.
const presets: Record<
  Preset,
  { rainbow: boolean; color: [number, number, number] }
> = {
  rainbow: { rainbow: true, color: [0.31, 0.275, 0.898] },
  indigo: { rainbow: false, color: [0.31, 0.275, 0.898] },
  emerald: { rainbow: false, color: [0.063, 0.725, 0.506] },
  rose: { rainbow: false, color: [0.957, 0.247, 0.369] },
}

export default function LiquidExample() {
  const [preset, setPreset] = useState<Preset>("rainbow")
  const { rainbow, color } = presets[preset]

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-neutral-950">
      <Liquid
        rainbow={rainbow}
        color={color}
        style={{ position: "absolute", inset: 0 }}
      >
        <div className="flex h-full w-full select-none flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-white/50">
            Canvas UI
          </span>
          <h1 className="text-6xl font-semibold tracking-tight text-white sm:text-8xl">
            Liquid
          </h1>
          <p className="max-w-md text-balance text-sm leading-relaxed text-white/50">
            A pointer-driven fluid simulation rendered over live HTML. Move your
            cursor across the surface to stir the flow.
          </p>
        </div>
      </Liquid>

      {/* Preset selector — sits above the fluid canvas so it stays interactive. */}
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
