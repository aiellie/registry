"use client"

import * as React from "react"

import { ModelSelectorDemo } from "@/examples/chat/model-selector"
import { models } from "@/lib/models"

export { AnimatedBotsDemo } from "@/examples/animation/animated-bots"
export { BubblesDemo } from "@/examples/animation/bubbles"
export { GlassDemo } from "@/examples/animation/glass"
export { LiquidDemo } from "@/examples/animation/liquid"
export { OrbDemo } from "@/examples/audio/orb"
export { LiveWaveformDemo } from "@/examples/audio/live-waveform"
export { MicSelectorDemo } from "@/examples/audio/mic-selector"
export { SpeechInputDemo } from "@/examples/audio/speech-input"
export { AttachmentDemo } from "@/examples/chat/attachment"
export { BubbleDemo } from "@/examples/chat/bubble"
export { MarkerDemo } from "@/examples/chat/marker"
export { MessageDemo } from "@/examples/chat/message"
export { MessageScrollerDemo } from "@/examples/chat/message-scroller"
export { PromptInputDemo } from "@/examples/chat/prompt-input"
export { FileTreeDemo } from "@/examples/code/file-tree"
export { TerminalDemo } from "@/examples/code/terminal"
export { ColorPickerDemo } from "@/examples/design/color-picker"
export { FindInPageDemo } from "@/examples/web/find-in-page"
export { WebPreviewDemo } from "@/examples/web/web-preview"

/**
 * `ModelSelectorDemo` is controlled; the home grid renders demos without
 * props, so this wrapper owns the model/effort/fast state itself.
 */
export function ModelSelectorExample() {
  const [model, setModel] = React.useState(models[0]?.id ?? "")
  const [effort, setEffort] = React.useState("medium")
  const [fast, setFast] = React.useState(false)

  return (
    <ModelSelectorDemo
      model={model}
      onModelChange={setModel}
      effort={effort}
      onEffortChange={setEffort}
      fast={fast}
      onFastChange={setFast}
    />
  )
}
