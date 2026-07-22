"use client"

import * as React from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

import { MessageScrollerDemo } from "./message-scroller"
import { UIElements } from "./ui-elements"
// Full (real) card variants
import { AccountAccess } from "./account-access"
import { CardsActivityGoal } from "./activity-goal"
import { AnalyticsCard } from "./analytics-card"
import { CardsCalendar } from "./calendar"
import { CardsChat } from "./chat"
import { ClaimableBalance } from "./claimable-balance"
import { ContributionHistory } from "./contribution-history"
import { CardsCookieSettings } from "./cookie-settings"
import { CardsCreateAccount } from "./create-account"
import { DividendIncome } from "./dividend-income"
import { EmptyDistributeTrack } from "./empty-distribute-track"
import { CardsExerciseMinutes } from "./exercise-minutes"
import { CardsForms } from "./forms"
import { NewMilestone } from "./new-milestone"
import { NotificationSettings } from "./notification-settings"
import { Payments } from "./payments"
import { CardsPayments } from "./payments copy"
import { PayoutThreshold } from "./payout-threshold"
import { PowerUsage } from "./power-usage"
import { QrConnect } from "./qr-connect"
import { CardsReportIssue } from "./report-issue"
import { SavingsTargets } from "./savings-targets"
import { CardsShare } from "./share"
import { SidebarNav } from "./sidebar-nav"
import { CardsStats } from "./stats"
import { CardsTeamMembers } from "./team-members"
// Skeleton (loading) card variants
import { AccountAccess as SkeletonAccountAccess } from "./skeleton/account-access"
import { ActivityGoal as SkeletonActivityGoal } from "./skeleton/activity-goal"
import { AnalyticsCard as SkeletonAnalyticsCard } from "./skeleton/analytics-card"
import { Calendar as SkeletonCalendar } from "./skeleton/calendar"
import { Chat as SkeletonChat } from "./skeleton/chat"
import { ClaimableBalance as SkeletonClaimableBalance } from "./skeleton/claimable-balance"
import { ContributionHistory as SkeletonContributionHistory } from "./skeleton/contribution-history"
import { CookieSettings as SkeletonCookieSettings } from "./skeleton/cookie-settings"
import { CreateAccount as SkeletonCreateAccount } from "./skeleton/create-account"
import { DividendIncome as SkeletonDividendIncome } from "./skeleton/dividend-income"
import { EmptyDistributeTrack as SkeletonEmptyDistributeTrack } from "./skeleton/empty-distribute-track"
import { ExerciseMinutes as SkeletonExerciseMinutes } from "./skeleton/exercise-minutes"
import { Forms as SkeletonForms } from "./skeleton/forms"
import { NewMilestone as SkeletonNewMilestone } from "./skeleton/new-milestone"
import { NotificationSettings as SkeletonNotificationSettings } from "./skeleton/notification-settings"
import { Payments as SkeletonPayments } from "./skeleton/payments"
import { PaymentsTable as SkeletonPaymentsTable } from "./skeleton/payments-table"
import { PayoutThreshold as SkeletonPayoutThreshold } from "./skeleton/payout-threshold"
import { PowerUsage as SkeletonPowerUsage } from "./skeleton/power-usage"
import { QrConnect as SkeletonQrConnect } from "./skeleton/qr-connect"
import { ReportIssue as SkeletonReportIssue } from "./skeleton/report-issue"
import { SavingsTargets as SkeletonSavingsTargets } from "./skeleton/savings-targets"
import { Share as SkeletonShare } from "./skeleton/share"
import { SidebarNav as SkeletonSidebarNav } from "./skeleton/sidebar-nav"
import { Stats as SkeletonStats } from "./skeleton/stats"
import { TeamMembers as SkeletonTeamMembers } from "./skeleton/team-members"
import { TransferFunds as SkeletonTransferFunds } from "./skeleton/transfer-funds"
import { UIElements as SkeletonUIElements } from "./skeleton/ui-elements"

type Cell =
  | { skeleton: React.ComponentType; full: React.ComponentType }
  | { render: () => React.ReactElement }

const columns: { className: string; cells: Cell[] }[] = [
  {
    className: "flex flex-col items-start gap-(--gap)",
    cells: [
      { render: () => <UIElements /> },
      { skeleton: SkeletonSidebarNav, full: SidebarNav },
      { skeleton: SkeletonSavingsTargets, full: SavingsTargets },
      { skeleton: SkeletonStats, full: CardsStats },
      { skeleton: SkeletonChat, full: CardsChat },
    ],
  },
  {
    className: "hidden flex-col gap-(--gap) lg:flex",
    cells: [
      { skeleton: SkeletonContributionHistory, full: ContributionHistory },
      { skeleton: SkeletonClaimableBalance, full: ClaimableBalance },
      { skeleton: SkeletonDividendIncome, full: DividendIncome },
      { skeleton: SkeletonCreateAccount, full: CardsCreateAccount },
      { skeleton: SkeletonForms, full: CardsForms },
    ],
  },
  {
    className: "hidden flex-col gap-(--gap) min-[1400px]:flex",
    cells: [
      { skeleton: SkeletonNewMilestone, full: NewMilestone },
      { skeleton: SkeletonPayoutThreshold, full: PayoutThreshold },
      { skeleton: SkeletonAccountAccess, full: AccountAccess },
      { skeleton: SkeletonReportIssue, full: CardsReportIssue },
      { skeleton: SkeletonCookieSettings, full: CardsCookieSettings },
    ],
  },
  {
    className: "hidden flex-col gap-(--gap) md:flex",
    cells: [
      { skeleton: SkeletonQrConnect, full: QrConnect },
      {
        render: () => (
          <div className="**:[.text-center.text-xs]:hidden">
            <MessageScrollerDemo />
          </div>
        ),
      },
      { skeleton: SkeletonPayments, full: Payments },
      { skeleton: SkeletonShare, full: CardsShare },
      { skeleton: SkeletonTeamMembers, full: CardsTeamMembers },
    ],
  },
  {
    className: "hidden flex-col gap-(--gap) min-[1900px]:flex",
    cells: [
      { skeleton: SkeletonEmptyDistributeTrack, full: EmptyDistributeTrack },
      { skeleton: SkeletonAnalyticsCard, full: AnalyticsCard },
      { skeleton: SkeletonNotificationSettings, full: NotificationSettings },
      { skeleton: SkeletonPowerUsage, full: PowerUsage },
      { skeleton: SkeletonActivityGoal, full: CardsActivityGoal },
      { skeleton: SkeletonExerciseMinutes, full: CardsExerciseMinutes },
      { skeleton: SkeletonCalendar, full: CardsCalendar },
      { skeleton: SkeletonPaymentsTable, full: CardsPayments },
    ],
  },
]

function CardsSkeletonRails() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-12 z-10 hidden min-[2200px]:block [&_[data-slot=skeleton]:nth-child(even)]:hidden"
    >
      <div className="absolute top-0 left-[calc(50%-950px-var(--rail-width)-var(--gap))] grid w-(--rail-width) grid-cols-[repeat(2,var(--rail-column))] gap-(--gap) opacity-50 [--rail-column:20rem] [--rail-width:calc(var(--rail-column)*2+var(--gap))]">
        <div className="flex flex-col gap-(--gap)">
          <SkeletonContributionHistory />
          <SkeletonClaimableBalance />
          <SkeletonDividendIncome />
          <SkeletonPayoutThreshold />
        </div>
        <div className="flex flex-col gap-(--gap)">
          <SkeletonUIElements />
          <SkeletonSavingsTargets />
          <SkeletonNewMilestone />
          <SkeletonPayoutThreshold />
          <SkeletonAccountAccess />
        </div>
      </div>
      <div className="absolute top-0 right-[calc(50%-950px-var(--rail-width)-var(--gap))] grid w-(--rail-width) grid-cols-[repeat(2,var(--rail-column))] gap-(--gap) opacity-50 [--rail-column:20rem] [--rail-width:calc(var(--rail-column)*2+var(--gap))]">
        <div className="flex flex-col gap-(--gap)">
          <SkeletonNewMilestone />
          <SkeletonPayoutThreshold />
          <SkeletonAccountAccess />
          <SkeletonQrConnect />
          <SkeletonTransferFunds />
          <SkeletonPayments />
          <SkeletonEmptyDistributeTrack />
        </div>
        <div className="flex flex-col gap-(--gap)">
          <SkeletonQrConnect />
          <SkeletonTransferFunds />
          <SkeletonPayments />
          <SkeletonEmptyDistributeTrack />
          <SkeletonAnalyticsCard />
          <SkeletonNotificationSettings />
          <SkeletonPowerUsage />
        </div>
      </div>
    </div>
  )
}

export function CardsDemo() {
  const [full, setFull] = React.useState(false)

  return (
    <div
      data-slot="demo"
      className="theme-neutral relative flex w-full max-w-none flex-col gap-(--gap) overflow-hidden bg-muted p-12 pb-0! [--gap:--spacing(8)] 3xl:[--gap:--spacing(8)] min-[1900px]:p-12 min-[1900px]:[--gap:--spacing(10)]! lg:p-6 lg:[--gap:--spacing(6)] dark:bg-background"
    >
      <div className="absolute top-4 right-4 z-30">
        <Button
          variant="outline"
          size="sm"
          className="shadow-sm"
          onClick={() => setFull((value) => !value)}
        >
          {full ? <EyeOffIcon /> : <EyeIcon />}
          {full ? "Show skeletons" : "Show full view"}
        </Button>
      </div>
      <CardsSkeletonRails />
      <div className="relative z-10 mx-auto grid gap-(--gap) **:data-[slot=card]:w-full min-[1400px]:grid-cols-4! min-[1900px]:grid-cols-5! md:max-w-3xl md:grid-cols-2 lg:max-w-none lg:grid-cols-3 xl:max-w-[1600px] 2xl:max-w-[1900px]">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className={column.className}>
            {column.cells.map((cell, cellIndex) => {
              if ("render" in cell) {
                return (
                  <React.Fragment key={cellIndex}>
                    {cell.render()}
                  </React.Fragment>
                )
              }
              const Card = full ? cell.full : cell.skeleton
              return <Card key={cellIndex} />
            })}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-1 h-120 bg-linear-to-b from-background via-muted to-transparent dark:hidden" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-48 bg-linear-to-t from-background via-muted/80 to-transparent lg:h-80 xl:h-64 dark:via-background/80" />
    </div>
  )
}
