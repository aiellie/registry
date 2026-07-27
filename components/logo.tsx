import { useId, type ComponentProps, type ElementType } from "react";

import { cn } from "@/lib/utils";

function ElephantMark({
  orb,
  shade,
  spec,
  wink = false,
}: {
  orb: string;
  shade: string;
  spec: string;
  wink?: boolean;
}) {
  return (
    <>
      {/* Ears */}
      <path
        d="M30 42C18 30 6 34 4 48c-2 14 8 26 22 28 4-10 6-18 6-26 0-4-1-6-2-8Z"
        fill={`url(#${orb})`}
      />
      <path
        d="M70 42C82 30 94 34 96 48c2 14-8 26-22 28-4-10-6-18-6-26 0-4 1-6 2-8Z"
        fill={`url(#${orb})`}
      />
      <path
        d="M30 42C18 30 6 34 4 48c-2 14 8 26 22 28 4-10 6-18 6-26 0-4-1-6-2-8Z"
        fill={`url(#${shade})`}
      />
      <path
        d="M70 42C82 30 94 34 96 48c2 14-8 26-22 28-4-10-6-18-6-26 0-4 1-6 2-8Z"
        fill={`url(#${shade})`}
      />

      {/* Head */}
      <ellipse cx="50" cy="46" rx="30" ry="28" fill={`url(#${orb})`} />
      <ellipse cx="50" cy="46" rx="30" ry="28" fill={`url(#${shade})`} />
      <ellipse cx="50" cy="46" rx="30" ry="28" fill={`url(#${spec})`} />

      {/* Inner ear detail */}
      <path
        d="M26 48c-6-6-12-4-13 4-1 8 5 14 12 14 2-6 3-12 1-18Z"
        fill="#2a1f57"
        fillOpacity={0.12}
      />
      <path
        d="M74 48c6-6 12-4 13 4 1 8-5 14-12 14-2-6-3-12-1-18Z"
        fill="#2a1f57"
        fillOpacity={0.12}
      />

      {/* Trunk */}
      <path
        d="M42 66c-1 8-6 14-4 22 2 7 12 8 14 2 1-5-1-9-1-14 0-4 3-7 6-8"
        fill="none"
        stroke={`url(#${orb})`}
        strokeWidth={11}
        strokeLinecap="round"
      />
      <path
        d="M42 66c-1 8-6 14-4 22 2 7 12 8 14 2 1-5-1-9-1-14 0-4 3-7 6-8"
        fill="none"
        stroke={`url(#${shade})`}
        strokeWidth={11}
        strokeLinecap="round"
      />
      <path
        d="M42 66c-1 8-6 14-4 22 2 7 12 8 14 2 1-5-1-9-1-14 0-4 3-7 6-8"
        fill="none"
        stroke="#2a1f57"
        strokeOpacity={0.18}
        strokeWidth={3.5}
        strokeLinecap="round"
      />

      {/* Eyes */}
      {wink ? (
        <>
          <ellipse cx="38" cy="46" rx="4.2" ry="5.4" fill="#2a1f57" />
          <circle
            cx="36.4"
            cy="43.6"
            r="1.35"
            fill="#ffffff"
            fillOpacity={0.92}
          />
          <path
            d="M54 47q6-5 12 0"
            fill="none"
            stroke="#2a1f57"
            strokeWidth={3.6}
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <g fill="#2a1f57">
            <ellipse cx="38" cy="46" rx="4.2" ry="5.4" />
            <ellipse cx="62" cy="46" rx="4.2" ry="5.4" />
          </g>
          <g fill="#ffffff" fillOpacity={0.92}>
            <circle cx="36.4" cy="43.6" r="1.35" />
            <circle cx="60.4" cy="43.6" r="1.35" />
          </g>
        </>
      )}
    </>
  );
}

export function LogoIcon({
  className,
  ...props
}: ComponentProps<"svg">) {
  const id = useId().replace(/:/g, "");
  const orb = `${id}-orb`;
  const shade = `${id}-shade`;
  const spec = `${id}-spec`;
  const orbBw = `${id}-orb-bw`;
  const shadeBw = `${id}-shade-bw`;
  const specBw = `${id}-spec-bw`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={cn("size-8 shrink-0", className)}
      {...props}
    >
      <defs>
        <radialGradient id={orb} cx="36%" cy="30%" r="74%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="20%" stopColor="#fce7f3" />
          <stop offset="46%" stopColor="#e9d5ff" />
          <stop offset="73%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#a5b4fc" />
        </radialGradient>
        <radialGradient id={shade} cx="30%" cy="80%" r="58%">
          <stop offset="58%" stopColor="#8b7ff0" stopOpacity={0} />
          <stop offset="100%" stopColor="#7d6fe8" stopOpacity={0.42} />
        </radialGradient>
        <radialGradient id={spec} cx="68%" cy="22%" r="26%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.95} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={orbBw} cx="36%" cy="30%" r="74%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="34%" stopColor="#e4e4e7" />
          <stop offset="70%" stopColor="#a1a1aa" />
          <stop offset="100%" stopColor="#52525b" />
        </radialGradient>
        <radialGradient id={shadeBw} cx="30%" cy="82%" r="58%">
          <stop offset="54%" stopColor="#18181b" stopOpacity={0} />
          <stop offset="100%" stopColor="#18181b" stopOpacity={0.45} />
        </radialGradient>
        <radialGradient id={specBw} cx="68%" cy="22%" r="26%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.95} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
        </radialGradient>
      </defs>

      <g className="group-hover:hidden dark:hidden">
        <ElephantMark orb={orb} shade={shade} spec={spec} />
      </g>

      <g className="hidden group-hover:block dark:group-hover:hidden">
        <ElephantMark orb={orb} shade={shade} spec={spec} wink />
      </g>

      <g className="hidden dark:block dark:group-hover:hidden">
        <ElephantMark orb={orbBw} shade={shadeBw} spec={specBw} />
      </g>

      <g className="hidden dark:group-hover:block">
        <ElephantMark orb={orbBw} shade={shadeBw} spec={specBw} wink />
      </g>
    </svg>
  );
}

export function LogoOutline({
  className,
  ...props
}: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-8 shrink-0", className)}
      aria-hidden="true"
      {...props}
    >
      {/* Ears */}
      <path
        d="M30 42C18 30 6 34 4 48c-2 14 8 26 22 28 4-10 6-18 6-26 0-4-1-6-2-8Z"
        strokeWidth={1.5}
      />
      <path
        d="M70 42C82 30 94 34 96 48c2 14-8 26-22 28-4-10-6-18-6-26 0-4 1-6 2-8Z"
        strokeWidth={1.5}
      />
      {/* Head */}
      <ellipse cx="50" cy="46" rx="30" ry="28" strokeWidth={1.5} />
      {/* Trunk */}
      <path
        d="M42 66c-1 8-6 14-4 22 2 7 12 8 14 2 1-5-1-9-1-14 0-4 3-7 6-8"
        strokeWidth={1.5}
      />
      {/* Eyes */}
      <ellipse cx="38" cy="46" rx="4.2" ry="5.4" strokeWidth={1.5} />
      <ellipse cx="62" cy="46" rx="4.2" ry="5.4" strokeWidth={1.5} />
    </svg>
  );
}

export function LogoWordmark({
  as: Comp = "span",
  className,
}: {
  as?: ElementType;
  className?: string;
}) {
  return (
    <Comp
      className={cn("flex items-baseline tracking-tight", className)}
    >
      <span className="bg-gradient-to-br from-white via-[#e9d5ff] to-[#7d6fe8] bg-clip-text text-transparent dark:from-zinc-50 dark:via-zinc-300 dark:to-zinc-500">
        AI
      </span>
      <span className="bg-gradient-to-b from-[#2a1f57] to-[#6d5fd6] bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
        Ellie
      </span>
    </Comp>
  );
}

export function Logo() {
  return (
    <div className="group flex items-center gap-2">
      <LogoIcon role="img" aria-label="Brand logo" />
      <LogoWordmark as="h1" className="text-[1.05rem] font-bold" />
    </div>
  );
}
