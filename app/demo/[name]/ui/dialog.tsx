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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const dialog = {
  name: "dialog",
  components: {
    Default: (
      <div className="flex w-full items-center justify-center p-6">
        <Dialog>
          <DialogTrigger render={<Button variant="outline" />}>
            Edit profile
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you are
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dialog-demo-name">Name</Label>
                <Input id="dialog-demo-name" defaultValue="Ellie Sophia" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dialog-demo-username">Username</Label>
                <Input id="dialog-demo-username" defaultValue="@aiellie" />
              </div>
            </div>
            <DialogFooter showCloseButton>
              <Button>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    ),
    Destructive: (
      <div className="flex w-full items-center justify-center p-6">
        <Dialog>
          <DialogTrigger render={<Button variant="destructive" />}>
            Delete project
          </DialogTrigger>
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>Delete project?</DialogTitle>
              <DialogDescription>
                This will permanently delete the project and all of its data.
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <Button variant="destructive">Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    ),
  },
}
