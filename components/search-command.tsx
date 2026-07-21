"use client"

import type { IconSvgElement } from "@hugeicons/react"
import {
  Calendar01Icon,
  Chatting01Icon,
  Frame,
  LibraryIcon,
  Map,
  PieChart,
  PlugIcon,
  Search01Icon,
  WebDesign02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

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
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { useSidebar } from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
interface SearchItem {
  title: string
  href: string
  icon: IconSvgElement
}

const navigationItems: SearchItem[] = [
  { title: "Library", href: "#library", icon: LibraryIcon },
  { title: "Scheduled", href: "#scheduled", icon: Calendar01Icon },
  { title: "Plugins", href: "#plugins", icon: PlugIcon },
  { title: "Sites", href: "#sites", icon: WebDesign02Icon },
]

const projectItems: SearchItem[] = [
  { title: "Design Engineering", href: "#", icon: Frame },
  { title: "Sales & Marketing", href: "#", icon: PieChart },
  { title: "Travel", href: "#", icon: Map },
]

const chatItems: SearchItem[] = [
  { title: "Onboarding flow ideas", href: "#", icon: Chatting01Icon },
  { title: "Q3 roadmap draft", href: "#", icon: Chatting01Icon },
  { title: "Bug triage notes", href: "#", icon: Chatting01Icon },
]

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
  variant = "sidebar",
}: {
  variant?: "header" | "sidebar"
}) {
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
    (href: string) => {
      setOpen(false)
      setSearch("")
      setOpenMobile(false)

      if (href.startsWith("#")) {
        window.location.hash = href.slice(1)
        return
      }

      router.push(href)
    },
    [router, setOpenMobile]
  )

  const trigger =
    variant === "header" ? (
      <>
        <Button
          variant="ghost"
          size="sm"
          className="hidden text-foreground md:inline-flex"
          onClick={() => setOpen(true)}
        >
          <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="size-4" />
          Search
          <KbdGroup className="ms-2">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-foreground md:hidden"
          aria-label="Search"
          onClick={() => setOpen(true)}
        >
          <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="size-5" />
        </Button>
      </>
    ) : collapsed ? (
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Search"
              onClick={() => setOpen(true)}
            />
          }
        >
          <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
        </TooltipTrigger>
        <TooltipContent side="right" align="center">
          Search <Kbd>⌘K</Kbd>
        </TooltipContent>
      </Tooltip>
    ) : (
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="w-full justify-start gap-2 bg-background font-normal text-muted-foreground shadow-none"
      >
        <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="size-4" />
        <span>Search...</span>
        <KbdGroup className="ms-auto">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>
    )

  return (
    <>
      {trigger}

      <CommandDialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) setSearch("")
        }}
        title="Search"
        description="Search navigation, projects, and chats..."
      >
        <Command>
          <CommandInput
            placeholder="Search..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup heading="Navigation">
              {navigationItems.map((item) => (
                <CommandItem
                  key={item.href}
                  value={`navigation-${item.title}`}
                  onSelect={() => run(item.href)}
                >
                  <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                  <HighlightMatch text={item.title} query={search} />
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading="Projects">
              {projectItems.map((item) => (
                <CommandItem
                  key={item.title}
                  value={`project-${item.title}`}
                  onSelect={() => run(item.href)}
                >
                  <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                  <HighlightMatch text={item.title} query={search} />
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading="Chats">
              {chatItems.map((item) => (
                <CommandItem
                  key={item.title}
                  value={`chat-${item.title}`}
                  onSelect={() => run(item.href)}
                >
                  <HugeiconsIcon icon={item.icon} strokeWidth={2} />
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
