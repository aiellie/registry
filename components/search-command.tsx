"use client"

import { BubbleChatIcon, Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { useSidebar } from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { teams } from "@/lib/sidebar-data"
import { cn } from "@/lib/utils"

const chatItems = teams.flatMap(
  (team) => team.chats?.map((chat) => ({ team: team.name, chat })) ?? []
)

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
  variant?: "header" | "sidebar" | "icon"
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

  const searchButton = (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setOpen(true)}
      className={cn(
        "justify-start gap-2 rounded-xl bg-background font-normal text-muted-foreground shadow-none",
        variant === "sidebar" ? "w-full" : "hidden min-w-56 md:inline-flex"
      )}
    >
      <HugeiconsIcon
        icon={Search01Icon}
        strokeWidth={2}
        className="size-3.5"
      />
      <span>Search...</span>
      <KbdGroup className="ms-auto">
      <Kbd className="border-none text-xs">⌘K</Kbd>
      </KbdGroup>
    </Button>
  )

  const trigger =
    variant === "icon" ? (
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="outline"
              size={collapsed ? "icon-sm" : "icon"}
              aria-label="Search"
              onClick={() => setOpen(true)}
            />
          }
        >
          <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
        </TooltipTrigger>
        <TooltipContent
          side={collapsed ? "right" : "bottom"}
          align="center"
        >
          Search <Kbd>⌘K</Kbd>
        </TooltipContent>
      </Tooltip>
    ) : variant === "header" ? (
      <>
        {searchButton}
        <Button
          variant="ghost"
          size="xs"
          className="text-foreground md:hidden"
          aria-label="Search"
          onClick={() => setOpen(true)}
        >
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={2}
            className="size-5"
          />
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
      searchButton
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
        description="Search navigation and chats..."
      >
        <Command>
          <CommandInput
            placeholder="Search..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            {teams.map((team) => (
              <CommandGroup key={team.name} heading={team.name}>
                {team.groups
                  .flatMap((group) => group.items)
                  .map((item) => (
                    <CommandItem
                      key={item.href}
                      value={`${team.name} ${item.title}`}
                      onSelect={() => run(item.href)}
                    >
                      <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                      <HighlightMatch text={item.title} query={search} />
                      {item.badge && (
                        <CommandShortcut>
                          <Badge
                            variant="secondary"
                            className={cn(item.badge.className)}
                          >
                            {item.badge.text}
                          </Badge>
                        </CommandShortcut>
                      )}
                      {item.kbd && (
                        <CommandShortcut>
                          <Kbd>{item.kbd}</Kbd>
                        </CommandShortcut>
                      )}
                    </CommandItem>
                  ))}
              </CommandGroup>
            ))}

            <CommandGroup heading="Chats">
              {chatItems.map(({ team, chat }) => (
                <CommandItem
                  key={`${team}-${chat.name}`}
                  value={`chat ${team} ${chat.name}`}
                  onSelect={() => run(chat.url)}
                >
                  <HugeiconsIcon icon={BubbleChatIcon} strokeWidth={2} />
                  <HighlightMatch text={chat.name} query={search} />
                  <CommandShortcut>{team}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
