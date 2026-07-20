import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export const label = {
  name: "label",
  components: {
    Default: (
      <div className="flex w-full justify-center p-6">
        <div className="grid w-full max-w-sm gap-2">
          <Label htmlFor="label-demo-email">Email</Label>
          <Input
            id="label-demo-email"
            type="email"
            placeholder="you@example.com"
          />
        </div>
      </div>
    ),
    "With Checkbox": (
      <div className="flex w-full justify-center p-6">
        <div className="flex items-center gap-3">
          <Checkbox id="label-demo-terms" />
          <Label htmlFor="label-demo-terms">Accept terms and conditions</Label>
        </div>
      </div>
    ),
    "With Textarea": (
      <div className="flex w-full justify-center p-6">
        <div className="grid w-full max-w-sm gap-2">
          <Label htmlFor="label-demo-message">
            Message
            <span className="text-muted-foreground font-normal">
              (optional)
            </span>
          </Label>
          <Textarea
            id="label-demo-message"
            placeholder="Type your message here."
          />
        </div>
      </div>
    ),
  },
}
