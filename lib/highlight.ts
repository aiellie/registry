import { createHighlighterCore, type HighlighterCore } from "shiki/core"
import { createOnigurumaEngine } from "shiki/engine/oniguruma"

/**
 * Shared Shiki highlighter, safe on the server and in the browser (the
 * Oniguruma WASM engine has no Node dependencies). A single instance is reused
 * across requests, `generateStaticParams` builds, and client renders so the
 * grammar/theme load cost is paid once.
 */
let highlighterPromise: Promise<HighlighterCore> | null = null

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [
        import("shiki/themes/github-light-default.mjs"),
        import("shiki/themes/github-dark-default.mjs"),
      ],
      langs: [
        import("shiki/langs/tsx.mjs"),
        import("shiki/langs/typescript.mjs"),
        import("shiki/langs/bash.mjs"),
        import("shiki/langs/json.mjs"),
        import("shiki/langs/css.mjs"),
        import("shiki/langs/xml.mjs"),
      ],
      engine: createOnigurumaEngine(import("shiki/wasm")),
    })
  }
  return highlighterPromise
}

const SUPPORTED_LANGS = new Set([
  "tsx",
  "typescript",
  "ts",
  "bash",
  "sh",
  "shell",
  "json",
  "css",
  "xml",
])

/**
 * Highlights `code` into themed HTML. Emits both light and dark themes via CSS
 * variables (`--shiki-light` / `--shiki-dark`) so it follows the active theme.
 */
export async function highlightCode(code: string, lang = "tsx") {
  const highlighter = await getHighlighter()
  const resolved = SUPPORTED_LANGS.has(lang) ? lang : "tsx"

  return highlighter.codeToHtml(code, {
    lang: resolved,
    themes: {
      light: "github-light-default",
      dark: "github-dark-default",
    },
    defaultColor: false,
    transformers: [
      {
        pre(node) {
          // Keep `shiki` — the dual-theme swap in globals.css keys off it. Drop
          // the baked-in background so a surrounding container's color shows.
          node.properties["class"] =
            "shiki overflow-x-auto p-2.5 leading-relaxed !bg-transparent"
        },
        line(node) {
          // Marks each line so consumers can number them or scroll to one.
          // Inert on its own — nothing styles it unless a wrapper opts in.
          node.properties["data-line"] = ""
        },
      },
    ],
  })
}
