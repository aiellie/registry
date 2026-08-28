"use client"

import * as React from "react"
import { FolderAddIcon, FolderIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

/** The "Create project" dialog; pass the trigger element as `children`. */
export function CreateProjectDialog({
  onCreate,
  children,
}: {
  onCreate?: (name: string) => void
  children: React.ReactElement
}) {
  const [name, setName] = React.useState("")

  return (
    <Dialog onOpenChange={(open) => !open && setName("")}>
      <DialogTrigger render={children} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
        </DialogHeader>
        <InputGroup className="h-10 rounded-xl">
          <InputGroupAddon className="self-stretch border-e px-3">
            <HugeiconsIcon icon={FolderIcon} strokeWidth={2} />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Project name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </InputGroup>
        <div className="flex flex-col gap-2">
          <div className="font-medium">Source folders</div>
          <button
            type="button"
            className="flex flex-col items-center gap-2 rounded-xl border py-8 text-muted-foreground transition-colors outline-none hover:bg-muted/50 hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <HugeiconsIcon
              icon={FolderAddIcon}
              strokeWidth={2}
              className="size-5"
            />
            <span>Add folders Aiellie can read and edit</span>
          </button>
        </div>
        <DialogFooter className="border-t-0 bg-transparent pt-0">
          <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
          <DialogClose
            render={<Button disabled={!name.trim()} />}
            onClick={() => onCreate?.(name.trim())}
          >
            Create project
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
