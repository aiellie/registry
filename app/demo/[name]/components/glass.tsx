"use client"

import { useState } from "react"

import { Glass } from "@/components/canvasui/Glass"

type Shape = "circle" | "square" | "rectangle"

// Each shape sets every key it varies (shape, size, aspect, corner) so switching
// away fully overrides the previous shape — Glass's `setOptions` only overrides
// the keys it receives, so an omitted key would otherwise linger.
const shapes: Record<
  Shape,
  { shape: Shape; size: number; aspect: number; corner: number }
> = {
  circle: { shape: "circle", size: 110, aspect: 1.7, corner: 32 },
  square: { shape: "square", size: 110, aspect: 1, corner: 36 },
  rectangle: { shape: "rectangle", size: 92, aspect: 1.9, corner: 46 },
}

export default function GlassExample() {
  const [shape, setShape] = useState<Shape>("circle")
  const preset = shapes[shape]

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-neutral-950">
      <Glass
        {...preset}
        ior={1.5}
        zoom={1.6}
        style={{ position: "absolute", inset: 0 }}
      >
        <div className="flex h-full w-full select-none flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-white/50">
            Canvas UI
          </span>
          <h1
            data-glass-target
            className="text-6xl font-semibold tracking-tight text-white sm:text-8xl"
          >
            Glass
          </h1>
          <p className="max-w-md text-balance text-sm leading-relaxed text-white/50">
            A refractive lens rendered over live HTML. Move your cursor to drag
            the lens across the surface, and hover the title to trigger the
            crystal-ball zoom.
          </p>
        </div>
      </Glass>

      {/* Shape selector — sits above the glass canvas so it stays interactive. */}
      <div className="absolute left-1/2 top-6 z-10 flex -translate-x-1/2 gap-2">
        {(Object.keys(shapes) as Shape[]).map((s) => (
          <button
            key={s}
            onClick={() => setShape(s)}
            className={`rounded-full px-3 py-1 font-sans text-[10px] capitalize transition-colors ${
              shape === s
                ? "bg-white text-neutral-900"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
