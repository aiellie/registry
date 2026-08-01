"use client"

import { memo } from "react"

import { themeStudioBootScript } from "@/lib/theme-studio"

/**
 * Paints the saved overrides before the first frame.
 *
 * Rendered site-wide — including inside `/demo/*`, where the panel itself stays
 * hidden — so a preview iframe opens already wearing the theme its parent is
 * showing.
 *
 * Memoized, and a client component rather than a server one: a server
 * component's markup rides along in the RSC payload, so every client-side
 * render of the root layout builds the tag again — and a `<script>` React
 * creates on the client is inert, which is what React warns about. Rendered
 * this way it is server-rendered into the HTML once, adopted at hydration, and
 * never re-rendered, so the tag the browser executed is the tag that stays.
 * Same shape `next-themes` uses for its own boot script.
 */
export const ThemeStudioScript = memo(function ThemeStudioScript() {
  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: themeStudioBootScript() }}
    />
  )
})
