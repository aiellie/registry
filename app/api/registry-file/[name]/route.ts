import { NextResponse } from "next/server"

import { highlightCode } from "@/lib/highlight-code"
import {
  getRegistryItemFile,
  getRegistryItemWithFiles,
} from "@/lib/registry-server"

/**
 * One file from one registry item, Shiki-highlighted. `BlockViewer` ships with
 * only its entry file and pulls the rest through here as you select them —
 * inlining all of them made `registry/blank` too large to prerender.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params
  const target = new URL(request.url).searchParams.get("target")

  if (!target) {
    return NextResponse.json({ error: "Missing `target`" }, { status: 400 })
  }

  const file = await getRegistryItemFile(name, target)

  if (!file) {
    return NextResponse.json(
      { error: `"${name}" ships no file targeting "${target}"` },
      { status: 404 }
    )
  }

  return NextResponse.json(file)
}

/** Replaced previews can get long, but no registry file is anywhere near this. */
const MAX_PREVIEW_BYTES = 1_000_000

/**
 * Re-highlights a file the viewer has rewritten locally, so a "Replace all"
 * preview keeps its syntax colours. Shiki needs `node:crypto`, so this can't
 * run in the browser. Nothing is written to disk — the body is highlighted and
 * handed straight back, and `target` must still name a file this item ships so
 * the response can't be passed off as some other item's source.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params
  const body = (await request.json()) as { target?: string; content?: string }
  const { target, content } = body

  if (!target || typeof content !== "string") {
    return NextResponse.json(
      { error: "Expected `target` and `content`" },
      { status: 400 }
    )
  }

  if (content.length > MAX_PREVIEW_BYTES) {
    return NextResponse.json({ error: "Content too large" }, { status: 413 })
  }

  const item = await getRegistryItemWithFiles(name)
  const original = item?.fileContents.find((file) => file.target === target)

  if (!original) {
    return NextResponse.json(
      { error: `"${name}" ships no file targeting "${target}"` },
      { status: 404 }
    )
  }

  return NextResponse.json({
    ...original,
    content,
    highlightedContent: await highlightCode(
      content,
      original.path.split(".").pop() ?? "tsx",
      { cache: false }
    ),
  })
}
