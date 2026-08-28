"use client"

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react"
import { createPortal } from "react-dom"
import { Copy01Icon, DropperIcon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type Hsv = { h: number; s: number; v: number }

const EASE = [0.23, 1, 0.32, 1] as const
const DISC_RADIUS = 84
const THUMB_INSET = 9
const WHEEL_W = 180
const WHEEL_CX = WHEEL_W / 2
const WHEEL_CY = DISC_RADIUS
const BAND_STROKE = 14
const BAND_R = DISC_RADIUS + 6 + BAND_STROKE / 2
const BAND_HALF_SPAN = (42 * Math.PI) / 180
const BAND_ANG_LEFT = Math.PI / 2 + BAND_HALF_SPAN
const BAND_ANG_RIGHT = Math.PI / 2 - BAND_HALF_SPAN
const WHEEL_H = WHEEL_CY + BAND_R + THUMB_INSET + 2

const ALPHA_STROKE = 10
/** Far enough out that the opacity arc's hit area starts exactly where the
 * brightness arc's ends, so neither band steals the other's outer edge. */
const ALPHA_R = BAND_R + (BAND_STROKE + 10) / 2 + (ALPHA_STROKE + 6) / 2
const WHEEL_H_ALPHA = WHEEL_CY + ALPHA_R + THUMB_INSET + 2
/** Two 2.5px squares across the 10px band — fine enough to read as "nothing
 * here" without moiring against the arc's curve. */
const CHECKER_CELL = 5
/**
 * The transparency check, as one inked square per 2×2 tile over whatever sits
 * behind it. Inking one square rather than painting both means the same
 * pattern reads correctly on the page and on the popover, in either theme; the
 * ink itself comes from `currentColor`, so a text utility sets it.
 */
const CHECKER_IMAGE =
  "repeating-conic-gradient(currentColor 0% 25%, transparent 0% 50%)"

/** Wide enough for the value field's select, copy and eyedropper to sit
 * on one line beneath the wheel. */
const POPOVER_WIDTH = WHEEL_W + 60

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

/**
 * Accepts `fff`, `#fff`, `ffff`, `ffffff` or `#ffffffcc`; returns `#rrggbb`,
 * or `#rrggbbaa` when the value carries real transparency. A fully opaque `ff`
 * pair is dropped, so an opaque color has exactly one spelling.
 */
export function normalizeHex(input: string): string | null {
  let raw = input.trim().replace(/^#/, "").toLowerCase()
  if (/^[0-9a-f]{3,4}$/.test(raw)) {
    raw = raw
      .split("")
      .map((digit) => digit + digit)
      .join("")
  }
  if (/^[0-9a-f]{6}$/.test(raw)) return `#${raw}`
  if (/^[0-9a-f]{8}$/.test(raw)) {
    return raw.endsWith("ff") ? `#${raw.slice(0, 6)}` : `#${raw}`
  }
  return null
}

/** Splits `#rrggbbaa` into its opaque base and a 0–1 alpha. */
export function splitAlpha(hex: string): { base: string; alpha: number } {
  if (hex.length === 9) {
    return { base: hex.slice(0, 7), alpha: parseInt(hex.slice(7), 16) / 255 }
  }
  return { base: hex, alpha: 1 }
}

/** Re-attaches alpha to a `#rrggbb`, dropping the pair at full opacity. */
export function withAlpha(base: string, alpha: number): string {
  const a = clamp(alpha, 0, 1)
  if (a >= 1) return base
  return `${base}${Math.round(a * 255)
    .toString(16)
    .padStart(2, "0")}`
}

/* ------------------------------------------------------------ okhsv ↔ hex */

/* Björn Ottosson's Okhsv model: unlike plain HSV, a constant saturation on
 * the disc keeps a constant *perceived* chroma, so the wheel has no muddy
 * band around yellow and no over-bright cyan. */

const K1 = 0.206
const K2 = 0.03
const K3 = (1 + K1) / (1 + K2)

const toe = (x: number) =>
  0.5 * (K3 * x - K1 + Math.sqrt((K3 * x - K1) ** 2 + 4 * K2 * K3 * x))

const toeInv = (x: number) => (x * x + K1 * x) / (K3 * (x + K2))

const srgbTransfer = (x: number) =>
  x >= 0.0031308 ? 1.055 * Math.pow(x, 1 / 2.4) - 0.055 : 12.92 * x

const srgbTransferInv = (x: number) =>
  x >= 0.04045 ? Math.pow((x + 0.055) / 1.055, 2.4) : x / 12.92

function oklabToLinearSrgb(
  L: number,
  a: number,
  b: number
): [number, number, number] {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
}

function linearSrgbToOklab(
  r: number,
  g: number,
  b: number
): [number, number, number] {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}

function computeMaxSaturation(a: number, b: number): number {
  let k0: number, k1: number, k2: number, k3: number, k4: number
  let wl: number, wm: number, ws: number
  if (-1.88170328 * a - 0.80936493 * b > 1) {
    k0 = 1.19086277
    k1 = 1.76576728
    k2 = 0.59662641
    k3 = 0.75515197
    k4 = 0.56771245
    wl = 4.0767416621
    wm = -3.3077115913
    ws = 0.2309699292
  } else if (1.81444104 * a - 1.19445276 * b > 1) {
    k0 = 0.73956515
    k1 = -0.45954404
    k2 = 0.08285427
    k3 = 0.1254107
    k4 = 0.14503204
    wl = -1.2684380046
    wm = 2.6097574011
    ws = -0.3413193965
  } else {
    k0 = 1.35733652
    k1 = -0.00915799
    k2 = -1.1513021
    k3 = -0.50559606
    k4 = 0.00692167
    wl = -0.0041960863
    wm = -0.7034186147
    ws = 1.707614701
  }
  let S = k0 + k1 * a + k2 * b + k3 * a * a + k4 * a * b
  const kl = 0.3963377774 * a + 0.2158037573 * b
  const km = -0.1055613458 * a - 0.0638541728 * b
  const ks = -0.0894841775 * a - 1.291485548 * b
  const l_ = 1 + S * kl
  const m_ = 1 + S * km
  const s_ = 1 + S * ks
  const f = wl * l_ ** 3 + wm * m_ ** 3 + ws * s_ ** 3
  const f1 = 3 * (wl * kl * l_ ** 2 + wm * km * m_ ** 2 + ws * ks * s_ ** 2)
  const f2 = 6 * (wl * kl * kl * l_ + wm * km * km * m_ + ws * ks * ks * s_)
  S -= (f * f1) / (f1 * f1 - 0.5 * f * f2)
  return S
}

function findCusp(a: number, b: number): [number, number] {
  const sCusp = computeMaxSaturation(a, b)
  const [r, g, bb] = oklabToLinearSrgb(1, sCusp * a, sCusp * b)
  const lCusp = Math.cbrt(1 / Math.max(r, g, bb))
  return [lCusp, lCusp * sCusp]
}

/* The disc is ~28k pixels and every one of them needs a cusp; binning the
 * hue circle turns that into 1024 solves, computed lazily. */
const CUSP_BINS = 1024
const cuspCache = new Float64Array(CUSP_BINS * 2)
const cuspSeen = new Uint8Array(CUSP_BINS)

function cuspForHue(h: number): [number, number] {
  const bin = Math.min(
    CUSP_BINS - 1,
    Math.floor((((h % 1) + 1) % 1) * CUSP_BINS)
  )
  if (!cuspSeen[bin]) {
    const angle = (2 * Math.PI * (bin + 0.5)) / CUSP_BINS
    const [lCusp, cCusp] = findCusp(Math.cos(angle), Math.sin(angle))
    cuspCache[bin * 2] = lCusp
    cuspCache[bin * 2 + 1] = cCusp
    cuspSeen[bin] = 1
  }
  return [cuspCache[bin * 2], cuspCache[bin * 2 + 1]]
}

const S0 = 0.5

function okhsvToLinearSrgb(
  h: number,
  s: number,
  v: number,
  cusp?: [number, number]
): [number, number, number] {
  if (v <= 0) return [0, 0, 0]
  const a_ = Math.cos(2 * Math.PI * h)
  const b_ = Math.sin(2 * Math.PI * h)
  const [cuspL, cuspC] = cusp ?? findCusp(a_, b_)
  const sMax = cuspC / cuspL
  const tMax = cuspC / (1 - cuspL)
  const k = 1 - S0 / sMax
  const denom = S0 + tMax - tMax * k * s
  const lV = 1 - (s * S0) / denom
  const cV = (s * tMax * S0) / denom
  let L = v * lV
  let C = v * cV
  const lVt = toeInv(lV)
  const cVt = (cV * lVt) / lV
  const lNew = toeInv(L)
  C = (C * lNew) / L
  L = lNew
  const [rs, gs, bs] = oklabToLinearSrgb(lVt, a_ * cVt, b_ * cVt)
  const scaleL = Math.cbrt(1 / Math.max(rs, gs, bs, 0))
  L *= scaleL
  C *= scaleL
  return oklabToLinearSrgb(L, C * a_, C * b_)
}

export function hsvToHex({ h, s, v }: Hsv): string {
  const rgb = okhsvToLinearSrgb(h / 360, s / 100, v / 100)
  const channel = (x: number) =>
    Math.round(clamp(srgbTransfer(x), 0, 1) * 255)
      .toString(16)
      .padStart(2, "0")
  return `#${channel(rgb[0])}${channel(rgb[1])}${channel(rgb[2])}`
}

export function hexToHsv(hex: string): Hsv {
  // Alpha is carried alongside the wheel, never on it, so an `aa` pair is
  // sliced off rather than shifting every channel eight bits.
  const value = parseInt(hex.slice(1, 7), 16)
  const r = srgbTransferInv(((value >> 16) & 255) / 255)
  const g = srgbTransferInv(((value >> 8) & 255) / 255)
  const b = srgbTransferInv((value & 255) / 255)
  const [L, labA, labB] = linearSrgbToOklab(r, g, b)
  if (L <= 1e-6) return { h: 0, s: 0, v: 0 }
  const C = Math.hypot(labA, labB)
  if (C < 1e-6) return { h: 0, s: 0, v: clamp(toe(L), 0, 1) * 100 }
  const a_ = labA / C
  const b_ = labB / C
  const h = (Math.atan2(labB, labA) / (2 * Math.PI) + 1) % 1
  const [cuspL, cuspC] = findCusp(a_, b_)
  const sMax = cuspC / cuspL
  const tMax = cuspC / (1 - cuspL)
  const k = 1 - S0 / sMax
  const t = tMax / (C + L * tMax)
  const lV = t * L
  const cV = t * C
  const lVt = toeInv(lV)
  const cVt = (cV * lVt) / lV
  const [rs, gs, bs] = oklabToLinearSrgb(lVt, a_ * cVt, b_ * cVt)
  const scaleL = Math.cbrt(1 / Math.max(rs, gs, bs, 0))
  const toeL = toe(L / scaleL)
  const v = toeL / lV
  const s = ((S0 + tMax) * cV) / (tMax * S0 + tMax * k * cV)
  return {
    h: h * 360,
    s: clamp(s, 0, 1) * 100,
    v: clamp(v, 0, 1) * 100,
  }
}

/* ------------------------------------------------------------- notations */

export type ColorFormat = "hex" | "rgb" | "hsl" | "oklch"

export const COLOR_FORMATS: readonly { value: ColorFormat; label: string }[] = [
  { value: "hex", label: "HEX" },
  { value: "rgb", label: "RGB" },
  { value: "hsl", label: "HSL" },
  { value: "oklch", label: "OKLCH" },
]

const round = (x: number, places = 0) => {
  const factor = 10 ** places
  return Math.round(x * factor) / factor
}

function hexToRgb(hex: string): [number, number, number] {
  const value = parseInt(hex.slice(1, 7), 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

function rgbToHex(r: number, g: number, b: number): string {
  const channel = (x: number) =>
    Math.round(clamp(x, 0, 255))
      .toString(16)
      .padStart(2, "0")
  return `#${channel(r)}${channel(g)}${channel(b)}`
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  const d = max - min
  if (d === 0) return [0, 0, l * 100]
  const s = d / (1 - Math.abs(2 * l - 1))
  let h: number
  if (max === rn) h = ((gn - bn) / d) % 6
  else if (max === gn) h = (bn - rn) / d + 2
  else h = (rn - gn) / d + 4
  return [(((h * 60) % 360) + 360) % 360, s * 100, l * 100]
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const hn = (((h % 360) + 360) % 360) / 60
  const sn = clamp(s, 0, 100) / 100
  const ln = clamp(l, 0, 100) / 100
  const c = (1 - Math.abs(2 * ln - 1)) * sn
  const x = c * (1 - Math.abs((hn % 2) - 1))
  const m = ln - c / 2
  const [r, g, b] =
    hn < 1
      ? [c, x, 0]
      : hn < 2
        ? [x, c, 0]
        : hn < 3
          ? [0, c, x]
          : hn < 4
            ? [0, x, c]
            : hn < 5
              ? [x, 0, c]
              : [c, 0, x]
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255]
}

function hexToOklch(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex)
  const [L, a, bb] = linearSrgbToOklab(
    srgbTransferInv(r / 255),
    srgbTransferInv(g / 255),
    srgbTransferInv(b / 255)
  )
  const c = Math.hypot(a, bb)
  const h = c < 1e-6 ? 0 : ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360
  return [L, c, h]
}

function oklchToHex(L: number, c: number, h: number): string {
  const rad = (h * Math.PI) / 180
  const rgb = oklabToLinearSrgb(L, c * Math.cos(rad), c * Math.sin(rad))
  return rgbToHex(
    clamp(srgbTransfer(rgb[0]), 0, 1) * 255,
    clamp(srgbTransfer(rgb[1]), 0, 1) * 255,
    clamp(srgbTransfer(rgb[2]), 0, 1) * 255
  )
}

/**
 * The channel values only — the notation is already named by the select
 * beside the field, so `rgb(…)` wrapping would only eat room. Alpha rides
 * along in the CSS slash form, and is omitted entirely at full opacity so an
 * opaque color reads exactly as it always has.
 */
export function formatColor(hex: string, format: ColorFormat): string {
  const { base, alpha } = splitAlpha(hex)
  const suffix = alpha < 1 ? ` / ${round(alpha, 2)}` : ""
  if (format === "hex") return hex
  if (format === "rgb") return `${hexToRgb(base).join(" ")}${suffix}`
  if (format === "hsl") {
    const [h, s, l] = rgbToHsl(...hexToRgb(base))
    return `${round(h)} ${round(s)}% ${round(l)}%${suffix}`
  }
  // Two decimals keeps `0.72 0.19 150` inside the field; the exact color is
  // carried by the hex value, not by what the field shows.
  const [L, c, h] = hexToOklch(base)
  return `${round(L, 2)} ${round(c, 2)} ${round(h)}${suffix}`
}

/**
 * Reads back anything the field might hold: bare channels in the current
 * notation, or a full `rgb(…)` / `hsl(…)` / `oklch(…)` string pasted in from
 * somewhere else, with or without a trailing alpha. Returns `#rrggbb` — or
 * `#rrggbbaa` when it read transparency — and null when it does not parse.
 */
export function parseColor(input: string, format: ColorFormat): string | null {
  const text = input.trim().toLowerCase()
  const hex = normalizeHex(text)
  if (hex) return hex

  const match = /^([a-z]*)\s*\(?\s*([^)]*?)\s*\)?$/.exec(text)
  if (!match) return null
  const kind = match[1] || format
  const tokens = match[2].split(/[\s,/]+/).filter(Boolean)
  const parts = tokens.map((part) => parseFloat(part))
  if (parts.length < 3 || parts.slice(0, 3).some(Number.isNaN)) return null

  // The modern `rgb(0 0 0 / 40%)` and the legacy `rgba(0, 0, 0, 0.4)` both put
  // alpha in the fourth slot; only the `%` tells the two scales apart.
  const alpha =
    parts.length > 3 && !Number.isNaN(parts[3])
      ? clamp(tokens[3].includes("%") ? parts[3] / 100 : parts[3], 0, 1)
      : 1

  const [a, b, c] = parts
  if (kind.startsWith("rgb")) return withAlpha(rgbToHex(a, b, c), alpha)
  if (kind.startsWith("hsl")) {
    return withAlpha(rgbToHex(...hslToRgb(a, b, c)), alpha)
  }
  if (kind.startsWith("oklch")) {
    // `78.6%` arrives here as 78.6, but lightness is a 0–1 quantity.
    return withAlpha(oklchToHex(a > 1 ? a / 100 : a, b, c), alpha)
  }
  return null
}

/* -------------------------------------------------------------- hue disc */

const THUMB_SHADOW = "0 0 0 1px rgba(0,0,0,0.14), 0 1px 3px rgba(0,0,0,0.25)"

function ColorDisc({
  hsv,
  onChange,
}: {
  hsv: Hsv
  onChange: (next: Hsv) => void
}) {
  const discRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dragging, setDragging] = useState(false)
  const reachRadius = DISC_RADIUS - THUMB_INSET

  // Painted once: hue around the disc, saturation out from the middle. The
  // blur pass hides the pixel stepping without moving any of the stops.
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const size = Math.round(DISC_RADIUS * 2 * dpr)
    canvas.width = size
    canvas.height = size
    const image = ctx.createImageData(size, size)
    const data = image.data
    const center = size / 2
    const reach = (DISC_RADIUS - THUMB_INSET) * dpr
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x + 0.5 - center
        const dy = y + 0.5 - center
        const h = (Math.atan2(dy, dx) / (2 * Math.PI) + 1.25) % 1
        const s = clamp(Math.hypot(dx, dy) / reach, 0, 1)
        const rgb = okhsvToLinearSrgb(h, s, 1, cuspForHue(h))
        const i = (y * size + x) * 4
        data[i] = Math.round(clamp(srgbTransfer(rgb[0]), 0, 1) * 255)
        data[i + 1] = Math.round(clamp(srgbTransfer(rgb[1]), 0, 1) * 255)
        data[i + 2] = Math.round(clamp(srgbTransfer(rgb[2]), 0, 1) * 255)
        data[i + 3] = 255
      }
    }
    const layer = document.createElement("canvas")
    layer.width = size
    layer.height = size
    layer.getContext("2d")?.putImageData(image, 0, 0)
    ctx.filter = `blur(${5 * dpr}px)`
    ctx.drawImage(layer, 0, 0)
    ctx.filter = "none"
    ctx.globalCompositeOperation = "destination-in"
    ctx.beginPath()
    ctx.arc(center, center, center - 0.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalCompositeOperation = "source-over"
  }, [])

  const fromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const rect = discRef.current?.getBoundingClientRect()
      if (!rect) return
      const dx = clientX - rect.left - DISC_RADIUS
      const dy = clientY - rect.top - DISC_RADIUS
      const h = ((Math.atan2(dy, dx) * 180) / Math.PI + 90 + 360) % 360
      const s = clamp(Math.hypot(dx, dy) / reachRadius, 0, 1) * 100
      onChange({ ...hsv, h, s })
    },
    [hsv, onChange, reachRadius]
  )

  const handlePointerDown = (e: ReactPointerEvent) => {
    e.preventDefault()
    try {
      discRef.current?.setPointerCapture(e.pointerId)
    } catch {}
    setDragging(true)
    fromPointer(e.clientX, e.clientY)
  }

  const handlePointerMove = (e: ReactPointerEvent) => {
    if (!dragging) return
    if (e.pointerType === "mouse" && e.buttons === 0) {
      setDragging(false)
      return
    }
    fromPointer(e.clientX, e.clientY)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    let dh = 0
    let ds = 0
    if (e.key === "ArrowRight") dh = 2
    else if (e.key === "ArrowLeft") dh = -2
    else if (e.key === "ArrowUp") ds = 2
    else if (e.key === "ArrowDown") ds = -2
    else return
    e.preventDefault()
    onChange({
      ...hsv,
      h: (hsv.h + dh + 360) % 360,
      s: clamp(hsv.s + ds, 0, 100),
    })
  }

  const angle = ((hsv.h - 90) * Math.PI) / 180
  const radius = (hsv.s / 100) * reachRadius
  const thumbX = DISC_RADIUS + radius * Math.cos(angle)
  const thumbY = DISC_RADIUS + radius * Math.sin(angle)

  return (
    <div
      ref={discRef}
      role="slider"
      aria-label="Hue and saturation"
      aria-valuemin={0}
      aria-valuemax={360}
      aria-valuenow={Math.round(hsv.h)}
      aria-valuetext={`Hue ${Math.round(hsv.h)} degrees, saturation ${Math.round(hsv.s)}%`}
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      onLostPointerCapture={() => setDragging(false)}
      onKeyDown={handleKeyDown}
      className="relative mx-auto cursor-pointer rounded-full outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring"
      style={{
        width: DISC_RADIUS * 2,
        height: DISC_RADIUS * 2,
        touchAction: "none",
      }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full rounded-full ring-1 ring-foreground/10 ring-inset"
      />
      <div
        className="pointer-events-none absolute size-4 rounded-full border-2 border-white transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
        style={{
          left: thumbX,
          top: thumbY,
          background: hsvToHex(hsv),
          boxShadow: THUMB_SHADOW,
          transform: `translate(-50%, -50%) scale(${dragging ? 1.25 : 1})`,
        }}
      />
    </div>
  )
}

/* ------------------------------------------------------- brightness band */

function arcPoint(t: number, radius: number) {
  const angle = BAND_ANG_LEFT + t * (BAND_ANG_RIGHT - BAND_ANG_LEFT)
  return {
    x: WHEEL_CX + radius * Math.cos(angle),
    y: WHEEL_CY + radius * Math.sin(angle),
  }
}

const arcPath = (radius: number) => {
  const left = arcPoint(0, radius)
  const right = arcPoint(1, radius)
  return `M ${left.x} ${left.y} A ${radius} ${radius} 0 0 0 ${right.x} ${right.y}`
}

/**
 * Turns a pointer anywhere around the wheel into 0–1 along an arc. The angle
 * carries the whole answer, so the radius never enters into it and both bands
 * can share one implementation — drag either and your finger may wander off
 * its own ring without the value jumping.
 */
function useArcScrub(onScrub: (t: number) => void) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dragging, setDragging] = useState(false)

  const fromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const rect = svgRef.current?.getBoundingClientRect()
      if (!rect) return
      const dx = clientX - rect.left - WHEEL_CX
      const dy = clientY - rect.top - WHEEL_CY
      let angle = Math.atan2(dy, dx)
      if (angle < -Math.PI / 2) angle += Math.PI * 2
      onScrub(
        clamp((BAND_ANG_LEFT - angle) / (BAND_ANG_LEFT - BAND_ANG_RIGHT), 0, 1)
      )
    },
    [onScrub]
  )

  const handlers = {
    onPointerDown: (e: ReactPointerEvent) => {
      e.preventDefault()
      try {
        svgRef.current?.setPointerCapture(e.pointerId)
      } catch {}
      setDragging(true)
      fromPointer(e.clientX, e.clientY)
    },
    onPointerMove: (e: ReactPointerEvent) => {
      if (!dragging) return
      if (e.pointerType === "mouse" && e.buttons === 0) {
        setDragging(false)
        return
      }
      fromPointer(e.clientX, e.clientY)
    },
    onPointerUp: () => setDragging(false),
    onPointerCancel: () => setDragging(false),
    onLostPointerCapture: () => setDragging(false),
  }

  return { svgRef, dragging, handlers }
}

/** The step an arrow/page/home/end press asks for, on a 0–100 scale. */
function arcKeyDelta(e: KeyboardEvent<SVGElement>, current: number) {
  if (e.key === "ArrowRight" || e.key === "ArrowUp") return 2
  if (e.key === "ArrowLeft" || e.key === "ArrowDown") return -2
  if (e.key === "PageUp") return 10
  if (e.key === "PageDown") return -10
  if (e.key === "Home") return -current
  if (e.key === "End") return 100 - current
  return null
}

/** Only the arc itself is hit-testable, so the square SVG never swallows
 * clicks meant for the disc underneath it. */
const BAND_SVG_STYLE = { touchAction: "none", pointerEvents: "none" } as const
const BAND_SVG_CLASS =
  "absolute inset-0 cursor-pointer rounded-2xl outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring"
const THUMB_GROW = {
  transition: "r 150ms cubic-bezier(0.23, 1, 0.32, 1)",
} as const
const THUMB_LIFT = {
  pointerEvents: "none",
  filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.35))",
} as const
const THUMB_STYLE = { ...THUMB_LIFT, ...THUMB_GROW } as const

function BrightnessBand({
  hsv,
  onChange,
}: {
  hsv: Hsv
  onChange: (next: Hsv) => void
}) {
  const gradientId = useId()
  const { svgRef, dragging, handlers } = useArcScrub(
    useCallback((t: number) => onChange({ ...hsv, v: t * 100 }), [hsv, onChange])
  )

  const handleKeyDown = (e: KeyboardEvent<SVGElement>) => {
    const delta = arcKeyDelta(e, hsv.v)
    if (delta === null) return
    e.preventDefault()
    onChange({ ...hsv, v: clamp(hsv.v + delta, 0, 100) })
  }

  const left = arcPoint(0, BAND_R)
  const right = arcPoint(1, BAND_R)
  const bandPath = arcPath(BAND_R)
  const thumb = arcPoint(hsv.v / 100, BAND_R)

  return (
    <svg
      ref={svgRef}
      role="slider"
      aria-label="Brightness"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(hsv.v)}
      tabIndex={0}
      viewBox={`0 0 ${WHEEL_W} ${WHEEL_H}`}
      {...handlers}
      onKeyDown={handleKeyDown}
      className={BAND_SVG_CLASS}
      style={{ width: WHEEL_W, height: WHEEL_H, ...BAND_SVG_STYLE }}
    >
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1={left.x}
          y1={left.y}
          x2={right.x}
          y2={right.y}
        >
          <stop offset="0" stopColor="#000" />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
      </defs>
      <path
        d={bandPath}
        fill="none"
        strokeWidth={BAND_STROKE + 2}
        strokeLinecap="round"
        className="stroke-foreground/15"
      />
      <path
        d={bandPath}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={BAND_STROKE}
        strokeLinecap="round"
        style={{ pointerEvents: "stroke" }}
      />
      <path
        d={bandPath}
        fill="none"
        stroke="transparent"
        strokeWidth={BAND_STROKE + 10}
        strokeLinecap="round"
        style={{ pointerEvents: "stroke" }}
      />
      <circle
        cx={thumb.x}
        cy={thumb.y}
        r={dragging ? 9 : 7.5}
        fill={hsvToHex({ h: hsv.h, s: 0, v: hsv.v })}
        stroke="#fff"
        strokeWidth={2}
        style={THUMB_STYLE}
      />
    </svg>
  )
}

/* ---------------------------------------------------------- opacity band */

/**
 * A second arc concentric with the brightness one, sweeping the same span so
 * the two read as nested rings. The checkerboard is the only thing that says
 * "transparent" once the color underneath goes pale, so it sits under both the
 * band and its thumb.
 */
function OpacityBand({
  base,
  alpha,
  onChange,
}: {
  /** The opaque `#rrggbb` the gradient ramps up to. */
  base: string
  alpha: number
  onChange: (next: number) => void
}) {
  const gradientId = useId()
  const checkerId = useId()
  const { svgRef, dragging, handlers } = useArcScrub(onChange)

  const percent = alpha * 100

  const handleKeyDown = (e: KeyboardEvent<SVGElement>) => {
    const delta = arcKeyDelta(e, percent)
    if (delta === null) return
    e.preventDefault()
    onChange(clamp(percent + delta, 0, 100) / 100)
  }

  const left = arcPoint(0, ALPHA_R)
  const right = arcPoint(1, ALPHA_R)
  const bandPath = arcPath(ALPHA_R)
  const thumb = arcPoint(alpha, ALPHA_R)
  const thumbR = dragging ? 8.5 : 7

  return (
    <svg
      ref={svgRef}
      role="slider"
      aria-label="Opacity"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percent)}
      aria-valuetext={`${Math.round(percent)}%`}
      tabIndex={0}
      viewBox={`0 0 ${WHEEL_W} ${WHEEL_H_ALPHA}`}
      {...handlers}
      onKeyDown={handleKeyDown}
      className={BAND_SVG_CLASS}
      style={{ width: WHEEL_W, height: WHEEL_H_ALPHA, ...BAND_SVG_STYLE }}
    >
      <defs>
        <pattern
          id={checkerId}
          width={CHECKER_CELL}
          height={CHECKER_CELL}
          patternUnits="userSpaceOnUse"
        >
          <rect
            width={CHECKER_CELL / 2}
            height={CHECKER_CELL / 2}
            className="fill-foreground/20"
          />
          <rect
            x={CHECKER_CELL / 2}
            y={CHECKER_CELL / 2}
            width={CHECKER_CELL / 2}
            height={CHECKER_CELL / 2}
            className="fill-foreground/20"
          />
        </pattern>
        {/* `stopOpacity` rather than a `transparent` stop: the keyword ramps
         * through transparent *black* in some engines, greying the fade. */}
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1={left.x}
          y1={left.y}
          x2={right.x}
          y2={right.y}
        >
          <stop offset="0" stopColor={base} stopOpacity={0} />
          <stop offset="1" stopColor={base} stopOpacity={1} />
        </linearGradient>
      </defs>
      <path
        d={bandPath}
        fill="none"
        strokeWidth={ALPHA_STROKE + 2}
        strokeLinecap="round"
        className="stroke-foreground/15"
      />
      <path
        d={bandPath}
        fill="none"
        stroke={`url(#${checkerId})`}
        strokeWidth={ALPHA_STROKE}
        strokeLinecap="round"
      />
      <path
        d={bandPath}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={ALPHA_STROKE}
        strokeLinecap="round"
        style={{ pointerEvents: "stroke" }}
      />
      <path
        d={bandPath}
        fill="none"
        stroke="transparent"
        strokeWidth={ALPHA_STROKE + 6}
        strokeLinecap="round"
        style={{ pointerEvents: "stroke" }}
      />
      {/* Grouped so the shadow is cast once, by the pair rather than by each
       * circle; the grow lives on the circles, since `r` is theirs. */}
      <g style={THUMB_LIFT}>
        <circle
          cx={thumb.x}
          cy={thumb.y}
          r={thumbR}
          fill={`url(#${checkerId})`}
          style={THUMB_GROW}
        />
        <circle
          cx={thumb.x}
          cy={thumb.y}
          r={thumbR}
          fill={base}
          fillOpacity={alpha}
          stroke="#fff"
          strokeWidth={2}
          style={THUMB_GROW}
        />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------- swatches */

export interface ColorSwatch {
  /** Any CSS color; a `var(--token)` reference resolves against the theme. */
  value: string
  label: string
}

/**
 * The theme's own ramp. Held as `var()` references rather than literals so the
 * row follows light/dark — and a consumer's retheme — with no second list to
 * keep in sync.
 */
export const THEME_SWATCHES: readonly ColorSwatch[] = [
  { label: "Primary", value: "var(--primary)" },
  { label: "Accent", value: "var(--accent)" },
  { label: "Secondary", value: "var(--secondary)" },
  { label: "Secondary Foreground", value: "var(--secondary-foreground)" },
  { label: "Muted", value: "var(--muted)" },
  { label: "Muted Foreground", value: "var(--muted-foreground)" },
  { label: "Destructive", value: "var(--destructive)" },
  { label: "Destructive-Foreground", value: "var(--destructive-foreground)" },
]

/**
 * Any CSS color down to `#rrggbb`, with the browser doing the parsing twice
 * over: `getComputedStyle` substitutes the custom property, then canvas
 * converts whatever space it serialized in — Chrome hands back CIE `lab()` for
 * an `oklch()` token — to sRGB bytes. Null when the color does not parse.
 */
function resolveCssColor(
  color: string,
  ctx: CanvasRenderingContext2D
): string | null {
  const probe = document.createElement("span")
  probe.style.color = color
  document.body.append(probe)
  const computed = getComputedStyle(probe).color
  probe.remove()

  // An unparseable value leaves fillStyle untouched, which is the only signal
  // canvas gives that it rejected the assignment.
  const sentinel = "#010203"
  ctx.fillStyle = sentinel
  ctx.fillStyle = computed
  if (ctx.fillStyle === sentinel) return null

  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return rgbToHex(r, g, b)
}

/** Resolved once per open, so the row always reflects the theme in force. */
function useSwatchHexes(swatches: readonly ColorSwatch[]) {
  return useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 1
    canvas.height = 1
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return []
    return swatches
      .map((swatch) => ({ swatch, hex: resolveCssColor(swatch.value, ctx) }))
      .filter(
        (entry): entry is { swatch: ColorSwatch; hex: string } =>
          entry.hex !== null
      )
  }, [swatches])
}

/* ----------------------------------------------------------- eyedropper */

const emptySubscribe = () => () => {}

interface EyeDropperConstructor {
  new (): { open(): Promise<{ sRGBHex: string }> }
}

/** Chromium-only, so the button is rendered from what the client reports. */
function useEyeDropper(): EyeDropperConstructor | null {
  return useSyncExternalStore(
    emptySubscribe,
    () => (window as { EyeDropper?: EyeDropperConstructor }).EyeDropper ?? null,
    () => null
  )
}

/* -------------------------------------------------------------- popover */

function ColorPopover({
  id,
  anchorRef,
  value,
  onValueChange,
  onClose,
  format,
  onFormatChange,
  swatches,
  opacity,
}: {
  id: string
  anchorRef: RefObject<HTMLButtonElement | null>
  value: string
  onValueChange: (hex: string) => void
  onClose: () => void
  format: ColorFormat
  onFormatChange: (format: ColorFormat) => void
  swatches: readonly ColorSwatch[]
  opacity: boolean
}) {
  const popRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{
    top: number
    left: number
    origin: string
  } | null>(null)
  const shouldReduceMotion = useReducedMotion()
  const eyeDropper = useEyeDropper()
  const swatchHexes = useSwatchHexes(swatches)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(timer)
  }, [copied])

  const initial = normalizeHex(value) ?? "#ffffff"
  /**
   * `seen` is the exact color in force, alpha and all; `hsv` is only ever the
   * wheel's read of its opaque half. Everything downstream reads `seen` rather
   * than re-deriving from `hsv`, which the Okhsv round-trip can nudge.
   */
  const [state, setState] = useState<{ hsv: Hsv; draft: string; seen: string }>(
    () => ({
      hsv: hexToHsv(initial),
      draft: formatColor(initial, format),
      seen: initial,
    })
  )
  const { base, alpha } = splitAlpha(state.seen)

  // Adopt an outside change (a reset, a preset) without clobbering the
  // field while it is being typed into.
  const incoming = normalizeHex(value)
  if (incoming && incoming !== state.seen) {
    setState({
      hsv: hexToHsv(incoming),
      draft: formatColor(incoming, format),
      seen: incoming,
    })
  }

  const commit = (next: Hsv, hex: string) => {
    setState({ hsv: next, draft: formatColor(hex, format), seen: hex })
    onValueChange(hex)
  }

  const apply = (next: Hsv) => commit(next, withAlpha(hsvToHex(next), alpha))

  /** Opacity alone: the base is carried over untouched rather than rebuilt
   * from `hsv`, so nudging the arc can never shift the color itself. */
  const applyAlpha = (next: number) => commit(state.hsv, withAlpha(base, next))

  /**
   * Sets the color from an exact hex rather than from a wheel position. The
   * Okhsv round-trip can land a channel a step off, so a token or a typed value
   * is kept verbatim instead of being re-derived from the hsv it produced.
   */
  const applyHex = (hex: string) => commit(hexToHsv(hex), hex)

  const commitDraft = () => {
    const hex = parseColor(state.draft, format)
    if (hex && hex !== state.seen) {
      applyHex(hex)
    } else {
      setState((prev) => ({
        ...prev,
        draft: formatColor(prev.seen, format),
      }))
    }
  }

  const copyValue = () => {
    // Only confirm once the write lands — a blocked clipboard should leave
    // the button saying "Copy" rather than lie about it.
    navigator.clipboard
      .writeText(formatColor(state.seen, format))
      .then(() => setCopied(true))
      .catch(() => setCopied(false))
  }

  const changeFormat = (next: ColorFormat) => {
    onFormatChange(next)
    setState((prev) => ({
      ...prev,
      draft: formatColor(prev.seen, next),
    }))
  }

  const place = useCallback(() => {
    const anchor = anchorRef.current
    const pop = popRef.current
    if (!anchor || !pop) return
    const rect = anchor.getBoundingClientRect()
    const height = pop.offsetHeight
    const left = clamp(
      rect.right - POPOVER_WIDTH,
      8,
      window.innerWidth - POPOVER_WIDTH - 8
    )
    let top = rect.bottom + 8
    let origin = "top right"
    if (top + height > window.innerHeight - 8) {
      top = Math.max(8, rect.top - 8 - height)
      origin = "bottom right"
    }
    setPos({ top, left, origin })
  }, [anchorRef])

  useLayoutEffect(() => {
    place()
  }, [place])

  useEffect(() => {
    window.addEventListener("resize", place)
    window.addEventListener("scroll", place, true)
    return () => {
      window.removeEventListener("resize", place)
      window.removeEventListener("scroll", place, true)
    }
  }, [place])

  useEffect(() => {
    popRef.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    const handleDown = (e: PointerEvent) => {
      const target = e.target as Node
      // The format menu is portalled out of this popover, so picking a
      // notation would otherwise read as a click outside.
      if (
        target instanceof Element &&
        target.closest("[data-slot='select-content']")
      ) {
        return
      }
      if (
        !popRef.current?.contains(target) &&
        !anchorRef.current?.contains(target)
      ) {
        onClose()
      }
    }
    document.addEventListener("pointerdown", handleDown)
    return () => document.removeEventListener("pointerdown", handleDown)
  }, [anchorRef, onClose])

  return createPortal(
    <motion.div
      ref={popRef}
      id={id}
      role="dialog"
      aria-label="Color picker"
      tabIndex={-1}
      initial={
        shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.82 }
      }
      animate={{ opacity: 1, scale: 1 }}
      exit={
        shouldReduceMotion
          ? { opacity: 0, transition: { duration: 0.12 } }
          : {
              opacity: 0,
              scale: 0.9,
              transition: { duration: 0.14, ease: EASE },
            }
      }
      transition={{ type: "spring", duration: 0.4, bounce: 0 }}
      onKeyDown={(e) => {
        // An Escape aimed at the open format menu bubbles up through the
        // portal; it should dismiss that menu alone.
        if (e.key === "Escape" && popRef.current?.contains(e.target as Node)) {
          e.stopPropagation()
          onClose()
        }
      }}
      className="fixed z-50 flex flex-col gap-2 rounded-t-[120px] rounded-b-2xl border border-border/60 bg-popover/95 px-3 pt-2.5 pb-3 shadow-xl backdrop-blur-xl outline-none"
      style={{
        width: POPOVER_WIDTH,
        top: pos?.top ?? -9999,
        left: pos?.left ?? -9999,
        transformOrigin: pos?.origin,
      }}
    >
      <div
        className="relative mx-auto"
        style={{ width: WHEEL_W, height: opacity ? WHEEL_H_ALPHA : WHEEL_H }}
      >
        <motion.div
          initial={
            shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85 }
          }
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            duration: 0.45,
            bounce: 0,
            delay: 0.05,
          }}
          className="absolute inset-x-0 top-0"
          style={{ height: DISC_RADIUS * 2 }}
        >
          <ColorDisc hsv={state.hsv} onChange={apply} />
        </motion.div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            WebkitMaskImage: `radial-gradient(circle at ${WHEEL_CX}px ${WHEEL_CY}px, transparent ${DISC_RADIUS}px, black ${DISC_RADIUS + 1}px)`,
            maskImage: `radial-gradient(circle at ${WHEEL_CX}px ${WHEEL_CY}px, transparent ${DISC_RADIUS}px, black ${DISC_RADIUS + 1}px)`,
          }}
        >
          <motion.div
            initial={
              shouldReduceMotion ? { opacity: 0 } : { y: -18, scale: 0.85 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              type: "spring",
              duration: 0.5,
              bounce: 0,
              delay: 0.16,
            }}
            className="pointer-events-none absolute inset-0"
          >
            <BrightnessBand hsv={state.hsv} onChange={apply} />
          </motion.div>
          {opacity && (
            <motion.div
              initial={
                shouldReduceMotion ? { opacity: 0 } : { y: -22, scale: 0.85 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                type: "spring",
                duration: 0.5,
                bounce: 0,
                delay: 0.22,
              }}
              className="pointer-events-none absolute inset-0"
            >
              <OpacityBand
                base={base}
                alpha={alpha}
                onChange={applyAlpha}
              />
            </motion.div>
          )}
        </div>
      </div>
      {swatchHexes.length > 0 && (
        <TooltipProvider>
          <div className="flex items-center justify-between px-0.5">
            {swatchHexes.map(({ swatch, hex }) => (
              <Tooltip key={swatch.label}>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      aria-label={swatch.label}
                      aria-pressed={hex === base}
                      // A swatch is a choice of color, not of opacity, so
                      // whatever the arc is set to rides along.
                      onClick={() => applyHex(withAlpha(hex, alpha))}
                      className={cn(
                        "size-5 cursor-pointer rounded-full border border-foreground/15 transition-transform active:scale-90",
                        hex === base &&
                          "ring-2 ring-foreground ring-offset-2 ring-offset-popover"
                      )}
                      // The token, not the resolved hex, so the dot keeps
                      // tracking the theme while the popover is open.
                      style={{ background: swatch.value }}
                    />
                  }
                />
                <TooltipContent className="tabular-nums">
                  {swatch.label} · {hex}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      )}
      <InputGroup className="h-7 rounded-md border-0 bg-muted/70 transition-colors hover:bg-muted has-[[data-slot=input-group-control]:focus-visible]:ring-0 dark:bg-muted/70 dark:hover:bg-muted">
        <InputGroupAddon align="inline-start" className="ps-0.5 pe-0">
          <Select
            items={COLOR_FORMATS as { value: ColorFormat; label: string }[]}
            value={format}
            onValueChange={(next) => changeFormat(next as ColorFormat)}
          >
            <SelectTrigger
              aria-label="Color notation"
              className="h-5 w-auto cursor-pointer gap-0 rounded-sm border-0 bg-transparent px-0.5 py-0 text-[11px] font-medium text-muted-foreground shadow-none transition-colors hover:text-foreground focus-visible:ring-0 dark:bg-transparent dark:hover:bg-transparent [&_svg]:size-3"
            >
              <SelectValue className="text-[11px] font-medium" />
            </SelectTrigger>
            <SelectContent align="start" alignItemWithTrigger={false}>
              <SelectGroup>
                {COLOR_FORMATS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-[12px] font-medium"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </InputGroupAddon>
        <InputGroupInput
          value={state.draft}
          onChange={(e) =>
            setState((prev) => ({ ...prev, draft: e.target.value }))
          }
          onBlur={commitDraft}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur()
          }}
          aria-label={`Color value in ${format}`}
          spellCheck={false}
          autoComplete="off"
          className="h-7 px-0.5 text-end text-[11px] font-medium text-foreground/90 tabular-nums"
        />
        <InputGroupAddon align="inline-end" className="gap-0 ps-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                render={
                  <InputGroupButton
                    size="icon-xs"
                    aria-label={`Copy ${format} value`}
                    className="cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={copyValue}
                  />
                }
              >
                <HugeiconsIcon
                  aria-hidden
                  className="size-3.5"
                  icon={copied ? Tick02Icon : Copy01Icon}
                  strokeWidth={2}
                />
              </TooltipTrigger>
              <TooltipContent>{copied ? "Copied" : "Copy"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {eyeDropper && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <InputGroupButton
                      size="icon-xs"
                      aria-label="Pick a color from the screen"
                      className="cursor-pointer text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        new eyeDropper()
                          .open()
                          .then((result) => {
                            // What comes off the screen is always opaque, so
                            // the arc's setting is what decides alpha.
                            const hex = normalizeHex(result.sRGBHex)
                            if (hex) applyHex(withAlpha(hex, alpha))
                          })
                          .catch(() => {})
                      }}
                    />
                  }
                >
                  <HugeiconsIcon
                    aria-hidden
                    className="size-3.5"
                    icon={DropperIcon}
                    strokeWidth={2}
                  />
                </TooltipTrigger>
                <TooltipContent>Pick a color from the screen</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </InputGroupAddon>
      </InputGroup>
    </motion.div>,
    document.body
  )
}

/* --------------------------------------------------------------- picker */

export interface ColorPickerProps {
  /** Names the trigger for assistive tech, e.g. "Background". */
  label: string
  /** The current color as `#rrggbb`. */
  value: string
  onValueChange: (value: string) => void
  /** Text shown beside the swatch instead of the color value, e.g. "Auto". */
  displayValue?: string
  /** Hides the text beside the swatch, leaving just the dot. */
  hideValue?: boolean
  /** Notation the field opens in; the select switches it from there. */
  defaultFormat?: ColorFormat
  /** One-click colors under the wheel; defaults to the theme's own ramp. */
  swatches?: readonly ColorSwatch[]
  /**
   * Adds an opacity arc outside the brightness one. `value` then arrives as
   * `#rrggbbaa` whenever the color is not fully opaque — and stays plain
   * `#rrggbb` when it is, so nothing downstream has to learn a second shape.
   */
  opacity?: boolean
  className?: string
}

/**
 * A swatch that opens an Okhsv color wheel: hue and saturation on the disc,
 * brightness on the arc below it, opacity on a second arc outside that, plus a
 * hex/rgb/hsl/oklch field and an eyedropper.
 */
export function ColorPicker({
  label,
  value,
  onValueChange,
  displayValue,
  hideValue = false,
  defaultFormat = "hex",
  swatches = THEME_SWATCHES,
  opacity = false,
  className,
}: ColorPickerProps) {
  const [open, setOpen] = useState(false)
  // Held here so reopening the popover keeps the notation you last chose.
  const [format, setFormat] = useState<ColorFormat>(defaultFormat)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const popoverId = useId()

  const close = useCallback(() => {
    setOpen(false)
    toggleRef.current?.focus({ preventScroll: true })
  }, [])

  // The trigger reads in whatever notation the field is set to, so picking
  // RGB in the popover changes the row too — not just the field.
  const hex = normalizeHex(value)
  const formatted = hex ? formatColor(hex, format) : value

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={open ? popoverId : undefined}
        aria-label={`${label} color`}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex cursor-pointer items-center gap-2 transition-transform active:scale-95",
          className
        )}
      >
        {!hideValue && (
          <span
            className="text-[12.5px] font-medium text-muted-foreground"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {displayValue ?? formatted}
          </span>
        )}
        <span
          className={cn(
            "size-4.5 rounded-full border border-border/70",
            opacity && "text-foreground/20"
          )}
          // Two layers rather than one so a translucent value reads as
          // translucent; at full opacity the color hides the check entirely,
          // which is why the plain fill stays the default.
          style={
            opacity
              ? {
                  backgroundImage: `linear-gradient(${value}, ${value}), ${CHECKER_IMAGE}`,
                  backgroundSize: `auto, ${CHECKER_CELL}px ${CHECKER_CELL}px`,
                }
              : { background: value }
          }
        />
      </button>
      <AnimatePresence>
        {open && (
          <ColorPopover
            id={popoverId}
            anchorRef={toggleRef}
            value={value}
            onValueChange={onValueChange}
            onClose={close}
            format={format}
            onFormatChange={setFormat}
            swatches={swatches}
            opacity={opacity}
          />
        )}
      </AnimatePresence>
    </>
  )
}