import {
  Example,
  ExampleWrapper,
} from "@/components/example"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function RadioGroupExample() {
  return (
    <ExampleWrapper>
      <RadioGroupBasic />
      <RadioGroupWithDescriptions />
      <RadioGroupWithFieldSet />
      <RadioGroupGrid />
      <RadioGroupDisabled />
      <RadioGroupInvalid />
      <RadioGroupFields />
    </ExampleWrapper>
  )
}

function RadioGroupBasic() {
  return (
    <Example title="Basic">
      <RadioGroup defaultValue="comfortable">
        <Field orientation="horizontal">
          <RadioGroupItem value="default" id="r1" />
          <FieldLabel htmlFor="r1" className="font-normal">
            Default
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="comfortable" id="r2" />
          <FieldLabel htmlFor="r2" className="font-normal">
            Comfortable
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="compact" id="r3" />
          <FieldLabel htmlFor="r3" className="font-normal">
            Compact
          </FieldLabel>
        </Field>
      </RadioGroup>
    </Example>
  )
}

function RadioGroupWithDescriptions() {
  return (
    <Example title="With Descriptions">
      <RadioGroup defaultValue="plus">
        <FieldLabel htmlFor="plus-plan">
          <Field orientation="horizontal">
            <FieldContent>
              <div className="font-medium">Plus</div>
              <FieldDescription>
                For individuals and small teams
              </FieldDescription>
            </FieldContent>
            <RadioGroupItem value="plus" id="plus-plan" />
          </Field>
        </FieldLabel>
        <FieldLabel htmlFor="pro-plan">
          <Field orientation="horizontal">
            <FieldContent>
              <div className="font-medium">Pro</div>
              <FieldDescription>For growing businesses</FieldDescription>
            </FieldContent>
            <RadioGroupItem value="pro" id="pro-plan" />
          </Field>
        </FieldLabel>
        <FieldLabel htmlFor="enterprise-plan">
          <Field orientation="horizontal">
            <FieldContent>
              <div className="font-medium">Enterprise</div>
              <FieldDescription>
                For large teams and enterprises
              </FieldDescription>
            </FieldContent>
            <RadioGroupItem value="enterprise" id="enterprise-plan" />
          </Field>
        </FieldLabel>
      </RadioGroup>
    </Example>
  )
}

function RadioGroupWithFieldSet() {
  return (
    <Example title="With FieldSet">
      <FieldSet>
        <FieldLegend>Battery Level</FieldLegend>
        <FieldDescription>
          Choose your preferred battery level.
        </FieldDescription>
        <RadioGroup defaultValue="medium">
          <Field orientation="horizontal">
            <RadioGroupItem value="high" id="battery-high" />
            <FieldLabel htmlFor="battery-high" className="font-normal">
              High
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem value="medium" id="battery-medium" />
            <FieldLabel htmlFor="battery-medium" className="font-normal">
              Medium
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem value="low" id="battery-low" />
            <FieldLabel htmlFor="battery-low" className="font-normal">
              Low
            </FieldLabel>
          </Field>
        </RadioGroup>
      </FieldSet>
    </Example>
  )
}

function RadioGroupGrid() {
  return (
    <Example title="Grid Layout">
      <RadioGroup defaultValue="medium" className="grid grid-cols-2 gap-2">
        <FieldLabel htmlFor="size-small">
          <Field orientation="horizontal">
            <RadioGroupItem value="small" id="size-small" />
            <div className="font-medium">Small</div>
          </Field>
        </FieldLabel>
        <FieldLabel htmlFor="size-medium">
          <Field orientation="horizontal">
            <RadioGroupItem value="medium" id="size-medium" />
            <div className="font-medium">Medium</div>
          </Field>
        </FieldLabel>
        <FieldLabel htmlFor="size-large">
          <Field orientation="horizontal">
            <RadioGroupItem value="large" id="size-large" />
            <div className="font-medium">Large</div>
          </Field>
        </FieldLabel>
        <FieldLabel htmlFor="size-xlarge">
          <Field orientation="horizontal">
            <RadioGroupItem value="xlarge" id="size-xlarge" />
            <div className="font-medium">X-Large</div>
          </Field>
        </FieldLabel>
      </RadioGroup>
    </Example>
  )
}

function RadioGroupDisabled() {
  return (
    <Example title="Disabled">
      <RadioGroup defaultValue="option2" disabled>
        <Field orientation="horizontal">
          <RadioGroupItem value="option1" id="disabled-1" />
          <FieldLabel htmlFor="disabled-1" className="font-normal">
            Option 1
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="option2" id="disabled-2" />
          <FieldLabel htmlFor="disabled-2" className="font-normal">
            Option 2
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="option3" id="disabled-3" />
          <FieldLabel htmlFor="disabled-3" className="font-normal">
            Option 3
          </FieldLabel>
        </Field>
      </RadioGroup>
    </Example>
  )
}

function RadioGroupInvalid() {
  return (
    <Example title="Invalid">
      <FieldSet>
        <FieldLegend>Notification Preferences</FieldLegend>
        <FieldDescription>
          Choose how you want to receive notifications.
        </FieldDescription>
        <RadioGroup defaultValue="email">
          <Field orientation="horizontal" data-invalid>
            <RadioGroupItem value="email" id="invalid-email" aria-invalid />
            <FieldLabel htmlFor="invalid-email" className="font-normal">
              Email only
            </FieldLabel>
          </Field>
          <Field orientation="horizontal" data-invalid>
            <RadioGroupItem value="sms" id="invalid-sms" aria-invalid />
            <FieldLabel htmlFor="invalid-sms" className="font-normal">
              SMS only
            </FieldLabel>
          </Field>
          <Field orientation="horizontal" data-invalid>
            <RadioGroupItem value="both" id="invalid-both" aria-invalid />
            <FieldLabel htmlFor="invalid-both" className="font-normal">
              Both Email & SMS
            </FieldLabel>
          </Field>
        </RadioGroup>
      </FieldSet>
    </Example>
  )
}

function RadioGroupFields() {
  return (
    <Example
      title="Fields"
      containerClassName="lg:col-span-full 2xl:col-span-full"
    >
      <FieldGroup>
        <FieldSet>
          <FieldLegend variant="label">Subscription Plan</FieldLegend>
          <RadioGroup defaultValue="free">
            <Field orientation="horizontal">
              <RadioGroupItem value="free" id="radio-free" />
              <FieldLabel htmlFor="radio-free" className="font-normal">
                Free Plan
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem value="pro" id="radio-pro" />
              <FieldLabel htmlFor="radio-pro" className="font-normal">
                Pro Plan
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem value="enterprise" id="radio-enterprise" />
              <FieldLabel htmlFor="radio-enterprise" className="font-normal">
                Enterprise
              </FieldLabel>
            </Field>
          </RadioGroup>
        </FieldSet>
        <FieldSet>
          <FieldLegend variant="label">Battery Level</FieldLegend>
          <FieldDescription>
            Choose your preferred battery level.
          </FieldDescription>
          <RadioGroup>
            <Field orientation="horizontal">
              <RadioGroupItem value="high" id="battery-high" />
              <FieldLabel htmlFor="battery-high">High</FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem value="medium" id="battery-medium" />
              <FieldLabel htmlFor="battery-medium">Medium</FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem value="low" id="battery-low" />
              <FieldLabel htmlFor="battery-low">Low</FieldLabel>
            </Field>
          </RadioGroup>
        </FieldSet>
        <RadioGroup className="gap-6">
          <Field orientation="horizontal">
            <RadioGroupItem value="option1" id="radio-content-1" />
            <FieldContent>
              <FieldLabel htmlFor="radio-content-1">Enable Touch ID</FieldLabel>
              <FieldDescription>
                Enable Touch ID to quickly unlock your device.
              </FieldDescription>
            </FieldContent>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem value="option2" id="radio-content-2" />
            <FieldContent>
              <FieldLabel htmlFor="radio-content-2">
                Enable Touch ID and Face ID to make it even faster to unlock
                your device. This is a long label to test the layout.
              </FieldLabel>
              <FieldDescription>
                Enable Touch ID to quickly unlock your device.
              </FieldDescription>
            </FieldContent>
          </Field>
        </RadioGroup>
        <RadioGroup className="gap-3">
          <FieldLabel htmlFor="radio-title-1">
            <Field orientation="horizontal">
              <RadioGroupItem value="title1" id="radio-title-1" />
              <FieldContent>
                <FieldTitle>Enable Touch ID</FieldTitle>
                <FieldDescription>
                  Enable Touch ID to quickly unlock your device.
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldLabel>
          <FieldLabel htmlFor="radio-title-2">
            <Field orientation="horizontal">
              <RadioGroupItem value="title2" id="radio-title-2" />
              <FieldContent>
                <FieldTitle>
                  Enable Touch ID and Face ID to make it even faster to unlock
                  your device. This is a long label to test the layout.
                </FieldTitle>
                <FieldDescription>
                  Enable Touch ID to quickly unlock your device.
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldLabel>
        </RadioGroup>
        <FieldSet>
          <FieldLegend variant="label">Invalid Radio Group</FieldLegend>
          <RadioGroup>
            <Field data-invalid orientation="horizontal">
              <RadioGroupItem
                value="invalid1"
                id="radio-invalid-1"
                aria-invalid
              />
              <FieldLabel htmlFor="radio-invalid-1">
                Invalid Option 1
              </FieldLabel>
            </Field>
            <Field data-invalid orientation="horizontal">
              <RadioGroupItem
                value="invalid2"
                id="radio-invalid-2"
                aria-invalid
              />
              <FieldLabel htmlFor="radio-invalid-2">
                Invalid Option 2
              </FieldLabel>
            </Field>
          </RadioGroup>
        </FieldSet>
        <FieldSet>
          <FieldLegend variant="label">Disabled Radio Group</FieldLegend>
          <RadioGroup disabled>
            <Field data-disabled orientation="horizontal">
              <RadioGroupItem value="disabled1" id="radio-disabled-1" disabled />
              <FieldLabel htmlFor="radio-disabled-1">
                Disabled Option 1
              </FieldLabel>
            </Field>
            <Field data-disabled orientation="horizontal">
              <RadioGroupItem value="disabled2" id="radio-disabled-2" disabled />
              <FieldLabel htmlFor="radio-disabled-2">
                Disabled Option 2
              </FieldLabel>
            </Field>
          </RadioGroup>
        </FieldSet>
      </FieldGroup>
    </Example>
  )
}
