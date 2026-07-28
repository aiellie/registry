"use client"

import { Icons } from "@/components/icons"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/** A key on `Icons` — which is also how the icon is referenced in JSX. */
export type LocalIconName = keyof typeof Icons

export interface LocalIconGroup {
  title: string
  description: string
  icons: LocalIconName[]
}

/**
 * The marks that are not HugeIcons. They are hand-kept in
 * `components/icons.tsx` because no general icon set carries a vendor's own
 * logo, and because the block viewer needs a glyph per file extension. Several
 * of them are drawn in fixed brand colors, so the tint control does not reach
 * them.
 */
export const LOCAL_GROUPS: LocalIconGroup[] = [
  {
    title: "Brands",
    description:
      "Vendor marks the registry ships with — the package managers in the install tabs, the frameworks underneath, and the providers the auth blocks sign in against.",
    icons: [
      "logo",
      "gitHub",
      "twitter",
      "google",
      "apple",
      "paypal",
      "npm",
      "pnpm",
      "yarn",
      "react",
      "tailwind",
      "radix",
      "aria",
      "v0",
    ],
  },
  {
    title: "Code languages",
    description:
      "File-type glyphs — what `getIconForLanguageExtension` puts beside a filename in the block viewer's tree.",
    icons: [
      "ts",
      "tsx",
      "js",
      "json",
      "css",
      "bash",
      "md",
      "svg",
      "ico",
      "gitignore",
    ],
  },
]

export const LOCAL_ICON_COUNT = LOCAL_GROUPS.reduce(
  (sum, group) => sum + group.icons.length,
  0
)

/** The JSX a consumer would paste for one of these. */
export function localIconSnippet(name: LocalIconName) {
  return `<Icons.${name} className="size-4" />`
}

function LocalIconCell({
  name,
  size,
  onSelect,
}: {
  name: LocalIconName
  size: number
  onSelect: (name: LocalIconName) => void
}) {
  const Icon = Icons[name]

  return (
    <Tooltip>
      <TooltipTrigger
        onClick={() => onSelect(name)}
        className="group flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-transparent p-1.5 transition-colors hover:border-border hover:bg-accent focus-visible:border-border focus-visible:bg-accent focus-visible:outline-none"
      >
        <span className="flex flex-1 items-center justify-center">
          {/* Height alone, so the few non-square marks (`md`, `v0`) keep their
              aspect ratio instead of being squashed into the grid's square. */}
          {/* `--icon-tint` is set by the filter bar; the marks drawn in fixed
              brand colors simply ignore it. */}
          <Icon
            className="text-[color:var(--icon-tint)]"
            style={{ height: size, width: "auto" }}
          />
        </span>
        <span className="w-full truncate text-center text-[10px] leading-none text-muted-foreground group-hover:text-foreground">
          {name}
        </span>
      </TooltipTrigger>
      <TooltipContent className="font-mono">
        {localIconSnippet(name)}
      </TooltipContent>
    </Tooltip>
  )
}

export function LocalIconGrid({
  icons,
  size,
  onSelect,
}: {
  icons: LocalIconName[]
  size: number
  onSelect: (name: LocalIconName) => void
}) {
  return (
    // One provider per grid, matching the HugeIcons grid: the shared delay keeps
    // a tooltip from firing on every icon the pointer crosses on its way past.
    <TooltipProvider delay={300}>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(76px,1fr))] gap-1">
        {icons.map((name) => (
          <LocalIconCell
            key={name}
            name={name}
            size={size}
            onSelect={onSelect}
          />
        ))}
      </div>
    </TooltipProvider>
  )
}
