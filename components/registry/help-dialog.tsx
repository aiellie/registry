"use client"

import {
  ArrowRight01Icon,
  BlockGameIcon,
  BlocksIcon,
  PuzzleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const steps = [
  {
    icon: BlocksIcon,
    title: "Start with a block",
    description:
      "Blocks are complete, ready-to-use kits. Begin with a starting point like the blank block for consistent, repeatable generations.",
  },
  {
    icon: BlockGameIcon,
    title: "Or pick a smaller primitive",
    description:
      "Open individual UI primitives or components when you want a smaller, more specific starting point instead of a full block.",
  },
  {
    icon: PuzzleIcon,
    title: "Open in v0",
    description:
      "Click the Open in v0 button on any item to drop it straight into your workflow, fully documented with examples.",
  },
]

export function HelpDialog({
  open,
  onOpenChange,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Getting started</DialogTitle>
          <DialogDescription>
            This registry is a central repository for the UI components and
            blocks used across your applications. Browse by category, search for
            what you need, and see how everything is used in context.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-1">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <HugeiconsIcon
                  icon={step.icon}
                  strokeWidth={2}
                  className="size-5"
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-sm font-medium">{step.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Close</DialogClose>
          <DialogClose
            nativeButton={false}
            render={
              <Button
                nativeButton={false}
                render={<Link href="/registry/blank" />}
                data-icon="inline-end"
              />
            }
          >
            Browse the blank block
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              strokeWidth={2}
              className="rtl:rotate-180"
            />
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
