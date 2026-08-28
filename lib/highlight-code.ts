import { createHash } from "node:crypto"

import { codeToHtml } from "shiki"

// Cross-request cache — highlighting is CPU-intensive and deterministic.
const highlightCache = new Map<string, string>()

export async function highlightCode(
  code: string,
  language: string = "tsx",
  // Replaced previews are client-supplied and effectively unbounded in
  // variety, so they skip the cache rather than growing it without limit.
  { cache = true }: { cache?: boolean } = {}
) {
  const cacheKey = createHash("sha256")
    .update(`${language}:${code}`)
    .digest("hex")

  const cached = cache ? highlightCache.get(cacheKey) : undefined
  if (cached) {
    return cached
  }

  const html = await codeToHtml(code, {
    lang: language,
    themes: {
      dark: "github-dark",
      light: "github-light",
    },
    // Emit both themes as `--shiki-light` / `--shiki-dark` instead of baking the
    // light theme into an inline `color`, which no stylesheet can override. The
    // base layer picks the pair, so code follows the theme.
    defaultColor: false,
    transformers: [
      {
        pre(node) {
          // Keep `shiki` — the dual-theme swap in globals.css keys off it.
          node.properties["class"] =
            "shiki no-scrollbar min-w-0 overflow-x-auto overflow-y-auto overscroll-x-contain px-4 py-3.5 outline-none !bg-transparent"
        },
        line(node) {
          node.properties["data-line"] = ""
        },
      },
    ],
  })

  if (cache) {
    highlightCache.set(cacheKey, html)
  }

  return html
}
