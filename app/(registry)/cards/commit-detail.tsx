"use client"

import * as React from "react"

import {
  Commit,
  CommitActions,
  CommitAuthor,
  CommitAuthorAvatar,
  CommitContent,
  CommitCopyButton,
  CommitFile,
  CommitFileAdditions,
  CommitFileChanges,
  CommitFileDeletions,
  CommitFileIcon,
  CommitFileInfo,
  CommitFilePath,
  CommitFiles,
  CommitFileStatus,
  CommitHash,
  CommitHeader,
  CommitInfo,
  CommitMessage,
  CommitMetadata,
  CommitSeparator,
  CommitTimestamp,
} from "@/components/code/commit"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "@/components/ui/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/** Fixed instant, so the card renders identically on server and client. */
const COMMITTED_AT = new Date("2026-08-01T09:12:00.000Z")

const FILES = [
  {
    additions: 128,
    deletions: 0,
    path: "cards/agent-roster.tsx",
    status: "added",
  },
  { additions: 62, deletions: 2, path: "registry.json", status: "modified" },
  { additions: 8, deletions: 3, path: "app/globals.css", status: "modified" },
  {
    additions: 0,
    deletions: 88,
    path: "cards/legacy-stats.tsx",
    status: "deleted",
  },
] satisfies {
  additions: number
  deletions: number
  path: string
  status: "added" | "modified" | "deleted" | "renamed"
}[]

export function CommitDetail() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Commit</CardTitle>
        <CardDescription className="truncate">
          feat/registry-cards · 4 files
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Commit defaultOpen>
          <CommitHeader>
            <CommitAuthor>
              <CommitAuthorAvatar alt="sofia-davis avatar" initials="SD" />
              <CommitInfo>
                <CommitMessage>Add showcase cards for code items</CommitMessage>
                <CommitMetadata>
                  <CommitHash>a3f19c2</CommitHash>
                  <CommitSeparator />
                  <CommitTimestamp date={COMMITTED_AT} />
                </CommitMetadata>
              </CommitInfo>
            </CommitAuthor>
            <CommitActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <CommitCopyButton
                      hash="a3f19c2"
                      onCopy={() =>
                        toast.add({
                          title: "Commit hash copied",
                          type: "success",
                        })
                      }
                      onError={() =>
                        toast.add({
                          title: "Couldn't reach the clipboard",
                          type: "error",
                        })
                      }
                    />
                  }
                />
                <TooltipContent>Copy commit hash</TooltipContent>
              </Tooltip>
            </CommitActions>
          </CommitHeader>
          <CommitContent>
            <CommitFiles>
              {FILES.map((file) => (
                <CommitFile key={file.path}>
                  <CommitFileInfo>
                    <CommitFileStatus status={file.status} />
                    <CommitFileIcon path={file.path} />
                    <CommitFilePath>{file.path}</CommitFilePath>
                  </CommitFileInfo>
                  <CommitFileChanges>
                    <CommitFileAdditions count={file.additions} />
                    <CommitFileDeletions count={file.deletions} />
                  </CommitFileChanges>
                </CommitFile>
              ))}
            </CommitFiles>
          </CommitContent>
        </Commit>
      </CardContent>
    </Card>
  )
}
