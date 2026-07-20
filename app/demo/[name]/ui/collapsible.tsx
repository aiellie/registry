import { HugeiconsIcon } from "@hugeicons/react"
import { UnfoldMoreIcon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export const collapsible = {
  name: "collapsible",
  components: {
    Default: (
      <div className="flex w-full justify-center p-6">
        <Collapsible className="flex w-full max-w-sm flex-col gap-2">
          <div className="flex items-center justify-between gap-4 px-4">
            <h4 className="text-sm font-semibold">
              @aiellie starred 3 repositories
            </h4>
            <CollapsibleTrigger render={<Button variant="ghost" size="icon-sm" />}>
              <HugeiconsIcon icon={UnfoldMoreIcon} strokeWidth={2} />
              <span className="sr-only">Toggle</span>
            </CollapsibleTrigger>
          </div>
          <div className="rounded-md border px-4 py-2 font-mono text-sm">
            @base-ui/react
          </div>
          <CollapsibleContent className="flex flex-col gap-2">
            <div className="rounded-md border px-4 py-2 font-mono text-sm">
              @hugeicons/core-free-icons
            </div>
            <div className="rounded-md border px-4 py-2 font-mono text-sm">
              tailwindcss
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    ),
    "Open by Default": (
      <div className="flex w-full justify-center p-6">
        <Collapsible defaultOpen className="flex w-full max-w-sm flex-col gap-2">
          <div className="flex items-center justify-between gap-4 px-4">
            <h4 className="text-sm font-semibold">Recent deployments</h4>
            <CollapsibleTrigger render={<Button variant="ghost" size="icon-sm" />}>
              <HugeiconsIcon icon={UnfoldMoreIcon} strokeWidth={2} />
              <span className="sr-only">Toggle</span>
            </CollapsibleTrigger>
          </div>
          <div className="rounded-md border px-4 py-2 font-mono text-sm">
            ui.aiellie.dev — Production
          </div>
          <CollapsibleContent className="flex flex-col gap-2">
            <div className="rounded-md border px-4 py-2 font-mono text-sm">
              preview/base-nova — Ready
            </div>
            <div className="rounded-md border px-4 py-2 font-mono text-sm">
              preview/registry — Ready
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    ),
  },
}
