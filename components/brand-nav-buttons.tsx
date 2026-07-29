"use client"

import * as React from "react"
import {
  Comment02Icon,
  BashIcon,
  CheckListIcon,
  AiGenerativeIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"

const items = [
  { value: "chat", label: "Chat", icon: Comment02Icon },
  { value: "code", label: "Code", icon: BashIcon },
  { value: "collab", label: "Collab", icon: CheckListIcon },
  { value: "create", label: "Create", icon: AiGenerativeIcon },
]

export function BrandNavButtons() {
  const [active, setActive] = React.useState("chat")

  return (
    <div className="flex items-center">
      {items.map((item) => (
        <Button
          key={item.value}
          variant={active === item.value ? "secondary" : "ghost"}
          size="sm"
          className="gap-1 px-2 text-xs"
          onClick={() => setActive(item.value)}
        >
          <HugeiconsIcon
            icon={item.icon}
            strokeWidth={2}
            className="size-3.5"
          />
          {item.label}
        </Button>
      ))}
    </div>
  )
}
