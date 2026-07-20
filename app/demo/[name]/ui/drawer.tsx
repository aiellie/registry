import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export const drawer = {
  name: "drawer",
  components: {
    Default: (
      <div className="flex w-full items-center justify-center p-6">
        <Drawer showSwipeHandle>
          <DrawerTrigger render={<Button variant="outline" />}>
            Open drawer
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>Move to trash?</DrawerTitle>
                <DrawerDescription>
                  The file will be moved to the trash and deleted after 30
                  days.
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <Button>Move to trash</Button>
                <DrawerClose render={<Button variant="outline" />}>
                  Cancel
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    ),
    Side: (
      <div className="flex w-full items-center justify-center p-6">
        <Drawer swipeDirection="right">
          <DrawerTrigger render={<Button variant="outline" />}>
            Open side drawer
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Notifications</DrawerTitle>
              <DrawerDescription>
                You are all caught up. New notifications will appear here.
              </DrawerDescription>
            </DrawerHeader>
            <div className="flex flex-col gap-2 p-4 text-sm text-muted-foreground">
              <div className="rounded-lg border p-3">
                Weekly report is ready to view.
              </div>
              <div className="rounded-lg border p-3">
                Your invoice for June has been paid.
              </div>
            </div>
            <DrawerFooter>
              <DrawerClose render={<Button variant="outline" />}>
                Close
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    ),
  },
}
