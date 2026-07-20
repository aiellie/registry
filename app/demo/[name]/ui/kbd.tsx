import { Button } from "@/components/ui/button"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export const kbd = {
  name: "kbd",
  components: {
    Default: (
      <div className="flex w-full flex-col items-center gap-4 p-6">
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>⇧</Kbd>
          <Kbd>⌥</Kbd>
          <Kbd>⌃</Kbd>
        </KbdGroup>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          Press
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
          to open the command palette
        </p>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          Use
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <span>+</span>
            <Kbd>B</Kbd>
          </KbdGroup>
          to toggle the sidebar
        </p>
      </div>
    ),
    "In Button": (
      <div className="flex w-full flex-wrap items-center justify-center gap-2 p-6">
        <Button variant="outline" size="sm" className="pe-2">
          Accept <Kbd>⏎</Kbd>
        </Button>
        <Button variant="outline" size="sm" className="pe-2">
          Cancel <Kbd>Esc</Kbd>
        </Button>
      </div>
    ),
    "In Tooltip": (
      <div className="flex w-full items-center justify-center p-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" />}>
              Save
            </TooltipTrigger>
            <TooltipContent>
              Save changes
              <KbdGroup>
                <Kbd>⌘</Kbd>
                <Kbd>S</Kbd>
              </KbdGroup>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ),
  },
}
