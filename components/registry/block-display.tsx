import { cache } from "react"

import { BlockViewer } from "@/components/registry/block-viewer"
import {
  createFileTreeForRegistryItemFiles,
  getHighlightedFiles,
  getRegistryItemWithFiles,
} from "@/lib/registry-server"
import { getPrompt } from "@/lib/utils"

const getCachedRegistryItem = cache(getRegistryItemWithFiles)

export async function BlockDisplay({ name }: { name: string }) {
  const item = await getCachedRegistryItem(name)

  if (!item) {
    return null
  }

  const [tree, highlightedFiles] = await Promise.all([
    createFileTreeForRegistryItemFiles(item.fileContents),
    getHighlightedFiles(item.fileContents),
  ])

  return (
    <BlockViewer
      item={item}
      tree={tree}
      highlightedFiles={highlightedFiles}
      baseUrl={process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "ui.aiellie.dev"}
      prompt={getPrompt()}
      iframeHeight={item.type === "registry:block" ? "930px" : "800px"}
    />
  )
}
