"use client"

import * as React from "react"

import {
  StackTrace,
  StackTraceActions,
  StackTraceContent,
  StackTraceCopyButton,
  StackTraceError,
  StackTraceErrorMessage,
  StackTraceErrorType,
  StackTraceExpandButton,
  StackTraceFrames,
  StackTraceHeader,
} from "@/components/code/stack-trace"
import {
  Status,
  StatusIndicator,
  StatusLabel,
} from "@/components/aiellie/ui/status"
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
import { toast } from "@/components/ui/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const TRACE = `TypeError: Cannot read properties of undefined (reading 'map')
    at RegistryCards (app/(registry)/cards/index.tsx:118:24)
    at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:15486:18)
    at beginWork (node_modules/react-dom/cjs/react-dom.development.js:21626:16)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)`

export function StackTraceCard() {
  const [resolved, setResolved] = React.useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Runtime Error</CardTitle>
        <CardDescription className="truncate font-mono text-xs">
          production · iad1
        </CardDescription>
        <CardAction>
          <Status variant={resolved ? "success" : "error"}>
            <StatusIndicator />
            <StatusLabel>{resolved ? "Resolved" : "Open"}</StatusLabel>
          </Status>
        </CardAction>
      </CardHeader>

      <CardContent>
        <StackTrace
          defaultOpen
          trace={TRACE}
          onFilePathClick={(filePath, line, column) =>
            toast.add({
              title: `Open ${filePath}:${line ?? 0}:${column ?? 0}`,
              type: "success",
            })
          }
        >
          <StackTraceHeader>
            <StackTraceError>
              <StackTraceErrorType />
              <StackTraceErrorMessage />
            </StackTraceError>
            <StackTraceActions>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <StackTraceCopyButton
                      onCopy={() =>
                        toast.add({
                          title: "Stack trace copied",
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
                <TooltipContent>Copy stack trace</TooltipContent>
              </Tooltip>
            </StackTraceActions>
            <StackTraceExpandButton />
          </StackTraceHeader>
          <StackTraceContent>
            <StackTraceFrames />
          </StackTraceContent>
        </StackTrace>
      </CardContent>

      <CardFooter className="gap-2">
        <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground tabular-nums">
          {resolved ? "Marked resolved" : "12 occurrences · 4 users"}
        </span>
        <Button
          variant={resolved ? "ghost" : "outline"}
          size="sm"
          className="shrink-0"
          onClick={() => setResolved((value) => !value)}
        >
          {resolved ? "Reopen" : "Resolve"}
        </Button>
      </CardFooter>
    </Card>
  )
}
