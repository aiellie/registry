"use client"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export function SonnerDemo() {
  return (
    <div className="flex max-w-md flex-wrap items-center justify-center gap-2">
      <Button
        variant="outline"
        onClick={() =>
          toast("Event has been created", {
            description: "Sunday, July 26 at 9:00 AM",
            action: {
              label: "Undo",
              onClick: () => toast("Event restored"),
            },
          })
        }
      >
        Default
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.success("Changes saved successfully")}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.info("A new version is available")}
      >
        Info
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.warning("Storage is almost full")}
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.error("Something went wrong")}
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.promise(
            new Promise<void>((resolve) => setTimeout(() => resolve(), 1800)),
            {
              loading: "Uploading file...",
              success: "File uploaded",
              error: "Upload failed",
            }
          )
        }
      >
        Promise
      </Button>
    </div>
  )
}
