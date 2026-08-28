import { useId, type ComponentProps, type ElementType } from "react"

import { cn } from "@/lib/utils"

export function LogoIcon({ className, ...props }: ComponentProps<"svg">) {
  const id = useId().replace(/:/g, "")
  const orb = `${id}-orb`
  const shade = `${id}-shade`
  const spec = `${id}-spec`
  const orbBw = `${id}-orb-bw`
  const shadeBw = `${id}-shade-bw`
  const specBw = `${id}-spec-bw`
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
        <circle cx="50" cy="50" r="48" fill={`url(#${orb})`} />
        <circle cx="50" cy="50" r="48" fill={`url(#${shade})`} />
        <circle cx="50" cy="50" r="48" fill={`url(#${spec})`} />
        <g fill="#2a1f57">
          <ellipse cx="40" cy="53" rx="5" ry="6.4" />
          <ellipse cx="60" cy="53" rx="5" ry="6.4" />
        </g>
        <g fill="#ffffff" fillOpacity={0.92}>
          <circle cx="38.1" cy="50" r="1.6" />
          <circle cx="58.1" cy="50" r="1.6" />
        </g>
      </g>
      <g className="hidden group-hover:block dark:group-hover:hidden">
        <circle cx="50" cy="50" r="48" fill={`url(#${orb})`} />
        <circle cx="50" cy="50" r="48" fill={`url(#${shade})`} />
        <circle cx="50" cy="50" r="48" fill={`url(#${spec})`} />
        <ellipse cx="40" cy="53" rx="5" ry="6.4" fill="#2a1f57" />
        <circle cx="38.1" cy="50" r="1.6" fill="#ffffff" fillOpacity={0.92} />
        <path
          d="M53 54 Q60 49 67 54"
          fill="none"
          stroke="#2a1f57"
          strokeWidth={4}
          strokeLinecap="round"
        />
      </g>
      <g className="hidden dark:block">
        <circle cx="50" cy="50" r="48" fill={`url(#${orbBw})`} />
        <circle cx="50" cy="50" r="48" fill={`url(#${shadeBw})`} />
        <circle cx="50" cy="50" r="48" fill={`url(#${specBw})`} />
        <g fill="none" stroke="#18181b" strokeWidth={4} strokeLinecap="round">
          <path d="M33 56 Q40 48 47 56" />
          <path d="M53 56 Q60 48 67 56" />
        </g>
      </g>
    </svg>
  )
}

export function LogoWordmark({
  as: Comp = "span",
  className,
}: {
  as?: ElementType
  className?: string
}) {
  return (
    <Comp className={cn("inline-flex items-center", className)}>
      <svg
        width="58.96"
        height="14"
        viewBox="0 0 117.92 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="h-3.5 w-auto"
      >
        <path
          d="M0.532 23.7964 7.7 3.9163999999999994H12.152000000000001L19.32 23.7964H15.512L13.86 19.092399999999998H5.992L4.34 23.7964ZM7.056 15.984399999999997H12.796000000000001L9.94 7.584399999999999ZM21.056 23.7964V20.632399999999997H24.416V7.080399999999997H21.224V3.9163999999999994H31.276V7.080399999999997H28.084V20.632399999999997H31.444000000000003V23.7964ZM34.888000000000005 23.7964V3.9163999999999994H48.272000000000006V7.080399999999997H38.528000000000006V12.260399999999999H47.93600000000001V15.396399999999998H38.528000000000006V20.632399999999997H48.496V23.7964ZM55.412000000000006 23.7964Q53.760000000000005 23.7964 52.794000000000004 22.9564Q51.828 22.1164 51.828 20.2684V3.9163999999999994H55.412000000000006V19.9044Q55.412000000000006 21.0244 56.532000000000004 21.0244H57.624V23.7964ZM63.44800000000001 23.7964Q61.79600000000001 23.7964 60.830000000000005 22.9564Q59.864000000000004 22.1164 59.864000000000004 20.2684V3.9163999999999994H63.44800000000001V19.9044Q63.44800000000001 21.0244 64.568 21.0244H65.66V23.7964ZM67.95599999999999 23.7964V8.844399999999998H71.53999999999999V23.7964ZM67.89999999999999 6.856399999999997V3.664399999999997H71.624V6.856399999999997ZM81.676 24.132399999999997Q79.436 24.132399999999997 77.784 23.166399999999996Q76.132 22.2004 75.236 20.4364Q74.34 18.6724 74.34 16.3204Q74.34 13.968399999999999 75.236 12.2044Q76.132 10.440399999999999 77.77000000000001 9.4744Q79.408 8.508399999999998 81.592 8.508399999999998Q83.72 8.508399999999998 85.316 9.460399999999998Q86.912 10.412399999999998 87.79400000000001 12.204399999999998Q88.676 13.996399999999998 88.676 16.516399999999997V17.3284H78.06400000000001Q78.14800000000001 19.2884 79.12800000000001 20.2824Q80.108 21.2764 81.70400000000001 21.2764Q84.14 21.2764 84.81200000000001 19.2044L88.48 19.428399999999996Q87.864 21.612399999999997 86.058 22.8724Q84.25200000000001 24.132399999999997 81.676 24.132399999999997ZM78.06400000000001 14.920399999999999H84.98Q84.84 13.100399999999999 83.93 12.218399999999999Q83.02000000000001 11.336399999999998 81.592 11.336399999999998Q80.13600000000001 11.336399999999998 79.21200000000002 12.260399999999997Q78.28800000000001 13.184399999999998 78.06400000000001 14.920399999999999Z"
          fill="currentColor"
        />
        <rect
          x="97.67"
          y="4.75"
          width="18.5"
          height="18.5"
          rx="3.46053"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <g transform="translate(56.117 7.765) scale(0.45)">
          <path
            d="M106.176 24.2444Q103.74 24.2444 101.948 23.3204Q100.15599999999999 22.3964 99.19 20.702399999999997Q98.22399999999999 19.008399999999998 98.22399999999999 16.684399999999997V3.9163999999999994H101.86399999999999V16.684399999999997Q101.86399999999999 18.812399999999997 102.984 19.946399999999997Q104.104 21.080399999999997 106.176 21.080399999999997Q108.24799999999999 21.080399999999997 109.38199999999999 19.946399999999997Q110.51599999999999 18.812399999999997 110.51599999999999 16.684399999999997V3.9163999999999994H114.15599999999999V16.684399999999997Q114.15599999999999 19.008399999999998 113.17599999999999 20.702399999999997Q112.196 22.3964 110.418 23.3204Q108.64 24.2444 106.176 24.2444ZM117.17999999999999 23.7964V20.632399999999997H120.53999999999999V7.080399999999997H117.348V3.9163999999999994H127.4V7.080399999999997H124.208V20.632399999999997H127.568V23.7964Z"
            fill="currentColor"
          />
        </g>
      </svg>
    </Comp>
  )
}

export function Logo() {
  return (
    <div className="group flex items-center gap-2">
      <LogoIcon role="img" aria-label="Brand logo" />
      <LogoWordmark as="h1" className="text-[1.05rem] font-bold" />
    </div>
  )
}
