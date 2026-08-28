"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRight02Icon,
  Bookmark01Icon,
  Calendar01Icon,
  Camera01Icon,
  Cancel01Icon,
  ChartLineData01Icon,
  CodeIcon,
  Compass01Icon,
  ComputerTerminal01Icon,
  Download01Icon,
  FavouriteIcon,
  Folder01Icon,
  GlobeIcon,
  Home01Icon,
  Image01Icon,
  Link01Icon,
  Mail01Icon,
  Notification01Icon,
  PaintBoardIcon,
  Rocket01Icon,
  Search01Icon,
  SecurityLockIcon,
  Settings01Icon,
  Share01Icon,
  SparklesIcon,
  UserIcon,
  VideoReplayIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { toast } from "@/components/ui/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type Category = "All" | "Interface" | "Media" | "Files" | "Dev"

const CATEGORIES: Category[] = ["All", "Interface", "Media", "Files", "Dev"]

const ICONS: { name: string; icon: IconSvgElement; category: Category }[] = [
  { name: "Home01", icon: Home01Icon, category: "Interface" },
  { name: "Compass01", icon: Compass01Icon, category: "Interface" },
  { name: "Settings01", icon: Settings01Icon, category: "Interface" },
  { name: "User", icon: UserIcon, category: "Interface" },
  { name: "Notification01", icon: Notification01Icon, category: "Interface" },
  { name: "Calendar01", icon: Calendar01Icon, category: "Interface" },
  { name: "Mail01", icon: Mail01Icon, category: "Interface" },
  { name: "Search01", icon: Search01Icon, category: "Interface" },
  { name: "Folder01", icon: Folder01Icon, category: "Files" },
  { name: "Download01", icon: Download01Icon, category: "Files" },
  { name: "Link01", icon: Link01Icon, category: "Files" },
  { name: "SecurityLock", icon: SecurityLockIcon, category: "Files" },
  { name: "Bookmark01", icon: Bookmark01Icon, category: "Files" },
  { name: "Image01", icon: Image01Icon, category: "Media" },
  { name: "Camera01", icon: Camera01Icon, category: "Media" },
  { name: "VideoReplay", icon: VideoReplayIcon, category: "Media" },
  { name: "Share01", icon: Share01Icon, category: "Media" },
  { name: "Favourite", icon: FavouriteIcon, category: "Media" },
  { name: "Code", icon: CodeIcon, category: "Dev" },
  { name: "ComputerTerminal01", icon: ComputerTerminal01Icon, category: "Dev" },
  { name: "Rocket01", icon: Rocket01Icon, category: "Dev" },
  { name: "ChartLineData01", icon: ChartLineData01Icon, category: "Dev" },
  { name: "Globe", icon: GlobeIcon, category: "Dev" },
  { name: "PaintBoard", icon: PaintBoardIcon, category: "Dev" },
  { name: "Sparkles", icon: SparklesIcon, category: "Dev" },
]

export function IconGrid() {
  const [query, setQuery] = React.useState("")
  const [category, setCategory] = React.useState<Category>("All")
  const [selected, setSelected] = React.useState<string | null>(null)
  const { copyToClipboard } = useCopyToClipboard()

  const results = ICONS.filter((item) => {
    const matchesCategory = category === "All" || item.category === category
    const matchesQuery = item.name
      .toLowerCase()
      .includes(query.trim().toLowerCase())
    return matchesCategory && matchesQuery
  })

  const copyImport = async (name: string) => {
    setSelected(name)
    const line = `import { ${name}Icon } from "@hugeicons/core-free-icons"`
    const ok = await copyToClipboard(line)
    toast.add({
      title: ok ? `Copied ${name}Icon import` : "Couldn't reach the clipboard",
      type: ok ? "success" : "error",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Icon Library</CardTitle>
        <CardDescription>Stroke icons on a 24px grid</CardDescription>
        <CardAction>
          <Badge variant="secondary" className="font-mono">
            v4.2
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <InputGroup>
          <InputGroupAddon>
            <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search icons"
            aria-label="Search icons"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query ? (
            <InputGroupAddon align="inline-end">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      aria-label="Clear search"
                      onClick={() => setQuery("")}
                    />
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </TooltipTrigger>
                <TooltipContent>Clear search</TooltipContent>
              </Tooltip>
            </InputGroupAddon>
          ) : null}
        </InputGroup>

        <div className="flex min-w-0 items-center gap-1.5 overflow-hidden">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              aria-pressed={category === item}
            >
              <Badge
                variant={category === item ? "secondary" : "ghost"}
                className={cn(
                  "cursor-pointer",
                  category === item ? "" : "text-muted-foreground"
                )}
              >
                {item}
              </Badge>
            </button>
          ))}
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-6 gap-1.5">
            {results.map((item) => (
              <Tooltip key={item.name}>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={item.name}
                      onClick={() => void copyImport(item.name)}
                      className={cn(
                        "aspect-square size-auto w-full rounded-lg transition-all hover:-translate-y-0.5 hover:bg-muted hover:text-foreground hover:shadow-sm",
                        selected === item.name
                          ? "bg-primary/10 text-primary ring-1 ring-primary/25 ring-inset"
                          : "bg-muted/50 text-muted-foreground"
                      )}
                    />
                  }
                >
                  <HugeiconsIcon
                    icon={item.icon}
                    strokeWidth={2}
                    className="size-4.5"
                  />
                </TooltipTrigger>
                <TooltipContent className="font-mono">
                  {item.name}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        ) : (
          <Empty className="rounded-lg bg-muted/40 py-6">
            <EmptyTitle className="text-sm">No icons found</EmptyTitle>
            <EmptyDescription className="text-xs">
              Nothing matches “{query}”.
            </EmptyDescription>
          </Empty>
        )}

        {selected ? (
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-2.5 py-2">
            <span className="min-w-0 flex-1 truncate font-mono text-[11px]">
              {selected}Icon
            </span>
            <span className="shrink-0 text-[11px] text-muted-foreground">
              copied
            </span>
          </div>
        ) : null}
      </CardContent>

      <CardFooter className="justify-between gap-2">
        <span className="truncate text-xs text-muted-foreground tabular-nums">
          {results.length} of {ICONS.length} shown
        </span>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0"
          nativeButton={false}
          render={<Link href="/icons" />}
        >
          Browse all
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            strokeWidth={2}
            data-icon="inline-end"
            className="rtl:rotate-180"
          />
        </Button>
      </CardFooter>
    </Card>
  )
}
