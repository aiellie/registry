import { themeStudioBootScript } from "@/lib/theme-studio"

/**
 * Paints the saved overrides before the first frame.
 *
 * Rendered site-wide — including inside `/demo/*`, where the panel itself stays
 * hidden — so a preview iframe opens already wearing the theme its parent is
 * showing.
 */
export function ThemeStudioScript() {
  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: themeStudioBootScript() }}
    />
  )
}
