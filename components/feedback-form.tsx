"use client"

import * as React from "react"

import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import {
  Bug01Icon,
  Idea01Icon,
  Comment01Icon,
  SentIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const FEEDBACK_TYPES = [
  { value: "issue", label: "Issue", icon: Bug01Icon },
  { value: "idea", label: "Idea", icon: Idea01Icon },
  { value: "other", label: "Other", icon: Comment01Icon },
] satisfies { value: string; label: string; icon: IconSvgElement }[]

export function FeedbackForm({
  open: openProp,
  onOpenChange,
  trigger,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
} = {}) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = openProp !== undefined
  const open = isControlled ? openProp : internalOpen
  const setOpen = React.useCallback(
    (value: boolean) => {
      if (!isControlled) setInternalOpen(value)
      onOpenChange?.(value)
    },
    [isControlled, onOpenChange]
  )

  const [type, setType] = React.useState<string>("issue")
  const [message, setMessage] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)

  const reset = React.useCallback(() => {
    setType("issue")
    setMessage("")
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!message.trim()) return

    setSubmitting(true)
    try {
      // TODO: wire up to your feedback endpoint
      await new Promise((resolve) => setTimeout(resolve, 600))
      toast.add({
        title: "Thanks for your feedback!",
        description: "We've received your message and will take a look.",
        type: "success",
      })
      reset()
      setOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger render={<Button size="sm" />}>{trigger}</DialogTrigger>
      ) : null}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share your feedback</DialogTitle>
          <DialogDescription>
            Found a bug or have an idea? Let us know how we can improve.
          </DialogDescription>
        </DialogHeader>
        <form id="feedback-form" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="feedback-type">Type</FieldLabel>
              <ToggleGroup
                id="feedback-type"
                value={[type]}
                onValueChange={([next]) => {
                  if (next) setType(next)
                }}
                variant="outline"
                spacing={0}
              >
                {FEEDBACK_TYPES.map((option) => (
                  <ToggleGroupItem
                    key={option.value}
                    value={option.value}
                    className="flex-1"
                  >
                    <HugeiconsIcon icon={option.icon} strokeWidth={2} />
                    {option.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="feedback-message">Message</FieldLabel>
              <Textarea
                id="feedback-message"
                placeholder="Tell us what's on your mind..."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="min-h-28"
                required
              />
              <FieldDescription>
                Please don&apos;t include any sensitive information.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
        <DialogFooter showCloseButton>
          <Button
            type="submit"
            form="feedback-form"
            disabled={!message.trim() || submitting}
          >
            <HugeiconsIcon icon={SentIcon} strokeWidth={2} />
            {submitting ? "Sending..." : "Send feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
