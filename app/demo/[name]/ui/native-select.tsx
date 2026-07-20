import { Label } from "@/components/ui/label"
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select"

export const nativeSelect = {
  name: "native-select",
  components: {
    Default: (
      <div className="flex w-full justify-center p-6">
        <div className="grid w-full max-w-xs gap-2">
          <Label htmlFor="native-select-demo-fruit">Fruit</Label>
          <NativeSelect id="native-select-demo-fruit" className="w-full">
            <NativeSelectOption value="">Select a fruit</NativeSelectOption>
            <NativeSelectOption value="apple">Apple</NativeSelectOption>
            <NativeSelectOption value="banana">Banana</NativeSelectOption>
            <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
            <NativeSelectOption value="grapes">Grapes</NativeSelectOption>
            <NativeSelectOption value="pineapple">Pineapple</NativeSelectOption>
          </NativeSelect>
        </div>
      </div>
    ),
    "With Groups": (
      <div className="flex w-full justify-center p-6">
        <div className="grid w-full max-w-xs gap-2">
          <Label htmlFor="native-select-demo-timezone">Timezone</Label>
          <NativeSelect
            id="native-select-demo-timezone"
            className="w-full"
            defaultValue="gmt+1"
          >
            <NativeSelectOptGroup label="Europe">
              <NativeSelectOption value="gmt">GMT (UTC+0)</NativeSelectOption>
              <NativeSelectOption value="gmt+1">CET (UTC+1)</NativeSelectOption>
              <NativeSelectOption value="gmt+2">EET (UTC+2)</NativeSelectOption>
            </NativeSelectOptGroup>
            <NativeSelectOptGroup label="Americas">
              <NativeSelectOption value="gmt-5">EST (UTC-5)</NativeSelectOption>
              <NativeSelectOption value="gmt-6">CST (UTC-6)</NativeSelectOption>
              <NativeSelectOption value="gmt-8">PST (UTC-8)</NativeSelectOption>
            </NativeSelectOptGroup>
          </NativeSelect>
        </div>
      </div>
    ),
    "Sizes & Disabled": (
      <div className="flex w-full flex-wrap items-center justify-center gap-3 p-6">
        <NativeSelect size="sm" aria-label="Small select">
          <NativeSelectOption value="sm">Small</NativeSelectOption>
          <NativeSelectOption value="other">Other</NativeSelectOption>
        </NativeSelect>
        <NativeSelect aria-label="Default select">
          <NativeSelectOption value="default">Default</NativeSelectOption>
          <NativeSelectOption value="other">Other</NativeSelectOption>
        </NativeSelect>
        <NativeSelect disabled aria-label="Disabled select">
          <NativeSelectOption value="disabled">Disabled</NativeSelectOption>
        </NativeSelect>
      </div>
    ),
  },
}
