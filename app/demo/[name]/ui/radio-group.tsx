import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export const radioGroup = {
  name: "radio-group",
  components: {
    Default: (
      <div className="flex w-full items-center justify-center p-6">
        <RadioGroup defaultValue="comfortable" className="max-w-sm">
          <div className="flex items-center gap-3">
            <RadioGroupItem value="default" id="radio-demo-default" />
            <Label htmlFor="radio-demo-default">Default</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="comfortable" id="radio-demo-comfortable" />
            <Label htmlFor="radio-demo-comfortable">Comfortable</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="compact" id="radio-demo-compact" />
            <Label htmlFor="radio-demo-compact">Compact</Label>
          </div>
        </RadioGroup>
      </div>
    ),
    "With disabled option": (
      <div className="flex w-full items-center justify-center p-6">
        <RadioGroup defaultValue="starter" className="max-w-sm">
          <div className="flex items-center gap-3">
            <RadioGroupItem value="starter" id="radio-demo-starter" />
            <Label htmlFor="radio-demo-starter">Starter</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="pro" id="radio-demo-pro" />
            <Label htmlFor="radio-demo-pro">Pro</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="enterprise" id="radio-demo-enterprise" disabled />
            <Label
              htmlFor="radio-demo-enterprise"
              className="text-muted-foreground"
            >
              Enterprise (contact sales)
            </Label>
          </div>
        </RadioGroup>
      </div>
    ),
  },
}
