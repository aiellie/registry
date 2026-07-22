import { PromptInput } from "@/components/prompt-input"

export default function DashboardPage() {
  return (
    <div className="flex min-h-[calc(100dvh-var(--header-height)-var(--footer-height))] flex-col items-center justify-center gap-8 px-4">
      <div className="text-center text-2xl tracking-tight text-balance">
        Where should we start?
      </div>
      <PromptInput />
    </div>
  )
}
