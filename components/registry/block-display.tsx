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

  const { fileContents, ...meta } = item
  const tree = createFileTreeForRegistryItemFiles(fileContents)

  // Only the entry file rides along in the page — the viewer pulls the rest
  // from /api/registry-file as they're selected. Inlining all of them put
  // `blank` (166 files) past Vercel's 19 MB prerender ceiling.
  const [initialFile] = await getHighlightedFiles(fileContents.slice(0, 1))

  return (
    <BlockViewer
      item={meta}
      tree={tree}
      initialFile={initialFile ?? null}
      baseUrl={process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "registry.aiellie.dev"}
      prompt={getPrompt()}
      // The page gives the viewer a fixed viewport-height box on `lg`, so it
      // fills that rather than asking for a height of its own and overflowing.
      iframeHeight="100%"
    />
  )
}
