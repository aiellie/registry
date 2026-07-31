import { Example, ExampleWrapper } from "@/components/example"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Alert02Icon,
  AlertCircleIcon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  TerminalIcon,
  TradeMarkIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export default function AlertExample() {
  return (
    <ExampleWrapper className="lg:grid-cols-1">
      <AlertBasic />
      <AlertDestructive />
      <AlertStatus />
      <AlertWithActions />
    </ExampleWrapper>
  )
}

function AlertBasic() {
  return (
    <Example title="Basic">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <Alert>
          <HugeiconsIcon icon={TerminalIcon} strokeWidth={2} />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            You can add components and dependencies to your app using the CLI.
          </AlertDescription>
        </Alert>
      </div>
    </Example>
  )
}

function AlertDestructive() {
  return (
    <Example title="Destructive">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <Alert variant="destructive">
          <HugeiconsIcon
            icon={Cancel01Icon}
            strokeWidth={2}
            className="size-4 rounded-full bg-destructive/10 text-destructive dark:bg-destructive/20"
          />
          <AlertTitle>Something went wrong!</AlertTitle>
          <AlertDescription>
            Your session has expired. Please log in again.
          </AlertDescription>
        </Alert>
      </div>
    </Example>
  )
}

function AlertStatus() {
  return (
    <Example title="Status">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <Alert className="border-emerald-500/20 bg-emerald-500/6 text-emerald-700 *:data-[slot=alert-description]:text-emerald-700/80 dark:border-emerald-400/20 dark:bg-emerald-400/6 dark:text-emerald-400 dark:*:data-[slot=alert-description]:text-emerald-400/80">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} />
          <AlertTitle>Your changes have been saved.</AlertTitle>
          <AlertDescription>
            All updates were applied successfully and are now live.
          </AlertDescription>
        </Alert>

        <Alert className="border-sky-500/20 bg-sky-500/6 text-sky-700 *:data-[slot=alert-description]:text-sky-700/80 dark:border-sky-400/20 dark:bg-sky-400/6 dark:text-sky-400 dark:*:data-[slot=alert-description]:text-sky-400/80">
          <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} />
          <AlertTitle>A new version is available.</AlertTitle>
          <AlertDescription>
            Refresh the page to get the latest features and fixes.
          </AlertDescription>
        </Alert>

        <Alert className="border-amber-500/20 bg-amber-500/6 text-amber-700 *:data-[slot=alert-description]:text-amber-700/80 dark:border-amber-400/20 dark:bg-amber-400/6 dark:text-amber-400 dark:*:data-[slot=alert-description]:text-amber-400/80">
          <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} />
          <AlertTitle>Your trial expires in 3 days.</AlertTitle>
          <AlertDescription>
            Add a payment method to keep access to your workspace.
          </AlertDescription>
        </Alert>

        <Alert className="border-border bg-muted text-muted-foreground *:data-[slot=alert-description]:text-muted-foreground/80">
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
          <AlertTitle>Deployment was cancelled.</AlertTitle>
          <AlertDescription>
            The build was stopped before completion. No changes were applied.
          </AlertDescription>
        </Alert>

        <Alert className="border-primary/20 bg-primary/6 text-primary *:data-[slot=alert-description]:text-primary/80 dark:border-primary/25 dark:bg-primary/10">
          <HugeiconsIcon icon={TradeMarkIcon} strokeWidth={2} />
          <AlertTitle>Upgrade to Pro for unlimited projects.</AlertTitle>
          <AlertDescription>
            Get priority support, advanced analytics, and team collaboration
            tools.
          </AlertDescription>
          <AlertAction>
            <Button size="xs">Upgrade</Button>
          </AlertAction>
        </Alert>
      </div>
    </Example>
  )
}

function AlertWithActions() {
  return (
    <Example title="With Actions">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <Alert>
          <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} />
          <AlertTitle>The selected emails have been marked as spam.</AlertTitle>
          <AlertAction>
            <Button size="xs">Undo</Button>
          </AlertAction>
        </Alert>
        <Alert>
          <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} />
          <AlertTitle>The selected emails have been marked as spam.</AlertTitle>
          <AlertDescription>
            This is a very long alert title that demonstrates how the component
            handles extended text content.
          </AlertDescription>
          <AlertAction>
            <Badge variant="secondary">Badge</Badge>
          </AlertAction>
        </Alert>
      </div>
    </Example>
  )
}
