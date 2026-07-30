"use client"

import * as React from "react"

import { SpeechInput } from "@/components/ai-elements/speech-input"
import { Input } from "@/components/ui/input"

export function SpeechInputDemo() {
  const [value, setValue] = React.useState("")

  return (
    <div className="flex w-full max-w-sm flex-col gap-4 py-6">
      <div className="flex w-full items-center gap-2">
        <Input
          onChange={(event) => setValue(event.target.value)}
          placeholder="Speak or type..."
          value={value}
        />
        <SpeechInput
          onTranscriptionChange={(text) =>
            setValue((current) => (current ? `${current} ${text}` : text))
          }
          size="icon"
        />
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Tap the mic and start talking.
      </p>
    </div>
  )
}
