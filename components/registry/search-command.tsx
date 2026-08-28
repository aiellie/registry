"use client"

import {
  BlocksIcon,
  ComponentIcon,
  FilterIcon,
  Lightbulb,
  PuzzleIcon,
  SearchIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

import { getItemIcon, type SortMode } from "@/lib/items"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { useSidebar } from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getBlocks, getComponents, getUIPrimitives } from "@/lib/registry"

const gettingStartedItems = [
  { title: "Home", path: "/", icon: "home" },
  { title: "Design Tokens", path: "/tokens", icon: "tokens" },
]

const blockItems = getBlocks()
const componentItems = getComponents()
const uiItems = getUIPrimitives()

const SORT_OPTIONS = [
  { value: "type", label: "By type", icon: PuzzleIcon },
  { value: "category", label: "By category", icon: BlocksIcon },
] satisfies { value: SortMode; label: string; icon: IconSvgElement }[]

function SortMenu({
  sort,
  onSortChange,
}: {
  sort: SortMode
  onSortChange: (sort: SortMode) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="icon-sm" aria-label="Sort registry" className="text-muted-foreground hover:text-foreground" />
        }
      >
        <HugeiconsIcon icon={FilterIcon} strokeWidth={2}  />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Sort</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuRadioGroup
          value={sort}
          onValueChange={(next) => onSortChange(next as SortMode)}
        >
          {SORT_OPTIONS.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              <HugeiconsIcon icon={option.icon} strokeWidth={2} />
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function GroupHeading({
  icon,
  title,
}: {
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"]
  title: string
}) {
  return (
    <div className="flex min-w-0 items-center">
      <HugeiconsIcon
        icon={icon}
        strokeWidth={2}
        className="size-3.5 shrink-0"
      />
      <span className="ms-1.5">{title}</span>
    </div>
  )
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
  const trimmed = query.trim()

  if (!trimmed) {
    return <span>{text}</span>
  }

  const index = text.toLowerCase().indexOf(trimmed.toLowerCase())

  if (index === -1) {
    return <span>{text}</span>
  }

  return (
    <span>
      {text.slice(0, index)}
      <mark className="rounded bg-selection font-medium text-selection-foreground">
        {text.slice(index, index + trimmed.length)}
      </mark>
      {text.slice(index + trimmed.length)}
    </span>
  )
}

export function SearchCommand({
  sort,
  onSortChange,
}: {
  sort?: SortMode
  onSortChange?: (sort: SortMode) => void
} = {}) {
  const router = useRouter()
  const { state, isMobile, setOpenMobile } = useSidebar()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const collapsed = state === "collapsed" && !isMobile

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  const run = useCallback(
    (path: string) => {
      setOpen(false)
      setOpenMobile(false)
      router.push(path)
    },
    [router, setOpenMobile]
  )

  return (
    <>
      {collapsed ? (
        <div className="flex flex-col items-center gap-2">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label="Search registry"
                  onClick={() => setOpen(true)}
                />
              }
            >
              <HugeiconsIcon icon={SearchIcon} strokeWidth={2} />
            </TooltipTrigger>
            <TooltipContent side="right" align="center">
              Search registry <Kbd>⌘K</Kbd>
            </TooltipContent>
          </Tooltip>
          {sort != null && onSortChange != null && (
            <SortMenu sort={sort} onSortChange={onSortChange} />
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="default"
            onClick={() => setOpen(true)}
            className="min-w-0 flex-1 justify-start gap-2 rounded-xl bg-background font-normal text-muted-foreground shadow-none"
          >
            <HugeiconsIcon
              icon={SearchIcon}
              strokeWidth={2}
              className="size-4"
            />
            <span>Search...</span>
            <KbdGroup className="ms-auto">
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
          </Button>
          {sort != null && onSortChange != null && (
            <SortMenu sort={sort} onSortChange={onSortChange} />
          )}
        </div>
      )}

      <CommandDialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) setSearch("")
        }}
        title="Search Registry"
        description="Search for blocks, components, and UI primitives..."
      >
        <Command>
          <CommandInput
            placeholder="Search the registry..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup
              heading={
                <GroupHeading icon={Lightbulb} title="Getting Started" />
              }
            >
              {gettingStartedItems.map((item) => (
                <CommandItem
                  key={item.path}
                  value={`getting-started-${item.title}`}
                  onSelect={() => run(item.path)}
                >
                  <HugeiconsIcon
                    icon={getItemIcon(item.icon)}
                    strokeWidth={2}
                  />
                  <HighlightMatch text={item.title} query={search} />
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup
              heading={<GroupHeading icon={BlocksIcon} title="Blocks" />}
            >
              {blockItems.map((item) => (
                <CommandItem
                  key={item.name}
                  value={`block-${item.title}`}
                  onSelect={() => run(`/registry/${item.name}`)}
                >
                  <HugeiconsIcon
                    icon={getItemIcon(item.name)}
                    strokeWidth={2}
                  />
                  <HighlightMatch text={item.title} query={search} />
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup
              heading={<GroupHeading icon={ComponentIcon} title="Components" />}
            >
              {componentItems.map((item) => (
                <CommandItem
                  key={item.name}
                  value={`component-${item.title}`}
                  onSelect={() => run(`/registry/${item.name}`)}
                >
                  <HugeiconsIcon
                    icon={getItemIcon(item.name)}
                    strokeWidth={2}
                  />
                  <HighlightMatch text={item.title} query={search} />
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup
              heading={<GroupHeading icon={PuzzleIcon} title="UI Primitives" />}
            >
              {uiItems.map((item) => (
                <CommandItem
                  key={item.name}
                  value={`ui-${item.title}`}
                  onSelect={() => run(`/registry/${item.name}`)}
                >
                  <HugeiconsIcon
                    icon={getItemIcon(item.name)}
                    strokeWidth={2}
                  />
                  <HighlightMatch text={item.title} query={search} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
