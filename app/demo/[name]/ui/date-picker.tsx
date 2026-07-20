import {
  DatePickerDemo,
  DatePickerWithDropdown,
} from "@/app/demo/[name]/ui/date-picker-demo"

export const datePicker = {
  name: "date-picker",
  components: {
    Default: (
      <div className="flex w-full justify-center p-6">
        <DatePickerDemo />
      </div>
    ),
    "Month and Year Dropdown": (
      <div className="flex w-full justify-center p-6">
        <DatePickerWithDropdown />
      </div>
    ),
  },
}
