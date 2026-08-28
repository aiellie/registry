"use client"

import * as React from "react"

import { TimePicker } from "@/components/aiellie/ui/time-picker"
import { Example, ExampleWrapper } from "@/components/example"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"

export default function TimePickerExample() {
  return (
    <ExampleWrapper>
      <TimePickerBasic />
      <TimePickerTwelveHour />
      <TimePickerStep />
      <TimePickerBounded />
      <TimePickerRange />
    </ExampleWrapper>
  )
}

function TimePickerBasic({ className }: { className?: string }) {
  const [value, setValue] = React.useState("09:30")

  return (
    <Example title="Basic" containerClassName={className}>
      <Field className="mx-auto w-44">
        <FieldLabel htmlFor="time-basic">Time</FieldLabel>
        <TimePicker id="time-basic" value={value} onValueChange={setValue} />
      </Field>
    </Example>
  )
}

function TimePickerTwelveHour({ className }: { className?: string }) {
  const [value, setValue] = React.useState("14:15")

  return (
    <Example title="12-hour" containerClassName={className}>
      <Field className="mx-auto w-44">
        <FieldLabel htmlFor="time-12h">Time</FieldLabel>
        <TimePicker
          id="time-12h"
          value={value}
          onValueChange={setValue}
          hour12
        />
      </Field>
    </Example>
  )
}

function TimePickerStep({ className }: { className?: string }) {
  const [value, setValue] = React.useState("08:00")

  return (
    <Example title="15-minute Steps" containerClassName={className}>
      <Field className="mx-auto w-44">
        <FieldLabel htmlFor="time-step">Slot</FieldLabel>
        <TimePicker
          id="time-step"
          value={value}
          onValueChange={setValue}
          minuteStep={15}
        />
      </Field>
    </Example>
  )
}

function TimePickerBounded({ className }: { className?: string }) {
  const [value, setValue] = React.useState("10:00")

  return (
    <Example title="Working Hours" containerClassName={className}>
      <Field className="mx-auto w-44">
        <FieldLabel htmlFor="time-bounded">Appointment</FieldLabel>
        <TimePicker
          id="time-bounded"
          value={value}
          onValueChange={setValue}
          minHour={9}
          maxHour={17}
          minuteStep={30}
        />
      </Field>
    </Example>
  )
}

function TimePickerRange({ className }: { className?: string }) {
  const [start, setStart] = React.useState("10:30")
  const [end, setEnd] = React.useState("11:30")

  return (
    <Example title="Range" containerClassName={className}>
      <FieldGroup className="mx-auto max-w-xs flex-row">
        <Field>
          <FieldLabel htmlFor="time-start">Starts</FieldLabel>
          <TimePicker id="time-start" value={start} onValueChange={setStart} />
        </Field>
        <Field>
          <FieldLabel htmlFor="time-end">Ends</FieldLabel>
          <TimePicker
            id="time-end"
            value={end}
            onValueChange={setEnd}
            // Nothing before the start is selectable, so the pair stays valid.
            minHour={Number(start.split(":")[0])}
          />
        </Field>
      </FieldGroup>
    </Example>
  )
}
