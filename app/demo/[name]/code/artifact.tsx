"use client"

import { Example, ExampleWrapper } from "@/components/example"
import {
  Artifact,
  ArtifactAction,
  ArtifactActions,
  ArtifactClose,
  ArtifactContent,
  ArtifactDescription,
  ArtifactHeader,
  ArtifactTitle,
} from "@/components/code/artifact"
import { CodeBlock } from "@/components/code/code-block"
import { Badge } from "@/components/ui/badge"
import {
  ArrowExpand01Icon,
  Copy01Icon,
  Download04Icon,
  PencilEdit01Icon,
  RefreshIcon,
  Share01Icon,
} from "@hugeicons/core-free-icons"

export default function ArtifactExample() {
  return (
    <ExampleWrapper className="w-full lg:grid-cols-2 2xl:grid-cols-2">
      <ArtifactBasic />
      <ArtifactWithDescription />
      <ArtifactWithActions />
      <ArtifactWithCode />
    </ExampleWrapper>
  )
}

function ArtifactBasic({ className }: { className?: string }) {
  return (
    <Example title="Basic" containerClassName={className}>
      <Artifact>
        <ArtifactHeader>
          <ArtifactTitle>Release notes</ArtifactTitle>
          <ArtifactClose />
        </ArtifactHeader>
        <ArtifactContent>
          <p className="text-sm text-muted-foreground">
            The registry now ships every component with logical properties, so
            layouts mirror correctly under RTL without a second stylesheet.
          </p>
        </ArtifactContent>
      </Artifact>
    </Example>
  )
}

function ArtifactWithDescription({ className }: { className?: string }) {
  return (
    <Example title="With Description" containerClassName={className}>
      <Artifact>
        <ArtifactHeader>
          <div className="min-w-0">
            <ArtifactTitle>Onboarding checklist</ArtifactTitle>
            <ArtifactDescription>
              Draft · updated 2 minutes ago
            </ArtifactDescription>
          </div>
          <ArtifactActions>
            <ArtifactAction icon={PencilEdit01Icon} tooltip="Edit" />
            <ArtifactClose />
          </ArtifactActions>
        </ArtifactHeader>
        <ArtifactContent>
          <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
            <li>Install the theme item</li>
            <li>Add the components you need</li>
            <li>Wire up the MCP server</li>
          </ol>
        </ArtifactContent>
      </Artifact>
    </Example>
  )
}

function ArtifactWithActions({ className }: { className?: string }) {
  return (
    <Example title="With Actions" containerClassName={className}>
      <Artifact>
        <ArtifactHeader>
          <ArtifactTitle>Quarterly summary</ArtifactTitle>
          <ArtifactActions>
            <ArtifactAction icon={Copy01Icon} tooltip="Copy" />
            <ArtifactAction icon={Download04Icon} tooltip="Download" />
            <ArtifactAction icon={Share01Icon} tooltip="Share" />
            <ArtifactAction icon={ArrowExpand01Icon} tooltip="Expand" />
            <ArtifactClose />
          </ArtifactActions>
        </ArtifactHeader>
        <ArtifactContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Adoption grew across every surface this quarter, with the registry
            accounting for most of the new installs.
          </p>
          <p className="text-sm text-muted-foreground">
            Icon coverage doubled after the HugeIcons migration.
          </p>
        </ArtifactContent>
      </Artifact>
    </Example>
  )
}

const artifactCode = `import { streamText } from "ai"

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: "claude-opus-5",
    messages,
  })

  return result.toUIMessageStreamResponse()
}`

function ArtifactWithCode({ className }: { className?: string }) {
  return (
    <Example title="Code Artifact" containerClassName={className}>
      <Artifact>
        <ArtifactHeader>
          <div className="flex min-w-0 items-center gap-2">
            <ArtifactTitle className="truncate">route.ts</ArtifactTitle>
            <Badge className="font-mono text-[10px]" variant="secondary">
              ts
            </Badge>
          </div>
          <ArtifactActions>
            <ArtifactAction icon={RefreshIcon} tooltip="Regenerate" />
            <ArtifactAction icon={Copy01Icon} tooltip="Copy code" />
            <ArtifactClose />
          </ArtifactActions>
        </ArtifactHeader>
        <ArtifactContent className="p-0">
          <CodeBlock
            className="rounded-none border-0"
            code={artifactCode}
            language="typescript"
            showLineNumbers
          />
        </ArtifactContent>
      </Artifact>
    </Example>
  )
}
