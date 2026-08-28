"use client"

import * as React from "react"
import { ArrowRight02Icon, Copy01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { cn } from "@/lib/utils"
import {
  Announcement,
  AnnouncementTag,
  AnnouncementTitle,
} from "@/components/aiellie/alerts/announcement"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const RELEASES = [
  {
    version: "v2.4.0",
    tag: "New",
    title: "Code primitives",
    notes: [
      { kind: "added", text: "agent, artifact, commit and snippet items" },
      { kind: "added", text: "stack-trace with clickable frames" },
      { kind: "changed", text: "file-tree moved to components/code" },
    ],
  },
  {
    version: "v2.3.1",
    tag: "Fix",
    title: "Theme tokens",
    notes: [
      { kind: "fixed", text: "--success now overridden in dark mode" },
      { kind: "changed", text: "status pills use tinted backgrounds" },
    ],
  },
]

const KIND_STYLES: Record<string, string> = {
  added: "bg-success/10 text-success",
  changed: "bg-info/10 text-info",
  fixed: "bg-warning/10 text-warning",
}

export function ReleaseNotes() {
  const [index, setIndex] = React.useState(0)
  const { copyToClipboard } = useCopyToClipboard()

  const release = RELEASES[index]

  const copy = async () => {
    const body = [
      `${release.version} — ${release.title}`,
      ...release.notes.map((note) => `- ${note.kind}: ${note.text}`),
    ].join("\n")
    const ok = await copyToClipboard(body)
    toast.add({
      title: ok ? "Release notes copied" : "Couldn't reach the clipboard",
      type: ok ? "success" : "error",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Changelog</CardTitle>
        <CardDescription>What shipped in the registry</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <Announcement themed className="w-full justify-start">
          <AnnouncementTag>{release.tag}</AnnouncementTag>
          <AnnouncementTitle className="truncate">
            {release.version} · {release.title}
          </AnnouncementTitle>
        </Announcement>

        <div className="flex flex-col gap-2">
          {release.notes.map((note) => (
            <div key={note.text} className="flex items-start gap-2">
              <span
                className={cn(
                  "mt-px shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium capitalize",
                  KIND_STYLES[note.kind]
                )}
              >
                {note.kind}
              </span>
              <span className="min-w-0 flex-1 text-xs leading-relaxed text-muted-foreground">
                {note.text}
              </span>
            </div>
          ))}
        </div>

        <Separator />

        <div className="flex items-center gap-1.5">
          {RELEASES.map((item, i) => (
            <button
              key={item.version}
              type="button"
              onClick={() => setIndex(i)}
              aria-pressed={i === index}
              aria-label={`Show ${item.version}`}
              className={cn(
                "h-1.5 flex-1 cursor-pointer rounded-full transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                i === index
                  ? "bg-primary"
                  : "bg-muted hover:bg-muted-foreground/30"
              )}
            />
          ))}
        </div>
      </CardContent>

      <CardFooter className="justify-between gap-2">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Copy release notes"
                onClick={() => void copy()}
              />
            }
          >
            <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} />
          </TooltipTrigger>
          <TooltipContent>Copy release notes</TooltipContent>
        </Tooltip>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={() => setIndex((i) => (i + 1) % RELEASES.length)}
        >
          Older
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            strokeWidth={2}
            data-icon="inline-end"
            className="rtl:rotate-180"
          />
        </Button>
      </CardFooter>
    </Card>
  )
}
