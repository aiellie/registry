import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"

export const progress = {
  name: "progress",
  components: {
    Default: (
      <div className="flex w-full items-center justify-center p-6">
        <Progress value={62} className="w-full max-w-sm" />
      </div>
    ),
    "With label": (
      <div className="flex w-full items-center justify-center p-6">
        <Progress value={45} className="w-full max-w-sm">
          <ProgressLabel>Uploading files</ProgressLabel>
          <ProgressValue />
        </Progress>
      </div>
    ),
    Complete: (
      <div className="flex w-full items-center justify-center p-6">
        <Progress value={100} className="w-full max-w-sm">
          <ProgressLabel>Backup</ProgressLabel>
          <ProgressValue />
        </Progress>
      </div>
    ),
  },
}
