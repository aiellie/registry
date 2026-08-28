"use client"

import { useCallback, useState } from "react"
import { Example, ExampleWrapper } from "@/components/example"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockDownloadButton,
  CodeBlockFilename,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/code/code-block"
import {
  CodeBlockLanguageSelector,
  CodeBlockLanguageSelectorContent,
  CodeBlockLanguageSelectorItem,
  CodeBlockLanguageSelectorList,
  CodeBlockLanguageSelectorTrigger,
  CodeBlockLanguageSelectorValue,
} from "@/components/code/code-language-selector"
import { getIconForLanguageExtension } from "@/components/icons/icons"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { BundledLanguage } from "shiki"

const codeExamples = {
  go: {
    code: `package main

import "fmt"

func greet(name string) string {
    return fmt.Sprintf("Hello, %s!", name)
}

func main() {
    fmt.Println(greet("World"))
}`,
    filename: "greet.go",
  },
  python: {
    code: `def greet(name: str) -> str:
    return f"Hello, {name}!"

print(greet("World"))`,
    filename: "greet.py",
  },
  rust: {
    code: `fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

fn main() {
    println!("{}", greet("World"));
}`,
    filename: "greet.rs",
  },
  typescript: {
    code: `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`,
    filename: "greet.ts",
  },
} as const

type Language = keyof typeof codeExamples

const languages: { value: Language; label: string }[] = [
  { label: "TypeScript", value: "typescript" },
  { label: "Python", value: "python" },
  { label: "Rust", value: "rust" },
  { label: "Go", value: "go" },
]

const handleCopy = () => {
  console.log("Copied code to clipboard")
}

const handleCopyError = () => {
  console.error("Failed to copy code to clipboard")
}

export default function CodeBlockExample() {
  const [language, setLanguage] = useState<Language>("typescript")
  const { code, filename } = codeExamples[language]

  const handleLanguageChange = useCallback((value: unknown) => {
    if (typeof value === "string") setLanguage(value as Language)
  }, [])

  return (
    <ExampleWrapper className="min-h-svh grid-cols-1 place-content-center place-items-center md:grid-cols-1">
      <div className="border-none w-full max-w-lg">
        <CodeBlock
          code={code}
          language={language as BundledLanguage}
          showLineNumbers
        >
          <CodeBlockHeader>
            <CodeBlockTitle>
              <span className="flex size-3.5 shrink-0 items-center justify-center [&_svg]:size-3.5">
                {getIconForLanguageExtension(language)}
              </span>
              <CodeBlockFilename>{filename}</CodeBlockFilename>
            </CodeBlockTitle>
            <CodeBlockActions>
              <CodeBlockLanguageSelector
                items={languages.map((lang) => lang.value)}
                onValueChange={handleLanguageChange}
                value={language}
              >
                <CodeBlockLanguageSelectorTrigger>
                  <CodeBlockLanguageSelectorValue>
                    {(value) => {
                      const languageValue =
                        typeof value === "string" ? value : null
                      const active = languages.find(
                        (lang) => lang.value === languageValue
                      )
                      return languageValue ? (
                        <span className="flex min-w-0 items-center gap-1.5">
                          <span className="flex size-3.5 shrink-0 items-center justify-center [&_svg]:size-3.5">
                            {getIconForLanguageExtension(languageValue)}
                          </span>
                          <span className="truncate">
                            {active?.label ?? languageValue}
                          </span>
                        </span>
                      ) : null
                    }}
                  </CodeBlockLanguageSelectorValue>
                </CodeBlockLanguageSelectorTrigger>
                <CodeBlockLanguageSelectorContent>
                  <CodeBlockLanguageSelectorList>
                    {(item: Language) => {
                      const lang = languages.find(
                        (entry) => entry.value === item
                      )
                      return (
                        <CodeBlockLanguageSelectorItem key={item} value={item}>
                          {lang?.label ?? item}
                        </CodeBlockLanguageSelectorItem>
                      )
                    }}
                  </CodeBlockLanguageSelectorList>
                </CodeBlockLanguageSelectorContent>
              </CodeBlockLanguageSelector>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <CodeBlockDownloadButton filename={filename} />
                  }
                />
                <TooltipContent>Download code</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <CodeBlockCopyButton
                      onCopy={handleCopy}
                      onError={handleCopyError}
                    />
                  }
                />
                <TooltipContent>Copy code</TooltipContent>
              </Tooltip>
            </CodeBlockActions>
          </CodeBlockHeader>
        </CodeBlock>
      </div>
    </ExampleWrapper>
  )
}
