import {
  Example,
  ExampleWrapper,
} from "@/components/example"
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
  CheckmarkBadge02Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Loading03Icon,
  TradeMarkIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export default function AlertExample() {
  return (
    <ExampleWrapper className="lg:grid-cols-1">
      <AlertBasic />
      <AlertWithIcons />
      <AlertDestructive />
      <AlertWithActions />
      <AlertStatusColors />
    </ExampleWrapper>
  )
}

function AlertBasic() {
  return (
    <Example title="Basic">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <Alert>
          <AlertTitle>Success! Your changes have been saved.</AlertTitle>
        </Alert>
        <Alert>
          <AlertTitle>Success! Your changes have been saved.</AlertTitle>
          <AlertDescription>
            This is an alert with title and description.
          </AlertDescription>
        </Alert>
        <Alert>
          <AlertDescription>
            This one has a description only. No title. No icon.
          </AlertDescription>
        </Alert>
      </div>
    </Example>
  )
}

function AlertWithIcons() {
  return (
    <Example title="With Icons">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <Alert>
          <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} />
          <AlertTitle>
            Let&apos;s try one with icon, title and a <a href="#">link</a>.
          </AlertTitle>
        </Alert>
        <Alert>
          <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} />
          <AlertDescription>
            This one has an icon and a description only. No title.{" "}
            <a href="#">But it has a link</a> and a <a href="#">second link</a>.
          </AlertDescription>
        </Alert>
        <Alert>
          <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} />
          <AlertTitle>Success! Your changes have been saved</AlertTitle>
          <AlertDescription>
            This is an alert with icon, title and description.
          </AlertDescription>
        </Alert>
        <Alert>
          <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} />
          <AlertTitle>
            This is a very long alert title that demonstrates how the component
            handles extended text content and potentially wraps across multiple
            lines
          </AlertTitle>
        </Alert>
        <Alert>
          <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} />
          <AlertDescription>
            This is a very long alert description that demonstrates how the
            component handles extended text content and potentially wraps across
            multiple lines
          </AlertDescription>
        </Alert>
        <Alert>
          <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} />
          <AlertTitle>
            This is an extremely long alert title that spans multiple lines to
            demonstrate how the component handles very lengthy headings while
            maintaining readability and proper text wrapping behavior
          </AlertTitle>
          <AlertDescription>
            This is an equally long description that contains detailed
            information about the alert. It shows how the component can
            accommodate extensive content while preserving proper spacing,
            alignment, and readability across different screen sizes and
            viewport widths. This helps ensure the user experience remains
            consistent regardless of the content length.
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
          <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} />
          <AlertTitle>Something went wrong!</AlertTitle>
          <AlertDescription>
            Your session has expired. Please log in again.
          </AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} />
          <AlertTitle>Unable to process your payment.</AlertTitle>
          <AlertDescription>
            <p>
              Please verify your <a href="#">billing information</a> and try
              again.
            </p>
            <ul className="list-inside list-disc">
              <li>Check your card details</li>
              <li>Ensure sufficient funds</li>
              <li>Verify billing address</li>
            </ul>
          </AlertDescription>
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

function AlertStatusColors() {
  return (
    <Example title="Status Colors">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <Alert className="border-emerald-500/20 bg-emerald-500/6 text-emerald-700 *:data-[slot=alert-description]:text-emerald-700/80 dark:border-emerald-400/20 dark:bg-emerald-400/6 dark:text-emerald-400 dark:*:data-[slot=alert-description]:text-emerald-400/80">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} />
          <AlertTitle>Your changes have been saved.</AlertTitle>
          <AlertDescription>
            All updates were applied successfully and are now live.
          </AlertDescription>
          <AlertAction>
            <Button size="xs" variant="outline">
              View
            </Button>
          </AlertAction>
        </Alert>

        <Alert variant="destructive">
          <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} />
          <AlertTitle>Unable to process your payment.</AlertTitle>
          <AlertDescription>
            Please verify your billing information and try again.
          </AlertDescription>
          <AlertAction>
            <Button size="xs" variant="outline">
              Retry
            </Button>
          </AlertAction>
        </Alert>

        <Alert className="border-amber-500/20 bg-amber-500/6 text-amber-700 *:data-[slot=alert-description]:text-amber-700/80 dark:border-amber-400/20 dark:bg-amber-400/6 dark:text-amber-400 dark:*:data-[slot=alert-description]:text-amber-400/80">
          <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} />
          <AlertTitle>Your request is pending review.</AlertTitle>
          <AlertDescription>
            We&apos;ll notify you once an admin has approved your submission.
          </AlertDescription>
          <AlertAction>
            <Badge variant="secondary">Pending</Badge>
          </AlertAction>
        </Alert>

        <Alert className="border-sky-500/20 bg-sky-500/6 text-sky-700 *:data-[slot=alert-description]:text-sky-700/80 dark:border-sky-400/20 dark:bg-sky-400/6 dark:text-sky-400 dark:*:data-[slot=alert-description]:text-sky-400/80">
          <HugeiconsIcon
            icon={Loading03Icon}
            strokeWidth={2}
            className="animate-spin"
          />
          <AlertTitle>Syncing your workspace…</AlertTitle>
          <AlertDescription>
            This may take a few moments. Please don&apos;t close this tab.
          </AlertDescription>
        </Alert>

        <Alert className="border-border bg-muted text-muted-foreground *:data-[slot=alert-description]:text-muted-foreground/80">
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
          <AlertTitle>Deployment was cancelled.</AlertTitle>
          <AlertDescription>
            The build was stopped before completion. No changes were applied.
          </AlertDescription>
          <AlertAction>
            <Button size="xs" variant="outline">
              Restore
            </Button>
          </AlertAction>
        </Alert>

        <Alert className="border-blue-500/20 bg-blue-500/6 text-blue-700 *:data-[slot=alert-description]:text-blue-700/80 dark:border-blue-400/20 dark:bg-blue-400/6 dark:text-blue-400 dark:*:data-[slot=alert-description]:text-blue-400/80">
          <HugeiconsIcon icon={CheckmarkBadge02Icon} strokeWidth={2} />
          <AlertTitle>Your account has been verified.</AlertTitle>
          <AlertDescription>
            You now have full access to all features and integrations.
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
