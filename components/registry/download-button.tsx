"use client"

import { Download01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function DownloadButton({
  content,
  name,
}: {
  content?: string
  name?: string
}) {
  if (!content) {
    return null
  }

  const fileName = name?.split("/").pop() || "file.txt"

  const downloadFile = () => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.add({ title: `Downloaded ${fileName}`, type: "success" })
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={<Button variant="ghost" size="icon-sm" />}
          onClick={downloadFile}
        >
          <HugeiconsIcon icon={Download01Icon} strokeWidth={2} />
          <span className="sr-only">Download file</span>
        </TooltipTrigger>
        <TooltipContent>Download file</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
