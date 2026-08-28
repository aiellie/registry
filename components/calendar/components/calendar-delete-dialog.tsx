"use client"

import { CalendarRemove01Icon } from "@hugeicons/core-free-icons"
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

interface CalendarDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Names the event being removed. */
  subject?: string
  onConfirm: () => void
}

export function CalendarDeleteDialog({
  open,
  onOpenChange,
  subject,
  onConfirm,
}: CalendarDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="text-destructive">
            <HugeiconsIcon icon={CalendarRemove01Icon} strokeWidth={2} />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete event?</AlertDialogTitle>
          <AlertDialogDescription>
            {subject ? `"${subject}"` : "This event"} will be removed from the
            calendar. This cannot be undone.
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
            <HugeiconsIcon icon={CalendarRemove01Icon} strokeWidth={2} />
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
