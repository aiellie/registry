"use client"

import { ChartBuilder, defaultSeries, visitors } from "@/components/chart"
import { Example, ExampleWrapper } from "@/components/example"

export default function ChartExample() {
  return (
    <ExampleWrapper className="grid-cols-1">
      <Example title="Chart" containerClassName="col-span-full">
        <ChartBuilder data={visitors} series={defaultSeries} />
      </Example>
    </ExampleWrapper>
  )
}
