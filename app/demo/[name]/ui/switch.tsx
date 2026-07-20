import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export const switchComponent = {
  name: "switch",
  components: {
    Default: (
      <div className="flex w-full items-center justify-center gap-2 p-6">
        <Switch id="switch-airplane" />
        <Label htmlFor="switch-airplane">Airplane Mode</Label>
      </div>
    ),
    Small: (
      <div className="flex w-full items-center justify-center gap-2 p-6">
        <Switch id="switch-notifications" size="sm" defaultChecked />
        <Label htmlFor="switch-notifications">Enable notifications</Label>
      </div>
    ),
    Disabled: (
      <div className="flex w-full flex-wrap items-center justify-center gap-6 p-6">
        <div className="flex items-center gap-2">
          <Switch id="switch-disabled-off" disabled />
          <Label htmlFor="switch-disabled-off">Disabled</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="switch-disabled-on" disabled defaultChecked />
          <Label htmlFor="switch-disabled-on">Disabled checked</Label>
        </div>
      </div>
    ),
  },
}
