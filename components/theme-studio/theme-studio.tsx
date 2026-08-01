import { getThemeStudioData } from "@/lib/theme-studio.server"
import { ThemeStudioPanel } from "@/components/theme-studio/theme-studio-panel"

/**
 * Reads the tokens off `app/globals.css` at request time, so the panel lists
 * whatever the stylesheet currently declares rather than a copy of it.
 */
export async function ThemeStudio() {
  return <ThemeStudioPanel data={await getThemeStudioData()} />
}
