"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { type DateRange } from "react-day-picker"

import {
  Example,
  ExampleWrapper,
} from "@/components/example"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon, Calendar01Icon } from "@hugeicons/core-free-icons"

export default function DatePickerExample() {
  return (
    <ExampleWrapper>
      <DatePickerBasic />
      <DatePickerDemo />
      <DatePickerDateOfBirth />
      <DatePickerInput />
      <DatePickerRange />
      <DatePickerTime />
      <DatePickerWithDropdowns />
    </ExampleWrapper>
  )
}

function DatePickerBasic() {
  const [date, setDate] = React.useState<Date>()

  return (
    <Example title="Basic" className="items-center justify-center">
      <Field className="mx-auto w-44">
        <FieldLabel htmlFor="date-picker-simple">Date</FieldLabel>
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                id="date-picker-simple"
                className="justify-start font-normal"
              />
            }
          >
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              defaultMonth={date}
            />
          </PopoverContent>
        </Popover>
      </Field>
    </Example>
  )
}

function DatePickerDemo() {
  const [date, setDate] = React.useState<Date>()

  return (
    <Example title="Demo" className="items-center justify-center">
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              data-empty={!date}
              className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
            />
          }
        >
          {date ? format(date, "PPP") : <span>Pick a date</span>}
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            strokeWidth={2}
            data-icon="inline-end"
          />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            defaultMonth={date}
          />
        </PopoverContent>
      </Popover>
    </Example>
  )
}

function DatePickerDateOfBirth() {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)

  return (
    <Example title="Date of Birth" className="items-center justify-center">
      <Field className="mx-auto w-44">
        <FieldLabel htmlFor="date">Date of birth</FieldLabel>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                id="date"
                className="justify-start font-normal"
              />
            }
          >
            {date ? date.toLocaleDateString() : "Select date"}
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              defaultMonth={date}
              captionLayout="dropdown"
              onSelect={(date) => {
                setDate(date)
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </Field>
    </Example>
  )
}

function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

function DatePickerInput() {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(
    new Date("2025-06-01")
  )
  const [month, setMonth] = React.useState<Date | undefined>(date)
  const [value, setValue] = React.useState(formatDate(date))

  return (
    <Example title="Input" className="items-center justify-center">
      <Field className="mx-auto w-48">
        <FieldLabel htmlFor="date-required">Subscription Date</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="date-required"
            value={value}
            placeholder="June 01, 2025"
            onChange={(e) => {
              const date = new Date(e.target.value)
              setValue(e.target.value)
              if (isValidDate(date)) {
                setDate(date)
                setMonth(date)
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault()
                setOpen(true)
              }
            }}
          />
          <InputGroupAddon align="inline-end">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger
                render={
                  <InputGroupButton
                    id="date-picker"
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Select date"
                  />
                }
              >
                <HugeiconsIcon icon={Calendar01Icon} strokeWidth={2} />
                <span className="sr-only">Select date</span>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="end"
                alignOffset={-8}
                sideOffset={10}
              >
                <Calendar
                  mode="single"
                  selected={date}
                  month={month}
                  onMonthChange={setMonth}
                  onSelect={(date) => {
                    setDate(date)
                    setValue(formatDate(date))
                    setOpen(false)
                  }}
                />
              </PopoverContent>
            </Popover>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </Example>
  )
}

function DatePickerRange() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 20),
    to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
  })

  return (
    <Example title="Range" className="items-center justify-center">
      <Field className="mx-auto w-60">
        <FieldLabel htmlFor="date-picker-range">Date Picker Range</FieldLabel>
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                id="date-picker-range"
                className="justify-start px-2.5 font-normal"
              />
            }
          >
            <HugeiconsIcon
              icon={Calendar01Icon}
              strokeWidth={2}
              data-icon="inline-start"
            />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </Field>
    </Example>
  )
}

function DatePickerTime() {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)

  return (
    <Example title="Time" className="items-center justify-center">
      <FieldGroup className="mx-auto max-w-xs flex-row">
        <Field>
          <FieldLabel htmlFor="date-picker-optional">Date</FieldLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              render={
                <Button
                  variant="outline"
                  id="date-picker-optional"
                  className="w-32 justify-between font-normal"
                />
              }
            >
              {date ? format(date, "PPP") : "Select date"}
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                strokeWidth={2}
                data-icon="inline-end"
              />
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                defaultMonth={date}
                onSelect={(date) => {
                  setDate(date)
                  setOpen(false)
                }}
              />
            </PopoverContent>
          </Popover>
        </Field>
        <Field className="w-32">
          <FieldLabel htmlFor="time-picker-optional">Time</FieldLabel>
          <Input
            type="time"
            id="time-picker-optional"
            step="1"
            defaultValue="10:30:00"
            className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </Field>
      </FieldGroup>
    </Example>
  )
}

function DatePickerWithDropdowns() {
  const [date, setDate] = React.useState<Date>()
  const [open, setOpen] = React.useState(false)

  return (
    <Example title="With Dropdowns" className="items-center justify-center">
      <Field className="mx-auto w-72">
        <Popover open={open} onOpenChange={setOpen}>
          <FieldLabel htmlFor="date-picker-with-dropdowns-desktop">
            Date
          </FieldLabel>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                id="date-picker-with-dropdowns-desktop"
                className="justify-start px-2.5 font-normal"
              />
            }
          >
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              strokeWidth={2}
              className="ml-auto"
            />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              captionLayout="dropdown"
            />
            <div className="flex gap-2 border-t p-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Done
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </Field>
    </Example>
  )
}
