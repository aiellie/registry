import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const fruits = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Blueberry", value: "blueberry" },
  { label: "Grapes", value: "grapes" },
  { label: "Pineapple", value: "pineapple" },
]

const timezones = [
  { label: "Pacific (PT)", value: "pt" },
  { label: "Mountain (MT)", value: "mt" },
  { label: "Central (CT)", value: "ct" },
  { label: "Eastern (ET)", value: "et" },
  { label: "Greenwich (GMT)", value: "gmt" },
  { label: "Central European (CET)", value: "cet" },
]

export const select = {
  name: "select",
  components: {
    Default: (
      <div className="flex w-full justify-center p-6">
        <Select items={fruits}>
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              {fruits.map((fruit) => (
                <SelectItem key={fruit.value} value={fruit.value}>
                  {fruit.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    ),
    Grouped: (
      <div className="flex w-full justify-center p-6">
        <Select items={timezones} defaultValue="et">
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Select a timezone" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>North America</SelectLabel>
              {timezones.slice(0, 4).map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Europe</SelectLabel>
              {timezones.slice(4).map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    ),
    Small: (
      <div className="flex w-full justify-center p-6">
        <Select items={fruits} defaultValue="banana">
          <SelectTrigger size="sm" className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {fruits.map((fruit) => (
                <SelectItem key={fruit.value} value={fruit.value}>
                  {fruit.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    ),
  },
}
