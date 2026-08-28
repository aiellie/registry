import * as React from "react"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"

import { cn } from "@/lib/utils"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  orientation = "horizontal",
  label,
  showValue = label != null,
  formatValue,
  ticks = 0,
  onValueChange,
  onValueCommitted,
  ...props
}: SliderPrimitive.Root.Props & {
  /** Sits inside the track, on the leading edge of the row. */
  label?: React.ReactNode
  /** Reads the value out on the trailing edge. On by default with a `label`. */
  showValue?: boolean
  /** Formats the readout, e.g. `(_, values) => `${values[0]}%``. */
  formatValue?: (
    formattedValues: readonly string[],
    values: readonly number[]
  ) => React.ReactNode
  /** Evenly spaced marks drawn inside the track (0 to hide). */
  ticks?: number
}) {
  const thumbCount = Array.isArray(value)
    ? value.length
    : Array.isArray(defaultValue)
      ? defaultValue.length
      : 1

  const isVertical = orientation === "vertical"

  // On a single-thumb slider Base UI reports a bare `number` from pointer
  // drags but an array from the keyboard, regardless of the shape that went in
  // (`resolveThumbCollision` short-circuits when there is one thumb). Report
  // back whichever shape the caller supplied so handlers can trust it.
  const isArrayValue = Array.isArray(value) || Array.isArray(defaultValue)
  const asCallerShape = (next: number | readonly number[]) => {
    const values = typeof next === "number" ? [next] : next
    return isArrayValue ? values : values[0]
  }

  return (
    <SliderPrimitive.Root
      className={cn(
        "select-none data-horizontal:w-full data-vertical:h-full",
        className
      )}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      orientation={orientation}
      thumbAlignment="edge"
      {...props}
      onValueChange={
        onValueChange &&
        ((next, details) => onValueChange(asCallerShape(next), details))
      }
      onValueCommitted={
        onValueCommitted &&
        ((next, details) => onValueCommitted(asCallerShape(next), details))
      }
    >
      <SliderPrimitive.Control className="group/slider relative flex cursor-pointer touch-none items-center select-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-horizontal:h-7 data-horizontal:w-full data-vertical:h-full data-vertical:min-h-40 data-vertical:w-8 data-vertical:flex-col">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative h-full w-full overflow-hidden rounded-lg bg-muted/60 outline-offset-2 transition-colors select-none group-hover/slider:not-data-disabled:bg-muted/80 group-data-dragging/slider:bg-muted/80 group-has-[:focus-visible]/slider:outline-2 group-has-[:focus-visible]/slider:outline-ring"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="rounded-lg bg-foreground/10 select-none data-horizontal:h-full data-vertical:w-full"
          />
          {ticks > 0 && (
            <div aria-hidden className="pointer-events-none absolute inset-0">
              {Array.from({ length: ticks }, (_, index) => {
                const position = ((index + 1) / (ticks + 1)) * 100
                return (
                  <div
                    key={position}
                    className={cn(
                      "absolute rounded-full bg-foreground/20",
                      isVertical
                        ? "left-1/2 h-px w-1.5 translate-x-[-50%] translate-y-1/2"
                        : "top-1/2 h-1.5 w-px translate-x-[-50%] translate-y-[-50%]"
                    )}
                    style={
                      isVertical
                        ? { bottom: `${position}%` }
                        : { insetInlineStart: `${position}%` }
                    }
                  />
                )
              })}
            </div>
          )}
        </SliderPrimitive.Track>

        {Array.from({ length: thumbCount }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className={cn(
              // Idle, the handle is a faint tick; it only comes forward once
              // the row is hovered, dragged, or focused.
              "z-2 block shrink-0 scale-[0.7] cursor-grab rounded-full bg-foreground/90 opacity-20 transition-[opacity,scale] duration-200 ease-out select-none after:absolute after:-inset-2",
              "group-hover/slider:scale-100 group-hover/slider:opacity-80 data-dragging:scale-100 data-dragging:opacity-80 has-[:focus-visible]:scale-100 has-[:focus-visible]:opacity-100",
              "focus-visible:outline-hidden active:cursor-grabbing data-disabled:pointer-events-none",
              isVertical ? "h-1 w-4" : "h-4 w-1"
            )}
          />
        ))}

        {(label != null || showValue) && (
          // A 32px-wide vertical column has no room for a row label, so it
          // stays for screen readers only.
          <div
            className={
              isVertical
                ? "sr-only"
                : "pointer-events-none absolute inset-0 z-3 flex items-center justify-between gap-2 px-3"
            }
          >
            {label != null && (
              <SliderPrimitive.Label
                data-slot="slider-label"
                className="truncate text-[12.5px] font-medium text-foreground/90"
              >
                {label}
              </SliderPrimitive.Label>
            )}
            {showValue && (
              <SliderPrimitive.Value
                data-slot="slider-value"
                className="ms-auto shrink-0 text-[12.5px] font-medium text-muted-foreground tabular-nums"
              >
                {formatValue}
              </SliderPrimitive.Value>
            )}
          </div>
        )}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
