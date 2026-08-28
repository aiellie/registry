"use client"

import * as React from "react"

import { Example, ExampleWrapper } from "@/components/example"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/components/ui/attachment"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  FileIcon,
  Cancel01Icon,
  TableIcon,
  File01Icon,
  Presentation01Icon,
  Clock01Icon,
  FileCorruptIcon,
  RefreshIcon,
  Tick02Icon,
  Download01Icon,
  FileSearchIcon,
  Copy01Icon,
} from "@hugeicons/core-free-icons"

export default function AttachmentExample() {
  return (
    <ExampleWrapper>
      <AttachmentReference className="col-span-full" />
      <AttachmentFiles />
      <AttachmentContentOnly />
      <AttachmentStates />
      <AttachmentImages />
      <AttachmentImageStates />
      <AttachmentSizes />
      <AttachmentScrollableGroup />
      <AttachmentTriggers />
    </ExampleWrapper>
  )
}

function AttachmentReference({ className }: { className?: string }) {
  return (
    <Example
      title="Style Reference"
      className="gap-4"
      containerClassName={className}
    >
      <AttachmentGroup className="w-full items-center">
        <Attachment size="sm" className="w-56">
          <AttachmentMedia>
            <HugeiconsIcon icon={FileIcon} strokeWidth={2} />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>briefing-notes.pdf</AttachmentTitle>
            <AttachmentDescription>PDF · 1.4 MB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <Tooltip>
              <TooltipTrigger
                render={
                  <AttachmentAction aria-label="Remove briefing-notes.pdf" />
                }
              >
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>Remove</TooltipContent>
            </Tooltip>
          </AttachmentActions>
        </Attachment>
        <Attachment size="sm" className="w-56">
          <AttachmentMedia>
            <HugeiconsIcon icon={TableIcon} strokeWidth={2} />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>customer-import.csv</AttachmentTitle>
            <AttachmentDescription>CSV · 18 KB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <Tooltip>
              <TooltipTrigger
                render={
                  <AttachmentAction aria-label="Remove customer-import.csv" />
                }
              >
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>Remove</TooltipContent>
            </Tooltip>
          </AttachmentActions>
        </Attachment>
        <Attachment size="sm" className="w-56">
          <AttachmentMedia>
            <HugeiconsIcon icon={File01Icon} strokeWidth={2} />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>source-assets.zip</AttachmentTitle>
            <AttachmentDescription>ZIP · 4.2 MB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <Tooltip>
              <TooltipTrigger
                render={
                  <AttachmentAction aria-label="Remove source-assets.zip" />
                }
              >
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>Remove</TooltipContent>
            </Tooltip>
          </AttachmentActions>
        </Attachment>
        <Attachment size="sm" className="w-56">
          <AttachmentMedia>
            <HugeiconsIcon icon={Presentation01Icon} strokeWidth={2} />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>quarterly-review.key</AttachmentTitle>
            <AttachmentDescription>Keynote · 9 MB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <Tooltip>
              <TooltipTrigger
                render={
                  <AttachmentAction aria-label="Remove quarterly-review.key" />
                }
              >
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>Remove</TooltipContent>
            </Tooltip>
          </AttachmentActions>
        </Attachment>
        <Attachment size="xs" orientation="vertical">
          <AttachmentMedia variant="image">
            <img src="/brand/aiellie.haze.png" alt="Aiellie haze" />
          </AttachmentMedia>
          <AttachmentActions>
            <Tooltip>
              <TooltipTrigger
                render={
                  <AttachmentAction aria-label="Remove aiellie.haze.png" />
                }
              >
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>Remove</TooltipContent>
            </Tooltip>
          </AttachmentActions>
          <AttachmentTrigger
            render={
              <a
                href="/brand/aiellie.haze.png"
                target="_blank"
                rel="noreferrer"
                aria-label="Open aiellie.haze.png"
              />
            }
          />
        </Attachment>

        <Attachment size="xs" orientation="vertical">
          <AttachmentMedia variant="image">
            <img src="/brand/aiellie.grain.png" alt="Aiellie grain" />
          </AttachmentMedia>
          <AttachmentActions>
            <Tooltip>
              <TooltipTrigger
                render={
                  <AttachmentAction aria-label="Remove aiellie.grain.png" />
                }
              >
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>Remove</TooltipContent>
            </Tooltip>
          </AttachmentActions>
          <AttachmentTrigger
            render={
              <a
                href="/brand/aiellie.grain.png"
                target="_blank"
                rel="noreferrer"
                aria-label="Open aiellie.grain.png"
              />
            }
          />
        </Attachment>

        <Attachment size="xs" orientation="vertical">
          <AttachmentMedia variant="image">
            <img src="/brand/aiellie.clouds.png" alt="Aiellie clouds" />
          </AttachmentMedia>
          <AttachmentActions>
            <Tooltip>
              <TooltipTrigger
                render={
                  <AttachmentAction aria-label="Remove aiellie.clouds.png" />
                }
              >
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>Remove</TooltipContent>
            </Tooltip>
          </AttachmentActions>
          <AttachmentTrigger
            render={
              <a
                href="/brand/aiellie.clouds.png"
                target="_blank"
                rel="noreferrer"
                aria-label="Open aiellie.clouds.png"
              />
            }
          />
        </Attachment>

        <Attachment size="xs" orientation="vertical">
          <AttachmentMedia variant="image">
            <img src="/avatars/ellie.png" alt="Ellie" />
          </AttachmentMedia>
          <AttachmentActions>
            <Tooltip>
              <TooltipTrigger
                render={<AttachmentAction aria-label="Remove ellie.png" />}
              >
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>Remove</TooltipContent>
            </Tooltip>
          </AttachmentActions>
          <AttachmentTrigger
            render={
              <a
                href="/avatars/ellie.png"
                target="_blank"
                rel="noreferrer"
                aria-label="Open ellie.png"
              />
            }
          />
        </Attachment>
      </AttachmentGroup>
    </Example>
  )
}

function AttachmentFiles({ className }: { className?: string }) {
  return (
    <Example title="Files" className="gap-8" containerClassName={className}>
      <div className="flex w-full flex-col gap-2">
        <div className="px-1 text-xs font-medium text-muted-foreground">
          Horizontal
        </div>
        <div className="flex flex-col gap-3">
          <Attachment className="w-full">
            <AttachmentMedia>
              <HugeiconsIcon icon={FileIcon} strokeWidth={2} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>sales-dashboard.pdf</AttachmentTitle>
              <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove sales-dashboard.pdf" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
          </Attachment>
          <Attachment className="w-full">
            <AttachmentMedia>
              <HugeiconsIcon icon={TableIcon} strokeWidth={2} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>customer-import.csv</AttachmentTitle>
              <AttachmentDescription>CSV · 18 KB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove customer-import.csv" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
          </Attachment>
          <Attachment className="w-full">
            <AttachmentMedia>
              <HugeiconsIcon icon={File01Icon} strokeWidth={2} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>message-renderer.tsx</AttachmentTitle>
              <AttachmentDescription>TypeScript · 12 KB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove message-renderer.tsx" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
          </Attachment>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2">
        <div className="px-1 text-xs font-medium text-muted-foreground">
          Vertical
        </div>
        <AttachmentGroup className="w-full">
          <Attachment orientation="vertical">
            <AttachmentMedia>
              <HugeiconsIcon icon={FileIcon} strokeWidth={2} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>sales-dashboard.pdf</AttachmentTitle>
              <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove sales-dashboard.pdf" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
          </Attachment>
          <Attachment orientation="vertical">
            <AttachmentMedia>
              <HugeiconsIcon icon={TableIcon} strokeWidth={2} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>customer-import.csv</AttachmentTitle>
              <AttachmentDescription>CSV · 18 KB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove customer-import.csv" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
          </Attachment>
          <Attachment orientation="vertical">
            <AttachmentMedia>
              <HugeiconsIcon icon={File01Icon} strokeWidth={2} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>message-renderer.tsx</AttachmentTitle>
              <AttachmentDescription>TypeScript · 12 KB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove message-renderer.tsx" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
          </Attachment>
          <Attachment orientation="vertical">
            <AttachmentMedia>
              <HugeiconsIcon icon={File01Icon} strokeWidth={2} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>source-assets.zip</AttachmentTitle>
              <AttachmentDescription>ZIP · 4.2 MB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove source-assets.zip" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
          </Attachment>
          <Attachment orientation="vertical">
            <AttachmentMedia>
              <HugeiconsIcon icon={Presentation01Icon} strokeWidth={2} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>quarterly-review.key</AttachmentTitle>
              <AttachmentDescription>Keynote · 9 MB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove quarterly-review.key" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
          </Attachment>
        </AttachmentGroup>
      </div>
    </Example>
  )
}

function AttachmentContentOnly({ className }: { className?: string }) {
  return (
    <Example
      title="Content Only"
      className="gap-8"
      containerClassName={className}
    >
      <div className="flex w-full flex-col gap-2">
        <div className="px-1 text-xs font-medium text-muted-foreground">
          Title
        </div>
        <div className="flex flex-col gap-3">
          <Attachment className="w-full">
            <AttachmentContent>
              <AttachmentTitle>React Documentation</AttachmentTitle>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove React Documentation" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
          </Attachment>
          <Attachment className="w-full">
            <AttachmentContent>
              <AttachmentTitle>Tailwind CSS</AttachmentTitle>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={<AttachmentAction aria-label="Remove Tailwind CSS" />}
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
          </Attachment>
          <Attachment size="sm" className="w-48">
            <AttachmentContent>
              <AttachmentTitle>shadcn/ui</AttachmentTitle>
            </AttachmentContent>
            <AttachmentTrigger
              render={
                <a
                  href="https://ui.shadcn.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open shadcn/ui"
                />
              }
            />
          </Attachment>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2">
        <div className="px-1 text-xs font-medium text-muted-foreground">
          Title and Description
        </div>
        <div className="flex flex-col gap-3">
          <Attachment className="w-full">
            <AttachmentContent>
              <AttachmentTitle>Building accessible components</AttachmentTitle>
              <AttachmentDescription>
                react.dev · 8 min read
              </AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove Building accessible components" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
          </Attachment>
          <Attachment className="w-full">
            <AttachmentContent>
              <AttachmentTitle>Utility-first CSS framework</AttachmentTitle>
              <AttachmentDescription>tailwindcss.com</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove Utility-first CSS framework" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
          </Attachment>
          <Attachment size="sm" className="w-full max-w-80">
            <AttachmentContent>
              <AttachmentTitle>Compound components in React</AttachmentTitle>
              <AttachmentDescription>ui.shadcn.com/docs</AttachmentDescription>
            </AttachmentContent>
            <AttachmentTrigger
              render={
                <a
                  href="https://ui.shadcn.com/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open Compound components in React"
                />
              }
            />
          </Attachment>
        </div>
      </div>
    </Example>
  )
}

function AttachmentStates({ className }: { className?: string }) {
  return (
    <Example title="States" className="gap-8" containerClassName={className}>
      <div className="flex w-full flex-col gap-3">
        <div className="px-1 text-xs font-medium text-muted-foreground">
          Horizontal
        </div>
        <div className="flex flex-col gap-2">
          <Attachment state="idle" className="w-full">
            <AttachmentMedia>
              <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>selected-file.pdf</AttachmentTitle>
              <AttachmentDescription>Ready to upload</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove selected-file.pdf" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
          </Attachment>
          <Attachment state="uploading" className="w-full">
            <AttachmentMedia>
              <Spinner />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>design-system.zip</AttachmentTitle>
              <AttachmentDescription>Uploading · 64%</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove design-system.zip" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
          </Attachment>
          <Attachment state="processing" className="w-full">
            <AttachmentMedia>
              <HugeiconsIcon icon={FileIcon} strokeWidth={2} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>market-research.pdf</AttachmentTitle>
              <AttachmentDescription>Processing document</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove market-research.pdf" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
          </Attachment>
          <Attachment state="error" className="w-full">
            <AttachmentMedia>
              <HugeiconsIcon icon={FileCorruptIcon} strokeWidth={2} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>financial-model.xlsx</AttachmentTitle>
              <AttachmentDescription>
                Upload failed. Try again.
              </AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={<AttachmentAction aria-label="Retry upload" />}
                >
                  <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Retry</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  render={<AttachmentAction aria-label="Remove attachment" />}
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
          </Attachment>
          <Attachment state="done" className="w-full">
            <AttachmentMedia>
              <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>uploaded-report.pdf</AttachmentTitle>
              <AttachmentDescription>Uploaded · 1.8 MB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove uploaded-report.pdf" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
          </Attachment>
        </div>
      </div>
      <div className="flex w-full flex-col gap-3">
        <div className="px-1 text-xs font-medium text-muted-foreground">
          Vertical
        </div>
        <AttachmentGroup className="w-full">
          <Attachment state="idle" orientation="vertical">
            <AttachmentMedia>
              <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>selected-file.pdf</AttachmentTitle>
              <AttachmentDescription>Ready</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove selected-file.pdf" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
          </Attachment>
          <Attachment state="uploading" orientation="vertical">
            <AttachmentMedia>
              <Spinner />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>design-system.zip</AttachmentTitle>
              <AttachmentDescription>Uploading</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove design-system.zip" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
          </Attachment>
          <Attachment state="processing" orientation="vertical">
            <AttachmentMedia>
              <HugeiconsIcon icon={FileIcon} strokeWidth={2} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>market-research.pdf</AttachmentTitle>
              <AttachmentDescription>Processing</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove market-research.pdf" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
          </Attachment>
          <Attachment state="error" orientation="vertical">
            <AttachmentMedia>
              <HugeiconsIcon icon={FileCorruptIcon} strokeWidth={2} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>financial-model.xlsx</AttachmentTitle>
              <AttachmentDescription>Failed</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Retry financial-model.xlsx" />
                  }
                >
                  <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Retry</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove financial-model.xlsx" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
          </Attachment>
          <Attachment state="done" orientation="vertical">
            <AttachmentMedia>
              <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>uploaded-report.pdf</AttachmentTitle>
              <AttachmentDescription>Done</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove uploaded-report.pdf" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
          </Attachment>
        </AttachmentGroup>
      </div>
    </Example>
  )
}

function AttachmentImages({ className }: { className?: string }) {
  return (
    <Example title="Images" className="gap-8" containerClassName={className}>
      <div className="flex w-full flex-col gap-3">
        <div className="px-1 text-xs font-medium text-muted-foreground">
          Horizontal
        </div>
        <div className="flex flex-col gap-2">
          <Attachment className="w-full">
            <AttachmentMedia variant="image">
              <img src="/brand/aiellie.haze.png" alt="Aiellie haze" />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>aiellie.haze.png</AttachmentTitle>
              <AttachmentDescription>PNG · 820 KB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove aiellie.haze.png" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
            <AttachmentTrigger
              render={
                <a
                  href="/brand/aiellie.haze.png"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open aiellie.haze.png"
                />
              }
            />
          </Attachment>
          <Attachment className="w-full">
            <AttachmentMedia variant="image">
              <img src="/brand/aiellie.grain.png" alt="Aiellie grain" />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>aiellie.grain.png</AttachmentTitle>
              <AttachmentDescription>PNG · 1.1 MB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove aiellie.grain.png" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
            <AttachmentTrigger
              render={
                <a
                  href="/brand/aiellie.grain.png"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open aiellie.grain.png"
                />
              }
            />
          </Attachment>
          <Attachment className="w-full">
            <AttachmentMedia variant="image">
              <img src="/brand/aiellie.clouds.png" alt="Aiellie clouds" />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>aiellie.clouds.png</AttachmentTitle>
              <AttachmentDescription>PNG · 940 KB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove aiellie.clouds.png" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
            <AttachmentTrigger
              render={
                <a
                  href="/brand/aiellie.clouds.png"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open aiellie.clouds.png"
                />
              }
            />
          </Attachment>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2">
        <div className="px-1 text-xs font-medium text-muted-foreground">
          Vertical
        </div>
        <AttachmentGroup className="w-full">
          <Attachment orientation="vertical">
            <AttachmentMedia variant="image">
              <img src="/brand/aiellie.haze.png" alt="Aiellie haze" />
            </AttachmentMedia>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove aiellie.haze.png" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
            <AttachmentTrigger
              render={
                <a
                  href="/brand/aiellie.haze.png"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open aiellie.haze.png"
                />
              }
            />
          </Attachment>
          <Attachment orientation="vertical">
            <AttachmentMedia variant="image">
              <img src="/brand/aiellie.grain.png" alt="Aiellie grain" />
            </AttachmentMedia>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove aiellie.grain.png" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
            <AttachmentTrigger
              render={
                <a
                  href="/brand/aiellie.grain.png"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open aiellie.grain.png"
                />
              }
            />
          </Attachment>
          <Attachment orientation="vertical">
            <AttachmentMedia variant="image">
              <img src="/brand/aiellie.clouds.png" alt="Aiellie clouds" />
            </AttachmentMedia>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove aiellie.clouds.png" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
            <AttachmentTrigger
              render={
                <a
                  href="/brand/aiellie.clouds.png"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open aiellie.clouds.png"
                />
              }
            />
          </Attachment>
          <Attachment orientation="vertical">
            <AttachmentMedia variant="image">
              <img src="/avatars/ellie.png" alt="Ellie" />
            </AttachmentMedia>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={<AttachmentAction aria-label="Remove ellie.png" />}
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
            <AttachmentTrigger
              render={
                <a
                  href="/avatars/ellie.png"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open ellie.png"
                />
              }
            />
          </Attachment>
          <Attachment orientation="vertical">
            <AttachmentMedia variant="image">
              <img src="/avatars/aiellie.png" alt="Aiellie" />
            </AttachmentMedia>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={<AttachmentAction aria-label="Remove aiellie.png" />}
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
            <AttachmentTrigger
              render={
                <a
                  href="/avatars/aiellie.png"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open aiellie.png"
                />
              }
            />
          </Attachment>
        </AttachmentGroup>
      </div>
    </Example>
  )
}

function AttachmentImageStates({ className }: { className?: string }) {
  return (
    <Example
      title="Image States"
      className="gap-8"
      containerClassName={className}
    >
      <div className="flex w-full flex-col gap-3">
        <div className="px-1 text-xs font-medium text-muted-foreground">
          Horizontal
        </div>
        <div className="flex flex-col gap-2">
          <Attachment state="idle" className="w-full">
            <AttachmentMedia variant="image">
              <img src="/brand/aiellie.clouds.png" alt="Aiellie clouds" />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>aiellie.clouds.png</AttachmentTitle>
              <AttachmentDescription>Ready to upload</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove aiellie.clouds.png" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
          </Attachment>
          <Attachment state="uploading" className="w-full">
            <AttachmentMedia variant="image">
              <img src="/brand/aiellie.haze.png" alt="Aiellie haze" />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>aiellie.haze.png</AttachmentTitle>
              <AttachmentDescription>Uploading · 72%</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove aiellie.haze.png" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
          </Attachment>
          <Attachment state="processing" className="w-full">
            <AttachmentMedia variant="image">
              <img src="/brand/aiellie.grain.png" alt="Aiellie grain" />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>aiellie.grain.png</AttachmentTitle>
              <AttachmentDescription>Processing image</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove aiellie.grain.png" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
          </Attachment>
          <Attachment state="error" className="w-full">
            <AttachmentMedia variant="image">
              <img src="/brand/aiellie.clouds.png" alt="Aiellie clouds" />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>aiellie.clouds.png</AttachmentTitle>
              <AttachmentDescription>Upload failed</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={<AttachmentAction aria-label="Retry image upload" />}
                >
                  <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Retry</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  render={<AttachmentAction aria-label="Remove attachment" />}
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
          </Attachment>
          <Attachment state="done" className="w-full">
            <AttachmentMedia variant="image">
              <img src="/brand/aiellie.haze.png" alt="Aiellie haze" />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>aiellie.haze.png</AttachmentTitle>
              <AttachmentDescription>Uploaded · 1.2 MB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove aiellie.haze.png" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
          </Attachment>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2">
        <div className="px-1 text-xs font-medium text-muted-foreground">
          Vertical
        </div>
        <AttachmentGroup className="w-full">
          <Attachment state="idle" orientation="vertical">
            <AttachmentMedia variant="image">
              <img src="/brand/aiellie.clouds.png" alt="Aiellie clouds" />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>aiellie.clouds.png</AttachmentTitle>
              <AttachmentDescription>Ready</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove aiellie.clouds.png" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
          </Attachment>
          <Attachment state="uploading" orientation="vertical">
            <AttachmentMedia variant="image">
              <img src="/brand/aiellie.haze.png" alt="Aiellie haze" />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>aiellie.haze.png</AttachmentTitle>
              <AttachmentDescription>Uploading</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove aiellie.haze.png" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
          </Attachment>
          <Attachment state="processing" orientation="vertical">
            <AttachmentMedia variant="image">
              <img src="/brand/aiellie.grain.png" alt="Aiellie grain" />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>aiellie.grain.png</AttachmentTitle>
              <AttachmentDescription>Processing</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove aiellie.grain.png" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
          </Attachment>
          <Attachment state="error" orientation="vertical">
            <AttachmentMedia variant="image">
              <img src="/brand/aiellie.clouds.png" alt="Aiellie clouds" />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>aiellie.clouds.png</AttachmentTitle>
              <AttachmentDescription>Failed</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Retry aiellie.clouds.png" />
                  }
                >
                  <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Retry</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove aiellie.clouds.png" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
          </Attachment>
          <Attachment state="done" orientation="vertical">
            <AttachmentMedia variant="image">
              <img src="/brand/aiellie.haze.png" alt="Aiellie haze" />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>aiellie.haze.png</AttachmentTitle>
              <AttachmentDescription>Done</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AttachmentAction aria-label="Remove aiellie.haze.png" />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Remove</TooltipContent>
              </Tooltip>
            </AttachmentActions>
          </Attachment>
        </AttachmentGroup>
      </div>
    </Example>
  )
}

function AttachmentSizes({ className }: { className?: string }) {
  return (
    <Example title="Sizes" className="gap-3" containerClassName={className}>
      <Attachment size="default" className="w-full">
        <AttachmentMedia>
          <HugeiconsIcon icon={FileIcon} strokeWidth={2} />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Default attachment</AttachmentTitle>
          <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment size="sm" className="w-full">
        <AttachmentMedia>
          <HugeiconsIcon icon={FileIcon} strokeWidth={2} />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Small attachment</AttachmentTitle>
          <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment size="xs" className="w-full">
        <AttachmentMedia>
          <HugeiconsIcon icon={FileIcon} strokeWidth={2} />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Extra small attachment</AttachmentTitle>
        </AttachmentContent>
      </Attachment>
      <div className="flex w-full items-start gap-3">
        <Attachment orientation="vertical">
          <AttachmentMedia variant="image">
            <img src="/brand/aiellie.haze.png" alt="Aiellie haze" />
          </AttachmentMedia>
          <AttachmentActions>
            <Tooltip>
              <TooltipTrigger
                render={
                  <AttachmentAction aria-label="Remove aiellie.haze.png" />
                }
              >
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>Remove</TooltipContent>
            </Tooltip>
          </AttachmentActions>
        </Attachment>
        <Attachment size="sm" orientation="vertical">
          <AttachmentMedia variant="image">
            <img src="/brand/aiellie.grain.png" alt="Aiellie grain" />
          </AttachmentMedia>
          <AttachmentActions>
            <Tooltip>
              <TooltipTrigger
                render={
                  <AttachmentAction aria-label="Remove aiellie.grain.png" />
                }
              >
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>Remove</TooltipContent>
            </Tooltip>
          </AttachmentActions>
        </Attachment>
        <Attachment size="xs" orientation="vertical">
          <AttachmentMedia variant="image">
            <img src="/brand/aiellie.clouds.png" alt="Aiellie clouds" />
          </AttachmentMedia>
          <AttachmentActions>
            <Tooltip>
              <TooltipTrigger
                render={
                  <AttachmentAction aria-label="Remove aiellie.clouds.png" />
                }
              >
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>Remove</TooltipContent>
            </Tooltip>
          </AttachmentActions>
        </Attachment>
      </div>
    </Example>
  )
}

function AttachmentScrollableGroup({ className }: { className?: string }) {
  return (
    <Example
      title="Scrollable Group"
      className="gap-4"
      containerClassName={className}
    >
      <AttachmentGroup className="w-full">
        <Attachment className="w-64">
          <AttachmentMedia>
            <HugeiconsIcon icon={FileIcon} strokeWidth={2} />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>briefing-notes.pdf</AttachmentTitle>
            <AttachmentDescription>PDF · 1.4 MB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <Tooltip>
              <TooltipTrigger
                render={
                  <AttachmentAction aria-label="Remove briefing-notes.pdf" />
                }
              >
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>Remove</TooltipContent>
            </Tooltip>
          </AttachmentActions>
        </Attachment>
        <Attachment className="w-64">
          <AttachmentMedia variant="image">
            <img src="/avatars/aiellieui.avatar.png" alt="Aiellie UI avatar" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>aiellieui.avatar.png</AttachmentTitle>
            <AttachmentDescription>PNG · 820 KB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <Tooltip>
              <TooltipTrigger
                render={
                  <AttachmentAction aria-label="Remove aiellieui.avatar.png" />
                }
              >
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>Remove</TooltipContent>
            </Tooltip>
          </AttachmentActions>
        </Attachment>
        <Attachment className="w-64">
          <AttachmentMedia>
            <HugeiconsIcon icon={TableIcon} strokeWidth={2} />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>customers.csv</AttachmentTitle>
            <AttachmentDescription>CSV · 18 KB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <Tooltip>
              <TooltipTrigger
                render={<AttachmentAction aria-label="Remove customers.csv" />}
              >
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>Remove</TooltipContent>
            </Tooltip>
          </AttachmentActions>
        </Attachment>
        <Attachment className="w-64">
          <AttachmentMedia>
            <HugeiconsIcon icon={File01Icon} strokeWidth={2} />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>renderer.tsx</AttachmentTitle>
            <AttachmentDescription>TSX · 12 KB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <Tooltip>
              <TooltipTrigger
                render={<AttachmentAction aria-label="Remove renderer.tsx" />}
              >
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>Remove</TooltipContent>
            </Tooltip>
          </AttachmentActions>
        </Attachment>
      </AttachmentGroup>
      <AttachmentGroup className="w-full">
        <Attachment orientation="vertical">
          <AttachmentMedia>
            <HugeiconsIcon icon={FileIcon} strokeWidth={2} />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>invoice.pdf</AttachmentTitle>
            <AttachmentDescription>PDF</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <Tooltip>
              <TooltipTrigger
                render={<AttachmentAction aria-label="Remove invoice.pdf" />}
              >
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>Remove</TooltipContent>
            </Tooltip>
          </AttachmentActions>
        </Attachment>
        <Attachment orientation="vertical">
          <AttachmentMedia variant="image" className="aspect-square w-full">
            <img src="/brand/aiellie.grain.png" alt="Aiellie grain" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>aiellie.grain.png</AttachmentTitle>
            <AttachmentDescription>PNG</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <Tooltip>
              <TooltipTrigger
                render={
                  <AttachmentAction aria-label="Remove aiellie.grain.png" />
                }
              >
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>Remove</TooltipContent>
            </Tooltip>
          </AttachmentActions>
        </Attachment>
        <Attachment orientation="vertical">
          <AttachmentMedia>
            <HugeiconsIcon icon={File01Icon} strokeWidth={2} />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>assets.zip</AttachmentTitle>
            <AttachmentDescription>ZIP</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <Tooltip>
              <TooltipTrigger
                render={<AttachmentAction aria-label="Remove assets.zip" />}
              >
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>Remove</TooltipContent>
            </Tooltip>
          </AttachmentActions>
        </Attachment>
        <Attachment orientation="vertical">
          <AttachmentMedia variant="image" className="aspect-square w-full">
            <img src="/brand/aiellie.clouds.png" alt="Aiellie clouds" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>aiellie.clouds.png</AttachmentTitle>
            <AttachmentDescription>PNG</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <Tooltip>
              <TooltipTrigger
                render={
                  <AttachmentAction aria-label="Remove aiellie.clouds.png" />
                }
              >
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>Remove</TooltipContent>
            </Tooltip>
          </AttachmentActions>
        </Attachment>
        <Attachment orientation="vertical">
          <AttachmentMedia>
            <HugeiconsIcon icon={FileIcon} strokeWidth={2} />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>notes.pdf</AttachmentTitle>
            <AttachmentDescription>PDF</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <Tooltip>
              <TooltipTrigger
                render={<AttachmentAction aria-label="Remove notes.pdf" />}
              >
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>Remove</TooltipContent>
            </Tooltip>
          </AttachmentActions>
        </Attachment>
      </AttachmentGroup>
    </Example>
  )
}

function AttachmentTriggers({ className }: { className?: string }) {
  const [isVisible, setIsVisible] = React.useState(true)

  return (
    <Example title="Triggers" className="gap-3" containerClassName={className}>
      {isVisible ? (
        <Attachment className="w-full">
          <AttachmentMedia>
            <HugeiconsIcon icon={FileIcon} strokeWidth={2} />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>contract-review.pdf</AttachmentTitle>
            <AttachmentDescription>PDF · 820 KB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <Tooltip>
              <TooltipTrigger
                render={<AttachmentAction aria-label="Download attachment" />}
              >
                <HugeiconsIcon icon={Download01Icon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>Download</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <AttachmentAction
                    aria-label="Remove attachment"
                    onClick={() => setIsVisible(false)}
                  />
                }
              >
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>Remove</TooltipContent>
            </Tooltip>
          </AttachmentActions>
          <AttachmentTrigger
            render={
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                aria-label="Open contract-review.pdf"
              />
            }
          />
        </Attachment>
      ) : (
        <Button variant="outline" onClick={() => setIsVisible(true)}>
          Restore attachment
        </Button>
      )}
      <Dialog>
        <Attachment className="w-full">
          <AttachmentMedia>
            <HugeiconsIcon icon={FileSearchIcon} strokeWidth={2} />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>research-summary.pdf</AttachmentTitle>
            <AttachmentDescription>Open preview dialog</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <Tooltip>
              <TooltipTrigger
                render={<AttachmentAction aria-label="Copy link" />}
              >
                <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>Copy link</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <AttachmentAction aria-label="Remove research-summary.pdf" />
                }
              >
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              </TooltipTrigger>
              <TooltipContent>Remove</TooltipContent>
            </Tooltip>
          </AttachmentActions>
          <DialogTrigger
            render={
              <AttachmentTrigger aria-label="Preview research-summary.pdf" />
            }
          />
        </Attachment>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>research-summary.pdf</DialogTitle>
            <DialogDescription>
              Attachment triggers can open dialogs while actions remain
              independently reachable.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Example>
  )
}
