"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

// Pixel robots that stroll along the bottom edge of a section (Vercel Ship
// style). Self-contained: styles ship in a hoisted <style> tag, and the walk
// keyframes use container-query units so bots traverse whatever container
// <AnimatedBots> is placed in. Give the parent `overflow-hidden` so bots
// enter and exit cleanly.
//
// Bots are interactive by default: hovering startles one mid-walk, clicking
// makes it hop and chirp a speech bubble (plus an 8-bit beep with `sound`),
// and walking bots mutter to themselves now and then. Pass
// `interactive={false}` for pure decoration.

const botStyles = `
@layer components {
  .bot {
    position: absolute;
    bottom: 0;
    left: 0;
    color: color-mix(in oklab, var(--foreground) 75%, transparent);
    will-change: transform;
  }

  .bot svg {
    display: block;
    overflow: visible;
  }

  .bot-idle {
    position: relative;
  }

  .bot-go-right {
    animation: bot-go-right var(--bot-duration, 45s) linear infinite;
    animation-delay: var(--bot-delay, 0s);
  }

  .bot-go-left {
    animation: bot-go-left var(--bot-duration, 45s) linear infinite;
    animation-delay: var(--bot-delay, 0s);
  }

  .bot-interactive {
    pointer-events: auto;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  /* Startle: freeze mid-stride, eyes wide, beacon panics. */
  .bot-interactive:hover {
    z-index: 1;
    animation-play-state: paused;
  }

  .bot-interactive:hover .bot-bob,
  .bot-interactive:hover .bot-leg {
    animation: none;
  }

  .bot-interactive:hover .bot-wheel {
    animation-play-state: paused;
  }

  .bot-interactive:hover .bot-eye {
    animation: none;
    transform: scale(1.3);
  }

  .bot-interactive:hover .bot-light {
    animation-duration: 0.3s;
  }

  .bot-bubble {
    position: absolute;
    bottom: calc(100% + 7px);
    left: 50%;
    translate: -50% 0;
    padding: 2px 5px;
    border: 1px solid currentColor;
    border-radius: 4px;
    background: var(--background);
    font-family: var(--font-mono, monospace);
    font-size: 9px;
    line-height: 1.2;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.15s;
  }

  .bot-bubble::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    width: 4px;
    height: 4px;
    translate: -50% -50%;
    rotate: 45deg;
    background: var(--background);
    border-right: 1px solid currentColor;
    border-bottom: 1px solid currentColor;
  }

  .bot-interactive:hover .bot-bubble,
  .bot-bubble.bot-bubble-show {
    opacity: 1;
  }

  .bot-hop {
    transform-origin: 50% 100%;
    animation: bot-hop 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);
  }

  .bot-bob {
    animation: bot-bob 0.6s linear infinite;
  }

  .bot-leg,
  .bot-eye,
  .bot-light,
  .bot-wheel {
    transform-box: fill-box;
    transform-origin: center;
  }

  .bot-leg-a {
    animation: bot-step 0.5s linear infinite;
  }

  .bot-leg-b {
    animation: bot-step 0.5s linear infinite;
    animation-delay: -0.25s;
  }

  .bot-eye {
    animation: bot-blink 4.4s linear infinite;
  }

  .bot-light {
    animation: bot-beacon 1.4s linear infinite;
  }

  .bot-wheel {
    animation: bot-roll 1.6s linear infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .bot,
    .bot * {
      animation: none !important;
    }
    .bot-go-right,
    .bot-go-left {
      transform: translateX(var(--bot-rest, 20cqw));
    }
  }
}

@keyframes bot-go-right {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(100cqw);
  }
}

@keyframes bot-go-left {
  from {
    transform: translateX(100cqw);
  }
  to {
    transform: translateX(-100%);
  }
}

@keyframes bot-hop {
  0% {
    transform: translateY(0);
  }
  35% {
    transform: translateY(-8px);
  }
  62% {
    transform: translateY(0);
  }
  78% {
    transform: translateY(0) scaleY(0.9);
  }
  100% {
    transform: translateY(0) scaleY(1);
  }
}

@keyframes bot-bob {
  0%,
  49.9% {
    transform: translateY(0);
  }
  50%,
  100% {
    transform: translateY(-1px);
  }
}

@keyframes bot-step {
  0%,
  49.9% {
    transform: translateY(0);
  }
  50%,
  100% {
    transform: translateY(-2px);
  }
}

@keyframes bot-blink {
  0%,
  91%,
  97%,
  100% {
    transform: scaleY(1);
  }
  93%,
  95% {
    transform: scaleY(0.15);
  }
}

@keyframes bot-beacon {
  0%,
  49.9% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0.25;
  }
}

@keyframes bot-roll {
  to {
    transform: rotate(360deg);
  }
}
`

function BotStyles() {
  return (
    <style href="animated-bots" precedence="default">
      {botStyles}
    </style>
  )
}

const chirps = ["beep!", "boop.", "brrt?", "*whirr*", "01101", "bzzt!", "♥"]

function pickChirp(not?: string | null) {
  const pool = chirps.filter((c) => c !== not)
  return pool[Math.floor(Math.random() * pool.length)]
}

// Lazy shared AudioContext; created on first click so it's gesture-safe.
let audioContext: AudioContext | null = null

function beep() {
  try {
    audioContext ??= new AudioContext()
    if (audioContext.state === "suspended") void audioContext.resume()
    const t = audioContext.currentTime
    const base = 420 + Math.random() * 360
    const notes: [number, number][] = [
      [base, 0],
      [base * (Math.random() < 0.5 ? 1.5 : 0.75), 0.085],
    ]
    for (const [frequency, offset] of notes) {
      const osc = audioContext.createOscillator()
      const gain = audioContext.createGain()
      osc.type = "square"
      osc.frequency.value = frequency
      gain.gain.setValueAtTime(0.04, t + offset)
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.07)
      osc.connect(gain).connect(audioContext.destination)
      osc.start(t + offset)
      osc.stop(t + offset + 0.08)
    }
  } catch {
    // No audio available — bots chirp silently.
  }
}

interface BotProps {
  /** Time to cross the container once, e.g. `"45s"`. */
  duration?: string
  /** Negative delays start mid-walk, e.g. `"-12s"`. */
  delay?: string
  /** Standing position when `prefers-reduced-motion`, e.g. `"20cqw"`. */
  rest?: string
  facing?: "right" | "left"
  /** Set to `false` to march in place instead of crossing the container. */
  walk?: boolean
  /** Hover startles, click hops and chirps. `false` for pure decoration. */
  interactive?: boolean
  /** Play an 8-bit beep on click. */
  sound?: boolean
  children: React.ReactNode
}

function Bot({
  duration,
  delay,
  rest,
  facing = "right",
  walk = true,
  interactive = true,
  sound = false,
  children,
}: BotProps) {
  const [emote, setEmote] = useState<string | null>(null)
  const [hopping, setHopping] = useState(false)

  useEffect(() => {
    if (emote === null) return
    const timer = setTimeout(() => setEmote(null), 1400)
    return () => clearTimeout(timer)
  }, [emote])

  // Walking bots mutter to themselves every so often.
  useEffect(() => {
    if (!interactive) return
    let timer: ReturnType<typeof setTimeout>
    const schedule = () => {
      timer = setTimeout(
        () => {
          setEmote((current) => pickChirp(current))
          schedule()
        },
        8000 + Math.random() * 10000
      )
    }
    schedule()
    return () => clearTimeout(timer)
  }, [interactive])

  return (
    <div
      className={cn(
        "bot",
        walk
          ? facing === "right"
            ? "bot-go-right"
            : "bot-go-left"
          : "bot-idle",
        interactive && "bot-interactive"
      )}
      style={
        {
          "--bot-duration": duration,
          "--bot-delay": delay,
          "--bot-rest": rest,
        } as React.CSSProperties
      }
      onClick={
        interactive
          ? () => {
              setEmote((current) => pickChirp(current))
              setHopping(true)
              if (sound) beep()
            }
          : undefined
      }
    >
      <BotStyles />
      {interactive && (
        <div className={cn("bot-bubble", emote && "bot-bubble-show")}>
          {emote ?? "!"}
        </div>
      )}
      <div className={facing === "left" ? "-scale-x-100" : undefined}>
        <div
          className={hopping ? "bot-hop" : undefined}
          onAnimationEnd={() => setHopping(false)}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

function CarrierBot() {
  return (
    <svg width="44" height="36" viewBox="0 0 44 36" aria-hidden="true">
      <g className="bot-bob">
        <g fill="currentColor" shapeRendering="crispEdges">
          <rect x="19" y="2" width="2" height="4" />
          <rect className="bot-light" x="17.5" y="0" width="5" height="2.5" />
          <rect x="13" y="6" width="14" height="9" rx="1" />
          <rect x="18" y="15" width="4" height="2" />
          <rect x="11" y="17" width="18" height="11" rx="1" />
          <rect x="29" y="20" width="5" height="2.5" />
          <rect x="33" y="13" width="10" height="10" rx="1" />
        </g>
        <g fill="var(--background)">
          <rect className="bot-eye" x="17" y="9" width="2.5" height="3" />
          <rect className="bot-eye" x="21.5" y="9" width="2.5" height="3" />
          <rect x="14" y="20" width="5" height="1.5" opacity="0.6" />
          <rect x="14" y="23" width="3" height="1.5" opacity="0.6" />
          <rect x="37.5" y="13" width="1.5" height="10" opacity="0.6" />
        </g>
      </g>
      <g fill="currentColor" shapeRendering="crispEdges">
        <rect
          className="bot-leg bot-leg-a"
          x="14"
          y="28"
          width="4"
          height="8"
        />
        <rect
          className="bot-leg bot-leg-b"
          x="22"
          y="28"
          width="4"
          height="8"
        />
      </g>
    </svg>
  )
}

function RollerBot() {
  return (
    <svg width="32" height="36" viewBox="0 0 32 36" aria-hidden="true">
      <g className="bot-bob">
        <g fill="currentColor" shapeRendering="crispEdges">
          <rect x="15" y="4" width="2" height="4" />
          <rect className="bot-light" x="13.5" y="2" width="5" height="2.5" />
          <rect x="8" y="8" width="16" height="12" rx="2" />
          <rect x="14" y="20" width="4" height="4" />
        </g>
        <g fill="var(--background)">
          <rect className="bot-eye" x="12" y="12" width="3" height="4" />
          <rect className="bot-eye" x="17" y="12" width="3" height="4" />
        </g>
      </g>
      <circle
        className="bot-wheel"
        cx="16"
        cy="29"
        r="5.75"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeDasharray="4.5 4.5"
      />
      <circle cx="16" cy="29" r="1.75" fill="currentColor" />
    </svg>
  )
}

function ScoutBot() {
  return (
    <svg width="24" height="28" viewBox="0 0 24 28" aria-hidden="true">
      <g className="bot-bob">
        <g fill="currentColor" shapeRendering="crispEdges">
          <rect x="11" y="2" width="2" height="4" />
          <rect className="bot-light" x="9.5" y="0" width="5" height="2.5" />
          <rect x="6" y="6" width="12" height="14" rx="1" />
        </g>
        <g fill="var(--background)">
          <rect className="bot-eye" x="9" y="10" width="2.5" height="3" />
          <rect className="bot-eye" x="13" y="10" width="2.5" height="3" />
        </g>
      </g>
      <g fill="currentColor" shapeRendering="crispEdges">
        <rect className="bot-leg bot-leg-a" x="8" y="20" width="3" height="8" />
        <rect
          className="bot-leg bot-leg-b"
          x="13"
          y="20"
          width="3"
          height="8"
        />
      </g>
    </svg>
  )
}

interface AnimatedBotsProps {
  className?: string
  /** Applied to the default scene's bots. */
  interactive?: boolean
  /** Applied to the default scene's bots. */
  sound?: boolean
  /** Compose a scene from `<Bot>` children; omit for the default scene. */
  children?: React.ReactNode
}

function AnimatedBots({
  className,
  interactive = true,
  sound = false,
  children,
}: AnimatedBotsProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "@container pointer-events-none absolute inset-x-0 bottom-0",
        className
      )}
    >
      <BotStyles />
      {children ?? (
        <>
          <Bot
            duration="48s"
            delay="-16s"
            rest="26cqw"
            interactive={interactive}
            sound={sound}
          >
            <CarrierBot />
          </Bot>
          <Bot
            duration="34s"
            delay="-6s"
            rest="58cqw"
            interactive={interactive}
            sound={sound}
          >
            <ScoutBot />
          </Bot>
          <Bot
            duration="70s"
            delay="-32s"
            rest="78cqw"
            facing="left"
            interactive={interactive}
            sound={sound}
          >
            <RollerBot />
          </Bot>
        </>
      )}
    </div>
  )
}

export { AnimatedBots, Bot, CarrierBot, RollerBot, ScoutBot }
