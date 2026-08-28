"use client"

import { ExampleWrapper } from "@/components/example"
import {
  Snippet,
  SnippetAddon,
  SnippetCopyButton,
  SnippetInput,
  SnippetText,
} from "@/components/code/snippet"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const commands = [
  {
    code: "pnpm dlx shadcn@latest add @aiellie/snippet",
    prompt: "$",
  },
] satisfies {
  code: string
  prompt: string
}[]

const handleCopy = () => {
  console.log("Copied command to clipboard")
}

const handleCopyError = () => {
  console.error("Failed to copy command to clipboard")
}

export default function SnippetExample() {
  return (
    <ExampleWrapper className="min-h-svh grid-cols-1 place-content-center place-items-center md:grid-cols-1">
      <div className="w-full max-w-md space-y-3 border-none">
        {commands.map((command) => (
          <Snippet code={command.code} key={command.code}>
            <SnippetAddon>
              <SnippetText>{command.prompt}</SnippetText>
            </SnippetAddon>
            <SnippetInput />
            <SnippetAddon align="inline-end">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <SnippetCopyButton
                      onCopy={handleCopy}
                      onError={handleCopyError}
                    />
                  }
                />
                <TooltipContent>Copy command</TooltipContent>
              </Tooltip>
            </SnippetAddon>
          </Snippet>
        ))}
      </div>
    </ExampleWrapper>
  )
}
