"use client"

import * as React from "react"
import { PlusSignIcon, TaskAdd01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import type { AddField } from "../data/schema"
import { DataTableAvatar } from "./data-table-avatar"

interface DataTableAddDialogProps {
  fields: AddField[]
  /** Values the form does not ask for, resolved at submit time. */
  defaults?: () => Record<string, unknown>
  onAdd: (row: Record<string, unknown>) => void
  label?: string
  title?: string
  description?: string
}

const seed = (fields: AddField[]) =>
  Object.fromEntries(
    fields.map((field) => [
      field.key,
      field.type === "select" ? (field.options?.[0]?.value ?? "") : "",
    ])
  )

/**
 * Builds its form from `fields` rather than hard-coding one, so the same
 * dialog serves whatever shape the table is holding.
 */
export function DataTableAddDialog({
  fields,
  defaults,
  onAdd,
  label = "Add Task",
  title = "New task",
  description = "Add a task to the top of the table.",
}: DataTableAddDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [values, setValues] = React.useState<Record<string, string>>(() =>
    seed(fields)
  )
  const [touched, setTouched] = React.useState(false)

  const missing = fields.filter(
    (field) => field.required && !values[field.key]?.trim()
  )

  const set = (key: string, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }))

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setTouched(true)
    if (missing.length) return

    // Number fields come back off the DOM as strings; the table sorts and
    // totals this column, so it has to land as a number.
    const row: Record<string, unknown> = { ...defaults?.() }
    for (const field of fields) {
      row[field.key] =
        field.type === "number"
          ? Number(values[field.key] || 0)
          : values[field.key]
    }

    onAdd(row)
    setValues(seed(fields))
    setTouched(false)
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setTouched(false)
      }}
    >
      <DialogTrigger
        render={
          <Button size="sm">
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
            {label}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HugeiconsIcon
              icon={TaskAdd01Icon}
              strokeWidth={2}
              className="size-4"
            />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <FieldGroup className="gap-4">
            {fields.map((field) => {
              const invalid =
                touched && field.required && !values[field.key]?.trim()

              return (
                <Field key={field.key} data-invalid={invalid || undefined}>
                  <FieldLabel htmlFor={`add-${field.key}`}>
                    {field.label}
                  </FieldLabel>
                  {field.type === "textarea" && (
                    <Textarea
                      id={`add-${field.key}`}
                      rows={2}
                      placeholder={field.placeholder}
                      value={values[field.key] ?? ""}
                      onChange={(event) => set(field.key, event.target.value)}
                      aria-invalid={invalid || undefined}
                    />
                  )}
                  {field.type === "text" && (
                    <Input
                      id={`add-${field.key}`}
                      placeholder={field.placeholder}
                      value={values[field.key] ?? ""}
                      onChange={(event) => set(field.key, event.target.value)}
                      aria-invalid={invalid || undefined}
                    />
                  )}
                  {field.type === "number" && (
                    <InputGroup>
                      <InputGroupInput
                        id={`add-${field.key}`}
                        type="number"
                        min={0}
                        placeholder={field.placeholder}
                        value={values[field.key] ?? ""}
                        onChange={(event) => set(field.key, event.target.value)}
                      />
                      {field.suffix && (
                        <InputGroupText className="pe-2.5 text-muted-foreground">
                          {field.suffix}
                        </InputGroupText>
                      )}
                    </InputGroup>
                  )}
                  {field.type === "select" && field.options && (
                    <Select
                      items={field.options}
                      value={values[field.key] ?? ""}
                      onValueChange={(next) => set(field.key, String(next))}
                    >
                      <SelectTrigger
                        id={`add-${field.key}`}
                        className="w-full"
                        aria-label={field.label}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent alignItemWithTrigger={false}>
                        <SelectGroup>
                          {field.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.initials ? (
                                <DataTableAvatar
                                  option={option}
                                  className="size-5"
                                />
                              ) : (
                                option.icon && (
                                  <HugeiconsIcon
                                    icon={option.icon}
                                    strokeWidth={2}
                                    className="size-4 text-muted-foreground"
                                  />
                                )
                              )}
                              {option.label}
                            </SelectItem>
                          ))}
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
          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" />}>
              Cancel
            </DialogClose>
            <Button type="submit">
              <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
              {label}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
