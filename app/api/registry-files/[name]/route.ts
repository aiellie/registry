import { NextResponse } from "next/server"

import { getRegistryItemWithFiles } from "@/lib/registry-server"

/**
 * Every file an item ships, raw and unhighlighted. `BlockViewer` pulls this
 * once when you first search file contents, then matches in the browser —
 * keeping a user-supplied regex off the server, where catastrophic
 * backtracking would pin a core. The whole source tree is ~1.5 MB, and any
 * single item is a fraction of that.
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

  return NextResponse.json({
    files: item.fileContents.map(({ target, path, content }) => ({
      target,
      path,
      content,
    })),
  })
}
