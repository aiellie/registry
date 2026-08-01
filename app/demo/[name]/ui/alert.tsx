import { Example, ExampleWrapper } from "@/components/example"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Alert02Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  TerminalIcon,
  TradeMarkIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export default function AlertExample() {
  return (
    <ExampleWrapper>
      <AlertDefault />
      <AlertDestructive />
      <AlertSuccess />
      <AlertInfo />
      <AlertWarning />
      <AlertMuted />
      <AlertPrimary />
    </ExampleWrapper>
  )
}

function AlertDefault() {
  return (
    <Example title="Default">
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
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
          <AlertTitle>Something went wrong!</AlertTitle>
          <AlertDescription>
            Your session has expired. Please log in again.
          </AlertDescription>
        </Alert>
      </div>
    </Example>
  )
}

function AlertSuccess() {
  return (
    <Example title="Success">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <Alert variant="success">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} />
          <AlertTitle>Your changes have been saved.</AlertTitle>
          <AlertDescription>
            All updates were applied successfully and are now live.
          </AlertDescription>
        </Alert>
      </div>
    </Example>
  )
}

function AlertInfo() {
  return (
    <Example title="Info">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <Alert variant="info">
          <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} />
          <AlertTitle>A new version is available.</AlertTitle>
          <AlertDescription>
            Refresh the page to get the latest features and fixes.
          </AlertDescription>
        </Alert>
      </div>
    </Example>
  )
}

function AlertWarning() {
  return (
    <Example title="Warning">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <Alert variant="warning">
          <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} />
          <AlertTitle>Your trial expires in 3 days.</AlertTitle>
          <AlertDescription>
            Add a payment method to keep access to your workspace.
          </AlertDescription>
        </Alert>
      </div>
    </Example>
  )
}

function AlertMuted() {
  return (
    <Example title="Muted">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <Alert variant="muted">
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
          <AlertTitle>Deployment was cancelled.</AlertTitle>
          <AlertDescription>
            The build was stopped before completion. No changes were applied.
          </AlertDescription>
        </Alert>
      </div>
    </Example>
  )
}

function AlertPrimary() {
  return (
    <Example title="Primary">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <Alert variant="primary">
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
