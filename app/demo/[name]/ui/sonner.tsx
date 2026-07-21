"use client"

import { toast } from "sonner"

import {
  Example,
  ExampleWrapper,
} from "@/components/example"
import { Button } from "@/components/ui/button"

export default function SonnerExample() {
  return (
    <ExampleWrapper>
      <SonnerBasic />
      <SonnerWithDescription />
      <SonnerWithAction />
      <SonnerTypes />
      <SonnerPosition />
    </ExampleWrapper>
  )
}

function SonnerBasic() {
  return (
    <Example title="Basic" className="items-center justify-center">
      <Button
        onClick={() => toast("Event has been created")}
        variant="outline"
        className="w-fit"
      >
        Show Toast
      </Button>
    </Example>
  )
}

function SonnerWithDescription() {
  return (
    <Example title="With Description" className="items-center justify-center">
      <Button
        onClick={() =>
          toast("Event has been created", {
            description: "Monday, January 3rd at 6:00pm",
          })
        }
        variant="outline"
        className="w-fit"
      >
        Show Toast
      </Button>
    </Example>
  )
}

function SonnerWithAction() {
  return (
    <Example title="With Action" className="items-center justify-center">
      <Button
        variant="outline"
        onClick={() =>
          toast("Event has been created", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          })
        }
      >
        Show Toast
      </Button>
    </Example>
  )
}

function SonnerTypes() {
  return (
    <Example title="Types" className="items-center justify-center">
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant="outline"
          onClick={() => toast("Event has been created")}
        >
          Default
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.success("Event has been created")}
        >
          Success
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.info("Be at the area 10 minutes before the event time")
          }
        >
          Info
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.warning("Event start time cannot be earlier than 8am")
          }
        >
          Warning
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.error("Event has not been created")}
        >
          Error
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            toast.promise<{ name: string }>(
              () =>
                new Promise((resolve) =>
                  setTimeout(() => resolve({ name: "Event" }), 2000)
                ),
              {
                loading: "Loading...",
                success: (data) => `${data.name} has been created`,
                error: "Error",
              }
            )
          }}
        >
          Promise
        </Button>
      </div>
    </Example>
  )
}

function SonnerPosition() {
  return (
    <Example title="Position" className="items-center justify-center">
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant="outline"
          onClick={() =>
            toast("Event has been created", { position: "top-left" })
          }
        >
          Top Left
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast("Event has been created", { position: "top-center" })
          }
        >
          Top Center
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast("Event has been created", { position: "top-right" })
          }
        >
          Top Right
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast("Event has been created", { position: "bottom-left" })
          }
        >
          Bottom Left
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast("Event has been created", { position: "bottom-center" })
          }
        >
          Bottom Center
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast("Event has been created", { position: "bottom-right" })
          }
        >
          Bottom Right
        </Button>
      </div>
    </Example>
  )
}
