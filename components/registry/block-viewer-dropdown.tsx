"use client"

import {
  FullScreenIcon,
  MoreHorizontalIcon,
  RefreshIcon,
  TerminalIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"

function buildV0Url(registryUrl: string, title?: string, prompt?: string) {
  const params = new URLSearchParams()
  params.append("url", registryUrl)

  if (title != null) {
    params.append("title", title)
  }

  if (prompt != null) {
    params.append("prompt", prompt)
  }

  return `https://v0.dev/chat/api/open?${params.toString()}`
}

export function BlockViewerDropdown({
  name,
  registryUrl,
  v0RegistryUrl,
  title,
  prompt,
  onRefresh,
}: {
  name: string
  registryUrl: string
  v0RegistryUrl: string
  title?: string
  prompt?: string
  onRefresh: () => void
}) {
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  const openInV0 = () => {
    const url = buildV0Url(v0RegistryUrl, title, prompt)
    if (process.env.NODE_ENV === "development") {
      toast.warning("You're on localhost", {
        description:
          "Open in v0 does not work in development mode, please deploy first.",
      })
    } else {
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button size="icon" variant="outline" aria-label="More options" />
        }
      >
        <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          render={<Link href={`/demo/${name}`} target="_blank" />}
        >
          <HugeiconsIcon icon={FullScreenIcon} strokeWidth={2} />
          Open in New Tab
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onRefresh}>
          <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} />
          Refresh Preview
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          closeOnClick={false}
          onClick={() => {
            copyToClipboard(`npx shadcn@latest add ${registryUrl}`)
            toast.success("Copied npx command to clipboard")
          }}
        >
          <HugeiconsIcon
            icon={isCopied ? Tick02Icon : TerminalIcon}
            strokeWidth={2}
          />
          Copy npx install
        </DropdownMenuItem>
        <DropdownMenuItem onClick={openInV0}>
          <svg
            viewBox="0 0 40 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="size-4 text-current"
            role="graphics-symbol"
          >
            <path
              d="M23.3919 0H32.9188C36.7819 0 39.9136 3.13165 39.9136 6.99475V16.0805H36.0006V6.99475C36.0006 6.90167 35.9969 6.80925 35.9898 6.71766L26.4628 16.079C26.4949 16.08 26.5272 16.0805 26.5595 16.0805H36.0006V19.7762H26.5595C22.6964 19.7762 19.4788 16.6139 19.4788 12.7508V3.68923H23.3919V12.7508C23.3919 12.9253 23.4054 13.0977 23.4316 13.2668L33.1682 3.6995C33.0861 3.6927 33.003 3.68923 32.9188 3.68923H23.3919V0Z"
              fill="currentColor"
            />
            <path
              d="M13.7688 19.0956L0 3.68759H5.53933L13.6231 12.7337V3.68759H17.7535V17.5746C17.7535 19.6705 15.1654 20.6584 13.7688 19.0956Z"
              fill="currentColor"
            />
          </svg>
          Open in v0
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
