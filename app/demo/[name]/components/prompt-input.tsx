import { PromptInput } from "@/components/prompt-input"

export const promptInput = {
  name: "prompt-input",
  components: {
    Default: (
      <div className="flex min-h-[480px] w-full items-end justify-center py-10">
        <PromptInput />
      </div>
    ),
  },
}
