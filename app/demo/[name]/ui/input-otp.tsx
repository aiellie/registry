"use client"

import * as React from "react"
import { REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"

import {
  Example,
  ExampleWrapper,
} from "@/components/example"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export default function InputOTPExample() {
  return (
    <ExampleWrapper>
      <InputOTPSimple />
      <InputOTPPattern />
      <InputOTPWithSeparator />
      <InputOTPControlled />
      <InputOTPAlphanumeric />
      <InputOTPDisabled />
      <InputOTPFourDigits />
      <InputOTPInvalid />
    </ExampleWrapper>
  )
}

function InputOTPSimple({ className }: { className?: string }) {
  return (
    <Example title="Simple" containerClassName={className}>
      <Field>
        <FieldLabel htmlFor="simple">Simple</FieldLabel>
        <InputOTP id="simple" maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </Field>
    </Example>
  )
}

function InputOTPPattern({ className }: { className?: string }) {
  return (
    <Example title="Digits Only" containerClassName={className}>
      <Field>
        <FieldLabel htmlFor="digits-only">Digits Only</FieldLabel>
        <InputOTP id="digits-only" maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </Field>
    </Example>
  )
}

function InputOTPWithSeparator({ className }: { className?: string }) {
  const [value, setValue] = React.useState("123456")

  return (
    <Example title="With Separator" containerClassName={className}>
      <Field>
        <FieldLabel htmlFor="with-separator">With Separator</FieldLabel>
        <InputOTP
          id="with-separator"
          maxLength={6}
          value={value}
          onChange={setValue}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </Field>
    </Example>
  )
}

function InputOTPControlled({ className }: { className?: string }) {
  const [value, setValue] = React.useState("")

  return (
    <Example title="Controlled" containerClassName={className}>
      <Field>
        <FieldLabel htmlFor="controlled">Controlled</FieldLabel>
        <InputOTP
          id="controlled"
          maxLength={6}
          value={value}
          onChange={(value) => setValue(value)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <FieldDescription>
          {value === ""
            ? "Enter your one-time password."
            : `You entered: ${value}`}
        </FieldDescription>
      </Field>
    </Example>
  )
}

function InputOTPAlphanumeric({ className }: { className?: string }) {
  return (
    <Example title="Alphanumeric" containerClassName={className}>
      <Field>
        <FieldLabel htmlFor="alphanumeric">Alphanumeric</FieldLabel>
        <FieldDescription>Accepts both letters and numbers.</FieldDescription>
        <InputOTP
          id="alphanumeric"
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </Field>
    </Example>
  )
}

function InputOTPDisabled({ className }: { className?: string }) {
  return (
    <Example title="Disabled" containerClassName={className}>
      <Field>
        <FieldLabel htmlFor="disabled">Disabled</FieldLabel>
        <InputOTP id="disabled" maxLength={6} disabled value="123456">
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </Field>
    </Example>
  )
}

function InputOTPFourDigits({ className }: { className?: string }) {
  return (
    <Example title="4 Digits" containerClassName={className}>
      <Field>
        <FieldLabel htmlFor="four-digits">4 Digits</FieldLabel>
        <FieldDescription>Common pattern for PIN codes.</FieldDescription>
        <InputOTP id="four-digits" maxLength={4} pattern={REGEXP_ONLY_DIGITS}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      </Field>
    </Example>
  )
}

function InputOTPInvalid({ className }: { className?: string }) {
  const [value, setValue] = React.useState("000000")

  return (
    <Example title="Invalid State" containerClassName={className}>
      <Field>
        <FieldLabel htmlFor="invalid">Invalid State</FieldLabel>
        <FieldDescription>
          Example showing the invalid error state.
        </FieldDescription>
        <InputOTP id="invalid" maxLength={6} value={value} onChange={setValue}>
          <InputOTPGroup>
            <InputOTPSlot index={0} aria-invalid />
            <InputOTPSlot index={1} aria-invalid />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={2} aria-invalid />
            <InputOTPSlot index={3} aria-invalid />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={4} aria-invalid />
            <InputOTPSlot index={5} aria-invalid />
          </InputOTPGroup>
        </InputOTP>
        <FieldError errors={[{ message: "Invalid code. Please try again." }]} />
      </Field>
    </Example>
  )
}
