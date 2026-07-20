import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export const textarea = {
  name: "textarea",
  components: {
    Default: (
      <div className="flex w-full justify-center p-6">
        <Textarea
          placeholder="Type your message here."
          className="max-w-sm"
          aria-label="Message"
        />
      </div>
    ),
    WithLabel: (
      <div className="flex w-full justify-center p-6">
        <div className="grid w-full max-w-sm gap-2">
          <Label htmlFor="textarea-demo-message">Your message</Label>
          <Textarea
            id="textarea-demo-message"
            placeholder="Type your message here."
          />
          <p className="text-muted-foreground text-sm">
            Your message will be copied to the support team.
          </p>
          <Button className="w-fit">Send message</Button>
        </div>
      </div>
    ),
    Disabled: (
      <div className="flex w-full justify-center p-6">
        <Textarea
          placeholder="This field is disabled."
          disabled
          className="max-w-sm"
          aria-label="Disabled message"
        />
      </div>
    ),
  },
}
