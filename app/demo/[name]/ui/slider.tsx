import { Slider } from "@/components/ui/slider"

export const slider = {
  name: "slider",
  components: {
    Default: (
      <div className="flex w-full items-center justify-center p-6">
        <Slider defaultValue={[50]} max={100} step={1} className="max-w-sm" />
      </div>
    ),
    Range: (
      <div className="flex w-full items-center justify-center p-6">
        <Slider
          defaultValue={[25, 75]}
          max={100}
          step={5}
          className="max-w-sm"
        />
      </div>
    ),
    Disabled: (
      <div className="flex w-full items-center justify-center p-6">
        <Slider defaultValue={[35]} max={100} step={1} disabled className="max-w-sm" />
      </div>
    ),
  },
}
