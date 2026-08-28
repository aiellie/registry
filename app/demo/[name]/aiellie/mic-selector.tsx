"use client"

import * as React from "react"

import {
  MicSelector,
  MicSelectorContent,
  MicSelectorEmpty,
  MicSelectorInput,
  MicSelectorItem,
  MicSelectorLabel,
  MicSelectorList,
  MicSelectorTrigger,
  MicSelectorValue,
} from "@/components/ai-elements/mic-selector"
import { Example, ExampleWrapper } from "@/components/example"

export default function MicSelectorExample() {
  return (
    <ExampleWrapper>
      <Default />
      <Controlled />
    </ExampleWrapper>
  )
}

function DeviceList() {
  return (
    <MicSelectorContent>
      <MicSelectorInput />
      <MicSelectorEmpty />
      <MicSelectorList>
        {(devices) =>
          devices.map((device) => (
            <MicSelectorItem key={device.deviceId} value={device.deviceId}>
              <MicSelectorLabel device={device} />
            </MicSelectorItem>
          ))
        }
      </MicSelectorList>
    </MicSelectorContent>
  )
}

function Default({ className }: { className?: string }) {
  return (
    <Example title="Default" containerClassName={className}>
      <MicSelector>
        <MicSelectorTrigger className="w-full max-w-sm">
          <MicSelectorValue />
        </MicSelectorTrigger>
        <DeviceList />
      </MicSelector>
    </Example>
  )
}

function Controlled({ className }: { className?: string }) {
  const [value, setValue] = React.useState<string | undefined>(undefined)

  return (
    <Example title="Controlled" containerClassName={className}>
      <div className="flex w-full max-w-sm flex-col gap-3">
        <MicSelector onValueChange={setValue} value={value}>
          <MicSelectorTrigger className="w-full">
            <MicSelectorValue />
          </MicSelectorTrigger>
          <DeviceList />
        </MicSelector>
        <p className="truncate text-xs text-muted-foreground">
          {value ? `deviceId: ${value}` : "No microphone selected."}
        </p>
      </div>
    </Example>
  )
}
