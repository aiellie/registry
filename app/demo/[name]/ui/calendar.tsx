import {
  CalendarDropdownDemo,
  CalendarRangeDemo,
  CalendarSingleDemo,
} from "@/app/demo/[name]/ui/calendar-demo"

export const calendar = {
  name: "calendar",
  components: {
    Single: (
      <div className="flex w-full items-center justify-center p-6">
        <CalendarSingleDemo />
      </div>
    ),
    Range: (
      <div className="flex w-full items-center justify-center p-6">
        <CalendarRangeDemo />
      </div>
    ),
    "Month & Year Dropdown": (
      <div className="flex w-full items-center justify-center p-6">
        <CalendarDropdownDemo />
      </div>
    ),
  },
}
