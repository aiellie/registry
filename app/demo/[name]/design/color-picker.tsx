"use client"

import { useState } from "react"

import { ColorPicker, type ColorFormat } from "@/components/design/color-picker"
import { Example, ExampleWrapper } from "@/components/example"

const SWATCHES = ["#f97316", "#22c55e", "#3b82f6", "#a855f7"]

function ColorField({
  label,
  defaultValue,
  defaultFormat,
  opacity,
  onChange,
}: {
  label: string
  defaultValue: string
  defaultFormat?: ColorFormat
  opacity?: boolean
  onChange?: (value: string) => void
}) {
  const [color, setColor] = useState(defaultValue)

  return (
    <div className="flex h-9 w-full items-center justify-between rounded-lg bg-muted/60 px-3 transition-colors hover:bg-muted/80">
      <span className="text-[12.5px] font-medium text-foreground/90">
        {label}
      </span>
      <ColorPicker
        label={label}
        value={color}
        onValueChange={(next) => {
          setColor(next)
          onChange?.(next)
        }}
        defaultFormat={defaultFormat}
        opacity={opacity}
      />
    </div>
  )
}

export default function ColorPickerExample() {
  const [palette, setPalette] = useState(SWATCHES)
  const [scrim, setScrim] = useState("#0f172ab3")

  return (
    <ExampleWrapper>
      <Example title="Default">
        <ColorField label="Brand" defaultValue="#6366f1" />
      </Example>

      <Example title="Notations">
        <ColorField label="RGB" defaultValue="#f97316" defaultFormat="rgb" />
        <ColorField label="HSL" defaultValue="#0ea5e9" defaultFormat="hsl" />
        <ColorField
          label="OKLCH"
          defaultValue="#22c55e"
          defaultFormat="oklch"
        />
      </Example>

      <Example title="Swatches">
        <div className="flex items-center gap-3">
          {palette.map((color, index) => (
            <ColorPicker
              key={index}
              label={`Swatch ${index + 1}`}
              value={color}
              hideValue
              className="**:size-8"
              onValueChange={(next) =>
                setPalette((prev) =>
                  prev.map((item, i) => (i === index ? next : item))
                )
              }
            />
          ))}
        </div>
      </Example>

      <Example title="Opacity">
        {/* A scrim is the case that needs the arc: the color is only half the
         * decision, and you cannot judge the other half without the thing it
         * is sitting on top of. */}
        <div className="relative isolate w-full overflow-hidden rounded-xl">
          <div className="h-24 w-full bg-[linear-gradient(120deg,#f97316,#a855f7_45%,#0ea5e9)]" />
          <div
            className="absolute inset-0 flex items-end p-3"
            style={{ backgroundColor: scrim }}
          >
            <span className="text-[12.5px] font-medium text-white">
              Legible at any brightness underneath
            </span>
          </div>
        </div>
        <ColorField
          label="Scrim"
          defaultValue="#0f172ab3"
          onChange={setScrim}
          opacity
        />
        <ColorField
          label="Tint"
          defaultValue="#f9731666"
          defaultFormat="rgb"
          opacity
        />
      </Example>

      <Example title="Custom label">
        <ColorField label="Surface" defaultValue="#e0e7ff" />
        <ColorField label="Accent" defaultValue="#4f46e5" />
      </Example>
    </ExampleWrapper>
  )
}