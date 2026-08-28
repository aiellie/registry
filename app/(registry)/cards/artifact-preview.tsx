"use client"

import * as React from "react"
import {
  Copy01Icon,
  Download04Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons"

import {
  Artifact,
  ArtifactAction,
  ArtifactActions,
  ArtifactContent,
  ArtifactDescription,
  ArtifactHeader,
  ArtifactTitle,
} from "@/components/code/artifact"
import { CodeBlock } from "@/components/code/code-block"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { toast } from "@/components/ui/toast"

const VARIANTS = {
  tsx: {
    label: "Component",
    language: "tsx" as const,
    code: `export function Callout({ title, children }: CalloutProps) {
  return (
    <aside className="rounded-lg bg-muted p-4">
      <p className="font-medium">{title}</p>
      <div className="text-muted-foreground">{children}</div>
    </aside>
  )
}`,
  },
  css: {
    label: "Tokens",
    language: "css" as const,
    code: `@theme inline {
  --color-callout: var(--muted);
  --radius-callout: 0.625rem;
}`,
  },
}

type VariantKey = keyof typeof VARIANTS

export function ArtifactPreview() {
  const [variant, setVariant] = React.useState<VariantKey>("tsx")
  const active = VARIANTS[variant]

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(active.code)
      toast.add({ title: "Artifact copied", type: "success" })
    } catch {
      toast.add({ title: "Couldn't reach the clipboard", type: "error" })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Artifact</CardTitle>
        <CardDescription>Produced by the last turn</CardDescription>
        <CardAction>
          <ToggleGroup
            value={[variant]}
            onValueChange={(value) => {
              const next = (value as string[])[0]
              if (next) setVariant(next as VariantKey)
            }}
          >
            {(Object.keys(VARIANTS) as VariantKey[]).map((key) => (
              <ToggleGroupItem
                key={key}
                value={key}
                className="px-2 text-[11px]"
              >
                {VARIANTS[key].label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CardAction>
      </CardHeader>

      <CardContent>
        <Artifact>
          <ArtifactHeader>
            <div className="min-w-0">
              <ArtifactTitle className="truncate">callout.tsx</ArtifactTitle>
              <ArtifactDescription className="truncate">
                {active.label} · {active.code.split("\n").length} lines
              </ArtifactDescription>
            </div>
            <ArtifactActions>
              <ArtifactAction
                icon={Copy01Icon}
                label="Copy artifact"
                tooltip="Copy artifact"
                onClick={() => void copy()}
              />
              <ArtifactAction
                icon={RefreshIcon}
                label="Regenerate artifact"
                tooltip="Regenerate"
                onClick={() =>
                  setVariant((current) => (current === "tsx" ? "css" : "tsx"))
                }
              />
              <ArtifactAction
                icon={Download04Icon}
                label="Download artifact"
                tooltip="Download"
                onClick={() =>
                  toast.add({ title: "Download started", type: "success" })
                }
              />
            </ArtifactActions>
          </ArtifactHeader>
          <ArtifactContent className="p-0">
            <CodeBlock code={active.code} language={active.language} />
          </ArtifactContent>
        </Artifact>
      </CardContent>

      <CardFooter>
        <span className="truncate text-xs text-muted-foreground">
          Ready to add to <span className="font-mono">components/ui</span>
        </span>
      </CardFooter>
    </Card>
  )
}
