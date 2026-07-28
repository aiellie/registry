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
    <div className="relative min-h-screen w-full overflow-hidden">
      <Glass
        {...preset}
        ior={1.5}
        zoom={1.6}
        style={{ position: "absolute", inset: 0 }}
      >
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: "url(/brand/aiellie.clouds.png)" }}
        />
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
