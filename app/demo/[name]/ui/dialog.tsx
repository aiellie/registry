"use client"

import {
  Example,
  ExampleWrapper,
} from "@/components/example"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function DialogExample() {
  return (
    <ExampleWrapper>
      <DialogWithForm />
      <DialogCloseButton />
      <DialogScrollableContent />
      <DialogWithStickyFooter />
      <DialogNoCloseButton />
    </ExampleWrapper>
  )
}

function DialogWithForm() {
  return (
    <Example title="With Form" className="items-center justify-center">
      <Dialog>
        <form>
          <DialogTrigger render={<Button variant="outline" />}>
            Edit Profile
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done. Your profile will be updated immediately.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name-1">Name</FieldLabel>
                <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
              </Field>
              <Field>
                <FieldLabel htmlFor="username-1">Username</FieldLabel>
                <Input
                  id="username-1"
                  name="username"
                  defaultValue="@peduarte"
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </Example>
  )
}

function DialogCloseButton() {
  return (
    <Example title="Close Button" className="items-center justify-center">
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>Share</DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share link</DialogTitle>
            <DialogDescription>
              Anyone who has this link will be able to view this.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input
                id="link"
                defaultValue="https://ui.shadcn.com/docs/installation"
                readOnly
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose render={<Button type="button" />}>Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Example>
  )
}

function DialogScrollableContent() {
  return (
    <Example title="Scrollable Content" className="items-center justify-center">
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          Scrollable Content
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scrollable Content</DialogTitle>
            <DialogDescription>
              This is a dialog with scrollable content.
            </DialogDescription>
          </DialogHeader>
          <div className="no-scrollbar max-h-[70vh] overflow-y-auto -mx-4 px-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <p
                key={index}
                className="mb-4 leading-normal"
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </Example>
  )
}

function DialogWithStickyFooter() {
  return (
    <Example title="With Sticky Footer" className="items-center justify-center">
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          Sticky Footer
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scrollable Content</DialogTitle>
            <DialogDescription>
              This is a dialog with scrollable content.
            </DialogDescription>
          </DialogHeader>
          <div className="no-scrollbar max-h-[70vh] overflow-y-auto -mx-4 px-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <p
                key={index}
                className="mb-4 leading-normal"
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            ))}
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Close
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Example>
  )
}

function DialogNoCloseButton() {
  return (
    <Example title="No Close Button" className="items-center justify-center">
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          No Close Button
        </DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>No Close Button</DialogTitle>
            <DialogDescription>
              This dialog doesn&apos;t have a close button in the top-right
              corner.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Close
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Example>
  )
}
