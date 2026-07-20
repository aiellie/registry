import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export const checkbox = {
  name: "checkbox",
  components: {
    Default: (
      <div className="flex w-full justify-center p-6">
        <div className="flex items-center gap-3">
          <Checkbox id="checkbox-demo-terms" />
          <Label htmlFor="checkbox-demo-terms">
            Accept terms and conditions
          </Label>
        </div>
      </div>
    ),
    "With Description": (
      <div className="flex w-full justify-center p-6">
        <div className="flex items-start gap-3">
          <Checkbox id="checkbox-demo-updates" defaultChecked />
          <div className="grid gap-1.5">
            <Label htmlFor="checkbox-demo-updates">Email me updates</Label>
            <p className="text-sm text-muted-foreground">
              Occasional product news and announcements. No spam.
            </p>
          </div>
        </div>
      </div>
    ),
    Disabled: (
      <div className="flex w-full justify-center p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Checkbox id="checkbox-demo-disabled" disabled />
            <Label
              htmlFor="checkbox-demo-disabled"
              className="opacity-50 peer-disabled:cursor-not-allowed"
            >
              Disabled
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="checkbox-demo-disabled-checked" disabled defaultChecked />
            <Label
              htmlFor="checkbox-demo-disabled-checked"
              className="opacity-50 peer-disabled:cursor-not-allowed"
            >
              Disabled checked
            </Label>
          </div>
        </div>
      </div>
    ),
  },
}
