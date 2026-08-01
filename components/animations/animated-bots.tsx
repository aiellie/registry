import { cn } from "@/lib/utils"

// Pixel robots that stroll along the bottom edge of a section (Vercel Ship
// style). Self-contained: styles ship in a hoisted <style> tag, and the walk
// keyframes use container-query units so bots traverse whatever container
// <AnimatedBots> is placed in. Give the parent `overflow-hidden` so bots
// enter and exit cleanly.

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
    position: static;
  }

  .bot-go-right {
    animation: bot-go-right var(--bot-duration, 45s) linear infinite;
    animation-delay: var(--bot-delay, 0s);
  }

  .bot-go-left {
    animation: bot-go-left var(--bot-duration, 45s) linear infinite;
    animation-delay: var(--bot-delay, 0s);
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
  children: React.ReactNode
}

function Bot({
  duration,
  delay,
  rest,
  facing = "right",
  walk = true,
  children,
}: BotProps) {
  return (
    <div
      className={cn(
        "bot",
        walk
          ? facing === "right"
            ? "bot-go-right"
            : "bot-go-left"
          : "bot-idle"
      )}
      style={
        {
          "--bot-duration": duration,
          "--bot-delay": delay,
          "--bot-rest": rest,
        } as React.CSSProperties
      }
    >
      <BotStyles />
      <div className={facing === "left" ? "-scale-x-100" : undefined}>
        {children}
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
  /** Compose a scene from `<Bot>` children; omit for the default scene. */
  children?: React.ReactNode
}

function AnimatedBots({ className, children }: AnimatedBotsProps) {
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
          <Bot duration="48s" delay="-16s" rest="26cqw">
            <CarrierBot />
          </Bot>
          <Bot duration="34s" delay="-6s" rest="58cqw">
            <ScoutBot />
          </Bot>
          <Bot duration="70s" delay="-32s" rest="78cqw" facing="left">
            <RollerBot />
          </Bot>
        </>
      )}
    </div>
  )
}

export { AnimatedBots, Bot, CarrierBot, RollerBot, ScoutBot }
