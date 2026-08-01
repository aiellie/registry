import { NextResponse } from "next/server"

import { getRegistryItemFile } from "@/lib/registry-server"

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
