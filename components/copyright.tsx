import { cn } from "@/lib/utils"

type CopyrightProps = {
  holder?: string
  startYear?: number
  className?: string
}

export function Copyright({
  holder = "AIEllie.",
  startYear,
  className,
}: CopyrightProps) {
  const year = new Date().getFullYear()
  const range =
    startYear !== undefined && startYear < year
      ? `${startYear}–${year}`
      : `${year}`

  return (
    <p
      className={cn(
        "font-mono text-xs whitespace-nowrap text-muted-foreground",
        className
      )}
    >
      © {range} {holder}
      {/* The tail is the first thing to go when the bar gets narrow. */}
      <span className="hidden sm:inline"> All rights reserved.</span>
    </p>
  )
}
