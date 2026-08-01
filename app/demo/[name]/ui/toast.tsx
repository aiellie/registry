"use client"

import { Example, ExampleWrapper } from "@/components/example"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

export default function ToastExample() {
  return (
    <ExampleWrapper>
      <ToastBasic />
      <ToastWithDescription />
      <ToastTypes />
      <ToastWithAction />
      <ToastPromise />
      <ToastPersistent />
      <ToastStacking />
    </ExampleWrapper>
  )
}

function ToastBasic({ className }: { className?: string }) {
  return (
    <Example title="Basic" className="items-center justify-center" containerClassName={className}>
      <Button
        variant="outline"
        className="w-fit"
        onClick={() => toast.add({ title: "Event has been created" })}
      >
        Show Toast
      </Button>
    </Example>
  )
}

function ToastWithDescription({ className }: { className?: string }) {
  return (
    <Example title="With Description" className="items-center justify-center" containerClassName={className}>
      <Button
        variant="outline"
        className="w-fit"
        onClick={() =>
          toast.add({
            title: "Event has been created",
            description: "Monday, January 3rd at 6:00pm",
          })
        }
      >
        Show Toast
      </Button>
    </Example>
  )
}

function ToastTypes({ className }: { className?: string }) {
  return (
    <Example title="Types" className="items-center justify-center" containerClassName={className}>
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant="outline"
          onClick={() => toast.add({ title: "Event has been created" })}
        >
          Default
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.add({
              title: "Event has been created",
              type: "success",
            })
          }
        >
          Success
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.add({
              title: "Be at the area 10 minutes before the event",
              type: "info",
            })
          }
        >
          Info
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.add({
              title: "Event start time cannot be earlier than 8am",
              type: "warning",
            })
          }
        >
          Warning
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.add({
              title: "Event has not been created",
              type: "error",
            })
          }
        >
          Error
        </Button>
      </div>
    </Example>
  )
}

function ToastWithAction({ className }: { className?: string }) {
  return (
    <Example title="With Action" className="items-center justify-center" containerClassName={className}>
      <Button
        variant="outline"
        className="w-fit"
        onClick={() => {
          const id = toast.add({
            title: "Event has been created",
            description: "Sunday, December 03, 2023 at 9:00 AM",
            actionProps: {
              children: "Undo",
              onClick: () => toast.close(id),
            },
          })
        }}
      >
        Show Toast
      </Button>
    </Example>
  )
}

function ToastPromise({ className }: { className?: string }) {
  return (
    <Example title="Promise" className="items-center justify-center" containerClassName={className}>
      <Button
        variant="outline"
        className="w-fit"
        onClick={() => {
          toast.promise(
            new Promise<{ name: string }>((resolve) =>
              setTimeout(() => resolve({ name: "Event" }), 2000)
            ),
            {
              loading: { title: "Creating event...", type: "loading" },
              success: (data) => ({
                title: `${data.name} has been created`,
                type: "success",
              }),
              error: { title: "Event has not been created", type: "error" },
            }
          )
        }}
      >
        Create Event
      </Button>
    </Example>
  )
}

function ToastPersistent({ className }: { className?: string }) {
  return (
    <Example title="Persistent" className="items-center justify-center" containerClassName={className}>
      <Button
        variant="outline"
        className="w-fit"
        onClick={() =>
          toast.add({
            title: "Your session is about to expire",
            description: "This toast stays until you dismiss it.",
            type: "warning",
            timeout: 0,
          })
        }
      >
        Show Toast
      </Button>
    </Example>
  )
}

function ToastStacking({ className }: { className?: string }) {
  return (
    <Example title="Stacking" className="items-center justify-center" containerClassName={className}>
      <Button
        variant="outline"
        className="w-fit"
        onClick={() => {
          for (let index = 1; index <= 3; index += 1) {
            toast.add({
              title: `Event ${index} has been created`,
              description: "Hover the stack to expand it.",
            })
          }
        }}
      >
        Show Three Toasts
      </Button>
    </Example>
  )
}
