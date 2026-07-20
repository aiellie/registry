import { HugeiconsIcon } from "@hugeicons/react"
import {
  Alert02Icon,
  CheckmarkBadge02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export const alert = {
  name: "alert",
  components: {
    Default: (
      <div className="flex w-full justify-center p-6">
        <Alert className="max-w-md">
          <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            You can add components to your app using the CLI.
          </AlertDescription>
        </Alert>
      </div>
    ),
    WithAction: (
      <div className="flex w-full justify-center p-6">
        <Alert className="max-w-md">
          <HugeiconsIcon icon={CheckmarkBadge02Icon} strokeWidth={2} />
          <AlertTitle>Update available</AlertTitle>
          <AlertDescription>
            A new version of the registry is ready to install.
          </AlertDescription>
          <AlertAction>
            <Button variant="outline" size="xs">
              Update
            </Button>
          </AlertAction>
        </Alert>
      </div>
    ),
    Destructive: (
      <div className="flex w-full justify-center p-6">
        <Alert variant="destructive" className="max-w-md">
          <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} />
          <AlertTitle>Payment failed</AlertTitle>
          <AlertDescription>
            Your session has expired. Please log in again to continue.
          </AlertDescription>
        </Alert>
      </div>
    ),
  },
}
