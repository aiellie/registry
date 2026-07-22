import { cn } from "@/lib/utils"

type CopyrightProps = {
  holder?: string
  startYear?: number
  className?: string
}

export function Copyright({
  holder = "Aiellie",
  startYear,
  className,
}: CopyrightProps) {
  const year = new Date().getFullYear()
  const range =
    startYear !== undefined && startYear < year
      ? `${startYear}–${year}`
      : `${year}`

  return (
    <p className={cn("text-xs text-muted-foreground", className)}>
      © {range} {holder}
    </p>
  )
}
