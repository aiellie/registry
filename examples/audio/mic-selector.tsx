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

export function MicSelectorDemo() {
  const [value, setValue] = React.useState<string | undefined>(undefined)

  return (
    <div className="flex w-full max-w-sm flex-col gap-3 py-6">
      <MicSelector onValueChange={setValue} value={value}>
        <MicSelectorTrigger className="w-full">
          <MicSelectorValue />
        </MicSelectorTrigger>
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
      </MicSelector>
      <p className="truncate text-xs text-muted-foreground">
        {value ? `deviceId: ${value}` : "No microphone selected."}
      </p>
    </div>
  )
}
