import type { Metadata } from "next"

import { getDesignTokens, getThemeSources } from "@/lib/design-tokens.server"

import { TokensView } from "./tokens-view"
import { TokensHeader } from "./tokens-header"

export const metadata: Metadata = {
  title: "Design Tokens",
  description:
    "Every colour, type, radius, and spacing token in the registry.aiellie.dev design system, in light and dark.",
} 

export default async function TokensPage() {
  const [tokens, themeSources] = await Promise.all([
    getDesignTokens(),
    getThemeSources(),
  ])

  return (
    <>
      <TokensView data={tokens} themeSources={themeSources} />
    </>
  )
}
