import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const input = {
  name: "input",
  components: {
    Default: (
      <div className="flex w-full justify-center p-6">
        <Input type="email" placeholder="Email" className="max-w-sm" />
      </div>
    ),
    File: (
      <div className="flex w-full justify-center p-6">
        <div className="grid w-full max-w-sm items-center gap-2">
          <Label htmlFor="input-demo-picture">Picture</Label>
          <Input id="input-demo-picture" type="file" />
        </div>
      </div>
    ),
    Disabled: (
      <div className="flex w-full justify-center p-6">
        <Input disabled placeholder="Disabled" className="max-w-sm" />
      </div>
    ),
  },
}
