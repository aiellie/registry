import type { ComponentType } from "react"

// Every card the home grid renders, paired with the loading state it swaps to
// on the "F" key. Cards are compositions built out of the registry rather than
// registry items themselves — nothing installs a card — so their metadata
// lives here instead of in `lib/items.ts`, and their standalone previews are
// served from /demo/cards/<name> instead of /demo/<name>.
import { AgentRoster } from "./agent-roster"
import { AgentTrace } from "./agent-trace"
import { AiChat } from "./ai-chat"
import { ApiLatency } from "./api-latency"
import { ArtifactPreview } from "./artifact-preview"
import { BundleSize } from "./bundle-size"
import { CiChecks } from "./ci-checks"
import { CliSnippet } from "./cli-snippet"
import { CodeReview } from "./code-review"
import { CommitDetail } from "./commit-detail"
import { CommitHeatmap } from "./commit-heatmap"
import { ContextWindow } from "./context-window"
import { ContrastChecker } from "./contrast-checker"
import { DeployPipeline } from "./deploy-pipeline"
import { DesignTokens } from "./design-tokens"
import { EdgeRegions } from "./edge-regions"
import { EnvVars } from "./env-vars"
import { EvalScores } from "./eval-scores"
import { FileExplorer } from "./file-explorer"
import { IconGrid } from "./icon-grid"
import { InferenceParams } from "./inference-params"
import { InstallCommand } from "./install-command"
import { LoaderGallery } from "./loader-gallery"
import { OrbCard } from "./orb"
import { PackageUpdates } from "./package-updates"
import { PalettePicker } from "./palette-picker"
import { PullRequest } from "./pull-request"
import { RagSources } from "./rag-sources"
import { ReasoningTrace } from "./reasoning-trace"
import { ReleaseNotes } from "./release-notes"
import { ScheduleRun } from "./schedule-run"
import { SecretsVault } from "./secrets-vault"
import { SpacingScale } from "./spacing-scale"
import { StackTraceCard } from "./stack-trace-card"
import { TerminalBuild } from "./terminal-build"
import { TokenSpend } from "./token-spend"
import { TypeScale } from "./type-scale"
import { UIElements } from "./ui-elements"
import { UptimeMonitor } from "./uptime-monitor"
import { VoiceInput } from "./voice-input"
import { WebVitals } from "./web-vitals"
// Skeleton (loading) card variants
import { AgentRoster as SkeletonAgentRoster } from "./skeleton/agent-roster"
import { AgentTrace as SkeletonAgentTrace } from "./skeleton/agent-trace"
import { AiChat as SkeletonAiChat } from "./skeleton/ai-chat"
import { ApiLatency as SkeletonApiLatency } from "./skeleton/api-latency"
import { ArtifactPreview as SkeletonArtifactPreview } from "./skeleton/artifact-preview"
import { BundleSize as SkeletonBundleSize } from "./skeleton/bundle-size"
import { CiChecks as SkeletonCiChecks } from "./skeleton/ci-checks"
import { CliSnippet as SkeletonCliSnippet } from "./skeleton/cli-snippet"
import { CodeReview as SkeletonCodeReview } from "./skeleton/code-review"
import { CommitDetail as SkeletonCommitDetail } from "./skeleton/commit-detail"
import { CommitHeatmap as SkeletonCommitHeatmap } from "./skeleton/commit-heatmap"
import { ContextWindow as SkeletonContextWindow } from "./skeleton/context-window"
import { ContrastChecker as SkeletonContrastChecker } from "./skeleton/contrast-checker"
import { DeployPipeline as SkeletonDeployPipeline } from "./skeleton/deploy-pipeline"
import { DesignTokens as SkeletonDesignTokens } from "./skeleton/design-tokens"
import { EdgeRegions as SkeletonEdgeRegions } from "./skeleton/edge-regions"
import { EnvVars as SkeletonEnvVars } from "./skeleton/env-vars"
import { EvalScores as SkeletonEvalScores } from "./skeleton/eval-scores"
import { FileExplorer as SkeletonFileExplorer } from "./skeleton/file-explorer"
import { IconGrid as SkeletonIconGrid } from "./skeleton/icon-grid"
import { InferenceParams as SkeletonInferenceParams } from "./skeleton/inference-params"
import { InstallCommand as SkeletonInstallCommand } from "./skeleton/install-command"
import { LoaderGallery as SkeletonLoaderGallery } from "./skeleton/loader-gallery"
import { OrbCard as SkeletonOrbCard } from "./skeleton/orb"
import { PackageUpdates as SkeletonPackageUpdates } from "./skeleton/package-updates"
import { PalettePicker as SkeletonPalettePicker } from "./skeleton/palette-picker"
import { PullRequest as SkeletonPullRequest } from "./skeleton/pull-request"
import { RagSources as SkeletonRagSources } from "./skeleton/rag-sources"
import { ReasoningTrace as SkeletonReasoningTrace } from "./skeleton/reasoning-trace"
import { ReleaseNotes as SkeletonReleaseNotes } from "./skeleton/release-notes"
import { ScheduleRun as SkeletonScheduleRun } from "./skeleton/schedule-run"
import { SecretsVault as SkeletonSecretsVault } from "./skeleton/secrets-vault"
import { SpacingScale as SkeletonSpacingScale } from "./skeleton/spacing-scale"
import { StackTraceCard as SkeletonStackTraceCard } from "./skeleton/stack-trace-card"
import { TerminalBuild as SkeletonTerminalBuild } from "./skeleton/terminal-build"
import { TokenSpend as SkeletonTokenSpend } from "./skeleton/token-spend"
import { TypeScale as SkeletonTypeScale } from "./skeleton/type-scale"
import { UIElements as SkeletonUIElements } from "./skeleton/ui-elements"
import { UptimeMonitor as SkeletonUptimeMonitor } from "./skeleton/uptime-monitor"
import { VoiceInput as SkeletonVoiceInput } from "./skeleton/voice-input"
import { WebVitals as SkeletonWebVitals } from "./skeleton/web-vitals"

/** Thematic group for filtering / labelling showcase cards. */
export type CardCategory = "ai" | "code" | "design" | "web"

export interface CardEntry {
  /** Heading the preview dialog shows — the card's own title where it has one. */
  title: string
  /** One line on what the card is made of, shown under the title. */
  description: string
  /** Thematic group — AI, code tooling, design system, or web/ops. */
  category: CardCategory
  full: ComponentType
  skeleton: ComponentType
}

export const cards = {
  "agent-roster": {
    title: "Research Agent",
    description:
      "A subagent roster in collapsible rows, built on the agent primitive.",
    category: "ai",
    full: AgentRoster,
    skeleton: SkeletonAgentRoster,
  },
  "agent-trace": {
    title: "Agent Run",
    description:
      "A tool-call trace in collapsible rows, with status indicators and copy actions.",
    category: "ai",
    full: AgentTrace,
    skeleton: SkeletonAgentTrace,
  },
  "ai-chat": {
    title: "AI Chat",
    description:
      "A chat thread built from message bubbles, a scroll area and the prompt input.",
    category: "ai",
    full: AiChat,
    skeleton: SkeletonAiChat,
  },
  "api-latency": {
    title: "API Latency",
    description:
      "Per-endpoint latency with a dropdown filter and status indicators.",
    category: "web",
    full: ApiLatency,
    skeleton: SkeletonApiLatency,
  },
  "artifact-preview": {
    title: "Generated Artifact",
    description: "The artifact shell wrapping a syntax-highlighted code block.",
    category: "ai",
    full: ArtifactPreview,
    skeleton: SkeletonArtifactPreview,
  },
  "bundle-size": {
    title: "Bundle Size",
    description:
      "Bundle deltas with a comparison dropdown and copy-to-clipboard.",
    category: "code",
    full: BundleSize,
    skeleton: SkeletonBundleSize,
  },
  "ci-checks": {
    title: "Test Suites",
    description: "Collapsible test suites with spinners and pass/fail status.",
    category: "code",
    full: CiChecks,
    skeleton: SkeletonCiChecks,
  },
  "cli-snippet": {
    title: "Add a Component",
    description:
      "Install commands in the snippet primitive, switchable per package manager.",
    category: "code",
    full: CliSnippet,
    skeleton: SkeletonCliSnippet,
  },
  "code-review": {
    title: "Code Review",
    description:
      "Shiki-highlighted files behind a toggle group, with copy actions.",
    category: "code",
    full: CodeReview,
    skeleton: SkeletonCodeReview,
  },
  "commit-detail": {
    title: "Latest Commit",
    description:
      "A commit and its changed files, built on the commit primitive.",
    category: "code",
    full: CommitDetail,
    skeleton: SkeletonCommitDetail,
  },
  "commit-heatmap": {
    title: "Commit Heatmap",
    description:
      "A contribution grid with a toggle group range filter and per-day tooltips.",
    category: "code",
    full: CommitHeatmap,
    skeleton: SkeletonCommitHeatmap,
  },
  "context-window": {
    title: "Context Window",
    description:
      "Token budget usage broken down in a popover, with badges and tooltips.",
    category: "ai",
    full: ContextWindow,
    skeleton: SkeletonContextWindow,
  },
  "contrast-checker": {
    title: "Contrast Checker",
    description:
      "WCAG contrast ratios from two colour pickers, scored with status indicators.",
    category: "design",
    full: ContrastChecker,
    skeleton: SkeletonContrastChecker,
  },
  "deploy-pipeline": {
    title: "Deploy Pipeline",
    description:
      "Build stages with status indicators, a details popover and toasts.",
    category: "code",
    full: DeployPipeline,
    skeleton: SkeletonDeployPipeline,
  },
  "design-tokens": {
    title: "Colour Tokens",
    description:
      "The semantic oklch palette, with a toggle group and copy-on-click swatches.",
    category: "design",
    full: DesignTokens,
    skeleton: SkeletonDesignTokens,
  },
  "edge-regions": {
    title: "Edge Regions",
    description: "Region latency picked through a toggle group.",
    category: "web",
    full: EdgeRegions,
    skeleton: SkeletonEdgeRegions,
  },
  "env-vars": {
    title: "Environment Variables",
    description: "Masked environment values with badges and copy buttons.",
    category: "code",
    full: EnvVars,
    skeleton: SkeletonEnvVars,
  },
  "eval-scores": {
    title: "Eval Suite",
    description:
      "Eval results with score badges, a breakdown popover and spinners.",
    category: "ai",
    full: EvalScores,
    skeleton: SkeletonEvalScores,
  },
  "file-explorer": {
    title: "File Explorer",
    description: "The registry's file tree, with badges and tooltips.",
    category: "code",
    full: FileExplorer,
    skeleton: SkeletonFileExplorer,
  },
  "icon-grid": {
    title: "Icon Library",
    description:
      "A searchable icon grid built from an input group, with an empty state.",
    category: "design",
    full: IconGrid,
    skeleton: SkeletonIconGrid,
  },
  "inference-params": {
    title: "Inference",
    description:
      "Model parameters on sliders and switches, with labels and separators.",
    category: "ai",
    full: InferenceParams,
    skeleton: SkeletonInferenceParams,
  },
  "install-command": {
    title: "Install Command",
    description:
      "The install command for any registry item, in tabs with a select.",
    category: "code",
    full: InstallCommand,
    skeleton: SkeletonInstallCommand,
  },
  orb: {
    title: "Orb",
    description:
      "The WebGL orb, with a palette dropdown and playback controls.",
    category: "ai",
    full: OrbCard,
    skeleton: SkeletonOrbCard,
  },
  "loader-gallery": {
    title: "Loaders",
    description:
      "Every loader variant in one grid, with a switch to freeze them.",
    category: "design",
    full: LoaderGallery,
    skeleton: SkeletonLoaderGallery,
  },
  "package-updates": {
    title: "Dependency Updates",
    description:
      "Package upgrades in expandable rows, filtered by semver bump.",
    category: "code",
    full: PackageUpdates,
    skeleton: SkeletonPackageUpdates,
  },
  "palette-picker": {
    title: "Brand palette",
    description:
      "Brand colours edited through the colour picker, with a reset.",
    category: "design",
    full: PalettePicker,
    skeleton: SkeletonPalettePicker,
  },
  "pull-request": {
    title: "Pull Request",
    description:
      "A review flow with avatars, a collapsible diff, a review dialog and a merge confirmation.",
    category: "code",
    full: PullRequest,
    skeleton: SkeletonPullRequest,
  },
  "rag-sources": {
    title: "Retrieved Context",
    description:
      "Retrieved chunks in collapsibles, with a relevance slider and an empty state.",
    category: "ai",
    full: RagSources,
    skeleton: SkeletonRagSources,
  },
  "reasoning-trace": {
    title: "Reasoning",
    description: "A chain-of-thought trace that replays step by step.",
    category: "ai",
    full: ReasoningTrace,
    skeleton: SkeletonReasoningTrace,
  },
  "release-notes": {
    title: "Changelog",
    description:
      "Release notes led by the announcement badge, paged by version.",
    category: "code",
    full: ReleaseNotes,
    skeleton: SkeletonReleaseNotes,
  },
  "schedule-run": {
    title: "Scheduled Build",
    description:
      "A cron editor built from the time picker, a switch and day toggles.",
    category: "web",
    full: ScheduleRun,
    skeleton: SkeletonScheduleRun,
  },
  "secrets-vault": {
    title: "Environment",
    description:
      "Masked environment variables per target, on the env-vars primitive.",
    category: "web",
    full: SecretsVault,
    skeleton: SkeletonSecretsVault,
  },
  "spacing-scale": {
    title: "Spacing & Radius",
    description: "Spacing and radius steps driven by a density slider.",
    category: "design",
    full: SpacingScale,
    skeleton: SkeletonSpacingScale,
  },
  "stack-trace-card": {
    title: "Runtime Error",
    description: "A parsed stack trace with clickable frames and copy actions.",
    category: "code",
    full: StackTraceCard,
    skeleton: SkeletonStackTraceCard,
  },
  "terminal-build": {
    title: "Registry build",
    description:
      "A terminal running the registry build, with status indicators.",
    category: "code",
    full: TerminalBuild,
    skeleton: SkeletonTerminalBuild,
  },
  "token-spend": {
    title: "Token Spend",
    description:
      "Spend by model over a billing period, with a period dropdown and badges.",
    category: "ai",
    full: TokenSpend,
    skeleton: SkeletonTokenSpend,
  },
  "type-scale": {
    title: "Type Scale",
    description: "The type ramp, with a size slider and a font toggle group.",
    category: "design",
    full: TypeScale,
    skeleton: SkeletonTypeScale,
  },
  "ui-elements": {
    title: "UI Elements",
    description:
      "Buttons, fields, switches, tabs and menus — the primitives in one card.",
    category: "design",
    full: UIElements,
    skeleton: SkeletonUIElements,
  },
  "uptime-monitor": {
    title: "Uptime Monitor",
    description:
      "Daily uptime laid out in items, with a range toggle group and popovers.",
    category: "web",
    full: UptimeMonitor,
    skeleton: SkeletonUptimeMonitor,
  },
  "voice-input": {
    title: "Voice capture",
    description:
      "The live waveform with recording controls and status indicators.",
    category: "ai",
    full: VoiceInput,
    skeleton: SkeletonVoiceInput,
  },
  "web-vitals": {
    title: "Core Web Vitals",
    description:
      "Web vitals against their thresholds, with a toggle group, popovers and status.",
    category: "web",
    full: WebVitals,
    skeleton: SkeletonWebVitals,
  },
} satisfies Record<string, CardEntry>

export type CardName = keyof typeof cards

/** The `/demo/<name>` route a card's preview iframe loads. */
export function getCardPreviewName(name: CardName) {
  return `cards/${name}`
}
