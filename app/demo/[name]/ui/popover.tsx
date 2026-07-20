import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

export const popover = {
  name: "popover",
  components: {
    Default: (
      <div className="flex w-full items-center justify-center p-6">
        <Popover>
          <PopoverTrigger render={<Button variant="outline" />}>
            Open popover
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <PopoverHeader>
              <PopoverTitle>Dimensions</PopoverTitle>
              <PopoverDescription>
                Set the dimensions for the layer.
              </PopoverDescription>
            </PopoverHeader>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="popover-demo-width">Width</Label>
                <Input
                  id="popover-demo-width"
                  defaultValue="100%"
                  className="col-span-2"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="popover-demo-height">Height</Label>
                <Input
                  id="popover-demo-height"
                  defaultValue="25px"
                  className="col-span-2"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    ),
    Top: (
      <div className="flex w-full items-center justify-center p-6">
        <Popover>
          <PopoverTrigger render={<Button variant="outline" />}>
            Show info
          </PopoverTrigger>
          <PopoverContent side="top" className="w-64">
            <PopoverHeader>
              <PopoverTitle>Heads up</PopoverTitle>
              <PopoverDescription>
                This popover opens above its trigger and flips automatically
                when space runs out.
              </PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      </div>
    ),
  },
}
