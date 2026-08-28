"use client"

import * as React from "react"

import {
  AiImageIcon,
  BrowserIcon,
  Dollar01Icon,
  EggIcon,
  GithubIcon,
  GridViewIcon,
  Idea01Icon,
  Linkedin02Icon,
  Mail01Icon,
  MarketingIcon,
  NewTwitterIcon,
  Rocket01Icon,
  Share01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Icons } from "@/components/icons/icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Status,
  StatusIndicator,
  StatusLabel,
} from "@/components/aiellie/ui/status"
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

const SCHOOL = "IU Bloomington Kelley School of Business"

// The concentrations read as a set, so each one is an icon rather than a
// number — nothing here is a metric to count.
const STATS = [
  { icon: MarketingIcon, label: "Marketing" },
  { icon: Rocket01Icon, label: "Entrepreneurship" },
  { icon: Idea01Icon, label: "Corporate innovation" },
  { icon: Dollar01Icon, label: "Finance" },
]

const INSIGHTS = [
  {
    label: "Claude Code 101",
    value: "100%",
    status: "success" as const,
    href: "https://verify.skilljar.com/c/tyvtzxsrixux",
  },
  {
    label: "Introduction to Claude Cowork",
    value: "100%",
    status: "success" as const,
    href: "https://verify.skilljar.com/c/p5w4z5wbiq8k",
  },
  {
    label: "Claude 101",
    value: "100%",
    status: "success" as const,
    href: "https://verify.skilljar.com/c/nwz6msxc4bvh",
  },
  {
    label: "Claude Platform 101",
    value: "84%",
    status: "pending" as const,
  },
  {
    label: "Claude Code in Action",
    value: "70%",
    status: "pending" as const,
  },
]

const PLUGINS = [
  {
    name: "@portfolio",
    runs: "portfolio",
    icon: <HugeiconsIcon icon={BrowserIcon} strokeWidth={2} />,
  },
  {
    name: "@agentplayground",
    runs: "agent playground",
    icon: <HugeiconsIcon icon={GridViewIcon} strokeWidth={2} />,
  },
  {
    name: "@editor",
    runs: "rich text editor",
    icon: <HugeiconsIcon icon={GridViewIcon} strokeWidth={2} />,
  },
  {
    name: "$chat",
    runs: "ai chatbot",
    icon: <HugeiconsIcon icon={AiImageIcon} strokeWidth={2} />,
  },
  {
    name: "$shop",
    runs: "clothing store",
    icon: <HugeiconsIcon icon={EggIcon} strokeWidth={2} />,
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
  { label: "X", href: "https://x.com/aielliedev", icon: NewTwitterIcon },
  { label: "GitHub", href: "https://github.com/aiellie", icon: GithubIcon },
]

const RANGES = ["Daily", "Weekly", "Cumulative"] as const

export function AiellieProfile({
  open,
  onOpenChange,
  showTrigger = true,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  showTrigger?: boolean
} = {}) {
  const { copyToClipboard } = useCopyToClipboard()
  const [range, setRange] = React.useState<(typeof RANGES)[number]>("Daily")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {showTrigger ? (
        <Tooltip>
          <TooltipTrigger
            render={
              <DialogTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="overflow-hidden rounded-full p-0"
                  >
                    <Avatar size="sm">
                      <AvatarImage
                        src="/avatars/aiellie.png"
                        alt={AVATAR_ALT}
                      />
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
      ) : null}
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
                      copyToClipboard("https://registry.aiellie.dev")
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
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    nativeButton={false}
                    render={
                      <a
                        href="mailto:aiellie.dev@gmail.com"
                        aria-label="Message me"
                      />
                    }
                  >
                    <HugeiconsIcon icon={Mail01Icon} strokeWidth={2} />
                  </Button>
                }
              />
              <TooltipContent>Message me</TooltipContent>
            </Tooltip>
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
          <span>AI Engineer & UI Developer</span>
            <span>·</span>
            <span>{SCHOOL}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 rounded-xl border sm:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2 px-2 py-4 text-center max-sm:odd:last:col-span-2 sm:not-first:border-s"
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-muted [&_svg]:size-4">
                  <HugeiconsIcon icon={stat.icon} strokeWidth={2} />
                </span>
                <span className="text-xs text-balance text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="flex flex-col gap-3">
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
*/}
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="flex flex-col">
            <p className="mb-2 text-sm font-medium">Certifications</p>
            {INSIGHTS.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-3 py-1.5 text-sm"
              >
                {row.href ? (
                  <a
                    href={row.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    {row.label}
                  </a>
                ) : (
                  <span className="text-muted-foreground">{row.label}</span>
                )}
                <Status variant={row.status}>
                  <StatusLabel className="tabular-nums">
                    {row.value}
                  </StatusLabel>
                </Status>
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            <p className="mb-2 text-sm font-medium">Projects</p>
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
