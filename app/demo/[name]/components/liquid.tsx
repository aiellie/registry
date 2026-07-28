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
    <div className="relative min-h-screen w-full overflow-hidden">
      <Liquid
        rainbow={rainbow}
        color={color}
        style={{ position: "absolute", inset: 0 }}
      >
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: "url(/brand/aiellie.clouds.png)" }}
        />
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
