import {
  Fraunces,
  Geist,
  Geist_Mono,
  Inter,
  JetBrains_Mono,
} from "next/font/google"

/**
 * Every family the theme studio can switch to.
 *
 * Only Geist is preloaded — the rest are declared so their `@font-face` and
 * CSS variable exist, but the browser downloads a file only once something on
 * the page actually asks for that family, which is when the studio points
 * `--font-sans` at it.
 */

export const fontSans = Geist({ subsets: ["latin"], variable: "--font-sans" })

export const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  preload: false,
})

export const fontFraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  preload: false,
})

export const fontJetBrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  preload: false,
})

export const fontVariables = [
  fontSans.variable,
  fontMono.variable,
  fontInter.variable,
  fontFraunces.variable,
  fontJetBrains.variable,
]
