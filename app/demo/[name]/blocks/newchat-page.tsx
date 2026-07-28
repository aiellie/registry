import { PromptInput } from "@/components/prompt-input"

export default function NewChatPage() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-8 px-4">
      <div className="text-center text-2xl tracking-tight text-balance">
        Where should we begin?
      </div>
      <PromptInput />
    </div>
  )
}
