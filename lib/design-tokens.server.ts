import { readFile } from "node:fs/promises"
import path from "node:path"

import { type DesignTokenData, parseDesignTokens } from "./design-tokens"

const SOURCE = path.join(process.cwd(), "app", "globals.css")

/**
 * Server-only: reads the theme straight from source so the tokens page can never
 * drift from the stylesheet it documents.
 */
export async function getDesignTokens(): Promise<DesignTokenData> {
  return parseDesignTokens(await readFile(SOURCE, "utf8"))
}
