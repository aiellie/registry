import { Icons } from "@/components/icons/icons"
import { PromptInput } from "@/components/prompt-input"

export default function DashboardPage() {
  return (
    <div className="flex min-h-full flex-col items-center px-4">
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-6 text-center">
          <Icons.elephant
            aria-hidden
            className="size-12 text-muted-foreground/40"
          />
          <div className="text-2xl tracking-tight text-balance">
            Where should we start?
          </div>
        </div>
      </div>
      <div className="w-full max-w-3xl pb-6">
        <PromptInput />
      </div>
    </div>
  )
}
