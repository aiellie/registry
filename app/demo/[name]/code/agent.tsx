"use client"

import { Example, ExampleWrapper } from "@/components/example"
import {
  Agent,
  AgentAvatar,
  AgentContent,
  AgentHeader,
  AgentInstructions,
  AgentOutput,
  AgentSkill,
  AgentSkills,
  AgentSubagent,
  AgentSubagents,
  AgentTool,
  AgentTools,
} from "@/components/code/agent"
import { AvatarFallback } from "@/components/ui/avatar"
import {
  ArtificialIntelligence03Icon,
  CheckmarkBadge01Icon,
  PencilEdit02Icon,
  Telescope01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { tool } from "ai"
import { z } from "zod"

const searchTool = tool({
  description: "Search the web for recent results",
  inputSchema: z.object({
    query: z.string().describe("The search query"),
    limit: z.number().int().min(1).max(20).default(5).describe("Result count"),
  }),
})

const fetchPageTool = tool({
  description: "Fetch a URL and return its readable contents",
  inputSchema: z.object({
    url: z.string().url().describe("The absolute URL to fetch"),
  }),
})

const citeTool = tool({
  description: "Record a citation for a claim in the final answer",
  inputSchema: z.object({
    claim: z.string().describe("The claim being supported"),
    source: z.string().url().describe("The URL backing the claim"),
  }),
})

/* Each subagent spells out its full avatar recipe — Tailwind needs complete
   class names in source. The border lives on the Avatar root's `after` pseudo. */
const subagents = [
  {
    name: "Scout",
    model: "claude-haiku-4-5",
    description:
      "Sweeps the web in parallel and returns a shortlist of promising URLs.",
    tools: ["search", "fetch_page"],
    icon: Telescope01Icon,
    root: "after:border-violet-200",
    fallback: "bg-violet-500/5 text-violet-500",
  },
  {
    name: "Fact Checker",
    model: "claude-sonnet-5",
    description:
      "Re-reads each cited source and refutes any claim it cannot verify.",
    tools: ["fetch_page", "cite"],
    icon: CheckmarkBadge01Icon,
    root: "after:border-emerald-200",
    fallback: "bg-emerald-500/5 text-emerald-500",
  },
  {
    name: "Editor",
    model: "claude-haiku-4-5",
    description:
      "Collapses the verified findings into the final answer and trims filler.",
    tools: ["cite"],
    icon: PencilEdit02Icon,
    root: "after:border-amber-200",
    fallback: "bg-amber-500/5 text-amber-500",
  },
]

const outputSchema = `z.object({
  sentiment: z.enum(['positive', 'negative', 'neutral']),
  score: z.number(),
  summary: z.string(),
})`

export default function AgentExample() {
  return (
    <ExampleWrapper className="min-h-svh grid-cols-1 place-content-center place-items-center md:grid-cols-1">
      <Example className="border-none" containerClassName="w-full max-w-xl">
        <Agent>
          <AgentHeader
            description="Answers open questions from the live web and cites every claim it makes."
            model="claude-sonnet-5"
            name="Research Agent"
          >
            <AgentAvatar className="after:border-blue-200">
              <AvatarFallback className="bg-blue-500/5 text-blue-500">
                <HugeiconsIcon
                  className="size-4"
                  icon={ArtificialIntelligence03Icon}
                  strokeWidth={2}
                />
              </AvatarFallback>
            </AgentAvatar>
          </AgentHeader>
          <AgentContent>
            <AgentInstructions defaultValue={[""]}>
              Research the question using the tools available. Cite every
              factual claim, and stop once you have three independent sources.
            </AgentInstructions>
            <AgentTools defaultValue={[""]}>
              <AgentTool tool={searchTool} value="search" />
              <AgentTool tool={fetchPageTool} value="fetch_page" />
              <AgentTool tool={citeTool} value="cite" />
            </AgentTools>
            <AgentSkills defaultValue={[""]}>
              <AgentSkill
                description="Rank sources by recency, independence, and publisher reputation before quoting them."
                name="Source Vetting"
                value="source-vetting"
              />
              <AgentSkill
                description="Collapse overlapping findings into a single narrative and flag where sources disagree."
                name="Synthesis"
                value="synthesis"
              />
            </AgentSkills>
            <AgentOutput defaultValue={[""]} schema={outputSchema} />
          </AgentContent>
          <AgentSubagents>
            {subagents.map((subagent) => (
              <AgentSubagent
                className={subagent.root}
                description={subagent.description}
                key={subagent.name}
                model={subagent.model}
                name={subagent.name}
                tools={subagent.tools}
              >
                <AvatarFallback className={subagent.fallback}>
                  <HugeiconsIcon
                    className="size-4"
                    icon={subagent.icon}
                    strokeWidth={2}
                  />
                </AvatarFallback>
              </AgentSubagent>
            ))}
          </AgentSubagents>
        </Agent>
      </Example>
    </ExampleWrapper>
  )
}
