/**
 * Live theme overrides for the whole site.
 *
 * The studio never rewrites `app/globals.css` — it layers a single `<style>`
 * element over it, so every token stays exactly where it was authored and any
 * change is one `localStorage.removeItem` away from gone.
 *
 * Three buckets, because a stylesheet has three places a token can land:
 *
 * - `root`  → `:root`, i.e. both modes. Where a light-mode edit goes when
 *   `.dark` never redeclares the token, so the preview inherits the way the
 *   file would.
 * - `light` → light only. Used when `.dark` does redeclare the token, where an
 *   edit to `:root` could not reach dark mode anyway.
 * - `dark`  → `.dark`.
 *
 * Selectors are written one step more specific than the stylesheet's own
 * (`:root:root` beats `:root`, `:root.dark` beats `.dark`) so the layer wins on
 * specificity rather than on source order — the boot script can then run in
 * `<head>`, before the app's CSS has even been parsed.
 */

export type ThemeStudioScope = "root" | "light" | "dark"

export type ThemeStudioState = {
  root: Record<string, string>
  light: Record<string, string>
  dark: Record<string, string>
  /**
   * Settings that are not CSS at all — the home page's background effect, say.
   * Never reaches the stylesheet or the copied `globals.css`; it rides along
   * here so the panel has one store, one reset and one persisted key.
   */
  prefs: Record<string, string>
}

export const THEME_STUDIO_STORAGE_KEY = "aiellie-theme-studio"
export const THEME_STUDIO_STYLE_ID = "aiellie-theme-studio"

export const EMPTY_THEME_STUDIO_STATE: ThemeStudioState = Object.freeze({
  root: {},
  light: {},
  dark: {},
  prefs: {},
}) as ThemeStudioState

/** Key under `prefs` for the home page's background effect. */
export const SITE_EFFECT_PREF = "effect"

/**
 * `--font-weight-*` sit in `@theme inline`, so Tailwind bakes the number
 * straight into `.font-medium { font-weight: 450 }` instead of emitting a
 * `var()`. Overriding the custom property alone would move `body` and nothing
 * else, so the utilities are restated too.
 */
export const FONT_WEIGHT_UTILITIES: Record<string, string> = {
  "font-weight-normal": "font-normal",
  "font-weight-medium": "font-medium",
  "font-weight-semibold": "font-semibold",
  "font-weight-bold": "font-bold",
}

/**
 * Tokens declared in `@theme inline` rather than `:root`, so the copy dialog
 * knows which block to rewrite. `--font-sans` belongs here too: Tailwind inlines
 * it into `.font-sans`, and editing it anywhere else would leave the utility
 * pointing at the `next/font` variable.
 */
export const THEME_BLOCK_TOKENS: readonly string[] = [
  ...Object.keys(FONT_WEIGHT_UTILITIES),
  "font-sans",
]

/**
 * Everything a token value is allowed to contain. Values only ever come from
 * the studio's own controls, but they round-trip through `localStorage`, which
 * anyone can edit — and from there they reach a stylesheet and a copyable file.
 * No `;`, `{`, `}`, `<` or `>`, so nothing can escape the declaration it is in.
 */
const SAFE_VALUE = /^[a-zA-Z0-9 ().,%#/_'"-]+$/

export function isSafeTokenValue(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length < 200 &&
    SAFE_VALUE.test(value)
  )
}

/**
 * The stylesheet for a set of overrides.
 *
 * Serialized with `String()` into the blocking boot script, so it must stay
 * closure-free: no imports, no module constants, nothing it does not define
 * itself — including the duplicated regex and utility map below.
 */
export function buildThemeStudioCss(state: ThemeStudioState): string {
  const safe = /^[a-zA-Z0-9 ().,%#/_'"-]+$/
  const weights: Record<string, string> = {
    "font-weight-normal": "font-normal",
    "font-weight-medium": "font-medium",
    "font-weight-semibold": "font-semibold",
    "font-weight-bold": "font-bold",
  }

  const block = function (selector: string, values: Record<string, string>) {
    let body = ""
    if (values) {
      const names = Object.keys(values)
      for (let i = 0; i < names.length; i++) {
        const value = values[names[i]]
        if (typeof value !== "string" || !safe.test(value)) continue
        body += "--" + names[i] + ":" + value + ";"
      }
    }
    return body ? selector + "{" + body + "}" : ""
  }

  if (!state) return ""

  const root = state.root || {}
  let css =
    block(":root:root", root) +
    block(":root:not(.dark)", state.light) +
    block(":root.dark", state.dark)

  const tokens = Object.keys(weights)
  for (let j = 0; j < tokens.length; j++) {
    const weight = root[tokens[j]]
    if (typeof weight !== "string" || !safe.test(weight)) continue
    const name = weights[tokens[j]]
    css +=
      ":root ." +
      name +
      ",:root." +
      name +
      "{--tw-font-weight:" +
      weight +
      ";font-weight:" +
      weight +
      "}"
  }

  return css
}

/**
 * A blocking script that paints the saved overrides before the first frame.
 * Same builder as the runtime, handed over as source so the two can never
 * disagree about what a given state renders as.
 */
export function themeStudioBootScript(): string {
  return `(function(){try{var r=localStorage.getItem(${JSON.stringify(
    THEME_STUDIO_STORAGE_KEY
  )});if(!r)return;var c=(${String(
    buildThemeStudioCss
  )})(JSON.parse(r));if(!c)return;var e=document.createElement("style");e.id=${JSON.stringify(
    THEME_STUDIO_STYLE_ID
  )};e.textContent=c;document.head.appendChild(e)}catch(_){}})()`
}

/* ----------------------------------------------------------------- store */

const listeners = new Set<() => void>()
let cache: ThemeStudioState | null = null

function sanitize(values: unknown): Record<string, string> {
  const clean: Record<string, string> = {}
  if (!values || typeof values !== "object") return clean
  for (const [name, value] of Object.entries(values)) {
    if (/^[a-z0-9-]+$/.test(name) && isSafeTokenValue(value)) {
      clean[name] = value
    }
  }
  return clean
}

function readState(): ThemeStudioState {
  try {
    const raw = window.localStorage.getItem(THEME_STUDIO_STORAGE_KEY)
    if (!raw) return EMPTY_THEME_STUDIO_STATE
    const parsed = JSON.parse(raw)
    const next = {
      root: sanitize(parsed?.root),
      light: sanitize(parsed?.light),
      dark: sanitize(parsed?.dark),
      prefs: sanitize(parsed?.prefs),
    }
    return isEmptyThemeStudioState(next) ? EMPTY_THEME_STUDIO_STATE : next
  } catch {
    return EMPTY_THEME_STUDIO_STATE
  }
}

export function isEmptyThemeStudioState(state: ThemeStudioState): boolean {
  return (
    Object.keys(state.root).length === 0 &&
    Object.keys(state.light).length === 0 &&
    Object.keys(state.dark).length === 0 &&
    Object.keys(state.prefs).length === 0
  )
}

/** Writes the layer into the document, creating it on first use. */
export function applyThemeStudioCss(state: ThemeStudioState) {
  if (typeof document === "undefined") return
  const css = buildThemeStudioCss(state)
  let style = document.getElementById(
    THEME_STUDIO_STYLE_ID
  ) as HTMLStyleElement | null

  if (!css) {
    style?.remove()
    return
  }

  if (!style) {
    style = document.createElement("style")
    style.id = THEME_STUDIO_STYLE_ID
    document.head.appendChild(style)
  }
  if (style.textContent !== css) {
    style.textContent = css
  }
}

/**
 * Subscribes to overrides. The `storage` event carries changes into every other
 * same-origin frame, which is how a `/demo/*` preview retints itself while the
 * panel that changed it lives in the parent document.
 */
export function subscribeThemeStudio(onChange: () => void) {
  listeners.add(onChange)

  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== THEME_STUDIO_STORAGE_KEY) return
    cache = readState()
    applyThemeStudioCss(cache)
    for (const listener of listeners) listener()
  }

  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener("storage", onStorage)
  }
}

export function getThemeStudioState(): ThemeStudioState {
  if (!cache) cache = readState()
  return cache
}

/** `useSyncExternalStore` needs a stable value during SSR. */
export function getServerThemeStudioState(): ThemeStudioState {
  return EMPTY_THEME_STUDIO_STATE
}

export function setThemeStudioState(next: ThemeStudioState) {
  const clean: ThemeStudioState = {
    root: sanitize(next.root),
    light: sanitize(next.light),
    dark: sanitize(next.dark),
    prefs: sanitize(next.prefs),
  }
  cache = isEmptyThemeStudioState(clean) ? EMPTY_THEME_STUDIO_STATE : clean

  try {
    if (isEmptyThemeStudioState(clean)) {
      window.localStorage.removeItem(THEME_STUDIO_STORAGE_KEY)
    } else {
      window.localStorage.setItem(
        THEME_STUDIO_STORAGE_KEY,
        JSON.stringify(clean)
      )
    }
  } catch {
    // Private browsing, quota, a blocked origin — the layer still applies for
    // this page, it just will not survive a reload.
  }

  applyThemeStudioCss(cache)
  for (const listener of listeners) listener()
}

export function resetThemeStudio() {
  setThemeStudioState({ root: {}, light: {}, dark: {}, prefs: {} })
}

/** A shallow clone, so callers can mutate one bucket without touching the store. */
export function cloneThemeStudioState(
  state: ThemeStudioState
): ThemeStudioState {
  return {
    root: { ...state.root },
    light: { ...state.light },
    dark: { ...state.dark },
    prefs: { ...state.prefs },
  }
}
