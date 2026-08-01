import { readFile } from "node:fs/promises"
import path from "node:path"
import { cache } from "react"

import { getDesignTokens } from "./design-tokens.server"
import {
  isSafeTokenValue,
  THEME_BLOCK_TOKENS,
  type ThemeStudioState,
} from "./theme-studio"
import { toThemeStudioData, type ThemeStudioData } from "./theme-studio-tokens"

const GLOBALS_CSS = path.join(process.cwd(), "app", "globals.css")

/** Cached per request — every route in the tree renders the studio. */
export const getThemeStudioData = cache(async (): Promise<ThemeStudioData> => {
  return toThemeStudioData(await getDesignTokens())
})

/** Byte range of the body of the first rule whose selector matches. */
function findBlock(css: string, selector: RegExp) {
  const match = selector.exec(css)
  if (!match) return null

  const open = css.indexOf("{", match.index)
  if (open === -1) return null

  let depth = 0
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth += 1
    else if (css[i] === "}") {
      depth -= 1
      if (depth === 0) return { open, close: i }
    }
  }
  return null
}

function validEntries(values: Record<string, string> | undefined) {
  return Object.entries(values ?? {}).filter(
    ([name, value]) => /^[a-z0-9-]+$/.test(name) && isSafeTokenValue(value)
  )
}

/**
 * Rewrites `--token: …` in place where the block already declares it, and
 * appends it just inside the closing brace where it does not — so a dark-mode
 * edit to a token `.dark` never listed still lands somewhere sensible.
 */
function applyToBlock(
  css: string,
  selector: RegExp,
  values: Record<string, string> | undefined
) {
  const entries = validEntries(values)
  if (entries.length === 0) return css

  const block = findBlock(css, selector)
  if (!block) return css

  let body = css.slice(block.open + 1, block.close)
  const additions: string[] = []

  for (const [name, value] of entries) {
    // The leading boundary keeps `--primary` from matching inside
    // `--sidebar-primary`; the trailing `;` keeps any comment after it intact.
    const declaration = new RegExp(
      `(^|[\\s;])(--${name}\\s*:\\s*)([^;\\n]*)(;)`
    )

    if (declaration.test(body)) {
      body = body.replace(declaration, (_, lead, head, __, tail) =>
        [lead, head, value, tail].join("")
      )
    } else {
      additions.push(`  --${name}: ${value};`)
    }
  }

  if (additions.length > 0) {
    body = `${body.replace(/\s*$/, "")}\n${additions.join("\n")}\n`
  }

  return css.slice(0, block.open + 1) + body + css.slice(block.close)
}

/**
 * `app/globals.css` with the studio's overrides folded back into the blocks
 * they were authored in — the file the user would have written by hand.
 */
export async function buildUpdatedGlobalsCss(
  state: ThemeStudioState
): Promise<string> {
  const themeTokens = new Set(THEME_BLOCK_TOKENS)

  const root: Record<string, string> = {}
  const theme: Record<string, string> = {}
  for (const [name, value] of Object.entries(state.root ?? {})) {
    if (themeTokens.has(name)) theme[name] = value
    else root[name] = value
  }

  let css = await readFile(GLOBALS_CSS, "utf8")
  // Re-found after each pass, so an insertion in an earlier block cannot shift
  // the next block's indices out from under us.
  css = applyToBlock(css, /^@theme inline\s*\{/m, theme)
  css = applyToBlock(css, /^:root\s*\{/m, { ...root, ...state.light })
  css = applyToBlock(css, /^\.dark\s*\{/m, state.dark)

  return css
}
