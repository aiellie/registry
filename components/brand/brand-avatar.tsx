import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

/** Face ink — same navy as the logo eyes. */
const INK = "#2a1f57"

export const brandAvatarStates = [
  "awake",
  "happy",
  "winking",
  "blushing",
  "grumpy",
  "sleeping",
  "yawning",
  "startled",
  "dizzy",
] as const

export type BrandAvatarState = (typeof brandAvatarStates)[number]

/* Animations live in a shared stylesheet the component injects once per
 * instance (duplicates are identical, so later copies are no-ops). Motion is
 * gated behind `prefers-reduced-motion`, so the avatar is a still face for
 * anyone who asked for stillness. */
const css = `
.ba-vb{transform-box:view-box;transform-origin:50% 50%}
.ba-fb{transform-box:fill-box;transform-origin:center}
@media (prefers-reduced-motion:no-preference){
.ba-breathe{animation:ba-breathe 3.6s ease-in-out infinite}
.ba-breathe-slow{animation:ba-breathe 5.4s ease-in-out infinite}
.ba-blink{animation:ba-blink 4.6s linear infinite}
.ba-wobble{animation:ba-wobble .62s ease-in-out infinite}
.ba-pop{animation:ba-pop .5s cubic-bezier(.34,1.56,.64,1) both}
.ba-yawn{animation:ba-yawn 3.2s ease-in-out infinite}
.ba-z1{animation:ba-zzz 2.6s ease-out infinite}
.ba-z2{animation:ba-zzz 2.6s ease-out .85s infinite}
.ba-z3{animation:ba-zzz 2.6s ease-out 1.7s infinite}
}
@keyframes ba-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.025)}}
@keyframes ba-blink{0%,91.5%,97%,100%{transform:scaleY(1)}93.5%,95%{transform:scaleY(.12)}}
@keyframes ba-wobble{0%,100%{transform:rotate(0deg) translateX(0)}25%{transform:rotate(-2.4deg) translateX(-1.4px)}75%{transform:rotate(2.4deg) translateX(1.4px)}}
@keyframes ba-pop{0%{transform:scale(.88)}60%{transform:scale(1.07)}100%{transform:scale(1)}}
@keyframes ba-yawn{0%,15%,100%{transform:scale(.62)}45%,65%{transform:scale(1)}}
@keyframes ba-zzz{0%{opacity:0;transform:translateY(2.5px)}30%{opacity:.95}100%{opacity:0;transform:translateY(-6.5px)}}
`

function OpenEye({ cx, wide = false }: { cx: number; wide?: boolean }) {
  return (
    <>
      <ellipse
        cx={cx}
        cy={53}
        rx={wide ? 5.7 : 5}
        ry={wide ? 7.8 : 6.4}
        fill={INK}
      />
      <circle
        cx={cx - 1.9}
        cy={50}
        r={wide ? 1.9 : 1.6}
        fill="#ffffff"
        fillOpacity={0.92}
      />
    </>
  )
}

/** `up` is the happy ∩ arc (the logo's wink), `down` the sleeping ∪ arc. */
function ArcEye({ cx, dir }: { cx: number; dir: "up" | "down" }) {
  const d =
    dir === "up"
      ? `M${cx - 7} 54 Q${cx} 49 ${cx + 7} 54`
      : `M${cx - 7} 52 Q${cx} 58 ${cx + 7} 52`
  return (
    <path
      d={d}
      fill="none"
      stroke={INK}
      strokeWidth={4}
      strokeLinecap="round"
    />
  )
}

/** The &gt;&lt; squeeze — both tips point at the nose. */
function SqueezeEye({ cx }: { cx: number }) {
  const inward = cx < 50 ? 1 : -1
  const back = cx - inward * 5
  const tip = cx + inward * 2.2
  return (
    <path
      d={`M${back} 48.8 L${tip} 53 L${back} 57.2`}
      fill="none"
      stroke={INK}
      strokeWidth={3.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  )
}

/** Half-lidded, unimpressed. A flat lid over a drooped pupil. */
function GrumpyEye({ cx }: { cx: number }) {
  return (
    <>
      <ellipse cx={cx} cy={54} rx={5} ry={3.2} fill={INK} />
      <line
        x1={cx - 5.4}
        y1={51.4}
        x2={cx + 5.4}
        y2={51.4}
        stroke={INK}
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <circle cx={cx - 1.9} cy={52.8} r={1.1} fill="#ffffff" fillOpacity={0.7} />
    </>
  )
}

function Blush() {
  return (
    <g fill="#f0abfc" fillOpacity={0.45}>
      <ellipse cx={29} cy={59.5} rx={7.4} ry={4} />
      <ellipse cx={71} cy={59.5} rx={7.4} ry={4} />
    </g>
  )
}

function Zzz() {
  return (
    <g
      className="fill-[#7c80f2] font-mono dark:fill-[#a1a1aa]"
      fontWeight={600}
      aria-hidden="true"
    >
      <text className="ba-z1" x={72} y={31} fontSize={8}>
        z
      </text>
      <text className="ba-z2" x={79} y={24} fontSize={10.5}>
        z
      </text>
      <text className="ba-z3" x={87} y={17} fontSize={13}>
        Z
      </text>
    </g>
  )
}

function Face({ state }: { state: BrandAvatarState }) {
  switch (state) {
    case "happy":
      return (
        <g>
          <ArcEye cx={40} dir="up" />
          <ArcEye cx={60} dir="up" />
        </g>
      )
    case "winking":
      return (
        <g>
          <OpenEye cx={40} />
          <ArcEye cx={60} dir="up" />
          <Blush />
        </g>
      )
    case "blushing":
      return (
        <g>
          <OpenEye cx={40} />
          <OpenEye cx={60} />
          <Blush />
        </g>
      )
    case "grumpy":
      return (
        <g>
          <GrumpyEye cx={40} />
          <GrumpyEye cx={60} />
        </g>
      )
    case "sleeping":
      return (
        <g>
          <ArcEye cx={40} dir="down" />
          <ArcEye cx={60} dir="down" />
          <Zzz />
        </g>
      )
    case "yawning":
      return (
        <g>
          <ArcEye cx={40} dir="down" />
          <ArcEye cx={60} dir="down" />
          <ellipse
            className="ba-yawn ba-fb"
            cx={50}
            cy={69.5}
            rx={5.8}
            ry={7.6}
            fill={INK}
            fillOpacity={0.92}
          />
        </g>
      )
    case "startled":
      return (
        <g>
          <OpenEye cx={40} wide />
          <OpenEye cx={60} wide />
          <circle
            cx={50}
            cy={69.5}
            r={3.2}
            fill="none"
            stroke={INK}
            strokeWidth={1.9}
          />
        </g>
      )
    case "dizzy":
      return (
        <g>
          <SqueezeEye cx={40} />
          <SqueezeEye cx={60} />
          <Blush />
        </g>
      )
    default:
      return (
        <g className="ba-blink ba-fb">
          <OpenEye cx={40} />
          <OpenEye cx={60} />
        </g>
      )
  }
}

/** Per-state body language on top of the shared breathing. */
const MOTION: Partial<Record<BrandAvatarState, string>> = {
  dizzy: "ba-wobble",
  startled: "ba-pop",
}

const SLOW_BREATH: BrandAvatarState[] = ["sleeping", "yawning"]

/**
 * The aiellie orb as an expressive avatar. Same geometry and palette as
 * `LogoIcon` (colour in light mode, zinc in dark), plus a `state` that swaps
 * the face: she blinks while awake, floats Zzz while sleeping, wobbles when
 * dizzy. Size it with `className` (`size-8` by default), like the logo.
 */
export function BrandAvatar({
  state = "awake",
  className,
  ...props
}: ComponentProps<"svg"> & {
  state?: BrandAvatarState
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      role="img"
      aria-label={`aiellie — ${state}`}
      className={cn("size-8 shrink-0 overflow-visible", className)}
      {...props}
    >
      <style>{css}</style>
      <defs>
        <radialGradient id="ba-orb" cx="36%" cy="30%" r="74%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="20%" stopColor="#fce7f3" />
          <stop offset="46%" stopColor="#e9d5ff" />
          <stop offset="73%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#a5b4fc" />
        </radialGradient>
        <radialGradient id="ba-shade" cx="30%" cy="80%" r="58%">
          <stop offset="58%" stopColor="#8b7ff0" stopOpacity={0} />
          <stop offset="100%" stopColor="#7d6fe8" stopOpacity={0.42} />
        </radialGradient>
        <radialGradient id="ba-spec" cx="68%" cy="22%" r="26%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.95} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="ba-orb-bw" cx="36%" cy="30%" r="74%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="34%" stopColor="#e4e4e7" />
          <stop offset="70%" stopColor="#a1a1aa" />
          <stop offset="100%" stopColor="#52525b" />
        </radialGradient>
        <radialGradient id="ba-shade-bw" cx="30%" cy="82%" r="58%">
          <stop offset="54%" stopColor="#18181b" stopOpacity={0} />
          <stop offset="100%" stopColor="#18181b" stopOpacity={0.45} />
        </radialGradient>
        <radialGradient id="ba-spec-bw" cx="68%" cy="22%" r="26%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.95} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
        </radialGradient>
      </defs>

      <g className={cn("ba-vb", MOTION[state])}>
        <g
          className={cn(
            "ba-vb",
            SLOW_BREATH.includes(state) ? "ba-breathe-slow" : "ba-breathe"
          )}
        >
          <g className="dark:hidden">
            <circle cx="50" cy="50" r="48" fill="url(#ba-orb)" />
            <circle cx="50" cy="50" r="48" fill="url(#ba-shade)" />
            <circle cx="50" cy="50" r="48" fill="url(#ba-spec)" />
          </g>
          <g className="hidden dark:block">
            <circle cx="50" cy="50" r="48" fill="url(#ba-orb-bw)" />
            <circle cx="50" cy="50" r="48" fill="url(#ba-shade-bw)" />
            <circle cx="50" cy="50" r="48" fill="url(#ba-spec-bw)" />
          </g>
          <Face state={state} />
        </g>
      </g>
    </svg>
  )
}
