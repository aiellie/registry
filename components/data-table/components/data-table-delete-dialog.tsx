"use client"

import { Delete02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DataTableDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** How many rows are about to go; wording follows it. */
  count: number
  /** Names the single row being deleted, e.g. its id. */
  subject?: string
  onConfirm: () => void
}

/** The one confirmation both the row menu and the selection bar go through. */
export function DataTableDeleteDialog({
  open,
  onOpenChange,
  count,
  subject,
  onConfirm,
}: DataTableDeleteDialogProps) {
  const noun = count === 1 ? "task" : `${count} tasks`

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="text-destructive">
            <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete {noun}?</AlertDialogTitle>
          <AlertDialogDescription>
            {count === 1 && subject
              ? `${subject} will be removed. This cannot be undone.`
              : `${noun} will be removed. This cannot be undone.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
          >
            <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
