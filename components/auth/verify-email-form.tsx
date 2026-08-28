"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, RefreshIcon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

const OTP_LENGTH = 6

const otpGroupClassName =
  "*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl"

export function VerifyEmailForm({
  email = "m@example.com",
  onBack,
  className,
  ...props
}: Omit<React.ComponentProps<"form">, "onSubmit"> & {
  email?: string
  onBack?: () => void
}) {
  const [code, setCode] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  function validate(value: string) {
    if (value.length === 0) {
      return "Enter the verification code we sent you."
    }

    if (value.length < OTP_LENGTH) {
      return `The verification code is ${OTP_LENGTH} digits.`
    }

    return null
  }

  function handleChange(value: string) {
    setCode(value)

    if (error) {
      setError(validate(value))
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const message = validate(code)
    setError(message)

    if (message) {
      return
    }

    // Submit `code` to your verification endpoint here.
  }

  const invalid = error !== null
  const slotClassName = invalid
    ? "border-destructive data-[active=true]:border-destructive"
    : undefined

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className={cn("w-full", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="text-balance text-muted-foreground">
            Enter the verification code we sent to{" "}
            <span className="font-medium text-foreground">{email}</span>.
          </p>
        </div>
        <Field data-invalid={invalid}>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="otp-verification">
              Verification code
            </FieldLabel>
            <Button variant="outline" size="xs" type="button">
              <HugeiconsIcon icon={RefreshIcon} />
              Resend Code
            </Button>
          </div>
          <InputOTP
            id="otp-verification"
            maxLength={OTP_LENGTH}
            value={code}
            onChange={handleChange}
            aria-invalid={invalid}
            aria-describedby={invalid ? "otp-verification-error" : undefined}
            containerClassName="justify-center"
          >
            <InputOTPGroup className={otpGroupClassName}>
              <InputOTPSlot
                index={0}
                aria-invalid={invalid}
                className={slotClassName}
              />
              <InputOTPSlot
                index={1}
                aria-invalid={invalid}
                className={slotClassName}
              />
              <InputOTPSlot
                index={2}
                aria-invalid={invalid}
                className={slotClassName}
              />
            </InputOTPGroup>
            <InputOTPSeparator className="mx-2" />
            <InputOTPGroup className={otpGroupClassName}>
              <InputOTPSlot
                index={3}
                aria-invalid={invalid}
                className={slotClassName}
              />
              <InputOTPSlot
                index={4}
                aria-invalid={invalid}
                className={slotClassName}
              />
              <InputOTPSlot
                index={5}
                aria-invalid={invalid}
                className={slotClassName}
              />
            </InputOTPGroup>
          </InputOTP>
          {invalid && (
            <FieldError id="otp-verification-error">{error}</FieldError>
          )}
          <FieldDescription>
            <a href="#">I no longer have access to this email address.</a>
          </FieldDescription>
        </Field>
        <Field>
          <Button type="submit">Verify</Button>
          {onBack && (
            <Button variant="ghost" type="button" onClick={onBack}>
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                className="rtl:rotate-180"
              />
              Use a different email
            </Button>
          )}
        </Field>
        <FieldDescription className="text-center">
          Having trouble signing in? <a href="#">Contact support</a>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}

export function OtpForm({ email }: { email?: string }) {
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardContent>
        <VerifyEmailForm email={email} />
      </CardContent>
    </Card>
  )
}
