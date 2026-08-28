"use client"

import * as React from "react"
import { Calendar01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { TimePicker } from "@/components/aiellie/ui/time-picker"
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
import { Field, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/toast"

const DAYS = ["M", "T", "W", "T", "F", "S", "S"]
const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

export function ScheduleRun() {
  const [time, setTime] = React.useState("09:00")
  const [days, setDays] = React.useState<number[]>([0, 1, 2, 3, 4])
  const [enabled, setEnabled] = React.useState(true)

  const toggleDay = (index: number) =>
    setDays((current) =>
      current.includes(index)
        ? current.filter((day) => day !== index)
        : [...current, index].sort((a, b) => a - b)
    )

  const summary =
    days.length === 7
      ? "Every day"
      : days.length === 5 && days.every((d) => d < 5)
        ? "Weekdays"
        : days.length === 0
          ? "No days selected"
          : days.map((d) => DAY_NAMES[d].slice(0, 3)).join(", ")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scheduled Build</CardTitle>
        <CardDescription className="truncate font-mono text-xs">
          pnpm registry:build
        </CardDescription>
        <CardAction>
          <Switch
            checked={enabled}
            onCheckedChange={setEnabled}
            aria-label="Enable the scheduled build"
          />
        </CardAction>
      </CardHeader>

      <CardContent
        className={cn(
          "flex flex-col gap-4 transition-opacity",
          !enabled && "pointer-events-none opacity-50"
        )}
      >
        <Field>
          <FieldLabel htmlFor="schedule-run-time">Run at</FieldLabel>
          <TimePicker
            id="schedule-run-time"
            value={time}
            onValueChange={setTime}
            minuteStep={15}
            disabled={!enabled}
          />
        </Field>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Repeat
          </span>
          <div className="flex gap-1">
            {DAYS.map((label, index) => {
              const active = days.includes(index)
              return (
                <button
                  key={DAY_NAMES[index]}
                  type="button"
                  onClick={() => toggleDay(index)}
                  aria-pressed={active}
                  aria-label={DAY_NAMES[index]}
                  disabled={!enabled}
                  className={cn(
                    "flex h-8 flex-1 cursor-pointer items-center justify-center rounded-md text-xs font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted-foreground/15"
                  )}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-2.5 py-2">
          <HugeiconsIcon
            icon={Calendar01Icon}
            strokeWidth={2}
            className="size-3.5 shrink-0 text-muted-foreground"
          />
          <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
            {summary} at {time}
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          disabled={!enabled || days.length === 0}
          onClick={() =>
            toast.add({
              title: `Scheduled — ${summary} at ${time}`,
              type: "success",
            })
          }
        >
          Save schedule
        </Button>
      </CardFooter>
    </Card>
  )
}
