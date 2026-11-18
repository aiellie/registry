"use client"

import { useSyncExternalStore, type ReactNode } from "react"

import { Bubble } from "@/components/canvasui/Bubble"
import { Liquid } from "@/components/canvasui/Liquid"
import {
  getServerThemeStudioState,
  getThemeStudioState,
  SITE_EFFECT_PREF,
  subscribeThemeStudio,
} from "@/lib/theme-studio"
import {
  DEFAULT_SITE_EFFECT,
  type SiteEffect,
} from "@/lib/theme-studio-presets"

/**
 * Wraps the home page in whichever full-viewport effect the studio is set to.
 *
 * Both effects render their children inside an html-in-canvas surface, so this
 * has to swap the wrapper rather than a prop on one of them — and `none` is a
 * plain `div`, for when the page should just be the page.
 */
export function SiteEffect({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const state = useSyncExternalStore(
    subscribeThemeStudio,
    getThemeStudioState,
    getServerThemeStudioState
  )

  const effect = (state.prefs[SITE_EFFECT_PREF] ??
    DEFAULT_SITE_EFFECT) as SiteEffect

  if (effect === "none") {
    return <div className={className}>{children}</div>
  }

  if (effect === "liquid") {
    return <Liquid className={className}>{children}</Liquid>
  }

  return <Bubble className={className}>{children}</Bubble>
}
