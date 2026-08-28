"use client"

import * as React from "react"
import { format } from "date-fns"
import {
  ArrowDown01Icon,
  Calendar01Icon,
  CalendarAdd01Icon,
  Delete02Icon,
  Edit02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { TimePicker } from "@/components/aiellie/ui/time-picker"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

import { calendarByValue } from "../data/calendars"
import type { CalendarEvent, EventField } from "../data/schema"
import { eventEnd, eventStart, parseLocal } from "../lib"

/** The flat, form-shaped view of an event. */
export interface EventDraft {
  id?: string
  title: string
  calendar: string
  date: string
  startTime: string
  endTime: string
  allDay: boolean
  location: string
  description: string
}

interface CalendarEventDialogProps {
  fields: EventField[]
  /** Matches the rest of the calendar's clock format. */
  hour12?: boolean
  /** Null closes it; a draft opens it seeded with that draft. */
  draft: EventDraft | null
  onDraftChange: (draft: EventDraft | null) => void
  onSave: (event: CalendarEvent) => void
  onDelete?: (id: string) => void
}

const pad = (value: number) => String(value).padStart(2, "0")

export const emptyDraft = (date: Date, hour = 9): EventDraft => ({
  title: "",
  calendar: "work",
  date: format(date, "yyyy-MM-dd"),
  startTime: `${String(hour).padStart(2, "0")}:00`,
  endTime: `${String(Math.min(hour + 1, 23)).padStart(2, "0")}:00`,
  allDay: false,
  location: "",
  description: "",
})

/**
 * The date as a month picker rather than a native `<input type="date">`, so
 * it looks the same in every browser and matches the calendar it edits.
 */
function DateField({
  id,
  label,
  value,
  onValueChange,
  invalid,
}: {
  id: string
  label: string
  value: string
  onValueChange: (value: string) => void
  invalid?: boolean
}) {
  const [open, setOpen] = React.useState(false)
  // The field carries `yyyy-MM-dd`, which is a UTC-midnight string to `Date`.
  const selected = value ? parseLocal(`${value}T00:00`) : undefined

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            variant="outline"
            aria-label={label}
            aria-invalid={invalid || undefined}
            data-empty={!selected || undefined}
            className="w-full justify-between px-2.5 font-normal data-empty:text-muted-foreground"
          />
        }
      >
        <span className="flex items-center gap-2">
          <HugeiconsIcon
            aria-hidden
            icon={Calendar01Icon}
            strokeWidth={2}
            className="size-4 text-muted-foreground"
          />
          {selected ? format(selected, "PPP") : "Pick a date"}
        </span>
        <HugeiconsIcon
          aria-hidden
          icon={ArrowDown01Icon}
          strokeWidth={2}
          className="size-4 text-muted-foreground"
        />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto overflow-hidden p-0">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          captionLayout="dropdown"
          onSelect={(next) => {
            if (!next) return
            onValueChange(format(next, "yyyy-MM-dd"))
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

export const draftFrom = (event: CalendarEvent): EventDraft => ({
  id: event.id,
  title: event.title,
  calendar: event.calendar,
  date: format(eventStart(event), "yyyy-MM-dd"),
  startTime: format(eventStart(event), "HH:mm"),
  endTime: format(eventEnd(event), "HH:mm"),
  allDay: Boolean(event.allDay),
  location: event.location ?? "",
  description: event.description ?? "",
})

/**
 * One dialog for both creating and editing — an edit is a create that arrived
 * with an id, and the only difference on screen is the title and the Delete.
 */
export function CalendarEventDialog({
  fields,
  hour12 = false,
  draft,
  onDraftChange,
  onSave,
  onDelete,
}: CalendarEventDialogProps) {
  const [touched, setTouched] = React.useState(false)
  const isEdit = Boolean(draft?.id)

  const set = (key: keyof EventDraft, value: string | boolean) => {
    if (!draft) return
    onDraftChange({ ...draft, [key]: value })
  }

  const submit = (formEvent: React.FormEvent) => {
    formEvent.preventDefault()
    if (!draft) return
    setTouched(true)
    if (!draft.title.trim()) return

    // An all-day event still needs a start and an end to sort and lay out
    // against, so it is stored as the whole of its day.
    const start = draft.allDay
      ? `${draft.date}T00:00`
      : `${draft.date}T${draft.startTime}`
    let end = draft.allDay
      ? `${draft.date}T23:59`
      : `${draft.date}T${draft.endTime}`
    // Moving the start past the end would otherwise leave a backwards range,
    // which draws as a negative-height block. Give it an hour rather than
    // collapsing it to nothing, and keep it inside the day.
    if (parseLocal(end) <= parseLocal(start)) {
      const [hour, minute] = draft.startTime.split(":").map(Number)
      const pushed = hour + 1 > 23 ? "23:59" : `${pad(hour + 1)}:${pad(minute)}`
      end = `${draft.date}T${pushed}`
    }

    onSave({
      id: draft.id ?? `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
      title: draft.title.trim(),
      calendar: draft.calendar,
      start,
      end,
      allDay: draft.allDay || undefined,
      location: draft.location.trim() || undefined,
      description: draft.description.trim() || undefined,
    })
    setTouched(false)
    onDraftChange(null)
  }

  return (
    <Dialog
      open={Boolean(draft)}
      onOpenChange={(next) => {
        if (!next) {
          setTouched(false)
          onDraftChange(null)
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HugeiconsIcon
              icon={isEdit ? Edit02Icon : CalendarAdd01Icon}
              strokeWidth={2}
              className="size-4"
            />
            {isEdit ? "Edit event" : "New event"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Change the details, or remove it from the calendar."
              : "Add an event to the calendar."}
          </DialogDescription>
        </DialogHeader>
        {draft && (
          <form onSubmit={submit} className="flex flex-col gap-4">
            <FieldGroup className="gap-4">
              {fields.map((field) => {
                const value = draft[field.key as keyof EventDraft]
                const invalid =
                  touched && field.required && !String(value ?? "").trim()
                // Times mean nothing once the event covers the whole day.
                const muted =
                  draft.allDay &&
                  (field.key === "startTime" || field.key === "endTime")

                return (
                  <Field
                    key={field.key}
                    data-invalid={invalid || undefined}
                    orientation={
                      field.type === "switch" ? "horizontal" : "vertical"
                    }
                    className={cn(muted && "pointer-events-none opacity-40")}
                  >
                    <FieldLabel htmlFor={`event-${field.key}`}>
                      {field.label}
                    </FieldLabel>
                    {field.type === "switch" && (
                      <Switch
                        id={`event-${field.key}`}
                        size="sm"
                        className="ms-auto"
                        checked={Boolean(value)}
                        onCheckedChange={(next) =>
                          set(field.key as keyof EventDraft, next)
                        }
                      />
                    )}
                    {field.type === "text" && (
                      <Input
                        id={`event-${field.key}`}
                        placeholder={field.placeholder}
                        value={String(value ?? "")}
                        onChange={(changeEvent) =>
                          set(
                            field.key as keyof EventDraft,
                            changeEvent.target.value
                          )
                        }
                        aria-invalid={invalid || undefined}
                      />
                    )}
                    {field.type === "date" && (
                      <DateField
                        id={`event-${field.key}`}
                        label={field.label}
                        value={String(value ?? "")}
                        onValueChange={(next) =>
                          set(field.key as keyof EventDraft, next)
                        }
                        invalid={invalid}
                      />
                    )}
                    {field.type === "time" && (
                      <TimePicker
                        id={`event-${field.key}`}
                        aria-label={field.label}
                        value={String(value ?? "")}
                        hour12={hour12}
                        onValueChange={(next) =>
                          set(field.key as keyof EventDraft, next)
                        }
                      />
                    )}
                    {field.type === "textarea" && (
                      <Textarea
                        id={`event-${field.key}`}
                        rows={2}
                        placeholder={field.placeholder}
                        value={String(value ?? "")}
                        onChange={(changeEvent) =>
                          set(
                            field.key as keyof EventDraft,
                            changeEvent.target.value
                          )
                        }
                      />
                    )}
                    {field.type === "select" && field.options && (
                      <Select
                        items={field.options}
                        value={String(value ?? "")}
                        onValueChange={(next) =>
                          set(field.key as keyof EventDraft, String(next))
                        }
                      >
                        <SelectTrigger
                          id={`event-${field.key}`}
                          className="w-full"
                          aria-label={field.label}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent alignItemWithTrigger={false}>
                          <SelectGroup>
                            {field.options.map((option) => {
                              const source = calendarByValue(option.value)
                              return (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {source && (
                                    <span
                                      aria-hidden
                                      className={cn(
                                        "size-2.5 shrink-0 rounded-full",
                                        source.dot
                                      )}
                                    />
                                  )}
                                  {option.label}
                                </SelectItem>
                              )
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                    {invalid && (
                      <FieldError>{field.label} is required.</FieldError>
                    )}
                  </Field>
                )
              })}
            </FieldGroup>
            <DialogFooter className="sm:justify-between">
              {isEdit && onDelete ? (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    if (draft.id) onDelete(draft.id)
                  }}
                >
                  <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                  Delete
                </Button>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <DialogClose
                  render={<Button variant="outline" type="button" />}
                >
                  Cancel
                </DialogClose>
                <Button type="submit">{isEdit ? "Save" : "Add event"}</Button>
              </div>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
