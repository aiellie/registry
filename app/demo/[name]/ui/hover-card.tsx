import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar03Icon } from "@hugeicons/core-free-icons"

export const hoverCard = {
  name: "hover-card",
  components: {
    Default: (
      <div className="flex w-full justify-center px-6 pt-16 pb-6">
        <HoverCard>
          <HoverCardTrigger render={<Button variant="link" />}>
            @aiellie
          </HoverCardTrigger>
          <HoverCardContent className="w-80 p-4">
            <div className="flex gap-4">
              <Avatar>
                <AvatarFallback>ES</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">@aiellie</h4>
                <p className="text-sm">
                  Design engineer building a Base UI flavored design system.
                </p>
                <div className="flex items-center gap-2 pt-2 text-muted-foreground">
                  <HugeiconsIcon
                    icon={Calendar03Icon}
                    strokeWidth={2}
                    className="size-4"
                  />
                  <span className="text-xs">Joined December 2024</span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    ),
  },
}
