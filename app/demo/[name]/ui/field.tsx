import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

export const field = {
  name: "field",
  components: {
    Default: (
      <div className="flex w-full justify-center p-6">
        <FieldGroup className="max-w-sm">
          <Field>
            <FieldLabel htmlFor="field-demo-name">Full name</FieldLabel>
            <Input id="field-demo-name" placeholder="Ellie Sophia" />
            <FieldDescription>
              This appears on invoices and receipts.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="field-demo-note">Delivery note</FieldLabel>
            <Textarea
              id="field-demo-note"
              placeholder="Leave a note for the courier"
            />
          </Field>
          <Field data-invalid>
            <FieldLabel htmlFor="field-demo-email">Email</FieldLabel>
            <Input
              id="field-demo-email"
              aria-invalid
              defaultValue="ellie@example"
              placeholder="ellie@example.com"
            />
            <FieldError>Enter a valid email address.</FieldError>
          </Field>
        </FieldGroup>
      </div>
    ),
    Horizontal: (
      <div className="flex w-full justify-center p-6">
        <FieldGroup className="max-w-sm">
          <Field orientation="horizontal">
            <Checkbox id="field-demo-terms" defaultChecked />
            <FieldLabel htmlFor="field-demo-terms" className="font-normal">
              Accept terms and conditions
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="field-demo-2fa">
                Multi-factor authentication
              </FieldLabel>
              <FieldDescription>
                Require a verification code when signing in on a new device.
              </FieldDescription>
            </FieldContent>
            <Switch id="field-demo-2fa" defaultChecked />
          </Field>
        </FieldGroup>
      </div>
    ),
    Fieldset: (
      <div className="flex w-full justify-center p-6">
        <FieldSet className="w-full max-w-sm">
          <FieldLegend>Shipping address</FieldLegend>
          <FieldDescription>
            Where should we send your order?
          </FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="field-demo-street">Street</FieldLabel>
              <Input id="field-demo-street" placeholder="Herengracht 255" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="field-demo-city">City</FieldLabel>
                <Input id="field-demo-city" placeholder="Amsterdam" />
              </Field>
              <Field>
                <FieldLabel htmlFor="field-demo-zip">Postal code</FieldLabel>
                <Input id="field-demo-zip" placeholder="1016 DB" />
              </Field>
            </div>
          </FieldGroup>
        </FieldSet>
      </div>
    ),
  },
}
