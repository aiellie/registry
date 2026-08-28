"use client"

import * as React from "react"

import { ArrowReloadHorizontalIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function InferenceParams() {
  const [temperature, setTemperature] = React.useState(0.7)
  const [topP, setTopP] = React.useState(0.95)
  const [stream, setStream] = React.useState(true)
  const [jsonMode, setJsonMode] = React.useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inference</CardTitle>
        <CardDescription>claude-opus-4.5 · balanced preset</CardDescription>
        <CardAction>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="bg-muted"
                  aria-label="Reset to defaults"
                  onClick={() => {
                    setTemperature(0.7)
                    setTopP(0.95)
                    setStream(true)
                    setJsonMode(false)
                  }}
                />
              }
            >
              <HugeiconsIcon icon={ArrowReloadHorizontalIcon} strokeWidth={2} />
            </TooltipTrigger>
            <TooltipContent>Reset to defaults</TooltipContent>
          </Tooltip>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="inference-temperature">Temperature</Label>
            <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs tabular-nums">
              {temperature.toFixed(2)}
            </span>
          </div>
          <Slider
            id="inference-temperature"
            value={[temperature]}
            onValueChange={(value) => setTemperature((value as number[])[0])}
            min={0}
            max={1}
            step={0.05}
          />
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">Precise</span>
            <span className="text-xs text-muted-foreground">Creative</span>
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="inference-top-p">Top P</Label>
            <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs tabular-nums">
              {topP.toFixed(2)}
            </span>
          </div>
          <Slider
            id="inference-top-p"
            value={[topP]}
            onValueChange={(value) => setTopP((value as number[])[0])}
            min={0}
            max={1}
            step={0.01}
          />
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">Narrow</span>
            <span className="text-xs text-muted-foreground">Full vocab</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-lg bg-muted/50 px-3 py-2.5">
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="text-sm font-medium">Max tokens</span>
            <span className="truncate text-xs text-muted-foreground">
              Hard cap per response
            </span>
          </div>
          <span className="shrink-0 rounded-md bg-background px-1.5 py-0.5 font-mono text-xs tabular-nums">
            4,096
          </span>
        </div>
        <Separator />
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-col gap-0.5">
              <Label htmlFor="inference-stream">Stream response</Label>
              <span className="truncate text-xs text-muted-foreground">
                Emit tokens as they are produced
              </span>
            </div>
            <Switch
              id="inference-stream"
              checked={stream}
              onCheckedChange={setStream}
              className="shrink-0"
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-col gap-0.5">
              <Label htmlFor="inference-json">JSON mode</Label>
              <span className="truncate text-xs text-muted-foreground">
                Constrain output to the schema
              </span>
            </div>
            <Switch
              id="inference-json"
              checked={jsonMode}
              onCheckedChange={setJsonMode}
              className="shrink-0"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <span className="min-w-0 truncate text-xs text-muted-foreground">
          Applies to new sessions
        </span>
        <Button size="sm">Save preset</Button>
      </CardFooter>
    </Card>
  )
}
