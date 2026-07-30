"use client"

import * as React from "react"

import {
  AiImageIcon,
  BrowserIcon,
  EggIcon,
  GithubIcon,
  GridViewIcon,
  Linkedin02Icon,
  Mail01Icon,
  NewTwitterIcon,
  Share01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Icons } from "@/components/icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status"
import { toast } from "@/components/ui/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { cn } from "@/lib/utils"

const AVATAR_ALT =
  "3D avatar of Ai Ellie, a woman with brown hair and tortoiseshell glasses."

const STATS = [
  { value: "157.5M", label: "Lifetime tokens" },
  { value: "88.6M", label: "Peak tokens" },
  { value: "36m 42s", label: "Longest chat" },
  { value: "3 days", label: "Current streak" },
  { value: "5 days", label: "Longest streak" },
]

const INSIGHTS = [
  { label: "Fast Mode", value: "10%" },
  { label: "Most used reasoning", value: "High · 57%" },
  { label: "Skills explored", value: "8" },
  { label: "Total skills used", value: "66" },
  { label: "Total chats", value: "166" },
]

const PLUGINS = [
  {
    name: "@browser",
    runs: "22 runs",
    icon: <HugeiconsIcon icon={BrowserIcon} strokeWidth={2} />,
  },
  {
    name: "@sites",
    runs: "21 runs",
    icon: <HugeiconsIcon icon={GridViewIcon} strokeWidth={2} />,
  },
  {
    name: "$imagegen",
    runs: "11 runs",
    icon: <HugeiconsIcon icon={AiImageIcon} strokeWidth={2} />,
  },
  {
    name: "$hatch-pet",
    runs: "8 runs",
    icon: <HugeiconsIcon icon={EggIcon} strokeWidth={2} />,
  },
  {
    name: "@github",
    runs: "2 runs",
    icon: <Icons.gitHub className="size-3.5" />,
  },
]

const MONTHS = [
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
]

const WEEKS = 52
const DAYS = 7

// "week-day" -> intensity; the streak lives in the last few columns.
const HEAT: Record<string, number> = {
  "49-4": 4,
  "50-0": 1,
  "50-2": 2,
  "50-4": 2,
  "51-0": 2,
  "51-1": 3,
  "51-2": 1,
  "51-3": 2,
  "51-5": 1,
}

const HEAT_CLASS = [
  "bg-muted",
  "bg-chart-1/50",
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
]

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/aiellie", icon: GithubIcon },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/aiellie",
    icon: Linkedin02Icon,
  },
  { label: "X", href: "https://x.com/aiellie", icon: NewTwitterIcon },
]

const RANGES = ["Daily", "Weekly", "Cumulative"] as const

export function AiellieProfile() {
  const { copyToClipboard } = useCopyToClipboard()
  const [range, setRange] = React.useState<(typeof RANGES)[number]>("Daily")

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger
          render={
            <DialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 overflow-hidden rounded-full p-0"
                >
                  <Avatar className="size-8">
                    <AvatarImage src="/avatars/aiellie.png" alt={AVATAR_ALT} />
                    <AvatarFallback>AE</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Ellie</span>
                </Button>
              }
            />
          }
        />
        <TooltipContent>Ellie</TooltipContent>
      </Tooltip>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-4rem)] gap-6 overflow-y-auto p-6 sm:max-w-2xl"
      >
        <div className="flex items-center justify-between">
          <DialogTitle className="sr-only">Profile</DialogTitle>
          <Status variant="success" pulse>
            <StatusIndicator />
            <StatusLabel>Available to work</StatusLabel>
          </Status>
          <div className="flex items-center gap-1">
            {SOCIALS.map((social) => (
              <Tooltip key={social.label}>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      nativeButton={false}
                      render={
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.label}
                        />
                      }
                    >
                      <HugeiconsIcon icon={social.icon} strokeWidth={2} />
                    </Button>
                  }
                />
                <TooltipContent>{social.label}</TooltipContent>
              </Tooltip>
            ))}
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => {
                      copyToClipboard("https://ui.aiellie.dev")
                      toast.add({
                        title: "Copied profile link to clipboard",
                        type: "success",
                      })
                    }}
                  >
                    <HugeiconsIcon icon={Share01Icon} strokeWidth={2} />
                    <span className="sr-only">Copy profile link</span>
                  </Button>
                }
              />
              <TooltipContent>Copy profile link</TooltipContent>
            </Tooltip>
            <Button
              variant="secondary"
              size="sm"
              className="ms-1"
              nativeButton={false}
              render={<a href="mailto:elliesophia1@gmail.com" />}
            >
              <HugeiconsIcon icon={Mail01Icon} strokeWidth={2} />
              Message me
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 text-center">
          <Avatar className="mb-3 size-20">
            <AvatarImage src="/avatars/aiellie.png" alt={AVATAR_ALT} />
            <AvatarFallback>AE</AvatarFallback>
          </Avatar>
          <p className="font-heading text-xl font-semibold tracking-tight">
            Ellie Linder
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <a
              href="https://aiellie.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              @aiellie.dev
            </a>
            <span>·</span>
            <span>Turning tokens into interfaces</span>
          </div>
        </div>

        <div className="grid grid-cols-2 rounded-xl border sm:grid-cols-5">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 px-2 py-4 max-sm:last:col-span-2 sm:not-first:border-s"
            >
              <span className="text-lg font-semibold tabular-nums">
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Token activity</p>
            <div className="flex items-center gap-3">
              {RANGES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRange(r)}
                  className={cn(
                    "text-sm transition-colors",
                    range === r
                      ? "font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="flex flex-col gap-2">
              <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
                {Array.from({ length: WEEKS * DAYS }, (_, i) => {
                  const week = Math.floor(i / DAYS)
                  const day = i % DAYS
                  return (
                    <span
                      key={i}
                      className={cn(
                        "size-2 rounded-xs",
                        HEAT_CLASS[HEAT[`${week}-${day}`] ?? 0]
                      )}
                    />
                  )
                })}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                {MONTHS.map((month) => (
                  <span key={month}>{month}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <div className="flex flex-col">
            <p className="mb-2 text-sm font-medium">Activity insights</p>
            {INSIGHTS.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between py-1.5 text-sm"
              >
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-medium tabular-nums">{row.value}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            <p className="mb-2 text-sm font-medium">Most used plugins</p>
            {PLUGINS.map((plugin) => (
              <div
                key={plugin.name}
                className="flex items-center justify-between py-1 text-sm"
              >
                <span className="flex items-center gap-2.5">
                  <span className="flex size-6 items-center justify-center rounded-md bg-muted text-muted-foreground [&_svg]:size-3.5">
                    {plugin.icon}
                  </span>
                  {plugin.name}
                </span>
                <span className="text-muted-foreground tabular-nums">
                  {plugin.runs}
                </span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
