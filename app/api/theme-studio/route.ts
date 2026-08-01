import { NextResponse } from "next/server"

import { highlightCode } from "@/lib/highlight-code"
import { buildUpdatedGlobalsCss } from "@/lib/theme-studio.server"

/**
 * Backend for the theme studio's copy dialog: folds the live overrides back
 * into `app/globals.css` and hands back the whole file, highlighted.
 *
 * The rewrite happens here rather than in the panel so the source never has to
 * be shipped to the client — the studio only holds the token values it changed.
 */
export async function POST(request: Request) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "Expected JSON" }, { status: 400 })
  }

  const state = (payload ?? {}) as Record<string, Record<string, string>>
  const code = await buildUpdatedGlobalsCss({
    root: state.root ?? {},
    light: state.light ?? {},
    dark: state.dark ?? {},
    // Non-CSS settings never reach the stylesheet.
    prefs: {},
  })

  return NextResponse.json({
    code,
    highlighted: await highlightCode(code, "css"),
  })
}
