import type { ReactNode } from "react"

import { AccountAccess } from "@/app/(registry)/cards/account-access"
import { CardsActivityGoal } from "@/app/(registry)/cards/activity-goal"
import { AgentRoster } from "@/app/(registry)/cards/agent-roster"
import { AgentTrace } from "@/app/(registry)/cards/agent-trace"
import { AiChat } from "@/app/(registry)/cards/ai-chat"
import { AnalyticsCard } from "@/app/(registry)/cards/analytics-card"
import { ApiLatency } from "@/app/(registry)/cards/api-latency"
import { ArtifactPreview } from "@/app/(registry)/cards/artifact-preview"
import { BundleSize } from "@/app/(registry)/cards/bundle-size"
import { CardsCalendar } from "@/app/(registry)/cards/calendar"
import { CardsChat } from "@/app/(registry)/cards/chat"
import { CiChecks } from "@/app/(registry)/cards/ci-checks"
import { ClaimableBalance } from "@/app/(registry)/cards/claimable-balance"
import { CliSnippet } from "@/app/(registry)/cards/cli-snippet"
import { CodeReview } from "@/app/(registry)/cards/code-review"
import { CommitDetail } from "@/app/(registry)/cards/commit-detail"
import { CommitHeatmap } from "@/app/(registry)/cards/commit-heatmap"
import { ContextWindow } from "@/app/(registry)/cards/context-window"
import { ContrastChecker } from "@/app/(registry)/cards/contrast-checker"
import { ContributionHistory } from "@/app/(registry)/cards/contribution-history"
import { CardsCookieSettings } from "@/app/(registry)/cards/cookie-settings"
import { CardsCreateAccount } from "@/app/(registry)/cards/create-account"
import { DeployPipeline } from "@/app/(registry)/cards/deploy-pipeline"
import { DesignTokens } from "@/app/(registry)/cards/design-tokens"
import { DividendIncome } from "@/app/(registry)/cards/dividend-income"
import { EdgeRegions } from "@/app/(registry)/cards/edge-regions"
import { EmptyDistributeTrack } from "@/app/(registry)/cards/empty-distribute-track"
import { EnvVars } from "@/app/(registry)/cards/env-vars"
import { EvalScores } from "@/app/(registry)/cards/eval-scores"
import { CardsExerciseMinutes } from "@/app/(registry)/cards/exercise-minutes"
import { FileExplorer } from "@/app/(registry)/cards/file-explorer"
import { CardsForms } from "@/app/(registry)/cards/forms"
import { IconGrid } from "@/app/(registry)/cards/icon-grid"
import { InferenceParams } from "@/app/(registry)/cards/inference-params"
import { InstallCommand } from "@/app/(registry)/cards/install-command"
import { LoaderGallery } from "@/app/(registry)/cards/loader-gallery"
import { MessageScrollerDemo } from "@/app/(registry)/cards/message-scroller"
import MessageScrollerCompleteCard from "@/app/(registry)/cards/message-scroller-complete"
import ModelSelectorCommandCard from "@/app/(registry)/cards/model-selector-command"
import { NewMilestone } from "@/app/(registry)/cards/new-milestone"
import { NotificationSettings } from "@/app/(registry)/cards/notification-settings"
import { OrbCard } from "@/app/(registry)/cards/orb"
import { PackageUpdates } from "@/app/(registry)/cards/package-updates"
import { PalettePicker } from "@/app/(registry)/cards/palette-picker"
import { CardsPaymentMethod } from "@/app/(registry)/cards/payment-method"
import { Payments } from "@/app/(registry)/cards/payments"
import { PayoutThreshold } from "@/app/(registry)/cards/payout-threshold"
import { PowerUsage } from "@/app/(registry)/cards/power-usage"
import { PullRequest } from "@/app/(registry)/cards/pull-request"
import { QrConnect } from "@/app/(registry)/cards/qr-connect"
import { RagSources } from "@/app/(registry)/cards/rag-sources"
import { ReasoningTrace } from "@/app/(registry)/cards/reasoning-trace"
import { ReleaseNotes } from "@/app/(registry)/cards/release-notes"
import { CardsReportIssue } from "@/app/(registry)/cards/report-issue"
import { SavingsTargets } from "@/app/(registry)/cards/savings-targets"
import { ScheduleRun } from "@/app/(registry)/cards/schedule-run"
import { SecretsVault } from "@/app/(registry)/cards/secrets-vault"
import { CardsShare } from "@/app/(registry)/cards/share"
import { SidebarNav } from "@/app/(registry)/cards/sidebar-nav"
import { SpacingScale } from "@/app/(registry)/cards/spacing-scale"
import { StackTraceCard } from "@/app/(registry)/cards/stack-trace-card"
import { CardsStats } from "@/app/(registry)/cards/stats"
import { CardsTeamMembers } from "@/app/(registry)/cards/team-members"
import { TerminalBuild } from "@/app/(registry)/cards/terminal-build"
import { TokenSpend } from "@/app/(registry)/cards/token-spend"
import { TransferFunds } from "@/app/(registry)/cards/transfer-funds"
import { TypeScale } from "@/app/(registry)/cards/type-scale"
import { UIElements } from "@/app/(registry)/cards/ui-elements"
import { UptimeMonitor } from "@/app/(registry)/cards/uptime-monitor"
import { VoiceInput } from "@/app/(registry)/cards/voice-input"
import { WebVitals } from "@/app/(registry)/cards/web-vitals"

/**
 * Mirrors the home grid's surface and column width, so a card previewed on
 * its own looks like where it came from. Also used by /demo/cards/<name>.
 */
export function CardFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background bg-[radial-gradient(color-mix(in_oklch,var(--border)_70%,transparent)_1px,transparent_1px)] bg-size-[16px_16px] p-6 dark:bg-background">
      <div className="w-full max-w-sm **:data-[slot=card]:w-full">
        {children}
      </div>
    </div>
  )
}

/** Demo entries for every `<name>-card` registry block, keyed by registry name. */
export const cardDemos = {
  "account-access-card": {
    name: "account-access-card",
    components: {
      Default: (
        <CardFrame>
          <AccountAccess />
        </CardFrame>
      ),
    },
  },
  "activity-goal-card": {
    name: "activity-goal-card",
    components: {
      Default: (
        <CardFrame>
          <CardsActivityGoal />
        </CardFrame>
      ),
    },
  },
  "agent-roster-card": {
    name: "agent-roster-card",
    components: {
      Default: (
        <CardFrame>
          <AgentRoster />
        </CardFrame>
      ),
    },
  },
  "agent-trace-card": {
    name: "agent-trace-card",
    components: {
      Default: (
        <CardFrame>
          <AgentTrace />
        </CardFrame>
      ),
    },
  },
  "ai-chat-card": {
    name: "ai-chat-card",
    components: {
      Default: (
        <CardFrame>
          <AiChat />
        </CardFrame>
      ),
    },
  },
  "analytics-card": {
    name: "analytics-card",
    components: {
      Default: (
        <CardFrame>
          <AnalyticsCard />
        </CardFrame>
      ),
    },
  },
  "api-latency-card": {
    name: "api-latency-card",
    components: {
      Default: (
        <CardFrame>
          <ApiLatency />
        </CardFrame>
      ),
    },
  },
  "artifact-preview-card": {
    name: "artifact-preview-card",
    components: {
      Default: (
        <CardFrame>
          <ArtifactPreview />
        </CardFrame>
      ),
    },
  },
  "bundle-size-card": {
    name: "bundle-size-card",
    components: {
      Default: (
        <CardFrame>
          <BundleSize />
        </CardFrame>
      ),
    },
  },
  "calendar-card": {
    name: "calendar-card",
    components: {
      Default: (
        <CardFrame>
          <CardsCalendar />
        </CardFrame>
      ),
    },
  },
  "chat-card": {
    name: "chat-card",
    components: {
      Default: (
        <CardFrame>
          <CardsChat />
        </CardFrame>
      ),
    },
  },
  "ci-checks-card": {
    name: "ci-checks-card",
    components: {
      Default: (
        <CardFrame>
          <CiChecks />
        </CardFrame>
      ),
    },
  },
  "claimable-balance-card": {
    name: "claimable-balance-card",
    components: {
      Default: (
        <CardFrame>
          <ClaimableBalance />
        </CardFrame>
      ),
    },
  },
  "cli-snippet-card": {
    name: "cli-snippet-card",
    components: {
      Default: (
        <CardFrame>
          <CliSnippet />
        </CardFrame>
      ),
    },
  },
  "code-review-card": {
    name: "code-review-card",
    components: {
      Default: (
        <CardFrame>
          <CodeReview />
        </CardFrame>
      ),
    },
  },
  "commit-detail-card": {
    name: "commit-detail-card",
    components: {
      Default: (
        <CardFrame>
          <CommitDetail />
        </CardFrame>
      ),
    },
  },
  "commit-heatmap-card": {
    name: "commit-heatmap-card",
    components: {
      Default: (
        <CardFrame>
          <CommitHeatmap />
        </CardFrame>
      ),
    },
  },
  "context-window-card": {
    name: "context-window-card",
    components: {
      Default: (
        <CardFrame>
          <ContextWindow />
        </CardFrame>
      ),
    },
  },
  "contrast-checker-card": {
    name: "contrast-checker-card",
    components: {
      Default: (
        <CardFrame>
          <ContrastChecker />
        </CardFrame>
      ),
    },
  },
  "contribution-history-card": {
    name: "contribution-history-card",
    components: {
      Default: (
        <CardFrame>
          <ContributionHistory />
        </CardFrame>
      ),
    },
  },
  "cookie-settings-card": {
    name: "cookie-settings-card",
    components: {
      Default: (
        <CardFrame>
          <CardsCookieSettings />
        </CardFrame>
      ),
    },
  },
  "create-account-card": {
    name: "create-account-card",
    components: {
      Default: (
        <CardFrame>
          <CardsCreateAccount />
        </CardFrame>
      ),
    },
  },
  "deploy-pipeline-card": {
    name: "deploy-pipeline-card",
    components: {
      Default: (
        <CardFrame>
          <DeployPipeline />
        </CardFrame>
      ),
    },
  },
  "design-tokens-card": {
    name: "design-tokens-card",
    components: {
      Default: (
        <CardFrame>
          <DesignTokens />
        </CardFrame>
      ),
    },
  },
  "dividend-income-card": {
    name: "dividend-income-card",
    components: {
      Default: (
        <CardFrame>
          <DividendIncome />
        </CardFrame>
      ),
    },
  },
  "edge-regions-card": {
    name: "edge-regions-card",
    components: {
      Default: (
        <CardFrame>
          <EdgeRegions />
        </CardFrame>
      ),
    },
  },
  "empty-distribute-track-card": {
    name: "empty-distribute-track-card",
    components: {
      Default: (
        <CardFrame>
          <EmptyDistributeTrack />
        </CardFrame>
      ),
    },
  },
  "env-vars-card": {
    name: "env-vars-card",
    components: {
      Default: (
        <CardFrame>
          <EnvVars />
        </CardFrame>
      ),
    },
  },
  "eval-scores-card": {
    name: "eval-scores-card",
    components: {
      Default: (
        <CardFrame>
          <EvalScores />
        </CardFrame>
      ),
    },
  },
  "exercise-minutes-card": {
    name: "exercise-minutes-card",
    components: {
      Default: (
        <CardFrame>
          <CardsExerciseMinutes />
        </CardFrame>
      ),
    },
  },
  "file-explorer-card": {
    name: "file-explorer-card",
    components: {
      Default: (
        <CardFrame>
          <FileExplorer />
        </CardFrame>
      ),
    },
  },
  "forms-card": {
    name: "forms-card",
    components: {
      Default: (
        <CardFrame>
          <CardsForms />
        </CardFrame>
      ),
    },
  },
  "icon-grid-card": {
    name: "icon-grid-card",
    components: {
      Default: (
        <CardFrame>
          <IconGrid />
        </CardFrame>
      ),
    },
  },
  "inference-params-card": {
    name: "inference-params-card",
    components: {
      Default: (
        <CardFrame>
          <InferenceParams />
        </CardFrame>
      ),
    },
  },
  "install-command-card": {
    name: "install-command-card",
    components: {
      Default: (
        <CardFrame>
          <InstallCommand />
        </CardFrame>
      ),
    },
  },
  "loader-gallery-card": {
    name: "loader-gallery-card",
    components: {
      Default: (
        <CardFrame>
          <LoaderGallery />
        </CardFrame>
      ),
    },
  },
  "message-scroller-card": {
    name: "message-scroller-card",
    components: {
      Default: (
        <CardFrame>
          <MessageScrollerDemo />
        </CardFrame>
      ),
    },
  },
  "message-scroller-complete-card": {
    name: "message-scroller-complete-card",
    components: {
      Default: (
        <CardFrame>
          <MessageScrollerCompleteCard />
        </CardFrame>
      ),
    },
  },
  "model-selector-command-card": {
    name: "model-selector-command-card",
    components: {
      Default: (
        <CardFrame>
          <ModelSelectorCommandCard />
        </CardFrame>
      ),
    },
  },
  "new-milestone-card": {
    name: "new-milestone-card",
    components: {
      Default: (
        <CardFrame>
          <NewMilestone />
        </CardFrame>
      ),
    },
  },
  "notification-settings-card": {
    name: "notification-settings-card",
    components: {
      Default: (
        <CardFrame>
          <NotificationSettings />
        </CardFrame>
      ),
    },
  },
  "orb-card": {
    name: "orb-card",
    components: {
      Default: (
        <CardFrame>
          <OrbCard />
        </CardFrame>
      ),
    },
  },
  "package-updates-card": {
    name: "package-updates-card",
    components: {
      Default: (
        <CardFrame>
          <PackageUpdates />
        </CardFrame>
      ),
    },
  },
  "palette-picker-card": {
    name: "palette-picker-card",
    components: {
      Default: (
        <CardFrame>
          <PalettePicker />
        </CardFrame>
      ),
    },
  },
  "payment-method-card": {
    name: "payment-method-card",
    components: {
      Default: (
        <CardFrame>
          <CardsPaymentMethod />
        </CardFrame>
      ),
    },
  },
  "payments-card": {
    name: "payments-card",
    components: {
      Default: (
        <CardFrame>
          <Payments />
        </CardFrame>
      ),
    },
  },
  "payout-threshold-card": {
    name: "payout-threshold-card",
    components: {
      Default: (
        <CardFrame>
          <PayoutThreshold />
        </CardFrame>
      ),
    },
  },
  "power-usage-card": {
    name: "power-usage-card",
    components: {
      Default: (
        <CardFrame>
          <PowerUsage />
        </CardFrame>
      ),
    },
  },
  "pull-request-card": {
    name: "pull-request-card",
    components: {
      Default: (
        <CardFrame>
          <PullRequest />
        </CardFrame>
      ),
    },
  },
  "qr-connect-card": {
    name: "qr-connect-card",
    components: {
      Default: (
        <CardFrame>
          <QrConnect />
        </CardFrame>
      ),
    },
  },
  "rag-sources-card": {
    name: "rag-sources-card",
    components: {
      Default: (
        <CardFrame>
          <RagSources />
        </CardFrame>
      ),
    },
  },
  "reasoning-trace-card": {
    name: "reasoning-trace-card",
    components: {
      Default: (
        <CardFrame>
          <ReasoningTrace />
        </CardFrame>
      ),
    },
  },
  "release-notes-card": {
    name: "release-notes-card",
    components: {
      Default: (
        <CardFrame>
          <ReleaseNotes />
        </CardFrame>
      ),
    },
  },
  "report-issue-card": {
    name: "report-issue-card",
    components: {
      Default: (
        <CardFrame>
          <CardsReportIssue />
        </CardFrame>
      ),
    },
  },
  "savings-targets-card": {
    name: "savings-targets-card",
    components: {
      Default: (
        <CardFrame>
          <SavingsTargets />
        </CardFrame>
      ),
    },
  },
  "schedule-run-card": {
    name: "schedule-run-card",
    components: {
      Default: (
        <CardFrame>
          <ScheduleRun />
        </CardFrame>
      ),
    },
  },
  "secrets-vault-card": {
    name: "secrets-vault-card",
    components: {
      Default: (
        <CardFrame>
          <SecretsVault />
        </CardFrame>
      ),
    },
  },
  "share-card": {
    name: "share-card",
    components: {
      Default: (
        <CardFrame>
          <CardsShare />
        </CardFrame>
      ),
    },
  },
  "sidebar-nav-card": {
    name: "sidebar-nav-card",
    components: {
      Default: (
        <CardFrame>
          <SidebarNav />
        </CardFrame>
      ),
    },
  },
  "spacing-scale-card": {
    name: "spacing-scale-card",
    components: {
      Default: (
        <CardFrame>
          <SpacingScale />
        </CardFrame>
      ),
    },
  },
  "stack-trace-card": {
    name: "stack-trace-card",
    components: {
      Default: (
        <CardFrame>
          <StackTraceCard />
        </CardFrame>
      ),
    },
  },
  "stats-card": {
    name: "stats-card",
    components: {
      Default: (
        <CardFrame>
          <CardsStats />
        </CardFrame>
      ),
    },
  },
  "team-members-card": {
    name: "team-members-card",
    components: {
      Default: (
        <CardFrame>
          <CardsTeamMembers />
        </CardFrame>
      ),
    },
  },
  "terminal-build-card": {
    name: "terminal-build-card",
    components: {
      Default: (
        <CardFrame>
          <TerminalBuild />
        </CardFrame>
      ),
    },
  },
  "token-spend-card": {
    name: "token-spend-card",
    components: {
      Default: (
        <CardFrame>
          <TokenSpend />
        </CardFrame>
      ),
    },
  },
  "transfer-funds-card": {
    name: "transfer-funds-card",
    components: {
      Default: (
        <CardFrame>
          <TransferFunds />
        </CardFrame>
      ),
    },
  },
  "type-scale-card": {
    name: "type-scale-card",
    components: {
      Default: (
        <CardFrame>
          <TypeScale />
        </CardFrame>
      ),
    },
  },
  "ui-elements-card": {
    name: "ui-elements-card",
    components: {
      Default: (
        <CardFrame>
          <UIElements />
        </CardFrame>
      ),
    },
  },
  "uptime-monitor-card": {
    name: "uptime-monitor-card",
    components: {
      Default: (
        <CardFrame>
          <UptimeMonitor />
        </CardFrame>
      ),
    },
  },
  "voice-input-card": {
    name: "voice-input-card",
    components: {
      Default: (
        <CardFrame>
          <VoiceInput />
        </CardFrame>
      ),
    },
  },
  "web-vitals-card": {
    name: "web-vitals-card",
    components: {
      Default: (
        <CardFrame>
          <WebVitals />
        </CardFrame>
      ),
    },
  },
}
