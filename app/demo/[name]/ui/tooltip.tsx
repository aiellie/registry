import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export const tooltip = {
  name: "tooltip",
  components: {
    Default: (
      <div className="flex w-full items-center justify-center p-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" />}>
              Hover me
            </TooltipTrigger>
            <TooltipContent>Add to library</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ),
    WithKbd: (
      <div className="flex w-full items-center justify-center p-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" />}>
              Save
            </TooltipTrigger>
            <TooltipContent>
              Save changes <Kbd>⌘S</Kbd>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ),
    Sides: (
      <div className="flex w-full items-center justify-center gap-2 p-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" size="sm" />}>
              Top
            </TooltipTrigger>
            <TooltipContent side="top">Shown above the trigger</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" size="sm" />}>
              Bottom
            </TooltipTrigger>
            <TooltipContent side="bottom">
              Shown below the trigger
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" size="sm" />}>
              Start
            </TooltipTrigger>
            <TooltipContent side="inline-start">
              Shown at the start
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" size="sm" />}>
              End
            </TooltipTrigger>
            <TooltipContent side="inline-end">Shown at the end</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ),
  },
}
