"use client"

import * as React from "react"
import {
  CancelCircleIcon,
  CheckmarkCircle02Icon,
  GitMergeIcon,
  RefreshIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { gradientImage } from "@/lib/gradient"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import {
  Status,
  StatusIndicator,
  StatusLabel,
} from "@/components/aiellie/ui/status"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const author = { handle: "sofia-davis", initials: "SD" }

const reviewers = [
  { handle: "jackson-lee", initials: "JL" },
  { handle: "isabella-nguyen", initials: "IN" },
]

const E2E_OUTPUT = [
  "✘ registry/install.spec.ts:42 › installs from a registry URL",
  '    expected "Added 1 file" — received "Added 0 files"',
  "",
  "✘ registry/theme.spec.ts:18 › applies the theme item",
  "    timed out waiting for [data-slot=card]",
]

type ReviewVerdict = "approved" | "changes" | "commented"

const VERDICTS: {
  value: ReviewVerdict
  label: string
  hint: string
}[] = [
  { value: "approved", label: "Approve", hint: "Looks good to merge" },
  {
    value: "changes",
    label: "Request changes",
    hint: "Blocks the merge until resolved",
  },
  { value: "commented", label: "Comment", hint: "Feedback without a verdict" },
]

const additions = 412
const deletions = 87
const additionsShare = (additions / (additions + deletions)) * 100

export function PullRequest() {
  const [merged, setMerged] = React.useState(false)
  const [e2ePassing, setE2ePassing] = React.useState(false)
  const [rerunning, setRerunning] = React.useState(false)
  const [verdict, setVerdict] = React.useState<ReviewVerdict | null>(null)
  const [draft, setDraft] = React.useState("")
  const [reviewOpen, setReviewOpen] = React.useState(false)
  const [showOutput, setShowOutput] = React.useState(false)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // Nothing here runs on mount; this only tidies up a re-run left in flight.
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const rerunE2e = () => {
    if (rerunning) return
    setRerunning(true)
    setShowOutput(false)
    timerRef.current = setTimeout(() => {
      setE2ePassing(true)
      setRerunning(false)
    }, 1600)
  }

  const checks = [
    {
      name: "build · next build",
      duration: "1m 04s",
      failing: false,
    },
    {
      name: "types · tsc --noEmit",
      duration: "38s",
      failing: false,
    },
    {
      name: rerunning
        ? "e2e · running…"
        : e2ePassing
          ? "e2e · 36 specs passing"
          : "e2e · 2 specs failing",
      duration: rerunning ? "—" : e2ePassing ? "3m 04s" : "3m 12s",
      failing: !e2ePassing,
      running: rerunning,
    },
  ]

  // Changes requested or a red e2e run both hold the merge button shut.
  const blocked = !e2ePassing || verdict === "changes"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="line-clamp-2 pe-1">
          Add container queries to the registry block viewer grid
        </CardTitle>
        <CardDescription className="text-xs">
          <span className="font-mono">#412</span>{" "}
          {merged ? "merged just now" : "opened 3 hours ago"}
        </CardDescription>
        <CardAction>
          {merged ? (
            <Status variant="brand">
              <StatusIndicator />
              <StatusLabel>Merged</StatusLabel>
            </Status>
          ) : verdict === "changes" ? (
            <Status variant="pending">
              <StatusIndicator />
              <StatusLabel>Changes</StatusLabel>
            </Status>
          ) : verdict === "approved" ? (
            <Status variant="success">
              <StatusIndicator />
              <StatusLabel>Approved</StatusLabel>
            </Status>
          ) : (
            <Status variant="success">
              <StatusIndicator />
              <StatusLabel>Open</StatusLabel>
            </Status>
          )}
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <Avatar size="sm" animated>
            <AvatarImage
              src={gradientImage(author.handle)}
              alt={`${author.handle} avatar`}
            />
            <AvatarFallback>{author.initials}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-xs font-medium">
              {author.handle}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              <span className="font-mono">feat/cq-grid</span> into{" "}
              <span className="font-mono">main</span>
            </span>
          </div>
          {/* Animated: the reviewer stack fans apart and lifts on hover. */}
          <AvatarGroup animated className="shrink-0">
            {reviewers.map((reviewer) => (
              <Tooltip key={reviewer.handle}>
                <TooltipTrigger
                  render={
                    <Avatar size="sm">
                      <AvatarImage
                        src={gradientImage(reviewer.handle)}
                        alt={`${reviewer.handle} avatar`}
                      />
                      <AvatarFallback>{reviewer.initials}</AvatarFallback>
                    </Avatar>
                  }
                />
                <TooltipContent>{reviewer.handle}</TooltipContent>
              </Tooltip>
            ))}
            <AvatarGroupCount className="text-xs">+3</AvatarGroupCount>
          </AvatarGroup>
        </div>

        {verdict ? (
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-2.5 py-2">
            <Avatar size="sm" animated>
              <AvatarImage src={gradientImage("you")} alt="Your avatar" />
              <AvatarFallback>YO</AvatarFallback>
            </Avatar>
            <span className="min-w-0 flex-1 truncate text-xs">
              You{" "}
              <span className="text-muted-foreground">
                {verdict === "approved"
                  ? "approved these changes"
                  : verdict === "changes"
                    ? "requested changes"
                    : "left a comment"}
              </span>
            </span>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Dismiss your review"
                    onClick={() => setVerdict(null)}
                  />
                }
              >
                <HugeiconsIcon icon={CancelCircleIcon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>Dismiss review</TooltipContent>
            </Tooltip>
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-success/5 px-1.5 py-0.5 font-mono text-xs font-medium text-success tabular-nums">
              +{additions}
            </span>
            <span className="rounded-md bg-destructive/5 px-1.5 py-0.5 font-mono text-xs font-medium text-destructive tabular-nums">
              &minus;{deletions}
            </span>
            <span className="ms-auto truncate text-xs text-muted-foreground">
              18 files changed
            </span>
          </div>
          <div
            className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted"
            role="img"
            aria-label="412 additions and 87 deletions"
          >
            <div
              className="h-full bg-success"
              style={{ width: `${additionsShare}%` }}
            />
            <div
              className="h-full bg-destructive"
              style={{ width: `${100 - additionsShare}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          {checks.map((check) => {
            const row = (
              <div
                className={cn(
                  // The row itself carries the state as a tint, so a red check
                  // reads before you get to the icon.
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 ring-1 ring-inset",
                  check.running
                    ? "bg-muted/50 ring-transparent"
                    : check.failing
                      ? "bg-destructive/5 ring-destructive/10"
                      : "bg-success/5 ring-success/10"
                )}
              >
                {check.running ? (
                  <Spinner className="size-4 shrink-0 text-muted-foreground" />
                ) : (
                  <HugeiconsIcon
                    icon={
                      check.failing ? CancelCircleIcon : CheckmarkCircle02Icon
                    }
                    strokeWidth={2}
                    className={cn(
                      "size-4 shrink-0",
                      check.failing ? "text-destructive" : "text-success"
                    )}
                  />
                )}
                <span className="min-w-0 flex-1 truncate font-mono text-xs">
                  {check.name}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                  {check.duration}
                </span>
              </div>
            )

            if (!check.failing || check.running) {
              return <div key={check.name}>{row}</div>
            }

            return (
              <Collapsible
                key={check.name}
                open={showOutput}
                onOpenChange={setShowOutput}
              >
                <CollapsibleTrigger
                  render={
                    <button
                      type="button"
                      className="w-full cursor-pointer rounded-lg text-start outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                      aria-label="Toggle e2e failure output"
                    />
                  }
                >
                  {row}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-1.5 flex flex-col gap-2 rounded-lg bg-muted/60 p-2.5">
                    <pre className="max-h-28 overflow-auto font-mono text-[0.7rem] leading-relaxed text-muted-foreground">
                      {E2E_OUTPUT.join("\n")}
                    </pre>
                    <Button
                      variant="outline"
                      size="xs"
                      className="self-start"
                      onClick={rerunE2e}
                    >
                      <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} />
                      Re-run e2e
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )
          })}
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        {merged ? (
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              setMerged(false)
              setVerdict(null)
              setE2ePassing(false)
            }}
          >
            <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} />
            Reopen
          </Button>
        ) : (
          <>
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button className="flex-1" disabled={blocked}>
                    <HugeiconsIcon icon={GitMergeIcon} strokeWidth={2} />
                    Merge
                  </Button>
                }
              />
              <AlertDialogContent size="sm" className="theme-neutral">
                <AlertDialogHeader>
                  <AlertDialogTitle>Squash and merge #412?</AlertDialogTitle>
                  <AlertDialogDescription>
                    18 files will be squashed into a single commit on{" "}
                    <span className="font-mono">main</span>, and{" "}
                    <span className="font-mono">feat/cq-grid</span> will be
                    deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => setMerged(true)}>
                    Squash and merge
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
              <DialogTrigger
                render={
                  <Button variant="outline" className="flex-1">
                    Review
                  </Button>
                }
              />
              <DialogContent className="theme-neutral">
                <DialogHeader>
                  <DialogTitle>Review changes</DialogTitle>
                  <DialogDescription>
                    Leave a verdict on <span className="font-mono">#412</span>.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3">
                  <Textarea
                    placeholder={`Leave a note for ${author.handle}…`}
                    className="min-h-20 resize-none"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                  />
                  <div className="flex flex-col gap-1.5">
                    {VERDICTS.map((option) => (
                      <Button
                        key={option.value}
                        variant={
                          option.value === "approved" ? "default" : "outline"
                        }
                        className="h-auto justify-start py-2 text-start"
                        onClick={() => {
                          setVerdict(option.value)
                          setDraft("")
                          setReviewOpen(false)
                        }}
                      >
                        <span className="flex min-w-0 flex-col">
                          <span className="truncate">{option.label}</span>
                          <span className="truncate text-xs font-normal opacity-70">
                            {option.hint}
                          </span>
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose render={<Button variant="ghost" />}>
                    Cancel
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
