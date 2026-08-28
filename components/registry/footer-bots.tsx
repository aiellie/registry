"use client"

import { useEffect, useRef, useState } from "react"

import {
  Bot,
  CarrierBot,
  RollerBot,
  ScoutBot,
} from "@/components/animations/animated-bots"
import { cn } from "@/lib/utils"

// Bots that patrol the footer bar, climbing over the readouts instead of
// walking behind them. The skyline is measured from the real boxes — the
// latency and clock readouts change width as their values tick, and the
// copyright drops its tail below `sm` — so the path is rebuilt whenever the
// footer or any readout resizes.

/** Readouts to climb, tagged in the footer markup. */
const STEP = "[data-bot-step]"
/** Gap kept between a readout's box and the plateau the bots stand on. */
const CLEARANCE = 2
/** How far past each edge the walk starts and ends, so bots enter offscreen. */
const MARGIN = 60
/**
 * Sprites are drawn at 24–44px for a full-height section. In the footer a bot
 * has to fit between a readout's cap line and the top edge, which is what sets
 * the bar's height — below ~16px the pixel art stops reading as a robot.
 */
const SCALE = 0.5

const CREW = [
  {
    Sprite: CarrierBot,
    height: 36,
    duration: "78s",
    delay: "-12s",
    rest: "22%",
  },
  { Sprite: ScoutBot, height: 28, duration: "54s", delay: "-31s", rest: "54%" },
  {
    Sprite: RollerBot,
    height: 36,
    duration: "96s",
    delay: "-58s",
    rest: "77%",
    facing: "left" as const,
  },
]

type Step = { left: number; right: number; top: number }
type Lane = { width: number; height: number; steps: Step[] }

/**
 * A floor-level walk that ramps up onto each readout and back down. Ramps run
 * as far as they rise, so the climb sits at 45° whatever the bar's height, and
 * plateaus are clamped so a bot's head never leaves the bar. Readouts close
 * enough that their ramps would collide merge into one ledge.
 */
function buildPath({ width, height, steps }: Lane, botHeight: number) {
  const plateaus: { from: number; to: number; y: number }[] = []

  for (const step of [...steps].sort((a, b) => a.left - b.left)) {
    const next = {
      from: step.left,
      to: step.right,
      y: Math.max(step.top - CLEARANCE, botHeight),
    }
    const last = plateaus.at(-1)
    const ramp = last ? height - Math.min(last.y, next.y) : 0

    if (last && next.from - last.to <= ramp * 2) {
      last.to = Math.max(last.to, next.to)
      last.y = Math.min(last.y, next.y)
    } else {
      plateaus.push(next)
    }
  }

  const d: string[] = []

  for (const p of plateaus) {
    const ramp = height - p.y
    d.push(
      `L ${p.from - ramp} ${height}`,
      `L ${p.from} ${p.y}`,
      `L ${p.to} ${p.y}`,
      `L ${p.to + ramp} ${height}`
    )
  }

  // Start and end offscreen, never behind the first ramp's foot.
  const first = plateaus[0]
  const last = plateaus.at(-1)
  const start = Math.min(-MARGIN, first ? first.from - (height - first.y) : 0)
  const end = Math.max(width + MARGIN, last ? last.to + (height - last.y) : 0)

  return [`M ${start} ${height}`, ...d, `L ${end} ${height}`].join(" ")
}

function isSameLane(a: Lane | null, b: Lane): a is Lane {
  return (
    a !== null &&
    a.width === b.width &&
    a.height === b.height &&
    a.steps.length === b.steps.length &&
    a.steps.every(
      (step, i) =>
        step.left === b.steps[i].left &&
        step.right === b.steps[i].right &&
        step.top === b.steps[i].top
    )
  )
}

export function FooterBots({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [lane, setLane] = useState<Lane | null>(null)

  useEffect(() => {
    const el = ref.current
    const footer = el?.parentElement
    if (!el || !footer) return

    const measure = () => {
      const base = el.getBoundingClientRect()
      // Nothing to measure against until the first paint; the observer fires
      // again once the bar has a size.
      if (base.width === 0 || base.height === 0) return

      const steps = [...footer.querySelectorAll(STEP)].map((step) => {
        const box = step.getBoundingClientRect()
        return {
          left: Math.round(box.left - base.left),
          right: Math.round(box.right - base.left),
          top: Math.round(box.top - base.top),
        }
      })

      const next = {
        width: Math.round(base.width),
        height: Math.round(base.height),
        steps,
      }

      // Rounded, so a sub-pixel reflow can't ping-pong the observer.
      setLane((current) => (isSameLane(current, next) ? current : next))
    }

    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(footer)
    for (const step of footer.querySelectorAll(STEP)) observer.observe(step)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      {lane &&
        CREW.map(({ Sprite, height, ...bot }, i) => (
          <Bot key={i} path={buildPath(lane, height * SCALE)} sound {...bot}>
            <div className="origin-bottom" style={{ scale: String(SCALE) }}>
              <Sprite />
            </div>
          </Bot>
        ))}
    </div>
  )
}
