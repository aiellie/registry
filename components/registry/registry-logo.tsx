import { CubeIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export function RegistryLogo() {
  return (
    <>
      <div className="shrink-0 rounded-md bg-primary p-1">
        <HugeiconsIcon
          icon={CubeIcon}
          strokeWidth={2}
          className="size-5 text-primary-foreground"
        />
      </div>
      <span className="truncate font-semibold group-data-[collapsible=icon]:hidden">
        ui.aiellie.dev
      </span>
    </>
  )
}
