import {
  Example,
  ExampleWrapper,
} from "@/components/example"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { HugeiconsIcon } from "@hugeicons/react"
import { InformationCircleIcon } from "@hugeicons/core-free-icons"

export default function InputExample() {
  return (
    <ExampleWrapper>
      <InputBasic />
      <InputInvalid />
      <InputWithLabel />
      <InputWithDescription />
      <InputRequired />
      <InputWithBadge />
      <InputDisabled />
      <InputTypes />
      <InputGrid />
      <InputWithSelect />
      <InputWithButton />
      <InputButtonGroup />
      <InputInputGroup />
      <InputWithNativeSelect />
      <InputForm />
    </ExampleWrapper>
  )
}

function InputBasic() {
  return (
    <Example title="Basic">
      <Input type="email" placeholder="Email" />
    </Example>
  )
}

function InputInvalid() {
  return (
    <Example title="Invalid">
      <Input type="text" placeholder="Error" aria-invalid="true" />
    </Example>
  )
}

function InputWithLabel() {
  return (
    <Example title="With Label">
      <Field>
        <FieldLabel htmlFor="input-demo-email">Email</FieldLabel>
        <Input
          id="input-demo-email"
          type="email"
          placeholder="name@example.com"
        />
      </Field>
    </Example>
  )
}

function InputWithDescription() {
  return (
    <Example title="With Description">
      <Field>
        <FieldLabel htmlFor="input-demo-username">Username</FieldLabel>
        <Input
          id="input-demo-username"
          type="text"
          placeholder="Enter your username"
        />
        <FieldDescription>
          Choose a unique username for your account.
        </FieldDescription>
      </Field>
    </Example>
  )
}

function InputDisabled() {
  return (
    <Example title="Disabled">
      <Field>
        <FieldLabel htmlFor="input-demo-disabled">Email</FieldLabel>
        <Input
          id="input-demo-disabled"
          type="email"
          placeholder="Email"
          disabled
        />
      </Field>
    </Example>
  )
}

function InputRequired() {
  return (
    <Example title="Required">
      <Field>
        <FieldLabel htmlFor="input-required">
          Required Field <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          id="input-required"
          placeholder="This field is required"
          required
        />
        <FieldDescription>This field must be filled out.</FieldDescription>
      </Field>
    </Example>
  )
}

function InputWithBadge() {
  return (
    <Example title="With Badge">
      <Field>
        <FieldLabel htmlFor="input-badge">
          Webhook URL{" "}
          <Badge variant="secondary" className="ms-auto">
            Beta
          </Badge>
        </FieldLabel>
        <Input
          id="input-badge"
          type="url"
          placeholder="https://api.example.com/webhook"
        />
      </Field>
    </Example>
  )
}

function InputTypes() {
  return (
    <Example
      title="Input Types"
      containerClassName="lg:col-span-full 2xl:col-span-full"
    >
      <div className="flex w-full flex-col gap-6">
        <Field>
          <FieldLabel htmlFor="input-demo-password">Password</FieldLabel>
          <Input
            id="input-demo-password"
            type="password"
            placeholder="Password"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="input-demo-tel">Phone</FieldLabel>
          <Input
            id="input-demo-tel"
            type="tel"
            placeholder="+1 (555) 123-4567"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="input-demo-url">URL</FieldLabel>
          <Input
            id="input-demo-url"
            type="url"
            placeholder="https://example.com"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="input-demo-search">Search</FieldLabel>
          <Input id="input-demo-search" type="search" placeholder="Search" />
        </Field>
        <Field>
          <FieldLabel htmlFor="input-demo-number">Number</FieldLabel>
          <Input id="input-demo-number" type="number" placeholder="123" />
        </Field>
        <Field>
          <FieldLabel htmlFor="input-demo-date">Date</FieldLabel>
          <Input id="input-demo-date" type="date" />
        </Field>
        <Field>
          <FieldLabel htmlFor="input-demo-time">Time</FieldLabel>
          <Input id="input-demo-time" type="time" />
        </Field>
        <Field>
          <FieldLabel htmlFor="input-demo-file">File</FieldLabel>
          <Input id="input-demo-file" type="file" />
        </Field>
      </div>
    </Example>
  )
}

function InputGrid() {
  return (
    <Example title="Grid">
      <FieldGroup className="grid max-w-sm grid-cols-2">
        <Field>
          <FieldLabel htmlFor="grid-first-name">First Name</FieldLabel>
          <Input id="grid-first-name" placeholder="Jordan" />
        </Field>
        <Field>
          <FieldLabel htmlFor="grid-last-name">Last Name</FieldLabel>
          <Input id="grid-last-name" placeholder="Lee" />
        </Field>
      </FieldGroup>
    </Example>
  )
}

function InputWithSelect() {
  return (
    <Example title="With Select">
      <div className="flex w-full gap-2">
        <Input type="text" placeholder="Enter amount" className="flex-1" />
        <Select defaultValue="usd">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="usd">USD</SelectItem>
              <SelectItem value="eur">EUR</SelectItem>
              <SelectItem value="gbp">GBP</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </Example>
  )
}

function InputWithButton() {
  return (
    <Example title="With Button">
      <div className="flex w-full gap-2">
        <Input type="search" placeholder="Search..." className="flex-1" />
        <Button>Search</Button>
      </div>
    </Example>
  )
}

function InputButtonGroup() {
  return (
    <Example title="Button Group">
      <Field>
        <FieldLabel htmlFor="input-button-group">Search</FieldLabel>
        <ButtonGroup>
          <Input id="input-button-group" placeholder="Type to search..." />
          <Button variant="outline">Search</Button>
        </ButtonGroup>
      </Field>
    </Example>
  )
}

function InputInputGroup() {
  return (
    <Example title="Input Group">
      <Field>
        <FieldLabel htmlFor="input-group-url">Website URL</FieldLabel>
        <InputGroup>
          <InputGroupInput id="input-group-url" placeholder="example.com" />
          <InputGroupAddon>
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} />
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </Example>
  )
}

function InputWithNativeSelect() {
  return (
    <Example title="With Native Select">
      <div className="flex w-full gap-2">
        <Input type="tel" placeholder="(555) 123-4567" className="flex-1" />
        <NativeSelect defaultValue="+1">
          <NativeSelectOption value="+1">+1</NativeSelectOption>
          <NativeSelectOption value="+44">+44</NativeSelectOption>
          <NativeSelectOption value="+46">+46</NativeSelectOption>
        </NativeSelect>
      </div>
    </Example>
  )
}

function InputForm() {
  return (
    <Example
      title="Form"
      containerClassName="lg:col-span-full 2xl:col-span-full"
    >
      <form className="w-full">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="form-name">Name</FieldLabel>
            <Input id="form-name" type="text" placeholder="John Doe" />
          </Field>
          <Field>
            <FieldLabel htmlFor="form-email">Email</FieldLabel>
            <Input
              id="form-email"
              type="email"
              placeholder="john@example.com"
            />
            <FieldDescription>
              We&apos;ll never share your email with anyone.
            </FieldDescription>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="form-phone">Phone</FieldLabel>
              <Input
                id="form-phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="form-country">Country</FieldLabel>
              <Select defaultValue="us">
                <SelectTrigger id="form-country">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="form-address">Address</FieldLabel>
            <Input id="form-address" type="text" placeholder="123 Main St" />
          </Field>
          <Field orientation="horizontal">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </Field>
        </FieldGroup>
      </form>
    </Example>
  )
}
