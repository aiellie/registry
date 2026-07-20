import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

// Inlined from input-otp's REGEXP_ONLY_DIGITS: importing it here would evaluate
// the package (which calls createContext at module scope) in the RSC graph.
const REGEXP_ONLY_DIGITS_PATTERN = "^\\d+$"

export const inputOtp = {
  name: "input-otp",
  components: {
    Default: (
      <div className="flex w-full justify-center p-6" dir="ltr">
        <InputOTP maxLength={6}>
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
      </div>
    ),
    DigitsOnly: (
      <div className="flex w-full justify-center p-6" dir="ltr">
        <InputOTP maxLength={4} pattern={REGEXP_ONLY_DIGITS_PATTERN}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      </div>
    ),
  },
}
