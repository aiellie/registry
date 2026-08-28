"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function HeaderAvatar() {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-8 overflow-hidden rounded-full p-0"
          >
            <Avatar className="size-8">
              <AvatarImage
                src="/avatars/aiellie.png"
                alt="3D avatar of Ai Ellie, a woman with brown hair and tortoiseshell glasses."
              />
              <AvatarFallback>AE</AvatarFallback>
            </Avatar>
            <span className="sr-only">Ellie</span>
          </Button>
        }
      />
      <TooltipContent>Ellie</TooltipContent>
    </Tooltip>
  )
}
