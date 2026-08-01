import { NextResponse } from "next/server"

import {
  createFileTreeForRegistryItemFiles,
  getHighlightedFiles,
  getRegistryItemWithFiles,
} from "@/lib/registry-server"

/**
 * Backend for the home grid's item details dialog: what `BlockViewer` needs to
 * open (tree + entry file), fetched only when a card is opened rather than
 * server-rendered 89 times into the landing page. The remaining files come
 * from /api/registry-file one at a time as they're selected.
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

  const { fileContents, ...meta } = item
  const [initialFile] = await getHighlightedFiles(fileContents.slice(0, 1))

  return NextResponse.json({
    item: meta,
    tree: createFileTreeForRegistryItemFiles(fileContents),
    initialFile: initialFile ?? null,
    baseUrl: process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "ui.aiellie.dev",
  })
}
