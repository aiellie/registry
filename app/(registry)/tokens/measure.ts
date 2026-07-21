"use client"

import { useRef, useSyncExternalStore } from "react"

/** DOM measurements only change when the inputs do, so there is nothing to subscribe to. */
const noSubscribe = () => () => {}

const EMPTY = Object.freeze({})

/**
 * Reads a value out of the DOM once per distinct `key`.
 *
 * The browser is an external store here: the value cannot exist during SSR, and it
 * never changes on its own afterwards. Caching by key keeps the returned identity
 * stable, which is what `useSyncExternalStore` requires.
 */
function useDomSnapshot<T extends object>(key: string, read: () => T): T {
  const cache = useRef<{ key: string; value: T } | null>(null)

  return useSyncExternalStore(
    noSubscribe,
    () => {
      if (cache.current?.key !== key) {
        cache.current = { key, value: read() }
      }
      return cache.current.value
    },
    () => EMPTY as T
  )
}

/** Runs `read` against a throwaway probe element attached to the document. */
function withProbe<T>(read: (probe: HTMLDivElement) => T, fallback: T): T {
  if (typeof document === "undefined") return fallback

  const probe = document.createElement("div")
  probe.style.position = "absolute"
  probe.style.visibility = "hidden"
  probe.style.pointerEvents = "none"
  probe.setAttribute("aria-hidden", "true")
  document.body.appendChild(probe)

  try {
    return read(probe)
  } finally {
    probe.remove()
  }
}

/**
 * Resolves CSS lengths — `calc(0.875rem * 0.6)` and friends — to pixels by
 * letting layout do the arithmetic.
 */
export function useMeasuredLengths(values: Record<string, string | null>) {
  return useDomSnapshot<Record<string, number>>(JSON.stringify(values), () =>
    withProbe((probe) => {
      const lengths: Record<string, number> = {}
      for (const [key, value] of Object.entries(values)) {
        if (!value) continue
        probe.style.width = "0px"
        probe.style.width = value
        const { width } = probe.getBoundingClientRect()
        if (width > 0) lengths[key] = Math.round(width * 100) / 100
      }
      return lengths
    }, {})
  )
}

/** The font stack a `font-*` utility actually resolves to at runtime. */
export function useResolvedFonts(classNames: string[]) {
  return useDomSnapshot<Record<string, string>>(classNames.join(" "), () =>
    withProbe((probe) => {
      const fonts: Record<string, string> = {}
      for (const className of classNames) {
        probe.className = className
        fonts[className] = getComputedStyle(probe)
          .fontFamily.split(",")
          .map((family) => family.trim().replace(/^["']|["']$/g, ""))
          .join(", ")
      }
      return fonts
    }, {})
  )
}

export { useDomSnapshot }
