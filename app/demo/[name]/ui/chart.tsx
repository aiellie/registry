import {
  ChartAreaDemo,
  ChartBarDemo,
} from "@/app/demo/[name]/ui/chart-demo"

export const chart = {
  name: "chart",
  components: {
    "Bar Chart": (
      <div className="flex w-full justify-center p-6">
        <div className="w-full max-w-md">
          <ChartBarDemo />
        </div>
      </div>
    ),
    "Area Chart": (
      <div className="flex w-full justify-center p-6">
        <div className="w-full max-w-md">
          <ChartAreaDemo />
        </div>
      </div>
    ),
  },
}
