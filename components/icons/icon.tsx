import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * The single way icons are drawn in this system.
 *
 * HugeIcons ships geometry, not decisions — every call site otherwise repeats
 * `strokeWidth={2}` and picks its own `size-*` and color class. `Icon` fixes
 * the scale (four steps that line up with the type ramp), the stroke weights,
 * and the semantic tones, so an icon looks the same wherever it lands.
 *
 * Glyphs come from `@hugeicons/core-free-icons`; the curated, role-named subset
 * lives in [lib/icons.ts](lib/icons.ts).
 *
 * ```tsx
 * <Icon icon={icon.close} size="sm" tone="muted" label="Close" />
 * ```
 */

const iconVariants = cva("shrink-0", {
  variants: {
    /**
     * Optical scale. `default` (16px) matches body text and every control in
     * `components/ui`; `em` tracks the parent's font size for inline runs.
     */
    size: {
      xs: "size-3",
      sm: "size-3.5",
      default: "size-4",
      md: "size-5",
      lg: "size-6",
      xl: "size-8",
      "2xl": "size-10",
      em: "size-[1em]",
    },
    /**
     * Semantic color. `current` inherits — the right choice inside a button or
     * a badge, which already sets its own foreground.
     */
    tone: {
      current: "text-current",
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
      accent: "text-accent-foreground",
      destructive: "text-destructive",
      success: "text-success",
      warning: "text-warning",
      info: "text-info",
    },
    /** Fill behind the glyph, sized off the icon box. Off by default. */
    surface: {
      none: "",
      muted: "box-content rounded-md bg-muted p-[0.25em]",
      outline: "box-content rounded-md border bg-background p-[0.25em]",
      accent: "box-content rounded-md bg-primary/5 p-[0.25em]",
    },
    /** Mirrors directional glyphs under `dir="rtl"`. */
    flipRtl: {
      true: "rtl:rotate-180",
      false: "",
    },
    /** Continuous rotation, for `icon.loading` and friends. */
    spin: {
      true: "animate-spin",
      false: "",
    },
  },
  defaultVariants: {
    size: "default",
    tone: "current",
    surface: "none",
    flipRtl: false,
    spin: false,
  },
})

/**
 * Stroke weights, as multipliers of the 24px HugeIcons grid. `regular` (2) is
 * the system default and the value the rest of the repo hardcodes.
 */
const iconWeights = {
  thin: 1,
  light: 1.5,
  regular: 2,
  bold: 2.5,
} as const

type IconWeight = keyof typeof iconWeights

interface IconProps
  extends
    Omit<
      React.ComponentProps<typeof HugeiconsIcon>,
      "strokeWidth" | "size" | "color"
    >,
    VariantProps<typeof iconVariants> {
  icon: IconSvgElement
  /** Stroke thickness. Ignore for `strokeWidth` — this keeps the set coherent. */
  weight?: IconWeight
  /**
   * Accessible name. Provide it when the icon is the only content (an icon
   * button, a status marker). Leave it off for icons that sit next to a label —
   * the icon is then hidden from assistive tech, which is what you want.
   */
  label?: string
}

function Icon({
  className,
  icon,
  altIcon,
  showAlt,
  size,
  tone,
  surface,
  flipRtl,
  spin,
  weight = "regular",
  label,
  ...props
}: IconProps) {
  return (
    <HugeiconsIcon
      data-slot="icon"
      icon={icon}
      altIcon={altIcon}
      showAlt={showAlt}
      strokeWidth={iconWeights[weight]}
      className={cn(
        iconVariants({ size, tone, surface, flipRtl, spin, className })
      )}
      {...(label
        ? { role: "img", "aria-label": label }
        : { "aria-hidden": true, focusable: false })}
      {...props}
    />
  )
}

export { Icon, iconVariants, iconWeights, type IconProps, type IconWeight }
