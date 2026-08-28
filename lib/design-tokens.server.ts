import { readFile } from "node:fs/promises"
import path from "node:path"

import type { ThemeSource } from "@/components/registry/theme-dialog"

import { type DesignTokenData, parseDesignTokens } from "./design-tokens"
import { highlightCode } from "./highlight-code"

const from = (...segments: string[]) => path.join(process.cwd(), ...segments)

/**
 * Server-only: reads the theme straight from source so the tokens page can never
 * drift from the stylesheet it documents.
 */
export async function getDesignTokens(): Promise<DesignTokenData> {
  const [globals, typeset] = await Promise.all([
    readFile(from("app", "globals.css"), "utf8"),
    readFile(from("app", "typeset.css"), "utf8"),
  ])

  return parseDesignTokens(globals, typeset)
}

const SOURCES = [
  {
    id: "globals",
    label: "globals.css",
    target: "app/globals.css",
    hint: "Theme tokens, the base layer, and every custom property. Lands at",
    file: ["app", "globals.css"],
  },
  {
    id: "typeset",
    label: "typeset.css",
    target: "app/typeset.css",
    hint: "Typography for rendered markdown and other HTML you did not write. Lands at",
    file: ["app", "typeset.css"],
  },
] as const

/** The stylesheets that define the system, highlighted for the theme dialog. */
export async function getThemeSources(): Promise<ThemeSource[]> {
  return Promise.all(
    SOURCES.map(async ({ file, ...source }) => {
      const code = await readFile(from(...file), "utf8")
      return { ...source, code, highlighted: await highlightCode(code, "css") }
    })
  )
}
