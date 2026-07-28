"use client"

import * as React from "react"

import { SpeechInput } from "@/components/ai-elements/speech-input"
import { Example, ExampleWrapper } from "@/components/example"
import { Input } from "@/components/ui/input"

export default function SpeechInputExample() {
  return (
    <ExampleWrapper>
      <Default />
      <VoiceToText />
      <Sizes />
    </ExampleWrapper>
  )
}

function Default() {
  const [transcript, setTranscript] = React.useState("")

  return (
    <Example title="Default">
      <div className="flex w-full flex-col items-center gap-4">
        <SpeechInput onTranscriptionChange={setTranscript} size="icon" />
        <p className="text-center text-sm text-muted-foreground">
          {transcript || "Tap the mic and start talking."}
        </p>
      </div>
    </Example>
  )
}

function VoiceToText() {
  const [value, setValue] = React.useState("")

  return (
    <Example title="Voice to text">
      <div className="flex w-full max-w-sm items-center gap-2">
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
    </Example>
  )
}

function Sizes() {
  return (
    <Example title="Sizes">
      <div className="flex w-full items-center justify-center gap-4">
        <SpeechInput size="icon-sm" />
        <SpeechInput size="icon" />
        <SpeechInput size="icon-lg" />
      </div>
    </Example>
  )
}
