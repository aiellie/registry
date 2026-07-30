import { NextResponse } from "next/server"

import {
  createFileTreeForRegistryItemFiles,
  getHighlightedFiles,
  getRegistryItemWithFiles,
} from "@/lib/registry-server"

/**
 * Backend for the home grid's item details dialog: everything `BlockViewer`
 * needs (file contents, tree, Shiki-highlighted code), fetched only when a
 * card is opened rather than server-rendered 89 times into the landing page.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params

  const item = await getRegistryItemWithFiles(name)
  if (!item) {
    return NextResponse.json(
      { error: `Unknown item "${name}"` },
      { status: 404 }
    )
  }

  const [tree, highlightedFiles] = await Promise.all([
    createFileTreeForRegistryItemFiles(item.fileContents),
    getHighlightedFiles(item.fileContents),
  ])

  return NextResponse.json({
    item,
    tree,
    highlightedFiles,
    baseUrl: process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "ui.aiellie.dev",
  })
}
