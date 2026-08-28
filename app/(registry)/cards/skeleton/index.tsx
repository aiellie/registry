import { AgentTrace } from "./agent-trace"
import { ApiLatency } from "./api-latency"
import { BundleSize } from "./bundle-size"
import { CiChecks } from "./ci-checks"
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
import { PalettePicker } from "./palette-picker"
import { PullRequest } from "./pull-request"
import { RagSources } from "./rag-sources"
import { SpacingScale } from "./spacing-scale"
import { TerminalBuild } from "./terminal-build"
import { TokenSpend } from "./token-spend"
import { TypeScale } from "./type-scale"
import { UIElements } from "./ui-elements"
import { UptimeMonitor } from "./uptime-monitor"
import { VoiceInput } from "./voice-input"
import { WebVitals } from "./web-vitals"

export function CardsSkeletonDemo() {
  return (
    <div
      data-slot="demo"
      className="theme-neutral relative flex w-full max-w-none flex-col gap-(--gap) bg-muted p-12 pb-0! [--gap:--spacing(8)] 3xl:[--gap:--spacing(8)] min-[1900px]:[--gap:--spacing(10)]! lg:p-8 lg:[--gap:--spacing(6)] xl:p-12 dark:bg-muted/30"
    >
      <div className="relative z-10 mx-auto grid gap-(--gap) **:data-[slot=card]:w-full min-[1900px]:grid-cols-5! md:max-w-3xl md:grid-cols-2 lg:max-w-none lg:grid-cols-3 xl:max-w-[1600px] xl:grid-cols-4 2xl:max-w-[1900px]">
        <div className="flex flex-col items-start gap-(--gap)">
          <UIElements />
          <InstallCommand />
          <ContextWindow />
          <CommitHeatmap />
        </div>
        <div className="hidden flex-col gap-(--gap) lg:flex">
          <FileExplorer />
          <DeployPipeline />
          <TokenSpend />
          <ContrastChecker />
        </div>
        <div className="hidden flex-col gap-(--gap) 3xl:flex!">
          <PullRequest />
          <PalettePicker />
          <EvalScores />
          <BundleSize />
        </div>
        <div className="hidden flex-col gap-(--gap) md:flex">
          <TerminalBuild />
          <AgentTrace />
          <TypeScale />
          <CiChecks />
        </div>
        <div className="hidden flex-col gap-(--gap) xl:flex">
          <VoiceInput />
          <UptimeMonitor />
          <InferenceParams />
          <WebVitals />
          <SpacingScale />
          <DesignTokens />
          <RagSources />
          <EnvVars />
          <ApiLatency />
          <EdgeRegions />
          <IconGrid />
        </div>
      </div>
      <div className="absolute inset-x-0 top-0 z-1 h-80 bg-linear-to-b from-background via-muted to-transparent dark:via-muted/30" />
      <div className="absolute inset-x-0 bottom-0 z-20 h-80 bg-linear-to-t from-background via-muted to-transparent dark:via-muted/30" />
    </div>
  )
}
