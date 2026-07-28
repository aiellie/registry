import { PromptInput } from "@/components/prompt-input"

export default function DashboardPage() {
  return (
    <div className="flex min-h-full flex-col items-center px-4">
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center text-2xl tracking-tight text-balance">
          Where should we start?
        </div>
      </div>
      <div className="w-full max-w-3xl pb-6">
        <PromptInput />
      </div>
    </div>
  )
}
