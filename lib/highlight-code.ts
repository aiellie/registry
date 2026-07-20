import { createHash } from "node:crypto"

import { codeToHtml } from "shiki"

// Cross-request cache — highlighting is CPU-intensive and deterministic.
const highlightCache = new Map<string, string>()

export async function highlightCode(code: string, language: string = "tsx") {
  const cacheKey = createHash("sha256")
    .update(`${language}:${code}`)
    .digest("hex")

  const cached = highlightCache.get(cacheKey)
  if (cached) {
    return cached
  }

  const html = await codeToHtml(code, {
    lang: language,
    themes: {
      dark: "github-dark",
      light: "github-light",
    },
    transformers: [
      {
        pre(node) {
          node.properties["class"] =
            "no-scrollbar min-w-0 overflow-x-auto overflow-y-auto overscroll-x-contain px-4 py-3.5 outline-none !bg-transparent"
        },
        line(node) {
          node.properties["data-line"] = ""
        },
      },
    ],
  })

  highlightCache.set(cacheKey, html)

  return html
}
