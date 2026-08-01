import {
  Example,
  ExampleWrapper,
} from "@/components/example"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

export default function TextareaExample() {
  return (
    <ExampleWrapper>
      <TextareaBasic />
      <TextareaInvalid />
      <TextareaWithLabel />
      <TextareaWithDescription />
      <TextareaDisabled />
      <TextareaWithButton />
    </ExampleWrapper>
  )
}

function TextareaBasic({ className }: { className?: string }) {
  return (
    <Example title="Basic" containerClassName={className}>
      <Textarea placeholder="Type your message here." />
    </Example>
  )
}

function TextareaInvalid({ className }: { className?: string }) {
  return (
    <Example title="Invalid" containerClassName={className}>
      <Textarea placeholder="Type your message here." aria-invalid="true" />
    </Example>
  )
}

function TextareaWithLabel({ className }: { className?: string }) {
  return (
    <Example title="With Label" containerClassName={className}>
      <Field>
        <FieldLabel htmlFor="textarea-demo-message">Message</FieldLabel>
        <Textarea
          id="textarea-demo-message"
          placeholder="Type your message here."
          rows={6}
        />
      </Field>
    </Example>
  )
}

function TextareaWithDescription({ className }: { className?: string }) {
  return (
    <Example title="With Description" containerClassName={className}>
      <Field>
        <FieldLabel htmlFor="textarea-demo-message-2">Message</FieldLabel>
        <Textarea
          id="textarea-demo-message-2"
          placeholder="Type your message here."
          rows={6}
        />
        <FieldDescription>
          Type your message and press enter to send.
        </FieldDescription>
      </Field>
    </Example>
  )
}

function TextareaDisabled({ className }: { className?: string }) {
  return (
    <Example title="Disabled" containerClassName={className}>
      <Field>
        <FieldLabel htmlFor="textarea-demo-disabled">Message</FieldLabel>
        <Textarea
          id="textarea-demo-disabled"
          placeholder="Type your message here."
          disabled
        />
      </Field>
    </Example>
  )
}

function TextareaWithButton({ className }: { className?: string }) {
  return (
    <Example title="With Button" containerClassName={className}>
      <div className="grid w-full gap-2">
        <Textarea placeholder="Type your message here." />
        <Button>Send message</Button>
      </div>
    </Example>
  )
}
