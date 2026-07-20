import {
  ComboboxChipsDemo,
  ComboboxDemo,
} from "@/app/demo/[name]/ui/combobox-demo"

export const combobox = {
  name: "combobox",
  components: {
    Default: (
      <div className="flex w-full justify-center p-6">
        <ComboboxDemo />
      </div>
    ),
    "Multiple with Chips": (
      <div className="flex w-full justify-center p-6">
        <ComboboxChipsDemo />
      </div>
    ),
  },
}
