"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

import type { FacetOption } from "../data/data"

interface DataTableAvatarProps {
  option: FacetOption
  size?: "sm" | "default" | "lg"
  className?: string
}

/**
 * A person's avatar wherever they appear — cell, filter list, bulk menu — so
 * the same face reads the same everywhere. The image is a gradient derived
 * from their name, with initials underneath while it decodes.
 */
export function DataTableAvatar({
  option,
  size = "sm",
  className,
}: DataTableAvatarProps) {
  return (
    <Avatar size={size} className={cn("shrink-0", className)}>
      {option.image && <AvatarImage src={option.image} alt="" aria-hidden />}
      <AvatarFallback className="text-[9px] uppercase">
        {option.initials}
      </AvatarFallback>
    </Avatar>
  )
}
