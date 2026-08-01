"use client"

import * as React from "react"

import {
  Example,
  ExampleWrapper,
} from "@/components/example"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export default function SliderExample() {
  return (
    <ExampleWrapper>
      <SliderBasic />
      <SliderRange />
      <SliderMultiple />
      <SliderVertical />
      <SliderControlled />
      <SliderDisabled />
    </ExampleWrapper>
  )
}

function SliderBasic({ className }: { className?: string }) {
  return (
    <Example title="Basic" containerClassName={className}>
      <Slider defaultValue={50} max={100} step={1} />
    </Example>
  )
}

function SliderRange({ className }: { className?: string }) {
  return (
    <Example title="Range" containerClassName={className}>
      <Slider defaultValue={[25, 50]} max={100} step={5} />
    </Example>
  )
}

function SliderMultiple({ className }: { className?: string }) {
  return (
    <Example title="Multiple Thumbs" containerClassName={className}>
      <Slider defaultValue={[10, 20, 70]} max={100} step={10} />
    </Example>
  )
}

function SliderVertical({ className }: { className?: string }) {
  return (
    <Example title="Vertical" containerClassName={className}>
      <div className="flex items-center gap-6">
        <Slider
          defaultValue={[50]}
          max={100}
          step={1}
          orientation="vertical"
          className="h-40"
        />
        <Slider
          defaultValue={[25]}
          max={100}
          step={1}
          orientation="vertical"
          className="h-40"
        />
      </div>
    </Example>
  )
}

function SliderControlled({ className }: { className?: string }) {
  const [value, setValue] = React.useState([0.3, 0.7])

  return (
    <Example title="Controlled" containerClassName={className}>
      <div className="grid w-full gap-3">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="slider-demo-temperature">Temperature</Label>
          <span className="text-sm text-muted-foreground">
            {value.join(", ")}
          </span>
        </div>
        <Slider
          id="slider-demo-temperature"
          value={value}
          onValueChange={(value) => setValue(value as number[])}
          min={0}
          max={1}
          step={0.1}
        />
      </div>
    </Example>
  )
}

function SliderDisabled({ className }: { className?: string }) {
  return (
    <Example title="Disabled" containerClassName={className}>
      <Slider defaultValue={[50]} max={100} step={1} disabled />
    </Example>
  )
}
