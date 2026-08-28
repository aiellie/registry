import { themeStudioBootScript } from "@/lib/theme-studio"

/**
 * Paints the saved overrides before the first frame.
 *
 * Rendered site-wide — including inside `/demo/*`, where the panel itself stays
 * hidden — so a preview iframe opens already wearing the theme its parent is
 * showing.
 *
 * A server component on purpose. As a client component the tag is a *component*
 * in the client tree, so every Fast Refresh that touches this module's import
 * graph hands React a brand new component type, React remounts it, and remount
 * means `document.createElement("script")` — a script React builds on the client
 * never executes, which is exactly what it warns about. Rendered on the server
 * it reaches the client as a plain host element in the RSC payload: React
 * hydrates the tag the browser already ran and reconciles it in place forever
 * after, so it is never rebuilt.
 */
export function ThemeStudioScript() {
  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: themeStudioBootScript() }}
    />
  )
}
