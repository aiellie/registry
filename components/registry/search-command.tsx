"use client"

import { SearchIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

import { getItemIcon } from "@/components/registry/item-icons"
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
import { getBlocks, getComponents, getUIPrimitives } from "@/lib/registry"

const gettingStartedItems = [
  { title: "Home", path: "/", icon: "home" },
  { title: "Design Tokens", path: "/tokens", icon: "tokens" },
]

const blockItems = getBlocks()
const componentItems = getComponents()
const uiItems = getUIPrimitives()

export function SearchCommand() {
  const router = useRouter()
  const { state, isMobile, setOpenMobile } = useSidebar()
  const [open, setOpen] = useState(false)

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
      ) : (
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="w-full justify-start gap-2 bg-background font-normal text-muted-foreground shadow-none"
        >
          <HugeiconsIcon icon={SearchIcon} strokeWidth={2} className="size-4" />
          <span>Search...</span>
          <KbdGroup className="ms-auto">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </Button>
      )}

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search Registry"
        description="Search for blocks, components, and UI primitives..."
      >
        <Command>
          <CommandInput placeholder="Search the registry..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup heading="Getting Started">
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
                  {item.title}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading="Blocks">
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
                  {item.title}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading="Components">
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
                  {item.title}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading="UI Primitives">
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
                  {item.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
