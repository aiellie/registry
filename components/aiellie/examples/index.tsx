"use client"

import * as React from "react"

import { ModelSelectorDemo } from "@/components/aiellie/examples/chat/model-selector"
import { models } from "@/lib/models"

export { BubblesDemo } from "@/components/aiellie/examples/animation/bubbles"
export { GlassDemo } from "@/components/aiellie/examples/animation/glass"
export { LiquidDemo } from "@/components/aiellie/examples/animation/liquid"
export { AiOrbDemo } from "@/components/aiellie/examples/audio/ai-orb"
export { LiveWaveformDemo } from "@/components/aiellie/examples/audio/live-waveform"
export { MicSelectorDemo } from "@/components/aiellie/examples/audio/mic-selector"
export { SpeechInputDemo } from "@/components/aiellie/examples/audio/speech-input"
export { AttachmentDemo } from "@/components/aiellie/examples/chat/attachment"
export { BubbleDemo } from "@/components/aiellie/examples/chat/bubble"
export { MarkerDemo } from "@/components/aiellie/examples/chat/marker"
export { MessageDemo } from "@/components/aiellie/examples/chat/message"
export { MessageScrollerDemo } from "@/components/aiellie/examples/chat/message-scroller"
export { PromptInputDemo } from "@/components/aiellie/examples/chat/prompt-input"
export { FileTreeDemo } from "@/components/aiellie/examples/code/file-tree"
export { TerminalDemo } from "@/components/aiellie/examples/code/terminal"
export { FindInPageDemo } from "@/components/aiellie/examples/web/find-in-page"
export { WebPreviewDemo } from "@/components/aiellie/examples/web/web-preview"

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
